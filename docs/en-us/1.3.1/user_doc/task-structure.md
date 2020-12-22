
# Overall task storage structure
All tasks created in dolphinscheduler are saved in the t_ds_process_definition table.

The database table structure is shown in the following table:


Serial number | Field  | Types  |  Description
-------- | ---------| -------- | ---------
1|id|int(11)|Primary key
2|name|varchar(255)|Process definition name
3|version|int(11)|Process definition version
4|release_state|tinyint(4)|Release status of the process definition：0 not online, 1 online
5|project_id|int(11)|Project id
6|user_id|int(11)|User id of the process definition
7|process_definition_json|longtext|Process definition JSON
8|description|text|Process definition description
9|global_params|text|Global parameters
10|flag|tinyint(4)|Whether the process is available: 0 is not available, 1 is available
11|locations|text|Node coordinate information
12|connects|text|Node connection information
13|receivers|text|Recipient
14|receivers_cc|text|Cc
15|create_time|datetime|Creation time
16|timeout|int(11) |overtime time
17|tenant_id|int(11) |Tenant id
18|update_time|datetime|Update time
19|modify_by|varchar(36)|Modify user
20|resource_ids|varchar(255)|Resource ids

The process_definition_json field is the core field, which defines the task information in the DAG diagram. The data is stored in JSON.

The public data structure is as follows.
Serial number | Field  | Types  |  Description
-------- | ---------| -------- | ---------
1|globalParams|Array|Global parameters
2|tasks|Array|Task collection in the process  [ Please refer to the following chapters for the structure of each type]
3|tenantId|int|Tenant id
4|timeout|int|overtime time

Data example:
```bash
{
    "globalParams":[
        {
            "prop":"golbal_bizdate",
            "direct":"IN",
            "type":"VARCHAR",
            "value":"${system.biz.date}"
        }
    ],
    "tasks":Array[1],
    "tenantId":0,
    "timeout":0
}
```

# Detailed explanation of the storage structure of each task type

## Shell node
**The node data structure is as follows:**
Serial number|Field||Types|Description |Description
-------- | ---------| ---------| -------- | --------- | ---------
1|id | |String| Task code|
2|type ||String |Type |SHELL
3| name| |String|Name |
4| params| |Object| Custom parameters |Json format
5| |rawScript |String| Shell script |
6| | localParams| Array|Custom parameters||
7| | resourceList| Array|Resource||
8|description | |String|Description | |
9|runFlag | |String |Run ID| |
10|conditionResult | |Object|Conditional branch | |
11| | successNode| Array|Jump to node successfully| |
12| | failedNode|Array|Failed jump node | 
13| dependence| |Object |Task dependency |Mutually exclusive with params
14|maxRetryTimes | |String|Maximum number of retries | |
15|retryInterval | |String |Retry interval| |
16|timeout | |Object|Timeout control | |
17| taskInstancePriority| |String|Task priority | |
18|workerGroup | |String |Worker Grouping| |
19|preTasks | |Array|Predecessor | |


**Sample node data:**

```bash
{
    "type":"SHELL",
    "id":"tasks-80760",
    "name":"Shell Task",
    "params":{
        "resourceList":[
            {
                "id":3,
                "name":"run.sh",
                "res":"run.sh"
            }
        ],
        "localParams":[

        ],
        "rawScript":"echo "This is a shell script""
    },
    "description":"",
    "runFlag":"NORMAL",
    "conditionResult":{
        "successNode":[
            ""
        ],
        "failedNode":[
            ""
        ]
    },
    "dependence":{

    },
    "maxRetryTimes":"0",
    "retryInterval":"1",
    "timeout":{
        "strategy":"",
        "interval":null,
        "enable":false
    },
    "taskInstancePriority":"MEDIUM",
    "workerGroup":"default",
    "preTasks":[

    ]
}

```


## SQL node
Perform data query and update operations on the specified data source through SQL.

