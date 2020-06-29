这一篇主要讲解的是dolphinscheduler的master部分的源码，从主类MasterServer开始，从启动到运行，master主要做了以下三件事情
- Zookeeper 节点初始化
- 构建并提交工作流实例，跟踪运行状态
- 监控其他MasterServer和WorkerServer的健康状态并容错
- 维系心跳

```
@PostConstruct
public void run(){
        //详情见1.Zookeeper初始化
        zkMasterClient.init(); 
        //详情见2.MasterSchedulerThread线程
        masterSchedulerService = ThreadUtils.newDaemonSingleThreadExecutor("Master-Scheduler-Thread");
        //详情见3.heartBeatThread线程
        heartbeatMasterService = ThreadUtils.newDaemonThreadScheduledExecutor("Master-Main-Thread",Constants.DEFAULT_MASTER_HEARTBEAT_THREAD_NUM);
}
```

# 1. Zookeeper初始化
创建DS在Zookeeper的相关节点，并判断是否对系统做failover，恢复异常的工作流实例和任务实例。
- 用于master的failover /dolphinscheduler/lock/failover/master
- 系统节点，保存master和worker的心跳信息 /dolphinscheduler/masters; /dolphinscheduler/workers；/dolphinscheduler/dead-servers
```
public void init(){
	logger.info("initialize master client...");
	this.initDao();
	InterProcessMutex mutex = null;
	try {
	    //创建分布式锁节点，用于master节点的failover 
		String znodeLock = getMasterStartUpLockPath();
		mutex = new InterProcessMutex(zkClient, znodeLock);
		mutex.acquire();
		// 在ZK中初始化系统节点，
		this.initSystemZNode();
		// 向ZK的/masters节点注册当前的master信息
		this.registerMaster();
		// 通过监听Zookeeper临时节点变化来进行容错处理（如果活跃的master只有自身一个，则进行failover）
		if (getActiveMasterNum() == 1) { 
			failoverWorker(null, true);  //恢复任务实例 详情见1.1.
			failoverMaster(null);   //恢复工作流实例 详情见1.2.
		}
	}catch (Exception e){
		logger.error("master start up  exception",e); 
	}finally {
		releaseMutex(mutex);
	}
}
```

## 1.1. failoverWorker 恢复任务实例
```
private void failoverWorker(String workerHost, boolean needCheckWorkerAlive) throws Exception {
   logger.info("start worker[{}] failover ...", workerHost);

   List<TaskInstance> needFailoverTaskInstanceList = processService.queryNeedFailoverTaskInstances(workerHost);
   for(TaskInstance taskInstance : needFailoverTaskInstanceList){
      if(needCheckWorkerAlive){
         if(!checkTaskInstanceNeedFailover(taskInstance)){
             //不需要failover的两种情况
             // 1.任务详情中不存在host信息
             //2.任务在ZK中存在，则判断启动时间是否小于worker启动时间，小于则不用failover
            continue;
               }
      }

      ProcessInstance instance = processService.findProcessInstanceDetailById(taskInstance.getProcessInstanceId());
      if(instance!=null){
         taskInstance.setProcessInstance(instance);
      }
      // 如果任务中有yarn的任务则杀掉，kill的方式，日志中用正则匹配containId的格式，获取containID，用yarn命令kill。
      ProcessUtils.killYarnJob(taskInstance);
      //把任务的状态从“running”改为“need failover”
      taskInstance.setState(ExecutionStatus.NEED_FAULT_TOLERANCE);
      processService.saveTaskInstance(taskInstance);
   }
   logger.info("end worker[{}] failover ...", workerHost);
}
```

## 1.2. failoverMaster 恢复工作流实例
```
private void failoverMaster(String masterHost) {
   logger.info("start master failover ...");
  //获取需要failover的工作流实例
   List<ProcessInstance> needFailoverProcessInstanceList = processService.queryNeedFailoverProcessInstances(masterHost);
   
   for(ProcessInstance processInstance : needFailoverProcessInstanceList){
       // 1.更新工作流实例的host为null
       // 2.写入 t_ds_commond 表一条恢复工作流实例的命令
      processService.processNeedFailoverProcessInstances(processInstance);
   }

   logger.info("master failover end");
}
```


