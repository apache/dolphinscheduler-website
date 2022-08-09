# 杭州思科对 Apache DolphinScheduler Alert 模块的改造

<div align=center>
<img src="/img/3-16/1.png"/>
</div>

杭州思科已经将 Apache DolphinScheduler 引入公司自建的大数据平台。目前，**杭州思科大数据工程师 李庆旺** 负责 Alert 模块的改造已基本完成，以更完善的 Alert 模块适应实际业务中对复杂告警的需求。
<div align=center>

<img src="/img/3-16/2.png"/>

</div>

李庆旺

杭州思科 大数据工程师，主要负责 Spark、调度系统等大数据方向开发。

我们在使用原有的调度平台处理大数据任务时，在操作上多有不便。比如一个对数据进行处理聚合分析的任务，首先由多个前置 Spark 任务对不同数据源数据进行处理、分析。最后的 Spark 任务对这期间处理的结果进行再次聚合、分析，得到我们想要的最终数据。但遗憾的是当时的调度平台无法串行执行多个任务，需要估算任务处理时间来设置多个任务的开始执行时间。同时其中一个任务执行失败，需要手动停止后续任务。这种方式既不方便，也不优雅。

而 Apache DolphinScheduler 的核心功能——**工作流定义可以将任务串联起来**，完美契合我们的需求。于是，我们将 Apache DolphinScheduler 引入自己的大数据平台，而我主要负责 Alert 模块改造。目前我们其他同事也在推进集成 K8s，希望未来任务在 K8s 中执行。

今天分享的是 Alert 模块的改造。

## 01 **Alert 模块的设计**

<div align=center>

<img src="/img/3-16/3.png"/>

</div>

DolphinScheduler Alert 模块的设计

Apache DolphinScheduler 1.0 版本的 Alert 模式使用配置alert.properties的方式，通过配置邮箱、短信等实现告警，但这样的方式已经不适用于当前的场景了。官方也进行过告警模块重构，详情设计思路参考官方文档：

