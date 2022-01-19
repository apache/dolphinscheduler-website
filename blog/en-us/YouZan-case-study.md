# From Airflow to Apache DolphinScheduler, the Roadmap of Scheduling System On Youzan Big Data Development Platform

<div align=center>
<img src="https://s1.imgpp.com/2021/12/16/1639383815755.png"/>
</div>

At the recent Apache DolphinScheduler Meetup 2021, Zheqi Song, the Director of Youzan Big Data Development Platform
shared the design scheme and production environment practice of its scheduling system migration from Airflow to Apache
DolphinScheduler.

This post-90s young man from Hangzhou, Zhejiang Province joined Youzan in September 2019, where he is engaged in the
research and development of data development platforms, scheduling systems, and data synchronization modules. When he
first joined, Youzan used Airflow, which is also an Apache open source project, but after research and production
environment testing, Youzan decided to switch to DolphinScheduler.

How does the Youzan big data development platform use the scheduling system? Why did Youzan decide to switch to Apache
DolphinScheduler? The message below will uncover the truth.

## Youzan Big Data Development Platform（DP）

As a retail technology SaaS service provider, Youzan is aimed to help online merchants open stores, build data products
and digital solutions through social marketing and expand the omnichannel retail business, and provide better SaaS
capabilities for driving merchants' digital growth.

At present, Youzan has established a relatively complete digital product matrix with the support of the data center:

<div align=center>
<img src="https://s1.imgpp.com/2021/12/16/1_Jjgx5qQfjo559_oaJP-DAQ.png"/>
</div>

Youzan has established a big data development platform (hereinafter referred to as DP platform) to support the
increasing demand for data processing services. This is a big data offline development platform that provides users with
the environment, tools, and data needed for the big data tasks development.

<div align=center>
<img src="https://s1.imgpp.com/2021/12/16/1_G9znZGQ1XBhJva0tjWa6Bg.png"/>
</div>

Youzan Big Data Development Platform Architecture

Youzan Big Data Development Platform is mainly composed of five modules: basic component layer, task component layer,
scheduling layer, service layer, and monitoring layer. Among them, the service layer is mainly responsible for the job
life cycle management, and the basic component layer and the task component layer mainly include the basic environment
such as middleware and big data components that the big data development platform depends on. The service deployment of
the DP platform mainly adopts the master-slave mode, and the master node supports HA. The scheduling layer is
re-developed based on Airflow, and the monitoring layer performs comprehensive monitoring and early warning of the
scheduling cluster.

### 1 Scheduling layer architecture design

<div align=center>
<img src="https://s1.imgpp.com/2021/12/16/1_UDNCmMrZtcswj62aqNXA1g.png"/>
</div>

Youzan Big Data Development Platform Scheduling Layer Architecture Design

In 2017, our team investigated the mainstream scheduling systems, and finally adopted Airflow (1.7) as the task
scheduling module of DP. In the design of architecture, we adopted the deployment plan of Airflow + Celery + Redis +
MySQL based on actual business scenario demand, with Redis as the dispatch queue, and implemented distributed deployment
of any number of workers through Celery.

In the HA design of the scheduling node, it is well known that Airflow has a single point problem on the scheduled node.
To achieve high availability of scheduling, the DP platform uses the Airflow Scheduler Failover Controller, an
open-source component, and adds a Standby node that will periodically monitor the health of the Active node. Once the
Active node is found to be unavailable, Standby is switched to Active to ensure the high availability of the schedule.

### 2 Worker nodes load balancing strategy

In addition, to use resources more effectively, the DP platform distinguishes task types based on CPU-intensive
degree/memory-intensive degree and configures different slots for different celery queues to ensure that each machine's
CPU/memory usage rate is maintained within a reasonable range.

## Scheduling System Upgrade and Selection

Since the official launch of the Youzan Big Data Platform 1.0 in 2017, we have completed 100% of the data warehouse
migration plan in 2018. In 2019, the daily scheduling task volume has reached 30,000+ and has grown to 60,000+ by 2021.
the platform’s daily scheduling task volume will be reached. With the rapid increase in the number of tasks, DP's
scheduling system also faces many challenges and problems.

### 1 Pain points of Airflow

1. In-depth re-development is difficult, the commercial version is separated from the community, and costs relatively
   high to upgrade ;
