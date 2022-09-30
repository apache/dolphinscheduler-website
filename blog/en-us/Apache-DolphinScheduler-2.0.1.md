---
title:  Apache DolphinScheduler 2.0.1 is here, and the highly anticipated one-click upgrade and plug-in finally come!
keywords: Apache,DolphinScheduler,scheduler,big data,ETL,airflow,hadoop，orchestration, dataops,2.0.1
description: Good news! Apache DolphinScheduler 2.0.1 version is officially released today!
---
## Apache DolphinScheduler 2.0.1 is here, and the highly anticipated one-click upgrade and plug-in finally come!

Good news! Apache DolphinScheduler 2.0.1 version is officially released today!

In this version, DolphinScheduler has undergone a microkernel + plug-in architecture improvement, 70% of the code has
been refactored, and the long-awaited plug-in function has also been emphatically optimized. In addition, there are many
highlights in this upgrade, such as a one-click upgrade to the latest version, "de-ZK" in the registration center, and
new task parameter transfer functions, etc..

Download Apache DolphinScheduler 2.0.1：https://dolphinscheduler.apache.org/zh-cn/download/download.html

The workflow execution process activities of Apache DolphinScheduler 2.0.1 are shown in the following figure:

<div align=center>
<img src="https://s1.imgpp.com/2021/12/20/master-process-2.0-en.png"/>
</div>

Start process activity diagram

Version 2.0.1 enhanced the system's processing capabilities by optimizing the kernel, thereby greatly improving
performance. The new UI interface also greatly improved the user experience. More importantly, there are two major
changes in version 2.0.1: plug-in and refactoring.
https://dolphinscheduler.apache.org/en-us/docs/2.0.1/user_doc/guide/upgrade.html
## 01 Plug-in

Previously, some users had feedback that they hoped that Apache DolphinScheduler could be optimized for plug-inization.
In respond, Apache DolphinScheduler 2.0.1 has optimized plug-in function, adding alarm plug-ins, registry plug-ins, and
task plug-in management functions. With plug-in, users can meet their own functional needs more flexibly, customize
development task components based on interfaces more simply, and seamlessly migrate user task components to a higher
version of DolphinScheduler. DolphinScheduler is in the process of microkernel + plug-in architecture improvement. All
core capabilities such as tasks, alarm components, data sources, resource storage, registry, etc. will be designed as
extension points. We hope to improve the flexibility and friendliness of Apache DolphinScheduler itself through SPI. The
related code can refer to the dolphinscheduler-spi module, and the extended interfaces of related plug-ins are also
under this module. When users need to deploy the plug-in of related functions, it is recommended to read the code of
this module first. Of course, it is also recommended that you read the document to save time. We have adopted an
excellent front-end module form-create, which supports the generation of front-end UI components based on json. If
plug-in development involves the front-end, we will use json to generate related front-end UI modules. The plug-in
parameters are encapsulated in org.apache.dolphinscheduler.spi.params, which converts all relevant parameters into
corresponding json. This means that you can completely draw front-end modules (mainly refers to forms) by Java.

### 1 Alarm plug-in

Taking the alert plug-in as an example, Apache DolphinScheduler 2.0.1 enables the loading of related plug-ins when the
alert-server starts. Alert provides a variety of plug-in configuration methods and currently has built-in alert plug-ins
such as Email, DingTalk, EnterpriseWeChat, and Script. When the plug-in module development work is completed, it can be
enabled through a simple configuration.

### 2 Multi-registry modules

In Apache DolphinScheduler 1.X, the Zookeeper module plays a very important role , including monitoring and discovery of
master/worker services, disconnection alarms, fault tolerance notification and so on. In version 2.0.1, we gradually "
de-ZK" in the registry, weakening the role of Zookeeper, and adding plug-in management functions. In plug-in management,
users can increase the support of registry centers such as ETCD, making Apache Dolphinscheduler more flexible and
adaptable to more complex user needs.

### 3 Task module plugin

The new version also adds the task plug-in function, which enhances the isolation function of different task components.
When a user develops a custom plug-in, he only needs to implement the plug-in interface. It mainly includes creating
tasks (task initialization, task running, etc.) and task cancellation.

If it is a Yarn task, you need to implement AbstractYarnTask. At present, developers need to use Vue to develop and
deploy the front end of the task plug-in. In subsequent versions, we will implement the automatic drawing of front-end
modules by Java.

