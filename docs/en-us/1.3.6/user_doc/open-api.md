# Open API

## Background
Generally, projects and processes are created through pages, but integration with third-party systems requires API calls to manage projects and workflows.

## Flink Calls Operating steps

### Create queue

1. Log in to the scheduling system, click "Security", then click "Queue manage" on the left, and click "Create queue" to create a queue.
2. Fill in the name and value of queue, and click "Submit" 

<p align="center">
   <img src="/img/api/create_queue.png" width="80%" />
 </p>



### Create tenant 

```
1.The tenant corresponds to a Linux user, which the user worker uses to submit jobs. If Linux OS environment does not have this user, the worker will create this user when executing the script.
2.Both the tenant and the tenant code are unique and cannot be repeated, just like a person has a name and id number.  
3.After creating a tenant, there will be a folder in the HDFS relevant directory.  
```

<p align="center">
   <img src="/img/api/create_tenant.png" width="80%" />
 </p>



### Create user

<p align="center">
   <img src="/img/api/create_user.png" width="80%" />
 </p>



### Create token

1. Log in to the scheduling system, click "Security", then click "Token manage" on the left, and click "Create token" to create a token.

<p align="center">
   <img src="/img/token-management-en.png" width="80%" />
 </p>

2. Select the "Expiration time" (Token validity), select "User" (to perform the API operation with the specified user), click "Generate token", copy the Token string, and click "Submit"

<p align="center">
   <img src="/img/create-token-en1.png" width="80%" />
 </p>

### Use token
1. Open the API documentation page
   
    > Address：http://{api server ip}:12345/dolphinscheduler/doc.html?language=en_US&lang=en
<p align="center">
   <img src="/img/api-documentation-en.png" width="80%" />
 </p>

2. select a test API, the API selected for this test: queryAllProjectList
    > projects/query-project-list
    >                                                                     >
3. Open Postman, fill in the API address, and enter the Token in Headers, and then send the request to view the result
    ```
    token:The Token just generated
    ```
<p align="center">
   <img src="/img/test-api.png" width="80%" />
 </p>  


### User authorization

<p align="center">
   <img src="/img/api/user_authorization.png" width="80%" />
 </p>



### User login

```
http://192.168.1.163:12345/dolphinscheduler/ui/#/monitor/servers/master
```

<p align="center">
   <img src="/img/api/user_login.png" width="80%" />
 </p>



### Upload resource

<p align="center">
   <img src="/img/api/upload_resource.png" width="80%" />
 </p>



### Create workflow

<p align="center">
   <img src="/img/api/create_workflow1.png" width="80%" />
 </p>

<p align="center">
   <img src="/img/api/create_workflow2.png" width="80%" />
 </p>

<p align="center">
   <img src="/img/api/create_workflow3.png" width="80%" />
 </p>

<p align="center">
   <img src="/img/api/create_workflow4.png" width="80%" />
 </p>



### View execution result

<p align="center">
   <img src="/img/api/execution_result.png" width="80%" />
 </p>



### View log

<p align="center">
   <img src="/img/api/log.png" width="80%" />
 </p>



## DS API Calls Operation Steps

### API calls instruction

1. token is needed
2. head value is needed

<p align="center">
   <img src="/img/api/head_value.png" width="80%" />
 </p>



### Create project

<p align="center">
   <img src="/img/api/create_project1.png" width="80%" />
 </p>

<p align="center">
   <img src="/img/api/create_project2.png" width="80%" />
 </p>

<p align="center">
   <img src="/img/api/create_project3.png" width="80%" />
 </p>



### Create project source code

<p align="center">
   <img src="/img/api/create_source1.png" width="80%" />
 </p>

<p align="center">
   <img src="/img/api/create_source2.png" width="80%" />
 </p>



### Search token

<p align="center">
   <img src="/img/api/search_token1.png" width="80%" />
 </p>

<p align="center">
   <img src="/img/api/search_token2.png" width="80%" />
 </p>





## DS API Calls Complementary Steps

### References

```
1.The corresponding API interface document: http://192.168.1.163:12345/dolphinscheduler/doc.html  
2.View the source code: https://github.com/apache/dolphinscheduler (find the corresponding version download)  
```



### API Calls

<p align="center">
   <img src="/img/api/api_call1.png" width="80%" />
 </p>

<p align="center">
   <img src="/img/api/api_call2.png" width="80%" />
 </p>



### Explanations for parameters

| key               | value          | 解释                                                         |
| ----------------- | -------------- | ------------------------------------------------------------ |
| executeType       | REPEAT_RUNNING | NONE,REPEAT_RUNNING, RECOVER_SUSPENDED_PROCESS, START_FAILURE_TASK_PROCESS, STOP, PAUSE |
| processInstanceId | 10             | The instance ID can be viewed from the interface or from the database (t_ds_process_instance table ID) |
| projectName       | test-flink     | Project name                                                 |
| executeType       | REPEAT_RUNNING | REPEAT_RUNNING                                               |



### API Documents

<p align="center">
   <img src="/img/api/api_document.png" width="80%" />
 </p>



### Source code

<p align="center">
   <img src="/img/api/api_source1.png" width="80%" />
 </p>

<p align="center">
   <img src="/img/api/api_source2.png" width="80%" />
 </p>



### View Database

<p align="center">
   <img src="/img/api/api_database.png" width="80%" />
 </p>
