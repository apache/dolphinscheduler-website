---
title:ApacheCon Asia 2022 Review | Application of DolphinScheduler in T3Go One-stop Platform
keywords: Apache,DolphinScheduler,scheduler,big data,ETL,airflow,hadoop,orchestration,dataops,Kubernetes
description:This sharing mainly focuses on the following four parts
---
# ApacheCon Asia 2022 Review | Application of DolphinScheduler in T3Go One-stop Platform

<u>At the ApacheCon Asia 2022, big data engineers Li Xinkai & Zhao Yuwei at T3Go shared the company’s functional iteration and integration enhancement based on Apache DolphinScheduler in their development of a one-stop platform.</u>

This sharing mainly focuses on the following four parts:

* Why we choose Apache DolphinScheduler
* Data Lake Architecture of T3Go
* Difficulties in using Apache DolphinScheduler
* Solutions to the issues

## Why we choose Apache DolphinScheduler
### What is DolphinScheduler
Apache DolphinScheduler is a distributed, decentralized, and easily scalable visual DAG workflow task scheduling platform committed to dealing with the intricate dependencies in the data process so that the scheduling system can be used out of the box.

### 02 Why we choose DolphinScheduler

![](https://miro.medium.com/max/1260/1*9rnrDrko9bRkgkICrPJbQA.png)

We choose Apache DolphinScheduler mainly based on the following four reasons:

* High availability
Apache DolphinScheduler provides decentralized multi-worker and master with higher availability, self-support, and overload handling.
* User-friendly
Since all process definitions are visualized, Apache DolphinScheduler reduces learning costs by enabling people with no coding skills (such as data analysts) to create complex workflows.
* Rich scenarios
Apache DolphinScheduler provides multiple task types, including Spark, Hive, Python, Flink, MapReduce, and more. Additionally, the multi-tenancy of the platform increases efficiency and provides a high level of scalability.
* High scalability
Apache DolphinScheduler can linearly increase its overall scheduling capability with the rising volume of the cluster.
### 03 Status of use of DolphinScheduler in T3Go
![](https://miro.medium.com/max/1260/1*nXU-VHgvw3CCdo3U-CR-uw.png)
Apache DolphinScheduler in T3Go is mainly applied to combine with Kyuubi on Spark tasks to process 30,000+ offline scheduling tasks every day; at the same time, it schedules 300+ Spark Streaming tasks, 100+ Flink tasks, and 500+ Kylin, ClickHouse, and Shell tasks every day.

## 04 Optimization based on DolphinScheduler
A huge volume of scheduling tasks of T3Go heavily relies on Apache DolphinScheduler. This time, we’d like to share the following optimization work we had done based on it:
![](https://miro.medium.com/max/1260/1*L0Sw-3xIJjmZNpeY6fnopw.png)

* **Added the function of linkage complement**. Our task flow handles some upstream and downstream relationships across task flows through depends components. The relationship between these tasks is relatively complex. If the upstream complement is required, it is very complicated to sort out the upstream and downstream relations manually. So we made the linkage complement function.

![](https://miro.medium.com/max/1260/1*UjJjbPR30ew2jOPx9ttjww.png)
* **Added task view function. For example**, if a workflow is set to schedule on T-1, then a work instance with the running type of scheduling execution will be generated every day. After adding the task view function, you can see the operation of the workflow in the scheduling cycle at a glance, such as whether the scheduling is successful, whether there is a failure complement, recovery failure, etc., to improve development efficiency.

### Data Lake Architecture of T3 Go
Next, I will introduce the data lake architecture of T3 travel.

### 01 Data Lake Architecture
![](https://miro.medium.com/max/1260/1*MYG3tFmsOyXhPMg8luPMAg.png)

The bottom-level data sources in the data lake architecture of T3Go are mainly Kafka data and some database data subscribed by cannel. The data obtained by CDC is mainly stored in OBS object storage in Hudi format, and the unified resource arrangement of the cluster is performed through YARN. Computing engines such as Spark, Hive, Flink, Presto, and ClickHouse are integrated uniformly on the top of YARN and are connected to various businesses through the computing middleware of Kyuubi and Linkis, including Data Map, Hue, machine learning platforms, etc. The ETL operations during the process are mainly scheduled by Apache DolphinScheduler.

### T-1 Scheduling Process
![](https://miro.medium.com/max/1260/1*VNbDXwRmBhM0V2EwguLVIQ.png)

The scheduling process of T-1 is to allocate different resource policies for different tenants by connecting to Kyuubi. Apache DolphinScheduler connects different tenants to Kyuubi and performs computations on the Spark engine. In addition, we also did incremental data processing for the storage data mainly based on Hudi.

### Other usage scenarios
![](https://miro.medium.com/max/1260/1*1-mxP39oCXgbxl69pUfxWw.png)

At the same time, data development and some OLAP scenarios are mainly performed by connecting to Kyuubi. The reporting system connects to the Presto engine by connecting to Kyuubi to query data lake data. You can also connect to the Spark engine to write Spark SQL for data exploration and data development.

## Difficulties in using Apache DolphinScheduler
In the process of using Apache DolphinScheduler, we encountered some difficulties (only for version 1.3), as follows:
* No dedicated development tools
![](https://miro.medium.com/max/1260/1*lolVJZ3KT-n_aZoT7Me9yg.png)
Firstly, there was no dedicated data development module in Apache DolphinScheduler at the time, so we developed it on Hue originally installed on the CDH cluster. Developed statements also need to be manually copied to GitLab for version management.
* Lack of big data management CI/CD
![](https://miro.medium.com/max/1260/1*jbieUfftcxgKxRHFzfm0EA.png)
Secondly, to publish the developed statement on Apache DolphinScheduler, we needed to manually copy it to Apache DolphinScheduler for node configuration. At the same time, the conversion and configuration of some parameters and variables also require manual operations. The lack of an integrated CI/CD process greatly increases the cost of operation and maintenance.
* No version management & code sharing mechanism
![](https://miro.medium.com/max/1260/1*CplTlCJa1eQMropoq4fE_Q.png)
We previously used Apache DolphinScheduler version 1.3, which lacked the workflow version management and code sharing mechanism. This results in the inability to submit code to GitLab, version switching, code sharing in the same group and department, and repeated wheel building.
##  Solutions to the issues
For the above issues, we have invested a lot of energy to optimize, mainly covers:
### Introducing Datasphere Studio
![](https://miro.medium.com/max/1260/1*HbeK-3NowBFc0sdIGf5JjA.png)
At the beginning of this year, we introduced the open source Datasphere Studio (DSS) of WeBank as a one-stop application interaction platform and customized development to the demands of the company’s business.
### Code sharing
![](https://miro.medium.com/max/1260/1*V9w_xck8cP-fT803Lqs6Aw.png)
We call the developed files by integrating GitLab’s SDK and submit the code to the corresponding GitLab code branch and project. In this way, users in the same workspace can see and share each other’s code, which helps to avoid repeated wheels building.
### DSS Workflow
![](https://miro.medium.com/max/1260/1*GNekTa06QGodk69TFr1MZw.png)
The DSS workflow supports version management, which is convenient for rollback and version iteration. It supports the pick-up operation for the specified corresponding version. When pulling and arranging the workflow, you can select the associated script (the developed code files placed in those directories).

![](https://miro.medium.com/max/1260/1*kTr116slqOD6EePPhHk9uQ.png)

We integrated the DSS workflow so that it can be published directly into the Apache DolphinScheduler workflow.

DSS workflow is similar to Apache DolphinScheduler, which is also in JSON format, stored in MySQL, and read through saved task flow. We parse the JSON fields in the DSS workflow and convert them into JSON format files that conform to the DolphinScheduler task flow.
![](https://miro.medium.com/max/1260/1*MnUAQ_Jm1qk3Eba4AeD35A.png)
After storage, a task flow that conforms to its style is formed in DolphinScheduler. Now, the node types we supported cover SQL, shell scripts, and depends components, SeaTunnel(watedrop) tasks, Spark tasks and Python, etc.

![](https://miro.medium.com/max/1260/1*DvrmN2PmLJPuN9eKRrvLMA.png)
We use DSS workflow for version management. In essence, it’s an up-and-down-online process of multiple versions corresponding to the DolphinScheduler task flow. If the online version is selected, the corresponding version workflow on the DS side will go online, and the workflow of the non-selected version will go offline.

The compliment, timing schedule, and other operations are performed on DolphinScheduler, which is much more powerful than DSS.

Of course, the new version of DolphinScheduler already supports the version switching function, and we will integrate it later.
![](https://miro.medium.com/max/1260/1*VMhsmcsKwwDZuMagkW-_dw.png)
After integrating DSS, the changes to the T3Go data lake architecture are shown in the figure.

First, the bottom layer is still CDC in the data lake. Hudi is on top of object storage, resource orchestration is still performed on YARN, and the engine is still acted by Spark, Flink, Presto, and ClickHouse. Connection is still conducted through computing middleware, and we replaced Hue with the DSS scripts data development platform to connect with various business systems. DSS’s single sign-on authentication process facilitates unified login.

After the introduction of DSS in the T3Go big data platform, it complements Apache DolphinScheduler and unifies the integration process of code development and business online scheduling system, manages the big data CI/CD in a closed loop, and lowers the business barriers by helping them focus on business and demands and relieve the pressure of data development. With all these efforts, we narrow the gap to the goal of building a one-stop development platform.

Apache DolphinScheduler has developed rapidly in the past year and enhanced the functions we lacked before, such as data quality and task flow version management. We hope that these capabilities of Apache DolphinScheduler can be applied in our usage scenarios in subsequent iterations, and we also expect Apache DolphinScheduler, as one of the leaders of the scheduling platform, to grow more powerful!
