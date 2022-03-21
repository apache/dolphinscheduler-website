# 全面拥抱 K8s，ApacheDolphinScheduler 应用与支持 K8s 任务的探索

<div align=center>
<img src="/img/2022-03-21/1.png"/>
</div>

>K8s 打通了主流公私云之间的壁垒，成为唯一连通公私云的基础架构平台。K8s 是未来云端的趋势，全面拥抱 K8s 成为更多企业推动 IT 现代化的选择。
>>杭州思科基于 Apache DolphinScheduler，也在进行支持 K8s 的相关探索，且部分功能已经成功上线运行。今天，来自杭州思科的大数据工程师 李千，将为我们分享他们的开发成果。

<div align=center>
<img src="/img/2022-03-21/2.png"/>
</div>

李千，杭州思科 大数据工程师，多年大数据解决方案经验，有 Spark，Flink，以及调度系统，ETL 等方面的项目经验。

正文：

本次我的分享主要分为这几部分，Namespace 管理，持续运行的 K8s 任务，K8s 任务的工作流调度，以及未来的规划。

## Namespace 管理

### 资源管理

第一部分中，我首先介绍一下资源管理。我们引入资源管理目的，是为了利用 K8s 集群运行不属于 Apache DolphinScheduler 所属的调度概念上的任务，比如 Namespace，更类似于一个数据解决方案，如果 CPU 的 memory 有限，就可以限制队列中的资源，实现一定的资源隔离。

以后我们可能会把一部分资源管理功能合并到 Apache DolphinScheduler 上。

### 增删维护管理

我们可以加一些 Type，即标记的类型，比如某些 Namespace 只允许跑一些特定类型的 job。我们可以统计Namespace 下面的任务数量、pod 数量、请求资源量、请求等，查看队列的资源使用情况，界面默认只有管理员才可以操作。
<div align=center>
<img src="/img/2022-03-21/3.png"/>
</div>

### 多 K8s 集群

K8s 支持多个集群，我们通过 Apache DolphinScheduler 客户端连接到多个 K8s 集群，batch、PROD 等可以搭建多套这K8s 集群，并通过 Namespace 支持多套 K8s 集群。

我们可以编辑所开发的集群，修改所有的属性，如内存等。

在新版中，用户权限的管理位于 user master 中，可以给某个用户授权，允许用户可以向某个 Namespace 上提交任务，并编辑资源。

## 02 持续运行的 K8s 任务

第二部分是关于我们目前已经支持的任务类型。

### 启动不退出的普通镜像，如 ETL 等

比如 ETL 这种提交完之后必须要手动操作才会退出的任务。这种任务一旦提交，就会把数据 sink，这种任务理论上只要不做升级，它永远不会停。
<div align=center>
<img src="/img/2022-03-21/4.png"/>
</div>

这种任务其实调度可能用不到，因为它只有启停这两种状态。所以，我们把它放在一个实时列表中，并做了一套监控。POD是实时运行的状态，主要是通过一个 Fabris operator 进行交互，可以进行动态进行扩展，以提高资源利用率。

### Flink 任务

我们对于 CPU 的管理可以精确到 0.01%，充分利用了 K8s 虚拟 CPU。
<div align=center>
<img src="/img/2022-03-21/5.png"/>
</div>
<div align=center>
<img src="/img/2022-03-21/6.png"/>
</div>
<div align=center>
<img src="/img/2022-03-21/7.png"/>
</div>
另外，我们也常用 Flink 任务，这是一种基于 ETL 的扩展。Flink 任务界面中包含编辑、查看状态、上线、下线、删除、执行历史，以及一些监控的设计。我们用代理的模式来设计 Flink UI，并开发了权限管控，不允许外部的人随意修改。

Flink 默认了基于 checkpoint 启动，也可以指定一个时间创建，或基于上一次 checkpoint 来提交和启动。

Flink 任务支持多种模式镜像版本，因为 K8s 本身就是运行镜像的，可以直接指定一些镜像来选择使用包，或通过文件上传的方式提交任务。

另外，Batch 类型的任务可能一次运行即结束，或是按照周期来调度，自动执行完后退出，这和 Flink 不太一样，所以对于这种类型的任务，我们还是基于 Apache DolphinScheduler 做。

## 03 K8s 任务的运行

### K8s 任务的工作流调度

我们在最底层增加了一些 Flink 的 batch 和 Spark 的 batch 任务，添加了一些配置，如使用的资源，所运行的 namespace 等。镜像信息可以支持一些自定义参数启动，封装起来后就相当于插件的模式，Apache DolphinScheduler 完美地扩展了它的功能。
<div align=center>
<img src="/img/2022-03-21/8.png"/>
</div>

### Spark 任务

Spark 任务下可以查看 CPU 等信息，上传文件支持 Spark Jar 包，也可以单独上传配置文件。
<div align=center>
<img src="/img/2022-03-21/9.png"/>
</div>

这种多线程的上层，可以大幅提高处理速度。

## 04 其他和规划

### Watch 状态

<div align=center>
<img src="/img/2022-03-21/10.jpeg"/>
</div>

除了上述改动，我们还对任务运行状态进行了优化。

当提交任务后，实际情况下运行过程中可能会出现失败，甚至任务的并行度也会基于某些策略发生改变。这时，我们就需要一种 watch 的方式来动态实时地来获取任务状态，并同步给 Apache DolphinScheduler 系统，以保证界面上看到的状态一定是最准确的。

Batch 做不做 watch 都可以，因为这不是一个需要全量监听的独立任务而且 namespace 的资源使用率也是基于 watch 模式，这样就可以保证状态都是准确的。

### 多环境

多环境是指，同一个任务可以推送到不同的 K8s 集群上，比如同一个Flink 任务。

从代码上来说，watch 有两种方式，一种是单独放一些 pod，比如当使用了 K8s 模块时，定义多个 K8s 集群的信息，在每个集群上创建一些watch pod 来监听集群中的任务状态，并做一些代理的功能。另一种是跟随api或单独服务，启动一个监听服务监听所有k8s集群。但这样无法而外做一些k8s内外网络的代理。

Batch 有多种方案，一种是可以基于 Apache DolphinScheduler 自带功能，通过同步的方式进行 watch，这和 Apache DolphinScheduler 比较兼容。关于这方面的工作我们未来可能很快会提交 PR。Spark 使用相同的模式，提供一些 pod 来进行交互，而内部代码我们使用的是 Fabric K8s 的 client。

今后，我们将与 Apache DolphinScheduler 一起共建，陆续支持这里讨论的功能，并和大家分享更多关于我们的工作进展。谢谢大家！
