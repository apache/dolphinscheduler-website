---
title: 数据分析师干了专业数仓工程师的活，自如是怎么做到的？
keywords: Apache DolphinScheduler, 自如, 血缘分析
description: 开始引入Apache DolphinScheduler，并在此基础上进行了一系列的改造和优化，其中包括自动生成SQL血缘解析调度，支持Ambari管理Apache DolphinScheduler，详细描绘Apache DolphinScheduler在自如中的应用以及演变过程
---

![file](/img/2023-9-19/1.png "file")

## 用户案例 | 自如

随着自如业务的快速发展，不断增长的调度任务和历史逾万的存量任务对平台稳定性提出了更高的要求。同时，众多非专业开发人员也需要一种更为“亲民”的调度平台使用体验。

如何满足这些日渐凸显的需求对自如大数据平台的开发团队来说，无疑是巨大的挑战。团队经过深入的研究和对比，发现Apache DolphinScheduler是一个能够满足自如当前所有核心需求的项目。

至此，团队开始引入Apache DolphinScheduler，并在此基础上进行了一系列的改造和优化，其中包括自动生成SQL血缘解析调度，支持Ambari管理Apache DolphinScheduler，以及端到端调度组件的可用性监控等功能，从而更好地满足企业内需求。

本文将详细描绘Apache DolphinScheduler在自如中的应用以及演变过程。

## 作者简介

陈卓宇，自如大数据平台运维，负责自如离线数据调度，Apache StreamPark PPMC，Apache DolphinScheduler Contributor

## 业务挑战

1. 复杂的业务场景：自如的数据处理业务场景丰富多样，涵盖了To C和To B的品质居住产品、智慧生活服务、智能家装家居、智慧社区组织运营四大板块。
2. 大量的历史存量任务：自如历史累计的离线任务数量庞大，目前累计离线调度任务已达到1万+的规模，这对平台的稳定性提出了非常高的要求。
3. 离线任务增量大：目前，自如仍处于业务飞速发展的阶段，离线任务的数量持续增长，这对平台的扩展性和处理能力提出了极高的挑战。
4. 非专业开发人员的易用性需求：自如的数据使用人员主要包括运营人员、分析师、产品BP等非专业开发人员，他们对于配置调度的易用性要求严格，需要能支持SQL化操作，以及用户友好的配置界面，以达到"平民化"的使用体验。

## 解决方案

### 自如对调度技术选型的核心诉求

自如对于调度技术的选型诉求可以从两个方面进行剖析：一是用户层面，二是技术运维层面。

**在用户层面，我们的用户期望平台能提供：**

1. 简单易用的操作方式：使用户能快速上手，高效地进行需求逻辑开发。
2. 丰富的实践案例：供用户参考和学习，助力他们更好地理解和使用平台。

**在技术运维层面，我们的开发和运维团队期望平台能提供：**

1. 通用的技术栈：便于进行二次开发，快速地将项目集成到自如的企业生态中。
2. 丰富的组件：支持多种多样的任务类型，满足各种业务需求。
3. 优秀的架构设计：确保项目具有高可用性、易扩展性以及支撑海量任务调度的能力。
4. 活跃的开源社区：遇到问题时，团队能够便捷且迅速地从社区获得必要的帮助。

针对上述的核心诉求，自如团队对行业内的所有相关项目进行了深入的调研，并最终发现，Apache DolphinScheduler是唯一一个能满足自如团队所有核心诉求的项目。因此，我们选择了Apache DolphinScheduler2.0.6版本作为自如的离线调度技术解决方案。

### 架构设计

目前，自如已经成功地通过内部研发构建了一套可供全集团使用的大数据平台。为了进一步满足离线数据仓库这一垂直领域的需求，自如选择使用Apache DolphinScheduler进行集成与扩展。这一改进旨在提升整体平台的能力，从而让其能够为集团内的各个业务部门提供更强大的数据加工、数据编排的能力。

![file](/img/2023-9-19/2.png "file")

如图所示，数据调度是自如数据开发流程中的第四个环节，属于整个流程中承上启下的核心。在流程的上游，如河图（数据血缘查询服务）的血缘功能以及Hue的查询能力，共同为生成SQL业务逻辑提供支持，而数据调度的角色则是编排加工这些SQL逻辑。

