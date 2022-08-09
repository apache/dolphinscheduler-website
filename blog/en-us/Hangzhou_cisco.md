---
title:Cisco Hangzhou's Travel Through Apache DolphinScheduler Alert Module Refactor
keywords: Apache,DolphinScheduler,scheduler,big data,ETL,airflow,hadoop,orchestration,dataops,Meetup,Cisco
description: Cisco Hangzhou has introduced Apache DolphinScheduler
---
# Cisco Hangzhou's Travel Through Apache DolphinScheduler Alert Module Refactor

<div align=center>

<img src="/img/3-16/Eng/1.png"/>

</div>

>Cisco Hangzhou has introduced Apache DolphinScheduler into the company's self-built big data platform. At present, the team of **Qingwang Li, Big Data Engineer from Cisco Hangzhou**has basically completed the Alert Module reform, which aims to build a more complete Alert module to meet the needs of complex alerts in business scenarios.
<div align=center>

<img src="/img/3-16/Eng/2.png"/>

</div>

Li Qingwang

Big Data Engineer, Cisco Hangzhou, is responsible for big data development, such as Spark and the scheduling systems.
We encountered many problems in using the original scheduling platform to process big data tasks. For example, for a task of processing and aggregated analysis of data, multiple pre-Spark tasks are used to process and analyze data from different data sources firstly, and the final Spark task aggregates and analyzes the results processed during this period to get the final data we want. Unfortunately, the scheduling platform could not execute multiple tasks serially, and we had to estimate the task processing duration to set the start execution time for multiple tasks. If one of the tasks fails to execute, subsequent tasks need to be manually stopped. This is neither convenient nor elegant.
To our surprise, the core function of Apache DolphinScheduler - **workflow definition can connect tasks in series**, perfectly fits our needs. So, we introduced Apache DolphinScheduler into our big data platform, and I was mainly responsible for the Alert module reform. At present, other colleagues are promoting the integration of K8s, hoping that future tasks will be executed in K8s.
Today, I will share the reform journey of the Alert module.

## 01 **Alert Module Design**

<div align=center>
<img src="/img/3-16/Eng/3.png"/>
</div>

Design of the DolphinScheduler Alert module
The Alert mode of Apache DolphinScheduler version 1.0 uses configuring alert.properties to  send alerts by configuring emails, SMS, etc., but this method is no longer suitable for the current scenario. The official has also refactored the alarm module. For details of the design ideas, please refer to the official documents:

