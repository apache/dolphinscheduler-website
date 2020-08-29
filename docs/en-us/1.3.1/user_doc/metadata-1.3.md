# Dolphin Scheduler 1.3 Metadata File

<a name="25Ald"></a>
### Table overview
| Table Name | Table information |
| :---: | :---: |
| t_ds_access_token | Token to access ds backend |
| t_ds_alert | Alarm information |
| t_ds_alertgroup | Alarm Group |
| t_ds_command | Excuting an order |
| t_ds_datasource | Data Source |
| t_ds_error_command | Wrong command |
| t_ds_process_definition | Process definition |
| t_ds_process_instance | Process instance |
| t_ds_project | Project |
| t_ds_queue | Queue |
| t_ds_relation_datasource_user | User-linked data source |
| t_ds_relation_process_instance | Subprocess |
| t_ds_relation_project_user | User related items |
| t_ds_relation_resources_user | User-linked resources |
| t_ds_relation_udfs_user | User associated UDF function |
| t_ds_relation_user_alertgroup | User-associated alarm group |
| t_ds_resources | Resource |
| t_ds_schedules | Process scheduling |
| t_ds_session | User login session |
| t_ds_task_instance | Task instance |
| t_ds_tenant | Tenant |
| t_ds_udfs | UDF resources |
| t_ds_user | User |
| t_ds_version | ds version information |

<a name="VNVGr"></a>
### User	Queue	Data Source
![image.png](/img/metadata-erd/user-queue-datasource.png)

- There can be multiple users under one tenant<br />
- The queue field in t_ds_user stores the queue_name information in the team list, and the queue_id is stored in t_ds_tenant. During the process of process definition execution, The user queue has the highest priority, and the user queue is empty, the tenant queue is used<br />
- The user_id field in the t_ds_datasource table represents the user who created the data source, and the user_id in t_ds_relation_datasource_user represents the user who has permission to the data source<br />
<a name="HHyGV"></a>
### Project	Resources	Alarm
![image.png](/img/metadata-erd/project-resource-alert.png)

- A user can have multiple projects, user project authorization through the t_ds_relation_project_user table to complete the relationship between project_id and user_id<br />
- The user_id in the t_ds_projcet table represents the user who created the project, and the user_id in the t_ds_relation_project_user table represents the user who has permission to the project<br />
- The user_id in the t_ds_resources table represents the user who created the resource, and the user_id in t_ds_relation_resources_user represents the user who has permission to the resource<br />
- The user_id in the t_ds_udfs table represents the user who created the UDF, and the user_id in the t_ds_relation_udfs_user table represents the user who has permission to the UDF<br />
<a name="Bg2Sn"></a>
### Command	Process	Task
![image.png](/img/metadata-erd/command.png)<br />![image.png](/img/metadata-erd/process-task.png)

- A project has multiple process definitions, a process definition can generate multiple process instances, and a process instance can generate multiple task instances<br />
- The t_ds_schedulers table stores the scheduled scheduling information defined by the process<br />
- The data stored in the t_ds_relation_process_instance table is used to handle the case where the process definition contains sub-processes. parent_process_instance_id represents the main process instance id containing the sub-process, process_instance_id represents the id of the sub-process instance, parent_task_instance_id represents the task instance id of the sub-process node, the process instance table and The task instance table corresponds to t_ds_process_instance table and t_ds_task_instance table respectively
<a name="Pv25P"></a>
### Core table Schema
<a name="32Jzd"></a>
#### t_ds_process_definition
| Field | Types | Annotate |
| --- | --- | --- |
| id | int | Primary key |
| name | varchar | Process definition name |
| version | int | Process definition version |
| release_state | tinyint | Process definition release status: 0 is not online 1 is online |
| project_id | int | Project id |
| user_id | int | User ID to which the process definition belongs |
| process_definition_json | longtext | Process definition json string |
| description | text | Process definition description |
| global_params | text | Global parameters |
| flag | tinyint | Whether the process is available: 0 is not available, 1 is available |
| locations | text | Node coordinate information |
| connects | text | Node connection information |
| receivers | text | Recipient |
| receivers_cc | text | Cc |
| create_time | datetime | Creation time |
| timeout | int | overtime time |
| tenant_id | int | Tenant id |
| update_time | datetime | CTenant id |
| modify_by | varchar | Modify user |
| resource_ids | varchar | Resource id set |

