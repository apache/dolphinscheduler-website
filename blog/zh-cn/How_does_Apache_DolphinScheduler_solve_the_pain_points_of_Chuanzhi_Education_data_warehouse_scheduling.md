---
title: Apache DolphinScheduler 如何解决传智教育数仓调度痛点？
keywords: Apache DolphinScheduler, 数仓调度, 传智教育
description: 本文主要介绍了传智教育数仓架构的演变和Apache DolphinScheduler在传智的实践与思考
---

**精彩回顾**

在  Apache DolphinScheduler&Hudi 联合 Meetup 上，传智教育的资深研究员 孔帅，为我们带来题为《Apache DolphinScheduler在传智教育的实践》的分享。

演讲主要分为 3 部分：

1. 传智教育数仓架构的演变

2. DolphinScheduler在传智的实践与思考

3. 展望未来

# **1、传智教育数仓架构的演变**

首先我们来看一下传智教育数仓架构的演变。

## 01 **传智教育数仓 1.0 架构**

在传智教育数仓 1.0 的架构体系中，我们首先聊一下我们的主体业务流程。

![](/img/2023-9-5/1.png)

上图为传智教育的核心分析流程。首先客户会访问官方网站，客户在访问网站期间可以咨询在线客服，了解我们的课程。如果客户感觉这些课程有帮助，并产生学习意向，会给我们留下一些线索，比如电话、微信、QQ 号等。

我们拿到这些之后，线下客服人员会根据这些线索和客户进行进一步沟通联系。如果这些线索联系不到，则把这些线索设置为无效线索；如果能够联系上，客服会和客户进行电话沟通或微信交流。

当客户报名后，就会开始进行学习对应课程。

在这一系列操作过程当中，所有的数据记录都会通过后台存储在服务器上，而我们的大数据系统会在每天凌晨用 T+1 的方式进行数据采集和分析计算。分析计算的主要有访问数据、咨询数据、意向数据、线索数据，还有一些报名数据、考勤数据等。将这些数据分析计算结果以后，我们会把这些结果同步到应用系统中，比如决策系统、报表系统等，并在应用系统当中的 BI 进行展示。

基于这套业务流程，我们设计了教育数仓 1.0 架构。在 1.0 版本的架构中，我们使用的原始数据主要有内部的一些电咨系统、线下的面授系统，以及在线教育系统、客户管理系统等，主要使用的是这些系统里的一些结构化数据。

对于这些结构化数据来说，Sqoop 能够很好地进行数据的采集，所以早期我们主要使用 Sqoop 进行 ETL，数据存储主要使用 HDFS，并基于 MapReduce 引擎的 Hive 来进行分析。

我们在数仓中采取了一些分层，主要有 6 层，第一层是我们的 ODS 原始数据层，保留最原始的数据，不会做任何的变更，这一层也会保留我们最完整的数据。为了保证数据的安全性，我们 ODS 层采用的都是 外部表。

接下来是 DWD 层，主要进行清洗转换操作，清洗主要是把无效垃圾过滤掉，转换则是进行枚举值、字段等转换，以及数据脱敏工作。

经过 DWD 层的信息转换之后，我们能够提供一个比较干净的应用数据。再接下来就是我们的 DWM 层，这一层主要是用来生成我们中间可以复用的一些组件，主要的操作有两种，一种是生成明细宽表，用来为后续的查询提高性能，减少服务器的消耗；另一种是做一些轻度汇总的工作。基于这些天数据和小时数据，我们在后面的  DWS 层进行进一步的数据汇总，这是一个数据集市，会基于中间层的数据进行数据汇总，把时间维度计算出来，比如说年维度、月度、季度、周等，并把总累计值数据计算出来。

数据集市会把最终的数据导出到 RPT 应用层，主要保存的是个性化业务数据。

另外我们还有一个 DIM 维度层，主要是存放一些标准维度数据，最后将这些数据导出给应用系统。应用系统一般使用都MySQL 数据库，导出的数据通过 Spring boot 来对外提供数据接口，用 BI 展现。

因为我们之前采用的是离线数仓，采用的也是 T+1 的计算方案。所以初期的数据能够满足我们计算需求。

初期的任务脚本，我们选择的也是当时比较流行的 Shell 脚本，而且 1.0 版本时我们的调度任务并不是特别的多，所以当时 Oozie 的功能和性能都能够满足我们的调度需求。

以下为离线数仓的若干核心主题设计思路：

![](/img/2023-9-5/2.png)

![](/img/2023-9-5/3.png)

![](/img/2023-9-5/4.png)

![](/img/2023-9-5/5.png)

基本流程是将不同主题表格抽取到 ODS 层，形成明细宽表，既有宽表的相关指标和维度，将宽表合并成一张大的数据集市，在 DWM 层进行汇总和计算。

## 02 **2.0 架构**

随着非结构化数据和业务场景越来越多，原来 的 ETL 工具 Sqoop 已经无法满足我们的 ETL 需求了，于是我们对 1.0 架构进行了一些调整，主要包括：

- 除 Sqoop 之外，增加 Flume 进行日志文件采集，使用 Python 自研了 ETL 工具；