[https://github.com/apache/dolphinscheduler/issues/3049](https://github.com/apache/dolphinscheduler/issues/3049)

[https://dolphinscheduler.apache.org/en-us/docs/dev/user_doc/contribute/backend/spi/alert.html](https://dolphinscheduler.apache.org/en-us/docs/dev/user_doc/contribute/backend/spi/alert.html)

The Apache DolphinScheduler alert module is an independently started service, and one of the cores is the AlertPluginManager class. The alarm module integrates many plug-ins, such as DingTalk, WeChat, Feishu, mail, etc., which are written in the source code in an independent form. When the service is started, the plug-in will be parsed and the configured parameters will be formatted into JSON, by which the front-end page will automatically be rendered. AlertPluginManager caches plugins in memory at startup. The AlertServer class will start the thread pool and scan the DB regularly.

When the workflow is configured with a notification policy, the Worker executes the workflow, and the execution result matches the notification policy successfully. After inserting the alarm data into the DB, the thread pool scans the DB and calls the send method of the AlertSender class to transfer the alarm data. Alarm data is bound to an alarm group, which corresponds to multiple alarm instances. The AlertSender class traverses the alert instance, obtains the plug-in instance through the AlertPluginManager class, calls the instance's sending method, and finally updates the result. This is the entire alerting process of Apache DolphinScheduler.

It should be noted that the RPC service is also started when the Alert server is started. This is an alarm method designed for special types of tasks, such as SQL query reports. It allows workers to directly access the Alert server through RPC, and use the Alert module to complete the alarm, while the data is not written to DB. But on the whole, the alarm mode of Apache DolphinScheduler is still based on the way of writing DB and asynchronous interaction.

<div align=center>

<img src="/img/3-16/Eng/4.png"/>

</div>

After defining the workflow, you can set the notification policy and bind the alarm group before starting.

<div align=center>

<img src="/img/3-16/Eng/5.png"/>

</div>

In the task dimension, you can configure a timeout alarm to be triggered when the task times out. There is no alarm group configuration here, tasks and workflows share the same alarm group. When the task times out, it will be pushed to the alarm group set by the workflow.

<div align=center>

<img src="/img/3-16/Eng/6.png"/>

</div>

The above figure is a flowchart of system alarm configuration. It shows that a workflow can be configured with multiple task instances, tasks can be configured to timeout to trigger alarms, and workflow success or failure can trigger alarms. An alarm group can be bound to multiple alarm instances. But this configuration mode is not reasonable. We hope that the alarm instance can also match the status of the workflow/task instance, that is, the success and failure of the workflow call the same alarm group, but trigger different alarm instances. This is more in line with the real scene.

<div align=center>

<img src="/img/3-16/Eng/7.png"/>

</div>

Create an alarm group that can be bound to multiple alarm instances.

## 02 **Big data task alarm scenario**

The following are some common big data task alarm scenarios in our daily work.

<div align=center>

<img src="/img/3-16/Eng/8.png"/>

</div>

For scheduled tasks, notifications are sent before starting execution, when the task goes online, goes offline, or modifies parameters, whether the task execution succeeds or fails. While for different results of the same task, we want to trigger different notifications, such as SMS, DingTalk, or WeChat group notification for successful tasks, and if the task fails, we need to notify the corresponding R&D personnel as soon as possible to get a faster response, and at this time, @corresponding R&D personnel in the DingTalk or WeChat group or phone notification will be more timely. At present, the company's task scheduling platform is set to call the API in the task for notification. This method of strong coupling with the code is extremely inconvenient. In fact, it can be abstracted into a more general module to achieve.

Although the architecture of Apache DolphinScheduler meets the requirements of the actual scenario, the problem is that the page configuration of the alarm module can only choose to trigger the notification for successful or fail tasks, and it is bound to the same alarm group, that is, the way of alarming is the same regardless of success or failure, which does not satisfy our need for different results to be notified in different ways in a real production environment. Therefore, we made some changes to the Alert module.

## 03 **Alert module modification**

<div align=center>

<img src="/img/3-16/Eng/9.png"/>

</div>

The first refactor points to alert instance. Previously, when an alarm instance was added, triggering an alarm would trigger the send method of the instance. We hope that when defining an alarm instance, an alarm policy can be bound. There are three options: send if the task succeeds, send on failure, and send on both success and failure.

In the task definition dimension, there is a timeout alarm function, which actually corresponds to the failed strategy.

<div align=center>

<img src="/img/3-16/Eng/10.png"/>

</div>

The above picture shows the completed configuration page. On the Create Alarm Instance page, we added an alarm type field, choosing to call the plugin on success, failure, or whether it succeeds or fails.

<div align=center>

<img src="/img/3-16/Eng/11.png"/>

</div>

The above picture shows the architecture of the Apache DolphinScheduler alarm module after the refactor. We have made two changes to it.

First, when the workflow or task is executed, if an alarm is triggered, when writing to the DB, the execution result of the workflow or task will be saved, whether it succeeds or fails.

Second, adds a logical judgment to the alarm instance calling send method, which matches the alarm instance with the task status, executes the alarm instance sending logic if it matches, and filters if it does not match.

The alarm module refactored supports the following scenarios:

<div align=center>

<img src="/img/3-16/Eng/12.png"/>

</div>

For detailed design, please refer to the issue: [https://github.com/apache/dolphinscheduler/issues/7992](https://github.com/apache/dolphinscheduler/issues/7992)

See the code for details: [https://github.com/apache/dolphinscheduler/pull/8636](https://github.com/apache/dolphinscheduler/pull/8636)

In addition, we also put forward some proposals to the community for the alarm module of Apache DolphinScheduler. Welcome anyone who is interested in this issue to follow up the work together:

* When the workflow starts or goes online or offline, or when parameters are modified, a notification can be triggered;
* The alarming scenario is for worker monitoring. If the worker hangs up or disconnects from ZK and loses its heartbeat, it will consider the worker is down, trigger an alarm, and match the alarm group with ID 1 by default. This setting is explained in the source code, which is easy to be ignored, and you won't likely to set the alarm group with ID 1, thus fails you to get the notification of worker downtime instantly;
* The alarm module currently supports Feishu, DingTalk, WeChat, Email, and other plug-ins, which are commonly used by domestic users. While users abroad are more used to plug-ins like Webex Teams, or PagerDuty, a commonly used alarm plug-in abroad. We re-developed these and plug-ins and contributed them to the community. For now, there are some more commonly used plug-ins abroad, such as Microsoft Teams, etc., anyone who is interested in it is recommended to submit a PR to the community.
The last but not least, big data practitioners probably are not skilled with the front-end stuff and may quit by the front-end page development when developing and alarm plug-ins. But I'd like to point out that you do not need to write front-end code at all when developing the Apache DolphinScheduler alarm plug-in. You only need to configure the parameters to be entered on the page or the buttons to be selected in the Java code when creating a new alarm instance plug-in (see org.apache.dolphinscheduler.spi.params for the source code), the system will automatically format it into JSON, and the front-end can automatically render a page through JSON by form-create. Therefore, you don't have to worry about writing the front end at all.