# 2. MasterSchedulerThread 线程
该线程主要对command进行解析生成工作流实例
```
public void run() {
    logger.info("master scheduler start successfully...");
    while (Stopper.isRunning()){

        // process instance
        ProcessInstance processInstance = null;

        InterProcessMutex mutex = null;
        try {

            boolean runCheckFlag = OSUtils.checkResource(masterConfig.getMasterMaxCpuloadAvg(), masterConfig.getMasterReservedMemory());
            if(!runCheckFlag) {
                Thread.sleep(Constants.SLEEP_TIME_MILLIS);
                continue;
            }
            if (zkMasterClient.getZkClient().getState() == CuratorFrameworkState.STARTED) {

                //创建分布式锁 /dolphinscheduler/lock/masters
                String znodeLock = zkMasterClient.getMasterLockPath();

                mutex = new InterProcessMutex(zkMasterClient.getZkClient(), znodeLock);
                mutex.acquire();

                ThreadPoolExecutor poolExecutor = (ThreadPoolExecutor) masterExecService;
                int activeCount = poolExecutor.getActiveCount();
                // 需要确保实例构建存储过程和command数据从表中删除的过程在一个事务中
                Command command = processService.findOneCommand();
                if (command != null) {
                    logger.info("find one command: id: {}, type: {}", command.getId(),command.getCommandType());

                    try{
                        // handleCommand将commond解析成processInstance 详情见2.1
                        processInstance = processService.handleCommand(logger, OSUtils.getHost(), this.masterExecThreadNum - activeCount, command);
                        if (processInstance != null) {
                            logger.info("start master exec thread , split DAG ...");
                            // masterExecService，master执行线程 详情见 2.2
                            masterExecService.execute(new MasterExecThread(processInstance, processService));
                        }
                    }catch (Exception e){
                        logger.error("scan command error ", e);
                        processService.moveToErrorCommand(command, e.toString());
                    }
                } else{
                    //indicate that no command ,sleep for 1s
                    Thread.sleep(Constants.SLEEP_TIME_MILLIS);
                }
            }
        }catch (Exception e){
            logger.error("master scheduler thread exception",e);
        }finally{
            AbstractZKClient.releaseMutex(mutex);
        }
    }
    logger.info("master server stopped...");
}
```


## 2.1. handleCommand 
根据command对象构建工作流实例，构建后把该条command从t_ds_command表中删除，需要确保的是实例构建存储过程和command数据从表中删除的过程在一个事务中。

command所有类型如下
- 0 start a new process
- 1 start a new process from current nodes
- 2 recover tolerance fault process
- 3 recover suspended process
- 4 start process from failure task nodes
- 5 complement data
- 6 start a new process from scheduler
- 7 repeat running a process
- 8 pause a process
- 9 stop a process
- 10 recover waiting thread
```
@Transactional(rollbackFor = Exception.class)
public ProcessInstance handleCommand(Logger logger, String host, int validThreadNum, Command command) {
     //根据command命令生成新的工作流程实例
     ProcessInstance processInstance = constructProcessInstance(command, host);
    //cannot construct process instance, return null;
    if(processInstance == null){
        logger.error("scan command, command parameter is error: %s", command.toString());
        moveToErrorCommand(command, "process instance is null");
        return null;
    }
    if(!checkThreadNum(command, validThreadNum)){
        logger.info("there is not enough thread for this command: {}",command.toString() );
        return setWaitingThreadProcess(command, processInstance);
    }
    processInstance.setCommandType(command.getCommandType());
    processInstance.addHistoryCmd(command.getCommandType());
    saveProcessInstance(processInstance);
    this.setSubProcessParam(processInstance);
    //保存了任务流实例后将该命令删除
    delCommandByid(command.getId());
    return processInstance;
}
```


## 2.2. MasterExecThread 执行线程
```
public void run() {
    ......

    try {
        //检查此过程是否是补数 且 流程实例是否为子流程
        if (processInstance.isComplementData() &&  Flag.NO == processInstance.getIsSubProcess()){
            // 详情见2.2.2. 执行补数
            executeComplementProcess();  
        }else{
            //详情见2.2.1. 执行流程实例
            executeProcess(); 
        }
    ......
}
```


### 2.2.1. executeProcess() 执行流程实例
```
private void executeProcess() throws Exception {
    //1.根据流程实例id查找有效的任务列表 initTaskQueue()
    //2.构建DAG处理流程 buildFlowDag() 返回DAG对象，主要包括两个信息：vertex 点，即任务执行节点；edge 边，即任务之间的依赖关系
    prepareProcess();
    //提交并监控任务，直到工作流停止 详情见2.2.1.1
    runProcess();
    //当线程池不足以供流程实例使用时，创建恢复等待线程命令。
    //子工作流程实例无需创建恢复命令。
    //创建恢复等待线程命令并同时删除origin命令。
   //如果存在recovery命令，则仅更新字段update_time
    endProcess();
}
```

#### 2.2.1.1. runProcess()提交并监控任务

submitPostNode方法传入父任务节点的名字，通过节点名，DAG，获取任务节点列表，并生成任务实例列表readyToSubmitTaskList
```
private void runProcess(){
    submitPostNode(null);
```
submitStandByTask()方法里面会遍历任务实例列表readyToSubmitTaskList，判断任务实例的依赖关系，依赖项运行成功则会提交任务执行线程，失败则把当前节点状态改为失败。

 ```

        if(canSubmitTaskToQueue()){
            submitStandByTask();
        }
        try {
            Thread.sleep(Constants.SLEEP_TIME_MILLIS);
        } catch (InterruptedException e) {
            logger.error(e.getMessage(),e);
        }
        updateProcessInstanceState();
    }

    logger.info("process:{} end, state :{}", processInstance.getId(), processInstance.getState());
}
```


