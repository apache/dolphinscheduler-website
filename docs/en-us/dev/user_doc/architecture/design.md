Architecture Design
===================


## Architecture Overview

DolphinScheduler is a distributed, easy-to-expand, and decentralized visual DAG workflow task scheduling system. It assembles tasks in a DAG streaming way, which can monitor the running status of tasks in real time, and support the execution of tasks such as retry and kill.

<p align="center">
  <img src="/img/architecture-1.3.0.jpg" alt="System architecture diagram"  width="70%" />
  <p align="center">
        <em>System architecture diagram</em>
  </p>
</p>

#### MasterServer

MasterServer adopts a distributed non-central design concept. MasterServer is mainly responsible for DAG task segmentation, task submission monitoring, and monitoring the health status of other MasterServers and WorkerServers at the same time.
MasterServer service starts, it registers a temporary node with Zookeeper, and performs fault-tolerant processing by monitoring the changes of the Zookeeper temporary node.
MasterServer provides monitoring services based on netty.

MasterServer service mainly includes:

- **Distributed Quartz** distributed scheduling component, which is mainly responsible for the start and stop operations of scheduled tasks. When quartz calls up the task, there will be a thread pool inside the Master that is responsible for processing the subsequent operations of the task.
- **MasterSchedulerService** is a scanning thread that regularly scans the **command** table in the database, generates workflow instances, and performs different business operations according to different **command types**
- **WorkflowExecuteThread** is mainly responsible for DAG task segmentation, task submission, logical processing of various command types, and processing task status and workflow status events
- **EventExecuteService** processes all state change events of the workflow instance that the master is responsible for, and uses the thread pool to process the state events of the workflow
- **StateWheelExecuteThread** handles timed state updates for dependent tasks and timeout tasks

#### WorkerServer

WorkerServer also adopts the distributed non-central design concept, supports custom task plug-ins, and is mainly responsible for task execution and providing log services.
WorkerServer service starts, it registers a temporary node with Zookeeper and maintains the heartbeat.

WorkerServer service mainly includes:

- **WorkerManagerThread** mainly receives the tasks sent by the master through netty, and calls **TaskExecuteThread** corresponding executors according to different task types.
- **RetryReportTaskStatusThread** mainly reports the task status to the master through netty. If the report fails, it will always retry the report
- **LoggerServer** is a log service that provides log fragment viewing, refresh and download functions

#### Registry

  The registry is implemented as a plug-in, and Zookeeper is supported by default. The MasterServer and WorkerServer
  nodes in the system use the registry for cluster management and fault tolerance. In addition, the system also performs
  event monitoring and distributed locks based on the registry.

#### Alert

  Provide alarm-related functions and only support stand-alone service. Support custom alarm plug-ins.

#### API

  The API interface layer is mainly responsible for processing requests from the front-end UI layer. The service
  uniformly provides RESTful APIs to provide request services to the outside world. Interfaces include workflow
  creation, definition, query, modification, release, logoff, manual start, stop, pause, resume, start execution from
  the node and so on.

#### UI

  The front-end page of the system provides various visual operation interfaces of the system,See more
  at [Introduction to Functions](../guide/homepage.md) section。

## Implementation process

DolphinScheduler uses the sharding algorithm to take the command modulo, and assigns it according to the master's sorting id. The master converts the received command into a workflow instance, and uses the thread pool to process the workflow instance.

The workflow of DolphinScheduler:

   - Start the workflow through UI or API calls, and persist a command to the database
   - The Master scans the Command table through the sharding algorithm, generates a workflow instance ProcessInstance, and deletes the Command data at the same time
   - The Master uses the thread pool to run WorkflowExecuteThread to execute the process of the workflow instance, including building a DAG, creating a task instance TaskInstance, and sending the TaskInstance to the worker through netty
   - After the Worker receives the task, it modifies the task status and returns the execution information to the Master
   - The Master receives the task information, persists it to the database, and stores the state change event in the EventExecuteService event queue
   - EventExecuteService calls WorkflowExecuteThread according to the event queue to submit subsequent tasks and modify the workflow status

   <p align="center">
     <img src="/img/master-process-2.0-en.png" alt="Start process activity diagram"  width="70%" />
     <p align="center">
           <em>Start process activity diagram</em>
     </p>
   </p>


