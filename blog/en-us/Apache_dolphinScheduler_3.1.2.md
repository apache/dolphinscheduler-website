---
title: Apache DolphinScheduler releases version 3.1.2 with Python API optimizations
keywords: Apache,DolphinScheduler,scheduler,big data,ETL,airflow,hadoop,orchestration,dataops,Kubernetes
description: Recently, Apache DolphinScheduler released version 3.1.2.
---
# Apache DolphinScheduler releases version 3.1.2 with Python API optimizations
![](/img/media/16720397220045/16720397367629.jpg)
Recently, Apache DolphinScheduler released version 3.1.2. This version is mainly based on version 3.1.2, with 6 Python API optimizations, 19 bug fixes, and 4 document updates.

## Important bug fixes:

* Worker kill process does not take effect #12995
* Complement dependency mode generates wrong workflow instance (#13009)
* Python task parameter passing error (#12961)
* Fix dependency task null pointer (#12965)
* Task retry error (#12903)
* Shell task calls dolphinscheduler_env.sh configuration file exception (#12909)
* Corrected documentation for multiple Hive SQL runs (#12765)
* Added token authentication for Python API #12893

## Change Log

### Bug fix
* [Improvement] change alert start.sh (#13100)
* [Fix] Add token as authentication for python gateway (#12893)
* [Fix-13010] [Task] The Flink SQL task page selects the pre-job deployment mode, but the task executed by the worker is the Flink local mode
* [Fix-12997][API] Fix that the end time is not reset when the workflow instance reruns. (#12998)
* [Fix-12994] [Worker] Fix kill process does not take effect (#12995)
* Fix sql task will send alert if we don’t choose the send email #12984
* [Fix-13008] [UI] When using the complement function, turn on the dependent mode to generate multiple unrelated workflow instances (#13009)
* [Fix][doc] python api release link
* [Fix] Python task can not pass the parameters to downstream task. (#12961)
* [Fix] Fix Java path in Kubernetes Helm Chart (#12987)
* [Fix-12963] [Master] Fix dependent task node null pointer exception (#12965)
* [Fix-12954] [Schedule] Fix that workflow-level configuration information does not take effect when timing triggers execution
* Fix execute shell task exception no dolphinscheduler_env.sh file execute permission (#12909)
* Upgrade clickhouse jdbc driver #12639
* add spring-context to alert api (#12892)
* [Upgrade][SQL]Modify the table t_ds_worker_group to add a description field in the postgresql upgrade script #12883
* Fix NPE while retry task (#12903)
* Fix-12832][API] Fix update worker group exception group name already exists. #12874
* Fix and enhance helm db config (#12707)

### Document
* [Fix][Doc] Fix sql-hive and hive-cli doc (#12765)
* [Fix][Alert] Ignore alert not write info to db (#12867)
* [Doc] Add skip spotless check during ASF release #12835
* [Doc][Bug] Fix dead link caused by markdown cross-files anchor #12357 (#12877)

### Python API
* [Fix] python API upload resource center failed
* [Feature] Add CURD to the project/tenant/user section of the python-DS (#11162)
* [Chore][Python] Change name from process definition to workflow (#12918)
* [Feature] Support set execute type to pydolphinscheduler (#12871)
* [Hotfix] Correct python doc link
* [Improvement][Python] Validate version of Python API at launch (#11626)

## Acknowledgment

Thanks to all community contributors who participated in the release of Apache DolphinScheduler 3.1.2. Below is the list of the contributors by GitHub ID, in no particular order.



| liqingwang   | liqingwang    | hezean       |
|--------------|-------------|--------------|
| ruanwenjun | simsicon | jieguangzhou |
| Tianqi-Dotes  | zhuangchong | zhongjiajie |

