架构设计
=======

## 架构概述

DolphinScheduler 是一个分布式易扩展、去中心化的可视化DAG工作流任务调度系统，以DAG流式的方式将Task组装起来，可实时监控任务的运行状态，同时支持执行重试、kill等任务。

<p align="center">
  <img src="/img/architecture-1.3.0.jpg" alt="系统架构图"  width="70%" />
  <p align="center">
        <em>系统架构图</em>
  </p>
</p>

#### MasterServer

  MasterServer采用分布式无中心设计理念，MasterServer主要负责 DAG 任务切分、任务提交监控，并同时监听其它MasterServer和WorkerServer的健康状态。
  MasterServer服务启动时向Zookeeper注册临时节点，通过监听Zookeeper临时节点变化来进行容错处理。
  MasterServer基于netty提供监听服务。


  MasterServer由以下组件组成：

- **Distributed Quartz**分布式调度组件，主要负责定时任务的启停操作，当quartz调起任务后，Master内部会有线程池具体负责处理任务的后续操作
- **MasterSchedulerService**是一个扫描线程，定时扫描数据库中的 **command** 表，生成工作流实例，根据不同的**命令类型**进行不同的业务操作
- **WorkflowExecuteThread**主要是负责DAG任务切分、任务提交、各种不同命令类型的逻辑处理，处理任务状态和工作流状态事件
- **EventExecuteService**处理master负责的工作流实例所有的状态变化事件，使用线程池处理工作流的状态事件
- **StateWheelExecuteThread**处理依赖任务和超时任务的定时状态更新



#### WorkerServer

  WorkerServer也采用分布式无中心设计理念，支持自定义任务插件，主要负责任务的执行和提供日志服务。
  WorkerServer服务启动时向Zookeeper注册临时节点，并维持心跳。


  WorkerServer由以下组件组成：
- **WorkerManagerThread**主要通过netty领取master发送过来的任务，并根据不同任务类型调用**TaskExecuteThread**对应执行器。
- **RetryReportTaskStatusThread**主要通过netty向master汇报任务状态，如果汇报失败，会一直重试汇报
- **LoggerServer**是一个日志服务，提供日志分片查看、刷新和下载等功能


#### Registry
  注册中心，使用插件化实现，默认支持Zookeeper, 系统中的MasterServer和WorkerServer节点通过注册中心来进行集群管理和容错。另外系统还基于注册中心进行事件监听和分布式锁。

#### Alert
  提供告警相关功能，仅支持单机服务。支持自定义告警插件。

#### API
  API接口层，主要负责处理前端UI层的请求。该服务统一提供RESTful api向外部提供请求服务。
  接口包括工作流的创建、定义、查询、修改、发布、下线、手工启动、停止、暂停、恢复、从该节点开始执行等等。

#### UI

  系统的前端页面，提供系统的各种可视化操作界面，详见[功能介绍](../guide/homepage.md)部分。



## 执行流程

DolphinScheduler使用分片算法将command取模，根据master的排序id分配，master将拿到的command转换成工作流实例，使用线程池处理工作流实例。

DolphinScheduler对工作流的处理流程:

  - 通过UI或者API调用，启动工作流，持久化一条command到数据库中
  - Master通过分片算法，扫描Command表，生成工作流实例ProcessInstance，同时删除Command数据
  - Master使用线程池运行WorkflowExecuteThread，执行工作流实例的流程，包括构建DAG，创建任务实例TaskInstance，将TaskInstance通过netty发送给worker
  - Worker收到任务以后，修改任务状态，并将执行信息返回Master
  - Master收到任务信息，持久化到数据库，并且将状态变化事件存入EventExecuteService事件队列
  - EventExecuteService根据事件队列调用WorkflowExecuteThread进行后续任务的提交和工作流状态的修改

  <p align="center">
  <img src="/img/master-process-2.0-zh_cn.png" alt="Start process activity diagram"  width="70%" />
  <p align="center">
        <em>启动流程活动图</em>
  </p>
</p>




## 容错设计
容错分为**服务宕机容错**、**任务重试**，服务宕机容错由**Master容错**和**Worker容错**组成

##### 服务宕机容错

- Master容错：

<p align="center">
   <img src="/img/failover-master.jpg" alt="容错流程"  width="50%" />
 </p>

容错范围：从host的维度来看，Master的容错范围包括：自身host+注册中心上不存在的节点host，容错的整个过程会加锁；

容错内容：Master容错工作流实例和任务实例，在容错前会比较实例的开始时间和服务节点的启动时间，在服务启动时间之后的则跳过容错；

容错后处理：ZooKeeper Master容错完成之后则重新由DolphinScheduler中Scheduler线程调度，遍历 DAG 找到”正在运行”和“提交成功”的任务，对”正在运行”的任务监控其任务实例的状态，对”提交成功”的任务需要判断Task Queue中是否已经存在，如果存在则同样监控任务实例的状态，如果不存在则重新提交任务实例。

- Worker容错：

<p align="center">
   <img src="/img/failover-worker.jpg" alt="容错流程"  width="50%" />
 </p>

容错范围：从工作流实例的维度看，每个Master只负责容错自己的工作流实例；只有在`handleDeadServer`时会加锁；

容错内容：当发送Worker节点的remove事件时，Master只容错任务实例，在容错前会比较实例的开始时间和服务节点的启动时间，在服务启动时间之后的则跳过容错；

容错后处理：Master Scheduler线程一旦发现任务实例为” 需要容错”状态，则接管任务并进行重新提交。

注意：由于” 网络抖动”可能会使得节点短时间内失去和ZooKeeper的心跳，从而发生节点的remove事件。对于这种情况，我们使用最简单的方式，那就是节点一旦和ZooKeeper发生超时连接，则直接将Master或Worker服务停掉。


##### 任务重试

DolphinScheduler 将工作流中的任务节点分为以下类型：

- 业务节点，它对应一个实际的脚本或者处理语句，比如Shell节点，MR节点、Spark节点、依赖节点等。

- 逻辑节点，它不做实际的脚本或语句处理，只是整个流程流转的逻辑处理，比如子流程节等。

所有任务都可以配置失败重试的次数，当该任务节点失败，会自动重试，直到成功或者超过配置的重试次数。如果工作流中有任务失败达到最大重试次数，工作流就会失败停止，失败的工作流可以手动进行重跑操作或者流程恢复操作



## 任务优先级


**不同流程实例优先级**>**同一个流程实例优先级**>**同一流程内任务优先级**>**同一流程内任务**进行任务处理。
每个任务实例根据**json**解析优先级，将其信息保存在任务队列中。
任务队列获取的时候，通过字符串比较可得出需要优先执行的任务。

- 流程定义优先级：HIGHEST、HIGH、MEDIUM、LOW、LOWEST。
- 任务优先级：HIGHEST、HIGH、MEDIUM、LOW、LOWEST。



## 日志访问

Web(UI) 和 worker 可能不在同一机器，查询日志采取以下方案：

- 存放于Elasticsearch
- gRPC远程访问日志


 我们使用自定义Logback的FileAppender和Filter功能，实现每个任务实例生成一个日志文件，同时以流程定义、流程实例、任务实例的形式生成日志过滤匹配TaskLogInfo开始的线程名称。


FileAppender：

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
 ```


TaskLogFilter：

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
 ```