2. Based on the Python technology stack, the maintenance and iteration cost higher;
3. Performance issues:

<div align=center>
<img src="https://s1.imgpp.com/2021/12/16/1_U33OWzzfw2Dqn3ryCNbSvw.png"/>
</div>

Airflow's schedule loop, as shown in the figure above, is essentially the loading and analysis of DAG and generates DAG
round instances to perform task scheduling. Before Airflow 2.0, the DAG was scanned and parsed into the database by a
single point. It leads to a large delay (over the scanning frequency, even to 60s-70s) for the scheduler loop to scan
the Dag folder once the number of Dags was largely due to business growth. This seriously reduces the scheduling
performance.

4. Stability issues:

The Airflow Scheduler Failover Controller is essentially run by a master-slave mode. The standby node judges whether to
switch by monitoring whether the active process is alive or not. If it encounters a deadlock blocking the process
before, it will be ignored, which will lead to scheduling failure. After similar problems occurred in the production
environment, we found the problem after troubleshooting. Although Airflow version 1.10 has fixed this problem, this
problem will exist in the master-slave mode, and cannot be ignored in the production environment.

Taking into account the above pain points, we decided to re-select the scheduling system for the DP platform.

In the process of research and comparison, Apache DolphinScheduler entered our field of vision. Also to be Apache's top
open-source scheduling component project, we have made a comprehensive comparison between the original scheduling system
and DolphinScheduler from the perspectives of performance, deployment, functionality, stability, and availability, and
community ecology.

This is the comparative analysis result below:

<div align=center>
<img src="https://s1.imgpp.com/2021/12/16/1_Rbr05klPmQIc7WPFNeEH-w.png"/>
</div>

<div align=center>
<img src="https://s1.imgpp.com/2021/12/16/1_Ity1QoRL_Yu5aDVClY9AgA.png"/>
</div>

Airflow VS DolphinScheduler

### 1 DolphinScheduler valuation

<div align=center>
<img src="https://s1.imgpp.com/2021/12/16/1_o8c1Y1TFAOis3KozzJnvfA.png"/>
</div>

As shown in the figure above, after evaluating, we found that the throughput performance of DolphinScheduler is twice
that of the original scheduling system under the same conditions. And we have heard that the performance of
DolphinScheduler will greatly be improved after version 2.0, this news greatly excites us.

In addition, at the deployment level, the Java technology stack adopted by DolphinScheduler is conducive to the
standardized deployment process of ops, simplifies the release process, liberates operation and maintenance manpower,
and supports Kubernetes and Docker deployment with stronger scalability.

In terms of new features, DolphinScheduler has a more flexible task-dependent configuration, to which we attach much
importance, and the granularity of time configuration is refined to the hour, day, week, and month. In addition,
DolphinScheduler's scheduling management interface is easier to use and supports worker group isolation. As a
distributed scheduling, the overall scheduling capability of DolphinScheduler grows linearly with the scale of the
cluster, and with the release of new feature task plug-ins, the task-type customization is also going to be attractive
character.

From the perspective of stability and availability, DolphinScheduler achieves high reliability and high scalability, the
decentralized multi-Master multi-Worker design architecture supports dynamic online and offline services and has
stronger self-fault tolerance and adjustment capabilities.


And also importantly, after months of communication, we found that the DolphinScheduler community is highly active, with
frequent technical exchanges, detailed technical documents outputs, and fast version iteration.


In summary, we decided to switch to DolphinScheduler.

## DolphinScheduler Migration Scheme Design

After deciding to migrate to DolphinScheduler, we sorted out the platform's requirements for the transformation of the
new scheduling system.

In conclusion, the key requirements are as below:

1. Users are not aware of migration. There are 700-800 users on the platform, we hope that the user switching cost can
   be reduced;
2. The scheduling system can be dynamically switched because the production environment requires stability above all
   else. The online grayscale test will be performed during the online period, we hope that the scheduling system can be
   dynamically switched based on the granularity of the workflow;
3. The workflow configuration for testing and publishing needs to be isolated. Currently, we have two sets of
   configuration files for task testing and publishing that are maintained through GitHub. Online scheduling task
   configuration needs to ensure the accuracy and stability of the data, so two sets of environments are required for
   isolation.

In response to the above three points, we have redesigned the architecture.