**The node data structure is as follows:**
Serial number|Parameter name||Types|Description |Description
-------- | ---------| ---------| -------- | --------- | ---------
1|id | |String| Task code|
2|type ||String |Type |SQL
3| name| |String|Name |
4| params| |Object| Custom parameters |Json 格式
5| |type |String | Database type
6| |datasource |Int | Data source id
7| |sql |String | Query SQL statement
8| |udfs | String| udf function|UDF function ids, separated by commas.
9| |sqlType | String| SQL node type |0 query, 1 non query
10| |title |String | Mail title
11| |receivers |String | Recipient
12| |receiversCc |String | Cc
13| |showType | String| Mail display type|TABLE table  ,  ATTACHMENT attachment
14| |connParams | String| Connection parameters
15| |preStatements | Array| Pre-SQL
16| | postStatements| Array|Post SQL||
17| | localParams| Array|Custom parameters||
18|description | |String|Dscription | |
19|runFlag | |String |Run ID| |
20|conditionResult | |Object|Conditional branch | |
21| | successNode| Array|Jump to node successfully| |
22| | failedNode|Array|Failed jump node | 
23| dependence| |Object |Task dependency |Mutually exclusive with params
24|maxRetryTimes | |String|Maximum number of retries | |
25|retryInterval | |String |Retry interval| |
26|timeout | |Object|Timeout control | |
27| taskInstancePriority| |String|Task priority | |
28|workerGroup | |String |Worker Grouping| |
29|preTasks | |Array|Predecessor | |


**Sample node data:**

```bash
{
    "type":"SQL",
    "id":"tasks-95648",
    "name":"SqlTask-Query",
    "params":{
        "type":"MYSQL",
        "datasource":1,
        "sql":"select id , namge , age from emp where id =  ${id}",
        "udfs":"",
        "sqlType":"0",
        "title":"xxxx@xxx.com",
        "receivers":"xxxx@xxx.com",
        "receiversCc":"",
        "showType":"TABLE",
        "localParams":[
            {
                "prop":"id",
                "direct":"IN",
                "type":"INTEGER",
                "value":"1"
            }
        ],
        "connParams":"",
        "preStatements":[
            "insert into emp ( id,name ) value (1,'Li' )"
        ],
        "postStatements":[

        ]
    },
    "description":"",
    "runFlag":"NORMAL",
    "conditionResult":{
        "successNode":[
            ""
        ],
        "failedNode":[
            ""
        ]
    },
    "dependence":{

    },
    "maxRetryTimes":"0",
    "retryInterval":"1",
    "timeout":{
        "strategy":"",
        "interval":null,
        "enable":false
    },
    "taskInstancePriority":"MEDIUM",
    "workerGroup":"default",
    "preTasks":[

    ]
}
```


## PROCEDURE [stored procedure] node
**The node data structure is as follows:**
**Sample node data:**

## SPARK node
**The node data structure is as follows:**

Serial number|Parameter name||Types|Description |Description
-------- | ---------| ---------| -------- | --------- | ---------
1|id | |String| Task code|
2|type ||String |Types of |SPARK
3| name| |String|Name |
4| params| |Object| Custom parameters |Json format
5| |mainClass |String | Run the main class
6| |mainArgs | String| Operating parameters
7| |others | String| Other parameters
8| |mainJar |Object | Program jar package
9| |deployMode |String | Deployment mode  |local,client,cluster
10| |driverCores | String| Driver core
11| |driverMemory | String| Driver memory
12| |numExecutors |String | Number of executors
13| |executorMemory |String | Executor memory
14| |executorCores |String | Number of executor cores
15| |programType | String| Type program|JAVA,SCALA,PYTHON
16| | sparkVersion| String|	Spark version| SPARK1 , SPARK2
17| | localParams| Array|Custom parameters
18| | resourceList| Array|Resource
19|description | |String|Description | |
20|runFlag | |String |Run ID| |
21|conditionResult | |Object|Conditional branch | |
22| | successNode| Array|Jump to node successfully| |
23| | failedNode|Array|Failed jump node | 
24| dependence| |Object |Task dependency |Mutually exclusive with params
25|maxRetryTimes | |String|Maximum number of retries | |
26|retryInterval | |String |Retry interval| |
27|timeout | |Object|Timeout control | |
28| taskInstancePriority| |String|Task priority | |
29|workerGroup | |String |Worker Grouping| |
30|preTasks | |Array|Predecessor | |


