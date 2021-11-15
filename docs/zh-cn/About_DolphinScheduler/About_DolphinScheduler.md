# 关于DolphinScheduler：
Apache DolphinScheduler 是一个云原生的分布式易扩展并带有强大可视化的大数据工作流任务调度。致力于解决数据处理中错综复杂的依赖关系，不能直观监控任务健康状态等问题。DolphinScheduler 以 DAG(有向无环图)的方式将各种任务(Spark、Shell、Python、SQL、SeaTunnel等) 组装起来，可实时监控任务的运行状态，同时支持重试、从指定节点恢复失败、暂停及 Kill 任务等操作

# Cloud Native 
支持多云/数据中心工作流管理，也支持 Kubernetes、Docker 等多种部署方式，分布式调度，整体调度能力随集群规模线性增长

# 高可靠与高可扩展性
去中心化的多 Master 多 Worker 设计架构，支持服务动态上下线，调度能力随集群线性增长且有自我容错与恢复能力

# 支持多租户

# 丰富的使用场景 
包括暂停、停止、恢复等操作，以及丰富的任务类型，如 Spark、Hive、MR、Shell、Python、Flink 以及 DolphinScheduler 独有的子工作流、任务依赖设计，自定义扩展任务采用插件化 (SPI) 的实现方式

# 简单易用 
所有流程定义操作可视化编排，一键部署