<a name="e6jfz"></a>
#### t_ds_process_instance
| Field | Types | Annotate |
| --- | --- | --- |
| id | int | Primary key |
| name | varchar | Process instance name |
| process_definition_id | int | Process definition id |
| state | tinyint | Process instance status: 0 Submitted successfully, 1 running, 2 ready to pause, 3 pause, 4 ready to stop, 5 stop, 6 fail, 7 successful, 8 fault tolerant, 9 kill, 10 wait for thread, 11 wait for dependency to complete |
| recovery | tinyint | Process instance fault tolerance flag: 0 normal, 1 needs to be restarted by fault tolerance |
| start_time | datetime | Process instance start time |
| end_time | datetime | Process instance end time |
| run_times | int | Process instance run times |
| host | varchar | The machine where the process instance is located |
| command_type | tinyint | Command type: 0 start workflow, 1 start execution from current node, 2 resume fault-tolerant workflow, 3 resume pause process, 4 start execution from failed node, 5 complement, 6 scheduling, 7 rerun, 8 pause, 9 Stop, 10 resume waiting threads |
| command_param | text | Command parameters (json format) |
| task_depend_type | tinyint | Node dependency type: 0 current node, 1 forward execution, 2 backward execution |
| max_try_times | tinyint | Maximum number of retries |
| failure_strategy | tinyint | Failure strategy 0 End after failure, 1 Continue after failure |
| warning_type | tinyint | Alarm type: 0 is not sent, 1 is sent successfully, 2 is sent when the process fails, 3 is sent when it is successful |
| warning_group_id | int | Alarm group id |
| schedule_time | datetime | Expected running time |
| command_start_time | datetime | Start command time |
| global_params | text | Global parameters (parameters defined by the curing process) |
| process_instance_json | longtext | Process instance json (copy process defined json) |
| flag | tinyint | Is it available, 1 is available, 0 is not available |
| update_time | timestamp | Update time |
| is_sub_process | int | Is it a sub-workflow 1 Yes, 0 is not |
| executor_id | int | Command execution user |
| locations | text | Node coordinate information |
| connects | text | Node connection information |
| history_cmd | text | History commands to record all operations on process instances |
| dependence_schedule_times | text | Node-dependent estimated time |
| process_instance_priority | int | Process instance priority：0 Highest,1 High,2 Medium,3 Low,4 Lowest |
| worker_group | varchar | Tasks specify the group of workers to run |
| timeout | int | Overtime time |
| tenant_id | int | Tenant id |

<a name="IvHEc"></a>
#### t_ds_task_instance
| Field | Types | Annotate |
| --- | --- | --- |
| id | int | Primary key |
| name | varchar | Task name |
| task_type | varchar | Task type |
| process_definition_id | int | Process definition id |
| process_instance_id | int | Process instance id |
| task_json | longtext | Task node json |
| state | tinyint | Task instance status: 0 submitted successfully, 1 running, 2 ready to pause, 3 suspended, 4 ready to stop, 5 stopped, 6 failed, 7 successful, 8 requires fault tolerance, 9 kill, 10 wait for thread, 11 wait for dependency to complete |
| submit_time | datetime | Task submission time |
| start_time | datetime | Task start time |
| end_time | datetime | Task end time |
| host | varchar | Machines performing tasks |
| execute_path | varchar | Task execution path |
| log_path | varchar | Task log path |
| alert_flag | tinyint | Whether to alarm |
| retry_times | int | Number of retries |
| pid | int | Process pid |
| app_link | varchar | yarn app id |
| flag | tinyint | Availability: 0 is not available, 1 is available |
| retry_interval | int | Retry interval |
| max_retry_times | int | Maximum number of retries |
| task_instance_priority | int | Task instance priority：0 Highest,1 High,2 Medium,3 Low,4 Lowest |
| worker_group | varchar | Tasks specify the group of workers to run |

<a name="pPQkU"></a>
#### t_ds_schedules
| Field | Types | Annotate |
| --- | --- | --- |
| id | int | Primary key |
| process_definition_id | int | Process definition id |
| start_time | datetime | Schedule start time |
| end_time | datetime | Schedule end time |
| crontab | varchar | crontab expression |
| failure_strategy | tinyint | Failure strategy: 0 ends, 1 continues |
| user_id | int | User id |
| release_state | tinyint | Status: 0 not online, 1 online |
| warning_type | tinyint | Alarm type: 0 is not sent, 1 is sent successfully, 2 is sent when the process fails, 3 is sent when it is successful |
| warning_group_id | int | Alarm group id |
| process_instance_priority | int | Process instance priority：0 Highest,1 High,2 Medium,3 Low,4 Lowest |
| worker_group | varchar | Tasks specify the group of workers to run |
| create_time | datetime | Creation time |
| update_time | datetime | Update time |

<a name="TkQzn"></a>
#### t_ds_command
| Field | Types | Annotate |
| --- | --- | --- |
| id | int | Primary key |
| command_type | tinyint | Command type: 0 start workflow, 1 start execution from current node, 2 resume fault-tolerant workflow, 3 resume pause process, 4 start execution from failed node, 5 complement, 6 scheduling, 7 rerun, 8 pause, 9 Stop, 10 resume waiting threads |
| process_definition_id | int | Process definition id |
| command_param | text | Command parameters (json format) |
| task_depend_type | tinyint | Node dependency type: 0 current node, 1 forward execution, 2 backward execution |
| failure_strategy | tinyint | Failure strategy: 0 ends, 1 continues |
| warning_type | tinyint | Alarm type: 0 is not sent, 1 is sent successfully, 2 is sent when the process fails, 3 is sent when it is successful |
| warning_group_id | int | Alarm Group |
| schedule_time | datetime | Expected running time |
| start_time | datetime | Starting time |
| executor_id | int | Execution user id |
| dependence | varchar | Dependent field |
| update_time | datetime | Update time |
| process_instance_priority | int | Process instance priority：0 Highest,1 High,2 Medium,3 Low,4 Lowest |
| worker_group | varchar | Tasks specify the group of workers to run |



