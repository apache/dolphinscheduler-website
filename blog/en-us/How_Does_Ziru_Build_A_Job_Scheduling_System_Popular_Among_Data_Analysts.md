---
title:How Does Ziru Build A Job Scheduling System Popular Among Data Analysts?
keywords: Apache,DolphinScheduler,scheduler,big data,ETL,airflow,hadoop,orchestration,dataops,Meetup
description: As one of the creators of enterprise data assets
---
# **How Does Ziru Build A Job Scheduling System Popular Among Data Analysts?**

<div align=center>

<img src="/img/2022-4-6/en/1.png"/>

</div>

>*As one of the creators of enterprise data assets, data analysts need to command certain professional skills such as dimension&metrics management, pedigree analysis, and ETL scheduling platform operations. However, for data analysts with varying levels of programming skills, a scheduling platform that is easy to operate and use will give them wings rather than adding additional learning costs.*
>*Compared with most companies, Ziru differs from others in that a large amount of data warehouse processing on its big data platform is not done by professional warehouse engineers, but by data analysts. The reason why the data analysts of Ziru can do the complex data processing and analysis work that can only be done by professional teams is that their scheduling system is migrated to Apache DolphinScheduler.*
>*At the Apache DolphinScheduler & Apache ShenYu(Incubating) Meetup, Liu Tao, the R&D Manager of Ziru Big Data Platform, shared with us what a popular scheduling system for data analysts looks like.*
## **Author Bio**

<div align=center>

<img src="/img/2022-4-6/en/2.png"/>

</div>

Liu Tao, the R&D manager of Ziru Big Data Platform, is responsible for building the basic platform of Ziru Big Data and constructing a one-stop Big Data development platform.

## **1 Status of Ziru Big Data Platform**

Ziru Big Data Platform consists of Data Sources, Data Access, Data Process, Data Sink , and Data Application layers. The data sources include MySQL, Oracle, and other business library data, as well as various log data, which are collected through Hive offline T plus 1method, In addition to the use of Hive acid plus Flink to achieve a 10-minute level business library data updates.

Data processing is the part that analysts care about, in which you can configure scheduling, dependencies, and SQL development. As for the data sink, we use ClickHouse’s OLAP engine, and the data application layer uses NetEase Youshu to provide the reporting platform.

Ziru’s big data platform is almost the same as most platforms in the industry, But what is unique is that in addition to professional data warehouse development engineers, a large number of data analysts are also involved in the processing of data warehouses. This requires the big data platform to be simplified enough.

## **2 Analysts’ expectations for a job scheduling system**

Due to the varying levels of coding among data analysts, some analysts can write SQL, while others cannot write SQL at all. Even analysts who can write SQL find it difficult to understand **task-dependent concepts**.

As a result, the analysts’ expectations for a scheduler are to be simple and have a low cost of use.

## **3 How Airflow is implemented**

<div align=center>

<img src="/img/2022-4-6/en/3.png"/>

</div>

Hivepartitionsensor in Airflow

<div align=center>

<img src="/img/2022-4-6/en/4.png"/>

</div>

In the beginning, Ziyu used the Airflow solution, which offers a visualization plug-in Airflow DAG createmanager plug-in for analysts to use. We use hivepartitionsensor at the underlying level, with data dependency configuration scheduling. This set of solutions is a fair experience for analysts but faces several major problems.

1. The underlying implementation of data dependencies leads to very complex task re-runs;

2. Poor scheduling performance for multi-tasks, with some tasks having a higher calling delay;

3. The cost for integration with the one-stop big data platform re-development is relatively high;

4. Multi-tenancy is not natively supported.

## **4 Apache DolphinScheduler Transformation and Airflow Task Migration**

These challenges above prompted us to make a new scheduling selection. After a comparative analysis, we chose Apache DolphinScheduler.

Data dependency is a well-understood concept for analysts, but task dependency is more puzzling.

