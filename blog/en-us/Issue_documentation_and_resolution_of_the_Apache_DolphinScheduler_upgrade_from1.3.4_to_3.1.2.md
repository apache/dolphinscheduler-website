[Apache DolphinScheduler](https://dolphinscheduler.apache.org/zh-cn/docs/3.1.2/guide/upgrade/upgrade)
**By referring to the official upgrade documentation, it is known that upgrade scripts are provided. If it is a minor version upgrade, executing the script should suffice. However, when upgrading across multiple major versions, various issues can still arise. Therefore, a summary of these issues is provided.**

old version：1.3.4
new version：3.1.2

## 1. Error "IllegalArgumentException: Failed to specify server's Kerberos principal name" when using Resource Center after the upgrade
The Resource Center is configured to use HDFS with Kerberos authentication enabled.

#### Solution:
Edit `dolphinscheduler/api-server/conf/hdfs-site.xml` and add the following content:
```xml
<property>
    <name>dfs.namenode.kerberos.principal.pattern</name>
    <value>*</value>
</property>
```

## 2. Error "Log not found" when viewing task instance logs after the upgrade
**Upon checking the error message and comparing the directory structure and log paths in the new version, it is found that the log path has been changed in the new version.**
**The old log path was located under `/logs/`, while the new log path is `/worker-server/logs/`.**
**Therefore, the directory needs to be modified accordingly.**

#### Solution:
Execute the following SQL statement to modify the log path:
```sql
update t_ds_task_instance set log_path=replace(log_path,'/logs/','/worker-server/logs/');
```
Then, copy the original log files to the new log path:
```sql
cp -r {old_dolphinscheduler_directory}/logs/[1-9]* {new_dolphinscheduler_directory}/worker-server/logs/*
```

## 3. Error when creating workflows after the upgrade
Upon checking the error message, it is found that the initial values of the primary keys for `t_ds_process_definition_log` and `t_ds_process_definition` are inconsistent.
To resolve this, the primary keys need to be made consistent.

#### Solution:
Execute the following SQL statement:
```sql
# Retrieve the auto-increment value of the primary key
select AUTO_INCREMENT FROM information_schema.TABLES WHERE TABLE_SCHEMA = 'dolphinscheduler' AND TABLE_NAME = 't_ds_process_definition' limit 1

# Replace {max_id} with the above result and execute the statement
alter table dolphinscheduler_bak1.t_ds_process_definition_log auto_increment = {max_id};
```

## 4. Task instance list is empty after the upgrade
Check the SQL query in `dolphinscheduler-dao/src/main/resources/org/apache/dolphinscheduler/dao/mapper/TaskInstanceMapper.xml` file under the select id="queryTaskInstanceListPaging" section.
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
		......Omitting redundant code
```
**The SQL query for querying the task instance list is associated with the `t_ds_task_definition_log` table. After inspection, it was found that the join condition `define.code = instance.task_code` cannot be matched.**
**Considering the query condition `define.project_code = #{projectCode}`, it can be inferred that the purpose of joining the `t_ds_task_definition_log` table is mainly to filter by `projectCode`. Let's modify the SQL accordingly.**
#### Solution:
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
		......Omitting redundant code
```
**Modify the SQL query to directly use the `t_ds_process_definition` table for the association, as it also has the `project_code` field for filtering.**

## 5. NullPointerException during the execution of the upgrade script
### 5.1 Analysis of the logs led to line 517 in UpgradeDao.java

```java
513                     if (TASK_TYPE_SUB_PROCESS.equals(taskType)) {
514                       JsonNode jsonNodeDefinitionId = param.get("processDefinitionId");
515                       if (jsonNodeDefinitionId != null) {
516                           param.put("processDefinitionCode",
517                                  processDefinitionMap.get(jsonNodeDefinitionId.asInt()).getCode());
518                            param.remove("processDefinitionId");
519                        }
520                     }
```

**Upon examining the code, it is evident that `processDefinitionMap.get(jsonNodeDefinitionId.asInt())` returns null. Add a null check to skip the null value and print the relevant information for verification after the upgrade.**

#### Solution:
After modification:
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

### 5.2 Analysis of the logs led to line 675 in UpgradeDao.java
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
Upon examining the code, it is evident that `processCodeTaskNameCodeEntry.getValue().get(depTasks)` returns null. Modify the logic to assign a value and print the relevant log only if it is not null.

#### Solution:
After modification:
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
## 6. Login failure after integrating LDAP, unknown field name for email
LDAP integration can be configured in `api-server/conf/application.yaml`.
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
**To successfully integrate LDAP, the following fields need to be correctly filled in the configuration: `urls`, `base-dn`, `username`, `password`, `identity`, and `email`. If the email field name is unknown, follow the steps below, leaving the email field empty for now:**
**Start the service and attempt to log in with an LDAP user.**
#### Solution:
** The LDAP authentication code is located in `dolphinscheduler-api/src/main/java/org/apache/dolphinscheduler/api/security/impl/ldap/LdapService.java` under the `ldapLogin()` method.**

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

Comment out the 3 line that filters based on the field filled.
```java
// sc.setReturningAttributes(new String[]{ldapEmailAttribute});
```
After executing, the 10 line will return all fields.
```java
NamingEnumeration<? extends Attribute> attrs = result.getAttributes().getAll();
```
Find the email field through printing or debugging and fill it in the configuration file.
Uncomment the previously commented line of code.
Restart the service to enable successful LDAP integration and login.

## 7. Authorization of resource files by administrators for ordinary users does not take effect
After multiple tests, it was found that ordinary users can only see resource files that belong to them, even after being granted authorization by administrators.

#### Solution:
**Modify the `listAuthorizedResource()` method in the file `dolphinscheduler-api/src/main/java/org/apache/dolphinscheduler/api/permission/ResourcePermissionCheckServiceImpl.java` to return `relationResources` instead of the current collection.**
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
            return relationResources.stream().map(Resource::getId).collect(toSet()); // Resolve the issue of invalid resource file authorization.
//            return ownResourceList.stream().map(Resource::getId).collect(toSet());
        }
```
Check the change log of the new version and find that this bug has been fixed in version 3.1.3.
https://github.com/apache/dolphinscheduler/pull/13318
## 8.Kerberos expiration issue.
Due to the expiration time set in the Kerberos configuration, the HDFS resources in the Resource Center will become inaccessible after a certain period of time. The best solution is to add relevant logic for scheduled credential update.
#### Solution:
Add a method in the file `dolphinscheduler-service/src/main/java/org/apache/dolphinscheduler/service/utils/CommonUtils.java`.```java
 ```java
    /**
     * * Scheduled credential update.
     */
    private static void startCheckKeytabTgtAndReloginJob() {
        // Daily loop, scheduled credential update.
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
Then, call it before the `loadKerberosConf` method in that file returns true.
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
            startCheckKeytabTgtAndReloginJob();  // call here
            return true;
        }
        return false;
    }
```