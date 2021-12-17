# 监控中心

## 服务管理

- 服务管理主要是对系统中的各个服务的健康状况和基本信息的监控和显示

### master监控

- 主要是master的相关信息。

<p align="center">
   <img src="/img/master-jk.png" width="80%" />
 </p>

### worker监控

- 主要是worker的相关信息。

<p align="center">
   <img src="/img/worker-jk.png" width="80%" />
 </p>

### Zookeeper监控

- 主要是zookpeeper中各个worker和master的相关配置信息。

<p align="center">
   <img src="/img/zk-jk.png" width="80%" />
 </p>

### DB监控

- 主要是DB的健康状况

<p align="center">
   <img src="/img/mysql-jk.png" width="80%" />
 </p>
 
## 统计管理

<p align="center">
   <img src="/img/Statistics.png" width="80%" />
 </p>
 
- 待执行命令数：统计t_ds_command表的数据
- 执行失败的命令数：统计t_ds_error_command表的数据
- 待运行任务数：统计Zookeeper中task_queue的数据
- 待杀死任务数：统计Zookeeper中task_kill的数据
 