**Sample node data:**

```bash
{
    "type":"SPARK",
    "id":"tasks-87430",
    "name":"SparkTask",
    "params":{
        "mainClass":"org.apache.spark.examples.SparkPi",
        "mainJar":{
            "id":4
        },
        "deployMode":"cluster",
        "resourceList":[
            {
                "id":3,
                "name":"run.sh",
                "res":"run.sh"
            }
        ],
        "localParams":[

        ],
        "driverCores":1,
        "driverMemory":"512M",
        "numExecutors":2,
        "executorMemory":"2G",
        "executorCores":2,
        "mainArgs":"10",
        "others":"",
        "programType":"SCALA",
        "sparkVersion":"SPARK2"
    },
    "description":"",
    "runFlag":"NORMAL",
    "conditionResult":{
        "successNode":[
            ""
        ],
        "failedNode":[
            ""
        ]
    },
    "dependence":{

    },
    "maxRetryTimes":"0",
    "retryInterval":"1",
    "timeout":{
        "strategy":"",
        "interval":null,
        "enable":false
    },
    "taskInstancePriority":"MEDIUM",
    "workerGroup":"default",
    "preTasks":[

    ]
}
```



## MapReduce (MR) node
**The node data structure is as follows:**

Serial number|Parameter name||Types|Description |描Description述
-------- | ---------| ---------| -------- | --------- | ---------
1|id | |String| Task code|
2|type ||String |Type |MR
3| name| |String|Name |
4| params| |Object| Custom parameters |Json format
5| |mainClass |String | Run the main class
6| |mainArgs | String| Operating parameters
7| |others | String| Other parameters
8| |mainJar |Object | Program jar package
9| |programType | String| Program type|JAVA,PYTHON
10| | localParams| Array|Custom parameters
11| | resourceList| Array|Resource
12|description | |String|Description | |
13|runFlag | |String |Run ID| |
14|conditionResult | |Object|Conditional branch | |
15| | successNode| Array|Jump to node successfully| |
16| | failedNode|Array|Failed jump node | 
17| dependence| |Object |Task dependency |Mutually exclusive with params
18|maxRetryTimes | |String|Maximum number of retries | |
19|retryInterval | |String |Retry interval| |
20|timeout | |Object|Timeout control | |
21| taskInstancePriority| |String|Task priority | |
22|workerGroup | |String |Worker Grouping| |
23|preTasks | |Array|Predecessor | |



**Sample node data:**

```bash
{
    "type":"MR",
    "id":"tasks-28997",
    "name":"MRTask",
    "params":{
        "mainClass":"wordcount",
        "mainJar":{
            "id":5
        },
        "resourceList":[
            {
                "id":3,
                "name":"run.sh",
                "res":"run.sh"
            }
        ],
        "localParams":[

        ],
        "mainArgs":"/tmp/wordcount/input /tmp/wordcount/output/",
        "others":"",
        "programType":"JAVA"
    },
    "description":"",
    "runFlag":"NORMAL",
    "conditionResult":{
        "successNode":[
            ""
        ],
        "failedNode":[
            ""
        ]
    },
    "dependence":{

    },
    "maxRetryTimes":"0",
    "retryInterval":"1",
    "timeout":{
        "strategy":"",
        "interval":null,
        "enable":false
    },
    "taskInstancePriority":"MEDIUM",
    "workerGroup":"default",
    "preTasks":[

    ]
}
```


