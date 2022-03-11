---
title: Exploration and practice of Tujia Big Data Platform Based on Apache DolphinScheduler
keywords: Apache,DolphinScheduler,scheduler,big data,ETL,airflow,hadoop,orchestration,dataops,Meetup,Tujia
description: Tujia introduced Apache DolphinScheduler in 2019. At the recent Apache DolphinScheduler Meetup in February
---
# Exploration and practice of Tujia Big Data Platform Based on Apache DolphinScheduler

<div align=center>

<img src="/img/2022-3-9/Eng/1.jpeg"/>

</div>

Tujia introduced Apache DolphinScheduler in 2019. At the recent Apache DolphinScheduler Meetup in February, Tujia Big Data Engineer Xuchao Zan introduced the process of Tujia's access to Apache DolphinScheduler and the functional improvements in detail.

<div align=center>

<img style="width: 25%;" src="/img/2022-3-9/Eng/2.png"/>
</div>

Xuchao Zan, Big Data Engineer, Data Development engineer from Tujia, is mainly responsible for the development, maintenance, and tuning of the big data platform.

**Watch the record here:**[https://www.bilibili.com/video/BV1Ki4y117WV?spm_id_from=333.999.0.0](https://www.bilibili.com/video/BV1Ki4y117WV?spm_id_from=333.999.0.0)

This speech mainly consists of 4 parts. The first part is the current status of Tujia's platform, introducing the process of Tujia's data flow, how Tujia provides data services, and the role of Apache DolphinScheduler in the platform. The second part will introduce the scheduler selection process of Tujia, which mainly refers to some features of the scheduler and the process of access. The third part is mainly about some improvements and functional expansions of the system, including support for function table dependencies, mail tasks expansion, and data synchronization functions. The fourth part details some new functions we have developed to meet our business requirements, such as reforming the Spark jar packages to support the publishing system, connecting the scheduler to data quality, and displaying the Data Lineage.

## Status of Tujia Big Data Platform

### 01 Big Data Platform schema

First, let's introduce the schema of Tujia Big Data Platform and the role of Apache DolphinScheduler in the platform.

<div align=center>

<img src="/img/2022-3-9/Eng/3.png"/>

</div>

The architecture of Tujia Big Data Platform

The picture above shows the architecture of our data platform, which mainly includes **data source, data collection, data storage, data management, and finally service provision.**

**The main source of the data** includes three parts: data synchronization of the business from library MySQL API, involving the Dubbo interface, the http interface, and the embedded point data of the web page.

**Data collection** adopts real-time and offline synchronization, business data is incremental synchronized based on Canal, logs are collected by Flume, and Kafka is collected in real-time and falls on HDFS.

**The data storage process** mainly involves some data synchronization services. After the data falls into HDFS, it is cleaned, processed, and then pushed online to provide services.

**At the data management level**, the data dictionary records the metadata information of the business, the definition of the model, and the mapping relationship between various levels, which is convenient for users to find the data they care about; the log records the operation log of the task, and the alarm configures the fault information, etc. The dispatching system, as a command center of big data, rationally allocates dispatching resources and can better serve the business. Metrics library records the dimensions and attributes, normative definitions of business process metrics for better management and usage of data. Abtest documents the impact of different metrics and strategies on product functionality, and data quality is the basis for the effectiveness and accuracy of data analysis.

The last part is the**data service**, which mainly includes ad hoc data query, report preview, data download and upload analysis, online business data support release, etc.

### 02 The role of Apache DolphinScheduler in the platform

The following focuses on the role of the scheduler in the platform. The data tunnel is synchronized, and incremental data is pulled regularly every morning. After the data is cleaned and processed, it is pushed online to provide services. It also charges the processing of the data model and the interface configuration greatly improves Productivity. The service of the timed report, push email, support the display of attachments, text table, and line chart. The report push function allows the analysts to configure data dashboards, and  DataX pushes the calculated data to MySQL every day for report display after data processing.

## Introduces Apache DolphinScheduler

The second part is about the work we have done by introducing Apache DolphinScheduler.


Apache DolphinScheduler is advanced in many aspects. As a command center of big data, it's undoubtedly reliable. The decentralized design of Apache DolphinScheduler avoids the single point of failure problem, and once a problem occurs with one node, the task will be automatically restarted on other nodes, which greatly improves the system's reliability.

In addition, Apache DolphinScheduler is simple and practical, which reduces learning costs and improves work efficiency. Now many staff in the company are using it, including analysts, product operational staff, and developers.

The scalability of scheduling is also very important because as the amount of tasks increases, the cluster can add resources in time to provide services. A wide range of applications is also a key reason for us to choose Apache DolphinScheduler. It supports a variety of task types: Shell, MR, Spark, SQL (MySQL, PostgreSQL, Hive, SparkSQL), Python, Sub_Process, Procedure, etc. and enables workflow timing scheduling and dependency scheduling, manual scheduling, manual pause/stop/resume, as well as retry/alarm on failure, recovery from specified node failure, killing tasks, etc. It has so many advantages, and I cannot list them one by one, you should try it by yourself.

Next is the upgrade of our time scheduling.

Before adopting Apache DolphinScheduler, our scheduling was quite confusing. Some people deployed their own local Crontab, some used Oozie for scheduling, and some used the system for time schedules. The management is chaotic, the timeliness& accuracy cannot be guaranteed, and tasks cannot be found from time to time due to lacking one unified scheduling platform. In addition, the self-built scheduler is not stable enough due to lacking configuration dependency and data output guarantee, and the product function is limited, which supports limited task scheduling.

<div align=center>

<img src="/img/2022-3-9/Eng/4.png"/>

</div>

In 2019, we introduced Apache DolphinScheduler, and it has been running stably for nearly 3  years.

Below is some data of our system transfer.


We have built an Apache DolphinScheduler cluster with a total of 4 physical machines. Currently, a single machine supports 100 task scheduling concurrently.

Algorithms are also configured with special machines and be isolated.


Most of our tasks are processed by Oozie, which are mainly Spark and Hive tasks. There are also some scripts on Crontab, some mailing tasks, and scheduled tasks of the reporting system.

## The Scheduling System Re-built Based on Apache DolphinScheduler

Before reconstruction, we have optimized the system, such as supporting table-level dependencies, extending the mail function, etc. After introducing Apache DolphinScheduler, we re-built a scheduling system based on it to provide better services.

**Firstly, the synchronization of table dependencies was supported.**At that time, considering the task migration may be parallel, the tasks could not be synchronized all at once and needed to be marked as the table tasks run successfully. Therefore, we developed the function to solve the dependency problem in task migration. However, the different naming style of users makes it difficult to locate the task of the table when configuring dependencies, and we cannot identify which tables are included in the task, and where the task is located in the table, which causes a lot of trouble for us. 

<div align=center>

<img src="/img/2022-3-9/Eng/5.png"/>

</div>

**Secondly, Mail tasks support multiple tables.**Scheduling has its self-installed mail push function, but only supports a single table. With more and more business requirements, we need to configure multiple tables and multiple sheets, and the number of text and attachments required to be displayed differently, which needs to be configured. In addition, it is necessary to support the function of line charts to enrich the text pages. Furthermore, users also want to be able to add notes to the text or below each table to explain indicators, etc. We use the Spark jar package to implement the email push function, which supports abnormal warnings, table dependencies missing, etc.

<div align=center>

<img src="/img/2022-3-9/Eng/6.png"/>

</div>

<div align=center>

<img src="/img/2022-3-9/Eng/7.png"/>

</div>

**Thirdly, it supports rich data source synchronization.** Due to some data transmission issues, we needed to modify configuration codes greatly, compile, package and upload data in the previous migration process, which is complex and error-prone, and data and online data cannot be separated due to data source disunity; in terms of development efficiency, there is a lot of repetition in the code, and the lack of a unified configuration tool and the unreasonable parameter configuration lead to high pressure on MySQL and the risk of downtime; after data transmission, there is no duplicate check, when the amount of data is large, the full amount of updates will cause a lot of pressure on MySQL. MySQL's transmission has a single point of failure problem, and task delay affects online services.

<div align=center>

<img src="/img/2022-3-9/Eng/8.png"/>

</div>

<div align=center>

<img src="/img/2022-3-9/Eng/9.png"/>

</div>

We simplified the data development process, made MySQL support the high availability of pxc/mha, and improved the efficiency of data synchronization.


The input data sources support relational databases and FTP synchronization. As the computing engine, the output data sources of Spark support various relational databases, as well as message middleware Kafka, MQ, and Redis.

Next, let's get through the process of our implementation.


We have extended the data source of Apache DolphinScheduler to support the expansion of Kafka mq and namespace. Before MySQL synchronization, we first calculate an increment locally and synchronize the incremental data to MySQL. Spark also supports the HA of MySQL pxc/qmha. In addition, there is a qps limit when pushing MQ and Redis, we control the number of partitions and concurrency of Spark by the amount of data.

## Improvements

The fourth part is mainly about the added functions to the system, including:

1. Spark supports publishing system
2. Data quality open up
3. Display of Data lineage
### 01 Spark task supports publishing system

More than 80% of our usual schedules are Spark jar package tasks, but the task release process and the code modification are not normalized. This leads to code inconsistencies from time to time, and even causes online problems in severe cases.

This requires us to refine the release process for tasks. We mainly use the publishing system, the Jenkens packaging function, compile and package to generate btag, and then publish and generate rtag after the test is completed, and the code is merged into master. This avoids the problem of code inconsistency and reduces the steps for jar package upload. After compiling and generating the jar package, the system will automatically push the jar package to the resource center of Apache DolphinScheduler. Users only need to configure the parameters and select the jar package for test release. When running a Spark task, it is no longer necessary to pull the file to the local, but directly read the jar package on HDFS.

### 02 Data quality connection

Data quality is the basis for ensuring the validity and accuracy of analytical conclusions. We need a complete data monitoring output process to make the data more convincing. The quality platform ensures data accuracy, integrity, consistency, and timeliness from four aspects, and supports multiple alarm methods such as telephone, WeCom, and email to inform users.


Next, we will introduce how to connect the data quality and scheduling system. After the scheduling task is completed, the message record is sent, the data quality platform receives the message, and triggers the rule of the data quality monitoring. Abide by the monitoring rule, the downstream operation is blocked or an alarm message is sent.

### 03 Data linage display

Data lineage is key to metadata management, data governance, and data quality. It can track the source, processing, and provenance of data, provide a basis for data value assessment, and describe the flow of source data among processes, tables, reports, and ad hoc queries, the dependencies between tables, tables & offline ETL tasks, as well as scheduling platforms & computing engines. The data warehouse is built on Hive, and the raw data of Hive often comes from the production DB, and the calculation results are also exported to external storage. Therefore, the tables of heterogeneous data sources are related.


* **Data trace:** When data is abnormal, it helps to trace the cause of the abnormality; impact analysis, tracing the source of the data and data processing process.
* **Data e****valuat****ion**: Provide a basis for evaluating data value in terms of data target, update importance, and update frequency.
* **Life cycle:**  Intuitively obtain the entire life cycle of data, providing a basis for data governance.
The collection process of data linage is mainly about: Spark monitors the SQL and inserted tables by monitoring the Spark API, obtains and parses the Spark execution plan.

