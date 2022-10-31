---
title:# Apache DolphinScheduler 2.0.7 released, fixes complement and fault tolerance
keywords: Apache,DolphinScheduler,scheduler,big data,ETL,airflow,hadoop,orchestration,dataops,Meetup
description: Recently, Apache DolphinScheduler version 2.0.7 was officially released...
---
# Apache DolphinScheduler 2.0.7 released, fixes complement and fault tolerance

![](https://miro.medium.com/max/640/0*O7tYZm2aDL35U1Pb)

Recently, Apache DolphinScheduler version 2.0.7 was officially released. The new version fixes some complement and fault tolerance bugs and solves problems such as inconsistent batch data.

# Major bug fixes

## №1 The problem of continued detection of dependent while the dependent node contains tasks that are prohibited from running
* In version 2.0.6, when a dependent node has a task that is forbidden to run, the dependent node will continue to detect the task instance for unable to find the task instance, since the forbidden task does not generate a task instance, resulting in the post-task of the dependent node not being submitted. This issue has been fixed in version 2.0.7.
* PR: https://github.com/apache/dolphinscheduler/pull/10952

## №2 The problem of +1 day to the complement time by default
* In the previous version, when October 1, 2022 was selected as the complement time, for the time parameter $[yyyy-MM-dd], the output date was 2022–10–02, which is not the expected date. To solve this problem, the new version subtracts one day from the complement date to correct the output date.
* Corresponding PR: https://github.com/apache/dolphinscheduler/pull/12376
## №3 The problem that the task cannot be resubmitted when it is fault-tolerant

* In the previous version, if there are 2 Worker nodes, each Worker is running 10 tasks and 10 internally -queued tasks. When Worker 1 hangs up, the state will turn to a fault-tolerant state because the status of all the running tasks and the tasks waiting to be run needs to be fault-tolerant. However, due to a bug, the fault-tolerant task will not be resubmitted, which will cause the running task background to show that the running is completed, while the task waiting to be run does not run, resulting in inconsistent batch data.
* Corresponding to PR https://github.com/apache/dolphinscheduler/pull/12423

#  Bug fix

* Fix the problem that the disk monitoring in the monitoring interface is not displayed
* Fixed the problem of transferring parameters for tasks that failed to restore
* Fix the problem that the dependency node contains forbidden tasks and the dependency continues to detect
* Fix HTTP alert including content field in Post
* Fix the problem that the complement time is +1 day by default
* Fixed an issue where the retry time of failed tasks in the workflow did not work in some cases
* Fix the problem that the interface of workflow task relationship creation has no dependency detection
* Fix the problem that the task cannot be resubmitted when it is fault-tolerant
* Fix the problem that the prompt information is not clear when the tenant’s name is too long

#  Modify records
https://github.com/apache/dolphinscheduler/releases/tag/2.0.7

#  Download
https://dolphinscheduler.apache.org/en-us/download/download.html

# Acknowledgement
This version, like version 2.0.6, is also tempered on the scheduling practice of 8000+ daily cumulative scheduling jobs in the production environment of Zhengcai Cloud and fixes the problems feed backed by the community. Special thanks to the Zhengcai Cloud Data Platform Department for their support of this release, and to all those who contributed to the release of Apache DolphinScheduler 2.0.7. It is your unremitting efforts to make the community progress!

| danielfree | edward-yang  | hstdream   |
|------------|--------------|------------|
| lordk911 | retime123 | zwZjut |
| Jekong-hao | JinyLeeChina | liqingwang |

How to contribute:

* GitHub Code Repository: https://github.com/apache/dolphinscheduler

* Official Website:https://dolphinscheduler.apache.org/

* Mail List:dev@dolphinscheduler@apache.org

* Twitter:@DolphinSchedule