## Python node
**The node data structure is as follows:**
Serial number|parameter name||Types|Description |Description
-------- | ---------| ---------| -------- | --------- | ---------
1|id | |String| Task code|
2|type ||String |Type |PYTHON
3| name| |String|Name |
4| params| |Object| Custom parameters |Json format
5| |rawScript |String| Python script |
6| | localParams| Array|Custom parameters||
7| | resourceList| Array|Resource||
8|description | |String|Description | |
9|runFlag | |String |Run ID| |
10|conditionResult | |Object|Conditional branch | |
11| | successNode| Array|Jump to node successfully| |
12| | failedNode|Array|Failed jump node | 
13| dependence| |Object |Task dependency |Mutually exclusive with params
14|maxRetryTimes | |String|Maximum number of retries | |
15|retryInterval | |String |Retry interval| |
16|timeout | |Object|Timeout control | |
17| taskInstancePriority| |String|Task priority | |
18|workerGroup | |String |Worker Grouping| |
19|preTasks | |Array|Predecessor | |


**Sample node data:**

```bash
{
    "type":"PYTHON",
    "id":"tasks-5463",
    "name":"Python Task",
    "params":{
        "resourceList":[
            {
                "id":3,
                "name":"run.sh",
                "res":"run.sh"
            }
        ],
        "localParams":[

        ],
        "rawScript":"print("This is a python script")"
    },
    "description":"",
    "runFlag":"NORMAL",
    "conditionResult":{
        "successNode":[
            ""
        ],
        "failedNode":[
            ""
        ]
    },
    "dependence":{

    },
    "maxRetryTimes":"0",
    "retryInterval":"1",
    "timeout":{
        "strategy":"",
        "interval":null,
        "enable":false
    },
    "taskInstancePriority":"MEDIUM",
    "workerGroup":"default",
    "preTasks":[

    ]
}
```




## Flink node
**The node data structure is as follows:**

Serial number|Parameter name||Types|Description |Description
-------- | ---------| ---------| -------- | --------- | ---------
1|id | |String| Task code|
2|type ||String |Type |FLINK
3| name| |String|Name |
4| params| |Object| Custom parameters |Json format
5| |mainClass |String | Run the main class
6| |mainArgs | String| Operating parameters
7| |others | String| Other parameters
8| |mainJar |Object | Program jar package
9| |deployMode |String | Deployment mode  |local,client,cluster
10| |slot | String| Number of slots
11| |taskManager |String | Number of taskManage
12| |taskManagerMemory |String | TaskManager memory
13| |jobManagerMemory |String | JobManager memory number
14| |programType | String| Program type|JAVA,SCALA,PYTHON
15| | localParams| Array|Custom parameters
16| | resourceList| Array|Resource
17|description | |String|Description | |
18|runFlag | |String |Run ID| |
19|conditionResult | |Object|Conditional branch | |
20| | successNode| Array|Jump to node successfully| |
21| | failedNode|Array|Failed jump node | 
22| dependence| |Object |Task dependency |Mutually exclusive with params
23|maxRetryTimes | |String|Maximum number of retries | |
24|retryInterval | |String |Retry interval| |
25|timeout | |Object|Timeout control | |
26| taskInstancePriority| |String|Task priority | |
27|workerGroup | |String |Worker Grouping| |
38|preTasks | |Array|Predecessor | |


**Sample node data:**