submitStandByTask()最终会调用submitTaskExec，这里有个MasterBaseTaskExecThread线程
MasterBaseTaskExecThread线程有两个主要作用
- 用于把任务实例信息提交到数据库中submitTask()
- 把任务信息写进Zookeeper队列 submitTaskToQueue()，后续worker会来认领任务。（节点命名方式：${processInstancePriority}_${processInstanceId}_${taskInstancePriority}_${taskInstanceId}_${task executed by ip1},${ip2}...）

另外MasterBaseTaskExecThread有两个子类，除了上面的两个作用外：
- MasterTaskExecThread 任务执行完成后会把需要kill的任务信息写入zk队列中等待worker来kill任务。
- SubProcessTaskExecThread 在当前工作流运行结束后会继续运行子工作流并做相关状态更新，子工作流完全完成才同步状态为子工作流的状态。

MasterBaseTaskExecThread线程异步提交，会把结果写入activeTaskNode。
```
    private TaskInstance submitTaskExec(TaskInstance taskInstance) {
        MasterBaseTaskExecThread abstractExecThread = null;
        if(taskInstance.isSubProcess()){
            abstractExecThread = new SubProcessTaskExecThread(taskInstance, processInstance);
        }else {
            abstractExecThread = new MasterTaskExecThread(taskInstance, processInstance);
        }
        Future<Boolean> future = taskExecService.submit(abstractExecThread);
        activeTaskNode.putIfAbsent(abstractExecThread, future);
        return abstractExecThread.getTaskInstance();
    }
```

然后会遍历activeTaskNode，判断线程是否执行完成，若完成则移除该线程信息，再判断节点是否执行成功

```
   for(Map.Entry<MasterBaseTaskExecThread,Future<Boolean>> entry: activeTaskNode.entrySet()) {
                Future<Boolean> future = entry.getValue();
                TaskInstance task  = entry.getKey().getTaskInstance();

                if(!future.isDone()){
                    continue;
                }
                // node monitor thread complete
                activeTaskNode.remove(entry.getKey());
                if(task == null){
                    this.taskFailedSubmit = true;
                    continue;
                }
                logger.info("task :{}, id:{} complete, state is {} ",
                        task.getName(), task.getId(), task.getState().toString());
                // 如果节点成功，则继续提交任务节点
                if(task.getState() == ExecutionStatus.SUCCESS){
                    completeTaskList.put(task.getName(), task);
                    submitPostNode(task.getName());
                    continue;
                }
                // 如果节点失败，先重试，然后再继续执行失败流程
                if(task.getState().typeIsFailure()){
                    if(task.getState() == ExecutionStatus.NEED_FAULT_TOLERANCE){
                        this.recoverToleranceFaultTaskList.add(task);
                    }
                    if(task.taskCanRetry()){
                        addTaskToStandByList(task);
                    }else{
                        completeTaskList.put(task.getName(), task);
                        if( task.getTaskType().equals(TaskType.CONDITIONS.toString()) ||
                                haveConditionsAfterNode(task.getName())) {
                            submitPostNode(task.getName());
                        }else{
                            errorTaskList.put(task.getName(), task);
                            if(processInstance.getFailureStrategy() == FailureStrategy.END){
                                killTheOtherTasks();
                            }
                        }
                    }
                    continue;
                }
                // other status stop/pause
                completeTaskList.put(task.getName(), task);
            }
            // send alert
```

### 2.2.2. executeComplementProcess() 执行补数流程实例
```
private void executeComplementProcess() throws Exception {
....
//根据调度的时间规则和补数的时间范围计算出需要补数的日期列表
int processDefinitionId = processInstance.getProcessDefinitionId();
List<Schedule> schedules = processService.queryReleaseSchedulerListByProcessDefinitionId(processDefinitionId);
List<Date> listDate = Lists.newLinkedList();
if(!CollectionUtils.isEmpty(schedules)){
    for (Schedule schedule : schedules) {
        listDate.addAll(CronUtils.getSelfFireDateList(startDate, endDate, schedule.getCrontab()));
    }
}
//接下来是一个循环，用日期列表的每个日期执行一次
//以下三个方法同 2.2.1
....
prepareProcess();
....
runProcess();
....
endProcess();
```


# 3. heartBeatThread线程
每30秒上报一次心跳信息，
同时判断host是否在dead-servers节点下，即判断进程是否已经挂了。
进程正常则更新Zookeeper的/dolphinscheduler/masters/${host}/ 下的节点名称，包括以下信息
ip, port ,cpUsage, memoryUsage, loadAverage, registerTIme, currentTime


```
    private Runnable heartBeatThread(){
        logger.info("start master heart beat thread...");
        Runnable heartBeatThread  = new Runnable() {
            @Override
            public void run() {
                if(Stopper.isRunning()) {
                    // send heartbeat to zk
                    if (StringUtils.isBlank(zkMasterClient.getMasterZNode())) {
                        logger.error("master send heartbeat to zk failed: can't find Zookeeper path of master server");
                        return;
                    }

                    zkMasterClient.heartBeatForZk(zkMasterClient.getMasterZNode(), Constants.MASTER_PREFIX);
                }
            }
        };
        return heartBeatThread;
    }
```