## 02 Refactor

So far, Apache DolphinScheduler has refactored about 70% of the code and achieved a comprehensive upgrade.

### 1 Master core optimization

In the upgrade, we refactor the execution process of the Master, changing the previous state polling monitoring to an
event notification mechanism, which greatly reduces the polling pressure of the database; removing the global lock,
adding the fragmentation processing mechanism of the Master, and changing the sequence Read and write commands to
parallel processing, which enhances the horizontal scalability of the Master; optimizes the workflow processing flow
reduces the use of the thread pool and greatly increases the number of workflows processed by a single Master; adds the
cache mechanism, optimizes the database connection method, and simplifies the processing process, reducing unnecessary
time-consuming operations, etc.

### 2 Workflow and task decoupling

In Apache DolphinScheduler 1.x version, tasks and task relationships are saved in the workflow definition table in the
form of large json. If a workflow is very large, (for example reaches 100 to 1000 tasks), the json will be too big to be
parsed when in use. This process is more performance-consuming, and tasks cannot be reused; on the other hand, there is
no good implementation solution in workflow version and task version for big json.

Therefore, in the new version, we have decoupled the workflow and tasks, added a correlation chart between tasks and
workflow, and added a log table to save the historical version of workflow definitions and task definition, which
Improves the efficiency of workflow operation.

The operation flow chart of the workflow and tasks under the API module are shown as below:

<div align=center>
<img src="https://s1.imgpp.com/2021/12/20/3.png"/>
</div>

## 03 Automatic Version Upgrade Function

Automatic version upgrade finally comes true in version 2.0.1. The users can automatically upgrade Apache
DolphinScheduler from version 1. x to version 2.0.1 by one line usage script, and you can use the new version to run the
previous workflow without perception:

```
sh ./script/create-dolphinscheduler.sh
```

For specific upgrade documentation, please refer to:

https://dolphinscheduler.apache.org/en-us/docs/2.0.1/user_doc/guide/upgrade.html

In addition, future versions of Apache DolphinScheduler can be automatically upgraded, saving the trouble of manual
upgrades.

## 04 List of New Features

Details of the new features of Apache DolphinScheduler 2.0.1 are as follows:

### 1 New Standalone service

StandAlone Server is a service created to allow users to quickly experience the product. The registry and database
H2-DataBase and Zk-TestServer are built-in. After modification, you can start StandAloneServer with one key to
debugging.

If you want a quick experience, after decompressing the installation package, you only need to configure the JDK
environment to start the Apache DolphinScheduler system with one click, thereby reducing configuration costs and
improving R&D efficiency.

For detailed usage documentation, please refer to:

https://dolphinscheduler.apache.org/en-us/docs/latest/user_doc/guide/installation/standalone.html

Or use Docker to deploy all services with one
click: https://dolphinscheduler.apache.org/en-us/docs/2.0.1/user_doc/guide/installation/docker.html

### 2 Task parameter transfer function

Currently, the transfer between shell tasks and sql tasks is supported. Passing parameters between shell tasks:
Set an out variable "trans" in the previous "create_parameter" task: echo'${setValue(trans=hello trans)}'

<div align=center>
<img src="https://s1.imgpp.com/2021/12/17/323f6a18d8a1d2f2d8fdcb5687c264b5.png"/>
</div>
Once Keyword: "${setValue(key=value)}" is detected in the task log of the current task, the system will automatically parse the variable transfer value, in the post-task, you can directly use the "trans" variable:

<div align=center>
<img src="https://s1.imgpp.com/2021/12/17/8be29339b73b594dc05a6b832d9330ec.png"/>
</div>

The parameter passing of the SQL task:
The name of the custom variable prop of the SQL task needs to be consistent with the field name, and the variable will
select the value corresponding to the column with the same variable name in the column name in the SQL query result. The
output of user number:

<div align=center>
<img src="https://s1.imgpp.com/2021/12/17/85bc5216c01ca958cdf11d4bd555c8a6.png"/>
</div>

Use the variable "cnt" in downstream tasks:

<div align=center>
<img src="https://s1.imgpp.com/2021/12/17/4278d0b7f833b64f24fc3d6122287454.png"/>
</div>

2.0.1 adds switch task and pigeon task components:

- switch task

