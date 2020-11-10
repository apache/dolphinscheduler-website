# Dolphin Scheduler 1.3 MetaData

<a name="V5KOl"></a>
### Dolphin Scheduler 1.2 DB Table Overview
| Table Name | Comment |
| :---: | :---: |
| t_ds_access_token | token for access ds backend |
| t_ds_alert | alert detail |
| t_ds_alertgroup | alert group |
| t_ds_command | command detail |
| t_ds_datasource | data source |
| t_ds_error_command | error command detail |
| t_ds_process_definition | process difinition |
| t_ds_process_instance | process instance |
| t_ds_project | project |
| t_ds_queue | queue |
| t_ds_relation_datasource_user | datasource related to user |
| t_ds_relation_process_instance | sub process |
| t_ds_relation_project_user | project related to user |
| t_ds_relation_resources_user | resource related to user |
| t_ds_relation_udfs_user | UDF related to user |
| t_ds_relation_user_alertgroup | alert group related to user |
| t_ds_resources | resoruce center file |
| t_ds_schedules | process difinition schedule |
| t_ds_session | user login session |
| t_ds_task_instance | task instance |
| t_ds_tenant | tenant |
| t_ds_udfs | UDF resource |
| t_ds_user | user detail |
| t_ds_version | ds version |


---

<a name="XCLy1"></a>
### E-R Diagram
<a name="5hWWZ"></a>
#### User Queue DataSource
![image.png](/img/metadata-erd/user-queue-datasource.png)

- Multiple users can belong to one tenant
- The queue field in t_ds_user table stores the queue_name information in t_ds_queue table, but t_ds_tenant stores queue infomation using queue_id. During the execution of the process definition, the user queue has the highest priority. If the user queue is empty, the tenant queue is used.
- The user_id field in the t_ds_datasource table indicates the user who created the data source. The user_id in t_ds_relation_datasource_user indicates the user who has permission to the data source.
<a name="7euSN"></a>
#### Project Resource Alert
![image.png](/img/metadata-erd/project-resource-alert.png)

- User can have multiple projects, User project authorization completes the relationship binding using project_id and user_id in t_ds_relation_project_user table
- The user_id in the t_ds_projcet table represents the user who created the project, and the user_id in the t_ds_relation_project_user table represents users who have permission to the project
- The user_id in the t_ds_resources table represents the user who created the resource, and the user_id in t_ds_relation_resources_user represents the user who has permissions to the resource
- The user_id in the t_ds_udfs table represents the user who created the UDF, and the user_id in the t_ds_relation_udfs_user table represents a user who has permission to the UDF
<a name="JEw4v"></a>
#### Command Process Task
![image.png](/img/metadata-erd/command.png)<br />![image.png](/img/metadata-erd/process-task.png)

- A project has multiple process definitions, a process definition can generate multiple process instances, and a process instance can generate multiple task instances
- The t_ds_schedulers table stores the timing schedule information for process difinition
- The data stored in the t_ds_relation_process_instance table is used to deal with that the process definition contains sub-processes, parent_process_instance_id field represents the id of the main process instance containing the child process, process_instance_id field represents the id of the sub-process instance, parent_task_instance_id field represents the task instance id of the sub-process node
- The process instance table and the task instance table correspond to the t_ds_process_instance table and the t_ds_task_instance table, respectively.

---

<a name="yd79T"></a>
### Core Table Schema
<a name="6bVhH"></a>
#### t_ds_process_definition
| Field | Type | Comment |
| --- | --- | --- |
| id | int | primary key |
| name | varchar | process definition name |
| version | int | process definition version |
| release_state | tinyint | process definition release state：0:offline,1:online |
| project_id | int | project id |
| user_id | int | process definition creator id |
| process_definition_json | longtext | process definition json content |
| description | text | process difinition desc |
| global_params | text | global parameters |
| flag | tinyint | process is available: 0 not available, 1 available |
| locations | text | Node location information |
| connects | text | Node connection information |
| receivers | text | receivers |
| receivers_cc | text | carbon copy list |
| create_time | datetime | create time |
| timeout | int | timeout |
| tenant_id | int | tenant id |
| update_time | datetime | update time |