### 1 Architecture design

1. Keep the existing front-end interface and DP API;
2. Refactoring the scheduling management interface, which was originally embedded in the Airflow interface, and will be
   rebuilt based on DolphinScheduler in the future;
3. Task lifecycle management/scheduling management and other operations interact through the DolphinScheduler API;
4. Use the Project mechanism to redundantly configure the workflow to achieve configuration isolation for testing and
   release.

<div align=center>
<img src="https://s1.imgpp.com/2021/12/16/1_eusVhW4QAJ2uO-J96bqiFg.png"/>
</div>

Refactoring Design


We entered the transformation phase after the architecture design is completed. We have transformed DolphinScheduler's
workflow definition, task execution process, and workflow release process, and have made some key functions to
complement it.


- Workflow definition status combing

<div align=center>
<img src="https://s1.imgpp.com/2021/12/16/-1.png"/>
</div>

We first combed the definition status of the DolphinScheduler workflow. The definition and timing management of
DolphinScheduler work will be divided into online and offline status, while the status of the two on the DP platform is
unified, so in the task test and workflow release process, the process series from DP to DolphinScheduler needs to be
modified accordingly.

- Task execution process transformation

Firstly, we have changed the task test process. After switching to DolphinScheduler, all interactions are based on the
DolphinScheduler API. When the task test is started on DP, the corresponding workflow definition configuration will be
generated on the DolphinScheduler. After going online, the task will be run and the DolphinScheduler log will be called
to view the results and obtain log running information in real-time.

<div align=center>
<img src="https://s1.imgpp.com/2021/12/16/-1.png"/>
</div>
<div align=center>
<img src="https://s1.imgpp.com/2021/12/16/-3.png"/>
</div>
- Workflow release process transformation

Secondly, for the workflow online process, after switching to DolphinScheduler, the main change is to synchronize the
workflow definition configuration and timing configuration, as well as the online status.

<div align=center>
<img src="https://s1.imgpp.com/2021/12/16/1_4-ikFp_jJ44-YWJcGNioOg.png"/>
</div>
<div align=center>
<img src="https://s1.imgpp.com/2021/12/16/-5.png"/>
</div>
The original data maintenance and configuration synchronization of the workflow is managed based on the DP master, and
only when the task is online and running will it interact with the scheduling system. Based on these two core changes,
the DP platform can dynamically switch systems under the workflow, and greatly facilitate the subsequent online
grayscale test.

### 2 Function completion


In addition, the DP platform has also complemented some functions. The first is the adaptation of task types.


- Task type adaptation

Currently, the task types supported by the DolphinScheduler platform mainly include data synchronization and data
calculation tasks, such as Hive SQL tasks, DataX tasks, and Spark tasks. Because the original data information of the
task is maintained on the DP, the docking scheme of the DP platform is to build a task configuration mapping module in
the DP master, map the task information maintained by the DP to the task on DP, and then use the API call of
DolphinScheduler to transfer task configuration information.

<div align=center>
<img src="https://s1.imgpp.com/2021/12/16/1_A76iOa5LKyPiu-NoopmYrA.png"/>
</div>

Because some of the task types are already supported by DolphinScheduler, it is only necessary to customize the
corresponding task modules of DolphinScheduler to meet the actual usage scenario needs of the DP platform. For the task
types not supported by DolphinScheduler, such as Kylin tasks, algorithm training tasks, DataY tasks, etc., the DP
platform also plans to complete it with the plug-in capabilities of DolphinScheduler 2.0.

### 3 Transformation schedule

Because SQL tasks and synchronization tasks on the DP platform account for about 80% of the total tasks, the
transformation focuses on these task types. At present, the adaptation and transformation of Hive SQL tasks, DataX
tasks, and script tasks adaptation have been completed.

<div align=center>
<img src="https://s1.imgpp.com/2021/12/16/1_y7HUfYyLs9NxnTzENKGSCA.png"/>
</div>
### 4 Function complement

- Catchup mechanism realizes automatic replenishment

DP also needs a core capability in the actual production environment, that is, Catchup-based automatic replenishment and
global replenishment capabilities.

The catchup mechanism will play a role when the scheduling system is abnormal or resources is insufficient, causing some
tasks to miss the currently scheduled trigger time. When the scheduling is resumed, Catchup will automatically fill in
the untriggered scheduling execution plan.

