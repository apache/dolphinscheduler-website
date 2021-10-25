##  Why did we split the big json that holds the tasks and relationships in the DolphinScheduler workflow definition?

### The Background

Currently DolphinScheduler saves tasks and relationships in process as big json to the process_definition_json field in the process_definiton table in the database. If a process is large, for example, with 1000 tasks, the json field becomes very large and needs to be parsed when using the json, which is very performance intensive and the tasks cannot be reused, so the community plans to start a json splitting project. Encouragingly, we have now completed most of this work, so a summary is provided for your reference and learning.

### Summarization

The json split project was started on 2021-01-12 and the main development was initially completed by 2021-04-25. The code has been merged into the dev branch. Thanks to lenboo, JinyLeeChina, simon824 and wen-hemin for coding.

The main changes, as well as the contributions, are as follows:

- Code changes 12793 lines
- 168 files modified/added
- 145 Commits in total
- There were 85 PRs

### Review of the split programme

![拆分方案](https://user-images.githubusercontent.com/42576980/117598604-b1ad8e80-b17a-11eb-9d99-d593fce7bab6.png)

- [ ] When the api module performs a save operation

1. The process definition is saved to process_definition (main table) and process_definition_log (log table), both tables hold the same data and the process definition version is 1
2. The task definition table is saved to task_definition (main table) and task_definition_log (log table), also saving the same data, with task definition version 1
3. process task relationships are stored in the process_task_relation (main table) and process_task_relation_log (log table), which holds the code and version of the process, as tasks are organised through the process and the dag is drawn in terms of the process. The current node of the dag is also known by its post_task_code and post_task_version, the predecessor dependency of this node is identified by pre_task_code and pre_task_version, if there is no dependency, the pre_task_code and pre_task_version are and pre_task_version are 0 if there is no dependency

- [ ] When the api module performs an update operation, the process definition and task definition update the main table data directly, and the updated data is inserted into the log table. The main table is deleted and then inserted into the new relationship, and the log table is inserted directly into the new relationship.
- [ ] When the api module performs a delete operation, the process definition, task definition and relationship table are deleted directly from the master table, leaving the log table data unchanged.
- [ ] When the api module performs a switch operation, the corresponding version data in the log table is overwritten directly into the main table.

###  Json Access Solutions

![json](https://user-images.githubusercontent.com/42576980/117598643-c9851280-b17a-11eb-9a6e-c81ee083b09c.png)

- [ ] In the current phase of the splitting scheme, the api module controller layer remains unchanged and the incoming big json is still mapped to ProcessData objects in the service layer. insert or update operations are done in the public Service module through the ProcessService. saveProcessDefiniton() entry in the public Service module, which saves the database operations in the order of task_definition, process_task_relation, process_definition. When saving, the task is changed if it already exists and the associated process is not online; if the task is associated with a process that is already online, the task is not allowed to be changed

- [ ] The data is assembled in the public Service module through the ProcessService.genTaskNodeList() entry, or assembled into a ProcessData object, which in turn generates a json to return
- [ ] The Server module (Master) also gets the TaskNodeList through the public Service module ProcessService.genTaskNodeList() to generate the dispatch dag, which puts all the information about the current task into the MasterExecThread. readyToSubmitTaskQueue queue in order to generate taskInstance, dispatch to worker



## Phase 2 Planning

### API / UI module transformation

- [ ] The processDefinition interface requests a back-end replacement for processDefinitonCode via processDefinitionId
- [ ] Support for separate definition of task, the current task is inserted and modified through the workflow, Phase 2 needs to support separate definition
- [ ] Frontend and backend controller layer json splitting, Phase 1 has completed the api module service layer to dao json splitting, Phase 2 needs to complete the front-end and controller layer json splitting

### server module retrofit

- [ ] Replace process_definition_id with process_definition_code in t_ds_command and t_ds_error_command、t_ds_schedules
- [ ] Generating a taskInstance process transformation

The current process_instance is generated from the process_definition and schedules and command tables, while the taskInstance is generated from the MasterExecThread. readyToSubmitTaskQueue queue, and the data in the queue comes from the dag object. At this point, the queue and dag hold all the information about the taskInstance, which is very memory intensive. It can be modified to the following data flow, where the readyToSubmitTaskQueue queue and dag hold the task code and version information, and the task_definition is queried before the task_instance is generated

![server](https://user-images.githubusercontent.com/42576980/117598659-d3a71100-b17a-11eb-8fe1-8725299510e6.png)

---

**Appendix: The snowflake algorithm**

**snowflake:** is an algorithm for generating distributed, drama-wide unique IDs called **snowflake**, which was created by Twitter and used for tweeting IDs.

A Snowflake ID has 64 bits. the first 41 bits are timestamps, representing the number of milliseconds since the selected period. The next 10 bits represent the computer ID to prevent conflicts. The remaining 12 bits represent the serial number of the generated ID on each machine, which allows multiple Snowflake IDs to be created in the same millisecond. snowflakeIDs are generated based on time and can therefore be ordered by time. In addition, the generation time of an ID can be inferred from itself and vice versa. This feature can be used to filter IDs by time, and the objects associated with them.

1. **Structure of the snowflake algorithm:**

     ![snowflake](https://github.com/apache/dolphinscheduler-website/blob/master/img/JsonSplit/snowflake.png?raw=true)

     It is divided into 5 main parts.

     1. is 1 bit: 0, this is meaningless.
     2. is 41 bits: this represents the timestamp
     3. is 10 bits: the room id, 0000000000, as 0 is passed in at this point.
     4. is 12 bits: the serial number, which is the serial number of the ids generated at the same time during the millisecond on a machine in a certain room, 0000 0000 0000.

     Next we will explain the four parts:

**1 bit, which is meaningless:**

Because the first bit in binary is a negative number if it is 1, but the ids we generate are all positive, so the first bit is always 0.

**41 bit: This is a timestamp in milliseconds.**

41 bit can represent as many numbers as 2^41 - 1, i.e. it can identify 2 ^ 41 - 1 milliseconds, which translates into 69 years of time.

**10 bit: Record the work machine ID, which represents this service up to 2 ^ 10 machines, which is 1024 machines.**

But in 10 bits 5 bits represent the machine room id and 5 bits represent the machine id, which means up to 2 ^ 5 machine rooms (32 machine rooms), each of which can represent 2 ^ 5 machines (32 machines), which can be split up as you wish, for example by taking out 4 bits to identify the service number and the other 6 bits as the machine number. This can be combined in any way you like.

**12 bit: This is used to record the different ids generated in the same millisecond.**

12 bit can represent the maximum integer of 2 ^ 12 - 1 = 4096, that is, can be distinguished from 4096 different IDs in the same milliseconds with the numbers of the 12 BIT representative. That is, the maximum number of IDs generated by the same machine in the same milliseconds is 4096

In simple terms, if you have a service that wants to generate a globally unique id, you can send a request to a system that has deployed the SnowFlake algorithm to generate the unique id. The SnowFlake algorithm then receives the request and first generates a 64 bit long id using binary bit manipulation, the first bit of the 64 bits being meaningless.  This is followed by 41 bits of the current timestamp (in milliseconds), then 10 bits to set the machine id, and finally the last 12 bits to determine how many requests have been made in this millisecond on this machine in this room.

The characteristics of SnowFlake are: 

1. the number of milliseconds is at the high end, the self-incrementing sequence is at the low end, and the entire ID is trended incrementally.
2. it does not rely on third-party systems such as databases, and is deployed as a service for greater stability and performance in generating IDs.
3. the bit can be allocated according to your business characteristics, very flexible.
