---
title:China Unicom revamps Apache DolphinScheduler Resource Center for cross-cluster calls in billing environments and one-stop access to data scripts
keywords: Apache,DolphinScheduler,scheduler,big data,ETL,airflow,hadoop,orchestration,dataops,Meetup
description:By 2022, China Unicom's subscriber base reaches 460 million
---
# China Unicom revamps Apache DolphinScheduler Resource Center for cross-cluster calls in billing environments and one-stop access to data scripts

<div align=center>
<img src="/img/2022-05-07/en/1.png"/>
</div>


By 2022, China Unicom's subscriber base reaches 460 million, accounting for 30% of China's population. With the spread of 5G, operators' IT systems are generally facing the impact of a series of changes such as massive subscribers, massive call orders, diverse services, and network organization models.

Currently, China Unicom handles more than 40 billion voice orders per day. Facing the huge data volume, it has become the ultimate goal of China Unicom to improve service levels and provide more targeted services to customers. China Unicom has already emerged as a leader in technologies and applications for massive data aggregation, processing, desensitization, and encryption, which help it grows into an enabler of the development of a digital economy.

At the Apache DolphinScheduler April Meetup, we invited Xuesong Bai from China Unicom Software, who shared with us the application of Apache DolphinScheduler in China Unicom's billing environment.

**The presentation consisted of three parts.**

- General usage of Apache DolphinScheduler in China Unicom
- Sharing on the topic of China Unicom's billing business
- The next step in planning


<div align=center>
<img src="/img/2022-05-07/en/2.png"/>
</div>

Xuesong Bai | Big Data Engineer, China Unicom Software, Graduated from China Agricultural University, working on big data platform building and AI platform building, contributing Apache SeaTunnel(Incubating) plug-in for Apache DolphinScheduler and sharing Alluxio plug-in for Apache SeaTunnel(Incubating)

## 01 General usage of Apache DolphinScheduler in China Unicom

Let me start by giving you an overview of China Unicom's overall usage of Apache DolphinScheduler.

- Right now we are running our business mainly in 4 clusters at 3 locations 
- The overall number of task flows is around 300
- Average daily task runs are around 5,000

The Apache DolphinScheduler components we use include Spark, Flink, SeaTunnel (formerly Waterdrop), as well as Presto, and some shell scripts for stored procedures, covering auditing, revenue sharing, billing, and other operations that need to be automated.


<div align=center>
<img src="/img/2022-05-07/en/3.jpg"/>
</div>


## 02 Business introduction

### 01 Cross-cluster dual-active service calls

As mentioned above, our service runs on 4 clusters at 3 locations, which inevitably leads to mutual data exchange and business calls between clusters. How should we unify the management and scheduling of these cross-cluster data transfer tasks is important. Our data is in the production cluster, which is very sensitive to the cluster network bandwidth and must be managed in an organized manner.

On the other hand, we have some operations that need to be invoked across clusters, for example, cluster B has to start statistical tasks after data is available in cluster A. We chose Apache DolphinScheduler as the scheduling and control system to solve both problems.

We use HDFS for the underlying data storage. In the cross-cluster HDFS data exchange, we divide the data used into small and large batches, structure tables, configuration tables, etc. according to the size and usage of the data.

For small batches, we put them directly onto the same Alluxio for data sharing, so that version issues caused by untimely data synchronization do not occur.

- For things like schedules and other large files, we use a mix of Distcp and Spark.
- For structured table data, the SeaTunnel on Spark is used.
- Setting speed limits by way of Yarn queues.
- Unstructured data is transferred by Distcp, with speed limits by way of the self-contained parameter Bandwidth.

These transfer tasks are all run on top of Apache DolphinScheduler, and the overall data flow is mainly data availability detection for cluster A, data integrity verification for cluster A, data transfer between clusters A and B, and data auditing and availability notification for cluster B.

We mainly used Apache DolphinScheduler's complementary re-runs to fix failed tasks or incomplete data.


<div align=center>
<img src="/img/2022-05-07/en/4.png"/>
</div>


Once we have finished synchronizing and accessing data across clusters, we also use Apache DolphinScheduler to make task calls across geographies and clusters.

We have two clusters in location A, i.e. test A1 and production A2, and a production B1 cluster in location B. We will take out two machines with intranet IPs as interface machines on each cluster and build a virtual cluster by building Apache DolphinScheduler on the six interface machines so that the content of the three clusters can be manipulated on a unified page.

Q: How do I go live from test to production?

A: Develop tasks on A1 test, after passing the test, change the worker nodes directly to A2 production.

Q: What if I encounter a problem with A2 production, eg. data is not available?

A: We can switch directly to B1 production to do a manual dual-live disaster recovery switchover.


<div align=center>
<img src="/img/2022-05-07/en/5.png"/>
</div>

Finally, we also have some tasks that are relatively large and need to be calculated simultaneously using two clusters to meet the task timelines, we will split the data into two parts and put them on A2 and B1 respectively, after which we will run the tasks simultaneously and finally pass the results back to the same cluster for merging. These task processes are invoked through Apache DolphinScheduler.

