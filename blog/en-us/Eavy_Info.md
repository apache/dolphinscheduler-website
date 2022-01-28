---
title:  Eavy Info Builds Data Asset Management Platform Services Based on Apache DolphinScheduler to Construct Government Information Ecology
keywords: Apache,DolphinScheduler,scheduler,big data,ETL,airflow,hadoop，orchestration, dataops,2.0.1
description: Based on the Apache DolphinScheduler, the cloud computing and big data provider Eavy Info
---
# Eavy Info Builds Data Asset Management Platform Services Based on Apache DolphinScheduler to Construct Government Information Ecology | Use Case

<div align=center>
<img src="https://s1.imgpp.com/2021/12/29/1640759432737.png"/>
</div>

Based on the Apache DolphinScheduler, the cloud computing and big data provider Eavy Info has been serving the business operations in the company for more than a year.

Combining with the government affairs informatization ecological construction business, Shandong Eavy Info built the data service module of its self-develop Asset Data Management and Control Platform based on Apache DolphinScheduler. How do they use Apache DolphinScheduler? Sun Hao, the R&D engineer of Evay Information, shared their experiences on their business practice.

## R&D Background

The prime operating of Eavy Info is focusing on ToG business, and data collection & sharing take a large proportion of their work. However, Traditional ETL tools, such as kettle, are not simple and easy enough to get started and employed for on-site project operation and maintenance by the front-line implementers. Therefore, creating a set of data acquisition (synchronization)-data processing-data management platform is particularly important.

Out of this consideration, we have developed a Data Asset Management Platform, of which the core is a data service module based on Apache DolphinSchduler (referred to as DS below).

Apache DolphinScheduler is a distributed, decentralized, easy-to-expand visual DAG scheduling system that supports multiple types of tasks including Shell, Python, Spark, Flink, etc., and has good scalability. Its overall structure is shown in the figure below:

<div align=center>
<img src="https://s1.imgpp.com/2021/12/28/1.png"/>
</div>

This is a typical master-slave architecture with strong horizontal scalability. The scheduling engine Quartz is a Java open source project of Spring Boot, it is easier to integrate and use for those familiar with Spring Boot development.

As a scheduling system, DS supports the following functions:

**Scheduling mode: ** The system supports timing scheduling and manual scheduling based on cron expressions. And it supports command types like workflow starting, execution starting from the current node, the fault-tolerant workflow resume, the paused process resume, execution starting from the failed node, complement, timing, rerun, pause, stop, and resume joinable threads. Among them, restoring the fault-tolerant workflow and restoring the joinable threads are two command types that are controlled internally by the scheduling and cannot be called externally.

**Timing schedule:** The system uses quartz distributed scheduler and supports the visual generation of cron expressions.

**Dependency: ** The system not only supports the dependency between the simple predecessor and successor nodes of the DAG but also provides task-dependent nodes to support custom task dependencies between processes.

**Priority:** Support the priority of the process instance and task instance. If the priority of the process instance and task instance is not set, the default is first-in-first-out.

**Email alert: ** Support SQL task query result email sending, process instance running result email alert, and fault tolerance alert notification.

**Failure strategy:** For tasks that run in parallel, if there are tasks that fail, two failure strategy processing methods are provided. **Continue** refers to regardless of the status of the parallel running tasks until the end of the process failure. **End** means that once a failed task is found, the running parallel task will be killed at the same time, and the failed process will end.

**Complement:** Complement historical data, support interval parallel, and serial complement methods.

Based on Apache DolphinScheduler, we carry out the following practices.

## Building A Data Synchronization Tool Based on DS

In our business scenario, there are many types of business needs for data synchronization, but the amount of data is not particularly large and is real-time-undemanding. So at the beginning of the architecture selection, we chose the combination of Datax+Apache DolphinScheduler and implemented the transformation of the corresponding business. Now it is integrated into various projects as a service product to provide offline synchronization services.

<div align=center>
<img src="https://s1.imgpp.com/2021/12/29/1-1.png"/>
</div>

Synchronization tasks are divided into periodic tasks and one-time tasks. After the configuration tasks of the input and output sources, the corn expression needs to be configured for periodic tasks, and then the save interface is called to send the synchronization tasks to the DS scheduling platform.

<div align=center>
<img src="https://s1.imgpp.com/2021/12/29/2-1.png"/>
</div>

Synchronization tasks are divided into **periodic tasks** and **one-time tasks**. After the configuration tasks of the input and output sources are configured, the corn expression needs to be configured for periodic tasks, and then the **save interface** is called to send the synchronization tasks to the DS scheduling platform.

We gave up the previous UI front-end of DS after comprehensive consideration and reused the DS back-end interfaces to carry the online procedure, start and stopping, deleting, and log viewing.

The design of the entire synchronization module is aimed to reuse the diversity of input and output plugins of the Datax component and integrate with the optimization of DS to achieve an offline synchronization task. This is a component diagram of our current synchronization. 


<div align=center>

<img src="https://s1.imgpp.com/2021/12/30/ffd0c839647bcce4c208ee0cf5b7622b.png"/>
</div>

## Self Development Practices Based on DS

Anyone familiar with Datax knows that it is essentially an ETL tool, which provides a transformer module that supports Groovy syntax, and at the same time further enrich the tool classes used in the transformer in the Datax source code, such as replacing, regular matching, screening, desensitization, statistics, and other functions. That shows its property of Transform. Since the tasks are implemented with DAG diagrams in Apache DolphinScheduler, we wonder that is it possible to abstract each Datax or SQL into a small data governance module for a table or several tables? Each module is designed based on the DAG diagram, and the data can be transferred between upstream and downstream and is can be implemented by drag-and-drop like DS. Therefore, we self-developed a module based on the previous work on Datax and DS.

<div align=center>
<img src="https://s1.imgpp.com/2021/12/30/ffd0c839647bcce4c208ee0cf5b7622b.png"/>
</div>

Each component is regarded as a module, and the dependency between the functions of each module is dealt with the dependency of DS. The corresponding component and the component transfer data are stored at the front-end, which means the front-end performs the transfer and logical judgments between most of the components after introducing input (input component) , since each component can be seen as an output/output of Datax. Once all parameters are set, the final output is determined. That is also the reason why we abandoned the UI front end of DS. After that, we assemble this DAG diagram into the defined type of DS and deliver it to the DS task center.

PS: Because our business scenarios may involve cross-database queries (MySQL combined query of different instances), our SQL component uses Presto to implement a unified SQL layer, so that you can also use Presto to do combined retrieval even when data sources are under various IP instances (business-related).

## Other Attempts

People dabble in the governance process know that a simple governance process can lead to a quality report. We write part of the government records into ES, and then use the aggregation capabilities of ES to obtain a quality report.

<div align=center>
<img src="https://s1.imgpp.com/2021/12/29/4da40632c21dbea51d2951d98ee18f1b.png"/>
</div>

The above are some practices that we have made based on DS and middlewares like Datax, combining with businesses to meet our own needs.

From EasyScheduler to the current Apache DolphinScheduler 2.0, we are more often a spectator or follower, but today we shared our practical experience to build data service modules of Data Asset Management and Control Platform based on Apache DolphinScheduler. Currently, we have served the on-site operation of multiple project departments of the company based on the Apache DolphinScheduler scheduling platform for more than a year. With the release of Apache DolphinScheduler 2.0, we have also grown up with it in an evolving community environment. We hope Apache DolphinScheduler will be better in the future! 