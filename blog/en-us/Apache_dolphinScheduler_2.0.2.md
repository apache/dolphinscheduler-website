---
title: Apache DolphinScheduler 2.0.2  Release Announcement:WorkflowAsCode is Launched!
keywords: Apache,DolphinScheduler,scheduler,big data,ETL,airflow,hadoop,orchestration,dataops,2.0.2
description:In the long-awaited, WorkflowAsCode function is finally launched in version 2.0.2 as promised, bringing good news to users who need to dynamically create and update workflows in batches.
---
# Apache DolphinScheduler 2.0.2  Release Announcement:WorkflowAsCode is Launched!

<div align=center>
<img src="/img/2022-1-13/1_3XcwBeN5HkBzZ76zXDcigw.jpeg"/>
</div>

In the long-awaited, WorkflowAsCode function is finally launched in version 2.0.2 as promised, bringing good news to users who need to dynamically create and update workflows in batches.

In addition, the new version also adds the WeCom alarm group chat message push, simplifies the metadata initialization process, and fixes issues that existed in the former version, such as failure of service restart after forced termination, and the failure to add a Hive data source.

## New Function

### WorkflowAsCode

First of all, in terms of new functions, version 2.0.2 released PythonGatewayServer, which is a Workflow-as-code server started in the same way as apiServer and other services.

When PythonGatewayServer is enabled, all Python API requests are sent to PythonGatewayServer. Workflow-as-code lets users create workflows through the Python API, which is great news for users who need to create and update workflows dynamically and in batches. Workflows created with Workflow-as-code can be viewed in the web UI just like other workflows.

The following is a Workflow-as-code test case:

```py
# Define workflow properties, including name, scheduling period, start time, tenant, etc.

with ProcessDefinition(
    name="tutorial",
    schedule="0 0 0 * * ? *",
    start_time="2021-01-01",
    tenant="tenant_exists",
) as pd:
    # Define 4 tasks, which are all shell tasks, the required parameters of shell tasks are task name, command information, here are all the shell commands of echo   

    task_parent = Shell(name="task_parent", command="echo hello pydolphinscheduler")
    task_child_one = Shell(name="task_child_one", command="echo 'child one'")
    task_child_two = Shell(name="task_child_two", command="echo 'child two'")
    task_union = Shell(name="task_union", command="echo union")

    # Define dependencies between tasks
    # Here, task_child_one and task_child_two are first declared as a task group through python's list
    task_group = [task_child_one, task_child_two]
    # Use the set_downstream method to declare the task group task_group as the downstream of task_parent, and declare the upstream through set_upstream
    task_parent.set_downstream(task_group)

    # Use the bit operator << to declare the task_union as the downstream of the task_group, and support declaration through the bit operator >>
    task_union << task_group

```
When the above code runs, you can see workflow in the web UI as follows:

```                  --> task_child_one
                / \
task_parent --> --> task_union
                \ /
                  --> task_child_two
```


### 2 Wecom alarm mode supports group chat message push

In the previous version, the WeChat alarm only supported the message notification; in version 2.0.2, when the user uses the Wecom alarm, it supports pushing the group chat message in the app to the user.

## 02 Optimization

### 1 Simplified metadata initialization process

When Apache DolphinScheduler is first installed, running create-dolphinscheduler.sh requires a step  by step upgrade from the oldest version to the current version. In order to initialize the metadata process more conveniently and quickly, version 2.0.2 allows users to directly install the current version of the database script, which improves the installation speed.

### 2 Remove "+1" (days) in complement dates

Removed the "+1" day in the complement date to avoid user confusion when the UI date always displays +1 when the complement is added.

## 03 Bug Fixes

[#7661] fix logger memory leak in worker
[#7750] Compatible with historical version data source connection information
[#7705] Memory constraints cause errors when upgrading from 1.3.5 to 2.0.2
[#7786] Service restart fails after a forced termination
[#7660] Process definition version create time is wrong
[#7607] Failed to execute PROCEDURE node
[#7639] Add default configuration of quartz and zookeeper in common configuration items
[#7654] In the dependency node, an error is reported when there is an option that does not belong to the current project
[#7658] Workflow replication error
[#7609] Workflow is always running when worker sendResult succeeds but the master does not receive error report
[#7554] H2 in Standalone Server will automatically restart after a few minutes, resulting in abnormal data loss
[#7434] Error reported when executing MySQL table creation statement
[#7537] Dependent node retry delay does not work
[#7392] Failed to add a Hive data source

Download: https://dolphinscheduler.apache.org/zh-cn/download/download.html
Release Note: https://github.com/apache/dolphinscheduler/releases/tag/2.0.2


## 04 Thanks


As always, we would like to thank all the contributors (in no particular order) who have worked to polish Apache DolphinScheduler 2.0.2 as a better platform. It is your wisdom and efforts to make it more in line with the needs of users.

<div align=center>
<img src="/img/2022-1-13/1_IFBxUh2I0LFWF3Jkwz1e5g.png"/>
</div>

## The Way to Join US

There are many ways to participate and contribute to the DolphinScheduler community, including:
Documents, translation, Q&A, tests, codes, articles, keynote speeches, etc.

We assume the first PR (document, code) to contribute to be simple and should be used to familiarize yourself with the submission process and community collaboration style.

So the community has compiled the following list of issues suitable for novices: https://github.com/apache/dolphinscheduler/issues/5689
List of non-newbie issues: https://github.com/apache/dolphinscheduler/issues?q=is%3Aopen+is%3Aissue+label%3A%22volunteer+wanted%22
How to participate in the contribution: https://dolphinscheduler.apache.org/en-us/docs/dev/user_doc/contribute/join/review.html

Community Official Website：
https://dolphinscheduler.apache.org/
GitHub Code repository:
https://github.com/apache/dolphinscheduler
Your Star for the project is important, don’t hesitate to lighten a Star for Apache DolphinScheduler ❤️

