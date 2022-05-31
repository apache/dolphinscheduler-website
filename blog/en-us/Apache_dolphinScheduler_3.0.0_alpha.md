# 3.0.0 Alpha Release! Nine New Features and A Brand New UI Unlock New Capabilities For the Scheduling System

<div align=center>

<img src="/img/2020-04-25/en/1.png"/>

</div>

On April 22, 2022, Apache DolphinScheduler officially announced the release of alpha version 3.0.0! This version upgrade ushers in the biggest changes since the release, with many new features and functions bringing new experiences and value to users.

The keywords for 3.0.0-alpha are, in summary, "faster, more modern, more powerful, and easier to maintain".

* Faster and more modern: a reworked UI with a new interface, which is not only tens of times more responsive for users and hundreds of times faster for developers to build but also with a more modern page layout and icon style.
* More powerful: bringing many exciting new features such as data quality check, custom time zones, support for AWS, and the addition of multiple task plugins and multiple alert plugins.
* Easier to maintain: back-end service seperation is more in line with the trend toward containerization and microservices, and also makes maintenance easier by clarifying the responsibilities of each service.

## New features and functionality

### 01 New UI, more robust and faster front-end code

The biggest changes in 3.0.0-alpha are the introduction of a new UI, which eliminates the need to reload pages when switching languages, and the addition of a dark theme. The new UI uses the Vue3, TSX, and Vite-related technology stack. Compared to the earlier UI, the new UI is not only more modern and user-friendly, but the front-end is also more robust, allowing users to check interface parameters if they find problems in the code, resulting in more robust front-end code.

In addition, the new architecture and technology stack will not only allow users to operate Apache DolphinScheduler tens of times more responsively, but developers will also be hundreds of times faster at compiling and launching the UI locally, which will significantly reduce the time it takes for developers to debug and package their code.

Experience the new UI:

<div align=center>

<img src="/img/2020-04-25/en/2.png"/>

</div>

Local launch time comparison

<div align=center>

<img src="/img/2020-04-25/en/3.png"/>

</div>

Homepage

<div align=center>

<img src="/img/2020-04-25/en/4.png"/>

</div>

Workflow instances

<div align=center>

<img src="/img/2020-04-25/en/5.png"/>

</div>

Shell Tasks page

<div align=center>

<img src="/img/2020-04-25/en/6.png"/>

</div>

MySQL Data Sources page

### 02 Support for AWS

As the Apache DolphinScheduler user grows, it has attracted many overseas users. However, during the research, users found that there were two bottlenecks that affected their experience with Apache DolphinScheduler, one was the time zone issue and the other was the lack of support for overseas cloud vendors, especially AWS. For this reason, we decided to support the significant components of AWS, and this is one of the most significant changes in this release.

Apache DolphinScheduler now supports AWS for both Amazon EMR and Amazon Redshift task types and has implemented Resource Center support for Amazon S3 storage.