Setting the judgment condition in the switch task can realize the effect of running different conditional branches
according to different conditional judgment results. For example, there are three tasks, the dependency is A -> B
-> [C, D], where task_a is the shell task and task_b is the switch task.

In task A, a global variable named id is defined through a global variable, and the declaration method
is `echo'${setValue(id=1)}' `.

Task B adds conditions and uses the global variables declared upstream to achieve conditional judgment (global variables
that exist when the Switch is running are just fine, which means that they can be global variables that are not directly
generated upstream). Next, we set id as 1, run task C, and others run task D.

Configure task C to run when the global variable id=1. Then edit ${id} == 1 in the condition of task B, and select C for
branch circulation. For other tasks, select D in the branch circulation.


<div align=center>
<img src="https://s1.imgpp.com/2021/12/17/636f53ddc809f028ffdfc18fd08b5828.md.jpg"/>
</div>



-pigeon task

The pigeon task is a task component that can be docked with third-party systems. It can trigger task execution, cancel
task execution, obtain task status, and obtain task logs. The pigeon task needs to configure the API address of the
above task operation and the corresponding interface parameters in the configuration file. Enter a target task name in
the task component to connect to the third-party system and can operate the task of the third-party system in Apache
DolphinScheduler.

### 3 Adds environmental management function

The default environment configuration is dolphinscheduler_env.sh.

Configure the worker running environment online. A worker can specify multiple environments, and each environment is
equivalent to the dolphinscheduler_env.sh file.

<div align=center>
<img src="https://s1.imgpp.com/2021/12/17/ef8b444c6dbebe397daaaa3bbadf743f.png"/>
</div>


When creating a task, select the worker group and the corresponding environment variables. When the task is executed,
the worker will execute the task in the corresponding execution environment.

## 05 Optimization item

### 1 Optimize the RestApi

We have updated the new RestApi specification and re-optimized the API part by the specification, making it easier for
users to use the API.

### 2 Optimize the workflow version management

We optimized the workflow version management function and increased the historical version of the workflow and tasks.

### 3 Optimize worker group management function

In version 2.0, the worker group management function is completed. Users can modify the group information of the worker
through the page configuration, saving the troubåle to modify the configuration file on the server and restart the
worker.

After the optimization, each worker node will belong to its worker group, and be grouped to default by default. When the
task is executed, the task can be assigned to the designated worker group, and finally run by the worker node in the
group.

There are two ways to modify the worker group:

Open the "conf/worker.properties" configuration file on the worker node to be grouped, and modify the worker. groups
parameter. The worker group to which the worker belongs can be modified during operation. If the modification is
successful, the worker will use this newly created group, ignoring the configuration in worker. properties. Modify step
by step: Security Center -> Worker Group Management -> Click'New Worker Group' -> Enter'Group Name' -> Select Existing
Worker -> Click'Submit'.

Other optimization issues:

When starting the workflow, you can modify the startup parameters; Added workflow state automatically-launching when
saving the workflow; Optimized the results returned by the API, and speeded up the page loading speed when creating a
workflow; Speeded ​​up the loading of workflow instance pages; Optimized the display information of the workflow
relationship page; Optimized the import and export function, supporting cross-system import and export workflow;
Optimized some API operations, such as adding several interface methods, task deletion check, etc.

## 06 Changelogs

In addition, Apache DolphinScheduler 2.0.1 also fixes some bugs, including:

Fixed the problem that netty client would create multiple pipes; Fixed the problem of importing workflow definition
errors; Fixed the problem that the task code would be obtained repeatedly; Fix the problem that the Hive data source
connection fails when Kerberos is used; Fix the problem that the Standalone service fails to start; Fix the problem that
the alarm group display failure; Fix the problem of abnormal file upload; Fix the problem that the Switch task fails to
run; Fix the problem of invalid workflow timeout strategy; Fix the problem that the SQL task cannot send mail.

## 07 Acknowledgements

Thanks to the 289 community contributors who participated in the optimization and improvement of version 2.0.1 (in no
particular order)!

<div align=center>
<img src="https://s1.imgpp.com/2021/12/17/2020b4f57e33734414a11149704ded92.png"/>
</div>
<div align=center>
<img src="https://s1.imgpp.com/2021/12/17/1825b6945d5845233b7389479ba6c074.png"/>
</div>
