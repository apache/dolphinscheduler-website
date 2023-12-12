---
title: Apache DolphinScheduler 在联想作为统一调度中心的落地实践
keywords: Apache DolphinScheduler, 联想, 最佳实践
description: 在 ApacheCon Asia 2022 Meetup上，来自联想的数据架构师、Apache DolphinScheduler PMC & Committer 、Apache Local Community 北京成员 李岗 老师分享了 Apache DolphinScheduler 在联想作为统一调度中心的落地实践。
---

点亮 ⭐️ Star · 照亮开源之路

**GitHub:**[https://github.com/apache/dolphinscheduler](https://github.com/apache/dolphinscheduler)

![c029a062df808edb5e30f2c7dae5014a.png](/img/2023-10-16/1.png)

在 ApacheCon Asia 2022 Meetup上，来自联想的数据架构师、Apache DolphinScheduler PMC & Committer 、Apache Local Community 北京成员 李岗 老师分享了 Apache DolphinScheduler 在联想作为统一调度中心的落地实践。

感谢本文整理者 关博 对社区的贡献，您的贡献是社区不断前进的动力！

**本次演讲主要包含以下四个部分：**

- 统一调度中心的需求背景介绍
- 为什么会选择 Apache DolphinScheduler 作为统一调度中心
- Apache DolphinScheduler 在联想的落地实践中涉及的改造点
- 后期规划(Roadmap)

# 统一调度中心的需求背景介绍

定时任务对每个开发人员来讲是一个常见的业务场景，我们通常都会遇到需要对数据进行备份、同步。一般的解决方式最开始会选用 Linux Crontab、基于 Spring 开发定时的任务，随着定时任务的需求越来越多，如何更好更方便的管理定时任务的生命周期，这时候统一调度系统的需求就呼之欲出了。

## 需求收集

在联想内部也是基于以上类似的背景需求，收集到公司其他业务部门一些迫切的需求，如下所示：

**支持丰富的任务类型的需求：**

- 支持定时通知任务。

- 支持 ETL 任务。

- 支持 HTTP 任务执行链。

**方便对任务进行监控、统一管理类的需求：**

- 对任务实时监控。

- 管理多种任务类型。

- 业务系统开发的定时任务方便统一管理。

- 任务脚本便于管理和维护。

**保证多任务正确、准时触发类需求：**

- 任务调度需要保证可靠性。

- 上下游依赖的任务需要事件通知触发机制。

## 需求抽象汇总

![14e130b87d0122bac58d96368a096bd7.png](/img/2023-10-16/2.png)

**高可用：**

- Master 节点支持 HA 模式。

- Worker 节点支持分布式。

**支持丰富的任务类型和用户友好性能：**

- 支持多种任务类型。

- 轻松定义复杂的任务依赖关系。

**轻量化：**

- 易操作，通过 UI 方便手动调度、手动暂停/停止/恢复，同时支持失败重试/告警、从指定节点恢复失败、Kill 任务等操作。

**支持业务隔离性：**

- 支持多租户。

**资源线性可扩展：**

- 随着业务任务接入越来越多，方便线性扩展集群，保证任务的性能。

**业务可扩展：**

- 便于业务系统二次开发。

# 为什么会选择Apache DolphinScheduler 作为统一调度中心？

通过以下点四点来介绍，我们最终选择 Apache DolphinScheduler 作为统一调度中心的原因：

- 调度系统调研对比

- DolphinScheduler 核心功能介绍

- DolphinScheduler 架构设计

- DolphinScheduler 社区发展

## 调度系统调研对比

![f22090e26a244030abcf591549be6dd3.png](/img/2023-10-16/3.png)

![6bcfce11fd0217a57ad87e76ced92260.png](/img/2023-10-16/4.png)

当时，我们通过调研 Apache DolphinScheduler、XXL-JOB、AirFlow，并基于以下几点选用了 Apache DolphinScheduler：

- 高可靠，支持集群HA，集群去中心化。

- 简单易用，DAG 监控界面，所有流程定义可视化，通过托拉拽任务定制 DAG，通过 API 与第三方系统对接，支持一键部署。

- 丰富的使用场景，支持多租户、多种任务类型、支持暂定恢复等操作。

- 高扩展，Master 和 Worker 支持动态上下线、支持自定义任务类型。

- 社区活跃度高。

## DolphinScheduler 核心功能介绍

**DAG 编排**

DolphinScheduler 通过拖拽将 Task 以 DAG 的方式组装起来。通过 UI 可以实时监控任务的运行状态，同时支持重试、从指定的节点恢复失败、暂定以及 Kill 任务等操作。支持丰富的使用场景，提供近20多种任务类型。

任务类型主要分为两个类：逻辑任务和物理任务，逻辑任务包含子流程、依赖节点、条件任务等。物理任务包含 Flink、Spark, Hive, M/R, Python、Shell 任务等。

![4409a2e53fd54047680a682c9832099e.png](/img/2023-10-16/5.png)

上图是工作流编排页面，保存之后会生成工作流定义。

**工作流定义**

工作流定义列表提供了编辑、上线、下线、定时、运行、删除等操作等操作功能。

![f3d38c7fd9f883db9b5a1c69036a51c6.png](/img/2023-10-16/6.png)

对某个工作流定义点击按钮，操作之后会生成工作流实例。

**工作流实例**

工作流实例中可以看到任务的运行类型、调度时间、运行时常、运行状态等。我们可以对正在运行工作流进行停止、暂停等操作，也可以对已经终止的流程进行重跑、删除等操作。

![e0a99f7a424c33a4541d52e2c84f8863.png](/img/2023-10-16/7.png)

每个工作流实例包含1个或者多个任务实例。

**任务实例**

点击工作流实例名称，可跳转到工作流实例 DAG 图查看任务状态，或者点击操作列中的“查看日志”按钮，可以查看任务执行的日志情况。

![222ee60245de2e65f54c65fc15a52f6a.png](/img/2023-10-16/8.png)

**2.X 版本新特性**

- 任务结果参数的传递。

- 新增工作流血缘关系 UI，可以清晰的看到工作流的状态（在线、下线）。

- 新增任务类型：Switch（分支节点）、SeaTunnel(原名WaterDrop）（ETL节点）。

- 拆分工作流定义和任务之间的关系。

- 新增工作流版本管理。

![f6f3499ad0dc9858d12eac61fc17af20.png](/img/2023-10-16/9.png)

![9a8b6128dfa6de9935a02dcd8bde347f.png](/img/2023-10-16/10.png)

# Apache DolphinScheduler 架构设计

## 社区贡献

### Apache **DolphinScheduler1.2 架构**

![ae4a2221b41fe236d6f48f977fa5db32.png](/img/2023-10-16/11.png)

在 1.2 版本中，Master、Worker 采用无中心设计，Master 主要负责 DAG 切分，任务的提交以及监控，监听与其他 Master 和 Worker 的健康状态以及容错处理。Worker 主要负责维护任务的生命周期管理，Worker 启动的时候会向 ZooKeeper 注册临时节点并维持心跳。

1.2 架构的不足之处，在于任务队列基于 ZooKeeper 实现。Master 将任务数据存放到任务队列，Worker 通过分布式锁的方式去消费任务队列来执行任务，造成了延迟任务开始执行的时间。另外为保证任务队列的性能，ZooKeeper 节点中并未存储执行任务所需的全部数据。许多任务的元数据如租户，队列和任务实例信息等都需要由 Worker 操作数据库进行获取，对于复杂的工作流，时效性、任务的吞吐量、数据库压力都会成为调度系统的瓶颈。所以在 1.3 的架构设计中，我们着重考虑到减少 Worker 的压力，设计了如下新架构。

### **DolphinScheduler 1.3 架构**

![2984b2c6e922b69f40b74f907a103b2b.png](/img/2023-10-16/12.png)

在 1.3版本中，Master 职能更加丰富，Worker 则更加专注于执行。

任务队列基于 Netty 实现。Worker 去除数据库操作，只负责任务的运行，职责更单一。Master 和 Worker 直接通信进行任务分发，降低调度延迟。Master 多种策略分发任务，Worker 节点负载均衡策略：随机、轮询以及 CPU 和内存的线性加权多种负载均衡。

### **DolphinScheduler 2.X 架构**

![36925aecaa1dff6c8ae1bc178fdab912.png](/img/2023-10-16/13.png)

- 新增可扩展设计能力

![460adc25dbe727cf8625cfa070affdf7.png](/img/2023-10-16/14.png)

所有扩展点都采用 SPI 插件化实现，如：注册中心 SPI、数据源 SPI、任务插件 SPI、资源存储 SPI 、告警 SPI，SPI 设计保持简洁，不过多依赖第三方 JAR 包，各个插件保持独立。

- 高性能：Master 重构

2.0版本对 Master 进行了重构，主要优化点是去分布式锁和减少线程的利用。

- - Master 重构-去分布式锁方案

![761669f6a869844233a2cd46b1cf80dd.png](/img/2023-10-16/15.png)

在 1.0 的架构中多个 Master 共同工作，和 DB 交互需要借助分布式锁，导致并发会降低。2.0架构中，去掉了分布式锁，当 Master 上下线的时候会根据自己的分片编号用合适的算发计算出自己的 command 的槽位，Master 根据槽位查询数据库获得 command，并生成工作流实例，然后来构建 DAG，生成任务实例，提交执行任务。

- - Master 重构-线程池工作关系

![4d372d4339bd33ba346602476529b108.png](/img/2023-10-16/16.png)

1.0 架构中的线程池使用比较多，每个工作流都会创建一个任务线程池，造成资源的大量浪费。2.0架构减少了线程池的使用。

MasterSchedulerService 负责从 Command 表中分片获取 command，构建工作流实例，启动 WorkflowExecuteThread 处理，WorkflowExecuteThread 负责构建 DAG、DAG 切分、生成任务实例、提交到任务队列。同时负责处理任务状态和工作流状态变化。StateEventProcessor 负责接收 Master 和 Worker 发过来的任务状态和工作流状态变化事件，并提交 WorkflowExecuteThread 处理状态，StateWheelExecuteThread 负责任务或者工作流的超时监控。

## Apache DolphinScheduler 社区发展

![bb6b95aa17fca1bd198e50620d08cc5c.png](/img/2023-10-16/17.png)

通过以上关键性的指标可以看到从进入孵化器、从孵化器毕业，一直到现在，DolphinScheduler 在持续不断地健康发展。

## 为什么选择DolphinScheduler？

基于以上的几点，我们最终选择了 Apache DolphinScheduler，以下特性非常符合我们的业务需求：

- 支持复杂的依赖调度。

- 支持任务失败重试。

- 任务告警机制。

- 支持资源文件在线上传和管理。

- 支持更多的丰富任务类型，如：Spark、shell、MR、Hive、python 等。

- 支持集群高可用。

- 可视化 DAG 界面。

- 支持多租户、权限管理。

- 简单易用、高扩展。

# Apache DolphinScheduler 在联想的

落地实践中涉及的改造点

为了支持业务部门的需求，联想内部对 Apache DolphinScheduler 做了如下几点的改造：

- HTTP 任务参数传递

- 引入 Java Client

- 接入安全认证

- 项目全局参数改造

## HTTP 任务参数传递

在 2.X 的版本中 DolphinScheduler 已经支持了 shell、sql 任务参数的传递，但是 http 任务的参数传递还需要自研。

![725bdb929e7095feb954783e10794838.png](/img/2023-10-16/18.png)

上面的图中可以看到，在上一个 Http 任务请求参数定义时，通过 OUT 来指定输出结果的变量。

![36ce607771e1a4dd227fa42c5c411d86.png](/img/2023-10-16/19.png)

而在下一个 Http 任务请求参数中来引用上一个 Http 输出结果的变量，这样就实现上下游依赖的 Http 任务参数的传递。

## 引入 Java Client

Java Client（执行器）是基于 Spring 开发。

执行器任务不会纳入到 DolphinScheduler 的集群里来管理。Worker 可以调用 Java Client 进程的多个业务任务。另外，执行器的日志可以通过 SDK提供的日志类 TaskLogger.log 来打印出来，通过 UI 去查看。

![130ab3fb2bcc309a7cfc5ab750a4317c.png](/img/2023-10-16/20.png)

Worker 如何调用 Java Client 进程的多个业务任务呢？

示例：我们在开发执行器的时候，定义业务任务方法 lenovoDemoJobHandler，在方法名上面加上类似的注@DolphinJavaMethodTask("lenovoDemoJobHandler")，通过以下 UI 指定业务任务方法以及执行器的地址，Worker 就会调用执行器对应的业务任务方法了。

![52af43ec47f0eb62b52d5cd5f731e567.png](/img/2023-10-16/21.png)

## 接入安全认证

接入联想内部的认证，这块就不过多介绍了。

## 项目全局参数改造

我们首先看下在 DolphinScheduler 里面支持那些参数。

首先是任务级别的参数，支持在每个任务里面自定义任务的局部参数，设置任务级别的参数后，参数优先级别是：任务参数\> 工作流定义全局参数 。

**下图是设置任务参数：**

![525b29826a88da7709ec305143557d9e.png](/img/2023-10-16/22.png)

如果在引入项目全局参数后，参数优先级别是：任务参数> 工作流定义全局参数 \> 项目全局参数，下图是设置：

![914f2637a22aaa152cd4685ed7405085.png](/img/2023-10-16/23.png)

下图是任务参数、工作流定义全局参数 、项目全局参数优先级顺序。

![b0489acb1bf9b8e2280409046831c840.png](/img/2023-10-16/24.png)

我们也可以修改工作流定义的启动参数，下图是设置工作流定义的启动参数：

![3d2fb408e1a2e1bdb625136446faaf1f.png](/img/2023-10-16/25.png)

加入工作流定义的启动参数后，参数的优先级别谁发生稍微的变化，任务参数 > 工作流定义启动参数 >工作流定义参数 \> 项目全局参数。下图是优先级顺序：

![bdf9376f6f6a375434b7838f3bd7ad3c.png](/img/2023-10-16/26.png)

# 后期规划(Roadmap)

目前社区已经支持了 3.0 版本，有以下几个改进点：

- UI 重构

- 支持数据质量

- 支持任务组

- 多种任务类型

## UI 重构

全新 UI，前端代码更健壮。

![ff9a0c4aa918e572a154d52f9475863a.png](/img/2023-10-16/27.png)

## 数据质量

通过拖拉拽生成数据质量任务，内嵌十种数据集校验规则。

支持在工作流运行前进行数据质量校验过程，通过在数据质量功能模块中，由用户自定义数据质量的校验规则，实现了任务运行过程中对数据质量的严格控制和运行结果的监控。

![7fb28a8e43db43c43e9788454fc97832.png](/img/2023-10-16/28.png)

## 任务组

任务组主要用于控制任务实例并发并明确组内优先级。用户在新建任务定义时，可配置当前任务对应的任务组，并配置任务在任务组内运行的优先级。当任务配置了任务组后，任务的执行除了要满足上游任务全部成功外，还需要满足当前任务组正在运行的任务小于资源池的大小。当大于或者等于资源池大小时，任务会进入等待状态等待下一次检查。当任务组中多个任务同时进到待运行队列中时，会先运行优先级高的任务。

![e379e4cbb684d6e8dfe03c0a660ff63c.png](/img/2023-10-16/29.png)

![ad21f2b0d2c3a6705dfbb7eedd16fb09.png](/img/2023-10-16/30.png)

## Roadmap

![8f2f312270b286cc5ac41d03d2551b73.png](/img/2023-10-16/31.png)



最后非常欢迎大家加入 DolphinScheduler 大家庭，融入开源世界！

我们鼓励任何形式的参与社区，最终成为 Committer 或 PPMC，如：

- 将遇到的问题通过 GitHub 上 issue 的形式反馈出来。

- 回答别人遇到的 issue 问题。

- 帮助完善文档。

- 帮助项目增加测试用例。

- 为代码添加注释。

- 提交修复 Bug 或者 Feature 的 PR。

- 发表应用案例实践、调度流程分析或者与调度相关的技术文章。

- 帮助推广 DolphinScheduler，参与技术大会或者 meetup 的分享等。

欢迎加入贡献的队伍，加入开源从提交第一个 PR 开始。

- 比如添加代码注释或找到带有 ”easy to fix” 标记或一些非常简单的 issue(拼写错误等) 等等，先通过第一个简单的 PR 熟悉提交流程。

注：贡献不仅仅限于 PR 哈，对促进项目发展的都是贡献。

相信参与 DolphinScheduler，一定会让您从开源中受益！