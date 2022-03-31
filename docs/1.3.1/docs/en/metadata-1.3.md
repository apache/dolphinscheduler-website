# Dolphin Scheduler 1.3 Metadata document

<a name="25Ald"></a>
### Table overview
| Table Name | Table information |
| :---: | :---: |
| t_ds_access_token | Access the token of the ds backend |
| t_ds_alert | Warning message |
| t_ds_alertgroup | Alarm group |
| t_ds_command | Excuting an order |
| t_ds_datasource | data source |
| t_ds_error_command | Wrong command |
| t_ds_process_definition | Process definition |
| t_ds_process_instance | Process instance |
| t_ds_project | project |
| t_ds_queue | queue |
| t_ds_relation_datasource_user | User associated data source |
| t_ds_relation_process_instance | Subprocess |
| t_ds_relation_project_user | User-related projects |
| t_ds_relation_resources_user | User associated resources |
| t_ds_relation_udfs_user | User associated UDF function |
| t_ds_relation_user_alertgroup | User associated alarm group |
| t_ds_resources | resource |
| t_ds_schedules | Process timing scheduling |
| t_ds_session | User login session |
| t_ds_task_instance | Task instance |
| t_ds_tenant | Tenant |
| t_ds_udfs | UDF resources |
| t_ds_user | user |
| t_ds_version | ds version information |

<a name="VNVGr"></a>
### user	queue	data source
![image.png](/img/metadata-erd/user-queue-datasource.png)

- There can be multiple users under a tenant<br />
- The queue field in t_ds_user stores the queue_name information in the queue list, and t_ds_tenant stores queue_id. During the execution of the process definition, the user queue has the highest priority. If the user queue is empty, the tenant queue is used<br />
- The user_id field in the t_ds_datasource table represents the user who created the data source, and the user_id in t_ds_relation_datasource_user represents the user who has permission to the data source<br />
<a name="HHyGV"></a>
### project	Resources	Alert
![image.png](/img/metadata-erd/project-resource-alert.png)

- A user can have multiple projects, and the user project is authorized to complete the relationship binding between project_id and user_id through the t_ds_relation_project_user table<br />
- The user_id in the t_ds_projcet table represents the user who created the project, and the user_id in the t_ds_relation_project_user table represents the user who has permission to the project<br />
- The user_id in the t_ds_resources table represents the user who created the resource, and the user_id in t_ds_relation_resources_user represents the user who has permission to the resource<br />
- The user_id in the t_ds_udfs table represents the user who created the UDF, and the user_id in the t_ds_relation_udfs_user table represents the user who has permission to the UDF<br />
<a name="Bg2Sn"></a>
### command	Process	task
![image.png](/img/metadata-erd/command.png)<br />![image.png](/img/metadata-erd/process-task.png)

- A project has multiple process definitions, one process definition can generate multiple process instances, and one process instance can generate multiple task instances<br />
- The t_ds_schedulers table stores the timing scheduling information defined by the process<br />
- The data stored in the t_ds_relation_process_instance table is used to handle the case where the process definition contains sub-processes. parent_process_instance_id represents the main process instance id containing the sub-process, process_instance_id represents the id of the sub-process instance, parent_task_instance_id represents the task instance id of the sub-process node, the process instance table and The task instance table corresponds to the t_ds_process_instance table and t_ds_task_instance table respectively
<a name="Pv25P"></a>
### Core table schema
<a name="32Jzd"></a>
#### t_ds_process_definition
| Field | Type | Comment |
| --- | --- | --- |
| id | int | Primary key |
| name | varchar | Process definition name |
| version | int | Process definition version |
| release_state | tinyint | Release status of the process definition: 0 Not online  1 Online |
| project_id | int | project id |
| user_id | int | User to whom the process definition belongs id |
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
| tenant_id | int | queue id |
| update_time | datetime | Update time |
| modify_by | varchar | Modify user |
| resource_ids | varchar | Resource id set |