在流程的下游，首先是数据质量模块，该模块的核心职责是确保调度输出的准确性，也就是我们所说的"口径"的确保。通过这一环节，我们保障了数据的质量，为后续步骤提供了可靠的基础。其次是数据服务化模块，这个模块的主要任务在于，对调度结果进行再次的汇总和加工，使其在指标层面上达到我们的预期，并以标准化的Restful服务的形式提供出来，以供用户使用。

## 二次开发实践

### 血缘解析自动生成调度

![file](/img/2023-9-19/3.png "file")

如上图所示，SQL任务节点的复杂性由其涉及的众多上游依赖表关系可见一斑，近30个表关系互相交织。在这种复杂的依赖关系面前，如果仅由业务人员来完成，他们不仅需要花费大量时间去理解公司相关业务线下表的关联关系，同时还需掌握DolphinScheduler的配置和使用方式，这对他们来说是一项沉重的负担。

因此，自如团队找到了一种新的解决方案：血缘解析自动生成调度。这个方案的核心价值在于，它完全的解放了业务人员，使其从繁琐的调度配置中脱离出来。仅需提供SQL语句，程序会读取这个SQL，解析它，得出调度需要的输入表和输出表。解析的结果将用于自动生成并配置调度。

![file](/img/2023-9-19/4.png "file")

如图所示，用户只需将在Hue中调试完毕的SQL一键同步至调度平台。在此，只需点击“解析”按钮，系统就会自动根据SQL的血缘关系解析到所有相关的依赖项，并根据这些信息自动生成任务的有向无环图（DAG）。这样的设计旨在最大限度地简化用户的操作步骤，同时确保调度任务的准确性和效率。

所以，原本复杂的配置流程被简化为用户提供SQL语句，剩下的全部由系统完成。从而实现业务人员仅需专注于业务需求，高效、简洁地完成工作，而无需为了应对这些需求困于复杂配置和技术细节。

### 支持混合的数据依赖和任务依赖

![file](/img/2023-9-19/5.png "file")

自如内部历史存量的调度任务有近1万个，这些任务分散在业务线自研调度、Airflow调度等多个调度平台上。团队并不打算将这些历史存量任务统一的迁移到新的调度平台上，更倾向于保持现状，同时满足新的需求。基于这样的考虑，自如在DolphinScheduler上设计实现了"数据依赖"功能，使DolphinScheduler支持混合的依赖模式，从而为调度平台提供更好的兼容性。

通过这种方式，DolphinScheduler既能处理"任务依赖"，也能处理"数据依赖"。"任务依赖"是指通过检测任务是否执行成功来触发工作流执行，而"数据依赖"是通过检测数据的分区是否产生来判定工作流是否向下执行。这种混合的依赖处理方式使DolphinScheduler能够将新的任务和业务线间的历史调度任务进行有效链接，形成一个统一、高效的调度体系。

### 任务依赖重构

DolphinScheduler使用DEPENDENT插件来实现任务间的依赖关系。然而，这里会存在一个隐藏的问题，即任务间的依赖关系是基于工作流定义的code码来建立的。当构建一个复杂的基于数仓分层的任务流时，比如ods->dwd->ads->xxxx，如果用户误删了一个最上游的ods任务，并重新创建了该任务，那么任务之间的依赖关系将无法正确建立，因为尽管任务名称相同，但是code码已经改变了。  
为了解决这个问题，我们对任务依赖机制进行了重构。改为基于任务名称来建立的依赖关系，并在创建任务时进行规则验证，确保任务名称在整个集群中是唯一的。这样一来，即使用户误删除后重新创建任务，依赖关系仍然能够正确地挂载上。

通过这个改进，我们确保了任务之间的依赖关系在整个调度系统中的准确性和稳定性。用户不再需要担心误删而导致依赖关系无法建立的问题。这样，用户可以更加自信地构建复杂的任务流，确保任务间的依赖关系正确地被建立和维护。

### 支持基于配置的调度生成

在实际工作中，我们还会遇到一些用户不懂SQL，但仍然需要进行数据的加工和使用的需求。为了满足这部分用户，我们实现了基于配置的调度生成模式。这种模式的设计思路是让用户通过简单的配置来定义数据加工和处理的流程，而无需编写复杂的SQL语句。

![file](/img/2023-9-19/6.png "file")

