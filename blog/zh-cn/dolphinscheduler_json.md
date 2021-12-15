## dolphinscheduler json拆解

## 1、为什么拆解json

在dolphinscheduler 1.3.x及以前的工作流中的任务及任务关系保存时是以大json的方式保存到数据库中process_definiton表的process_definition_json字段，如果某个工作流很大比如有100或者1000个任务，这个json字段也就非常大，在使用时需要解析json，非常耗费性能，且任务没法重用；基于大json，在工作流版本及任务版本上也没有好的实现方案，否则会导致数据大量冗余。

故社区计划启动json拆解项目，实现的需求目标：

- 大json完全拆分
- 新增工作流及任务版本
- 引入全局唯一键(code)

## 2、如何设计拆解后的表

### 1、1.3.6版本工作流

1、比如在当前1.3.6版本创建个a-->b的工作流

![image-20210524102618970](https://dolphinscheduler.apache.org/img/dolphinscheduler_json_20210601/image-20210524102618970.png)

以下是processDefiniton save 接口在controller入口打印的入参日志

```
create  process definition, project name: hadoop, process definition name: ab, process_definition_json: {"globalParams":[],"tasks":[{"type":"SHELL","id":"tasks-77643","name":"a","params":{"resourceList":[],"localParams":[{"prop":"yesterday","direct":"IN","type":"VARCHAR","value":"${system.biz.date}"}],"rawScript":"echo ${yesterday}"},"description":"","timeout":{"strategy":"","interval":null,"enable":false},"runFlag":"NORMAL","conditionResult":{"successNode":[""],"failedNode":[""]},"dependence":{},"maxRetryTimes":"0","retryInterval":"1","taskInstancePriority":"MEDIUM","workerGroup":"default","preTasks":[]},{"type":"SHELL","id":"tasks-99814","name":"b","params":{"resourceList":[],"localParams":[{"prop":"today","direct":"IN","type":"VARCHAR","value":"${system.biz.curdate}"}],"rawScript":"echo ${today}"},"description":"","timeout":{"strategy":"","interval":null,"enable":false},"runFlag":"NORMAL","conditionResult":{"successNode":[""],"failedNode":[""]},"dependence":{},"maxRetryTimes":"0","retryInterval":"1","taskInstancePriority":"MEDIUM","workerGroup":"default","preTasks":["a"]}],"tenantId":1,"timeout":0}, desc:  locations:{"tasks-77643":{"name":"a","targetarr":"","nodenumber":"1","x":251,"y":166},"tasks-99814":{"name":"b","targetarr":"tasks-77643","nodenumber":"0","x":533,"y":161}}, connects:[{"endPointSourceId":"tasks-77643","endPointTargetId":"tasks-99814"}]
```

2、依赖节点的工作流，dep是依赖节点

![image-20210524104503423](https://dolphinscheduler.apache.org/img/dolphinscheduler_json_20210601/image-20210524104503423.png)



以下是processDefiniton save 接口在controller入口打印的入参日志

```
 create  process definition, project name: hadoop, process definition name: dep_c, process_definition_json: {"globalParams":[],"tasks":[{"type":"SHELL","id":"tasks-69503","name":"c","params":{"resourceList":[],"localParams":[],"rawScript":"echo 11"},"description":"","timeout":{"strategy":"","interval":null,"enable":false},"runFlag":"NORMAL","conditionResult":{"successNode":[""],"failedNode":[""]},"dependence":{},"maxRetryTimes":"0","retryInterval":"1","taskInstancePriority":"MEDIUM","workerGroup":"default","preTasks":["dep"]},{"type":"DEPENDENT","id":"tasks-22756","name":"dep","params":{},"description":"","timeout":{"strategy":"","interval":null,"enable":false},"runFlag":"NORMAL","conditionResult":{"successNode":[""],"failedNode":[""]},"dependence":{"relation":"AND","dependTaskList":[{"relation":"AND","dependItemList":[{"projectId":1,"definitionId":1,"depTasks":"b","cycle":"day","dateValue":"today"}]}]},"maxRetryTimes":"0","retryInterval":"1","taskInstancePriority":"MEDIUM","workerGroup":"default","preTasks":[]}],"tenantId":1,"timeout":0}, desc:  locations:{"tasks-69503":{"name":"c","targetarr":"tasks-22756","nodenumber":"0","x":597,"y":166},"tasks-22756":{"name":"dep","targetarr":"","nodenumber":"1","x":308,"y":164}}, connects:[{"endPointSourceId":"tasks-22756","endPointTargetId":"tasks-69503"}]
```



3、条件判断的工作流

![image-20210524104218236](https://dolphinscheduler.apache.org/img/dolphinscheduler_json_20210601/image-20210524104218236.png)

以下是processDefiniton save 接口在controller入口打印的入参日志

```
create  process definition, project name: hadoop, process definition name: condition_test, process_definition_json: {"globalParams":[],"tasks":[{"type":"SHELL","id":"tasks-68456","name":"d","params":{"resourceList":[],"localParams":[],"rawScript":"echo 11"},"description":"","timeout":{"strategy":"","interval":null,"enable":false},"runFlag":"NORMAL","conditionResult":{"successNode":[""],"failedNode":[""]},"dependence":{},"maxRetryTimes":"0","retryInterval":"1","taskInstancePriority":"MEDIUM","workerGroup":"default","preTasks":[]},{"type":"SHELL","id":"tasks-58183","name":"e","params":{"resourceList":[],"localParams":[],"rawScript":"echo 22"},"description":"","timeout":{"strategy":"","interval":null,"enable":false},"runFlag":"NORMAL","conditionResult":{"successNode":[""],"failedNode":[""]},"dependence":{},"maxRetryTimes":"0","retryInterval":"1","taskInstancePriority":"MEDIUM","workerGroup":"default","preTasks":["cond"]},{"type":"SHELL","id":"tasks-43996","name":"f","params":{"resourceList":[],"localParams":[],"rawScript":"echo 33"},"description":"","timeout":{"strategy":"","interval":null,"enable":false},"runFlag":"NORMAL","conditionResult":{"successNode":[""],"failedNode":[""]},"dependence":{},"maxRetryTimes":"0","retryInterval":"1","taskInstancePriority":"MEDIUM","workerGroup":"default","preTasks":["cond"]},{"type":"CONDITIONS","id":"tasks-38972","name":"cond","params":{},"description":"","timeout":{"strategy":"","interval":null,"enable":false},"runFlag":"NORMAL","conditionResult":{"successNode":["e"],"failedNode":["f"]},"dependence":{"relation":"AND","dependTaskList":[{"relation":"AND","dependItemList":[{"depTasks":"d","status":"SUCCESS"}]}]},"maxRetryTimes":"0","retryInterval":"1","taskInstancePriority":"MEDIUM","workerGroup":"default","preTasks":["d"]}],"tenantId":1,"timeout":0}, desc:  locations:{"tasks-68456":{"name":"d","targetarr":"","nodenumber":"1","x":168,"y":158},"tasks-58183":{"name":"e","targetarr":"tasks-38972","nodenumber":"0","x":573,"y":82},"tasks-43996":{"name":"f","targetarr":"tasks-38972","nodenumber":"0","x":591,"y":288},"tasks-38972":{"name":"cond","targetarr":"tasks-68456","nodenumber":"2","x":382,"y":175}}, connects:[{"endPointSourceId":"tasks-68456","endPointTargetId":"tasks-38972"},{"endPointSourceId":"tasks-38972","endPointTargetId":"tasks-58183"},{"endPointSourceId":"tasks-38972","endPointTargetId":"tasks-43996"}]
```

从以上三个案例中，我们知道controller的入口参数的每个参数都可以在t_ds_process_definition表中找到对应，故表中数据如下图

![image-20210524104838911](https://dolphinscheduler.apache.org/img/dolphinscheduler_json_20210601/image-20210524104838911.png)

### 2、拆解后的表设计思路

工作流只是dag的展现形式，任务通过工作流进行组织，组织的同时存在了任务之间的关系，也就是依赖。就好比一个画板，画板上有些图案，工作流就是画板，图案就是任务，图案之间的关系就是依赖。而调度的核心是调度任务，依赖只是表述调度的先后顺序。当前定时还是对整个工作流进行的定时，拆解后就方便对单独任务进行调度。正是基于这个思想设计了拆解的思路，所以这就需要三张表，工作流定义表、任务定义表、任务关系表。

- 工作流定义表：描述工作流的基本信息，比如全局参数、dag中节点的位置信息
- 任务定义表：描述任务的详情信息，比如任务类别、任务容错信息、优先级等
- 任务关系表：描述任务的关系信息，比如当前节点、前置节点等

基于这个设计思想再扩展到版本，无非是对于这三张表，每张表新增个保存版本的日志表。

#### 工作流定义表

现在看案例中save接口日志，现有字段(project、process_definition_name、desc、locations、connects)，对于json中除了task之外的还剩下 

```json
{"globalParams":[],"tenantId":1,"timeout":0}
```

所以可知工作流定义表：

```sql
CREATE TABLE `t_ds_process_definition` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'self-increasing id',
  `code` bigint(20) NOT NULL COMMENT 'encoding',
  `name` varchar(200) DEFAULT NULL COMMENT 'process definition name',
  `version` int(11) DEFAULT NULL COMMENT 'process definition version',
  `description` text COMMENT 'description',
  `project_code` bigint(20) NOT NULL COMMENT 'project code',
  `release_state` tinyint(4) DEFAULT NULL COMMENT 'process definition release state：0:offline,1:online',
  `user_id` int(11) DEFAULT NULL COMMENT 'process definition creator id',
  `global_params` text COMMENT 'global parameters',
  `flag` tinyint(4) DEFAULT NULL COMMENT '0 not available, 1 available',
  `locations` text COMMENT 'Node location information',
  `connects` text COMMENT 'Node connection information',
  `warning_group_id` int(11) DEFAULT NULL COMMENT 'alert group id',
  `timeout` int(11) DEFAULT '0' COMMENT 'time out, unit: minute',
  `tenant_id` int(11) NOT NULL DEFAULT '-1' COMMENT 'tenant id',
  `create_time` datetime NOT NULL COMMENT 'create time',
  `update_time` datetime DEFAULT NULL COMMENT 'update time',
  PRIMARY KEY (`id`,`code`),
  UNIQUE KEY `process_unique` (`name`,`project_code`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `t_ds_process_definition_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'self-increasing id',
  `code` bigint(20) NOT NULL COMMENT 'encoding',
  `name` varchar(200) DEFAULT NULL COMMENT 'process definition name',
  `version` int(11) DEFAULT NULL COMMENT 'process definition version',
  `description` text COMMENT 'description',
  `project_code` bigint(20) NOT NULL COMMENT 'project code',
  `release_state` tinyint(4) DEFAULT NULL COMMENT 'process definition release state：0:offline,1:online',
  `user_id` int(11) DEFAULT NULL COMMENT 'process definition creator id',
  `global_params` text COMMENT 'global parameters',
  `flag` tinyint(4) DEFAULT NULL COMMENT '0 not available, 1 available',
  `locations` text COMMENT 'Node location information',
  `connects` text COMMENT 'Node connection information',
  `warning_group_id` int(11) DEFAULT NULL COMMENT 'alert group id',
  `timeout` int(11) DEFAULT '0' COMMENT 'time out,unit: minute',
  `tenant_id` int(11) NOT NULL DEFAULT '-1' COMMENT 'tenant id',
  `operator` int(11) DEFAULT NULL COMMENT 'operator user id',
  `operate_time` datetime DEFAULT NULL COMMENT 'operate time',
  `create_time` datetime NOT NULL COMMENT 'create time',
  `update_time` datetime DEFAULT NULL COMMENT 'update time',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

从表字段可以看出 日志表仅仅比主表多了两个字段operator、operate_time



#### 任务定义表

案例中ab工作流task的json

```json
	"tasks": [{
		"type": "SHELL",
		"id": "tasks-77643",
		"name": "a",
		"params": {
			"resourceList": [],
			"localParams": [{
				"prop": "yesterday",
				"direct": "IN",
				"type": "VARCHAR",
				"value": "${system.biz.date}"
			}],
			"rawScript": "echo ${yesterday}"
		},
		"description": "",
		"timeout": {
			"strategy": "",
			"interval": null,
			"enable": false
		},
		"runFlag": "NORMAL",
		"conditionResult": {
			"successNode": [""],
			"failedNode": [""]
		},
		"dependence": {},
		"maxRetryTimes": "0",
		"retryInterval": "1",
		"taskInstancePriority": "MEDIUM",
		"workerGroup": "default",
		"preTasks": []
	}, {
		"type": "SHELL",
		"id": "tasks-99814",
		"name": "b",
		"params": {
			"resourceList": [],
			"localParams": [{
				"prop": "today",
				"direct": "IN",
				"type": "VARCHAR",
				"value": "${system.biz.curdate}"
			}],
			"rawScript": "echo ${today}"
		},
		"description": "",
		"timeout": {
			"strategy": "",
			"interval": null,
			"enable": false
		},
		"runFlag": "NORMAL",
		"conditionResult": {
			"successNode": [""],
			"failedNode": [""]
		},
		"dependence": {},
		"maxRetryTimes": "0",
		"retryInterval": "1",
		"taskInstancePriority": "MEDIUM",
		"workerGroup": "default",
		"preTasks": ["a"]
	}]
```

dep_c工作流task的json

```json
	"tasks": [{
		"type": "SHELL",
		"id": "tasks-69503",
		"name": "c",
		"params": {
			"resourceList": [],
			"localParams": [],
			"rawScript": "echo 11"
		},
		"description": "",
		"timeout": {
			"strategy": "",
			"interval": null,
			"enable": false
		},
		"runFlag": "NORMAL",
		"conditionResult": {
			"successNode": [""],
			"failedNode": [""]
		},
		"dependence": {},
		"maxRetryTimes": "0",
		"retryInterval": "1",
		"taskInstancePriority": "MEDIUM",
		"workerGroup": "default",
		"preTasks": ["dep"]
	}, {
		"type": "DEPENDENT",
		"id": "tasks-22756",
		"name": "dep",
		"params": {},
		"description": "",
		"timeout": {
			"strategy": "",
			"interval": null,
			"enable": false
		},
		"runFlag": "NORMAL",
		"conditionResult": {
			"successNode": [""],
			"failedNode": [""]
		},
		"dependence": {
			"relation": "AND",
			"dependTaskList": [{
				"relation": "AND",
				"dependItemList": [{
					"projectId": 1,
					"definitionId": 1,
					"depTasks": "b",
					"cycle": "day",
					"dateValue": "today"
				}]
			}]
		},
		"maxRetryTimes": "0",
		"retryInterval": "1",
		"taskInstancePriority": "MEDIUM",
		"workerGroup": "default",
		"preTasks": []
	}]
```

condition_test工作流task的json

```json
	"tasks": [{
		"type": "SHELL",
		"id": "tasks-68456",
		"name": "d",
		"params": {
			"resourceList": [],
			"localParams": [],
			"rawScript": "echo 11"
		},
		"description": "",
		"timeout": {
			"strategy": "",
			"interval": null,
			"enable": false
		},
		"runFlag": "NORMAL",
		"conditionResult": {
			"successNode": [""],
			"failedNode": [""]
		},
		"dependence": {},
		"maxRetryTimes": "0",
		"retryInterval": "1",
		"taskInstancePriority": "MEDIUM",
		"workerGroup": "default",
		"preTasks": []
	}, {
		"type": "SHELL",
		"id": "tasks-58183",
		"name": "e",
		"params": {
			"resourceList": [],
			"localParams": [],
			"rawScript": "echo 22"
		},
		"description": "",
		"timeout": {
			"strategy": "",
			"interval": null,
			"enable": false
		},
		"runFlag": "NORMAL",
		"conditionResult": {
			"successNode": [""],
			"failedNode": [""]
		},
		"dependence": {},
		"maxRetryTimes": "0",
		"retryInterval": "1",
		"taskInstancePriority": "MEDIUM",
		"workerGroup": "default",
		"preTasks": ["cond"]
	}, {
		"type": "SHELL",
		"id": "tasks-43996",
		"name": "f",
		"params": {
			"resourceList": [],
			"localParams": [],
			"rawScript": "echo 33"
		},
		"description": "",
		"timeout": {
			"strategy": "",
			"interval": null,
			"enable": false
		},
		"runFlag": "NORMAL",
		"conditionResult": {
			"successNode": [""],
			"failedNode": [""]
		},
		"dependence": {},
		"maxRetryTimes": "0",
		"retryInterval": "1",
		"taskInstancePriority": "MEDIUM",
		"workerGroup": "default",
		"preTasks": ["cond"]
	}, {
		"type": "CONDITIONS",
		"id": "tasks-38972",
		"name": "cond",
		"params": {},
		"description": "",
		"timeout": {
			"strategy": "",
			"interval": null,
			"enable": false
		},
		"runFlag": "NORMAL",
		"conditionResult": {
			"successNode": ["e"],
			"failedNode": ["f"]
		},
		"dependence": {
			"relation": "AND",
			"dependTaskList": [{
				"relation": "AND",
				"dependItemList": [{
					"depTasks": "d",
					"status": "SUCCESS"
				}]
			}]
		},
		"maxRetryTimes": "0",
		"retryInterval": "1",
		"taskInstancePriority": "MEDIUM",
		"workerGroup": "default",
		"preTasks": ["d"]
	}]
```

从案例中可以知道SHELL/DEPENDENT/CONDITIONS类型的节点的json构成（其他任务类似SHELL），preTasks标识前置依赖节点。conditionResult结构比较固定，而dependence结构复杂，DEPENDENT和CONDITIONS类型任务的dependence结构还不一样，所以为了统一，我们将conditionResult和dependence整体放到params中，params对应表字段的task_params。

这样我们就确定了t_ds_task_definition表

```mysql
CREATE TABLE `t_ds_task_definition` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'self-increasing id',
  `code` bigint(20) NOT NULL COMMENT 'encoding',
  `name` varchar(200) DEFAULT NULL COMMENT 'task definition name',
  `version` int(11) DEFAULT NULL COMMENT 'task definition version',
  `description` text COMMENT 'description',
  `project_code` bigint(20) NOT NULL COMMENT 'project code',
  `user_id` int(11) DEFAULT NULL COMMENT 'task definition creator id',
  `task_type` varchar(50) NOT NULL COMMENT 'task type',
  `task_params` text COMMENT 'job custom parameters',
  `flag` tinyint(2) DEFAULT NULL COMMENT '0 not available, 1 available',
  `task_priority` tinyint(4) DEFAULT NULL COMMENT 'job priority',
  `worker_group` varchar(200) DEFAULT NULL COMMENT 'worker grouping',
  `fail_retry_times` int(11) DEFAULT NULL COMMENT 'number of failed retries',
  `fail_retry_interval` int(11) DEFAULT NULL COMMENT 'failed retry interval',
  `timeout_flag` tinyint(2) DEFAULT '0' COMMENT 'timeout flag:0 close, 1 open',
  `timeout_notify_strategy` tinyint(4) DEFAULT NULL COMMENT 'timeout notification policy: 0 warning, 1 fail',
  `timeout` int(11) DEFAULT '0' COMMENT 'timeout length,unit: minute',
  `delay_time` int(11) DEFAULT '0' COMMENT 'delay execution time,unit: minute',
  `resource_ids` varchar(255) DEFAULT NULL COMMENT 'resource id, separated by comma',
  `create_time` datetime NOT NULL COMMENT 'create time',
  `update_time` datetime DEFAULT NULL COMMENT 'update time',
  PRIMARY KEY (`id`,`code`),
  UNIQUE KEY `task_unique` (`name`,`project_code`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `t_ds_task_definition_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'self-increasing id',
  `code` bigint(20) NOT NULL COMMENT 'encoding',
  `name` varchar(200) DEFAULT NULL COMMENT 'task definition name',
  `version` int(11) DEFAULT NULL COMMENT 'task definition version',
  `description` text COMMENT 'description',
  `project_code` bigint(20) NOT NULL COMMENT 'project code',
  `user_id` int(11) DEFAULT NULL COMMENT 'task definition creator id',
  `task_type` varchar(50) NOT NULL COMMENT 'task type',
  `task_params` text COMMENT 'job custom parameters',
  `flag` tinyint(2) DEFAULT NULL COMMENT '0 not available, 1 available',
  `task_priority` tinyint(4) DEFAULT NULL COMMENT 'job priority',
  `worker_group` varchar(200) DEFAULT NULL COMMENT 'worker grouping',
  `fail_retry_times` int(11) DEFAULT NULL COMMENT 'number of failed retries',
  `fail_retry_interval` int(11) DEFAULT NULL COMMENT 'failed retry interval',
  `timeout_flag` tinyint(2) DEFAULT '0' COMMENT 'timeout flag:0 close, 1 open',
  `timeout_notify_strategy` tinyint(4) DEFAULT NULL COMMENT 'timeout notification policy: 0 warning, 1 fail',
  `timeout` int(11) DEFAULT '0' COMMENT 'timeout length,unit: minute',
  `delay_time` int(11) DEFAULT '0' COMMENT 'delay execution time,unit: minute',
  `resource_ids` varchar(255) DEFAULT NULL COMMENT 'resource id, separated by comma',
  `operator` int(11) DEFAULT NULL COMMENT 'operator user id',
  `operate_time` datetime DEFAULT NULL COMMENT 'operate time',
  `create_time` datetime NOT NULL COMMENT 'create time',
  `update_time` datetime DEFAULT NULL COMMENT 'update time',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

**注意：dev版本和1.3.6版本区别，dev版本已将description换成desc，并且新增了delayTime**

```json
{
	"globalParams": [],
	"tasks": [{
			"type": "SHELL",
			"id": "tasks-18200",
			"name": "d",
			"code": "",
			"params": {
				"resourceList": [],
				"localParams": [],
				"rawScript": "echo 5"
			},
			"desc": "",
			"runFlag": "NORMAL",
			"conditionResult": {
				"successNode": [
					""
				],
				"failedNode": [
					""
				]
			},
			"dependence": {},
			"maxRetryTimes": "0",
			"retryInterval": "1",
			"delayTime": "0",
			"timeout": {
				"strategy": "",
				"interval": null,
				"enable": false
			},
			"waitStartTimeout": {},
			"taskInstancePriority": "MEDIUM",
			"workerGroup": "hadoop",
			"preTasks": [],
			"depList": null
		},
		{
			"type": "SHELL",
			"id": "tasks-55225",
			"name": "e",
			"code": "",
			"params": {
				"resourceList": [],
				"localParams": [],
				"rawScript": "echo 6"
			},
			"desc": "",
			"runFlag": "NORMAL",
			"conditionResult": {
				"successNode": [
					""
				],
				"failedNode": [
					""
				]
			},
			"dependence": {},
			"maxRetryTimes": "0",
			"retryInterval": "1",
			"delayTime": "0",
			"timeout": {
				"strategy": "",
				"interval": null,
				"enable": false
			},
			"waitStartTimeout": {},
			"taskInstancePriority": "MEDIUM",
			"workerGroup": "hadoop",
			"preTasks": [
				"def"
			],
			"depList": null
		},
		{
			"type": "SHELL",
			"id": "tasks-67639",
			"name": "f",
			"code": "",
			"params": {
				"resourceList": [],
				"localParams": [],
				"rawScript": "echo 7"
			},
			"desc": "",
			"runFlag": "NORMAL",
			"conditionResult": {
				"successNode": [
					""
				],
				"failedNode": [
					""
				]
			},
			"dependence": {},
			"maxRetryTimes": "0",
			"retryInterval": "1",
			"delayTime": "0",
			"timeout": {
				"strategy": "",
				"interval": null,
				"enable": false
			},
			"waitStartTimeout": {},
			"taskInstancePriority": "MEDIUM",
			"workerGroup": "hadoop",
			"preTasks": [
				"def"
			],
			"depList": null
		},
		{
			"type": "CONDITIONS",
			"id": "tasks-67387",
			"name": "def",
			"code": "",
			"params": {},
			"desc": "",
			"runFlag": "NORMAL",
			"conditionResult": {
				"successNode": [
					"e"
				],
				"failedNode": [
					"f"
				]
			},
			"dependence": {
				"relation": "AND",
				"dependTaskList": [{
					"relation": "AND",
					"dependItemList": [{
							"depTasks": "d",
							"status": "SUCCESS"
						},
						{
							"depTasks": "d",
							"status": "FAILURE"
						}
					]
				}]
			},
			"maxRetryTimes": "0",
			"retryInterval": "1",
			"delayTime": "0",
			"timeout": {
				"strategy": "",
				"interval": null,
				"enable": false
			},
			"waitStartTimeout": {},
			"taskInstancePriority": "MEDIUM",
			"workerGroup": "hadoop",
			"preTasks": [
				"d"
			],
			"depList": null
		}
	],
	"tenantId": 1,
	"timeout": 0
}
```



#### 任务关系表

preTasks标识前置依赖节点，当前节点在关系表中使用postTask标识。由于当前节点肯定存在而前置节点不一定存在，所以post不可能为空，而preTask有可能为空

```mysql
CREATE TABLE `t_ds_process_task_relation` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'self-increasing id',
  `name` varchar(200) DEFAULT NULL COMMENT 'relation name',
  `process_definition_version` int(11) DEFAULT NULL COMMENT 'process version',
  `project_code` bigint(20) NOT NULL COMMENT 'project code',
  `process_definition_code` bigint(20) NOT NULL COMMENT 'process code',
  `pre_task_code` bigint(20) NOT NULL COMMENT 'pre task code',
  `pre_task_version` int(11) NOT NULL COMMENT 'pre task version',
  `post_task_code` bigint(20) NOT NULL COMMENT 'post task code',
  `post_task_version` int(11) NOT NULL COMMENT 'post task version',
  `condition_type` tinyint(2) DEFAULT NULL COMMENT 'condition type : 0 none, 1 judge 2 delay',
  `condition_params` text COMMENT 'condition params(json)',
  `create_time` datetime NOT NULL COMMENT 'create time',
  `update_time` datetime DEFAULT NULL COMMENT 'update time',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `t_ds_process_task_relation_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'self-increasing id',
  `name` varchar(200) DEFAULT NULL COMMENT 'relation name',
  `process_definition_version` int(11) DEFAULT NULL COMMENT 'process version',
  `project_code` bigint(20) NOT NULL COMMENT 'project code',
  `process_definition_code` bigint(20) NOT NULL COMMENT 'process code',
  `pre_task_code` bigint(20) NOT NULL COMMENT 'pre task code',
  `pre_task_version` int(11) NOT NULL COMMENT 'pre task version',
  `post_task_code` bigint(20) NOT NULL COMMENT 'post task code',
  `post_task_version` int(11) NOT NULL COMMENT 'post task version',
  `condition_type` tinyint(2) DEFAULT NULL COMMENT 'condition type : 0 none, 1 judge 2 delay',
  `condition_params` text COMMENT 'condition params(json)',
  `operator` int(11) DEFAULT NULL COMMENT 'operator user id',
  `operate_time` datetime DEFAULT NULL COMMENT 'operate time',
  `create_time` datetime NOT NULL COMMENT 'create time',
  `update_time` datetime DEFAULT NULL COMMENT 'update time',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

对于依赖关系复杂的场景

![image-20210524144950185](https://dolphinscheduler.apache.org/img/dolphinscheduler_json_20210601/image-20210524144950185.png)



## 3、API模块如何改造

![拆分方案-1620304011852](https://dolphinscheduler.apache.org/img/dolphinscheduler_json_20210601/1620304011852-1621754591271.png)

- [ ] api模块进行save操作时

1. 通过雪花算法生成13位的数字作为process_definition_code，工作流定义保存至process_definition（主表）和process_definition_log（日志表），这两个表保存的是同样的数据，工作流定义版本为1
2. 通过雪花算法生成13位的数字作为task_definition_code，任务定义表保存至task_definition（主表）和task_definition_log（日志表），也是保存同样的数据，任务定义版本为1
3. 工作流任务关系保存在 process_task_relation（主表）和process_task_relation_log（日志表），该表保存的code和version是工作流的code和version，因为任务是通过工作流进行组织，以工作流来画dag。也是通过post_task_code和post_task_version标识dag的当前节点，这个节点的前置依赖通过pre_task_code和pre_task_version来标识，如果没有依赖，pre_task_code和pre_task_version为0

- [ ] api模块进行update操作时，工作流定义和任务定义直接更新主表数据，更新后的数据insert到日志表。关系表主表先删除然后再插入新的关系，关系表日志表直接插入新的关系

- [ ] api模块进行delete操作时，工作流定义、任务定义和关系表直接删除主表数据，日志表数据不变动
- [ ] api模块进行switch操作时，直接将日志表中对应version数据覆盖到主表



## 4、数据交互如何改造

![json](https://dolphinscheduler.apache.org/img/dolphinscheduler_json_20210601/json.png)





- [ ] 在json拆分一期api模块controller层整体未变动，传入的大json还是在service层映射为ProcessData对象。insert或update操作在公共Service模块通过ProcessService.saveProcessDefiniton()入口完成保存数据库操作，按照task_definition、process_task_relation、process_definition的顺序保存。保存时，如果该任务已经存在并且关联的工作流未上线，则更改任务；如果任务关联的工作流已上线，则不允许更改任务

- [ ] api查询操作时，当前还是通过工作流id来查询，在公共Service模块通过ProcessService.genTaskNodeList()入口完成数据组装，还是组装为ProcessData对象，进而生成json返回
- [ ] Server模块（Master）也是通过公共Service模块ProcessService.genTaskNodeList()获得TaskNodeList生成调度dag，把当前任务所有信息放到 MasterExecThread.readyToSubmitTaskQueue队列，以便生成taskInstance，dispatch给worker



## 5、当前json还需做什么

- controller对外restAPI接口改造
- ui模块dag改造
- ui模块新增task操作页面



**processDefinition**

| 接口名称          | 参数名称             |              参数说明              | 数据类型   |
| ----------------- | -------------------- | :--------------------------------: | ---------- |
|                   | projectName          |              项目名称              | string     |
|                   | name                 |            流程定义名称            | string     |
|                   | description          |          流程定义描述信息          | string     |
|                   | globalParams         |              全局参数              | string     |
| save              | connects             | 流程定义节点图标连接信息(json格式) | string     |
|                   | locations            | 流程定义节点坐标位置信息(json格式) | string     |
|                   | **timeout**          |           **超时分钟数**           | **int**    |
|                   | **tenantId**         |             **租户id**             | **int**    |
|                   | **taskRelationJson** |       **任务关系(json格式)**       | **string** |
| --                | --                   |                 --                 | --         |
|                   | projectName          |              项目名称              | string     |
|                   | **code**             |          **流程定义code**          | **long**   |
|                   | name                 |            流程定义名称            | string     |
|                   | description          |          流程定义描述信息          | string     |
| update            | releaseState         | 发布流程定义,可用值:OFFLINE,ONLINE | ref        |
|                   | connects             | 流程定义节点图标连接信息(json格式) | string     |
|                   | locations            | 流程定义节点坐标位置信息(json格式) | string     |
|                   | **timeout**          |           **超时分钟数**           | **int**    |
|                   | **tenantId**         |             **租户id**             | **int**    |
|                   | **taskRelationJson** |       **任务关系(json格式)**       | **string** |
|                   | --                   |                 --                 | --         |
|                   | **code**             |          **流程定义code**          | **long**   |
| switch/deleteCode | projectName          |              项目名称              | string     |
|                   | version              |               版本号               | string     |

备注：taskRelationJson格式：[{"name":"","pre_task_code":0,"pre_task_version":0,"post_task_code":123456789,"post_task_version":1,"condition_type":0,"condition_params":{}},{"name":"","pre_task_code":123456789,"pre_task_version":1,"post_task_code":123451234,"post_task_version":1,"condition_type":0,"condition_params":{}}]

同理其他接口请求参数processDefinitionId换成code



**schedule**

|        接口名称         | 参数名称                | 参数说明                                             | 数据类型 |
| :---------------------: | :---------------------- | ---------------------------------------------------- | -------- |
|                         | **code**                | **流程定义code**                                     | **long** |
|                         | projectName             | 项目名称                                             | string   |
|                         | failureStrategy         | 失败策略,可用值:END,CONTINUE                         | string   |
|     createSchedule      | processInstancePriority | 流程实例优先级,可用值:HIGHEST,HIGH,MEDIUM,LOW,LOWEST | string   |
|                         | schedule                | 定时                                                 | string   |
|                         | warningGroupId          | 发送组ID                                             | int      |
|                         | warningType             | 发送策略,可用值:NONE,SUCCESS,FAILURE,ALL             | string   |
|                         | workerGroup             | workerGroup                                          | string   |
|           --            | --                      | --                                                   | --       |
|                         | **code**                | **流程定义code**                                     | **long** |
|                         | projectName             | 项目名称                                             | string   |
| queryScheduleListPaging | pageNo                  | 页码号                                               | int      |
|                         | pageSize                | 页大小                                               | int      |
|                         | searchVal               | 搜索值                                               | string   |

**taskDefinition**(新增)

| 接口名称            | 参数名称           | 参数说明  | 数据类型 |
| ------------------- | ------------------ | --------- | -------- |
| save                | projectName        | 项目名称  |          |
|                     | taskDefinitionJson | task信息  | string   |
| --                  | --                 | --        | --       |
|                     | projectName        | 项目名称  | string   |
| update              | code               | task code | long     |
|                     | taskDefinitionJson | task信息  | string   |
| --                  | --                 | --        | --       |
|                     | projectName        | 项目名称  | string   |
| switch/deleteCode   | task_code          | taskCode  | long     |
|                     | version            | 版本号    | int      |
| --                  | --                 | --        | --       |
| query/delete        | projectName        | 项目名称  | string   |
|                     | task_code          | task code | long     |
| --                  | --                 | --        | --       |
| queryTaskListPaging |                    |           |          |

taskDefinitionJson：[{"name":"test","description":"","task_type":"SHELL","task_params":[],"flag":0,"task_priority":0,"worker_group":"default","fail_retry_times":0,"fail_retry_interval":0,"timeout_flag":0,"timeout_notify_strategy":0,"timeout":0,"delay_time":0,"resource_ids":""}]



对应需求issue

```
[Feature][JsonSplit-api] api module controller design #5498 
1. [Feature][JsonSplit-api]processDefinition save/update interface  #5499 
2. [Feature][JsonSplit-api]processDefinition switch interface #5501 
3. [Feature][JsonSplit-api]processDefinition delete interface #5502 
4. [Feature][JsonSplit-api]processDefinition copy interface #5503 
5. [Feature][JsonSplit-api]processDefinition export interface #5504 
6. [Feature][JsonSplit-api]processDefinition list-paging interface #5505 
7. [Feature][JsonSplit-api]processDefinition move interface #5506 
8. [Feature][JsonSplit-api]processDefinition queryProcessDefinitionAllByProjectId interface #5507 
9. [Feature][JsonSplit-api]processDefinition select-by-id interface #5508 
10. [Feature][JsonSplit-api]processDefinition view-tree interface #5509 
11. [Feature][JsonSplit-api]schedule create interface #5510 
12. [Feature][JsonSplit-api]schedule list-paging interface #5511 
13. [Feature][JsonSplit-api]schedule update interface #5512 
14. [Feature][JsonSplit-api]taskDefinition save interface #5513 
15. [Feature][JsonSplit-api]taskDefinition update interface #5514 
16. [Feature][JsonSplit-api]taskDefinition switch interface #5515 
17. [Feature][JsonSplit-api]taskDefinition query interface #5516 
18. [Feature][JsonSplit-api]taskDefinition delete interface #5517 
19. [Feature][JsonSplit-api]WorkFlowLineage interface #5518 
20. [Feature][JsonSplit-api]analysis interface #5519 
21. [Feature][JsonSplit-api]executors interface #5520 
22. [Feature][JsonSplit-api]processInstance interface #5521 
23. [Feature][JsonSplit-api]project interface #5522 
```

