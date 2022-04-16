# 数据分析师干了专业数仓工程师的活，自如是怎么做到的？

<div align=center>

<img src="/img/2022-4-6/1.jpg"/>

</div>

数据分析师作为企业数据资产的缔造者之一，具有一定的维度与指标体系管理、血缘分析、ETL 调度平台等技能。能够灵活使用调度平台会为数据分析师带来很大的便利，然而对于编程技能水平参差不齐的数据分析师来说，一个操作简单，使用成本低的调度平台才能让他们如虎添翼，而不是增加额外的学习成本。

与大多企业相比，自如大数据平台的独特之处在于，大量的数仓加工并非由专业的数仓工程师完成，而是由数据分析师所做。而自如的数据分析师之所以能够做到专业团队才能完成的复杂的数据处理、分析工作，与其调度系统迁移到 Apache DolphinScheduler 分不开。

在不久前的 Apache DolphinScheduler& Apache ShenYu(Incubating) Meetup 上，**自如大数据研发经理 刘涛**，为我们分享了受数据分析师们欢迎的调度系统是什么样的。

<div align=center>

<img src="/img/2022-4-6/2.png"/>

</div>

**刘涛**自如大数据研发经理，负责自如大数据基础平台构建，建设一站式大数据开发平台。


## 01 **自如大数据平台现状**

<div align=center>

<img src="/img/2022-4-6/3.png"/>

</div>

自如大数据平台

上图是自如大数据离线平台的简单图示，数据源包括 MySQL、Oracle 等业务库数据，以及各种日志数据，通过 Hive 离线 T 加 1 采集、另外使用Hive acid加上Flink实现了一个10分钟级别的业务库数据更新。

数据加工是分析师关心的部分，这个过程可以配置调度、配置依赖和 SQL 开发。而在数据落地上，我们采用了 ClickHouse 的 OLAP 引擎，数据应用层使用网易有数提供报表平台。

自如的大数据平台与业界大多数平台相差不大，但独特之处在于除了支持专业数仓开发工程师外，大量的数据分析师参与到了数仓加工之中。这就要求大数据平台要足够简化。

## 02 **分析师的期望**

<div align=center>

<img src="/img/2022-4-6/4.png"/>

</div>

由于数据分析师的编码水平参差不齐，有些分析师会写 SQL，而有些分析师根本不会写 SQL。即使是对于会写 SQL 的分析师，在面对任务依赖概念的理解上，也会觉得难度很大。

因此，分析师群体对于调度的期望是要简单，上手成本低。

## **03 Airflow的实现方式**

<div align=center>

<img src="/img/2022-4-6/5.png"/>

</div>

<div align=center>

<img src="/img/2022-4-6/6.png"/>

</div>

一开始，自如选用的是 Airflow，使用Airflow 可视化插件Airflow DAG createmanager plug-in来供分析师用，底层使用hivepartitionsensor，用数据依赖的方式配置调度，便于分析师理解和使用，这套解决方案，对于分析师来说体验尚可，但是面临几个较大的问题：

1. 数据依赖的底层实现导致的任务重跑非常复杂；
2. 任务量比较多后，调度性能较差，有些任务调起延迟较大；
3. 与一站式大数据开发平台集成二开成本比较高；
4. 原生不支持多租户。
## **04 Apache DolphinScheduler改造与 Airflow任务迁移**


以上几个比较重要的挑战，促使我们重新进行调度选型。经过对比分析后，我们选择了 Apache DolphinScheduler。

对于分析师来说，数据依赖是一个好理解的概念，但任务依赖就比较让人费解。

比较理想的方案是对分析师展示的是数据依赖，底层实现是任务依赖，并且这数据依赖是自动生产的，不需要分析师手动输入依赖表。

做到这一点，首先需要解决一个问题，**如何根据一段 SQL，判断出这段 SQL 的输入输出表？**

<div align=center>

<img src="/img/2022-4-6/7.png"/>

</div>

<div align=center>

<img src="/img/2022-4-6/8.png"/>

</div>

由于是在 Hive 的环境中，所以需要看下 Hive  sql 的解析过程。

如上图所示hive利用antlr 进行语法和语义解析，生成抽象语法树。举例，如下一段 sql 语句：

<div align=center>

<img src="/img/2022-4-6/9.png"/>

</div>

解析成的语法树：

<div align=center>

<img src="/img/2022-4-6/10.png"/>

</div>

遍历这棵抽象语法树就可以准确获得输入输出，我们发现并不需要从头来做，Hive 147 中就实现了这个功能。

[https://issues.apache.org/jira/browse/HIVE-147](https://issues.apache.org/jira/browse/HIVE-147)

<div align=center>

<img src="/img/2022-4-6/11.png"/>

</div>

我们解析了输入输出之后，就可以把输入输出表和对应的 Apache DolphinScheduler调度任务关联起来，这样就完成了对分析师看到的是数据依赖，底层实现是任务依赖。当然这种实现就会让每个任务都很小，大部分任务都是只最终产出一张表，调度数量会比较多，但目前来看，没有带来性能问题。

<div align=center>

<img src="/img/2022-4-6/12.png"/>

</div>

这之后就是面临的如何把Airflow中的任务平滑的迁移到 Apache DolphinScheduler 中，Airflow的任务都是一个个Python文件，Airflow 的调度器不停地扫描Pyhton文件所在文件目录，生成调度任务。核心实现类就是上图中的 DagFileProcessorManager，我们就可以参考这个类的实现来解析Python任务，生成Apache DolphinScheduler 任务定义需要的 Json 串，从而完成调度任务的迁移。

最后是做个广告，我们是自如大数据基础平台，负责大数据的部署、 运维、 监控、优化、二开，并且在此之上构建一站式的大数据开发平台，欢迎加入我们。

我的分享就到这里，感谢大家！


## 05 **特别感谢**

**联合主办方**

Apache ShenYu(Incubating)

**合作方**

示说网、开源中国、CSDN、稀土掘金、开源社、SeaTunnel 社区、思否 和 ALC 北京

**礼品赞助**

YY 直播

Apache ShenYu(Incubating)

**感谢主持人，低代码无代码平台 Treelab  张德通**，以及**活动志愿者 曹海洋** 对本场活动的大力支持！