A more ideal solution would be to show data dependencies to the analyst, with the underlying implementation being task dependencies, and this data dependency can be produced automatically, without a manual dependency table entered by the analysts.

To achieve this goal, we need to solve a problem first, **how to determine the input and output table of this SQL based on a piece of SQL?**

<div align=center>

<img src="/img/2022-4-6/en/5.png"/>

</div>

Since it is in the Hive environment, we need to look at the parsing process of Hive SQL.

As shown above, hive uses antlr for syntactic and semantic parsing to generate an abstract syntax tree. For example, a SQL statement is as follows:

<div align=center>

<img src="/img/2022-4-6/en/6.png"/>

</div>

Parsed it into a syntax tree:

<div align=center>

<img src="/img/2022-4-6/en/7.png"/>

</div>

Traversing this abstract syntax tree gives us the exact input and output, and we found that we don’t need to do it from scratch, which can be simply implemented in Hive 147.

[https://issues.apache.org/jira/browse/HIVE-147](https://issues.apache.org/jira/browse/HIVE-147)

<div align=center>

<img src="/img/2022-4-6/en/8.png"/>

</div>

Once we have parsed the input and output, we can associate the input and output tables with the corresponding Apache DolphinScheduler scheduling tasks, thus achieving the goal of showing the analysts a data dependency while the underlying implementation is a task dependency. Though this implementation will produce small tasks, most of which end up with only one table output, leading to a large number of scheduling tasks. But so far, it does not pose performance problems, and we can see it as a compromise solution.

<div align=center>

<img src="/img/2022-4-6/en/7.png"/>

</div>

This is followed by the challenge of smoothly migrating tasks from Airflow to Apache DolphinScheduler. The tasks in airflow are all Python files, and the scheduler of airflow keeps scanning the file directory where the Python files are located to generate the scheduling tasks. The core implementation class is DagFileProcessorManager above, we can refer to the implementation of this class to parse the Python tasks and generate the JSON strings needed for the Apache DolphinScheduler task definition, to complete the migration of scheduling tasks.

That’s all I have to share, thank you!

# Join the Community

There are many ways to participate and contribute to the DolphinScheduler community, including:

**Documents, translation, Q&A, tests, codes, articles, keynote speeches, etc.**

We assume the first PR (document, code) to contribute to be simple and should be used to familiarize yourself with the submission process and community collaboration style.

So the community has compiled the following list of issues suitable for novices: [https://github.com/apache/dolphinscheduler/issues/5689](https://github.com/apache/dolphinscheduler/issues/5689)

List of non-newbie issues: [https://github.com/apache/dolphinscheduler/issues?q=is%3Aopen+is%3Aissue+label%3A%22volunteer+wanted%22](https://github.com/apache/dolphinscheduler/issues?q=is%3Aopen+is%3Aissue+label%3A%22volunteer+wanted%22)

How to participate in the contribution: https://dolphinscheduler.apache.org/en-us/docs/dev/user_doc/contribute/join/review.html

**GitHub Code Repository:** [https://github.com/apache/dolphinscheduler](https://github.com/apache/dolphinscheduler)

**Official Website**：[https://dolphinscheduler.apache.org/](https://dolphinscheduler.apache.org/)

**MailList**：dev@dolphinscheduler@apache.org

**Twitter**：@DolphinSchedule

**YouTube：**[https://www.youtube.com/channel/UCmrPmeE7dVqo8DYhSLHa0vA](https://www.youtube.com/channel/UCmrPmeE7dVqo8DYhSLHa0vA)

**Slack：**[https://s.apache.org/dolphinscheduler-slack](https://s.apache.org/dolphinscheduler-slack)

**Contributor Guide：**[https://dolphinscheduler.apache.org/en-us/community/community.html](https://dolphinscheduler.apache.org/en-us/community/community.html)

Your Star for the project is important, don’t hesitate to lighten a Star for Apache DolphinScheduler ❤️