<a name="e6jfz"></a>
#### t_ds_process_instance
| Field | Type | Comment |
| --- | --- | --- |
| id | int | Primary key |
| name | varchar | Process instance name |
| process_definition_id | int | Process definition id |
| state | tinyint | Process instance status: 0 Submitted successfully,1 running,2 Ready to pause,3 time out,4 Ready to stop,5 stop,6 failure,7 success,8 Need for fault tolerance,9 kill,10 Waiting thread,11 Wait for dependencies to complete |
| recovery | tinyint | Process instance fault tolerance ID: 0 normal,1 Need to be restarted by fault tolerance |
| start_time | datetime | Process instance start time |
| end_time | datetime | Process instance end time |
| run_times | int | Number of process instance runs |
| host | varchar | The machine where the process instance is located |
| command_type | tinyint | Command type: 0 Start the workflow,1 Start execution from the current node,2 Restore a fault-tolerant workflow,3 Resume suspended process,4 Start execution from the failed node,5 Complement,6 Scheduling,7 Rerun,8 time out,9 stop,10 Resume waiting thread |
| command_param | text | Command parameters (json format） |
| task_depend_type | tinyint | Node dependency type: 0 current node, 1 forward execution, 2 backward execution |
| max_try_times | tinyint | Maximum number of retries |
| failure_strategy | tinyint | Failure strategy 0 ends after failure, 1 continues after failure |
| warning_type | tinyint | Alarm type: 0 not sent, 1 sent if the process is successful, 2 sent if the process fails, 3 sent both if the process fails |
| warning_group_id | int | Alarm group id |
| schedule_time | datetime | Expected running time |
| command_start_time | datetime | Start command time |
| global_params | text | Global parameters (parameters defined by the curing process) |
| process_instance_json | longtext | Process instance json (json of the process definition of copy) |
| flag | tinyint | Is it available, 1 is available, 0 is not available |
| update_time | timestamp | Update time |
| is_sub_process | int | Is it a sub-workflow 1 yes, 0 no |
| executor_id | int | Command execution user |
| locations | text | Node coordinate information |
| connects | text | Node connection information |
| history_cmd | text | Historical commands, record all operations on process instances |
| dependence_schedule_times | text | Depend on the estimated time of the node |
| process_instance_priority | int | Process instance priority: 0 Highest, 1 High, 2 Medium, 3 Low, 4 Lowest |
| worker_group | varchar | Tasks specify the group of workers to run |
| timeout | int | overtime time |
| tenant_id | int | queue id |

<a name="IvHEc"></a>
#### t_ds_task_instance
|Field | Type | Comment |
| --- | --- | --- |
| id | int | Primary key |
| name | varchar | mission name |
| task_type | varchar | Task type |
| process_definition_id | int | Process definition id |
| process_instance_id | int | Process instance id |
| task_json | longtext | Task node json |
| state | tinyint | Task instance status: 0 submitted successfully, 1 running, 2 ready to be suspended, 3 suspended, 4 ready to stop, 5 stopped, 6 failed, 7 successful, 8 needs fault tolerance, 9 kill, 10 waiting for thread, 11 waiting for dependency to complete |
| submit_time | datetime | Task submission time |
| start_time | datetime | Task start time |
| end_time | datetime | Task end time |
| host | varchar | The machine performing the task |
| execute_path | varchar | Task execution path |
| log_path | varchar | Task log path |
| alert_flag | tinyint | Whether to alert |
| retry_times | int | number of retries |
| pid | int | Process pid |
| app_link | varchar | yarn app id |
| flag | tinyint | vailability: 0 is not available, 1 is available |
| retry_interval | int | Retry interval |
| max_retry_times | int | Maximum number of retries |
| task_instance_priority | int | Task instance priority: 0 Highest, 1 High, 2 Medium, 3 Low, 4 Lowest |
| worker_group | varchar | Tasks specify the group of workers to run |

<a name="pPQkU"></a>
#### t_ds_schedules
| Field | Type | Comment |
| --- | --- | --- |
| id | int | Primary key |
| process_definition_id | int | Process definition id |
| start_time | datetime | Schedule start time |
| end_time | datetime | Schedule end time |
| crontab | varchar | crontab expression |
| failure_strategy | tinyint | Failure strategy: 0 ends, 1 continues |
| user_id | int | User id |
| release_state | tinyint | Status: 0 not online, 1 online |
| warning_type | tinyint | Alarm type: 0 not sent, 1 sent if the process is successful, 2 sent if the process fails, 3 sent both if the process fails |
| warning_group_id | int | Alarm group id |
| process_instance_priority | int | Process instance priority：0 Highest,1 High,2 Medium,3 Low,4 Lowest |
| worker_group | varchar | Tasks specify the group of workers to run |
| create_time | datetime | Creation time |
| update_time | datetime | Update time |

<a name="TkQzn"></a>
#### t_ds_command
| Field | Type | Comment |
| --- | --- | --- |
| id | int | Primary key |
| command_type | tinyint | Command type: 0 start the workflow, 1 start execution from the current node, 2 resume the fault-tolerant workflow, 3 resume the suspended process, 4 start execution from the failed node, 5 complement, 6 schedule, 7 rerun, 8 pause, 9 Stop, 10 resume waiting thread |
| process_definition_id | int | Process definition id |
| command_param | text | Command parameters (json format) |
| task_depend_type | tinyint | Node dependency type: 0 current node, 1 forward execution, 2 backward execution |
| failure_strategy | tinyint | Failure strategy: 0 ends, 1 continues |
| warning_type | tinyint | Alarm type: 0 not sent, 1 sent if the process is successful, 2 sent if the process fails, 3 sent both if the process fails |
| warning_group_id | int | Alarm group |
| schedule_time | datetime | Expected running time |
| start_time | datetime | Starting time |
| executor_id | int | Execute user id |
| dependence | varchar | Dependent field |
| update_time | datetime | Update time |
| process_instance_priority | int | Process instance priority：0 Highest,1 High,2 Medium,3 Low,4 Lowest |
| worker_group | varchar | Tasks specify the group of workers to run |