- 随着数据量逐步增加，Hive 已经不能满足计算性能的需求。通过对各种分析引擎的对比，选择了 Presto；

- 任务脚本也在逐步地体系化，Shell 脚本的可维护性和拓展性不如 Python，所以 把脚本替换成了 Python。

![](/img/2023-9-5/6.png)

另外，系统分层也进行了一些变更，我们在 2.0 版本中去掉了维度层，把维度表都直接放在了 DWD 层中；原来的 DWS 层，数据集市层被替换为了 DM 层，也是数据集市层，作用是一样的。另外，我们新加了一个轻度汇总层和明细宽表层，也就是 DWB 层和 DWS 层。DWB 层的主要作用是把 DWD 里的表，在 DWB 层进行宽表化，将雪花模型转换为星型模型。生成了明细宽表以后，在后续计算中能够提升性能，降低服务器的损耗。DWS 层主要进行轻度汇总，比如按小时、按天先进行轻度的汇总，再在 DM 层中按照年、季度等进行计算。

剩下的 RPT 和 Presto 是整个公司提供所有分层数据的一个入口。

最后，我们还变更了调度工具。因为之前的调度工具 Oozie 配置比较复杂，而且功能相对比较少，可能还会出现服务阻塞的情况，对于升级兼容问题权限问题也都不是特别好。所以，我们把 Oozie 替换DolphinScheduler。

## 03 **核心技术点**

首先是 Sqoop。在数仓 1.0 版本中，我们的原始数据主要是结构化数据，Sqoop 正好就是一款专业的结构化数据传送的 ETL 工具，但随着数据和业务场景增多，ETL 场景也越来越复杂，Sqoop 已经满足不了我们的需求了。所以在 2.0 版本中，我们把 Sqoop 替换成了DolphinScheduler 体系。在 DolphinScheduler 和 Flume 基础之上，我们通过自研的 Python ETL 工具，就可以做到更加灵活地支持各种复杂的业务场景。

Hive 成本低、稳定性好，生态兼容性好，但其缺点也很明显：慢。随着数据量大幅增加，Hive 已经不能满足我们的计算性能需求了。经过各种对比，我们决定在 2.0 版本中选择 Presto 作为新的引擎。

之前我们还参考了 SparkSql、Impala、HAWQ 和 ClickHouse 等，结果如下：

- SparkSql 虽然比 Hive 快，但和 Presto 比单表&多表的查询性能都不突出。

- Impala 多表查询性能优异，但单表查询不如 Presto，不支持 OrcFile、不支持 update、delete 和 grouping sets 等语法，不支持 Date 数据类型。

- HAWQ、Greenplum 比较中庸，用起来比较复杂，性能也不突出。

- ClickHouse 的单表性能较好，但是多表性能不突出，兼容性也不如Presto。

**Presto 的优势：**

- Presto 和 Hive 都是 Facebook 公司开源的，两者兼容好，Trino 是从 Presto 分支出来的，两者非常相似。

- Presto/Trino 单表&多表的查询性能优异，数据量支持 EB 级的数仓和数据湖。

- Presto/Trino 兼容 Hive，还支持 mysql、oracle 等关系型数据库，kafka、redis、MongoDB 等非关系型数据库。

- Presto/Trino 能够进行异构数据源的跨库读写操作。

接下来就是 shell 脚本。1,0 版本汇总我们主要使用 Shell，因为当时任务较少，也并不是特别的复杂，但是随着脚本的体系化，我们需要脚本的可维护性和可扩展性，这些缺点就越来越突出，Shell是用来进行系统管理的脚本，功能有限，性能低开销大。Python 无论是性能方面，还是一致性、扩展性，都比需要脚本要好，现在已经成为了全球编程语言排行榜的第一名。

所以在 2.0 的数仓架构体系中，我们把 shell 脚本变更为了 Python 脚本。

最后就是调度工具，传智教育最初使用的调度软件是Oozie，由于Oozie功能的限制，在不断迭代的需求中，我们重新调研了各种调度工具，最终选择了国产开源的Apache DolphinScheduler。

![](/img/2023-9-5/7.png)

![](/img/2023-9-5/8.png)

上面两张图是我们使用 Apache DolphinScheduler 的一些功能，比如文件管理功能和数据源。文件管理功能非常方便，可以让我们很方便地引用文件，这些文件之间也可以互相引用。

数据源创建之后也可以不断复用，对我们提升效率来说很有帮助。

由于 Oozie 历史的原因，目前 Sqoop、HiveSQL、Presto 等任务在DolphinScheduler 中使用的主要还是 Shell 组件，但**受益于 DolphinScheduler 的可视化界面、资源管理、多租户管理、权限管理、告警组管理、多项目管理等功能，调度效率已有大幅提高。**

![](/img/2023-9-5/9.png)

这个就是我们这个数仓架构的技术演变，接下来介绍一下传智教育在技术演变的过程中调度工具使用的痛点，以及我们如何解决这些问题。

# 2、DolphinScheduler 在传智教育**的实践**

## 01 **调**度的痛点

- **XML 配置复杂**

