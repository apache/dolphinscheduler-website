---
title:Three scenarios and five optimizations of Apache DolphinScheduler in XWBank for processing of task instances
keywords: Apache,DolphinScheduler,scheduler,big data,ETL,airflow,hadoop,orchestration,dataops,Meetup
description: At XWBank, a large number of task instances are generated every day
---
# Three scenarios and five optimizations of Apache DolphinScheduler in XWBank for processing of task instances

<div align=center>
<img src="/img/2022-05-25/en/1.jpg"/>
</div>

At XWBank, a large number of task instances are generated every day, with real-time tasks making up the majority. To better handle the task instances, XWBank chose Apache DolphinScheduler to solve this challenge after a comprehensive consideration. Today, several XWBank projects have applied real-time and quasi-real-time batch processing and offline batch processing for metrics management systems in three types of scenarios, i.e. offline data development and task scheduling, quasi-real-time data development and task scheduling, and other non-ETL user-defined data batch processing.

How did XWBank adapt the Apache DolphinScheduler to better suit its business needs? At the Apache DolphinScheduler Meetup in April, Chen Wei, Senior Big Data Engineer from the Big Data Center of XWBank, presented their practical Application of Apache DolphinScheduler in the company.

The sharing was divided into four sessions.

- 1. Background of the introduction of Apache DolphinScheduler in XWBank
- 2. Application scenarios of Apache DolphinScheduler
- 3. Optimization and transformation of XWBank
- 4. The follow-up plan for XWBank to use Apache DolphinScheduler

<div align=center>
<img src="/img/2022-05-25/en/2.png"/>
</div>

Chen Wei

Senior Big Data Engineer, Big Data Center of XWBank

He has 11 years of working experience, earlier engaged in data warehouse construction, then focus on the construction of big data infrastructure platforms, scheduling system, etc. He has experience in the traditional financial industry, internet data warehouse, data mart construction, and many years of experience in scheduling system construction, such as MIGU analysis cloud scheduling system design, and report platform design, now mainly responsible for the construction of DataOps system of XWBank (offline development, indicator system, tagging system).

## 01 Background
We chose Apache DolphinScheduler based on three main requirements: unification of R&D scenarios, optimization of testing scenarios, and optimization of production deployment scenarios.

### 01 R&D scenarios
In the past, we did not have a unified development tool in the data development process, so we needed to switch back and forth between multiple tools, resulting in excessive development costs.

On the other hand, we were unable to replace parameters during development, could not perform on-the-fly debugging, and had no off-the-shelf tools to support offline tasks in both development and production states.

### 02 Test scenarios
During the deployment of test scenarios, when our developers provide scripts to the tests, the documentation returned is rather unfriendly. Especially when multiple scenarios are deployed across multiple versions, the testers’ tasks increase dramatically and the visual deployment is relatively weak, making it impossible to automate tests in a more friendly way.

### 03 Deployment
Complex configuration and poor visualization of the current scheduling system.
The development and production environment networks are physically isolated, so the process of deploying code from the development environment to the production environment is long and error-prone. The test environment does not fully reflect the configuration of the production environment, and manual configuration files are prone to errors and omissions.
Insufficient operation and maintenance monitoring capabilities, poor visualization, inability to view logs online, and complex process of logging into the physical machine to access the monitoring room for troubleshooting.

## 02 Usage scenarios
We use Apache DolphinScheduler in the following scenarios: offline data development and task scheduling, quasi real-time data development and task scheduling, and other non-ETL user-defined data batch processing.

### 01 Offline Data Development and Task Scheduling

In offline data development and task scheduling.
we mainly use it for our banking data warehouse, data mart, etc. The data includes some offline data, offline processed data by day and month, etc.

### 02 Quasi-real-time data development and task scheduling

The quasi-real-time data in XWBank is fused and calculated by Flink from the logs of the upstream message queue database, completing the relevant dimensional information and then pushing the data to Clickhouse for processing. However, there are special requirements for batch calculations on a minute-by-minute basis, as opposed to daily batch scheduling.

### 03 Other non-ETL user-defined data batch processing

This application is functionally deployed through some internal low-code platform where we open up the application to a servicer who can self-analyze the use data without the need for developers’ help. After defining, they can run this part of the data in batches on their own.

### 1. Offline data mining and task scheduling
We use Apache DolphinScheduler in the offline data mining and task scheduling scenario, which mainly involves five sections: task development modulation, historical task integration, workflow and task separation, project environment variables, and data source finding.

1.Task development modulation (SQL, SHELL, PYTHON, XSQL, etc.), online development modulation (under view logs, online log . online SQL query return results view). WEBIDE can automatically replace pop-up variables, and dynamically replace variables according to the user’s settings and default processing.

2.Historical tasks integration 

Most of the warehouses in the banking industry have been established for four or five years and have a lot of historical tasks. Therefore, we do not want our users to need to change the code independently when our new system goes online, which costs relatively high.

3.Workflow and task separation

Allows for direct tasks development, debugging, and testing and the workflow directly references the developed tasks, thus separate task development and task scheduling.

4.Project environment variables

New project environment variables are added, and project environment variables are adapted to all jobs within the project by default, saving us from configuring them within each workflow, and each project can refer to them directly.

5.Data sources

