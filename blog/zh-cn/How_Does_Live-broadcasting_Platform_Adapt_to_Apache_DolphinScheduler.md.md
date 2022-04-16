# 论语音社交视频直播平台与 Apache DolphinScheduler 的适配度有多高

<div align=center>

<img src="/img/2022-4-11/1.png"/>

</div>

在 Apache DolphinScheduler Meetup 上，**YY 直播 软件工程师 袁丙泽**为我们分享了《YY直播基于Apache DolphinScheduler的适配与探索》。

本次演讲主要包括四个部分：

* YY直播引入Apache DolphinScheduler的背景
* Apache DolphinScheduler的引入过程
* Apache DolphinScheduler应用的适配
* YY直播未来的规划
<div align=center>

<img src="/img/2022-4-11/2.png"/>

</div>

**袁丙泽**YY直播 软件工程师，10 余年工作经验，主要从事风控大数据平台开发工作，对常用大数据组件深感兴趣，研发经验丰富。

## **背景**

YY直播是中国领先的语音社交视频直播企业，目前我们团队的主要职责是保障公司的业务安全。

### **01**技术现状

目前我们采用分层的技术架构，最底层是数据源层，其次从下往上依次是采集层、存储层和管理层和计算层与应用层。 

 

在**数据源层**，我们目前会去拉取各个业务方的一个关系型数据库数据，以及通过API向我们传输的数据，还有一些数据是通过Kafka这种流的方式来传输给我们。

 

**采集层**采用了我们自己研发的一套数据采集系统。

 

**存储层**中，我们目前将数据主要放在了关系型数据库中，如Clickhouse，还有一小部分会放在一些非关系型数据库中，如Redis和图库。当然大部分数据都存储在大数据系统中。

 

**管理层**我们主要有大数据管理系统，结合自己研发的一个计算调度以及任务管理系统和服务治理平台。

### **02**调度Apache DolphinScheduler之前的问题

1、调度平台复杂：团队除了有基于Xxl-job的任务调度外，部分老项目中有使用Crontab、Springboot、Scheduler、Quartz等管理任务的启动。

2、任务依赖需求强烈：目前我们所使用的的调度，仅能设置单个任务的执行，无法通过任务依赖形成工作流，任务依赖设置严重依赖于个人经验设定定时时间。实际上很多任务都需要有依赖关系。

3、任务复杂多样：目前任务有基于大数据系统的Spark、Flink任务，服务治理平台中各种Java服务任务、Shell、Java application、Python等。

## **引入过程**


在需求调研中，我们实际上需要一款调度平台，需要满足如下条件：

**1、统一管理任务及依赖关系**

随着业务计算的需求越来越多，特别是各种各样的画像计算和任务，这些任务分散在各个系统当中，管理起来非常困难，部分任务之间有一定的依赖关系，但配置其时间依靠的是个人经验。急需一款能够统一配置管理依赖的产品。

**2、兼容公司内部各平台系统**

我们需要调度任务平台管理我们的任务，同时为了快速投入使用，调度平台需要兼容我们公司其他的平台系统，如内部的Datax和Crontab服务。

**3、高可用、高性能、高并发，容易使用**

最后为了保证业务的稳定性，我们也需要这种调度平台能够高可用、高性能、高并发，并且容易使用。

 

通过调研我们发现，Apache DolphinScheduler几乎就是为我们设计的，适配过程中无需太多修改，就能满足我们需求。

## **应用适配**

Apache DolphinScheduler 是一个分布式去中心化，易扩展的可视化DAG工作流任务调度系统，致力于解决数据处理流程中错综复杂的依赖关系，使调度系统在数据处理流程中开箱即用，这非常符合我们的需求。

首先了解下Apache DolphinScheduler的架构，便于理解接下来的适配案例。

<div align=center>

<img src="/img/2022-4-11/3.png"/>

</div>

Apache DolphinScheduler主要有API、master、 worker、 log以及 alert这5个模块。

API接口层，主要负责处理前端UI层的请求。该服务统一提供RESTful api向外部提供请求服务。接口包括工作流的创建、定义、查询、修改、发布、下线、手工启动、停止、暂停、恢复、从该节点开始执行等等。

 

