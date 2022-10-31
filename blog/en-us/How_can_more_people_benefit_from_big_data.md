---
title:# How can more people benefit from big data?
keywords: Apache,DolphinScheduler,scheduler,big data,ETL,airflow,hadoop,orchestration,dataops,Meetup
description:During the ApacheCon Asia 2022, Chen Wei, who has more than 10 years of experience in Big Data...
---
# How can more people benefit from big data?
![](https://miro.medium.com/max/640/1*2sUnAfzJd8nRlTKYDfIsvw.jpeg)
<u>During the ApacheCon Asia 2022, Chen Wei, who has more than 10 years of experience in Big Data development and is head of an offline data factory development tool from a bank, delivered a keynote speech on how to enable more people to benefit from Big Data.

Many thanks to volunteer Guan Bo for your text editing work, your contribution to Apache DolphinScheduler is what keeps the community moving forward!</u>

This presentation focused on the following four key elements.

# Background Information
Business managers would like access to reliable data to help them make better business decisions.

End-users want to get their data quickly within a few minutes or hours. They don’t want to go through the traditional process where they need to submit requirements to colleagues to the data department and wait weeks to get the data about requirement changes, development, and online implementation.

Data development teams are getting bigger and more sophisticated to manage than ever before. Everyone who works with data wants immediate access to business data to help them make decisions.

Data sources are becoming more complex, such as databases, web pages, logs, files, ERP, external data, etc.

## User Needs
Advanced users are looking for limited self-service, with easy, analytical access to data through self-service.

Application developers only care about the business logic, not the specific underlying technology, they also don’t want to go deeper into the configuration associated with platform operations and maintenance.

Hiding as much technical detail as possible, allows business developers as well as business users to focus more on the business logic and achieving business goals.

More user-friendly for system administrators, allowing them to quickly and easily manage the data platform effectively.

Based on the above user requirements, we believe that DataOps is the way to go, and DataOps built on top of DevOps is the best way to achieve data agility.

## What is DataOps?

DataOps is a collaborative data management practice focused on improving the communication, integration, and automation of data flows between data administrators, data consumers, and data developers within an organization.

The goal of DataOps is to deliver value quicker by establishing predictable delivery as well as managing change to data, data models, and related artifacts.

DataOps uses technology to automate the design, deployment, and management of data delivery through suitable levels of governance and uses metadata to improve the availability and value of data in a dynamic environment.

DataOps helps us achieve rapid data innovation, deliver insights to the business customer at a faster rate, and provide data quality to support data personnel.

In 2018, DataOps was included in the Technology Maturity Curve for Data Management, marking the official adoption and rollout of DataOps by the wider industry. Although DataOps can lower the barriers to data analytics, it does not make data analytics a simple task.

## Focus of DataOps
* Rapid innovation and experimentation to deliver better value to customers at an ever-increasing rate
* Delivering extremely high-quality data with very low error rates.
* Delivers interactive value through collaboration between complex arrays of people as well as technologies and environments.
* Clarity of measurement and monitoring and transparency of results.


## DataOps Core Component

### Job Scheduler
Provides scheduling of workflows, and offline data development and enables data developers to focus on the implementation of business logic and improve development efficiency.

### DevTools
Mainly provides development tools such as traditional scripting languages SQL, Python, etc. for quick and easy integration with the scheduling platform.

### Migration and Deployment tools
Data migration and deployment management tools. Aimed towards industries where the development and testing environment is network isolated, it requires effective import and export functions for proper deployment to the production environment.

### Management and monitoring tools
Administrator-friendly management, monitoring, and alert tools for offline tasks related to operations and maintenance.

# Job Scheduler
Next, we will compare different job schedulers together with you.

## Advantages and disadvantages of mainstream job scheduler
* **Oozie**
Oozie is an open-source workflow engine-based framework that provides job scheduling and coordination for Hadoop MapReduce, and Pig Jobs. Oozie needs to be deployed to the Java Servlet container to function. It is mainly used for scheduling tasks at regular intervals and multiple tasks can be scheduled in sequential logical order of execution.

* **Airflow**
Airflow is an open-source project for Airbnb’s Workflow, Python-based task management, job scheduling, and monitoring workflow platform. Airflow is a DAG (directed acyclic graph) based job scheduling system, which can be interpreted as an advanced version of crontab, but it solves the task dependency problem that Crontab cannot handle. Compared to Crontab, Airflow makes it easy to monitor the status of tasks (if they were executed successfully or not, time of execution, execution dependencies, etc.), track the history of tasks, receive email notifications when tasks fail, and view error logs.

* **Apache Dolphinscheduler**
DolphinScheduler is a decentralized, scalable and easily visualized DAG workflow job scheduling platform. Dedicated to solving the complex dependencies in the data processing process and enabling scheduling systems to be used right out of the box in the data processing process.

* **Control-M**
Control-M is a commercial version of a cross-platform job scheduling management software with powerful features but a lesser degree of programmability.

* **Azkaban**
Azkaban is a bulk workflow job scheduler released by Linkedin to execute a set of jobs and processes within a workflow in a specific order. Azkaban uses job profiles to establish dependencies between jobs and provides an easy-to-use web user interface to maintain and track your workflows. Azkaban requires all nodes to be deployed on a peer-to-peer basis, but under certain circumstances does not require full node peering as long as it supports high availability.

## Scheduler Services
* **Timer Service**

Provides a scheduled service of Crontab expressions to execute workflows on a scheduled cycle.

* **DAG Computation**
DAG computing often refers to the internal division of a computational job into several smaller jobs, which are logically related or sequentially constructed into a DAG (directed acyclic graph) structure.

* **Task Execution**
Task Execution is run by the scheduling system’s execution engine according to the type of task, parameters, environment, referenced data source, etc.

* **Environment Manage**
 Targeting distributed scheduling engines, need to provide node management capabilities to facilitate task execution at different nodes. This enables tasks to run at a scale well beyond the limits of a single machine.

* **Alert Service**
Notify users and system administrators when tasks fail, time out, or are not completed within a specified time.

* **What’s more?**

In addition to the above, we hope that the scheduler can provide environment and data source management functions. After the workflow has been configured with an environment parameter, all tasks can then directly refer to it. Data sources can be made available for other tasks in an injection method, depending on the type of task.

## Job Meta
![](https://miro.medium.com/max/640/1*gjwDaN8MfRQiLZkrvW_RRw.png)

* **Task Execution Cycle**

(minutes, hourly, daily, weekly & monthly)

* **Dependency Meta**

Upstream metadata information (files, tables, etc.) depending on the task.

* **Output Meta**

Downstream metadata information (files, tables, etc.) depends on the task.

* **Dependency Meta Classification**

Classify and differentiate the sources of dependent metadata.

* **Dependency Meta Source**

Reverse processing of task-dependent metadata to obtain upstream and downstream tasks, providing a logical basis for automatic workflow scheduling and initiation.

* **Job Parallel Execution Info(parallel, serial)**

Controls the parallel execution status of jobs (parallel, serial).

* **Job Type**

Type of job (SQL, SHELL, PYTHON, PROCEDURE, etc.)

## Job Development
Integration IDE(script language,shell,SQL,python etc)

Integrated IDE development environment (Script language, Shell, SQL, Python tasks, etc.)

configurable resource file(jar，spark, etc)

Configurable resource files（jar, spark, tasks that cannot be edited using text, etc.）

custom components

Customizable components, such as off-line data platforms where data synchronization is a specific component, require only a simple configuration of data synchronization to implement the synchronization process.

# Third-Party Job
Third-party job, where a specific application generates a custom script to accomplish the job goal.

Third-Party Job Integration

There are two methods of integration with third-party jobs, with the second method being the primary method used.

**First method: pull**

* The job scheduler provides an interface that can be accessed by the third-party system.
* Development within the system and configuring the scheduler in the scheduler system. Configure the job in the third-party system, configure the scheduler in the scheduling system and execute the job.
* Single-point of failure and bottleneck for job execution.
**Disadvantages**: Requires multiple developments in third-party systems and configuration of the scheduler in the scheduling system.

**Second method: push**
* The scheduling system provides a programmable API.
* Third-party systems create jobs and push them to the scheduling system, where they are automatically configured and scheduled.

## Job Execution And Notification

![](https://miro.medium.com/max/1400/1*gjwDaN8MfRQiLZkrvW_RRw.png)
**Job execution**: automatically triggered, based on conditions, upstream task dependencies

**Job notifications**: progress and status of job execution sent to third-party systems as a push message

## Sample Configuration For Data Integration
![](https://miro.medium.com/max/1400/1*hGJaLA6xnDdwwIe63Qst_Q.png)
**Sample configurations for third-party system integration are listed above.**

The job scheduling system provides a programmable interface to enable the injection of environmental information. You only need to specify the different types of data sources in the third-party system, you do not need to configure the details of each data source e.g. (IP, port, username, password, etc.), this part is configured in the scheduling system and the data source and environment information are injected to the job. The job then parses the data source and environment from the parameters and accesses the corresponding data source and environment. This simplifies the management of data sources for ETL jobs.

## Job Assignments
Traditional job scheduling was implemented by users dragging and connecting links, but we have improved the process by:

* Integrating job scheduling into the workflow.
* The configuration of upstream and downstream jobs is achieved through job-dependent metadata information.
* Some of the tables (some dimension tables) in ETL jobs are immutable and can be added to a whitelist. The workflow eliminates the need to look for business logic upstream of the corresponding table in the whitelist when making automatic changes and resolving dependencies.
* Views are an important factor affecting workflow automation. Views do not have ETL jobs, so we need to consider the view as a virtual job and import the view data into the scheduling platform so that the scheduling system is aware that the jobs that depend on the view are fundamentally dependent on the tasks corresponding to the underlying tables in the view.

## Job Impact Analysis
Thanks to the existence of metadata information, analysis of the impact of jobs is very straightforward.

* The dependencies of the upstream and downstream metadata are used to resolve the upstream jobs which are job-dependent, avoiding the use of the manual configuration to reduce the probability of errors.
* The calculation of some of the latest impacts, e.g. job suspension, failure, and impact of downstream jobs.

## Low Code Platform
* For general situations, it is a good choice to build template jobs that can be reused to calculate processes for a large number of job configurations, requiring only a single configuration of the core process to set up the parameters.
* Support of specific systems, such as metrics management systems, tagging systems, data desensitization systems, etc.
* Coding friendly, able to perform coding when required.
* User friendly, under certain circumstances, the system coding is used rather than through user coding, the user can obtain the required data to assemble a specific data model without having to re-code it, e.g. the user can assemble a derivative tag based on the base tag by simple click configuration.

# How to contribute:

* GitHub Code Repository: https://github.com/apache/dolphinscheduler

* Official Website:https://dolphinscheduler.apache.org/

* Mail List:dev@dolphinscheduler@apache.org

* Twitter:@DolphinSchedule