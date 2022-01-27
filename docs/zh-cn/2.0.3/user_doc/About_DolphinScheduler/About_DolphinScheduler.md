# DolphinScheduler 文档
Apache DolphinScheduler是一个分布式易扩展的可视化DAG工作流任务调度开源系统。解决数据研发ETL 错综复杂的依赖关系，不能直观监控任务健康状态等问题。DolphinScheduler以DAG流式的方式将Task组装起来，可实时监控任务的运行状态，同时支持重试、从指定节点恢复失败、暂停及Kill任务等操作

# 原则

### 简单易用
DAG监控界面，流程定义可视化，拖拽任务定制DAG，API方式与第三方系统对接, 一键部署
### 高可靠性
去中心化Master和Worker,采用任务队列避免过载，防止造成机器延时
## 丰富的使用场景
支持多任务类型、多租户
## 高扩展性
支持自定义任务类型，调度能力随集群线性增长，Master和Worker支持动态上下线

## 组成

- dolphinscheduler-alert 告警模块，提供 AlertServer 服务。

- dolphinscheduler-api web应用模块，提供 ApiServer 服务。

- dolphinscheduler-common 通用的常量枚举、工具类、数据结构或者基类

- dolphinscheduler-dao 提供数据库访问等操作。

- dolphinscheduler-remote 基于 netty 的客户端、服务端

- dolphinscheduler-server MasterServer 和 WorkerServer 服务

- dolphinscheduler-service service模块，包含Quartz、Zookeeper、日志客户端访问服务，便于server模块和api模块调用

- dolphinscheduler-ui 前端模块
