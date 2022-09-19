---
title:Apache DolphinScheduler 3.0.0 Official Version Released!
keywords: Apache,DolphinScheduler,scheduler,big data,ETL,airflow,hadoop,orchestration,dataops,Kubernetes
description:The official version 3.0.0 has undergone the most significant changes since its release
---
# Apache DolphinScheduler 3.0.0 Official Version Released!
![](https://miro.medium.com/max/1260/1*zwulVh_I1ROhSYrlE3OW6A.png)


The official version 3.0.0 has undergone the most significant changes since its release, adding many new functions and features, aiming to bring users a brand-new experience and more value.

The iterative 3.0.0 official version is roughly the same as the primary function and feature updates, optimizations, and bug fixes described in the previous 3.0.0 alpha version update, including the four keywords summary “faster, stronger, more modern, and easier to maintain” of this version.

For the new functions and optimizations after the version iteration, this article will make supplements.

## Keyword: faster, stronger, more modern, and easier to maintain
* Faster and more modern: a reworked UI with a new interface, which is not only tens of times more responsive for users and hundreds of times faster for developers to build but also with a more modern page layout and icon style.
* More powerful: bringing many exciting new features such as data quality check, custom time zones, support for AWS, and the addition of multiple task plugins and multiple alert plugins.
* Easier to maintain: back-end service separation is more in line with the trend toward containerization and microservices, and also makes maintenance easier by clarifying the responsibilities of each service.

## New features and functionality
### New UI, more robust and faster front-end code
The biggest changes in 3.0.0-alpha are the introduction of a new UI, which eliminates the need to reload pages when switching languages, and the addition of a dark theme. The new UI uses the Vue3, TSX, and Vite-related technology stack. Compared to the earlier UI, the new UI is not only more modern and user-friendly, but the front-end is also more robust, allowing users to check interface parameters if they find problems in the code, resulting in more robust front-end code.

In addition, the new architecture and technology stack will not only allow users to operate Apache DolphinScheduler tens of times more responsively, but developers will also be hundreds of times faster at compiling and launching the UI locally, which will significantly reduce the time it takes for developers to debug and package their code.

Experience the new UI:

![](https://miro.medium.com/max/1260/1*v18xJZwX45jGanqzLxUtiA.png)
![](https://miro.medium.com/max/1260/1*Bpg6eL0ex60qFnfI_5w-jA.png)
<u>Local launch time comparison</u>
### Homepage:
![](https://miro.medium.com/max/1260/1*OyirtNwELJ0OhQ3u1mMG7Q.png)
### Workflow instances
![](https://miro.medium.com/max/1260/1*uELrhNIgzxc76-HUjL4X6Q.png)
### Shell Tasks page
![](https://miro.medium.com/max/1260/1*eGchL9gbHX96HiNYPDpVow.png)
### MySQL Data Sources page
![](https://miro.medium.com/max/1260/1*dXOQgOksyzR3tNBvN2QlKg.png)

## Support for AWS
As the Apache DolphinScheduler user grows, it has attracted many overseas users. However, during the research, users found that there were two bottlenecks that affected their experience with Apache DolphinScheduler, one was the time zone issue and the other was the lack of support for overseas cloud vendors, especially AWS. For this reason, we decided to support the significant components of AWS, and this is one of the most significant changes in this release.

Apache DolphinScheduler now supports AWS for both Amazon EMR and Amazon Redshift task types and has implemented Resource Center support for Amazon S3 storage.

* **For Amazon EMR,** we have created a new task type and provided its Run Job Flow feature, which allows users to submit multiple steps jobs to Amazon EMR and specify the number of resources to be used. Details can be found at: [https://dolphinscheduler.apache.org/zh-cn/docs/latest/user_doc/guide/task/emr.html](https://dolphinscheduler.apache.org/zh-cn/docs/latest/user_doc/guide/task/emr.html)

### Amazon EMR Task Definition
![](https://miro.medium.com/max/1260/1*etFYF8mCIi0hZdSsn-vGCg.png)
For Amazon Redshift, we have now extended support for Amazon Redshift data sources in the SQL task type and users can now run Amazon Redshift tasks by selecting the Redshift data source in the SQL task.

### Amazon Redshift support
![](https://miro.medium.com/max/1260/1*T6tX2rqiosbkuxNFKuEuWg.png)

For **Amazon S3**, we have extended the Apache DolphinScheduler’s resource center to support not only local resources, HDFS resource storage but also Amazon S3 as a resource centre for storage. Details can be found at: https://dolphinscheduler.apache.org/en-us/docs/latest/user_doc/guide/resource/intro.html in `resource.storage.type` We will be supporting more AWS tasks as users need them, so stay tuned.

### Service Separation
While the new UI is the biggest change to the front end of 3.0.0-alpha, the biggest change to the back end is the separation of services. Given the growing buzz around containers and microservices, the Apache DolphinScheduler developers made the decision to class https://dolphinscheduler.apache.org/en-us/docs/latest/user_doc/guide/resource/intro.html ify the backend services. By function, we split the service into the following parts.

* master-server: master service
* worker-server: worker service
* api-server: API service
* alert-server: alert service
* standalone-server: standalone for a quick experience with Apache DolphinScheduler functionality
* UI: UI resources
* bin: quick-start scripts, mainly scripts to start individual services
* tools: tools-related scripts, mainly database creation and scripts update
All services can be started or stopped by executing the following commands.

Plain Text

`bin/dolphinscheduler-daemon.sh <start|stop> <server-name>`

## Data quality verification
In this release, the long-awaited data quality verification comes online, solving data quality issues such as the accuracy of the number of data items synchronized from the source, and alarms for single or multiple tables with weekly or monthly fluctuations exceeding thresholds. Earlier versions of Apache DolphinScheduler solved the problem of running tasks in a specific order and time, while it lacks a commonly used data quality measurement after it had been run, which imposes an additional development cost on the user.

Data quality verification is now natively supported in 3.0.0-alpha, with support for a data quality check process before the workflow is run, enabling strict control of data quality and monitoring of results during the task run by user-defined data quality check rules in the data quality function module.

![](https://miro.medium.com/max/1260/1*xtARUWNHAQSycid1Y3Em8Q.png)
![](https://miro.medium.com/max/1260/1*sMFnejLTNQ7eZ5k9Pe_ocw.png)

## Task groups

Task groups are used to control the concurrency of task instances and to define the group's priority. When creating a new task definition, the user can configure the task group corresponding to the current task and configure the priority of the task to run within the task group. When a task is configured with a task group, the task can be executed only meeting the condition that all upstream tasks run successfully but also the task currently running in the task group is smaller than the size of the resource pool. When it is greater than or equal to the size of the resource pool, the task will wait until the next check. When multiple tasks in a task group are in the pending queue at the same time, the task with the highest priority will be run first.


![](https://miro.medium.com/max/1260/1*p06af-2CI7Juk5q9ntjXRA.png)

### Customizing time zones
In versions prior to 3.0.0-alpha, Apache DolphinScheduler defaulted to the UTC+8 time zone, but as the user base expanded, overseas users and those doing business across time zones overseas were often confused by the time zone. 3.0.0-alpha supports time zone switching, which solves the time zone problem for overseas users. For example, if an enterprise business involves a time zone of East 8 and West 5, if you want to use the same DolphinScheduler cluster, you can create multiple users and each user will use their own local time zone, and the time displayed in the corresponding DolphinScheduler object will switch to the local time of the corresponding time zone, which is more in line with local developers’ usage habits. The time displayed in the corresponding DolphinScheduler object will be switched to the local time zone, which is more in line with local developers’ usage habits.
![](https://miro.medium.com/max/1260/1*bY1arsC_WlyQNTZs9Hd7qg.png)
See link: [https://dolphinscheduler.apache.org/zh-cn/docs/3.0.0/user_doc/guide/howto/general-setting.html](https://dolphinscheduler.apache.org/zh-cn/docs/3.0.0/user_doc/guide/howto/general-setting.html)

## List of task definitions

With previous versions of Apache DolphinScheduler 3.0.0-alpha, if a user wanted to manipulate a task, they needed to find the corresponding workflow and locate the task in the workflow before they could edit it. However, when the number of workflows became large or when a single workflow had a large number of tasks, the process of finding the corresponding task became very painful for users, which was not in line with the easy-to-use philosophy of Apache DolphinScheduler. Therefore, we have added a task definition page in 3.0.0-alpha to allow users to quickly locate and edit tasks by task name, allowing for easy bulk task changes.

See the link for more details: [https://dolphinscheduler.apache.org/zh-cn/docs/latest/user_doc/guide/project/task-definition.html](https://dolphinscheduler.apache.org/zh-cn/docs/latest/user_doc/guide/project/task-definition.html)

## New alert types
The 3.0.0-alpha alert type adds support for Telegram and Webexteams alert types.

### New Python API Features
In 3.0.0, the most significant change in the Python API is to integrate the corresponding PythonGatewayServer into the API-Server service and rename it PythonGatewayService. Now the user will start the PythonGatewayService by default when starting the API-server; if you do not want to start the PythonGatewayService, you can set python-gateway.enabled in application.yaml to false.

Additionally, the Python API adds CLI and configuration modules. The Configuration module allows users to modify the default configuration of the Python API, such as modifying the default user name of the workflow, worker grouping, etc. The values can be changed through environment variables, direct file modification, and Python dynamic modification.

![](https://miro.medium.com/max/1190/1*dO7XiOfFAP-QHqEKX2M59g.png)
At present, the CLI only has two subcommands, version and config, which are used to confirm the current version and add or delete configuration files. In the future, we will introduce more functions to facilitate users to operate DolphinScheduler through the command line.
![](https://miro.medium.com/max/1206/1*8SneqY5GCcVs4KGfuVpqsA.png)
It is worth noting that the Python API also supports the function of adding and uploading files in the resource center to facilitate resource management; it also supports writing different names for different workflows of the same project; adding integration tests to make the testing more convenient.

<u>Unannounced functionality and feature updates from previous releases</u>

### Support for Flink task types
In this release, we have extended the Flink task type to support running Flink SQL tasks, which use sql-client.sh to submit tasks. In the previous version, we only supported submitting tasks through Flink cli. This method needs to combine the resource center, submit the resource file to the resource center, and then refer to the modified resource on the task definition page, which is not friendly for versioning and user transparency. As Flink SQL gradually becomes the mainstream of Flink users and writing SQL directly on the editing page is more user-transparent, we have adopted the Flink SQL function contributed by the community. Users in versions after 3.0.0 can use the Flink task more conveniently.

For more details, please refer to: [flink sql client](https://nightlies.apache.org/flink/flink-docs-master/docs/dev/table/sqlclient/)

Corresponding PR: [https://github.com/apache/dolphinscheduler/pull/9840](https://github.com/apache/dolphinscheduler/pull/9840)
![](https://miro.medium.com/max/1260/1*eVFKv6T4sn0oh2_cE72t5g.png)

### Add Zepplin task type
In this release, we have added the Zeppelin task type for creating and executing Zeppelin-type tasks. When the worker executes this task, it triggers the Zeppelin Notebook section through the Zeppelin Client API.

Corresponding PR: [https://github.com/apache/dolphinscheduler/pull/9810](https://github.com/apache/dolphinscheduler/pull/9810)
![https://miro.medium.com/max/1260/1*wrBC1-1g2t3kpOE_awfRow.png](https://miro.medium.com/max/1260/1*wrBC1-1g2t3kpOE_awfRow.png)

### Bash parameter passing function
The new version also adds the function of passing parameters through bash. If you want to use bash variables instead of constant value export parameters in downstream tasks, you can achieve this by rough setValue and Bash variables, which is more flexible and allows you to dynamically obtain Existing local or HTTP resources to get set variables.

A similar syntax can be used

`lines_num=$(wget https://raw.githubusercontent.com/apache/dolphinscheduler/dev/README.md -q -O - | wc -l | xargs)echo "#{setValue(set_val_var=${lines_num})}"
`

### Allow users to upload files without a suffix
Previously, the resource center could only upload files with suffixes. After version 3.0.0, we support users to upload files without suffixes.

### Other functional enhancements
In addition to the above new functions, version 3.0.0 has also carried out many detailed function enhancements, such as refactoring task plug-ins and data source plug-in modules to make expansion easier; restoring the support for Spark SQL; making the E2E testing perfectly compatible with the new UI, etc.
## Key optimizations
* [#8584] Task back-end plugin optimization, new plugins only need to modify the plugin’s own module
* [#8874] Verify the end time and start time when submitting/creating a cron under workflow
* [#9016] Dependent The global project can be selected when adding dependencies
* [#9221] AlertSender optimization and gracefully close, such as MasterServer
* [#9228] Increase the slot condition to check the database and reduce the returned data records
* [#9230] Slim dist package by migrating python gatewar into Episerver
* [#9372] [python] Migrate pythonGatewayServer into API server
* [#9443] [python] Add missing doc about config and connect remote server
* [#8719] [Master/Worker] Change the task ack to runnning callback
* [#9293] [Master] add task event thread pool

## Major bug fixes

* [#7236] Failed to create tenant using S3a Minio
* [#7416] Text file busy
* [#7896] When the project is authorized, it will generate a duplicate authorized project
* [#8089] start server failed because it can’t connect to PostgreSQL
* [#8183] message:datasource plugin ‘spark’ is not found.
* [#8202] MapReduce generated command built-in parameter location is wrong
* [#8751] Change param user, queue do no work in ProcessDefinition
* [#8756] Process using the dependence component cannot migrate between test and prod environment
* [#8760] Resource file deletion conditions
* [#8791] Rectify the issue affecting the original node’s data when editing the form of the copied node.
* [#8951] Worker resources are exhausted and cause downtime
* [#9243] Some types of alarms can’t display project name
* Problems with each deployment method in 3.0.0
* When the task group is empty, the page reports an error
* treemap view depth error problem
* The alarm information is not clear
* Parameter verification problem: The parameter verification problem in the data source center, the password is inconsistent when the password is changed, and the alert script is verified before the alarm is sent.
* Python API: The release state cannot be set, the local parameter has a value but the verification fails
* The token query doesn’t follow the timezone
* Fix HTTPS and HTTP string recognition issues
* Fix alert server health monitoring failure problem
* Fix condition task branch failure problem
* Fix the issue of docker image does not support multi-platform
* Fix the problem that the database cannot be written correctly when the workflow with task group priority is created
* Invalidation of the master task
* Fix the issue of serial wait not running
* Time zone error: scheduling time zone error problem, log add time zone support
* Re-run, pause workflow instance failure problem
* Resource Center instantiation failure problem
* Fix the problem of dividing lines in the email alert template
* Fix data initialization problem in Standalone mode
* Fixed the page display error when the monitoring center DB does not exist
* Fix the issue of invalid creation workflow parameters
* Fixed the abnormal problem of zookeeper port during K8S deployment
* Fix the problem that the service fails to start in Standalone mode
* Fix LDAP login failure problem
* Python API: fix the problem that the task component names of different workflows under the same project do not support the same name
* Python API: fix SQL task component SQL type error
* Fix the abnormal problem of resource file renaming form
* Fix the problem of getting the executable time of the workflow according to the timing settings
* Upgraded module dependencies such as Logback and Log4j
* Fix mission failure issue
* Fixe the issue of HDFS NPE
* Fix the problem of master deadlock caused by task group exception
* Fixed several stability issues

## Document modification

* Correct the deployment documentation
* Repair and update some usage documents: WebexTeams Chinese version documentation, local parameters, global parameter documentation, Kubernetes FAQ documentation, Spark precautions documentation, DataX usage documentation, delete Flink API documentation, fix the open-api errors, fix wrong documentation in data quality; Add stand-alone switch database document; Add document for judging Yarn running status in Shell; Add update system screenshot; Upgrade documents for parameter transfer, global parameters, parameter priority, alarm component wizard, Telegram, Dingding alarm document, alarm FAQ Documentation, Shell Component Documentation, Switch Task Component Documentation, Resource Center Configuration Details Documentation, Workflow Definition Complement Documentation
* Corrected some development documents: clarify the supported operating systems, fix development environment construction documents, and add self-build docker image documents

## Release Note
GitHub:[https://github.com/apache/dolphinscheduler/releases/tag/3.0.0](https://github.com/apache/dolphinscheduler/releases/tag/3.0.0)

Download: [https://dolphinscheduler.apache.org/en-us/download/download.html](https://dolphinscheduler.apache.org/en-us/download/download.html)

## Thanks to contributors

In alphabetical order

`Aaron Lin、Amy0104、Assert、BaoLiang、Benedict Jin、BenjaminWenqiYu、Brennan Fox、Dannila、Desperado2、Devosend、DingPengfei、DuChaoJiaYou、EdwardYang、Eric Gao、Frank Chen、GaoTianDuo、HanayoZz、HeChuan、HomminLee、Hua Jiang、Hwting、Ivan0626、Jeff Zhan、Jiajie Zhong、JieguangZhou、Jiezhi.G、JinYong Li、J·Y、Kerwin、Kevin.Shin、KingsleyY、Kirs、KyoYang、LinKai、LiuBodong、LongJGun、Luke Yan、Lyle Shaw、Manhua、Martin Huang、Maxwell、Molin Wang、Mr.An、OS、PJ Fanning、Paul Zhang、QuakeWang、ReonYu、SbloodyS、Sheldon、Shiwen Cheng、ShuiMuNianHuaLP、ShuoTiann、SongTao Zhuang、Stalary、Sunny Lei、Tom、Town、Tq、WangJPLeo、Wenjun Ruan、X&Z、XiaochenNan、Yanbin Lin、Yao WANG、Yiming Guo、Zonglei Dong、aCodingAddict、aaronlinv、aiwenmo、caishunfeng、calvin、calvinit、cheney、chouc、chuxing、czeming、devosend、exmy、gaojun2048、guodong、guoshupei、hjli、hstdream、huangxiaohai、janeHe13、jegger、jiachuan.zhu、jon-qj、juzimao、kezhenxu94、labbomb、leiwingqueen、lgcareer、lhjzmn、lidongdai、lifeng、lilyzhou、litiliu、liubo1990、liudi1184、longtb、lvshaokang、lyq、mans2singh、mask、mazhong、mgduoduo、myangle1120、naziD、nobolity、ououtt、ouyangyewei、pinkhello、qianli2022、qinchaofeng、rickchengx、rockfang、ronyang1985、seagle、shuai hou、simsicon、sneh-wha、songjianet、sparklezzz、springmonster、sq-q、syyangs799、uh001、wangbowen、wangqiang、wangxj3、wangyang、wangyizhi、wind、worry、wqxs、xiangzihao、xiaodi wang、xiaoguaiguai、xuhhui、yangyunxi、yc322、yihong、yimaixinchen、youzipi、zchong、zekai-li、zhang、zhangxinruu、zhanqian、zhuxt2015、zixi0825、zwZjut、天仇、小张、弘树丶、张俊杰、旭旭同學、时光、旺阳、王强、百岁、秋天、罗铭涛、阿福Chris、陈家名、陈爽、飞侠美如画`

