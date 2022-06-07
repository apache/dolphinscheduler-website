---
title:# Community Star Series | 2 Don’t know how to use Apache DolphinScheduler? A community talent writes the usage tutorial of it in one month!
keywords: Apache,DolphinScheduler,scheduler,big data,ETL,airflow,hadoop,orchestration,dataops,Meetup
description: Apache DolphinScheduler (hereinafter referred to as DS) is a distributed and easily scalable visual DAG workflow task scheduling system
---
# Community Star Series | 2 Apache DolphinScheduler MasterServer start-up tutorial

<div align=center>
<img src="/img/2022-05-24/en/1.png"/>
</div>

Author | Ouyang Tao, Big Data Development Engineer

<div align=center>
<img src="/img/2022-05-24/en/2.png"/>
</div>

##02 Master start-up process

###2.1 Starting up the MasterServer

Before we start, I want to give you some confidence. We know that starting the Master is starting the MasterServer, which is essentially similar to other SpringBoot projects, i.e. starting the main function inside. But before you start to use it, the beginners will find that there are more than a dozen autowired injected by beasns.

Not a few people are confused by the injection of multiple beans. But I would like to point out that these paper tigers, do not be afraid, I will lead you to dissect and categorize these beans. Let's begin!

The first category: MasterConfig, MasterRegistryClient, MasterSchedulerService, and Scheduler. Literally, MasterConfig is related to the Master configuration, MasterRegistryClient is responsible for registration-related, and MasterSchedulerService is related to Master scheduling, which is, frankly speaking, something internal to the Master.

The second category is the beans with the suffix name of Processors, such as taskExecuteRunningProcessor. The beans with the same suffix handle the same task, which must be loaded together by something later on.

The third category: EventExecuteService and FailoverExecuteThread, these can be guessed based on their names to be something related to event execution and disaster recovery conversion, these also are something internal to the Master and in theory, should be classified as the first category.
The fourth category: the LoggerRequestProcessor is related to printing logs, and the specific details of this category will be explained later.

After the main method is executed, the run method is executed based on the spring feature. In the run method, the nettyRemotingServer object is created (this object is not managed by spring, but newly created directly). Then a bunch of Processors of the second class is put inside the netty's Processor. We can infer by this point that the communication between the Master and the Worker must be connected by netty.
Look at the code below, which executes the initial and start methods of the first class beans.

In conclusion, the Master is like a commander-in-chief who calls the start method of the beans, and these beans start to perform their functions, as to what kind of functions these beans perform, the MasterServer is too lazy to care, and there is no need to care.

**Summary of this section.**

MasterServer execution process is over here. In the next section, we will talk about the use and functionality of each bean one by one.

<div align=center>
<img src="/img/2022-05-24/en/3.png"/>
</div>

### 2.2 Information about MasterConfig and registration of MasterRegistry Client

MasterConfig gets the configuration information from application.yml and loads it into the MasterConfig class. The specific configuration information obtained is as follows.

<div align=center>
<img src="/img/2022-05-24/en/4.png"/>
</div>

In the MasterServer, MasterRegisterConfig executes the init() and start() methods.

The init() method creates a new heartbeat thread pool. Note that at this point, only a pool of threads is created without heartbeat tasks in it yet.

The start() method gets a lock from zk (getLock), registration information (registry), and a message to listen to the registration (subscribe).

By information registration, two things have been done.
First: constructs the heartbeat message and drops it into the thread pool to run the heartbeat task.

Second: register the Master message temporarily with zk and remove the useless Master messages.

The heartbeat task checks for dead nodes and registers the latest machine information, including machine CPU, memory, PID, etc., to zk every 10s (heartbeatInterval).

Listens for subscriptions and immediately senses any changes to the registered information and prints a log if a machine has been added. If a machine is reduced, it is removed and the log is printed at the same time. This section is shown in the image below:


![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/b7rclvhub8eug3d5kdq3.png)

### 2.3 Running of ServerNodeManger

The first two sections are about the start-up process of the MasterServer and the registration process of the MasterRegisterConfig. After all these procedures, how do Master and Worker be managed and synchronically saved to the database?

