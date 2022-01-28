
## 从 Airflow 到 Apache DolphinScheduler，有赞大数据开发平台的调度系统演进

编者按：在不久前的 Apache  DolphinScheduler Meetup 2021 上，有赞大数据开发平台负责人 宋哲琦 带来了平台调度系统从 Airflow 迁移到 Apache  DolphinScheduler 的方案设计思考和生产环境实践。

这位来自浙江杭州的 90 后年轻人自 2019 年 9 月加入有赞，在这里从事数据开发平台、调度系统和数据同步组件的研发工作。刚入职时，有赞使用的还是同为 Apache 开源项目的 Airflow，但经过调研和生产环境测试，有赞决定切换到 DolphinScheduler。 

有赞大数据开发平台如何利用调度系统？为什么决定重新选型为 Apache DolphinScheduler ？让我们跟着他的分享来一探究竟。

## 有赞大数据开发平台（DP平台）

作为一家零售科技 SaaS 服务商，有赞的使命是助力线上商家开店，通过社交营销和拓展全渠道零售业务，搭建数据产品和数字化解决方案，为驱动商家数字增长提供更好的 SaaS 能力。
 
目前，有赞在数据中台的支撑下已经建立了比较完整的数字产品矩阵：

[![68d4bd3ba305f91cf.md.jpg](https://s1.imgpp.com/2021/12/10/68d4bd3ba305f91cf.md.jpg)](https://imgpp.com/image/ZbGED)

为了支持日益增长的数据处理业务需求，有赞建立了大数据开发平台（以下简称 DP 平台）。这是一个大数据离线开发平台，提供用户大数据任务开发所需的环境、工具和数据。

[![8102f512534d0984a.md.jpg](https://s1.imgpp.com/2021/12/10/8102f512534d0984a.md.jpg)](https://imgpp.com/image/ZbZbN)

有赞大数据开发平台架构

有赞大数据开发平台主要由基础组件层、任务组件层、调度层、服务层和监控层五个模块组成。其中，服务层主要负责作业的生命周期管理，基础组件层和任务组件层主要包括大数据开发平台依赖的中间件及大数据组件等基础环境。DP 平台的服务部署主要采用主从模式，Master 节点支持 HA。调度层是在 Airflow 的基础上进行二次开发，监控层对调度集群进行全方位监控和预警。

### 1 调度层架构设计

 
[![9f5a07ad20fdbb0d9.md.jpg](https://s1.imgpp.com/2021/12/10/9f5a07ad20fdbb0d9.md.jpg)](https://imgpp.com/image/ZbiQL)

有赞大数据开发平台调度层架构设计
  
2017 年，我们团队在17年的时候调研了当时的主流的调度系统，最终决定采用 Airflow（1.7）作为 DP 的任务调度模块。根据业务场景实际需求，架构设计方面，我们采用了Airflow + Celery + Redis + MySQL的部署方案，Redis 作为调度队列，通过 Celery 实现任意多台 worker 分布式部署。
 
在调度节点 HA 设计上，众所周知，Airflow 在 schedule 节点上存在单点问题，为了实现调度的高可用，DP 平台采用了 Airflow Scheduler Failover Controller 这个开源组件，新增了一个 Standby 节点，会周期性地监听 Active 节点的健康情况，一旦发现 Active 节点不可用，则 Standby 切换为 Active，从而保证 schedule 的高可用。

### 2 Worker节点负载均衡策略

另外，由于不同任务占据资源不同，为了更有效地利用资源，DP 平台按照 CPU 密集/内存密集区分任务类型，并安排在不同的 celery 队列配置不同的 slot，保证每台机器 CPU/ 内存使用率保持在合理范围内。


## 调度系统升级选型


自 2017 年有赞大数据平台 1.0 版本正式上线以来，我们已经在 2018 年 100% 完成了数据仓库迁移的计划，2019 年日调度任务量达 30000+，到 2021 年，平台的日调度任务量已达到 60000+。伴随着任务量的剧增，DP 的调度系统也面临了许多挑战与问题。

### 1 Airflow 的痛点
 
1. 深度二次开发，脱离社区版本，升级成本高；
2. Python 技术栈，维护迭代成本高；
3. 性能问题：

[![134be4c7b422b89889.md.jpg](https://s1.imgpp.com/2021/12/10/134be4c7b422b89889.md.jpg)](https://imgpp.com/image/Zb8yu)

Airflow 的 schedule loop 如上图所示，本质上是对 DAG 的加载解析，将其生成 DAG round 实例执行任务调度。Airflow 2.0 之前的版本是单点 DAG 扫描解析到数据库，这就导致业务增长 Dag 数量较多时，scheduler loop 扫一次 Dag folder 会存在较大延迟（超过扫描频率），甚至扫描时间需要 60-70 秒，严重影响调度性能。
 
4. 稳定性问题：
 
Airflow Scheduler Failover Controller 本质还是一个主从模式，standby 节点通过监听 active进程是否存活来判断是否切换，如之前遇到 deadlock 阻塞进程的情况，则会被忽略，进而导致调度故障发生。在生产环境中发生过类似问题后，我们经过排查后发现了问题所在，虽然 Airflow 1.10 版本已经修复了这个问题，但在主从模式下，这个在生产环境下不可忽视的问题依然会存在。
 
考虑到以上几个痛点问题，我们决定对 DP 平台的调度系统进行重新选型。
 
在调研对比过程中，Apache DolphinScheduler 进入了我们的视野。同样作为 Apache 顶级开源调度组件项目，我们性能、部署、功能、稳定性和可用性、社区生态等角度对原调度系统和 DolphinScheduler 进行了综合对比。
 
以下为对比分析结果：

[![14dfca6d4f7730a5f2.md.jpg](https://s1.imgpp.com/2021/12/10/14dfca6d4f7730a5f2.md.jpg)](https://imgpp.com/image/ZbaBs)

Airflow VS DolphinScheduler
 

### 1 DolphinScheduler 价值评估

[![156249f11dc4ada0d4.md.jpg](https://s1.imgpp.com/2021/12/10/156249f11dc4ada0d4.md.jpg)](https://imgpp.com/image/ZbVrt)

如上图所示，经过对 DolphinScheduler 价值评估，我们发现其在相同的条件下，吞吐性能是原来的调度系统的 2 倍，而 2.0 版本后 DolphinScheduler 的性能还会有更大幅度的提升，这一点让我们非常兴奋。

此外，在部署层面，DolphinScheduler 采用的 Java 技术栈有利于ops标准化部署流程，简化发布流程、解放运维人力，且支持Kubernetes、Docker 部署，扩展性更强。

在功能新增上，因为我们在使用过程中比较注重任务依赖配置，而 DolphinScheduler 有更灵活的任务依赖配置，时间配置粒度细化到了时、天、周、月，使用体验更好。另外，DolphinScheduler 的调度管理界面易用性更好，同时支持 worker group 隔离。作为一个分布式调度，DolphinScheduler 整体调度能力随集群规模线性增长，而且随着新特性任务插件化的发布，可自定义任务类型这一点也非常吸引人。
 
从稳定性与可用性上来说，DolphinScheduler 实现了高可靠与高可扩展性，去中心化的多 Master 多 Worker 设计架构，支持服务动态上下线，自我容错与调节能力更强。
 
另外一个重要的点是，经过数月的接触，我们发现 DolphinScheduler 社区整体活跃度较高，经常会有技术交流，技术文档比较详细，版本迭代速度也较快。
 
综上所述，我们决定转向 DolphinScheduler。


## DolphinScheduler 接入方案设计


决定接入 DolphinScheduler 之后，我们梳理了平台对于新调度系统的改造需求。
 
总结起来，最重要的是要满足以下几点：
 
1. 用户使用无感知，平台目前的用户数有 700-800，使用密度大，希望可以降低用户切换成本；
2. 调度系统可动态切换，生产环境要求稳定性大于一切，上线期间采用线上灰度的形式，希望基于工作流粒度，实现调度系统动态切换；
3. 测试与发布的工作流配置需隔离，目前任务测试和发布有两套配置文件通过 GitHub维护，线上调度任务配置需要保证数据整个确性和稳定性，需要两套环境进行隔离。

针对以上三点，我们对架构进行了重新设计。
 
### 1 架构设计
 
1. 保留现有前端界面与DP API；
2. 重构调度管理界面，原来是嵌入 Airflow 界面，后续将基于 DolphinScheduler 进行调度管理界面重构；
3. 任务生命周期管理/调度管理等操作通过 DolphinScheduler API 交互；
利用 Project 机制冗余工作流配置，实现测试、发布的配置隔离。
 
[![176ca073b653e27d44.md.jpg](https://s1.imgpp.com/2021/12/10/176ca073b653e27d44.md.jpg)](https://imgpp.com/image/Zbsda)

改造方案设计
 
架构设计完成之后，进入改造阶段。我们对 DolphinScheduler 的工作流定义、任务执行流程、工作流发布流程都进行了改造，并进行了一些关键功能补齐。
 
- 工作流定义状态梳理

 
[![18e9d13314731833e1.md.jpg](https://s1.imgpp.com/2021/12/10/18e9d13314731833e1.md.jpg)](https://imgpp.com/image/Zbvzd)
 
我们首先梳理了 DolphinScheduler 工作流的定义状态。因为 DolphinScheduler 工作的定义和定时管理会区分为上下线状态， 但 DP平台上两者的状态是统一的，因此在任务测试和工作流发布流程中，需要对 DP到DolphinScheduler 的流程串联做相应的改造。

- 任务执行流程改造

首先是任务测试流程改造。在切换到 DolphinScheduler 之后，所有的交互都是基于DolphinScheduler API 来进行的，当在 DP 启动任务测试时，会在 DolphinScheduler 侧生成对应的工作流定义配置，上线之后运行任务，同时调用 DolphinScheduler 的日志查看结果，实时获取日志运行信息。

[![1954c93c34d86390df.jpg](https://s1.imgpp.com/2021/12/10/1954c93c34d86390df.jpg)](https://imgpp.com/image/Zb6Q0)

- 工作流发布流程改造
 
其次，针对工作流上线流程，切换到 DolphinScheduler 之后，主要是对工作流定义配置和定时配置，以及上线状态进行了同步。

[![207714f8c5060a9162.md.jpg](https://s1.imgpp.com/2021/12/10/207714f8c5060a9162.md.jpg)](https://imgpp.com/image/Zbx2b)
 
通过这两个核心流程的改造。工作流的原数据维护和配置同步其实都是基于 DP master来管理，只有在上线和任务运行时才会到调度系统进行交互，基于这点，DP 平台实现了工作流维度下的系统动态切换，以便于后续的线上灰度测试。

### 2 功能补全
 
此外，DP 平台还进行了一些功能补齐。首先是任务类型的适配。
 
- 任务类型适配

目前，DolphinScheduler 平台已支持的任务类型主要包含数据同步类和数据计算类任务，如Hive SQL 任务、DataX 任务、Spark 任务等。因为任务的原数据信息是在 DP 侧维护的，因此 DP 平台的对接方案是在 DP 的 master 构建任务配置映射模块，将 DP 维护的 task 信息映射到 DP 侧的 task，然后通过 DolphinScheduler 的 API 调用来实现任务配置信息传递。

[![1.md.png](https://s1.imgpp.com/2021/12/10/1.md.png)](https://imgpp.com/image/Z8fNH)
 
因为 DolphinScheduler 已经支持部分任务类型 ，所以只需要基于 DP 平台目前的实际使用场景对 DolphinScheduler 相应任务模块进行定制化改造。而对于 DolphinScheduler 未支持的任务类型，如Kylin任务、算法训练任务、DataY任务等，DP 平台也计划后续通过 DolphinScheduler 2.0 的插件化能力来补齐。 

### 3 改造进度

因为 DP 平台上 SQL 任务和同步任务占据了任务总量的 80% 左右，因此改造重点都集中在这几个任务类型上，目前已基本完成 Hive SQL 任务、DataX 任务以及脚本任务的适配改造以及迁移工作。

[![2.md.png](https://s1.imgpp.com/2021/12/10/2.md.png)](https://imgpp.com/image/Z8dgm)
 

### 4 功能补齐
 
- Catchup 机制实现调度自动回补

DP 在实际生产环境中还需要一个核心能力，即基于 Catchup 的自动回补和全局补数能力。

Catchup 机制在 DP 的使用场景，是在调度系统异常或资源不足，导致部分任务错过当前调度出发时间，当恢复调度后，会通过Catchup 自动补齐未被触发的调度执行计划。

以下三张图是一个小时级的工作流调度执行的信息实例。

在图 1 中，工作流在 6 点准时调起，每小时调一次，可以看到在 6 点任务准时调起并完成任务执行，当前状态也是正常调度状态。

[![11d6e4adb990afe71.md.png](https://s1.imgpp.com/2021/12/10/11d6e4adb990afe71.md.png)](https://imgpp.com/image/Z8IkI)
 图1

图 2 显示在 6 点完成调度后，一直到 8 点期间，调度系统出现异常，导致 7 点和 8点该工作流未被调起。

[![242413a5dcd1c029e.md.png](https://s1.imgpp.com/2021/12/10/242413a5dcd1c029e.md.png)](https://imgpp.com/image/Z8X64)
 图2
 
图 3 表示当 9 点恢复调度之后，因为 具有 Catchup 机制，调度系统会自动回补之前丢失的执行计划，实现调度的自动回补。 

[![3.md.png](https://s1.imgpp.com/2021/12/10/3.md.png)](https://imgpp.com/image/Z8tq8)
图3
 
此机制在任务量较大时作用尤为显著，当 Schedule 节点异常或核心任务堆积导致工作流错过调度出发时间时，因为系统本身的容错机制可以支持自动回补调度任务，所以无需人工手动补数重跑。

同时，这个机制还应用在了 DP 的全局补数能力中。
 
- 跨 Dag 全局补数

[![4.md.png](https://s1.imgpp.com/2021/12/10/4.md.png)](https://imgpp.com/image/Z8BtU)
DP 平台跨 Dag 全局补数流程

全局补数在有赞的主要使用场景，是用在核心上游表产出中出现异常，导致下游商家展示数据异常时。这种情况下，一般都需要系统能够快速重跑整个数据链路下的所有任务实例。

DP 平台目前是基于 Clear 的功能，通过原数据的血缘解析获取到指定节点和当前调度周期下的所有下游实例，再通过规则剪枝策略过滤部分无需重跑的实例。获取到这些实际列表之后，启动 clear down stream 的清除任务实例功能，再利用 Catchup 进行自动回补。

这个流程实际上是通过 Clear 实现上游核心的全局重跑，自动补数的优势就在于可以解放人工操作。

因为跨 Dag 全局补数能力在生产环境中是一个重要的能力，我们计划在 DolphinScheduler 中进行补齐。

## 现状&规划&展望


### 1 DolphinScheduler 接入现状
  
DP 平台目前已经在测试环境中部署了部分 DolphinScheduler 服务，并迁移了部分工作流。

对接到 DolphinScheduler API 系统后，DP 平台在用户层面统一使用 admin 用户，因为其用户体系是直接在 DP master 上进行维护，所有的工作流信息会区分测试环境和正式环境。

[![25.md.jpg](https://s1.imgpp.com/2021/12/10/25.md.jpg)](https://imgpp.com/image/Zb7rA)
DolphinScheduler 工作流定义列表
 
[![26.md.jpg](https://s1.imgpp.com/2021/12/10/26.md.jpg)](https://imgpp.com/image/ZbQlk)

[![27.md.jpg](https://s1.imgpp.com/2021/12/10/27.md.jpg)](https://imgpp.com/image/ZbodC)
DolphinScheduler 2.0工作流任务节点展示

DolphinScheduler 2.0 整体的 UI 交互看起来更加简洁，可视化程度更高，我们计划直接升级至 2.0 版本。

### 2 接入规划
 
目前 ，DP 平台还处于接入 DolphinScheduler 的灰度测试阶段，计划于今年 12 月进行工作流的全量迁移，同时会在测试环境进行分阶段全方位测试或调度性能测试和压力测试。确定没有任何问题后，我们会在来年 1 月进行生产环境灰度测试，并计划在 3 月完成全量迁移。

[![28.md.jpg](https://s1.imgpp.com/2021/12/10/28.md.jpg)](https://imgpp.com/image/Zb0z6)


### 3 对 DolphinScheduler 的期待

 
未来，我们对 DolphinScheduler 最大的期待是希望 2.0 版本可以实现任务插件化。

[![5.md.png](https://s1.imgpp.com/2021/12/10/5.md.png)](https://imgpp.com/image/Z8Oae)
 
目前，DP 平台已经基于 DolphinScheduler 2.0实现了告警组件插件化，可在后端定义表单信息，并在前端自适应展示。

“ 希望 DolphinScheduler 插件化的脚步可以更快一些，以更好地快速适配我们的定制化任务类型。
——有赞大数据开发平台负责人 宋哲琦”







