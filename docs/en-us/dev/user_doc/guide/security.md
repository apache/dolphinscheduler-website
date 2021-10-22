
# Security

* Only the administrator account in the security center has the authority to operate. It has functions such as queue management, tenant management, user management, alarm group management, worker group management, token management, etc. In the user management module, resources, data sources, projects, etc. Authorization
* Administrator login, default user name and password: admin/dolphinscheduler123

## Create queue

- Queue is used when the "queue" parameter is needed to execute programs such as spark and mapreduce.
- The administrator enters the Security Center->Queue Management page and clicks the "Create Queue" button to create a queue.
<p align="center">
   <img src="/img/create-queue-en.png" width="80%" />
 </p>

## Add tenant

- The tenant corresponds to the Linux user, which is used by the worker to submit the job. If Linux does not have this user, the worker will create this user when executing the script.
- Tenant Code: **Tenant Code is the only user on Linux and cannot be repeated**
- The administrator enters the Security Center->Tenant Management page and clicks the "Create Tenant" button to create a tenant.

 <p align="center">
    <img src="/img/addtenant-en.png" width="80%" />
  </p>

## Create normal user

- Users are divided into **administrator users** and **normal users**

  - The administrator has authorization and user management authority, but does not have the authority to create project and workflow definition operations.
  - Ordinary users can create projects and create, edit, and execute workflow definitions.
  - Note: If the user switches tenants, all resources under the tenant where the user belongs will be copied to the new tenant that is switched.

- The administrator enters the Security Center -> User Management page and clicks the "Create User" button to create a user.
<p align="center">
   <img src="/img/user-en.png" width="80%" />
 </p>

> **Edit user information**

- The administrator enters the Security Center->User Management page and clicks the "Edit" button to edit user information.
- After an ordinary user logs in, click the user information in the user name drop-down box to enter the user information page, and click the "Edit" button to edit the user information.

> **Modify user password**

- The administrator enters the Security Center->User Management page and clicks the "Edit" button. When editing user information, enter the new password to modify the user password.
- After a normal user logs in, click the user information in the user name drop-down box to enter the password modification page, enter the password and confirm the password and click the "Edit" button, then the password modification is successful.

## Create alarm group

- The alarm group is a parameter set at startup. After the process ends, the status of the process and other information will be sent to the alarm group in the form of email.

* The administrator enters the Security Center -> Alarm Group Management page and clicks the "Create Alarm Group" button to create an alarm group.

  <p align="center">
    <img src="/img/mail-en.png" width="80%" />

## Token management

> Since the back-end interface has login check, token management provides a way to perform various operations on the system by calling the interface.

- The administrator enters the Security Center -> Token Management page, clicks the "Create Token" button, selects the expiration time and user, clicks the "Generate Token" button, and clicks the "Submit" button, then the selected user's token is created successfully.

  <p align="center">
      <img src="/img/create-token-en.png" width="80%" />
   </p>

- After an ordinary user logs in, click the user information in the user name drop-down box, enter the token management page, select the expiration time, click the "generate token" button, and click the "submit" button, then the user creates a token successfully.
- Call example:

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

## Granted permission

    * Granted permissions include project permissions, resource permissions, data source permissions, UDF function permissions.
    * The administrator can authorize the projects, resources, data sources and UDF functions not created by ordinary users. Because the authorization methods for projects, resources, data sources and UDF functions are the same, we take project authorization as an example.
    * Note: For projects created by users themselves, the user has all permissions. The project list and the selected project list will not be displayed.

- The administrator enters the Security Center -> User Management page and clicks the "Authorize" button of the user who needs to be authorized, as shown in the figure below:
 <p align="center">
  <img src="/img/auth-en.png" width="80%" />
</p>

- Select the project to authorize the project.

<p align="center">
   <img src="/img/authproject-en.png" width="80%" />
 </p>

- Resources, data sources, and UDF function authorization are the same as project authorization.

## Worker grouping

Each worker node will belong to its own worker group, and the default group is "default".

When the task is executed, the task can be assigned to the specified worker group, and the task will be executed by the worker node in the group.

> Add/Update worker group

- Open the "conf/worker.properties" configuration file on the worker node where you want to set the groups, and modify the "worker.groups" parameter
- The "worker.groups" parameter is followed by the name of the group corresponding to the worker node, which is “default”.
- If the worker node corresponds to more than one group, they are separated by commas

```conf
worker.groups=default,test
```

## Environmental Management

* Configure the Worker operating environment online. A Worker can specify multiple environments, and each environment is equivalent to the dolphinscheduler_env.sh file.

* The default environment is the dolphinscheduler_env.sh file.

* When the task is executed, the task can be assigned to the designated worker group, and the corresponding environment can be selected according to the worker group. Finally, the worker node executes the environment first and then executes the task.

> Add/Update environment

- The environment configuration is equivalent to the configuration in the dolphinscheduler_env.sh file.

  <p align="center">
      <img src="/img/create-environment.png" width="80%" />
  </p>

> Use environment

- Create a task node in the workflow definition and select the environment corresponding to the Worker group and the Worker group. When the task is executed, the Worker will execute the environment first before executing the task.

    <p align="center">
        <img src="/img/use-environment.png" width="80%" />
    </p>