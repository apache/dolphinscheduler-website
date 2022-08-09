---
title:How Does Live-broadcasting Platform Adapt to Apache DolphinScheduler?
keywords: Apache,DolphinScheduler,scheduler,big data,ETL,airflow,hadoop,orchestration,dataops,Meetup
description: Background on the introduction of Apache DolphinScheduler to YY Live
---
# How Does Live-broadcasting Platform Adapt to Apache DolphinScheduler?

<div align=center>

<img src="/img/2022-4-11/en/1.png"/>

</div>

>*At the Apache DolphinScheduler Meetup（3.26）, Yuan Bingze, a software engineer at YY Live, shared the topic of* *YY Live’s Adaptation and Exploration based on Apache DolphinScheduler* *with us.*
>*This presentation consists of four main sections:*
>*1.**Background on the introduction of Apache DolphinScheduler to YY Live*
>*2.**The introduction process of Apache DolphinScheduler*
>*3.**Application and adaptation of Apache DolphinScheduler*
>*4.**YY Live’s future plans*
## Profile.

<div align=center>

<img src="/img/2022-4-11/en/2.png"/>

</div>

Yuan Bingze, YY Live Software Engineer, has more than 10 years of working experience in big data risk control platform development. Deeply interested in common big data components.

## Background

YY Live is the leading voice social platform company in China. Currently, our team is mainly responsible for securing the company’s business.

### 01 Technical Status

We currently use a layered technical architecture, with the bottom layer being the data source layer, followed by the collection layer, storage layer, management layer, computation, and application layers in descending order.

In the data source layer, we currently pull relational database data from various business parties, as well as data that is transmitted to us through APIs and streams like Kafka.

The collection layer uses a data collection system developed by ourselves.

In the storage layer, we currently put the data mainly in relational databases, such as Clickhouse, and a small portion will be in some non-relational databases, such as Redis and graph libraries. Of course, most of the data is stored in big data systems.

The management team mainly consisted of a big data management system, combined with a computational scheduling and task management system and service governance platform developed by ourselves.

### 02 Problems we encountered before adopting Apache DolphinScheduler

1、Scheduling platform is too complex: In addition to the team’s Xxl-job based task scheduling, some of the older projects have used Crontab, Springboot, Scheduler, Quartz, etc. to manage the start of tasks.

2、Strong demand for task dependencies: The scheduling we currently use can only set up the execution of individual tasks, and cannot form workflows through task dependencies, which rely heavily on personal experience to set up timing. Many tasks need to have dependencies.

3、The tasks are complex and diverse: the current tasks are Spark and Flink tasks based on big data systems, various Java services, Shell, Java applications, Python, etc. tasks in the service governance platform.

## Introducing Apache DolphinScheduler

During the research, we found a demanding scheduling platform should meet the following conditions.

**1、Unified management of tasks and dependencies**

With the increasing demand for business computing, especially a variety of graph computing and tasks, which are scattered among various systems, and very difficult to manage. Besides, some of the tasks have certain dependencies on each other, but the configuration of their time relies on personal experience. There is an urgent need for a product that can unify configuration management dependencies.

**2、Compatible with the company’s internal platform system**

The scheduling task platform is aimed to manage our tasks and to come into service quickly, the scheduling platform needed to be compatible with our company’s inner platform systems, such as the internal Datax and Crontab services.

**3、High availability, high performance, high concurrency, and easy to use**

Finally, to ensure business stability, we also need this scheduling platform to be highly available, high performance, concurrent, and easy to use.

Through our research, we found that Apache DolphinScheduler was perfectly designed for us, and the adaptation process met our needs without much modification.

## Application and Adaptation

Apache DolphinScheduler is a distributed, decentralized, easily scalable visual DAG workflow task scheduling system dedicated to solving the intricate dependencies in the data processing process and making it work out-of-the-box in the data processing, which fits our needs perfectly.

First, let’s look at the architecture of Apache DolphinScheduler to facilitate understanding the next adaptation cases.

<div align=center>

<img src="/img/2022-4-11/en/3.png"/>

</div>

Apache DolphinScheduler has 5 main modules: API, master, worker, log, and alert.

The API interface layer is mainly responsible for handling requests from the front-end UI layer. The service provides RESTful API to provide request services to the outside in a unified manner. The interfaces include workflow creation, definition, query, modification, release, downlink, manual start, stop, pause, resume, start execution from that node, etc.

The MasterServer adopts the concept of distributed centerless design, and is mainly responsible for DAG task slicing, task submission monitoring, and listening to the health status of other MasterServer and WorkerServer at the same time. The MasterServer service registers temporary nodes with Zookeeper when it starts and performs fault tolerance by listening to the changes of Zookeeper temporary nodes.

WorkerServer also adopts the distributed centerless design concept, which is mainly responsible for task execution and providing logging services.

