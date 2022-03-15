---
title: How Does 360 DIGITECH process 10,000+ workflow instances per day by Apache DolphinScheduler
keywords: Apache,DolphinScheduler,scheduler,big data,ETL,airflow,hadoop,orchestration,dataops,Meetup,Tujia
description: ince 2020, 360 DIGITECH has fully migrated its scheduling system from Azkaban to Apache DolphinScheduler
---
# How Does 360 DIGITECH process 10,000+ workflow instances per day by Apache DolphinScheduler

<div align=center>

<img src="/img/2022-3-11/Eng/1.jpeg"/>

</div>

Since 2020, 360 DIGITECH has fully migrated its scheduling system from Azkaban to Apache DolphinScheduler. As a senior user of DolphinScheduler, 360 DIGITECH now uses DolphinScheduler to process 10,000+ workflow instances per day. 

To meet the practical needs of big data platform and algorithm model business, 360 DIGITECH has made many modifications on DolphinScheduler such as alarm monitoring expansion,  worker maintenance mode adding, multi-server room renovation, etc. to make it more convenient for operation and maintenance. 

How did they carry out the re-development? Jianmin Liu, a big data engineer at 360 DIGITECH, shared this topic in detail at the Apache DolphinScheduler February Meetup.

<div align=center>

<img style="width: 25%;" src="/img/2022-3-11/Eng/2.png"/>

</div>

Jianmin Liu, a big data engineer from 360 DIGITECH, mainly engaged in the research of ETL task and scheduling framework, and the development of big data platforms and real-time computing platforms.

## Migrate from Azkaban to Apache DolphinScheduler

By 2019, 360 DIGITECH used Azkaban for big data processing.

Azkaban is a batch workflow task scheduler open-sourced by Linkedin. It is easy to install, users can create tasks and upload zip packages for workflow scheduling just by installing the web and executor server.

Azkaban's web-executor architecture is shown as below:

<div align=center>

<img style="width: 40%;" src="/img/2022-3-11/Eng/3.png"/>

</div>

### Disadvantages of Azkaban

Azkaban is suitable for simple scheduling scenarios, and after three years of use, we found three fatal flaws in it.

1. Poor experience

It has no visual task creation feature, and you need to upload a zip package to create and modify tasks, which is not convenient; in addition, Azkaban has no function to manage resource files.

2. Not powerful enough

Azkaban lacks some indispensable features for production environments, such as complement and cross-task dependencies; user and permission control are too weak, and scheduling configuration does not support per month, so we need to make up for it in many other ways in production.

3. Not good enough stability

The most fatal flaw of Azkaban is that it is not stable enough, and tasks are often backlogged when the executor is overloaded; tasks at the hourly or minute level are prone to miss scheduling; there are no timeout alerts, and although we have developed our own limited SMS alerts, we are still prone to production accidents.

We had a retrofit in 2018 to address these shortcomings, but the Azkaban source code was complex and the retrofit was painful, so we decided to re-choose the scheduler. At that time, we tested Airflow, DolphinScheduler, and XXL-job, but the Airflow Python technology stack didn't match ours, and the XXL-job functionality was too simple, so it was clear that DolphinScheduler was the better choice.

In 2019, we Folked the code of EasyScheduler 1.0, migrated parts of it with scheduling tasks in 2020, and went it live until now.

### Selection Research

We chose DolphinScheduler because of its four advantages:

1. Decentralized structure with multiple masters and multiple workers.

2. Scheduling framework is powerful and supports multiple task types with cross-project dependencies and complement capabilities.

3. Good user experience, visual DAG workflows editing, and ease of operation.

4.Java stack with good scalability.

The conversion process was very smooth and we migrated the scheduling system to DolphinScheduler without any problems.

## Use of DolphinScheduler

At 360 DIGITECH, DolphinScheduler is not only used by the Big Data department, but also by the Algorithms department for some of its features. To make it easier for the Algorithms department to use DolphinScheduler's features, we integrated it into our own Yushu Big Data Platform.

### Yushu Big Data Platform

<div align=center>

<img src="/img/2022-3-11/Eng/4.png"/>

</div>

Yushu is a big data platform composed of basic components, Yushu platform, monitoring&operation, and business service layer, which can do a query, data real-time calculation, message queue, real-time data warehouse, data synchronization, data governance, and others. Among them, offline scheduling uses DolphinScheduler to schedule the ETL task of scheduling data sources to Hive data warehouse, as well as supports TiDB real-time monitoring, real-time data reports, and other functions.

### DolphinScheduler Nested to Yushu

To support the company's algorithm modeling needs, we extracted some common nodes and nested a layer of UI with API calls.

The algorithm department mostly uses Python scripts and SQL nodes, timed with box-table logic, then configured with machine learning algorithms for training, and then called the model in Python to generate model scores after assembling data. We wrapped some Kafka nodes to read Hive data and push it to Kafka via Spark.