We look for data sources by name, and it supports data sources such as phoenix. Later we want it to be able to import and export tasks, but in the process of importing and exporting, the definition of parameters and data sources in our tasks cannot be changed, so that they can be directed from testing to production, which is simpler in terms of production.

### 2. Quasi-real-time tasks

1. Task development modulation (SQL), online development modulation (online view of logs, online view of SQL query return results), pop-up windows in WEBIDE to replace script variables.

2. Clickhouse data source HA configuration integration support. However, there is a small problem in batch processing offline, i.e. if the current port is not available, an error may be reported directly. This is a problem that needs a fix.

3. For quasi-real-time workflow single instance running, if there is already an initialized instance, or there is an ongoing workflow instance, the workflow will not be triggered to run even if the next batch is triggered.

### 3. Other non-ETL user-defined data batch processing
1. We currently have model data calculation tasks pushed from the metrics management platform. The simple user-defined reports will generate SQL dynamically by the platform and subsequently pushed directly to offline scheduling. This process will not involve any developer in the future.

2. In the tag management system, we mainly adapt it to scenario needs by generating special plug-in tasks.

## 03 Optimisation
### 1.The status
In XWBank, there are about 9000+ task instances generated every day, with real-time tasks making up the majority. Today, we have used Apache DolphinScheduler to run batches in real-time and quasi-real-time tasks for many projects, offline batches for the metrics management system, including batches for the integrated internal SQL tools that support XSQL.

<div align=center>
<img src="/img/2022-05-25/en/3.jfif"/>
</div>

In the picture above on the right, we can see that we have made tasks independent, replacing parameters. Also, in terms of task lineage, especially for SQL-type tasks, we can do automatic parsing and also add them manually. This is mainly used for the automatic orchestration of our workflows, such as the internal task maps of the company.

To meet the above business requirements, we have made the following five major optimizations to Apache DolphinScheduler and also listed the corresponding modifications that must be noted during the transformation process.

1. Environment variables are isolated from projects, and environments, but the names of environment variables are kept consistent across environments.
2. Data sources are isolated through the project, and the environment, but the names of the data sources remain consistent across the different environments.
3. New non-JDBC data sources are added, like ES, Livy, etc. In internal transparent applications, Livy is needed as a data service framework to interface with Spark jobs for data desensitization.

### 2. Standalone jobs

- Develop standalone task development, debugging, configuration pages, able to support project environment variables
- JDBC, XSQL tasks can refer to data sources by data source name
- Implement interactive WEBIDE debugging and development
- Parameter optimization, support for user ${parameter} and referencing of system built-in time functions
- Completion of independent SQL, XQSL automatic lineage parsing
- Complete automatic SQL parameter parsing

### 3. Optimization of workflow startup logic

- Quasi-real-time workflow single instance run, if there is already a running workflow instance, this run will be ignored.
- Adding environment control policies, where workflows refer to different environment variables, and data source access connections, depending on the environment. For example, if the disaster recovery environment and the production environment are configured in advance, once an error occurs in the production environment, it can be switched to the disaster recovery environment with one click.
- Solve scheduling problems caused by workflow and task separation, mainly including the detection of exceptions

### 4. Import and export optimization

- New import and export of tasks, task configurations, and their resource files, etc.
- In the banking and financial industries where the develope&test and production networks are not always the same, there is a need to export a relatively friendly resource script workflow and resource file information when processing data in multiple environments.
- New workflow import and export logic to deal with data conflicts due to self-incrementing IDs of different database instances
- Navigated import and export, versioning, mainly for emergencies, partial code rollback, etc.

### 5. Alerting system improvement and optimization

- Docking to the internal alert system of XWBank, default alerting of task creators subscribing to the alerting group users
- Add policy alerts (start-up delay, completion delay) to alert key tasks for start-up and completion delay

6. Interfacing with internal systems

- Model-type task operation and monitoring
- Report push-tasks operation and monitoring
- Interfacing with internal IAM SSO unified login authentication system
- Restrict specific functions (code editing, workflow running, task running, etc.) by the network

There is a special phenomenon in the financial industry that the production needs to be done in a specific server room, i.e. we have to restrict certain operations to be done in the server room while reducing the cost of one change.

We create reports automatically based primarily on this dimensional model theory. Once configured, we perform a code merge calculation of multiple tables based on the configuration report logic. The aggregation calculation is completed and pushed to the report server. This allows business users to perform data aggregation without the need to write SQL following some of the basic functionality we provide, thus avoiding the business end-user being upset and giving us ad hoc requests.

## 04 Future Plans

- Promote the offline data development platform to more project teams
- Gradually replace the existing scheduling system in the bank to achieve smooth migration of all offline tasks
- Scheduling system will be sunk to connect to the bank’s data R&D management system

### Technical objectives

1. A more intelligent and automated task scheduling system, lowering the threshold for the user
2. Operation monitoring and prediction, providing more friendly operation and maintenance monitoring and task completion time prediction functions for the operation and maintenance staff
3. Global view functionality, providing a global view of offline tasks for development, operations, and maintenance staff, providing data lineage and impact analysis functionality
4. Further integration with in-line custom configuration modularity to reduce development costs for developers
5. Integration with data quality management platforms
6. User-defined template support

Thank you all, that's all I have to share today.