---
title:Apache DolphinScheduler 3.0.1 released, with the scheduling kernel and UI optimized
keywords: Apache,DolphinScheduler,scheduler,big data,ETL,airflow,hadoop,orchestration,dataops,Meetup
description: hanks to this Release Manager — @zhuangchong, who led the release of the 3.0.1...
---
# Apache DolphinScheduler 3.0.1 released, with the scheduling kernel and UI optimized

![](https://miro.medium.com/max/1400/1*zgkZk3lhn3UhLAKkHM9wzQ.png)

Thanks to this Release Manager — zhuangchong, who led the release of the 3.0.1 version of Apache DolphinScheduler, guided the community to communicate about the version optimization, tracked issues before the release, dealt with blocking issues, and version quality management, etc. Thanks to his contribution to the community, we also expect more Committers and PMCs to play the role of **Release Manager**.

More than a month after the official version 3.0.0 was released, the community engaged intensively in preparing for the iteration of the new version. We took the advice and feedback from the user interviews(including multiple company users) as the core development point of version 3.0.1, companies, together with hundreds of issue PRs, and nearly 30 contributors’ participation, finally launched the long-awaited 3.0.1 version. The new version made some adjustments to the UI and scheduling kernel, and at the same time, some bugs in version 3.0.0 have also been fixed.

Release note:

[https://github.com/apache/dolphinscheduler/releases/tag/3.0.1](https://github.com/apache/dolphinscheduler/releases/tag/3.0.1)

## 1 Scheduling kernel fixes

* Workflow execution runnable trapped an infinite loop
* The alert of database fields is problematic when upgrading
* Common users cannot create dependent tasks

Task, workflow instance priority causes NPE(Null Pointer Exception)

* Dependent downstream error trigger
* Fixed workflow instance possibly cause failing over multiple times
* The task group gets the task status as running error
* Fix the issue of triggering OOM(Out of Memory) when the worker kills the task

## 2 UI-related optimization

* Workflow list names overlapping
* The workflow instance does not support running
* Data source modification port error report
* Work instance operations are not on the same line
* Workflow name display abnormal


## 3 Resource Center
The problem of Resource center defaultFs configuration invalidation

## 4 Document related
The new version of Apache DolphinScheduler complements some reminder languages, such as the full path when uploading documents, the use of the standalone default resource center;

The errors in the documents are corrected, such as workflow-related descriptions, creating worker groups, Python API jump links, some spelling mistakes, and community email slack links;

## 5 Python API

The support of Python 10 and Python 11-dev is implemented in this version, and the switch task type and the SQL task truncate syntax recognition errors are fixed. In addition, the problem of only the latest version of Python API documentation being available is solved.

## 6 Bug fix

* [Improvement][UI] Unified local parameters UI #11190
* [Fix][UI] Fix the bug where icons are displayed in one line. #11320
* [Improvement-11386][UI] Concise the logic available for task action buttons #11419
* [Fix][UI] Fix the preTask options are unavailable when creating a tas… #11501
* S3 Resource center supports bucket customization (#12022)
* fix status check issue (#11580) (#12030)
* [LDAP] Config value should return real null instead of ‘null’ string (#12031)
* [3.0.1-preapre][cherry-pick]3.0.1 UI (#12020)
* [Fix][UI] Fix bug where crontab special of the month and year #11661
* [UI] Enable highlight and auto-complete for SQL scripts #11659
* [Fix][UI] Fix the problem that the pagination component is not centered in the environment management. #11646
* [Fix][UI] Fix the port in the data source edit. #11624
* [Fix][UI] Fix the table header in the workflow instance. #11487
* [Fix][UI] Fix bug where warn group name not display #11429
* [Feature-10117][UI] Hide node execution when starting from the workflow definition list page #11372
* [Fix-11366][UI] Workflow instance should not support right-click running #11367
* [fix-10961][alert server]Change the content of the alert to an array (#11033)
* [Fix][UI] Fix workflow name overlaps bug (#11862) (#12019)
* [Bug] [Worker] Optimize the getAppId method to avoid worker OOM when killing task (#11994)
* fix heartBeatTaskCount bug (#12024)
* Fix kill task failed will cause the taskGroup cannot release and add taskGroup log (#11469) (#12013)
* Workflow Definition Name Change Validation Optimization. (#11986)
* add unit test ci timeout (#11655) (#12021)
* [helm] fix worker template persistentVolumeClaim link (#11248) (#12018)
* Set master’s task running status in runTask to avoid the task group acquire failed, but the task status is in running (#11451) (#12011)
* [python] Refactor structure to avoid cycle import (#11167)
* [python] Add support interpreter version 310 and 311-dev (#11170)
* [bug][python] Fix task switch error when default branch not defined last (#11606)
* [fix][python] Sql pattern add truncate. (#11666)
* Add dependent task instance log (#11541) (#12014)
* If the task processor is not found the need to throw an error rather than an exception (#11461) (#12012)
* Fix workflow instance may failover many times due to doesn’t check the restart time (#11445) (#12010)
* Fix find last process instance in dependent task is not correct (#11424) (#12009)
* Fix quartz threadPriority config name error (#11596) (#12015)
* [Fix-11413] Cannot set the task status to kill if the task is not running(#11414) (#12007)
* Clear thread name in BaseTaskProcessor (#11422) (#12008)
* Bug Dependent downstream trigger error when schedule cycle not day. (#11987)
* [CI] Fix cluster test abnormal (#11688) (#11985)
* [Improvement-11380][scp-host.sh] Set StrictHostKeyChecking=no option to ssh (#11382) (#11995)
* optimize the process instance query, change the date time range (#11719) (#11991)
* [Fix-11051][Task]Fix the process exitValue exception when the process times out and th… (#11099) (#11983)
* [fix-11404]: make the common.properties to configurable on values.yaml (#11441) (#11967)
* ][fix-11452][Bug] [Logger Server] Incorrect password regular expression (#11993)
* Remove logger header in the task log file (#11555) (#11968)
* [Bug] [API] The task priority and process instance priority might be null and cause NPE (#11969)
* [Bug] [spark-sql] In spark-sql, select both SPARK1 and SPARK2 versions and execute /bin/spark-sql (#11971)
* Update dolphinscheduler_ddl.sql (#11974)
* [fix-#11815] fix ck column names contain special characters (#11973)
* [Bug][Workflow Definition] fix ordinary users can not create the depend task (#11961) (#11976)
* [Fix-11877][UI] Fix the problem that the environment cannot be deleted (#11934)
* [fix-10938]: use dot to replace the source and make the default env work in the shell (#11937)
* fix hdfs defaultFs not working (#11823) (#11936)
* [Quartz] cron did not work as expected (#11932)
* [Bug] [Master] WorkflowExecuteRunnable will face a infinite loop #11838 #11864 (#11949)
* [Bug-#11650][worker] #11650 fix SQL type task, stop task does not take effect (#11938)
* [Fix][db] fix init&upgrade mysql-meta-schema bugs #11887 (#11933)
* Process definition length too long when copying or importing #10621 (#11893)


## 7 DOCs

* [Doc] Upgrade license. (#9967)
* [Doc] Update README. (#9970)
* [Doc] Fix Doc deadlink in readme (#9972)
* [Doc] Update the Document picture to the new UI (#9953)
* [Doc] Add example and notice about task type Conditions (#9945)
* [Doc] Fix Docker link. (#9998)
* [Doc] Add the description about execute type in SQL task (#9987)
* [Doc] Add example and notice about task type Dependent (#10001)
* [Doc] Correct Kubernetes (#9985)
* [Doc] Correct Doc of development-environment-setup (#9995)
* [Bug][Document] Fix task group management Document link error (#10062)
* [Fix-10083][Doc]Change Docker cmd && Change WebexTeams Chinese Translation (#10084)
* [improvement-#11630]fix document about common.properties (#11653)
* update PyDolphinScheduler documentation link. (#11474)
* [doc] Correct E2E Doc, fix WorkerGroupPage typo (#11629)
* Fix the homepage email subscription link (#11622)
* [DOC] should notice that need to set the full path when calling the resource file #11620 (#11621)
* [Doc][Bug] Fix resource center docs for standalone mode (#11600)
* feat: update slack (#11578)
* [Improvement-11550] [Doc]Document content update (#11577)
* [Doc][Security] Update instructions on worker groups (#11483)
* [Doc][DSIP] Move DSIP docs to the right place (#11442) (#11443)
* [Doc][Resources] Instruct users to use local storage if they have remote storage mounted to local (#11435)
* feat: Modifying Slack Links (#11416)
* [python] Add multiple versions of a document (#11391)
* [doc] Refine the deployment documentation (#11361)
* [Fix-11217] [Doc] add PostgreSQL config in doc: datasource-setting (#11326)
* [doc] Improve the document introduction of complement (#11275)
* [DOC] improve zk digest doc (#11703) (#11992)
* [Doc] Remove re-upload file function in the 3.0.0’s doc (#11804) (#11984)
* [doc] Add how to obtain IP address from network card in FAQ (#11311) (#11982)
* fix doc about sub-process’s child node describe (#11972)
* [fix][doc] Update the registry related configuration in values.yaml (#11444) (#11980)


## 8 Acknowledgement

Thanks to all the contributors of version 3.0.1:

106umao、Amy0104、ChrisYuan、DarkAssassinator、EricGao888、HeZean、JinyLeeChina、MonsterChenzhuo、SbloodyS、WangJPLeo、abzymeinsjtu、devosend、fengjian1129、fuchanghai、guodongym、hiSandog、huage1994、insist777、jackfanwan、jieguangzhou、labbomb、limaiwang、liqingwang、lishiyucn、luoyedeyi、rickchengx、ruanwenjun、shangeyao、sketchmind、songjianet、stalary、wendongdi、yutianaiqingtian、zhangshuocn、zhongjiajie、zhuangchong、zhuxt2015