# 【达人专栏】还不会用 Apache Dolphinscheduler 吗，大佬用时一个月写出的最全入门教学【二】

<div align=center>
<img src="/img/2022-05-24/ch/1.png"/>
</div>

作者 | 欧阳涛 招联金融大数据开发工程师

## 02 Master 启动流程

### **2.1 MasterServer 的启动**

在正式开始前，笔者想先鼓励一下大家。我们知道启动 Master 其实就是启动 MasterServer，本质上与其他 SpringBoot 项目相似，即启动里面的 main 函数。但想要开始实操前，肯定有不少的人，尤其是初学者会突然发现这里面有十多个由 bean 注入的 autowired。

被多个 bean 的注入搞到一头雾水，甚至感觉一脸懵逼的不是少数。但笔者就想说是，这些其实都是吓唬你们的，不用害怕，接下来将带领你们把这些 bean 分别解剖并归类，那么我们就正式开始。

**第一类**：MasterConfig、MasterRegistryClient、MasterSchedulerService、Scheduler 这些 bean。从字面意思来说，MasterConfig 就是跟 Master 配置相关的，MasterRegistryClient 就是负责注册相关的内容，MasterSchedulerService 肯定跟 Master 调度有关的，说白了就是 Master 内部的东西。

**第二类**：是那些后缀名为一堆 Processor 的，例如 taskExecuteRunningProcessor 等。相同后缀一定处理同样的 task，在以后肯定被某个东西一起加载的。

**第三类**：是 EventExecuteService 以及 FailoverExecuteThread，这些根据名字可以大胆猜一下是与事件执行相关以及灾备转换相关的东西，这些肯定也是 Master 内部的东西，理论上应该归到第一类。

**第四类**：至于 LoggerRequestProcessor 就是与打印日志相关的了，至于这类具体干的内容，后面会有详细的介绍。

main 方法执行完成后，基于 spring 特性，执行 run 方法。在 run 方法中，创建 nettyRemotingServer 对象(这个对象不是 spring 管理的，而是直接 new 创建的)。然后将第二类的一堆 Processor 放到 netty 的 Processor 里面去。从这里就可以推断，Master 和 Worker 的通信一定是通过 netty 的。

我们可以看看下面的代码，其实就是将第一类的那些 bean 执行 init 以及 start 方法。

总结其实 Master 这就像一个总司令，这个总司令就调用这里面的 bean 的 start 方法，这些 bean 开始执行自己的功能，至于这些 bean 里面执行啥样的功能，MasterServer 是懒得管，也没必要管了。

**本节总结：**

<div align=center>
<img src="/img/2022-05-24/ch/2.png"/>
</div>

至此 MasterServer 就运行完了，下一节我们将逐个分析各个 bean 的用途以及功能的了。

### **2.2 MasterConfig 的信息以及 MasterRegistry Client 的注册**

MasterConfig 从 application.yml 中获取配置信息加载到 MasterConfig 类中，获取到的具体配置信息如下。

<div align=center>
<img src="/img/2022-05-24/ch/3.png"/>
</div>
​

在 MasterServer 里，MasterRegisterConfig 会执行 init()以及 start()方法。

init()方法新建了一个心跳线程池。注意，此时只是建了一个线程池，里面还没有心跳任务。

start()方法从 zk 获取了锁(getLock)，注册信息(registry)以及监听注册的信息(subscribe)。

**注册信息做了两件事情：**

**第一**：构建心跳信息，并丢到线程池中运行心跳任务的。

**第二**：在 zk 临时注册该 Master 信息，并移除没用的 Master 信息。

心跳任务就是检查是否有死亡节点以及每隔 10s(heartbeatInterval)将最新的机器信息，包括机器 CPU，内存，PID 等等信息注册到 zk 上去的。

监听订阅的信息，只要注册的信息有变化，就会立马感知，如果是增加了机器，则会打印日志。减少了机器，移除并同时打印日志。本节如下图所示:

<div align=center>
<img src="/img/2022-05-24/ch/4.png"/>
</div>

### **2.3 ServerNodeManger 的运行**

前面两节是从 MasterServer 启动过程以及 MasterRegisterConfig 的注册过程的。注册完成之后 Master，Worker 如何管理呢，如何同步保存到数据库的呢。ServerNodeManager 的作用就是负责这一部分的内容。

ServerNodeManager 实现了 InitializingBean 接口的。基于 spring 的特性，构建此对象后，会执行 AfterPropertiesSet()方法。**做了三件事情：**

1.  load()。从 zk 加载节点信息通过 UpdateMasterNodes()到 MasterPriorityQueue。
2.  新建线程每十秒钟将 zk 的节点信息同步数据到数据库中。
3.  监听 zk 节点，实时把最新数据通过 UpdateMasterNodes()方法更新到 MasterPriorityQueue 队列中去。