```bash
{
    "type":"FLINK",
    "id":"tasks-17135",
    "name":"FlinkTask",
    "params":{
        "mainClass":"com.flink.demo",
        "mainJar":{
            "id":6
        },
        "deployMode":"cluster",
        "resourceList":[
            {
                "id":3,
                "name":"run.sh",
                "res":"run.sh"
            }
        ],
        "localParams":[

        ],
        "slot":1,
        "taskManager":"2",
        "jobManagerMemory":"1G",
        "taskManagerMemory":"2G",
        "executorCores":2,
        "mainArgs":"100",
        "others":"",
        "programType":"SCALA"
    },
    "description":"",
    "runFlag":"NORMAL",
    "conditionResult":{
        "successNode":[
            ""
        ],
        "failedNode":[
            ""
        ]
    },
    "dependence":{

    },
    "maxRetryTimes":"0",
    "retryInterval":"1",
    "timeout":{
        "strategy":"",
        "interval":null,
        "enable":false
    },
    "taskInstancePriority":"MEDIUM",
    "workerGroup":"default",
    "preTasks":[

    ]
}
```

## HTTP node
**The node data structure is as follows:**

Serial number|Parameter name||Type|Description |Description
-------- | ---------| ---------| -------- | --------- | ---------
1|id | |String| Task code|
2|type ||String |Type |HTTP
3| name| |String|Name |
4| params| |Object| Custom parameters |Json format
5| |url |String | Request address
6| |httpMethod | String| Request method|GET,POST,HEAD,PUT,DELETE
7| | httpParams| Array|Request parameter
8| |httpCheckCondition | String| Check conditions|Default response code 200
9| |condition |String | Check content
10| | localParams| Array|Custom parameters
11|description | |String|Description | |
12|runFlag | |String |Run ID| |
13|conditionResult | |Object|Conditional branch | |
14| | successNode| Array|Jump to node successfully| |
15| | failedNode|Array|Failed jump node | 
16| dependence| |Object |Task dependency |Mutually exclusive with params
17|maxRetryTimes | |String|Maximum number of retries | |
18|retryInterval | |String |Retry interval| |
19|timeout | |Object|Timeout control | |
20| taskInstancePriority| |String|Task priority | |
21|workerGroup | |String |Worker Grouping| |
22|preTasks | |Array|Predecessor | |


**Sample node data:**

```bash
{
    "type":"HTTP",
    "id":"tasks-60499",
    "name":"HttpTask",
    "params":{
        "localParams":[

        ],
        "httpParams":[
            {
                "prop":"id",
                "httpParametersType":"PARAMETER",
                "value":"1"
            },
            {
                "prop":"name",
                "httpParametersType":"PARAMETER",
                "value":"Bo"
            }
        ],
        "url":"https://www.xxxxx.com:9012",
        "httpMethod":"POST",
        "httpCheckCondition":"STATUS_CODE_DEFAULT",
        "condition":""
    },
    "description":"",
    "runFlag":"NORMAL",
    "conditionResult":{
        "successNode":[
            ""
        ],
        "failedNode":[
            ""
        ]
    },
    "dependence":{

    },
    "maxRetryTimes":"0",
    "retryInterval":"1",
    "timeout":{
        "strategy":"",
        "interval":null,
        "enable":false
    },
    "taskInstancePriority":"MEDIUM",
    "workerGroup":"default",
    "preTasks":[

    ]
}
```



## DataX node

**The node data structure is as follows:**
Serial number|Parameter name||Types|Description |Description
-------- | ---------| ---------| -------- | --------- | ---------
1|id | |String| Task code|
2|type ||String |Type |DATAX
3| name| |String|Name |
4| params| |Object| Custom parameters |Json format
5| |customConfig |Int | Custom type| 0 custom, 1 custom
6| |dsType |String | Source database type
7| |dataSource |Int | Source database ID
8| |dtType | String| Target database type
9| |dataTarget | Int| Target database ID 
10| |sql |String | SQL statement
11| |targetTable |String | Target table
12| |jobSpeedByte |Int | Current limit (bytes)
13| |jobSpeedRecord | Int| Current limit (number of records)
14| |preStatements | Array| Pre-SQL
15| | postStatements| Array|Post SQL
16| | json| String|Custom configuration|Effective when customConfig=1
17| | localParams| Array|Custom parameters|Effective when customConfig=1
18|description | |String|Description | |
19|runFlag | |String |Run ID| |
20|conditionResult | |Object|Conditional branch | |
21| | successNode| Array|Jump to node successfully| |
22| | failedNode|Array|Failed jump node | 
23| dependence| |Object |Task dependency |Mutually exclusive with params
24|maxRetryTimes | |String|Maximum number of retries | |
25|retryInterval | |String |Retry interval| |
26|timeout | |Object|Timeout control | |
27| taskInstancePriority| |String|Task priority | |
28|workerGroup | |String |Worker Grouping| |
29|preTasks | |Array|Predecessor | |