[https://github.com/apache/dolphinscheduler/issues/3049](https://github.com/apache/dolphinscheduler/issues/3049)

[https://dolphinscheduler.apache.org/en-us/docs/dev/user_doc/contribute/backend/spi/alert.html](https://dolphinscheduler.apache.org/en-us/docs/dev/user_doc/contribute/backend/spi/alert.html)


Apache DolphinScheduler 告警模块是一个独立启动的服务，核心之一是 AlertPluginManager 类。告警模块集成了很多插件，如钉钉、微信、飞书、邮件等，以独立的形式写在源码中，启动服务时会解析插件并将配置的参数格式化成JSON形式，前端通过JSON自动渲染出页面。AlertPluginManager 在启动时会缓存插件到内存中。AlertServer类会启动线程池，定时扫描DB。

当工作流配置了通知策略，同时Worker 执行工作流结束，执行结果匹配通知策略成功后，DB插入告警数据后，线程池扫描 DB，调用AlertSender 类的send方法传入告警数据。告警数据绑定的是告警组，一个告警组对应了多个告警实例。AlertSender类遍历告警实例，通过AlertPluginManager类获取插件实例，调用实例的发送方法，最后更新结果。这是 Apache DolphinScheduler 的整个告警流程。

需要注意的是，Alert server 启动的同时也启动了 RPC 服务，这是一种针对特殊类型任务，如 SQL 查询报表而设计的告警方式，可以让 Worker 通过 RPC 直接访问 Alert  Server，利用 Alert 模块完成告警，这个数据不写入 DB。但从整体上来说，Apache DolphinScheduler 的告警模式还是以写 DB，异步交互的方式为主。

<div align=center>
<img src="/img/3-16/4.png"/>
</div>

定义工作流之后，可以在启动前设置通知策略，绑定告警组。

<div align=center>

<img src="/img/3-16/5.png"/>

</div>

在任务维度，可以配置超时告警，当任务超时可以触发报警。这里没有告警组配置，任务和工作流共用一个告警组，当任务超时，会推送到工作流设置的告警组。

<div align=center>

<img src="/img/3-16/6.png"/>

</div>

上图为系统告警配置的流程图。可以看到，一个工作流可以配置多个任务实例，任务可以配置超时触发告警，工作流成功或者失败可以触发告警。一个告警组可以绑定多个告警实例。这样的配置不太合理，我们希望告警实例也可以匹配工作流/任务实例的状态，也就是工作流成功和失败调用同一个告警组，但是触发不同的告警实例。这样使用起来更符合真实场景。

<div align=center>

<img src="/img/3-16/7.png"/>

</div>

创建告警组，一个告警组可以绑定多个告警实例。

## 02 **大数据任务告警场景**

<div align=center>

<img src="/img/3-16/8.png"/>

</div>

以下是我们日常工作中的一些 常见的大数据任务告警场景。

对于定时任务，在开始执行前、任务上线、下线或修改参数，以及任务执行成功或失败时都发送通知。区别是，对于同一任务不同结果，我们希望触发不同的通知，比如成功发短信通知或者钉钉微信群通知即可，而任务失败了需要在第一时间通知对应的研发人员，以得到更快的响应，这时候钉钉微信群中@对应研发人员或者电话通知会更及时。目前，公司的任务调度平台是任务中调用API 进行通知，这种与代码强耦合的方式极其不方便，实际上可以抽象成一个更为通用的模块来实现。
Apache DolphinScheduler 的架构虽然符合实际场景需求，但问题在于告警模块页面配置只能选择成功触发通知，或失败触发通知，绑定的是同一个告警组，即无论成功还是失败，告警的途径是相同的，这一点并不满足我们在实际生产环境中需要不同结果以不同方式通知的需求。因此，我们对 Alert 模块进行了一些改造。

## 03 **Alert 模块的改造**

<div align=center>

<img src="/img/3-16/9.png"/>

</div>

改造的第一步是告警实例。此前，新增一个告警实例，触发告警就会触发该实例的 send 方法，我们希望在定义告警实例时可以绑定一个告警策略，有三个选项，成功发、失败发，以及成功和失败都发。


在任务定义维度，有一个超时告警的功能，实际上对应失败的策略。

<div align=center>

<img src="/img/3-16/10.png"/>

</div>

上图为改造完成的配置页面，在创建告警实例页面，我们添加了一个告警类型字段，选择是在成功、失败，或者无论成功或失败时调用插件。

<div align=center>

<img src="/img/3-16/11.png"/>

</div>

上图为改造后Apache DolphinScheduler 告警模块的架构，我们对其中进行了两点改造。


其一，在执行完工作流或任务时，如果触发告警，在写入DB时，会保存本次工作流或者任务的执行结果，具体是成功还是失败。

第二，调用告警实例发送方法添加了一个逻辑判断，将告警实例与任务状态进行匹配，匹配则执行该告警实例发送逻辑，不匹配则过滤。


改造后告警模块支持场景如下：

<div align=center>
<img src="/img/3-16/12.png"/>
</div>

详细设计请参考 issue：[https://github.com/apache/dolphinscheduler/issues/7992](https://github.com/apache/dolphinscheduler/issues/7992)

代码详见：[https://github.com/apache/dolphinscheduler/pull/8636](https://github.com/apache/dolphinscheduler/pull/8636)

此外，我们还针对 Apache DolphinScheduler 的告警模块向社区提出几点优化的建议，感兴趣的小伙伴可以跟进 issue，一起来做后续的工作：

* 工作流启动或上下线或参数修改时，可以触发通知；
* 告警场景针对 worker 的监控，如果 worker 挂掉或和 ZK 断开失去心跳，会认为 worker 宕机，会触发告警，但会默认匹配 ID 为 1 的告警组。这样的设置是在源码中写明的，但不看源码不知道其中的逻辑，不会专门设置ID为1的告警组，无法第一时间得到worker宕机的通知；
* 告警模块目前支持飞书、钉钉、微信、邮件等多种插件，这些插件适用于国内用户，但国外用户可能使用不同的插件，如思科使用的 Webex Teams，国外常用告警插件 PagerDuty，我们也都进行开发并贡献给了社区。同时还有一些比较常用的比如Microsoft Teams等，感兴趣的小伙伴也可以提个PR，贡献到社区。
最后一点，可能大数据领域的小伙伴对于前端不太熟悉，想要开发并贡献告警插件，但是想到需要开发前端就不想进行下去了。开发 Apache DolphinScheduler 告警插件是不需要写前端代码的，只需要在新建告警实例插件时，在 Java 代码中配置好页面中需要输入的参数或者需要选择的按钮（源码详见org.apache.dolphinscheduler.spi.params），系统会自动格式化成 JSON 格式，前端通过form-create 可以通过 JSON 自动渲染成页面。因此，完全不用担心写前端的问题。