### Task Type

<div align=center>

<img src="/img/2022-3-11/Eng/5.png"/>

</div>

DolphinScheduler supports Shell, SQL, Python, and Jar task types. Shell supports Sqoop DataX mr synchronization task and Hive-SQL, Spark-SQL; SQL node mainly supports TiDB SQL (handling upstream sub-base and sub-table monitoring) and Hive SQL. Python task types support offline calls to model scripts, etc.; and Jar packages mainly support Spark Jar offline management.

### Task Scenario

<div align=center>

<img src="/img/2022-3-11/Eng/6.png"/>

</div>

The task scenario of DolphinScheduler is mainly about synchronizing various data sources such as MySQL, Hbase, etc. to Hive, and then generating DW directly through ETL workflow, assembling or calling through Python scripts, generating models and rule results, and then pushing them to Kafka, which will offer risk control system quota, approval, and analysis, and feed the results to the business system. This shows a complete workflow example of the DolphinScheduler scheduling process.

### Operations and Maintenance of DolphinScheduler

Currently, DolphinScheduler is processing 10000+ workflows per day.  Considering the fact that many offline reports depend on DolphinScheduler, operation and maintenance is very important.

At 360 DIGITECH, the operation and maintenance of DolphinScheduler are divided into three parts:

* DS Dependent Components Operations and Maintenance

The DolphinScheduler dependent component of DolphinScheduler is mainly for MySQL monitoring and Zookeeper monitoring.

Because workflow definition meta information, workflow instances&task instances, Quartz scheduling, and Commands all rely on MySQL, MySQL monitoring is critical. There was a time when our network in the server room went down causing many workflow instances to miss schedule, and the problems are troubleshoot by the follow-up MySQL monitoring.

The importance of Zookeeper monitoring also goes without saying. The master-worker state and task queue both rely on Zookeeper, fortunately, Zookeeper has been stable and no problems have occurred yet.

* Master and Worker Status Monitoring
As we all know, the Master is responsible for task slicing, which actually does not have a great impact on the business, so we just use emails to monitor it; however, a hung worker will cause task delays and increase the pressure on the cluster. In addition, if Yarn tasks are killed unsuccessfully, task tolerance may lead to repeated Yarn tasks, so we use phone alerts to monitor worker status.

### Grafana Big Board Monitoring Workflow Instance Status

For this, we have created a Grafana monitoring dashboard for Ops, which can monitor the status of workflow instances in real-time, including the number of workflow instances, the running status of workflow instances by project, and timeout warning settings.

## DolphinScheduler Retrofit

### Experience optimization

1. Authorize individuals to resource files and projects, and resource files distinguish between edit and readable to facilitate authorization.

2. Extend global variables (process definition id, task id, etc. included into global variables), allow tasks submitted to yarn to be tracked to the scheduled tasks, facilitate cluster management, lock resources by counting workflow instances to facilitate maintenance.

3. Carry workflow replication, task instance query interface optimization to speed up query speed, and optimize UI.

### Add SMS alert

To make up for the weakness of the original email alert, we added an SMS alert to the UI to save the workflow definition to ensure the key tasks be monitored properly. In addition, we also changed the alert receivers to user names and extended the AlertType to SMS, email, and other alert methods to associate with user information, such as cell phone numbers, to ensure that we can receive alerts in time when important tasks fail.

### Add maintenance mode to Worker 

When a worker machine needs maintenance, it's necessary to ensure no new tasks are submitted to the worker. For this, we have added a maintenance mode to the worker, which consists of four main points.

1. The UI sets the worker into maintenance mode, calling the API to write to the zk path specified by the worker.

2.WorkerServer performs scheduled polling for maintenance mode or not.

3.WorkerServer in maintenance mode, FetchTaskThread not fetching new tasks.

4. The worker task finishes running and can be restarted.

After the above reform, the pressure on our O&M is greatly reduced.

### Multi-server room renovation

Finally, we also performed a multi-server room renovation. Since we had 2 clusters in different server rooms, our goal was to set up multiple server rooms in scheduling, so that when one server room fails, we can switch to others with one click, and use the same scheduling framework in multiple server rooms.

The pointcut for the renovation is to set up multi-server rooms in the scheduling to ensure that a certain task can be started in multiple server rooms. The renovation process went like this:

1. ZK is deployed in each server room, and the Master and Worker are registered to the corresponding server room, the Master is responsible for task slicing, and the Worker is responsible for task processing. 

2. Attach schedule and command with datacenter information.

3. To ensure dual-server room task switching, resource files are uploaded for upper room tasks, while changing task interfaces, task dependencies, and Master fault tolerance all need to be modified to match the corresponding room.