The ServerNodeManager is set for this task.

ServerNodeManager implements the InitializingBean interface, and executes the AfterPropertiesSet() method after building this object based on the characteristics of Spring, Three goals are achieved by now.

- load(). Loading node information from zk to MasterPriorityQueue via UpdateMasterNodes().
- A new thread synchronizes data from zk's node information to the database every ten seconds.
- Listening to zk nodes and updating the latest data to the MasterPriorityQueue in real-time via the UpdateMasterNodes() method.

Almost all update operations are implemented via reentrant locks, which ensures that the system is safe under multiple threads. There is also a detail that should be noted that a warning message is sent if a node is removed.

The MasterProrityQueue has a HashMap inside, with each machine corresponding to an index, and slots are constructed in this way. The index is used to find the Master information later on.
As for the content of the MasterBlockingQueue, how to synchronize to the database, how to put data into the queue and remove data from the queue, etc., these are all pure crud content, you can read on your own.

### 2.4 Starting the MasterSchedulerService

2.1 to 2.3 are all about the node information managed by zk. Why do we talk about node information after the Master is started?
The reason is simple: both Masters and Workers are ultimately machines. If DS doesn't know about the machine's crash or addition, it will cause waste. Only when the machines are running properly, configured properly and all managed well, can the DS operation run smoothly. Other big data components are similar to the situation.

After the MasterRegisterClient in the MasterServer executes the init() and start() methods, the MasterSchedulerService executes the init() and start() methods immediately afterwards. This is where the Master gets to work.

The init() method creates a Master-Pre-Exec-Thread thread pool and a netty client.

The Pre-Exec-Thread thread pool contains a fixed number of 10 threads (in 2.1 this corresponds to the pre-exec-threads in the MasterConfig configuration). These threads handle the process of building the ProcessInstance process from the command.
The start method is the thread that starts the StateWheelExecutorThread, which is dedicated to checking task, process, workflow timeouts, and task status and removing all that meet the criteria.

The MasterSchedulerService itself inherits from the thread class and executes the run method immediately after the start method. After ensuring that the machine has enough CPU and memory in the run method, the ScheduleProcess method is executed. What ScheduleProcess does will be explained in 2.5.

### 2.5 Execution of the MasterSchedulerService

- The ScheduleProcess method

1. ScheduleProcess is inside a while dead loop in the MasterSchedulerService, so it will loop through the following 4 methods to execute them.

2. The FindCommands method. This method retrieves 10 data from the t_ds_command table at a time, which are found by the slot, and will be configured in MasterConfig.FetchCommandNum once the search is complete.

3. CommandProcessInstance converts these command tables into a ProcessInstance, where a CountdownLatch is used so that the subsequent methods are not executed until all conversions are complete.

4. The converted processInstance is built into workFlowExecuteThread objects, executed through threads in the workFlowExecuteThreadPool thread pool one by one, and the task instances and workflows executed in the processInstanceExecCacheManager are cached.

5. After running the StartWorkFlow method in this thread pool, the StartProcess method of the WorkFlowExecuteThread is executed, and what the StartProcess does will be described in 2.6.

This background thread pool is managed by Spring, of which the maximum number and the core number of threads in the pool are 100 (MasterConfig.getExecThreads). The details are shown below:


<div align=center>
<img src="/img/2022-05-24/en/5.png"/>
</div>

There are two details to clarify here.

First: WorkflowExecuteThread does not inherit from the Thread class but a normal class with a Thread after the class name, so don't look for start or run methods in this class when reading.

Second: If the ProcessInstance found in the SchedulerProcess method is a timeout, it will be handed over to the state polling thread(stateWheelExecuteThread) to be executed as described in 2.4, and the ProcessInstance will be removed.

### 2.6 The StartProcess method is executed in the WorkflowExecutorThread

The StartProcess method is shown in the picture below.


<div align=center>
<img src="/img/2022-05-24/en/6.png"/>
</div>

StartProcess does three things, buildFlowDag() builds the DAG, initTaskQueue() initializes the task queue and submitPostNode() submits the node.