MasterServer采用分布式无中心设计理念，MasterServer主要负责 DAG 任务切分、任务提交监控，并同时监听其它MasterServer和WorkerServer的健康状态。MasterServer服务启动时向Zookeeper注册临时节点，通过监听Zookeeper临时节点变化来进行容错处理。

WorkerServer也采用分布式无中心设计理念，WorkerServer主要负责任务的执行和提供日志服务。WorkerServer服务启动时向Zookeeper注册临时节点，并维持心跳。workServer还提供有logger服务。

 

Alert提供告警相关接口，接口主要包括两种类型的告警数据的存储、查询和通知功能。其中通知功能又有邮件通知和**SNMP(暂未实现)**两种。

 

目前我们部署的是2.0版本，主要使用了4台物理机，在这4台物理机上部署了2个master实例，2个API实例和3个worker与logger实例，一个alert实例。

 

接下来分享3个具体的适配案例。

 

首先是与我们服务治理平台的适配，该适配主要目的是用于任务监控；尽管Apache DolphinScheduler本身提供有任务监控模块，我们同事早已经习惯利用服务治理平台统一管理监控。所以我们需要把Apache DolphinScheduler任务运行状态及时上报至服务治理平台。

### **01**服务治理适配—MasterServer服务说明

在适配之前，再次详细了解下MasterServer服务，MasterServer提供有：

1. Distributed Quartz分布式调度组件，主要负责定时任务的启停操作，当quartz挑起任务后，Master内部会有线程池具体负责处理任务的后续操作；
2. MasterSchedulerThread是一个扫描线程，定时扫描数据库中的command表，根据不同的命令类型进行不同的业务操作；
3. MasterExecThread（WorkflowExecutThread.java）主要负责DAG任务切分、任务提交监控、各种不同命令类型的逻辑处理；
4. MasterTaskExecThread主要负责任务的持久化。
### **02**服务治理适配-code

我们的需求是监控任务，通过代码分析，我们发现任务提交与监听主要在WorkflowExecuteThread类中的方法中实现，该类会启动多个实例线程。分别负责任务执行与监听。其流程图如下：

<div align=center>

<img src="/img/2022-4-11/4.png"/>

</div>

任务提交及监控流程图

我们的需求是监控任务，通过分析代码后发现，WorkflowExecuteThread主要有startprocess和handle events两个方法分别实现了任务执行与监听。其实我们主要在handleEvents方法中注入我们的服务治理平台数据收集代码，这样就能把任务监听情况及时上报到我们服务治理平台了。

 

其修改部分如下：

<div align=center>

<img src="/img/2022-4-11/5.png"/>

</div>

在服务治理平台中具体的效果图如下：

<div align=center>

<img src="/img/2022-4-11/6.png"/>

</div>

除了监控我们的具体任务状况外，我们还会分 project去做一些监控，最后都通过服务治理平台来做监控操作，比如像一些任务如果比较重要，我们就会配置一些电话报警，即一旦这个任务失败或者未按时执行完毕，便会进行电话通知。

### **03**Datax服务适配过程

第2个案例是关于Datax服务的适配过程。我们在研究Apache DolphinScheduler的时候，发现其已经集成了Datax类型的任务，这个对我们非常友好。因为我们也有数量相当多的任务是通过Datax来实现的，并且我们也开发了一部分Datax的插件，来去适配内部各个系统与存储的数据读写。

Datax适配的时候主要分为两部分，一部分是通过这种自定义模板来去实现，这部分其实就是我们将之前的一些Datax的服务拷贝过来，稍加修改，就能够实现了，主要涉及到的是一些非关型数据库之间的一些数据交互。

 

而纯粹的关型数据库之间的交互，我们还是需要通过配置方式实现。

 

首先我们在配置Clickhouse读写任务时，就遇见了一个小bug。

### **04**Datax服务适配—Clickhouse兼容#8092

我们在使用Datax来读取Clickhouse数据源的数据时，发现在sql当中，只要引用参数，无论时间参数还是其他参数，在提交的时都会失败，我们就怀疑其中可能有一些bug，阅读错误日志的时候，也发现在Apache DolphinScheduler提交 SQL时，是参数并未被替换就直接提交给了Clickhouse去执行，由于clickhouse并不能识别我们的Apache DolphinScheduler参数,所以就直接抛出异常了。我们梳理了一下Apache DolphinScheduler在执行datax任务时读取clickhouse的流程。其中在将我们在Apache DolphinScheduler配置转为datax配置流程如下：

