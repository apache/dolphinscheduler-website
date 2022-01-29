# 安全中心

* 安全中心有队列管理、租户管理、用户管理、告警组管理、worker分组管理、令牌管理等功能
* 安全中心在用户管理模块可以对资源、数据源、项目等授权
* 管理员默认设置为：admin/dolphinscheduler123

## 创建队列

- 执行spark、mapreduce等程序，需要“创建队列”
- 管理员进入安全中心->队列管理页面，点击“创建队列”按钮，创建队列。
<p align="center">
  <img src="/img/create-queue.png" width="80%" />
</p>

## 添加租户

- 租户是在Linux下用于worker提交作业所使用的用户。修改 `worker.properties` 配置文件 `worker.tenant.auto.create=true` 实现自动创建
`worker.tenant.auto.create=true` 免密运行 `sudo` 命令
- 租户编码：**租户编码是Linux上的用户，唯一，不能重复**
- 管理员进入安全中心->租户管理页面，点击“创建租户”按钮，创建租户。

 <p align="center">
    <img src="/img/addtenant.png" width="80%" />
  </p>

## 创建普通用户

-  用户为**管理员用户**和**普通用户**

    * 管理员有授权和用户管理等权限，没有创建项目和工作流定义的操作的权限。
    * 普通用户可以创建项目和对工作流定义的创建，编辑，执行等操作。
    * 注意：如果该用户切换了租户，则该用户所在租户下所有资源将复制到切换的新租户下。

- 进入安全中心->用户管理页面，点击“创建用户”按钮，创建用户。        
<p align="center">
   <img src="/img/useredit2.png" width="80%" />
 </p>

### 编辑用户信息

- 管理员进入安全中心->用户管理页面，点击"编辑"按钮，编辑用户信息。
- 普通用户登录后，点击用户名下拉框中的用户信息，进入用户信息页面，点击"编辑"按钮，编辑用户信息。

### 修改用户密码

- 管理员进入安全中心->用户管理页面，点击"编辑"按钮，编辑用户信息时，输入新密码修改用户密码。
- 普通用户登录后，点击用户名下拉框中的用户信息，进入修改密码页面，输入密码并确认密码后点击"编辑"按钮，则修改密码成功。


## 创建告警组

* 告警组是在启动时设置的参数，在流程结束以后会将流程的状态和其他信息以邮件形式发送给告警组。
* 管理员进入安全中心->告警组管理页面，点击“创建告警组”按钮，创建告警组。

  <p align="center">
    <img src="/img/mail_edit.png" width="80%" />
  </p>


## 令牌管理

> 由于后端接口有登录检查，令牌管理提供了一种可以通过调用接口的方式对系统进行各种操作。
- 管理员进入安全中心->令牌管理页面，点击“创建令牌”按钮，选择失效时间与用户，点击"生成令牌"按钮，点击"提交"按钮，则选择用户的token创建成功。

  <p align="center">
      <img src="/img/creat_token.png" width="80%" />
   </p>

- 普通用户登录后，点击用户名下拉框中用户信息，进入令牌管理页面，选择失效时间，点击"生成令牌"按钮，点击"提交"按钮，则该用户创建token成功。

- 调用示例：

```java
    /**
     * test token
     */
    public  void doPOSTParam()throws Exception{
        // create HttpClient
        CloseableHttpClient httpclient = HttpClients.createDefault();

        // create http post request
        HttpPost httpPost = new HttpPost("http://127.0.0.1:12345/escheduler/projects/create");
        httpPost.setHeader("token", "123");
        // set parameters
        List<NameValuePair> parameters = new ArrayList<NameValuePair>();
        parameters.add(new BasicNameValuePair("projectName", "qzw"));
        parameters.add(new BasicNameValuePair("desc", "qzw"));
        UrlEncodedFormEntity formEntity = new UrlEncodedFormEntity(parameters);
        httpPost.setEntity(formEntity);
        CloseableHttpResponse response = null;
        try {
            // execute
            response = httpclient.execute(httpPost);
            // response status code 200
            if (response.getStatusLine().getStatusCode() == 200) {
                String content = EntityUtils.toString(response.getEntity(), "UTF-8");
                System.out.println(content);
            }
        } finally {
            if (response != null) {
                response.close();
            }
            httpclient.close();
        }
    }
```

## 授予权限

* 授予权限包括项目权限，资源权限，数据源权限，UDF函数权限。
* 管理员可以对普通用户进行非其创建的项目、资源、数据源和UDF函数进行授权。因为项目、资源、数据源和UDF函数授权方式都是一样的，所以以项目授权为例介绍。
* 注意：对于用户自己创建的项目，该用户拥有所有的权限。则项目列表和已选项目列表中不会显示。

- 管理员进入安全中心->用户管理页面，点击需授权用户的“授权”按钮，如下图所示：
  <p align="center">
   <img src="/img/auth_user.png" width="80%" />
 </p>

- 选择项目，进行项目授权。

<p align="center">
   <img src="/img/auth_project.png" width="80%" />
 </p>

- 资源、数据源、UDF函数授权同项目授权。

## Worker分组

每个worker节点都会归属于自己的Worker分组,默认分组为default.

在任务执行时,可以将任务分配给指定worker分组，最终由该组中的worker节点执行该任务.

> 新增/更新 worker分组

- 打开要设置分组的worker节点上的"conf/worker.properties"配置文件. 修改worker.groups参数.
- worker.groups参数后面对应的为该worker节点对应的分组名称,默认为default.
- 如果该worker节点对应多个分组,则以逗号隔开.

```conf
示例:
worker.groups=default,test
```

- 也可以在运行中修改worker所属的worker分组，如果修改成功，worker就会使用这个新建的分组，忽略`worker.properties`中的配置。修改步骤为"安全中心 -> worker分组管理 -> 点击 '新建worker分组' -> 输入'组名称' -> 选择已有worker -> 点击'提交'"

## 环境管理

* 在线配置Worker运行环境，一个Worker可以指定多个环境，每个环境等价于dolphinscheduler_env.sh文件.

* 默认环境为dolphinscheduler_env.sh文件.

* 在任务执行时,可以将任务分配给指定worker分组，根据worker分组选择对应的环境，最终由该组中的worker节点执行环境后执行该任务.

> 创建/更新 环境

- 环境配置等价于dolphinscheduler_env.sh文件内配置

  <p align="center">
      <img src="/img/create-environment.png" width="80%" />
  </p>

> 使用 环境

- 在工作流定义中创建任务节点选择Worker分组和Worker分组对应的环境，任务执行时Worker会先执行环境在执行任务.

    <p align="center">
        <img src="/img/use-environment.png" width="80%" />
    </p>