How the DAG is built? What is done in the initialization queue? And what is done after the node is submitted? All the questions will be answered in sections 2.7 to 2.9.

### 2.7 Executing the buildFlowDag method in the WorkflowExecutorThread

Based on the code inside buildFlowDag, I have sorted out the execution process, which consists of the following 9 steps:

- FindProcessDefinition to get the process definition, which is the DAG of the process to be built.
- GetStartTaskInstanceList to get what task instances are under the process, in general, a process must have more than one task.
- FindRelationByCode gets the data in the task relationship table (ProcessTaskRelation).
- GetTaskDefineLogListByRelation determines the task definition log from the task relationship data obtained in step 3.
- TransformTask transforms the Relation and Log gaining in steps 3 and 4 into a TaskNode.
- GetRecoveryNodeCodeList gets the nodeCode of the task.
- ParseStartNodeName gets the parameters of the command.
- The DAG (ProcessDag) of the process is constructed based on the data obtained in 5, 6, and 7.
- The constructed ProcessDag data is converted into DAG data.

The basic logic is shown above. Of course, there is some more logic at each step, but these are essentially data structures that change from one to another. You will get my point if only you have coding about service, so I won't go deeper into this topic here.

For those who may be interested in what a DAG is, here is a link to a brief introduction to DAGs, which should not be too difficult to read and understand.

https://dolphinscheduler.apache.org/zh-cn/blog/DAG.html

This is a theoretical introduction to DAG, if you want to have a deeper understanding of DAG in practice, search for the DagHelperTest class in the test folder of the dao module, there are 5 test operations in it, and you can run them all (in Debug form) to get a deeper understanding of DAG.

There are also two links about the modification of task relationships in the DAG. Before version 1.3, the relationships between tasks were only stored as fields, but after it was found to be unfeasible with the amount of data, the fields were split into multiple tables. You can refer to the articles below about it.

https://dolphinscheduler.apache.org/zh-cn/blog/dolphinscheduler_json.html
https://dolphinscheduler.apache.org/zh-cn/blog/json_split.html

The purpose of the DAG (directed acyclic graph) is to drag and drop tasks on the front end to tell the Master the order of execution of the tasks, i.e. to tell the Master which tasks are executed first and which ones are executed later.

### 2.8 Executing InitTaskQueue method in WorkflowExexutorThread
Three key aims are reached in The InitTaskQueue.

- Initialize four maps, ValidTaskMap, ErrorTaskMap, ActiveTaskProcessorMaps, and CompleteTaskMap, during which the tasks and processes are saved to different maps (these maps take taskCode as the key) by categories of valid (valid), complete (complete), error (failed), and active (running). These maps will be used in the later methods.
- If the task is retrievable, it is placed in the readyToSubmitTaskQueue queue by addTaskToStandByList.
- If the complementary state is enabled, then set the specific complementary time and global parameters to update it to the process instance.

(I don't think the name of the InitTaskQueue method is very good, and I prefer InitTask or InitTaskMap instead. That's because Queue can easily be mistaken for a queue, while it only builds 4 maps. And the queue is only for tasks that can be retried, which will play a bigger role, I will explain it in the following sections).

### 2.9 Executing the SubmitPostNode method in the WorkFlowExecutorThread

SubmitPostNode plays six roles.

1.DagHelper.ParsePostNodes(dag) parses the DAG generated in 2.8 into a TaskNodeList.
2.Generate a TaskInstance collection from the TaskNodeList.
3.If only one task is running, pass the TaskInstance parameter configuration to ProcessInstance.
4.Place the TaskInstance in the ReadyToSubmitTaskQueue queue via the AddTaskToStandByList method.
5.SubmitStandByTask submits these tasks.
6.UpdateProcessInstanceState is destined to update the state of the process instance.

The last but not least, putting the TaskInstance into the queue and updating the process instance is the key. Updating process instances is purely a data structure change, which is not difficult. What happens to the task that has been placed in the queue and what happens next? What role does SubmitStandByTask play? All these questions will be explained in the next sections, stay tuned to my series work!