The following three pictures show the instance of an hour-level workflow scheduling execution.

In Figure 1, the workflow is called up on time at 6 o'clock and tuned up once an hour. You can see that the task is
called up on time at 6 o'clock and the task execution is completed. The current state is also normal.

<div align=center>
<img src="https://s1.imgpp.com/2021/12/16/1_MvQGZ-FKKLMvKrlWihXHgg.png"/>
</div>

figure 1

Figure 2 shows that the scheduling system was abnormal at 8 o'clock, causing the workflow not to be activated at 7
o'clock and 8 o'clock.

<div align=center>
<img src="https://s1.imgpp.com/2021/12/16/1_1WxLOtd1Oh2YERmtGcRb0Q.png"/>
</div>
figure 2

Figure 3 shows that when the scheduling is resumed at 9 o'clock, thanks to the Catchup mechanism, the scheduling system
can automatically replenish the previously lost execution plan to realize the automatic replenishment of the scheduling.

<div align=center>
<img src="https://s1.imgpp.com/2021/12/16/126ec1039f7aa614c.png"/>
</div>

Figure 3

This mechanism is particularly effective when the amount of tasks is large. When the scheduled node is abnormal or the
core task accumulation causes the workflow to miss the scheduled trigger time, due to the system's fault-tolerant
mechanism can support automatic replenishment of scheduled tasks, there is no need to replenish and re-run manually.

At the same time, this mechanism is also applied to DP's global complement.

- Global Complement across Dags

<div align=center>
<img src="https://s1.imgpp.com/2021/12/16/1_eVyyABTQCLeSGzbbuizfDA.png"/>
</div>

DP platform cross-Dag global complement process

The main use scenario of global complements in Youzan is when there is an abnormality in the output of the core upstream
table, which results in abnormal data display in downstream businesses. In this case, the system generally needs to
quickly rerun all task instances under the entire data link.

Based on the function of Clear, the DP platform is currently able to obtain certain nodes and all downstream instances
under the current scheduling cycle through analysis of the original data, and then to filter some instances that do not
need to be rerun through the rule pruning strategy. After obtaining these lists, start the clear downstream clear task
instance function, and then use Catchup to automatically fill up.

This process realizes the global rerun of the upstream core through Clear, which can liberate manual operations.

Because the cross-Dag global complement capability is important in a production environment, we plan to complement it in
DolphinScheduler.

## Current Status & Planning & Outlook

### 1 DolphinScheduler migration status


The DP platform has deployed part of the DolphinScheduler service in the test environment and migrated part of the
workflow.

After docking with the DolphinScheduler API system, the DP platform uniformly uses the admin user at the user level.
Because its user system is directly maintained on the DP master, all workflow information will be divided into the test
environment and the formal environment.


<div align=center>
<img src="https://s1.imgpp.com/2021/12/16/1_bXwtKI2HJzQuHCMW5y3hgg.png"/>
</div>

DolphinScheduler 2.0 workflow task node display

The overall UI interaction of DolphinScheduler 2.0 looks more concise and more visualized and we plan to directly
upgrade to version 2.0.

### 2 Access planning


At present, the DP platform is still in the grayscale test of DolphinScheduler migration., and is planned to perform a
full migration of the workflow in December this year. At the same time, a phased full-scale test of performance and
stress will be carried out in the test environment. If no problems occur, we will conduct a grayscale test of the
production environment in January 2022, and plan to complete the full migration in March.

<div align=center>
<img src="https://s1.imgpp.com/2021/12/16/1_jv3ScivmLop7GYjKIECaiw.png"/>
</div>

### 3 Expectations for DolphinScheduler

In the future, we strongly looking forward to the plug-in tasks feature in DolphinScheduler, and have implemented
plug-in alarm components based on DolphinScheduler 2.0, by which the Form information can be defined on the backend and
displayed adaptively on the frontend.

<div align=center>
<img src="https://s1.imgpp.com/2021/12/16/1_3jP2KQDtFy71ciDoUyW3eg.png"/>
</div>

"

I hope that DolphinScheduler's optimization pace of plug-in feature can be faster, to better quickly adapt to our
customized task types.

——Zheqi Song, Head of Youzan Big Data Development Platform

"