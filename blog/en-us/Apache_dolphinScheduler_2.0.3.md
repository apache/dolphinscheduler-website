---
title:Apache DolphinScheduler 2.0.3 Release Announcement: DingTalk alert plugin adds signature verification, and supports data sources to obtain links from multiple sessions
keywords: Apache,DolphinScheduler,scheduler,big data,ETL,airflow,hadoop,orchestration,dataops,2.0.3
description:Today, Apache DolphinScheduler announced the official release of version 2.0.3. In this version,
---
# Apache DolphinScheduler 2.0.3 Release Announcement: DingTalk alert plugin adds signature verification, and supports data sources to obtain links from multiple sessions

<div align=center>
<img src="/img/2.0.3/2022-1-2701/1.png"/>
</div>

> Today, Apache DolphinScheduler announced the official release of version 2.0.3. In this version, DingTalk alert plugin adds signature verification and enables data sources to get links from multiple sessions. In addition, 2.0.3 also optimizes cache management, complement time, data source password display in logs, etc., and fixes several Bug.




## Function Enhancement


### DingTalk alert plugin adds signature verification


2.0.3 Supports DingTalk robot alarm function through signature verification.

<div align=center>
<img src="/img/2.0.3/2022-1-2701/2.png"/>
</div>

**DingTalk parameter configuration**

- Webhooks

The format is as follows: https://oapi.dingtalk.com/robot/send?access_token=XXXXXX

- Keyword

Custom keywords for security settings

- Secret

Signature of security settings


When a custom bot sends a message, you can specify the "@person list" by your mobile phone number. When a person in the "@people list" receives the message, there will be an @message reminder. Even set to Do Not Disturb mode, there will still be notification reminders for conversations, and the prompt "Someone @ you" will appear on the first screen.

- @Mobiles

The phone number of the person being @

- @UserIds

User userid of @person

- @All

@everyone




For details, please refer to: https://open.dingtalk.com/document/robots/customize-robot-security-settings




### Supports data source to get connection from multi sessions




Previously, we use the JdbcDataSourceProvider.createOneSessionJdbcDataSource() method to create a connection pool in hive/impala set MaximumPoolSize=1, while in scheduling tasks, if hive/impala multitasking runs at the same time, getConnection=null will occur, and the SqlTask.prepareStatementAndBind() method will throw a null pointer exception.

2.0.3 is optimized to support data sources getting links from multiple sessions.


## Improvements




### Introduces cache manager, reduce DB query in Master scheduling




Since numerous database read operations, such as tenant, user, processDefinition, etc., will occur during the scheduling process of the master server, it will bring enormous pressure on the DB on the one hand, and will slow down the entire core scheduling process on the other hand.

Considering that this part of business data involves more reading than writing, 2.0.3 introduces a cache module, which mainly acts on the Master node to cache business data such as tenants and workflow definitions, thus reduces database query pressure, and speeds up the core scheduling process. Please check the official website documentation for details: https://dolphinscheduler.apache.org/en-us/docs/latest/user_doc/architecture/cache.html




### Optimize complement task's date, the complement time interval from '[left, right)' to '[left, right]'




Previously, the complement time was "left closed and right open" (startDate <= N < endDate), which is actually not conducive to user understanding. After optimization, the deployment time interval is changed to "closed left and closed right".

Complement case: https://dolphinscheduler.apache.org/en-us/docs/latest/user_doc/guide/project/workflow-definition.html


### Encrypted data source password in the logs



The password in the data source is encrypted to enhance privacy protection. 

## Bug Fixes


* zkRoot in conf/config/install_ config does not take effect
* Problems caused by modifying the administrator user information.
* Add delete workflow instance when delete process definition
* udf sub resource manage edit modal cant close
* process is always running: netty writeAndFlush without retry when failed, leads to worker response to master failed
* After deleting the running workflow, the master keeps brushing the error log
* Edit the bug of worker grouping in environment management.
* Dependent node ui dislocation
* Error in querying historical version information of workflow
* Solve the problem that task log output affects performance under high concurrency
* The global parameters of the sub_process node are not passed to the associated workflow task
* Query log can not show contents when task log in master on k8s
* Duplicate processes in the process definition list
* Process instance is always running: task is failure when process instance FailureStrategy.END
* Field ‘is_directory’ in t_ds_resources table has error type in PostgreSQL database
* Repair JDBC connection of Oracle
* When there is a forbidden node in dag, the execution flow is abnormal
* QuerySimpleList return wrong projectCode




**Release Note:** https://github.com/apache/dolphinscheduler/releases/tag/2.0.3

**Download:** https://dolphinscheduler.apache.org/en-us/download/download.html


## Thanks to contributors

Thanks to the community contributors for their active contributions to this release! This is the list of Contributors, in no particular order:
<div align=center>
<img src="/img/2.0.3/2022-1-2701/3.png"/>
</div>


