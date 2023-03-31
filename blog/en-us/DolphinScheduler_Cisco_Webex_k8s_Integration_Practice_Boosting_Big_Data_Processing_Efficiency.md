---
title:DolphinScheduler✖️Cisco Webex: k8s Integration Practice, Boosting Big Data Processing Efficiency!
keywords: Apache,DolphinScheduler,scheduler,big data,ETL,airflow,hadoop,orchestration,dataops,Meetup
description: ummary: Cisco Webex is a software company that develops and sells online meeting...
---
# DolphinScheduler✖️Cisco Webex: k8s Integration Practice, Boosting Big Data Processing Efficiency!

Summary: Cisco Webex is a software company that develops and sells online meeting, video conferencing, cloud calling services, and contact center as a service applications. The team has designed and built a big data platform to serve data ingestion and workload data processing for their suite of products. Taking the Webex Meeting product as an example, Webex Meetings generate various metrics. When a meeting is held, both the client and server send numerous metrics and logs to the Kafka cluster, and external and internal customers rely on these metrics to optimize the meeting experience or generate reports. In big data business data processing, Cisco Webex not only achieves efficient scheduling of various jobs through Apache DolphinScheduler, but also accomplishes goals such as data lineage and metadata management, data governance, and daily data integration.

## Business Challenges
Since Cisco Webex is a global collaboration service provider with customers spanning multiple time zones and continents, it has numerous data centers worldwide. These data centers include locally self-managed data centers and clusters managed by cloud providers such as Amazon and Google. In the past, Cisco Webex would use mirroring to aggregate all data from global data centers into a centralized Kafka cluster in the United States, and from there, data processing and integration would begin.

In recent years, Cisco Webex has established multiple clusters worldwide for data localization. The data model has shifted from a centralized cluster containing data from all around the world to individual data centers containing locally generated data.

Another issue that Cisco Webex's next-generation data platform aims to address is "data silos." Since different types of services run on different infrastructures, each product has its own data ingestion and data platform implementation, and data sources are diverse with numerous data storage formats. This makes it difficult to provide customers with a unified data source and ensure consistency between different systems.

Cisco Webex's vision is to create a data platform that can serve every internal and external customer, eliminating data silos from a unified architecture, data storage, and data ingestion technology, and integrating all infrastructures. Furthermore, this data platform must be able to adapt to any public cloud and existing private data center within the architecture.

## Solution

### 1. DolphinScheduler and k8s Integration
![01](/img/2023-03-31/assets01/01.png)



As shown in the architecture diagram, the left part represents DolphinScheduler's features. Different task types run on these workers. All data processing jobs, such as Flink and Sparks, used to run on multiple separate Yarn clusters. We had a CDH cluster for batch Spark jobs and Flink jobs, and multiple Flink jobs ran on different Flink clusters. In 2021, we decided to build a Kubernetes cluster to replace the Yarn clusters for the following reasons.

1. Using Kubernetes makes our daily operations smoother and easier.
2. The second reason for adopting Kubernetes is that it allows us to deploy various containerized services.

**As a result, Cisco Webex built a Kubernetes cluster to replace the Yarn clusters,** allowing all data processing jobs to run on the Kubernetes cluster, extending DolphinScheduler's capabilities, and **integrating Flink, Spark, and Kubernetes features with DolphinScheduler.**

### 2. Multi-cluster ETL Job Management
![02](/img/2023-03-31/assets01/02.png)


A typical use case for Cisco Webex is deploying the same job on multiple clusters. To minimize deployment work, the approach is to generalize the common processing logic and replace the required configurations for each cluster, enabling one-click development for multiple clusters. Cisco Webex **uses a centralized DolphinScheduler as the job scheduling platform for all data processing jobs,** **running jobs in different data centers.** When users submit new jobs to different clusters, DolphinScheduler will distribute the instances and files to the target cluster and run the job based on the user's selection. The resources for running jobs are managed on DolphinScheduler, allowing CPU memory limits to be set for each Namespace on different Kubernetes clusters. In addition, Cisco Webex also adds the commonly used Webex teams alert plugin as a plugin to DolphinScheduler for tracking issues when errors occur.

### 3. Kubernetes Multi-cluster Management

![03](/img/2023-03-31/assets01/03.png)


Cisco Webex has built many Kubernetes compute clusters in private data centers worldwide or in public clouds like AWS. To enable DolphinScheduler to submit and manage jobs for data centers spread across the globe, Cisco Webex has implemented features such as cluster management and namespaces on DolphinScheduler.

### 4. Simple ETL Pipeline Drag-and-Drop Generation Framework

![04](/img/2023-03-31/assets01/04.png)


For simple processing jobs without complex competitive logic, Cisco Webex has developed a drag-and-drop pipeline generation framework on DolphinScheduler.

Users can generate complex real-time data processing pipelines by dragging and dropping on the canvas. By configuring predefined source filters, mappings, and sync operators, users don't need to write any code. Notably, Cisco Webex has also integrated metadata into the data center for source and map operators to use. As a result, when users choose the topics they want to process, the job list they see comes from the API data in the data center. Users don't need to type in names and Kafka cluster configuration strings on the interface but instead get them automatically from the data center. In map operators, users can define different types of functions for each field.

### 5. Flink Jobs on Kubernetes
![05](/img/2023-03-31/assets01/05.png)


Cisco Webex has also built Flink jobs in DolphinScheduler based on Kubernetes features. Some people might be confused because there is already a Flink task port in the DolphinScheduler workflow. This is because the Flink task in DolphinScheduler only applies to Yarn, but we intend to run all jobs on Kubernetes clusters. We achieved Flink job execution on Kubernetes by adding Kubernetes-related APIs to the current DolphinScheduler architecture.


## User Benefits

1. Built the next-generation data platform based on DolphinScheduler, enabling running all types of jobs on a single platform;
2. Broke down Cisco Webex data silos, connected global data centers, integrated any public cloud and existing private data centers, ensuring consistency across systems;
3. Ran all data processing jobs on Kubernetes clusters, reducing operational and maintenance costs.

## User Profile

San Francisco-based Cisco Webex (WebEx) is a subsidiary of Cisco, a software company that develops and sells online meetings, video conferencing, cloud calling services, and contact center as service applications, creating on-demand software solutions for companies of various sizes.