* For **Amazon EMR**, we have created a new task type and provided its Run Job Flow feature, which allows users to submit multiple steps jobs to Amazon EMR and specify the number of resources to be used. Details can be found at: [https://dolphinscheduler.apache.org/zh-cn/docs/latest/user_doc/guide/task/emr.html](https://dolphinscheduler.apache.org/zh-cn/docs/latest/user_doc/guide/task/emr.html)
<div align=center>

<img src="/img/2020-04-25/en/7.png"/>

</div>

Amazon EMR Task Definition

* For Amazon Redshift, we have now extended support for Amazon Redshift data sources in the SQL task type and users can now run Amazon Redshift tasks by selecting the Redshift data source in the SQL task.
<div align=center>

<img src="/img/2020-04-25/en/8.png"/>

</div>

Amazon Redshift support

* For **Amazon S3**, we have extended the Apache DolphinScheduler's resource center to support not only local resources, HDFS resource storage but also Amazon S3 as a resource centre for storage. Details can be found at: [https://dolphinscheduler.apache.org/zh-cn/docs/3.0.0/user_doc/guide/resource/configuration.html](https://dolphinscheduler.apache.org/zh-cn/docs/3.0.0/user_doc/guide/resource/configuration.html) in
```plain
`resource.storage.type`
```

We will be supporting more AWS tasks as users need them, so stay tuned.

### 03 Service separation

While the new UI is the biggest change to the front end of 3.0.0-alpha, the biggest change to the back end is the separation of services. Given the growing buzz around containers and microservices, the Apache DolphinScheduler developers made the decision to classify the backend services. By function, we split the service into the following parts.

* master-server: master service
* worker-server: worker service
* api-server: API service
* alert-server: alert service
* standalone-server: standalone for a quick experience with Apache DolphinScheduler functionality
* UI: UI resources
* bin: quick-start scripts, mainly scripts to start individual services
* tools: tools-related scripts, mainly database creation and scripts update
All services can be started or stopped by executing the following commands.

```plain
`bin/dolphinscheduler-daemon.sh <start|stop> <server-name>`
```

### 04 Data quality verification

In this release, the long-awaited data quality verification comes online, solving data quality issues such as the accuracy of the number of data items synchronized from the source, and alarms for single or multiple tables with weekly or monthly fluctuations exceeding thresholds. Earlier versions of Apache DolphinScheduler solved the problem of running tasks in a specific order and time, while it lacks a commonly used data quality measurement after it had been run, which imposes an additional development cost on the user.

Data quality verification is now natively supported in 3.0.0-alpha, with support for a data quality check process before the workflow is run, enabling strict control of data quality and monitoring of results during the task run by user-defined data quality check rules in the data quality function module.

<div align=center>

<img src="/img/2020-04-25/en/9.png"/>

</div>

<div align=center>

<img src="/img/2020-04-25/en/10.png"/>

</div>

### 05 Task groups

Task groups are used to control the concurrency of task instances and to define the priority of the group. When creating a new task definition, the user can configure the task group corresponding to the current task and configure the priority of the task to run within the task group. When a task is configured with a task group, the task can be executed only meeting the condition that all upstream tasks run successfully but also the task currently running in the task group is smaller than the size of the resource pool. When it is greater than or equal to the size of the resource pool, the task will wait until the next check. When multiple tasks in a task group are in the pending queue at the same time, the task with the highest priority will be run first.

See the link for details: [https://dolphinscheduler.apache.org/zh-cn/docs/3.0.0/user_doc/guide/resource/configuration.html](https://dolphinscheduler.apache.org/zh-cn/docs/3.0.0/user_doc/guide/resource/configuration.html)

<div align=center>

<img src="/img/2020-04-25/en/11.png"/>

</div>

### 06 Customizing time zones

In versions prior to 3.0.0-alpha, Apache DolphinScheduler defaulted to the UTC+8 time zone, but as the user base expanded, overseas users and those doing business across time zones overseas were often confused by the time zone. 3.0.0-alpha supports time zone switching, which solves the time zone problem for overseas users. For example, if an enterprise business involves a time zone of East 8 and West 5, if you want to use the same DolphinScheduler cluster, you can create multiple users and each user will use their own local time zone, and the time displayed in the corresponding DolphinScheduler object will switch to the local time of the corresponding time zone, which is more in line with local developers' usage habits. The time displayed in the corresponding DolphinScheduler object will be switched to the local time zone, which is more in line with local developers' usage habits.

<div align=center>

<img src="/img/2020-04-25/en/12.png"/>

</div>

See link: [https://dolphinscheduler.apache.org/zh-cn/docs/3.0.0/user_doc/guide/howto/general-setting.html](https://dolphinscheduler.apache.org/zh-cn/docs/3.0.0/user_doc/guide/howto/general-setting.html)

### 07 List of task definitions

With previous versions of Apache DolphinScheduler 3.0.0-alpha, if a user wanted to manipulate a task, they needed to find the corresponding workflow and locate the task in the workflow before they could edit it. However, when the number of workflows became large or when a single workflow had a large number of tasks, the process of finding the corresponding task became very painful for users, which was not in line with the easy-to-use philosophy of Apache DolphinScheduler. Therefore, we have added a task definition page in 3.0.0-alpha to allow users to quickly locate and edit tasks by task name, allowing for easy bulk task changes.

See the link for more details: [https://dolphinscheduler.apache.org/zh-cn/docs/latest/user_doc/guide/project/task-definition.html](https://dolphinscheduler.apache.org/zh-cn/docs/latest/user_doc/guide/project/task-definition.html)

### 08 New alert types

The 3.0.0-alpha alert type adds support for Telegram and Webexteams alert types.

### 09 New Python API Features

The biggest change to the Python API in 3.0.0-alpha is the integration of the PythonGatewayServer counterpart into the API-Server service, which makes external services support more organized and alleviates the problem of large binary packages caused by services classification. The Python API also adds a CLI and configuration module, allowing users to customize configuration files and modify configurations more easily.

### 10 Other new features

In addition to the features mentioned above, the 3.0.0-alpha release also buffs many detailed enhancements, such as refactoring the task plugin and data source plugin modules to make scaling easier, restoring support for Spark SQL, E2E testing is now perfectly compatible with the new UI, and more.

## Key optimizations

[[#8584](https://github.com/apache/dolphinscheduler/pull/8584)] Task back-end plugin optimization, new plugins only need to modify the plugin's own module

[[#8874](https://github.com/apache/dolphinscheduler/issues/8874)] Verify the endtime and starttime when submit/create a cron under workflow

[[#9016](https://github.com/apache/dolphinscheduler/issues/9016)] Dependent The global project can be selected when adding dependencies

[[#9221](https://github.com/apache/dolphinscheduler/issues/9221)] AlertSender optimization and gracefully close, such as MasterServer

[[#9228](https://github.com/apache/dolphinscheduler/pull/9228)] implement use the slot to scan the database

[[#9230](https://github.com/apache/dolphinscheduler/issues/9230)] Slim dist package by migrate python gatewar into apiserver

[[#9372](https://github.com/apache/dolphinscheduler/pull/9372)] [python] Migrate pythonGatewayServer into api server

[[#9443](https://github.com/apache/dolphinscheduler/pull/9443)] [python] Add missing doc about config and connect remote server

[[#8719](https://github.com/apache/dolphinscheduler/pull/8719)] [Master/Worker] Change the task ack to runnning callback

[[#9293](https://github.com/apache/dolphinscheduler/pull/9293)] [Master] add task event thread pool

## Major bug fixes

[[#7236](https://github.com/apache/dolphinscheduler/issues/7236)] Failed to create tenant using S3a Minio

[[#7416](https://github.com/apache/dolphinscheduler/issues/7416)] Text file busy

[[#7896](https://github.com/apache/dolphinscheduler/issues/7896)] When the project is authorized, it will generate a duplicate authorized project

[[#8089](https://github.com/apache/dolphinscheduler/issues/8089)] start server failed because can't connect to postgresql

[[#8183](https://github.com/apache/dolphinscheduler/issues/8183)] message:datasource plugin 'spark' is not found.

[[#8202](https://github.com/apache/dolphinscheduler/issues/8202)] MapReduce generated command built-in parameter location is wrong

[[#8751](https://github.com/apache/dolphinscheduler/issues/8751)] Change param user, queue do no work in ProcessDefinition

[[#8756](https://github.com/apache/dolphinscheduler/issues/8756)] Process using the dependence component cannot migrate between test and prod environment

[[#8760](https://github.com/apache/dolphinscheduler/issues/8760)] Resource file deletion conditions

[[#8791](https://github.com/apache/dolphinscheduler/pull/8791)] Rectify the issue with affecting the original node's data when editing the form of the copied node.

[[#8951](https://github.com/apache/dolphinscheduler/issues/8951)] Worker resources are exhausted and cause downtime

[[#9243](https://github.com/apache/dolphinscheduler/issues/9243)] Some types of alarms can't display project name


## Release Note

[https://github.com/apache/dolphinscheduler/releases/tag/3.0.0-alpha](https://github.com/apache/dolphinscheduler/releases/tag/3.0.0-alpha)

## Thanks to contributors

In alphabetical order

Aaron Lin, Amy0104, Assert, BaoLiang, Benedict Jin, BenjaminWenqiYu, Brennan Fox, Devosend, DingPengfei, DuChaoJiaYou, EdwardYang, Eric Gao, Frank Chen, GaoTianDuo, HanayoZz, Hua Jiang, Ivan0626, Jeff Zhan, Jiajie Zhong, JieguangZhou, Jiezhi.G, JinYong Li, J-Y, Kerwin, Kevin.Shin, KingsleyY, Kirs, KyoYang, LinKai, LiuBodong, Manhua, Martin Huang, Maxwell, Molin Wang, OS, QuakeWang, ReonYu, SbloodyS, Shiwen Cheng, ShuiMuNianHuaLP, ShuoTiann, Sunny Lei, Tom, Tq, Wenjun Ruan, X&Z, XiaochenNan, Yanbin Lin, Yao WANG, Zonglei Dong, aCodingAddict, aaronlinv, caishunfeng, calvin, calvinit, cheney, chouc, gaojun2048, guoshupei, hjli, huangxiaohai, janeHe13, jegger, jon-qj, kezhenxu94, labbomb, lgcareer, lhjzmn, lidongdai, lifeng, lilyzhou, lvshaokang, lyq, mans2singh, mask, mazhong, mgduoduo, myangle1120, nobolity, ououtt, ouyangyewei, pinkhello, qianli2022, ronyang1985, seagle, shuai hou, simsicon, songjianet, sparklezzz, springmonster, uh001, wangbowen, wangqiang, wangxj3, wangyang, wangyizhi, wind , worry, xiangzihao, xiaodi wang, xiaoguaiguai, xuhhui, yangyunxi, yc322, yihong, yimaixinchen, zchong, zekai-li, zhang, zhangxinruu, zhanqian, zhuangchong, zhuxt2015, zixi0825, zwZjut, Tianchou, xiaozhang, shiguang, wangqiang, baisui, hongshu, zhangjunjie, luomingtao

