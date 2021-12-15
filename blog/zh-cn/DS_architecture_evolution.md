# Apache DolphinScheduler 架构演进及开源经验分享 

## 引言
来自 eBay 的文俊同学在近期的上海开源大数据 Meetup 上做了十分精彩的 “Apache DolphinScheduler 的架构演进” 分享。本次分享有近 200 人参与，在线观看次数超过 2,500 次

## 演讲者介绍

阮文俊，eBay 开发工程师，DolphinScheduler 贡献者。

视频分享参见
[![ DolphinScheduler 架构演进及如何参与开源经验分享 ](https://user-images.githubusercontent.com/15833811/126284089-249f1084-f1bf-40b2-bbd8-892f2ff28a31.png)](https://www.bilibili.com/video/BV11M4y1T7VT)



## Apache DolphinScheduler介绍

Apache DolphinScheduler是一个分布式去中心化，易扩展的可视化DAG工作流任务调度平台。致力于解决数据处理流程中错综复杂的依赖关系，使调度系统在数据处理流程中开箱即用。DolphinScheduler以有向无环图的方式将任务连接起来，可实时监控任务的运行状态，同时支持取消、暂停、恢复、从指定任务节点重跑等操作。

DolphinScheduler具有以下几个优良功能特性：

- **Cloud Native** — 支持多云/数据中心工作流管理，也支持 Kubernetes、Docker 部署和自定义任务类型，分布式调度，整体调度能力随集群规模线性增长

- **高可靠与高可扩展性** — 去中心化的多 Master 多 Worker 设计架构，支持服务动态上下线，自我容错与调节能力

- **支持多租户**

- **丰富的使用场景** — 包括流、暂停、恢复操作，以及额外的任务类型，如 Spark、Hive、MR、Shell、Python、Flink 以及 DS 独有的子工作流、任务依赖设计，扩展点采用插件化的实现方式

- **简单易用** — 所有流程定义操作可视化编排，定义关键信息一目了然，一键部署

关于DolphinSheduler更多功能介绍和开发文档请查阅官网详细信息https://dolphinscheduler.apache.org/zh-cn/


## 架构演进过程

**1.2.x架构**

DolphinScheduler最初进入Apache孵化器的版本是1.2，在这一版本中采用的架构由以下几个重要部分组成：

- 去中心化的master节点，负责工作流调度、DAG任务切分、任务提交监控和监听其它节点健康状态等任务
- 去中心化的worker节点，负责执行任务和维护任务的生命周期等
- 数据库，存储工作流元数据，运行实例数据
- Zookeeper，主要负责注册中心、分布式锁、任务队列等工作任务

1.2版本基本实现了高可靠的工作流调度系统，但是也存在多个问题：

- **重量级的worker**，worker节点需要负责多种任务
- 异步派发任务会导致**任务执行延迟**
- 由于masker和worker都需要依赖数据库，导致数据库压力大

[![archdiagram_zh.svg](https://dolphinscheduler.apache.org/img/archdiagram_zh.svg)]



**1.3.x架构**

针对1.2版本存在的问题，1.3架构进行了如下改进：

- 去任务队列，保证master节点同步派发任务，降低任务执行延迟
- 轻量级worker，worker节点只负责执行任务，单一化worker职责
- 减小数据库压力，worker不再连接数据库
- 采用多任务负载均衡策略，master根据worker节点资源使用情况分配任务，提高worker资源利用率

这些改进有效改进了1.2版本的缺陷，但仍存在一些问题，例如：

- master调度工作流时需要依赖**分布式锁**，导致工作流吞吐量难以提升
- 因为需要创建大量线程池，多数线程处于轮询数据库，导致**master资源利用率低**
- master轮询数据库，仍然导致**数据库压力大**
- 各组件存在**耦合**情况

![系统架构图](https://dolphinscheduler.apache.org/img/architecture-1.3.0.jpg)



**2.0架构**

针对1.3版本的缺陷，2.0架构进一步做出改进：

- **去分布式锁**，对master进行分区编号，实现错位查询数据库，避免多个节点同时访问同一个工作流造成的冲突问题
- 重构master线程模型，对所有工作流使用**统一的线程池**
- 重构数据库中**DAG元数据**模型
- **彻底的插件化**，所有扩展点都采用插件化实现
- **数据血缘关系分析**

#### 1 去分布式锁
![image](https://user-images.githubusercontent.com/15833811/126285801-ae58d9c6-e1fe-4cba-b7fd-26098824caf9.png)

#### 2 重构 master 中的线程模型
![image](https://user-images.githubusercontent.com/15833811/126285993-a4130bed-7eb2-4af1-a728-8b06a7b51089.png)
SchedulerThread 负责从数据库中查询 Command 并提交到 Command Queue

DagExecuteThreadPool 从 Command Queue 中取 command，并构造 DAG实例添加到 DAG 队列，进行处理，当前 DAG 没有未执行的任务，则当前 DAG 执行结束

TaskExecuteThreadPool 提交任务给 Worker

TaskEventThread 监听任务事件队列，修改任务状态

#### 3 彻底的插件化
![image](https://user-images.githubusercontent.com/15833811/126286101-d8003d09-df84-4fe5-a92c-f733da450b33.png)

所有扩展点都采用插件化实现

告警SPI

注册中心SPI

资源存储SPI

任务插件SPI

数据源SPI

……


## Apache DolphinScheduler发展方向

开发者阮文俊针对dolphinsheduler的未来发展方向，也分享了一些看法：

- 系统更稳、速度更快（高吞吐、低延迟、智能化运维、高可用）
- 支持更多的任务集成（深度学习任务、CI/CD等其它系统集成、存储过程和数据质量任务、容器调度任务、复杂调度场景等）
- 轻量化dolphinscheduler内核，提供基础调度服务
![image](https://user-images.githubusercontent.com/15833811/126286160-8987ccf8-a2c6-4e3d-a2ee-881e66e527e6.png)


## 如何参与开源贡献

最后，开发者阮文俊针对入门新手如何参与开源贡献的问题，提出了宝贵的指导意见：

- 从小事做起，积累开发经验
- 关注社区动态，积极参与讨论，更好融入社区
- 坚持开源精神，乐于帮助他人
- 持之以恒

![现场图](https://user-images.githubusercontent.com/15833811/126285232-152b8b7f-5d43-439f-ae7f-77b4ece50fe6.png)