WorkerServer service registers temporary nodes with Zookeeper when it starts and maintains heartbeat, as well as provides logger service.

Alert provides alarm-related interfaces, which mainly include two types of alarm data storage, query and notification functions. The notification function includes email notification and **SNMP (not yet implemented)**.

Currently, we are deploying version 2.0 on 4 physical machines, which have born 2 master instances, 2 API instances, 3 worker and logger instances, and one alert instance.

Next, we share 3 specific cases of adaptation based on Apache DolphinScheduler.

First is the adaptation to our service governance platform, which aims to do task monitoring; although Apache DolphinScheduler itself provides a task monitoring module, our colleagues have long been accustomed to using the service governance platform to unify management monitoring. So we need to report the status of Apache DolphinScheduler tasks to the service governance platform in time.

### 01 Service Governance platform Adaptation — MasterServer Service Description

Before the adaption description, we take a detailed look at the MasterServer service first, which provides:

1、Distributed Quartz, a distributed scheduling component, is mainly responsible for timing task start and stop operations, when Quartz picks up the task, there will be thread pools inside the Master specifically handling the subsequent operations of the task.

2、MasterSchedulerThread is a scanning thread that scans the command table in the database at regular intervals and performs different business operations according to different command types.

3、MasterExecThread (WorkflowExecutThread.java) takes charge of DAG task slicing, task submission monitoring, and logical processing of various command types.

4、MasterTaskExecThread is mainly responsible for task persistence.

### 02 Service Governance Adaptation-code

We require to monitor tasks. Through code analysis, we found that task submission and listening are mainly implemented in the methods of the WorkflowExecuteThread class, which starts multiple instance threads responsible for task execution and listening respectively. The flowchart is as follows:

<div align=center>

<img src="/img/2022-4-11/en/4.png"/>

</div>

Task submission and monitoring flow chart

We aim to monitor tasks, and after analyzing the code, we found that WorkflowExecuteThread implements task execution and listening by startprocess and handle events respectively. We inject our service governance platform data collection code in the handleEvents method so that the task monitoring situation can be reported to our service governance platform in time.

The modified part is as follows:

<div align=center>

<img src="/img/2022-4-11/en/5.png"/>

</div>

The specific effect of the service governance platform is shown below:

**Task submission**

<div align=center>

<img src="/img/2022-4-11/en/6.png"/>

</div>

**Success rate**

<div align=center>

<img src="/img/2022-4-11/en/7.png"/>

</div>

In addition to monitoring the status of our specific tasks, we will also do some monitoring by project, and finally, we will monitor operation through the service governance platform, for example, if some tasks are important, we will configure some telephone alarms, that is, if the task fails or is not executed on time, we will make telephone notifications.

### 03 Datax Service Adaptation Process

The second case is about the adaptation of the Datax service. When we were working on Apache DolphinScheduler, we found that it has integrated Datax type tasks, which is very friendly for us. Because we have a significant number of tasks that are implemented through Datax, we have developed some Datax plugins to adapt the data read and write to various internal systems and stores.

Datax adaptation is divided into two parts, one method is achieved by a custom template, which copies some previous Datax services, and takes slight modification, mainly involving some data interaction between the NoSQL databases.

For the interaction between SQL databases, we still need to achieve it through the configuration.

Unfortunately, we encountered a small bug when configuring Clickhouse read and write tasks at the beginning.

### 04 Datax Service Adaptation — Clickhouse Compatible #8092

When we used Datax to read data from Clickhouse data source, we found that in the SQL, the submission would fail once we refer to parameters, no matter time parameters or other parameters. We suspected that there might be some bugs, and when we read the error log, we also found that when Apache DolphinScheduler submitted the SQL, the parameters are not replaced, and directly submitted to Clickhouse for execution. Because Clickhouse did not recognize Apache DolphinScheduler parameters, it directly threw an exception. We combed through the process of Apache DolphinScheduler reading Clickhouse when executing a Datax task. One of the processes in converting our Apache DolphinScheduler configuration to a Datax configuration is as follows:

<div align=center>

<img src="/img/2022-4-11/en/8.png"/>

</div>

<div align=center>

<img src="/img/2022-4-11/en/9.png"/>

</div>

The first thing the system has to do is to parse all the syntax of SQL and then get some column information through the syntax, at which point it has to call the SQL parser. In this process, if the Apache DolphinScheduler does not replace our parameters, errors will occur during the execution of the circle, which will cause the whole task to fail.

Therefore, in the process of solving, since the parser of Clickhouse may not be obtained, the best way is to directly add a parser. First, we build a JSON file, then format all the chains parsed out, and finally go through a parsing of the syntax, calling it layer by layer, and finally being able to call the target parser.

### 05 Time parameter adaptation

The last case is about time parameter adaptation.

