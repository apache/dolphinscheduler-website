---
title:Release News! Apache DolphinScheduler 2_0_5 optimizes The Fault Tolerance Process of Worker
keywords: Apache,DolphinScheduler,scheduler,big data,ETL,airflow,hadoop,orchestration,dataops,Meetup
description: Today, Apache DolphinScheduler announced the official release of version 2.0.5.
---
<div align=center>
<img src="/img/2022-3-7/1.png"/>
</div>

Today, Apache DolphinScheduler announced the official release of version 2.0.5. This version has carried out some functional optimizations, such as optimizing the fault tolerance process of Worker, adding the function of re-uploading files in the resource center, and making several bug fixes.

## Optimization

### Worker fault tolerance process

Version 2.0.5 optimizes the worker's fault tolerance process so that when the server is interrupted due to excessive pressure, it can normally transfer tasks to other workers to continue execution to avoid task interruption.

### Forbid to run task page sign optimization

Optimized the display of flags on pages where tasks are prohibited from running, which distinguishes from the display of tasks that are normally executed, to prevent users from confusing work status.

<div align=center>
<img src="/img/2022-3-7/2.png"/>
</div>

### Added prompts to the task box
In version 2.0.5, a prompt is added to the task box to display all the long task names, which is convenient for users.

<div align=center>
<img src="/img/2022-3-7/3.png"/>
</div>


### Added the re-uploading files function in the resource center

The function of re-uploading files has been added to the resource center. When the user needs to modify the execution, automatical updating of the execution script can be realized without the requirement to reconfigure the task parameters.

### Jump to the list page directly when modifying the workflow

Changed the status that the page remained on the DAG page after modifying the workflow. After optimization, it can jump to the list page, which is convenient for users to follow-up operations.

### Markdown information type added to DingTalk alert plugin

Adds the Markdown information type to the alarm content of the DingTalk alarm plugin to enrich the information type support.

## Bug Fix

[[#8213](https://github.com/apache/dolphinscheduler/issues/8213)] The task run incorrectly when the worker group contains uppercase letters.

[[#8347](https://github.com/apache/dolphinscheduler/pull/8347)] Fixed the problem of workflow cannot be stopped when the task fails and retries

[[#8135](https://github.com/apache/dolphinscheduler/issues/8135)] JDBC connection parameter cannot input '@'

[[#8367](https://github.com/apache/dolphinscheduler/issues/8367)] Fixed complement may not end normally

[[#8170](https://github.com/apache/dolphinscheduler/issues/8170)] Fix the problem of failing to enter the sub-workflow from the page

2.0.5 Download address:

[https://dolphinscheduler.apache.org/en-us/download/download.html](https://dolphinscheduler.apache.org/en-us/download/download.html)

Release Note: [https://github.com/apache/dolphinscheduler/releases/tag/2.0.5](https://github.com/apache/dolphinscheduler/releases/tag/2.0.5)

## Thanks to Contributors

Thanks to the contributors of Apache DolphinScheduler 2.0.5 version, the list of contributor GitHub IDs is as follows (in no particular order):

<div align=center>
<img src="/img/2022-3-7/4.png"/>
</div>