**Sample node data:**


```bash
{
    "type":"DATAX",
    "id":"tasks-91196",
    "name":"DataxTask-DB",
    "params":{
        "customConfig":0,
        "dsType":"MYSQL",
        "dataSource":1,
        "dtType":"MYSQL",
        "dataTarget":1,
        "sql":"select id, name ,age from user ",
        "targetTable":"emp",
        "jobSpeedByte":524288,
        "jobSpeedRecord":500,
        "preStatements":[
            "truncate table emp "
        ],
        "postStatements":[
            "truncate table user"
        ]
    },
    "description":"",
    "runFlag":"NORMAL",
    "conditionResult":{
        "successNode":[
            ""
        ],
        "failedNode":[
            ""
        ]
    },
    "dependence":{

    },
    "maxRetryTimes":"0",
    "retryInterval":"1",
    "timeout":{
        "strategy":"",
        "interval":null,
        "enable":false
    },
    "taskInstancePriority":"MEDIUM",
    "workerGroup":"default",
    "preTasks":[

    ]
}
```

## Sqoop node

**The node data structure is as follows:**
Serial number|parameter name||Types|Description |Description
-------- | ---------| ---------| -------- | --------- | ---------
1|id | |String| Task code|
2|type ||String |Type |SQOOP
3| name| |String|Name |
4| params| |Object| Custom parameters |JSON format
5| | concurrency| Int|Concurrency
6| | modelType|String |Flow direction|import,export
7| |sourceType|String |Data source type |
8| |sourceParams |String| Data source parameters| JSON format
9| | targetType|String |Target data type
10| |targetParams | String|Target data parameters|JSON format
11| |localParams |Array |Custom parameters
12|description | |String|Description | |
13|runFlag | |String |Run ID| |
14|conditionResult | |Object|Conditional branch | |
15| | successNode| Array|Jump to node successfully| |
16| | failedNode|Array|Failed jump node | 
17| dependence| |Object |Task dependency |Mutually exclusive with params
18|maxRetryTimes | |String|Maximum number of retries | |
19|retryInterval | |String |Retry interval| |
20|timeout | |Object|Timeout control | |
21| taskInstancePriority| |String|Task priority | |
22|workerGroup | |String |Worker Grouping| |
23|preTasks | |Array|Predecessor | |




**Sample node data:**

```bash
{
            "type":"SQOOP",
            "id":"tasks-82041",
            "name":"Sqoop Task",
            "params":{
                "concurrency":1,
                "modelType":"import",
                "sourceType":"MYSQL",
                "targetType":"HDFS",
                "sourceParams":"{"srcType":"MYSQL","srcDatasource":1,"srcTable":"","srcQueryType":"1","srcQuerySql":"selec id , name from user","srcColumnType":"0","srcColumns":"","srcConditionList":[],"mapColumnHive":[{"prop":"hivetype-key","direct":"IN","type":"VARCHAR","value":"hivetype-value"}],"mapColumnJava":[{"prop":"javatype-key","direct":"IN","type":"VARCHAR","value":"javatype-value"}]}",
                "targetParams":"{"targetPath":"/user/hive/warehouse/ods.db/user","deleteTargetDir":false,"fileType":"--as-avrodatafile","compressionCodec":"snappy","fieldsTerminated":",","linesTerminated":"@"}",
                "localParams":[

                ]
            },
            "description":"",
            "runFlag":"NORMAL",
            "conditionResult":{
                "successNode":[
                    ""
                ],
                "failedNode":[
                    ""
                ]
            },
            "dependence":{

            },
            "maxRetryTimes":"0",
            "retryInterval":"1",
            "timeout":{
                "strategy":"",
                "interval":null,
                "enable":false
            },
            "taskInstancePriority":"MEDIUM",
            "workerGroup":"default",
            "preTasks":[

            ]
        }
```