## Fault-tolerant design
   Fault tolerance is divided into **service downtime fault tolerance**, **task retry**, service downtime fault tolerance is composed of **Master fault tolerance** and **Worker fault tolerance**

##### Service downtime fault tolerance

- Master fault tolerance:

<p align="center">
  <img src="/img/failover-master.jpg" alt="Failover Process" width="50%" />
</p>

Fault tolerance range: From the perspective of the host, the fault tolerance range of the Master includes: its own host + the node host that does not exist in the registration center, and the whole process of fault tolerance will be locked;

Fault tolerance content: The master fault tolerance workflow instance and task instance will compare the start time of the instance and the start time of the service node before the fault tolerance, and skip the fault tolerance after the service start time;

Fault-tolerant post-processing: After the ZooKeeper Master is fault-tolerant, it will be re-scheduled by the Scheduler thread in DolphinScheduler, traverse the DAG to find the "running" and "submitted successfully" tasks, monitor the status of its task instances for the "running" tasks, and correct the "submit" "Successful" task needs to determine whether the Task Queue already exists, if so, monitor the status of the task instance, and resubmit the task instance if it does not exist.

- Worker fault tolerance:

<p align="center">
    <img src="/img/failover-worker.jpg" alt="Failover Process" width="50%" />
  </p>

Fault tolerance range: From the perspective of workflow instances, each Master is only responsible for fault tolerance of its own workflow instance; it will only lock when `handleDeadServer`;

Fault tolerance content: When sending the remove event of the Worker node, the Master only fault-tolerant task instances. Before the fault tolerance, it will compare the start time of the instance with the start time of the service node, and skip the fault tolerance after the service start time;

Fault-tolerant post-processing: Once the Master Scheduler thread finds that the task instance is in the "requires fault-tolerance" state, it takes over the task and resubmits it.

Note: Due to "network jitter", the node may lose the heartbeat with ZooKeeper for a short time, and the remove event of the node will occur. In this case, we use the simplest method, that is, once the node has a timeout connection with ZooKeeper, it will directly stop the Master or Worker service.

##### task retry

DolphinScheduler classifies task nodes in workflows into the following types:

- Business node, which corresponds to an actual script or processing statement, such as Shell node, MR node, Spark node, dependency node, etc.

- Logic node, it does not do actual script or statement processing, but only logical processing of the entire process flow, such as sub-process section.

All tasks can configure the number of failed retries. When the task node fails, it will automatically retry until it succeeds or exceeds the configured number of retries. If there are tasks in the workflow that fail and reach the maximum number of retries, the workflow will fail and stop, and the failed workflow can be manually rerun or process recovery.

## task priority

**Different process instance priority**>**same process instance priority**>**task priority within the same process**>**task within the same process** for task processing.
Each task instance parses the priority according to json and saves its information in the task queue.
When the task queue is obtained, the task that needs to be executed first can be obtained through string comparison.

- Process definition priority: HIGHEST, HIGH, MEDIUM, LOW, LOWEST.
- Task priority: HIGHEST, HIGH, MEDIUM, LOW, LOWEST.

## log access

The Web(UI) and worker may not be on the same machine, and the query log adopts the following scheme:

- Stored in Elasticsearch
- gRPC remote access log

We use the FileAppender and Filter functions of custom Logback to generate a log file for each task instance, and at the same time generate log filters in the form of process definitions, process instances, and task instances that match the thread name started by TaskLogInfo.

FileAppender:

 ```java
 /**
  * task log appender
  */
 public class TaskLogAppender extends FileAppender<ILoggingEvent> {

     ...

    @Override
    protected void append(ILoggingEvent event) {

        if (currentlyActiveFile == null){
            currentlyActiveFile = getFile();
        }
        String activeFile = currentlyActiveFile;
        // thread name： taskThreadName-processDefineId_processInstanceId_taskInstanceId
        String threadName = event.getThreadName();
        String[] threadNameArr = threadName.split("-");
        // logId = processDefineId_processInstanceId_taskInstanceId
        String logId = threadNameArr[1];
        ...
        super.subAppend(event);
    }
}


TaskLogFilter:

 ```java
 /**
 * task log filter
 */
public class TaskLogFilter extends Filter<ILoggingEvent> {

    @Override
    public FilterReply decide(ILoggingEvent event) {
        if (event.getThreadName().startsWith("TaskLogInfo-")){
            return FilterReply.ACCEPT;
        }
        return FilterReply.DENY;
    }
}
