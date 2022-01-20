### 负载均衡

### Master至Worker 负载均衡算法

Master分配任务至 worker,提供以下算法:

- 加权随机

- 平滑轮询

- 线性负载

依据master.properties 中 master.host.selector 来配置所需算法。


### Worker 负载均衡配置

配置 worker.properties

#### 权重

提供的负载算法是基于权重来进行加权分配，权重影响分流结果。可以修改 worker.weight 的值来对不同机器设置不同权重。

#### 预热

由于 JIT 优化， worker 后需要低功率运行一段时间后正常运行。（默认为：10min）

### 负载均衡算法细述

#### 随机

在符合的 worker 中随机选取一台（权重会影响它的比重）。

#### 平滑轮询

加权轮询算法一个明显的缺陷。即在某些特殊的权重下，加权轮询调度会生成不均匀的实例序列，这种不平滑的负载可能会使某些实例出现瞬时高负载的现象，导致系统存在宕机的风险。为了解决这个调度缺陷，我们提供了平滑加权轮询算法。

每台均具有**workerweight**和**current_weight**每次路由都会遍历所有worker，使其current_weight + weight，并累加所有 worker 的 weight等于total_weight，挑选current_weight 最大值为本次执行任务 worker，与此同时并将current_weight-total_weight等于这台 worker。

#### 线性加权

线性加权会每隔一段时间会向注册中心上报自己的负载信息。根据以下指标判断：

- load 平均值（默认是 CPU 核数 *2）
- 可用物理内存（默认是 0.3，单位是 G）

在 worker.properties 修改以下属性来自定义配置：

- worker.max.cpuload.avg=-1
 (worker最大cpuload均值，只有高于系统cpuload均值时，worker服务才能被派发任务. 默认值为-1: cpu cores * 2)
- worker.reserved.memory=0.3
(worker预留内存，只有低于系统可用内存时，worker服务才能被派发任务，单位为G)