## Conditional branch node

**The node data structure is as follows:**
Serial number|Parameter name||Types|Description |Description
-------- | ---------| ---------| -------- | --------- | ---------
1|id | |String| Task code|
2|type ||String |Type |SHELL
3| name| |String|Name |
4| params| |Object| Custom parameters | null
5|description | |String|Description | |
6|runFlag | |String |Run ID| |
7|conditionResult | |Object|Conditional branch | |
8| | successNode| Array|Jump to node successfully| |
9| | failedNode|Array|Failed jump node | 
10| dependence| |Object |Task dependency |Mutually exclusive with params
11|maxRetryTimes | |String|Maximum number of retries | |
12|retryInterval | |String |Retry interval| |
13|timeout | |Object|Timeout control | |
14| taskInstancePriority| |String|Task priority | |
15|workerGroup | |String |Worker Grouping| |
16|preTasks | |Array|Predecessor | |


**Sample node data:**

```bash
{
    "type":"CONDITIONS",
    "id":"tasks-96189",
    "name":"条件",
    "params":{

    },
    "description":"",
    "runFlag":"NORMAL",
    "conditionResult":{
        "successNode":[
            "test04"
        ],
        "failedNode":[
            "test05"
        ]
    },
    "dependence":{
        "relation":"AND",
        "dependTaskList":[

        ]
    },
    "maxRetryTimes":"0",
    "retryInterval":"1",
    "timeout":{
        "strategy":"",
        "interval":null,
        "enable":false
    },
    "taskInstancePriority":"MEDIUM",
    "workerGroup":"default",
    "preTasks":[
        "test01",
        "test02"
    ]
}
```


## Subprocess node
**The node data structure is as follows:**
Serial number|Parameter name||Types|Description |Description
-------- | ---------| ---------| -------- | --------- | ---------
1|id | |String| Task code|
2|type ||String |Type |SHELL
3| name| |String|Name |
4| params| |Object| Custom parameters |Json format
5| |processDefinitionId |Int| Process definition id
6|description | |String|Description | |
7|runFlag | |String |Run ID| |
8|conditionResult | |Object|Conditional branch | |
9| | successNode| Array|Jump to node successfully| |
10| | failedNode|Array|Failed jump node | 
11| dependence| |Object |Task dependency |Mutually exclusive with params
12|maxRetryTimes | |String|Maximum number of retries | |
13|retryInterval | |String |Retry interval| |
14|timeout | |Object|Timeout control | |
15| taskInstancePriority| |String|Task priority | |
16|workerGroup | |String |Worker Grouping| |
17|preTasks | |Array|Predecessor | |


**Sample node data:**

```bash
{
            "type":"SUB_PROCESS",
            "id":"tasks-14806",
            "name":"SubProcessTask",
            "params":{
                "processDefinitionId":2
            },
            "description":"",
            "runFlag":"NORMAL",
            "conditionResult":{
                "successNode":[
                    ""
                ],
                "failedNode":[
                    ""
                ]
            },
            "dependence":{

            },
            "timeout":{
                "strategy":"",
                "interval":null,
                "enable":false
            },
            "taskInstancePriority":"MEDIUM",
            "workerGroup":"default",
            "preTasks":[

            ]
        }
```