传智教育以前采用的工作流调度软件是 Oozie。Oozie 是一个工作流引擎，它的一个特点是默认采用 HPDL语言（XML）定义流程，可视化支持依赖于第三方工具软件（比如HUE），自带的可视化界面功能较弱，安装也标胶复杂。

Oozie  工作流的核心组成部分有两个：job.properites 和 workflow.xml。前者主要保存一些常用的参数变量，后者是核心文件，具体的工作流都是在 workflow 里面去定义的。

![](/img/2023-9-5/10.png)

 workflow.xml

![](/img/2023-9-5/11.png)

job.properties

上图展示了一个非常简单的工作流，打印 Oozie，再返回一个错误信息进行输出。但就是这么简单的一个工作流，我们可以看到这个过程需要配置大量的 XML 标签，非常麻烦，工作效率非常低。随着我们的调度工作增加，业务场景复杂化，这个调度软件对我们的生产效率已经产生了非常大的影响。

- **功能组件少**

另外就是功能组建比较少，Oozie 对流行技术的反应有些迟钝，比如PySpark等当下流行的分析计算引擎。虽然官方已经宣称支持 PySpark 任务，但在实际应用中 Oozie 的 PySpark 任务却支持较差、问题不断。

此外，多租户管理、告警组管理、多环境管理、Worker 分组管理、项目管理、资源管理等功能，Oozie 也都不具备。

- **阻塞死锁**

![](/img/2023-9-5/12.png)

Oozie 在执行过程中，每个任务都会启动一个 oozie-launcher 加载器，oozie-launche 会占用很多内存；

Oozie launcher 的生命周期是数据任务开始之前到结束，期间资源不会释放，如果此时数据任务得不到充足的资源就会一直等待，有充足资源时才会执行数据任务；

如果同时提交了多个 Oozie 任务，或是 Oozie 有多个并行子任务，会导致内存不够，而 Oozie launcher 在得不到充足的资源时就会一直等待资源，导致资源和任务互相等待从而造成死锁现象。

- **权限控制 & 升级兼容**

**权限：**Oozie 基本没有权限控制，也没有多租户功能；

**兼容：**Oozie 依赖于 Hadoop 集群版本，如果更新最新版，容易出现与现有集群不兼容的问题。

# 3、**DolphinScheduler 解决痛点**

以上是 1.0 版本中我们的调度所遇到的一些痛点。那么我们是如何解决这些痛点的呢？

Apache DolphinScheduler 是一个分布式易扩展的可视化工作流任务调度平台。

相对于 Oozie 的复杂 xml 配置流程，DolphinScheduler 所有的流、定时操作都是可视化的，通过拖拽任务来绘制 DAG，并可进行实时监控。

同时 DolphinScheduler 支持一键部署，无需复杂的安装过程，提升工作效率。

- **功能丰富**

DolphinScheduler 的一个好处是功能比较丰富，和 Oozie 相比，相比， DolphinScheduler 紧跟流行技术。

对 PySpark 等当下流程的分析计算引擎，DolphinScheduler 做到了快速升级进行兼容。并且新组件使用起来便捷高效，对于工作效率提升很大。

同时，DolphinScheduler 还在不断升级完善各种功能，比如多租户管理、告警组管理、多环境管理、Worker 分组管理、项目管理、资源管理等功能，功能丰富，升级也快。

- **高可靠性**

![](/img/2023-9-5/13.png)

另一个特点是高可靠性，与 Oozie 的阻塞死锁现象对比，DolphinScheduler 采用任务缓冲队列机制来避免过载；单个机器上可调度的任务数量可以灵活配置，当任务过多时会缓存在任务队列中，不会导致机器卡死，就像红绿灯一样。

同时，DolphinScheduler 支持去中心化的多 Master 和多 Worker 服务对等架构，可以避免单 Master 压力过大。

- **权限控制 & 升级兼容**

权限：Oozie 基本没有权限控制；DolphinScheduler 可以通过对用户进行资源、项目、数据源的访问授权，不同用户间互不影响。

兼容：Oozie 容易出现与现有集群不兼容的问题；DolphinScheduler 升级不会影响之前集群的设置，升级方式操作简单。

![](/img/2023-9-5/14.png)

![](/img/2023-9-5/15.png)

以上为 DolphinScheduler 工作界面截图，帮助我们解决了很多调度痛点。

# 4、**展望未来**

最后是我们对未来的展望。

我们目前虽然还未使用 Apache DolphinScheduler 的所有组件，但它已经帮助我们解决了以前大多数的痛点，大幅提高了工作效率，后续我们准备向更多的项目组推广使用。

在目前的使用中，DolphinScheduler 对 PySpark 任务支持良好，但Presto 插件使用时还有些适配问题，我们也在做 Presto 功能的适配，后续计划将数据源类型优化为支持动态热插拔的功能，让任意类型的数据源都可以被随时使用。

如上所述，由于 DolphinScheduler 社区活跃、版本更新速度较快，在使用过程中会遇到一些适配问题，同时我们也有很多新的 idea，我们会积极地参与到社区中，不断优化完善，助力 Apache DolphinScheduler 更上一层楼！