Please note that in this process, we use Apache DolphinScheduler to solve several problems.

- Task dependency checks for projects across clusters.
- Control of task environment variables at the node level.

### 02 AI development synchronization of task runs

#### 1. Unifying data access methods

We now have a simple AI development platform that mainly provides some TensorFlow and Spark ML computing environments for users. With the business requirement to bridge the user-trained local file model and the clustered file system, and to be able to provide a unified approach to access and deployment, we use the tools Alluxio-fuse and Apache DolphinScheduler.

- Alluxio-fuse bridges local and cluster storage

- Apache DolphinScheduler shares local and cluster storage

As the AI platform cluster and the data cluster we built are two data clusters, so we store data on the data cluster, use Spark SQL or Hive to do some data pre-processing, after that we transfer the processed data on Alluxio, and finally mapped to local files through Alluxio fuse across level clusters, so that our development environment based on Conda's development environment allows us to access this data directly, thus to unify the way we access the data of clusters by access the local data.


<div align=center>
<img src="/img/2022-05-07/en/6.png"/>
</div>


#### 2. One-stop access to data scripts

After separating the resources, by pre-processing the big data content through the data cluster, we go through our AI cluster to process the training and prediction models. Here, we use Alluxio-fuse to make changes to Apache DolphinScheduler's resource centre. We connect Apache DolphinScheduler resource centre to Alluxio and mount both the local and cluster files via Alluxio-fuse, so that Apache DolphinSchedule can access both the local training inference scripts and the training inference data stored on hdfs, enabling one-stop access to the data scripts.


<div align=center>
<img src="/img/2022-05-07/en/7.png"/>
</div>


### 03 Service query logic persistence

The third application scenario is that we use Presto and Hue to provide a front-end instant query interface for users that need to run some processing logic and stored procedures regularly after writing SQL through the front-end when testing is completed, so we open up the flow from the front-end SQL to the back-end regular running tasks.



<div align=center>
<img src="/img/2022-05-07/en/8.png"/>
</div>


Another issue is that Presto does not have resource isolation between tenants. We did a comparison of several solutions before finally choosing the Presto on Spark solution in conjunction with the actual situation.

On this multi-tenant platform, the initial solution we offered to users was to use the Hue interface on the front end and run the back end directly on the physical cluster using Presto, which led to a problem of contention for the user resources. When there were certain large queries or large processing logic, it would cause other tenant operations to be on hold for long periods.

For this reason, we have had a comprehensive performance comparison between Presto on Yarn and Presto on Spark, and we found that Presto on Spark is more efficient in terms of resource usage, and you can choose the solution that suits your needs.



<div align=center>
<img src="/img/2022-05-07/en/9.png"/>
</div>


On the other hand, we make the native Presto and Presto on spark coexist, for SQL with small data volume and simple processing logic, we run them directly on native Presto, while for SQL with more complex processing logic and longer running time, we run them on Presto on Spark, so that users can use one set of SQL to switch to different underlying engines.

In addition, we have also bridged the Hue to Apache DolphinScheduler timed task scheduling process. After we modulate SQL development on Hue, we connect it to Git for version control by storing it in a local Serve file.

We transfer the local file to Alluxio fuse as a synchronous mount for SQL, and finally, we use Hue to create tasks and timed tasks through Apache DolphinScheduler's API to control the process from SQL development to timed runs.


<div align=center>
<img src="/img/2022-05-07/en/10.png"/>
</div>


### 04 Unified governance of data lakes data

The last scenario is the unified governance of the data in data lakes. On our self-developed data integration platform, we use a hierarchical governance approach to unify the management and access of the data in data lakes, in which Apache DolphinScheduler is used as the inbound scheduling and monitoring engine.

In the data integration platform, we use Apache DolphinScheduler for batch and real-time tasks such as data integration, data entry, and data distribution.

The bottom layer runs on Spark and Flink. For data query and data exploration, which require immediate feedback, we use the embedded Hue to Spark and Presto to explore and query the data; for data asset registration and data audit, we directly query the data source file information and directly synchronize the underlying data information.



<div align=center>
<img src="/img/2022-05-07/en/11.png"/>
</div>


Currently, we run the quality management of 460 data tables on the integration platform, providing unified management of data accuracy and punctuality.

## 03 Next steps and development needs

### 01 Resource Centre

At the resource centre, to facilitate file sharing between users, we plan to provide resource authorization for all users, as well as assign shared files at the tenant level depending on the tenant it belongs to, making it more friendly for a multi-tenant platform.

### 02 User Management

The second plan is around user management, we only provide tenant-level administrator accounts, with subsequent user accounts created by tenant administrator accounts.

### 03 Task Nodes

Finally, there are plans for our task nodes, which are now in progress: on the one hand, to complete the optimization of the SQL node so that users can select a resource centre SQL file without having to copy the SQL manually; on the other hand, enable the HTTP node to extract field judgments for custom parsing of the returned JSON, and to provide more friendly handling of complex return values.