## DEPENDENT node
**The node data structure is as follows:**

**The node data structure is as follows:**
Serial number|parameter name||Types|Description |Description
-------- | ---------| ---------| -------- | --------- | ---------
1|id | |String| Task code|
2|type ||String |Type |DEPENDENT
3| name| |String|Name |
4| params| |Object| Custom parameters |Json format
5| |rawScript |String| Shell script |
6| | localParams| Array|Custom parameters||
7| | resourceList| Array|Resource||
8|description | |String|Description | |
9|runFlag | |String |Run ID| |
10|conditionResult | |Object|Conditional branch | |
11| | successNode| Array|Jump to node successfully| |
12| | failedNode|Array|Failed jump node | 
13| dependence| |Object |Task dependency |Mutually exclusive with params
14| | relation|String |Relationship |AND,OR
15| | dependTaskList|Array |Dependent task list |
16|maxRetryTimes | |String|Maximum number of retries | |
17|retryInterval | |String |Retry interval| |
18|timeout | |Object|Timeout control | |
19| taskInstancePriority| |String|Task priority | |
20|workerGroup | |String |Worker Grouping| |
21|preTasks | |Array|Predecessor | |


**Sample node data:**

```bash
{
            "type":"DEPENDENT",
            "id":"tasks-57057",
            "name":"DenpendentTask",
            "params":{

            },
            "description":"",
            "runFlag":"NORMAL",
            "conditionResult":{
                "successNode":[
                    ""
                ],
                "failedNode":[
                    ""
                ]
            },
            "dependence":{
                "relation":"AND",
                "dependTaskList":[
                    {
                        "relation":"AND",
                        "dependItemList":[
                            {
                                "projectId":1,
                                "definitionId":7,
                                "definitionList":[
                                    {
                                        "value":8,
                                        "label":"MRTask"
                                    },
                                    {
                                        "value":7,
                                        "label":"FlinkTask"
                                    },
                                    {
                                        "value":6,
                                        "label":"SparkTask"
                                    },
                                    {
                                        "value":5,
                                        "label":"SqlTask-Update"
                                    },
                                    {
                                        "value":4,
                                        "label":"SqlTask-Query"
                                    },
                                    {
                                        "value":3,
                                        "label":"SubProcessTask"
                                    },
                                    {
                                        "value":2,
                                        "label":"Python Task"
                                    },
                                    {
                                        "value":1,
                                        "label":"Shell Task"
                                    }
                                ],
                                "depTasks":"ALL",
                                "cycle":"day",
                                "dateValue":"today"
                            }
                        ]
                    },
                    {
                        "relation":"AND",
                        "dependItemList":[
                            {
                                "projectId":1,
                                "definitionId":5,
                                "definitionList":[
                                    {
                                        "value":8,
                                        "label":"MRTask"
                                    },
                                    {
                                        "value":7,
                                        "label":"FlinkTask"
                                    },
                                    {
                                        "value":6,
                                        "label":"SparkTask"
                                    },
                                    {
                                        "value":5,
                                        "label":"SqlTask-Update"
                                    },
                                    {
                                        "value":4,
                                        "label":"SqlTask-Query"
                                    },
                                    {
                                        "value":3,
                                        "label":"SubProcessTask"
                                    },
                                    {
                                        "value":2,
                                        "label":"Python Task"
                                    },
                                    {
                                        "value":1,
                                        "label":"Shell Task"
                                    }
                                ],
                                "depTasks":"SqlTask-Update",
                                "cycle":"day",
                                "dateValue":"today"
                            }
                        ]
                    }
                ]
            },
            "maxRetryTimes":"0",
            "retryInterval":"1",
            "timeout":{
                "strategy":"",
                "interval":null,
                "enable":false
            },
            "taskInstancePriority":"MEDIUM",
            "workerGroup":"default",
            "preTasks":[

            ]
        }
```
