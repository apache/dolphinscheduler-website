[Apache DolphinScheduler](https://dolphinscheduler.apache.org/zh-cn/docs/3.1.2/guide/upgrade/upgrade)
**查看官方的升级文档，可知有提供升级脚本，如果只是跨小版本的更新那么只用执行脚本就好了，但跨多个大版本升级时依然容易出现各种问题，特此总结。**

旧版本：1.3.4
新版本：3.1.2

## 1. 升级完成后使用资源中心报错 IllegalArgumentException: Failed to specify server's Kerberos principal name
资源中心使用的HDFS，开启了kerberos认证

#### 解决方法：
编辑 dolphinscheduler/api-server/conf/hdfs-site.xml 添加以下内容
```xml
<property>
    <name>dfs.namenode.kerberos.principal.pattern</name>
    <value>*</value>
</property>
```
## 2. 升级完成后查看任务实例的日志，报错未找到日志
**查看报错信息，检查新版本的目录结构和表里的日志路径，发现原因是新版本的日志路径有变更**
**升级前的日志路径在 /logs/ 下**
**升级后的日志路径在 /worker-server/logs/ 下**
**因此需要修改这里的目录**
#### 解决方法：
执行sql修改日志路径
```sql
update t_ds_task_instance set log_path=replace(log_path,'/logs/','/worker-server/logs/');
```
然后将原日志文件copy到新的日志路径
```sql
cp -r {旧版本dolphinscheduler目录}/logs/[1-9]* {新版本dolphinscheduler目录}/worker-server/logs/*
```
## 3.升级完成后创建工作流报错
查看报错信息，原因是 t_ds_process_definition_log 和 t_ds_process_definition 主键的初始值不一致
那么修改成一致的就好
#### 解决方法：
执行sql
```sql
# 查出主键自增值
select AUTO_INCREMENT FROM information_schema.TABLES WHERE TABLE_SCHEMA = 'dolphinscheduler' AND TABLE_NAME = 't_ds_process_definition' limit 1
# 将上面sql的执行结果填写到下方参数处执行
alter table dolphinscheduler_bak1.t_ds_process_definition_log auto_increment = {max_id};
```
## 4.升级后任务实例列表为空
检查查询的sql
在`dolphinscheduler-dao/src/main/resources/org/apache/dolphinscheduler/dao/mapper/TaskInstanceMapper.xml`文件里，select id="queryTaskInstanceListPaging"的sql
```sql
		select
        <include refid="baseSqlV2">
            <property name="alias" value="instance"/>
        </include>
        ,
        process.name as process_instance_name
        from t_ds_task_instance instance
        left join t_ds_task_definition_log define on define.code=instance.task_code and define.version=instance.task_definition_version
        left join t_ds_process_instance process on process.id=instance.process_instance_id
        where define.project_code = #{projectCode}
        <if test="startTime != null">
            and instance.start_time <![CDATA[ >=]]> #{startTime}
        </if>
		......省略多余部分
```
**查询任务实例列表的sql会关联 t_ds_task_definition_log 表，经检查发现是 define.code=instance.task_code 这一句关联不上。
结合下面的查询条件 define.project_code = #{projectCode} 可知，关联t_ds_task_definition_log 主要是为了过滤 projectCode，那么来修改下这个sql**
#### 解决方法：
```sql
    	select
        <include refid="baseSqlV2">
            <property name="alias" value="instance"/>
        </include>
        ,
        process.name as process_instance_name
        from t_ds_task_instance instance
--         left join t_ds_task_definition_log define 
--				on define.code=instance.task_code and 
--					define.version=instance.task_definition_version
        join t_ds_process_instance process
        	on process.id=instance.process_instance_id
        join t_ds_process_definition define
        	on define.code=process.process_definition_code
        where define.project_code = #{projectCode}
        <if test="startTime != null">
            and instance.start_time <![CDATA[ >=]]> #{startTime}
        </if>
		......省略多余部分
```
**直接用 t_ds_process_definition 关联，也有project_code字段可以用来关联过滤**
**这里修改后就能查出数据了**

## 5. 执行升级脚本的过程中报错空指针
### 5.1分析日志，定位到 UpgradeDao.java 517行
查看代码
```java
513 if (TASK_TYPE_SUB_PROCESS.equals(taskType)) {
514                       JsonNode jsonNodeDefinitionId = param.get("processDefinitionId");
515                       if (jsonNodeDefinitionId != null) {
516                           param.put("processDefinitionCode",
517                                  processDefinitionMap.get(jsonNodeDefinitionId.asInt()).getCode());
518                            param.remove("processDefinitionId");
519                        }
520                    }
```
**很明显是** `processDefinitionMap.get(jsonNodeDefinitionId.asInt())`** 返回了null,加个null判断，如果返回null直接跳过，并将相关信息打印出来，升级结束后可以根据日志核对。**
#### 解决方法：
修改后
```java
if (jsonNodeDefinitionId != null) {
    if (processDefinitionMap.get(jsonNodeDefinitionId.asInt()) != null) {
        param.put("processDefinitionCode",processDefinitionMap.get(jsonNodeDefinitionId.asInt()).getCode());
        param.remove("processDefinitionId");
    } else {
        logger.error("*******************error");
        logger.error("*******************param:" + param);
        logger.error("*******************jsonNodeDefinitionId:" + jsonNodeDefinitionId);
    }
}
```

### 5.2分析日志，定位到 UpgradeDao.java 675行
查看代码
```java
669 if (mapEntry.isPresent()) {
670                            Map.Entry<Long, Map<String, Long>> processCodeTaskNameCodeEntry = mapEntry.get();
671                            dependItem.put("definitionCode", processCodeTaskNameCodeEntry.getKey());
672                            String depTasks = dependItem.get("depTasks").asText();
673                            long taskCode =
674                                    "ALL".equals(depTasks) || processCodeTaskNameCodeEntry.getValue() == null ? 0L
675                                            : processCodeTaskNameCodeEntry.getValue().get(depTasks);
676                            dependItem.put("depTaskCode", taskCode);
677                        }
```
很明显是**processCodeTaskNameCodeEntry.getValue().get(depTasks)** 返回了null.
修改下逻辑，不为null才赋值并打印相关日志
#### 解决方法：
修改后
```java
long taskCode =0;
                            if (processCodeTaskNameCodeEntry.getValue() != null
                                    &&processCodeTaskNameCodeEntry.getValue().get(depTasks)!=null){
                                taskCode =processCodeTaskNameCodeEntry.getValue().get(depTasks);
                            }else{
                                logger.error("******************** depTasks:"+depTasks);
                                logger.error("******************** taskCode not in "+JSONUtils.toJsonString(processCodeTaskNameCodeEntry));
                            }
                            dependItem.put("depTaskCode", taskCode);
```
## 6.接入LDAP后登陆失败，不知道email字段名
可在 api-server/conf/application.yaml 配置接入LDAP
```yaml
security:
  authentication:
    # Authentication types (supported types: PASSWORD,LDAP)
    type: LDAP
    # IF you set type `LDAP`, below config will be effective
    ldap:
      # ldap server config
      urls: xxx
      base-dn: xxx
      username: xxx
      password: xxx
      user:
        # admin userId when you use LDAP login
        admin: xxx
        identity-attribute: xxx
        email-attribute: xxx
        # action when ldap user is not exist (supported types: CREATE,DENY)
        not-exist-action: CREATE
```
**要成功接入LDAP至少需要urls,base-dn,username,password,identity和email 正确填写，不知道email字段名可以按下面的方式处理，email先空着**
**启动服务后用LDAP用户登录**
#### 解决办法：
** LDAP 认证的代码在 dolphinscheduler-api/src/main/java/org/apache/dolphinscheduler/api/security/impl/ldap/LdapService.java 的 ldapLogin()**

```java
ctx = new InitialLdapContext(searchEnv, null);
SearchControls sc = new SearchControls();
sc.setReturningAttributes(new String[]{ldapEmailAttribute});
sc.setSearchScope(SearchControls.SUBTREE_SCOPE);
EqualsFilter filter = new EqualsFilter(ldapUserIdentifyingAttribute, userId);
NamingEnumeration<SearchResult> results = ctx.search(ldapBaseDn, filter.toString(), sc);
if (results.hasMore()) {
    // get the users DN (distinguishedName) from the result
    SearchResult result = results.next();
    NamingEnumeration<? extends Attribute> attrs = result.getAttributes().getAll();
    while (attrs.hasMore()) {
        // Open another connection to the LDAP server with the found DN and the password
        searchEnv.put(Context.SECURITY_PRINCIPAL, result.getNameInNamespace());
        searchEnv.put(Context.SECURITY_CREDENTIALS, userPwd);
        try {
            new InitialDirContext(searchEnv);
        } catch (Exception e) {
            logger.warn("invalid ldap credentials or ldap search error", e);
            return null;
        }
        Attribute attr = attrs.next();
        if (attr.getID().equals(ldapEmailAttribute)) {
            return (String) attr.get();
        }
    }
}
```

第三行会根据填的字段过滤，先注释第三行
```java
// sc.setReturningAttributes(new String[]{ldapEmailAttribute});
```
重新执行后第10行会返回全部字段
```java
NamingEnumeration<? extends Attribute> attrs = result.getAttributes().getAll();
```
通过打印或调试在里面找到email字段填到配置文件里，再还原上面注释的代码，重启服务后即可正常接入LDAP登录。
## 7.管理员给普通用户授权资源文件不生效
**经多次测试,发现普通用户只能看到所属用户为自己的资源文件，管理员授权后依然无法查看资源文件**

#### 解决办法:
**文件 `dolphinscheduler-api/src/main/java/org/apache/dolphinscheduler/api/permission/ResourcePermissionCheckServiceImpl.java`的`listAuthorizedResource()`方法,将 return 的集合修改为 relationResources**

```java
@Override
        public Set<Integer> listAuthorizedResource(int userId, Logger logger) {
            List<Resource> relationResources;
            if (userId == 0) {
                relationResources = new ArrayList<>();
            } else {
                // query resource relation
                List<Integer> resIds = resourceUserMapper.queryResourcesIdListByUserIdAndPerm(userId, 0);
                relationResources = CollectionUtils.isEmpty(resIds) ? new ArrayList<>() : resourceMapper.queryResourceListById(resIds);
            }
            List<Resource> ownResourceList = resourceMapper.queryResourceListAuthored(userId, -1);
            relationResources.addAll(ownResourceList);
            return relationResources.stream().map(Resource::getId).collect(toSet()); // 解决资源文件授权无效的问题
//            return ownResourceList.stream().map(Resource::getId).collect(toSet());
        }
```
检查新版本的change log ，发现在3.1.3版本修复了这个bug
https://github.com/apache/dolphinscheduler/pull/13318
## 8.kerberos过期的问题
因为kerberos配置了票据过期时间，一段时间后资源中心的hdfs资源将无法访问，最好的解决办法是添加定时更新凭证的相关逻辑
#### 解决办法:
在文件 dolphinscheduler-service/src/main/java/org/apache/dolphinscheduler/service/utils/CommonUtils.java 添加方法
```java
 /**
     * * 定时更新凭证
     */
    private static void startCheckKeytabTgtAndReloginJob() {
        // 每天循环，定时更新凭证
        Executors.newScheduledThreadPool(1).scheduleWithFixedDelay(() -> {
            try {
                UserGroupInformation.getLoginUser().checkTGTAndReloginFromKeytab();
                logger.warn("Check Kerberos Tgt And Relogin From Keytab Finish.");
            } catch (IOException e) {
                logger.error("Check Kerberos Tgt And Relogin From Keytab Error", e);
            }
        }, 0, 1, TimeUnit.DAYS);
        logger.info("Start Check Keytab TGT And Relogin Job Success.");
    }
```
然后在该文件的`loadKerberosConf` 方法返回 true 前调用
```java
public static boolean loadKerberosConf(String javaSecurityKrb5Conf, String loginUserKeytabUsername,
                                           String loginUserKeytabPath, Configuration configuration) throws IOException {
        if (CommonUtils.getKerberosStartupState()) {
            System.setProperty(Constants.JAVA_SECURITY_KRB5_CONF, StringUtils.defaultIfBlank(javaSecurityKrb5Conf,
                    PropertyUtils.getString(Constants.JAVA_SECURITY_KRB5_CONF_PATH)));
            configuration.set(Constants.HADOOP_SECURITY_AUTHENTICATION, Constants.KERBEROS);
            UserGroupInformation.setConfiguration(configuration);
            UserGroupInformation.loginUserFromKeytab(
                    StringUtils.defaultIfBlank(loginUserKeytabUsername,
                            PropertyUtils.getString(Constants.LOGIN_USER_KEY_TAB_USERNAME)),
                    StringUtils.defaultIfBlank(loginUserKeytabPath,
                            PropertyUtils.getString(Constants.LOGIN_USER_KEY_TAB_PATH)));
            startCheckKeytabTgtAndReloginJob();  // 此处调用
            return true;
        }
        return false;
    }
```