![file](/img/2023-9-19/7.png "file")

通过选择配置，包括表、表关系、筛选条件、目标等信息，我们的平台可以自动根据用户所选信息生成相应的SQL语句。然后，根据生成的SQL语句，再进行上述提到的SQL解析和调度配置的步骤，完成调度任务的配置过程。

这种基于配置的调度生成模式，使得不懂SQL语言的用户也能够轻松完成数据的加工和使用，大大降低了学习和使用的门槛。同时，它也提高了开发效率，减少了出错的可能性。这样的设计使得我们能够更好地覆盖不同技术水平的用户，并满足他们的需求。

### Ambari管理DS的支持

1. 参数配置统一管理、多版本对比

DolphinScheduler作为一个分布式应用程序，对配置文件的每次修改都需要在各节点之间进行同步。这个过程不仅繁琐，而且无法追溯历史变动。特别是对线上服务的配置，一个微小的变动可能就会导致服务的瘫痪。鉴于这些问题，我们的团队急需一个能提供明确配置项展示、配置回滚以及历史版本对比等功能的工具。

Ambari为我们提供了这样的解决方案。因此，我们通过编写插件，将DolphinScheduler与Ambari进行集成，从而实现对所有配置项的统一管理。这种集成方式不仅减轻了运维人员的工作压力，还增强了服务的稳定性，为系统的健壮性和可靠性带来了有力的保证。

配置项统一管理：  
![loading-ag-1402](/img/2023-9-19/8.png "file")

配置项修改版本对比：  
![file](/img/2023-9-19/9.png "file")  
![loading-ag-1406](/img/2023-9-19/10.png "file")

2. 可视化的一键集群启停

在Ambari的管理界面上，用户可以清晰地查看整个集群的状态，包括各节点的运行情况。通过简单的一键操作，用户能够启动或停止部署在多个服务器节点上的整个集群，这使得集群管理更加直观和便捷。

![file](/img/2023-9-19/11.png "file")

3. 支持自动服务故障“自我修复”

在Ambari平台上，实现DolphinScheduler服务的“自我修复”非常简单。只需在平台上选择需要被监听的DolphinScheduler服务，就可以利用Ambari的Service Auto Start功能来轻松实现。当DolphinScheduler服务因某些异常情况宕机时，Service Auto Start会自动不断尝试重启服务，从而确保DolphinScheduler服务的高可用性，极大地提高了系统的稳定性。

![file](/img/2023-9-19/12.png "file")

### 端到端调度组件可用性监控WatchDog

虽然DolphinScheduler已经拥有了任务容错机制和高可用机制，但在实际执行过程中，仍需要涉及于很多外部服务，例如Hiveserver2、ClickHouse等。在这种复杂的环境中，对于运维人员来说，其主要目标并不是要求系统一定要100%无故障，而是希望在出现问题时能立即得到响应，从而使运维人员能尽快介入并解决问题。因此，自如开发了一种端到端的全链路可用性测试任务—WatchDog。

WatchDog的目标是监控整个调度流程的可用性，一旦发现问题，立即向运维人员发出警报。这样的设计大大提高了问题的响应速度和系统的稳定性，减轻了运维人员的负担，也增强了对整个系统运行状态的控制能力。  
![loading-ag-1414](/img/2023-9-19/13.png "file")

### 内部核心逻辑“埋点”

在实际使用DolphinScheduler（2.0.6版本）的初期，毫不掩饰地说，确实遇到了许多问题。然而，这些问题并没有使团队气馁，因为团队也充分理解DolphinScheduler作为一个相对年轻的调度产品，出现各种问题是非常正常。因此，我们决定修复这些问题，来确保DolphinScheduler能顺利的在自如“安家”。

在这个过程中，遇到了许多挑战。例如，调度系统在运行时，可能会有成百上千个任务在同一时间并行执行，每个工作流都对应一个线程对象和内置的存储队列。此外，还有众多的后台线程和远程Netty通讯触发流转等逻辑交织在一起，这些都给问题的定位带来了很大的困难。