几乎所有的更新操作都是通过重入锁来实现的，这样就能确保多线程下系统是安全的。此外，还有一个细节是如果是移除节点会发送警告信息。

MasterProrityQueue 里面有个 HashMap，每台机器对应一个 index，以这样的方式构建了槽位。后面去找 Master 信息的时候就是通过这 index 去找的。

至于 MasterBlockingQueue 队列的内容，如何同步到数据库的，如何将数据放到队列和队列中移除数据等，这些都是纯 crud 的内容，读者可以自行阅读的。

### **2.4 MasterSchedulerService 的启动**

2.1 到 2.3 讲述都是由 zk 管理的节点信息的事情。为什么我们要在 Master 启动之后会先讲节点信息的？

理由其实很简单，因为不管是 Master 还是 Worker 归根结底都是机器。如果这些机器崩了或者增加了，DS 不知道的话，那这机器岂不是浪费了。只有机器运行正常，配置正常，都管理好了，那 DS 运行才能够顺畅地运行。同样，其他大数据组件也是类似的道理。

前面 MasterServer 里 MasterRegisterClient 执行完 init()以及 start()方法之后，紧接着 MasterSchedulerService 执行了 init()和 start()方法。从这里开始就真正的进入了 Master 干活的阶段了。

**init()方法**是创建了一个 Master-Pre-Exec-Thread 线程池以及 netty 客户端的。

Pre-exec-Thread 线程池里面有固定的 10 个线程(在 2.1 中对应的是 MasterConfig 配置里面的 pre-exec-threads)。这些线程处理就是从 command 里构建 ProcessInstance(流程实例)过程的。

**start 方法**就是启动了状态轮询执行(StateWheelExecutorThread)的线程，这线程专门就干的是检查 task，process，workflow 超时以及 task 状态的过程，符合条件的都被移除了。

其中，MasterSchedulerService 本身继承了 thread 类，在 start 方法过后，就立马执行了 run 方法。在 run 方法中确保机器有了足够的 CPU 和内存之后，就会执行 ScheduleProcess 方法。至于 ScheduleProcess 做的事情，将在 2.5 说明。

### **2.5 MasterSchedulerService 的执行**

#### **ScheduleProcess 方法**

ScheduleProcess 是在 MasterSchedulerService 中的 while 死循环里面的，所以它会依次循环执行下面 4 个方法。

1.  FindCommands 方法。从 t_ds_command 表中每次取出 10 条数据，并且这 10 条数据都是根据 slot 查找出来的，查找完成后，可以在 MasterConfig.FetchCommandNum 中进行配置。
2.  CommandProcessInstance 将这些 command 表中转换成 ProcessInstance。这里用到了 CountdownLatch，目的是全部转换完成才执行以后的方法。
3.  将转换好的 processInstance 一个一个的构建成 workFlowExecuteThread 对象，将这些对象通过 workFlowExecuteThreadPool 线程池中的线程一个一个执行的，并且将任务实例和工作流在 processInstanceExecCacheManager 缓存起来。
4.  在这个线程池中运行 StartWorkFlow 方法后，执行 WorkFlowExecuteThread 的 StartProcess 方法的，StartProcess 做了哪些事情将在 2.6 说明的。

这个线程池交给了 spring 管理，而且属于后台线程。它的最大数量以及核心数量的线程池都是 100 个(MasterConfig.getExecThreads)。详细如下图:

<div align=center>
<img src="/img/2022-05-24/ch/5.png"/>
</div>

这里有两个细节要说明一下，

**第一**：WorkflowExecuteThread 它并不是继承了 Thread 类，而是一个普通类。只是类名字后面有个 Thread，所以阅读的时候不要在此类找 start 或者 run 方法了。

**第二**：SchedulerProcess 方法里面如果找到的 ProcessInstance 是超时的话，

就会交给 2.4 说的状态轮询线程(stateWheelExecuteThread)去执行的，将这个 ProcessInstance 进行移除。

### **2.6 WorkflowExecutorThread 里执行 StartProcess 方法**

StartProcess 这个方法就直接先看图的了。

<div align=center>
<img src="/img/2022-05-24/ch/6.png"/>
</div>

StartProcess 就干了三件事请，buildFlowDag()构建了 DAG，initTaskQueue()初始化 task 队列以及 submitPostNode()提交节点的。

构建 DAG 如何干的，初始化队列中又干了什么事情，提交节点后又干了什么事情的，将在 2.7 到 2.9 章节说明。

### **2.7 WorkflowExecutorThread 里执行 buildFlowDag 方法**

根据 buildFlowDag 里面的代码，梳理了一下执行过程，分别为下面 9 步:

- FindProcessDefinition 获取流程定义，就是要构建哪个流程的 DAG 的。
- GetStartTaskInstanceList 获取流程下有哪些任务实例，一般情况下，一个流程肯定有不止一个任务。
- FindRelationByCode 获取任务关系表(ProcessTaskRelation)中的数据。
- GetTaskDefineLogListByRelation 通过第 3 步获取的任务关系数据确定任务定义日志(TaskDefinitionLog)的数据的。
- TransformTask 就是通过第 3 步和第 4 步获取到 Relation 和 Log 转换成任务节点 TaskNode。
- GetRecoveryNodeCodeList 获取到的是 task 里的 nodeCode。
- ParseStartNodeName 获取到的是命令的参数。
- 根据第 5、第 6、第 7 获取到数据，构建了流程的 DAG(ProcessDag)。
- 将构建好的 ProcessDag 数据转换成 DAG 数据。

基本逻辑就是上面的步骤的。当然，每一步都会有些更多的逻辑，但这些本质上都是数据结构变来变去的。如果读者写过业务方面的代码，这点肯定不陌生的。所以就不详细的说明了。

可能有读者对于 DAG 是什么，下面是 DAG 的简介链接，阅读之后理解起来应该并不难。

[https://github.com/apache/dolphinscheduler-website/blob/master/blog/zh-cn/DAG.md](https://github.com/apache/dolphinscheduler-website/blob/master/blog/zh-cn/DAG.md)

这个链接是在理论上介绍 DAG，如果对 DAG 想要在实践上更深入的认识，在 dao 模块的 test 文件夹下搜索 DagHelperTest 类，这里面有 5 个 test 的操作的，大家可以都运行一下(Debug 形式)，就会对 DAG 有着更深入的认识的。

还有两个链接跟本节有关的。这两个链接是关于 dag 中任务关系的改造的。就是 1.3 版本以前保存任务之间的关系只是以字段的形式进行保存，后来发现数据量很大不可行之后，就把这个字段拆成多个表了。读者可以阅读一下的。

[https://github.com/apache/dolphinscheduler-website/blob/master/blog/zh-cn/dolphinscheduler_json.md](https://github.com/apache/dolphinscheduler-website/blob/master/blog/zh-cn/dolphinscheduler_json.md)

[https://github.com/apache/dolphinscheduler-website/blob/master/blog/en-us/Json_Split.md](https://github.com/apache/dolphinscheduler-website/blob/master/blog/en-us/Json_Split.md)

这构建 DAG(有向无环图)目的就是在前端拖拉拽的任务告诉 Master 任务的执行顺序，也就是告诉 Master 哪些任务先执行，哪些任务后执行。

### **2.8 WorkflowExexutorThread 里执行 InitTaskQueue 方法**

#### **InitTaskQueue 里面干了 3 件重要事情：**

1.  初始化 4 个 map，分别是 ValidTaskMap，ErrorTaskMap，ActiveTaskProcessorMaps，CompleteTaskMap。就是将找到的 task 和 process 按 valid(有效)，complete(完成)，error(失败)，active(运行)为根据，保存到不同的 map 中(这些 map 都是以 taskCode 作为 key)，这些 map 将在后面的方法中用到的。
2.  如果 task 是可以重试的，就是通过 addTaskToStandByList 将其放到 readyToSubmitTaskQueue 队列中。
3.  如果开启了补数状态的话，那就设置具体的补数时间以及全局参数，将其更新到流程实例中。

(笔者觉得这个 InitTaskQueue 方法名字并不是很好，可能觉得 InitTask 或者 InitTaskMap 会更好的。因为 Queue 的话很容易误认为是队列的，这个方法只是构建了 4 个 map 的。而且队列也只是放了可以重试的任务的，这个队列在下面章节中还有更大的用处的。)

### **2.9 WorkFlowExecutorThread 里执行 SubmitPostNode 方法**

#### **SubmitPostNode 干了 6 件事情：**

1.  DagHelper.ParsePostNodes(dag)把 2.8 最后生成的 DAG 解析出来 TaskNodeList。
2.  根据 TaskNodeList 生成 TaskInstance 集合。
3.  如果只有一个任务运行的话,将 TaskInstance 参数配置传递给 ProcessInstance。
4.  将 TaskInstance 通过 AddTaskToStandByList 方法放到 ReadyToSubmitTaskQueue 队列去。
5.  SubmitStandByTask 提交这些 task。
6.  UpdateProcessInstanceState 是更新流程实例状态的。

最重要的就是最后两件事情，就是将 TaskInstance 放到队列里和更新流程实例。更新流程实例纯属数据结构的变化的，这点并不难的。放到队列中的 task 如何处理，接下来将怎么做，

也就是 SubmitStandByTask 干了哪些事情将在后续章节中说明。
