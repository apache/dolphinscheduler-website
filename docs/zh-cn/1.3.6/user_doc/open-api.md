# API 调用

## 背景
一般都是通过页面来创建项目、流程等，但是与第三方系统集成就需要通过调用 API 来管理项目、流程

## 调用flink操作步骤

### 创建队列

1. 登录调度系统，点击 "安全中心"，再点击左侧的 "队列管理"，点击 "队列管理" 创建队列
2. 填写队列名称和队列值，然后点击 "提交" 

<p align="center">
   <img src="/img/api/create_queue.png" width="80%" />
 </p>



### 创建租户

```
1.租户对应的是linux 用户, 用户worker 提交作业所使用的的用户， 如果linux 没有这个用户， worker 会在执行脚本的时候创建这个用户
2.租户和租户编码都是唯一不能重复，好比一个人有名字有身份证号。
3.创建完租户会在hdfs 对应的目录上有相关的文件夹。
```

<p align="center">
   <img src="/img/api/create_tenant.png" width="80%" />
 </p>



### 创建用户

<p align="center">
   <img src="/img/api/create_user.png" width="80%" />
 </p>



### 创建token

1. 登录调度系统，点击 "安全中心"，再点击左侧的 "令牌管理"，点击 "令牌管理" 创建令牌

<p align="center">
   <img src="/img/token-management.png" width="80%" />
 </p>

2. 选择 "失效时间" (Token有效期)，选择 "用户" (以指定的用户执行接口操作)，点击 "生成令牌" ，拷贝 Token 字符串，然后点击 "提交" 

<p align="center">
   <img src="/img/create-token.png" width="80%" />
 </p>

### 使用 Token
1. 打开 API文档页面
   
    > 地址：http://{api server ip}:12345/dolphinscheduler/doc.html?language=zh_CN&lang=cn
<p align="center">
   <img src="/img/api-documentation.png" width="80%" />
 </p>

2. 选一个测试的接口，本次测试选取的接口是：查询所有项目
   
    > projects/query-project-list
    
3. 打开 Postman，填写接口地址，并在 Headers 中填写 Token，发送请求后即可查看结果
    ```
    token:刚刚生成的Token
    ```
<p align="center">
   <img src="/img/test-api.png" width="80%" />
 </p>



### 用户授权

<p align="center">
   <img src="/img/api/user_authorization.png" width="80%" />
 </p>

### 用户登录

```
http://192.168.1.163:12345/dolphinscheduler/ui/#/monitor/servers/master
```

<p align="center">
   <img src="/img/api/user_login.png" width="80%" />
 </p>



### 资源上传

<p align="center">
   <img src="/img/api/upload_resource.png" width="80%" />
 </p>



### 创建工作流

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



### 查看执行结果

<p align="center">
   <img src="/img/api/execution_result.png" width="80%" />
 </p>



### 查看日志结果

<p align="center">
   <img src="/img/api/log.png" width="80%" />
 </p>



## DS API调用步骤

### api调用说明

1. 需要使用到token
2. 需要添加值到head中，如下图

<p align="center">
   <img src="/img/api/head_value.png" width="80%" />
 </p>



### 创建项目

<p align="center">
   <img src="/img/api/create_project1.png" width="80%" />
 </p>

<p align="center">
   <img src="/img/api/create_project2.png" width="80%" />
 </p>

<p align="center">
   <img src="/img/api/create_project3.png" width="80%" />
 </p>



### 创建项目源码

<p align="center">
   <img src="/img/api/create_source1.png" width="80%" />
 </p>

<p align="center">
   <img src="/img/api/create_source2.png" width="80%" />
 </p>





### 查询token

<p align="center">
   <img src="/img/api/search_token1.png" width="80%" />
 </p>

<p align="center">
   <img src="/img/api/search_token2.png" width="80%" />
 </p>





## DS API的调用补充步骤

### 参考资料

```
1.对应的api 接口文档： http://192.168.1.163:12345/dolphinscheduler/doc.html
2.查看源码：https://github.com/apache/dolphinscheduler (找到对应的版本下载)
```



### API调用

<p align="center">
   <img src="/img/api/api_call1.png" width="80%" />
 </p>

<p align="center">
   <img src="/img/api/api_call2.png" width="80%" />
 </p>







### 参数解释

| key               | value          | 解释                                                         |
| ----------------- | -------------- | ------------------------------------------------------------ |
| executeType       | REPEAT_RUNNING | NONE,REPEAT_RUNNING, RECOVER_SUSPENDED_PROCESS, START_FAILURE_TASK_PROCESS, STOP, PAUSE |
| processInstanceId | 10             | 实例id 可以通过看界面也可以通过从数据库看(t_ds_process_instance 表的id) |
| projectName       | test-flink     | 项目名称                                                     |
| executeType       | REPEAT_RUNNING | REPEAT_RUNNING                                               |



### API文档

<p align="center">
   <img src="/img/api/api_document.png" width="80%" />
 </p>



### 源码

<p align="center">
   <img src="/img/api/api_source1.png" width="80%" />
 </p>

<p align="center">
   <img src="/img/api/api_source2.png" width="80%" />
 </p>





### 查看数据库

通过源码可以查看对应的数据库

<p align="center">
   <img src="/img/api/api_database.png" width="80%" />
 </p>