<div align=center>

<img src="/img/2022-4-11/7.png"/>

</div> 

系统首先要做的就是先去解析sql的所有语法，然后通过语法拿到一些列的信息，这时它要去调用sql解析器。在这个过程当中，如果Apache DolphinScheduler没有对我们的这个参数去做替换，在执行这个 circle的时候就会发生错误，最后导致整个任务失败。

 

因此在解决的过程中，既然可能获取不到Clickhouse的解析器，最好的方法就是直接加入一个解析器。首先构建一个Json文件，然后格式化解析出来的所有的链，最后对语法去做一次解析，层层调用，最后能够调用到目标解析器。

### **05**Time参数适配Apache DolphinScheduler现状

最后的案例是关于时间参数适配。

 

Apache DolphinScheduler虽然提供有时间参数，但是我们自己的数据大部分都需要精确到毫秒级别的unixtime时间。通过阅读Apache DolphinScheduler的文档，我们遗憾地发现其并未提供该类型时间参数的实现。翻阅源码过程中，我们发现Apache DolphinScheduler提供有timestamp函数，实际上能够提供unixtime时间值。

 

在使用timestamp的时候，我们发现有两个小问题，首先timestamp直接表达unixtime有一些歧义，其次timestamp仅支持到秒级别，而我们大部分数据需要毫秒级别。为了方便使用，我们对此部分做了一些修改进行适配。

<div align=center>

<img src="/img/2022-4-11/8.png"/>

</div>

**适配过程**

首先我们做的第一件事情就是消除歧义，在Apache DolphinScheduler中，Timestamp是表达时间的方式，从Wiki百科获得的关于Timestamp和Unix time时间表达的解释能看出，Timestamp通常是通过日期加时间来表示的，但是Unix time时间采用的是格林威治时间，从1970年1月1日零时零分零秒至今，并且不考虑微秒的时间表达，采用的是整数。

明确了需求，接下来就需要了解如何实现了。我们通过分析代码发现，时间参数函数的实现是通过api方式层层调用，最终主要函数均通过在TimePlaceHolderUtils类中calculateTime的方法实现。该方法实现过程中，也会调用TaskConstants类中的表达时间函数名称的常量。于是我们对其中 TaskConstants类的一些常量进行了修改。又因为我们需要毫秒级别的函数，加入了一个 milli_unixtime函数，最后为了满足设备用户的需求，我们加入了一些更精度更高的函数，如微秒和纳秒的函数。

<div align=center>

<img src="/img/2022-4-11/9.png"/>

</div>

<div align=center>

<img src="/img/2022-4-11/10.png"/>

</div>

在补数功能上，在使用Apache DolphinScheduler之后，我们只需要在手动执行任务的时候选中补数的功能，再填充上我们要调度的日期，就可以直接进行补充了，同时我们还可以填写并行度。这个功能对我们这来说非常实用的，在Apache DolphinScheduler 2.0版本以后，时间的配置和执行的时间有日绩差的问题也被解决，在使用上带来了很大的便利。

## **未来规划**

在使用的过程中，我们发现通过Apache DolphinScheduler配置的任务在使用数据源方面，目前还不支持高可用的方案，这个需求在我们这里是比较强烈的，因此目前我们也正在做高可用的适配。

其次，我们目前使用的是Apache DolphinScheduler的2.0版本，因为社区比较活跃，版本升级也比较快，即使是一个小版本的升级，也会带来一些很大的功能和设计上的一些变化。比如在新版本当中，告警功能已经插件化，也解决了一些补数日期换算的问题。这也驱动着我们团队升级到新的版本去体验一些新的功能。虽然目前Apache DolphinScheduler只是在我们自己的小团队内部使用，但我们也正在思考让整个公司普遍使用的可行性方案。

 

尽管Apache DolphinScheduler非常完美地解决我们的大部分问题，并且大幅度提高我们的工作效率。但在各种复杂的情况下，我们还是会遇见一些小的Bug，我们未来也会在修复后提交给官方，当然我们自己在使用过程中也尝试了一些小Future，未来也会提交给官方共同讨论。

