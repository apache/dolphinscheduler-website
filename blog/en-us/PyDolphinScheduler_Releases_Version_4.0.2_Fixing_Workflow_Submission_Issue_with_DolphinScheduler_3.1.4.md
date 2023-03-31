---
title:PyDolphinScheduler releases version 4.0.2, fixing the problem that workflow cannot be submitted to DolphinScheduler 3.1.4
keywords: Apache,DolphinScheduler,scheduler,big data,ETL,airflow,hadoop,orchestration,dataops,Meetup
description: ummary:PyDolphinScheduler officially releases version 4.0.2...
---
# PyDolphinScheduler releases version 4.0.2, fixing the problem that workflow cannot be submitted to DolphinScheduler 3.1.4

PyDolphinScheduler officially releases version 4.0.2, which mainly fixes the problem that version 4.0.1 cannot submit workflows to Apache DolphinScheduler 3.1.4.

In addition, the major optimizations of PyDolphinScheduler 4.0.2 include:

* PyDolphinScheduler verifies the wrong version of Apache DolphinScheduler
* Python task type adds stmdency dependency
* The problem of missing dependencies of lower versions of Python
## Optimization Details

### 01 Fix the problem that the workflow cannot be submitted to DolphinScheduler 3.1.4

PyDolphinScheduler 4.0.1 cannot submit workflows to Apache DolphinScheduler 3.1.4, because Apache DolphinScheduler 3.1.4 is released later than PyDolphinScheduler 4.0.1, and there are some incompatible updates. 

PyDolphinScheduler 4.0.2 version fixes this problem.

### 02 The issue of verifying the version of DolphinScheduler incorrectly

This happens only in extreme situations, where the user does not use the official installation package of Apache DolphinScheduler, but modifies the code and packages it by himself, there may be a version problem reported by PyDolphinScheduler that is not supported. 

PyDolphinScheduler 4.0.2 is compatible with this scenario.

### 03 Add stmdency dependency to Python task type

Before version 4.0.2, only the Python function wrapper introduced stmdency dependency parsing. In 4.0.2 and later versions, we have also added stmdency dependency parsing for the Python task type itself to ensure that the functional dependencies can be obtained.



## Modification list



### 01 Bugfixes

* Support for submitting workflows to Apache DolphinScheduler 3.1.4
* Detect Apache DolphinScheduler version issues #69
* CI anomaly detection due to dev version #70
* Python task type supports stmdency #72
* Add missing packaging dependencies #81
### 02 Optimization

* Workflow start and end time support datetime type, schedule detection #68
* Migrate CI related configuration to setup.cfg #82
### 03 documents

Modify the release document

## Release Notes

[https://github.com/apache/dolphinscheduler-sdk-Python/releases/tag/4.0.2](https://github.com/apache/dolphinscheduler-sdk-Python/releases/tag/4.0.2)


## Thanks to contributors

zhongjiajie