While Apache DolphinScheduler does provide time parameters, most of our data require unixtime that is accurate to the millisecond level. Reading through the Apache DolphinScheduler documentation, we, unfortunately, found that it does not provide an implementation of this type of time parameter. While going through the source code later, we found that Apache DolphinScheduler provides a timestamp function that can provide unixtime values.

When using timestamp, we found two small problems, firstly, there will be ambiguity when timestamp directly expresses unixtime, and secondly, timestamp is only accurate to the second level, while most of our data needs millisecond level. To make it easier to use, we made some changes.

<div align=center>

<img src="/img/2022-4-11/en/10.png"/>

</div>

**Adaptation process**

The first thing we did was to remove the ambiguity. In Apache DolphinScheduler, Timestamp is the way to express time, which is usually expressed by date plus time, but Unix time uses GMT, from 00:00:00:00 on January 1, 1970, to the present, and does not take into account the microsecond time expression, which uses integers.

Once requirements are clear, the next step for us is to figure out how to implement them. We found by code analysis that the implementation of the time parameter function is through the API calling layer by layer, and the final main functions are achieved through the TimePlaceHolderUtils class calculateTime method. During the implementation of this method, the constants in the TaskConstants class that express the name of the time function are also called. So we modified some of the constants of the TaskConstants class. And because we need millisecond-level functions, we added a milli_unixtime function, and finally, to meet the needs of device users, we added some functions with higher precision, such as microsecond and nanosecond functions.

<div align=center>

<img src="/img/2022-4-11/en/11.png"/>

</div>

time parameter adaptation-calling procedure

<div align=center>

<img src="/img/2022-4-11/en/12.png"/>

</div>

<div align=center>

<img src="/img/2022-4-11/en/13.png"/>

</div>

<div align=center>

<img src="/img/2022-4-11/en/14.png"/>

</div>

After using Apache DolphinScheduler, we only need to check the complementary function when manually executing tasks and fill in the date we want to schedule, then we can directly make the complementary, and we can also fill in the parallelism. This feature is very useful for us, and after Apache DolphinScheduler version 2.0, the problem of time configuration and execution with daily performance difference is also solved, which brings great convenience in use.

## Future Planning

In application, we found that the tasks configured through Apache DolphinScheduler do not currently support a highly available solution in terms of using data sources, which is strongly needed in our case, so we are currently doing the adaptation for high availability as well.

Secondly, we are currently using Apache DolphinScheduler version 2.0, the community is active and the version upgrade is fast, even a small version upgrade will bring some great features or design changes. For example, in the new version, the alert function has been plugged in, and some complementary date conversion problems have been solved. This also drove our team to upgrade to the new version to experience the new features. Although Apache DolphinScheduler is currently only used internally in our team, we are thinking about the feasibility of making it available to the entire company.

Although Apache DolphinScheduler is very perfect to solve most of our problems and improve our work efficiency drastically, we still encounter some small bugs in various complex situations, and of course, we have developed some features in use, all of which we will submit to the official after fixing in the future.

## Join the Community

There are many ways to participate and contribute to the DolphinScheduler community, including:

**Documents, translation, Q&A, tests, codes, articles, keynote speeches, etc.**

We assume the first PR (document, code) to contribute to be simple and should be used to familiarize yourself with the submission process and community collaboration style.

So the community has compiled the following list of issues suitable for novices: [https://github.com/apache/dolphinscheduler/issues/5689](https://github.com/apache/dolphinscheduler/issues/5689)

List of non-newbie issues: [https://github.com/apache/dolphinscheduler/issues?q=is%3Aopen+is%3Aissue+label%3A%22volunteer+wanted%22](https://github.com/apache/dolphinscheduler/issues?q=is%3Aopen+is%3Aissue+label%3A%22volunteer+wanted%22)

How to participate in the contribution:  https://dolphinscheduler.apache.org/en-us/docs/dev/user_doc/contribute/join/review.html

**GitHub Code Repository:** [https://github.com/apache/dolphinscheduler](https://github.com/apache/dolphinscheduler)

**Official Website**：[https://dolphinscheduler.apache.org/](https://dolphinscheduler.apache.org/)

**MailList**：dev@dolphinscheduler@apache.org

**Twitter**：@DolphinSchedule

**YouTube：**[https://www.youtube.com/channel/UCmrPmeE7dVqo8DYhSLHa0vA](https://www.youtube.com/channel/UCmrPmeE7dVqo8DYhSLHa0vA)

**Slack：**[https://s.apache.org/dolphinscheduler-slack](https://s.apache.org/dolphinscheduler-slack)

**Contributor Guide：**[https://dolphinscheduler.apache.org/en-us/community/community.html](https://dolphinscheduler.apache.org/en-us/community/community.html)

Your Star for the project is important, don’t hesitate to lighten a Star for Apache DolphinScheduler ❤️