为了解决这个问题，我们开发了一个专门的异常注解。用该注解标注方法后，当发生异常时，它会记录输入参数、输出参数、线程名称、执行时间、所在服务器节点以及详细的异常堆栈信息。然后，通过企业微信和电话告警，将这些信息立即通知给运维人员，从而实现问题的及时定位和处理。因此，我们对调度流程的关键环节，如启动、停止、补数、容错和定时调度，进行了注解覆盖。这种方法极大地增强了我们对系统运行状态的控制力，使我们能更快地发现并解决问题。

### JVM参数优化监控

JVM调优的关键在于寻求一种'平衡'，我们通过调整内存大小来平衡垃圾回收的频率与时长。

我们的优化目标是：一，保证服务的吞吐率；二，减少服务的停顿时间。同时，我们对DolphinScheduler中可能存在内存泄露的代码进行了修正，特别是将一些static属性更改为局部变量，以此来避免内存泄漏。这是因为局部变量只在代码块中起作用，而static属性是与类对象相关的。在JVM中，类的卸载条件非常严格，我们的应用程序是由系统类加载器加载的，这样加载的类是不会被卸载的。这就意味着如果将一个对象挂在该类加载器上，该对象就不会被释放。而相比之下，局部变量在使用后会很快被释放。因此，我们的目标是避免对JVM进程中的任何集合或重量级对象进行静态标记。

下面是我们在JVM参数优化方面所做的JVM配置，供读者参考：

- XX:+UseG1GC：使用G1垃圾回收器。
- XX:MaxGCPauseMillis=500：设置最大GC暂停时间为500毫秒。
- XX:+PrintGCDetails
- XX:+PrintGCTimeStamps
- XX:+PrintGCCause：打印GC的详细信息、时间戳和GC原因。
- XX:+UseGCLogFileRotation
- XX:NumberOfGCLogFiles=10
- XX:GCLogFileSize=10M：启用GC日志文件的轮转，保留10个文件，每个文件大小为10兆字节。
- XX:+HeapDumpOnOutOfMemoryError、
- XX:+HeapDumpBeforeFullGC：在OutOfMemoryError发生时生成堆转储文件，并在执行Full GC之前生成堆转储文件。
- Xmx16g、-Xms16g：设置堆的最大和初始大小为16GB。
- XX:MetaspaceSize=512m
- XX:MaxMetaspaceSize=512m：设置元空间的初始大小和最大大小为512MB。

此外，我们还通过使用javaAgent来收集JVM相关的指标，并将其上报到Prometheus，以建立更为全面的监控。

### 权限管控

我们对调度权限的管理主要体现在通过控制HQL任务执行队列来实现。首先，在登录过程中，调度平台会通过LDAP对用户进行验证。服务端会获取用户LDAP所在的部门，并根据部门名称在调度平台上建立相应的项目。换言之，用户在LDAP中的部门将会被映射到DolphinScheduler上的一个项目空间。

其次，每一个项目都会关联到一个特定的Hive数据源。每个数据源的差异在于它们的队列设置。由于不同的部门任务会因为关联到的数据源而提交到相应的Yarn队列上，这一设定使得各部门的资源使用得以计价和进行有效治理。

通过这种方式，我们确保了调度权限的严谨管控，同时也实现了部门资源的准确计算和高效治理。

## 用户收益

1. 满足了业务人员、分析师、产品BP的数据加工和使用需求：通过基于配置的调度生成模式和自动生成SQL的功能，我们能够满足那些不懂SQL语言的业务人员、分析师和产品BP的数据加工和使用需求。他们可以通过简单的配置来定义数据加工流程，而无需编写复杂的SQL语句。这使得他们能够快速、轻松地完成数据的处理和使用，提高了他们的工作效率。
2. 满足运维人员维护庞杂数据调度的需求：对于运维人员来说，维护庞杂的数据调度任务是一项具有挑战性的任务。然而，通过我们的调度平台，运维人员能够更加方便地管理和维护这些调度任务。平台提供了可视化的操作界面和丰富的功能，如配置回滚、历史版本对比等，使得运维人员能够轻松地进行任务的管理和维护。同时，端到端的可用性监控工具WatchDog也能及时发现系统故障，提高了调度系统的稳定性和可靠性。

通过满足业务人员、分析师、产品BP的数据加工和使用需求，以及运维人员维护庞杂数据调度的需求，我们基于Apache DolphinScheduler 进行升级改造后的调度平台能够为各个角色提供全面的支持，促进业务的顺利进行和高效运维。
