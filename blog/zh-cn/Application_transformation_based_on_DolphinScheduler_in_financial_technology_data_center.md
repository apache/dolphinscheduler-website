---
title: 金融科技数据中台基于 DolphinScheduler 的应用改造
keywords: Apache DolphinScheduler, 金融, 数据中台
description: 来自成方金融科技的大数据工程师冯鸣夏为大家带来 DolphinScheduler 在金融科技领域的应用实践分享。
---

![](https://fastly.jsdelivr.net/gh/filess/img16@main/2023/08/24/1692847150919-97fb9072-8e2b-4016-bb9f-d089a22d2b6e.png)

在Apache DolphinScheduler Meetup 上，来自 **成方金融科技的 大数据工程师 冯鸣夏** 为大家带来 DolphinScheduler 在金融科技领域的应用实践分享。以下为演讲整理：

**-冯鸣夏 成方金融科技 大数据工程师-**

![](https://fastly.jsdelivr.net/gh/filess/img17@main/2023/08/24/1692847163278-c87ad955-3925-4808-90e7-ebfb61e6c061.png)


聚焦于大数据领域的实时和离线数据处理和分析，目前主要负责数据中台的研发。

**演讲概要：**

-   使用背景
    
-   基于 DolphinScheduler 的二次改造
    
-   DolphinScheduler 的插件扩充
    
-   未来和展望
    

# **1 使用背景**

## **01** 数据中台建设

目前，大数据技术在金融领域有着广泛的应用，大数据平台已经成为了金融基础设施。在大数据平台的建设中，数据中台又是最亮的那颗星，它是业务系统使用大数据的入口和接口，当纷杂的业务系统接入数据中台时，数据中台需要提供统一的管理和统一的入口，以保障服务的安全高靠高效和可靠。正如下图所示，数据中台处于各业务系统连接大数据平台的中间环节，各业务系统通过数据中台所提供的服务对大数据平台进行数据访问。

![](https://fastly.jsdelivr.net/gh/filess/img1@main/2023/08/24/1692847186768-24b3acde-23f9-41f0-8fe7-34997a04d703.png)


数据中台的核心理念是实现 4 个四化，即业务数据化、数据资产化、资产服务化和服务业务化。从业务到数据，再回到业务形成的完整闭环，支持企业的数字化转型。


![](https://fastly.jsdelivr.net/gh/filess/img1@main/2023/08/24/1692847194274-8e53abab-776a-41a4-97c9-61296cec698b.png)

 数据中台逻辑架构图

  
数据中台的逻辑架构如上图所示，从下往上分析，首先最底层是数据资源层，这是各个业务系统产生的原始数据；再往上一层是数据集成，数据集成的方式分为离线采集和实时采集，其中采用的技术包括 Flume、CDC 实时采集等。

再往上一层是目前比较热的数据湖了，通过数据集成手段将数据入湖，存到 Hadoop 的分布式存储或者 MPP 架构的数据库中。

再往上一层是数据引擎层，通过实时和离线计算引擎 Flink、Spark 等对数据湖中的数据进行处理分析，形成可供上层使用的服务数据。

再上一层就是数据中台所需要提供的数据服务了，数据服务目前包括数据开发服务和数据共享服务，为上层的各业务系统提供数据的开发和共享能力。

数据应用层是数据的具体应用，包括数据的异常检测、数据治理、AI 人工智能的决策以及BI分析等。

  
在整个的数据中台的建设中，调度引擎在数据引擎层中是属于比较核心的位置，也是数据中台建设中比较重要的功能。

## **02** 数据中台面对的问题和挑战

数据中台会面临一些问题和挑战。首先，数据任务的执行和调度是数据中台提供数据开发服务的核心和关键。

其次，数据中台对外提供统一的数据服务管理，服务开发，服务调用和服务监控。

第三，保障金融数据的安全是金融科技的首要任务，数据中台需要保障数据服务的安全可靠。

在以上这些问题的和挑战下，我们对一些开源的调度引擎进行了调研。

![](https://fastly.jsdelivr.net/gh/filess/img14@main/2023/08/24/1692847213676-60f937c9-99a3-4022-bf5b-d000ae320d98.png)


目前我们在生产过程中同时使用了多种调度引擎，比如 oozie，XXL-job，DolphinScheduler 是我们 2022 年通过调研分析引进的调度引擎,它在整个数据中台的建设中起到了非常重要的作用。

  
首先，DolphinScheduler 部分地解决了我们统一服务管理、服务开发、服务调用和服务管理的需求。其次，它在任务容错方面有自己独到设计，支持 HA、弹性扩展、故障容错，基本保障任务的安全运行。第三，它支持任务和节点的监控。第四，它支持多租户和权限的控制。最后，它的社区非常活跃，版本更迭快速，问题修复也是非常快速。通过分析 DolphinScheduler 的架构和源码分析，我们认为它的架构符合主流的大数据框架设计，和Hbase、Kafka 等优秀的国外产品有类似的架构模式和设计。

# **2 基于DolphinScheduler 的二次改造**

为了让 DolphinScheduler 更加符合我们应用场景的需要，我们基于 DolphinScheduler 进行了二次改造，共包括 6 个方面。

1.  **增加异步服务调用功能**
2.  **增加元数据库Oracle适配**
3.  **增加多环境配置能力**
4.  **增加日志和历史数据清理策略**
5.  **增加对Yarn日志的获取能力**
6.  **增加服务安全策略**

## **01** 增加异步服务调用功能


![](https://fastly.jsdelivr.net/gh/filess/img13@main/2023/08/24/1692847223568-39f40f4e-7e5e-48c3-a45d-dcaab59715ae.png)

首先是增加了异步服务调用功能，上图是 DolphinScheduler 2.0.5版本的架构图，大部分都是原生 DolphinScheduler 的服务组件，其中标标红的 GateWay 是我们基于 DolphinScheduler 增加的一个网关服务，通过它实现了流量控制、黑白名单，同时也是用户访问服务开发的入口。通过优化流程的启动接口，返回流程的唯一编码，我们增加了服务映射的功能。

![](https://fastly.jsdelivr.net/gh/filess/img11@main/2023/08/24/1692847229450-f1a1a5d5-dd71-41e1-8f9f-eefbabd6b287.png)


在经典的 DolphinScheduler 的访问模式中，用户提交的工作流执行指令会进入到原数据库中的 command 表里面，master 组件拿到 zk 锁后从 元数据库中获取command，并进行 DAG 解析，生成实际的流程实例，并将分解的任务通过 RPC 交付 work节点执行，然后同步等待执行结果。在原生的 DolphinScheduler 请求中，用户提交了指令之后，缺少执行工作流的返回码，所以我们增加了返回的唯一标识，用户可以通过这个唯一的返回标识，进行后续的流程状态的查询，日志的下载和数据的下载。

## **02** 增加元数据库 Oracle 适配

我们的第二个改造是对  DolphinScheduler 与 Oracle 数据库进行了适配。目前原生 DolphinScheduler 的元数据库是 MySQL，而根据我们的生产需求需要将原数据库转换成Oracle数据库。为实现这一点，需要完成数据初始化模块和数据操作模块的适配。

![](https://fastly.jsdelivr.net/gh/filess/img7@main/2023/08/24/1692847241060-d20ccb0d-c496-4d95-ad08-ae535de0aac0.png)

首先，对于数据的初始化模块，我们修改了 install_config.conf 配置文件，将其更改为Oracle 的配置。

其次，需要增加Oracle的application.yml，我们在 dolphinscheduler-2.0.*/apache-dolphinscheduler-2.0.*-bin/conf/ 目录下增加Oracle的application.yml。

最后，我们对数据操作模块进行转换，对 mapper 文件和的文件进行相应的修改，因为 Dolphinscheduler-dao 模块是数据库操作模块，其它模块会引用该模块实现数据库的操作。它使用 Mybatis 进行数据库连接，所以需要更改 mapper文件，所有的 mapper 文件在 resources 目录下。

## **03** 多环境配置能力

原生的 DolphinScheduler 版本安装无法根据环境进行配置，一般需要根据实际环境进行调整相关的参数。我们希望通过增强安装脚本对环境的选择配置，以减少人为在线修改的成本，实现自动化安装。相信小伙伴们也都遇到类似的困境，为了在开发环境、测试环境、联调环境、性能环境、准生产环境、生产环境上使用DolphinScheduler，需要进行大量环境相关配置参数的修改。

  
我们通过修改 install.sh 文件，增加输入参数\[dev|test|product\]，选择合适install\_config\_${evn}.conf 进行安装，可以实现了环境的自动选择。

  
另外，DolphinScheduler 的工作流跟环境是强绑定的，不同环境的工作流无法共用。下图是原生 DolphinScheduler 导出的一个工作流的JSON文件，标灰的部分表示这个流程所依赖的 resource 资源， id是一个数字，是由数据库自增所产生的。但是如果 a 环境产生的流程实例放到 b 环境中，可能就会存在ID主键冲突。换句话说，就是不同环境所产生的工作流是无法进行共用的。

![](https://fastly.jsdelivr.net/gh/filess/img5@main/2023/08/24/1692847251737-a6f97733-f1c0-41c1-abb0-0bcca748f75a.png)

  
我们通过将资源的绝对路径所作为资源的唯一ID这种生成的方式来解决这个问题。

## **04** 日志和历史数据清理策略

DolphinScheduler 所产生的数据非常多，数据库中会产生实例表中的实例数据，这些数据会随着实例任务不停运行不断地增长。我们采用的策略就是通过定义 DolphinScheduler的定时任务，将这些表的数据按照约定的保存周期进行清理。

  
其次，DolphinScheduler 的数据主要是日志数据和任务执行目录，其中包括worker、master、API 的服务日志数据以及 worker 执行的目录，这些数据并不会随着任务的执行的结束而自动删除，也需要通过定时任务删除。通过运行日志清理脚本，我们可以实现日志的自动删除。

![](https://fastly.jsdelivr.net/gh/filess/img0@main/2023/08/24/1692847260418-190ce396-a08c-485e-be25-fdaa37527025.png)

![](https://fastly.jsdelivr.net/gh/filess/img3@main/2023/08/24/1692847264305-d1d962d7-215b-439c-b9b2-85344f0684b0.png)

## **05** 增加对 Yarn 日志的获取能力

原生的 DolphinScheduler 可以获取在worker 节点上执行的日志信息，但是对于 Yarn 上的任务还需要登录到 Yarn 的集群上，通过命令或者界面的方式获取。我们通过分析日志中的 YARNID 标签，获取 Yarn 任务 ID，通过 yarnclient 获取任务的日志。减少了手工查看日志的过程。

![](https://fastly.jsdelivr.net/gh/filess/img17@main/2023/08/24/1692847298436-148a244c-1545-4e7c-af4e-b87374a82f0c.png)

<YARNID>1234567890<YARNID>

## 06 服务安全策略

-   增加 Monitor 组件监控
    

![](https://fastly.jsdelivr.net/gh/filess/img11@main/2023/08/24/1692847302909-06fa1f36-bd49-4c60-8918-8ac5b758e475.png)

上图是是 DolphinScheduler 中两大核心组件 master和 worker 与Zookeeper 的交互过程。MasterServer 服务启动时会向 Zookeeper 注册临时节点，通过监听 Zookeeper 临时节点变化来进行容错处理。WorkerServer 主要负责任务的执行。WorkerServer 服务启动时向 Zookeeper 注册临时节点，并维持心跳。目前Zookeeper起到非常重要的作用，主要进行服务的注册和心跳的检测。

  
![](https://fastly.jsdelivr.net/gh/filess/img19@main/2023/08/24/1692847307199-0796ac08-8ec8-4f75-af8b-851d4824dd0d.png)

从上面这张表格可以看到  master和 worker连接 Zookeeper 时的一些相关参数，包括连接超时，session超时时间，最大连重试次数。

  
由于网络抖动等因素，可能会造成 master 和 worker节点与 zk 失联的情况。失联之后，worker 和 master 因为在 zk 上注册的临时信息消失，会判定 zk 与 master 和 worker 失联，影响任务的执行。如果没有人工干预，就会导致任务迟迟得不到响应。我们增加了 monitor 组件进行服务状态的监控，通过定时任务 cron, 每 5 分钟运行一次 monitor 程序检测 worker 进程和 master 进程是否存活，如果宕机则重新调起。

-   增加服务组件使用 zk 的 Kerberos 认证环节
    

  
第二个安全策略是增加了服务组件使用 zk 的 Kerberos 认证环节。Kerberos 是一种网络认证协议，其设计目的是通过密钥系统为客户机/服务器应用程序提供强大的认证服务。Master 服务组件，API 服务组件，worker 服务组件在启动时完成  Kerberos 认证之后再使用 zk 进行相关的服务注册和心跳连接，从而保证服务的安全。

# **3 基于DolphinScheduler的插件扩展**

此外，我们还基于 DolphinScheduler进行了插件扩展，我们扩展了 4 类算子，包括 **Richshell、SparkSQL、Dataexport 和 GBase** 算子。

## **01** 增加新的任务类型Richshell

首先是新增了任务类型 Richshell，增强了原生的 Shell功能，主要是通过模板引擎实现脚本参数动态替换，用户通过服务调用实现脚本参数的替换，让用户使用参数更加灵活，是对全局参数的补充。

![](https://fastly.jsdelivr.net/gh/filess/img16@main/2023/08/24/1692847312998-a2d82778-f0cb-4773-99e0-d22a11fa6a9b.png)

## **02** 增加新的任务类型SparkSQL

第二个增加的算子是 SparkSQL，用户通过编写 SQL执行 Spark 任务，让任务调度在Yarn 上。DolphinScheduler 原生也支持以 JDBC 的方式执行 SparkSQL，但存在l资源争抢的情况，因为 JDBC 连接数是有限的。通过SparkSQL /Spark-beeline 等工具执行不能使用 Yarn cluster 模式。而采用该任务类型可以将 SparkSQL 程序以cluster 的模式运行在 Yarn 集群上，最大限度地利用集群资源，减少客户端的资源使用。

## **03** 增加新的任务类型 Dataexport

第三个增加的是 Dataexport，也就是数据导出算子，让用户可以通过选择不同的存储组件，导出存储在组件中的数据。组件包括 ES、Hive、Hbase 等。

![](https://fastly.jsdelivr.net/gh/filess/img11@main/2023/08/24/1692847321780-e94e279e-113a-49d0-ae34-35c7903d4d3c.png)

在大数据平台中的数据，被导出后后续可能被用于 BI 展示、统计分析、机器学习等数据准备，而这些场景大多需要进行数据导出，利用 Spark 数据处理能力实现不同数据源的导出功能。

## **04** 增加新的任务类型GBase

第四个增加的插件是 Gbase。GBase 8a MPP Cluster 是一款列式存储，Shared Nothing架构的分布式并行数据库集群，具备高性能、高可用、高扩展等特性，适用于OLAP场景（查询场景），可以为超大规模数据管理提供高性价比的通用计算平台，并广泛用于支撑各类数据仓库系统、BI  系统和决策支持系统。

GBase 作为数据入湖的一个应用场景，我们新增了 GBase 算子，它支持 GBase 数据的导入、导出和执行。

# **4 未来与展望**

未来，我们将增加云原生的支持，对目前架构进行云原生改造，DolphinScheduler 已经迭代至 3 版本，我们会持续更新支持。第二，增加AI模型算子，AI 应用场景越来越多，我们需要对 更多的AI 场景进行抽象 ；第三，增加灰度发布功能，以实现无感知发布；第四，增加基于用户优先级的调度策略。

我相信随着 DolphinScheduler、Kylin 等中国开源社区的蓬勃发展，国产软件一定会迎来更好的未来。最后和大家分享一句话：“没有比追梦更加激荡人心的力量，没有比梦想更加铿锵有力的步伐”，与大家共勉！