<a name="t5uxM"></a>
#### t_ds_process_instance
| Field | Type | Comment |
| --- | --- | --- |
| id | int | primary key |
| name | varchar | process instance name |
| process_definition_id | int | process definition id |
| state | tinyint | process instance Status: 0 commit succeeded, 1 running, 2 prepare to pause, 3 pause, 4 prepare to stop, 5 stop, 6 fail, 7 succeed, 8 need fault tolerance, 9 kill, 10 wait for thread, 11 wait for dependency to complete |
| recovery | tinyint | process instance failover flag：0:normal,1:failover instance |
| start_time | datetime | process instance start time |
| end_time | datetime | process instance end time |
| run_times | int | process instance run times |
| host | varchar | process instance host |
| command_type | tinyint | command type：0 start ,1 Start from the current node,2 Resume a fault-tolerant process,3 Resume Pause Process, 4 Execute from the failed node,5 Complement, 6 dispatch, 7 re-run, 8 pause, 9 stop ,10 Resume waiting thread |
| command_param | text | json command parameters |
| task_depend_type | tinyint | task depend type. 0: only current node,1:before the node,2:later nodes |
| max_try_times | tinyint | max try times |
| failure_strategy | tinyint | failure strategy. 0:end the process when node failed,1:continue running the other nodes when node failed |
| warning_type | tinyint | warning type. 0:no warning,1:warning if process success,2:warning if process failed,3:warning if success |
| warning_group_id | int | warning group id |
| schedule_time | datetime | schedule time |
| command_start_time | datetime | command start time |
| global_params | text | global parameters |
| process_instance_json | longtext | process instance json(copy的process definition 的json) |
| flag | tinyint | process instance is available: 0 not available, 1 available |
| update_time | timestamp | update time |
| is_sub_process | int | whether the process is sub process:  1 sub-process，0 not sub-process |
| executor_id | int | executor id |
| locations | text | Node location information |
| connects | text | Node connection information |
| history_cmd | text | history commands of process instance operation |
| dependence_schedule_times | text | depend schedule fire time |
| process_instance_priority | int | process instance priority. 0 Highest,1 High,2 Medium,3 Low,4 Lowest |
| worker_group_id | int | worker group id |
| timeout | int | time out |
| tenant_id | int | tenant id |

<a name="tHZsY"></a>
#### t_ds_task_instance
| Field | Type | Comment |
| --- | --- | --- |
| id | int | primary key |
| name | varchar | task name |
| task_type | varchar | task type |
| process_definition_id | int | process definition id |
| process_instance_id | int | process instance id |
| task_json | longtext | task content json |
| state | tinyint | Status: 0 commit succeeded, 1 running, 2 prepare to pause, 3 pause, 4 prepare to stop, 5 stop, 6 fail, 7 succeed, 8 need fault tolerance, 9 kill, 10 wait for thread, 11 wait for dependency to complete |
| submit_time | datetime | task submit time |
| start_time | datetime | task start time |
| end_time | datetime | task end time |
| host | varchar | host of task running on |
| execute_path | varchar | task execute path in the host |
| log_path | varchar | task log path |
| alert_flag | tinyint | whether alert |
| retry_times | int | task retry times |
| pid | int | pid of task |
| app_link | varchar | yarn app id |
| flag | tinyint | taskinstance is available: 0 not available, 1 available |
| retry_interval | int | retry interval when task failed  |
| max_retry_times | int | max retry times |
| task_instance_priority | int | task instance priority:0 Highest,1 High,2 Medium,3 Low,4 Lowest |
| worker_group_id | int | worker group id |

<a name="gLGtm"></a>
#### t_ds_command
| Field | Type | Comment |
| --- | --- | --- |
| id | int | primary key |
| command_type | tinyint | Command type: 0 start workflow, 1 start execution from current node, 2 resume fault-tolerant workflow, 3 resume pause process, 4 start execution from failed node, 5 complement, 6 schedule, 7 rerun, 8 pause, 9 stop, 10 resume waiting thread |
| process_definition_id | int | process definition id |
| command_param | text | json command parameters |
| task_depend_type | tinyint | Node dependency type: 0 current node, 1 forward, 2 backward |
| failure_strategy | tinyint | Failed policy: 0 end, 1 continue |
| warning_type | tinyint | Alarm type: 0 is not sent, 1 process is sent successfully, 2 process is sent failed, 3 process is sent successfully and all failures are sent |
| warning_group_id | int | warning group |
| schedule_time | datetime | schedule time |
| start_time | datetime | start time |
| executor_id | int | executor id |
| dependence | varchar | dependence |
| update_time | datetime | update time |
| process_instance_priority | int | process instance priority: 0 Highest,1 High,2 Medium,3 Low,4 Lowest |
| worker_group_id | int | worker group id |



