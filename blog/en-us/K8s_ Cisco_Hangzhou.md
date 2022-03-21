---
title:Fully Embracing K8s, Cisco Hangzhou Seeks to Support K8s Tasks Based on ApacheDolphinScheduler
keywords: Apache,DolphinScheduler,scheduler,big data,ETL,airflow,hadoop,orchestration,dataops,K8s
description: K8s is the future of the cloud and is the only infrastructure platform that
---
# Fully Embracing K8s, Cisco Hangzhou Seeks to Support K8s Tasks Based on ApacheDolphinScheduler

<div align=center>

<img src="/img/2022-03-21/1.png"/>

</div>

K8s is the future of the cloud and is the only infrastructure platform that connects public and private clouds, making it the choice of more enterprises to modernize their IT.

 

Based on Apache DolphinScheduler, Cisco Hangzhou is also exploring K8s support, and some of the features are already running successfully. Recently, Qian Li, a big data engineer from Cisco Hangzhou, will share their results with us.

<div align=center>

<img src="/img/2022-03-21/2.png"/>

</div>


Qian Li

 

Big Data Engineer from Cisco Hangzhou, with years of experience in Big Data solutions, Spark, Flink, scheduling system, ETL, and other projects.

 

My presentation will be related to these parts: Namespace management, K8s tasks running continuously, workflow scheduling of K8s tasks, and our future planning. 

## 01 Namespace Management

### Resource Management

 

In the first part, I will first introduce resource management. The purpose of introducing resource management is to use K8s clusters to run tasks that are not part of the Apache DolphinScheduler concept of scheduling, such as Namespace, which are more akin to a data solution that limits resources in a queue if the CPU has limited memory, and enabling some resource isolation.

 

In the future, we may merge some of the resource management functionality onto Apache DolphinScheduler.

### Adding, deleting, and maintaining management

We can add some Type, i.e. the type of tag, e.g. some Namespace only allows certain types of jobs to be run. We can count the number of jobs under the Namespace, the number of pods, the number of resources requested, requests, etc. to see the resource usage of the queue, and the interface is only available to the administrator by default.

<div align=center>

<img src="/img/2022-03-21/3.png"/>

</div>

### Multiple K8s clusters

K8s supports multiple clusters, we can connect to multiple K8s clusters via the Apache DolphinScheduler client, batch, PROD, etc to build multiple sets of  K8s clusters and support multiple K8s clusters via Namespace.

 

We can edit the developed clusters and modify all the properties such as memory.

 

In the new version, user permissions are set in user master, authorizing a user to submit tasks to a Namespace and edit resources.

## 02 K8s tasks running continuously

The second section is about the types of tasks we currently support.

### Mirrors that are started without exiting, such as ETL

ETL, for example, is a task that must be done manually before it will exit after being committed. Once a task like this is committed, it sinks the data and theoretically never stops as long as no upgrades.

<div align=center>

<img src="/img/2022-03-21/4.png"/>

</div>

This kind of task may not actually be used for scheduling, as it only has two states, start and stop. So we put it in a live list and made a set of monitors. The POD runs in real-time, interacting mainly through a Fabris operator, and can be dynamically scaled to improve resource utilization.

### Flink tasks

We can manage the CPU down to 0.01%, making full use of the K8s virtual CPU.

<div align=center>

<img src="/img/2022-03-21/5.png"/>

</div>

<div align=center>

<img src="/img/2022-03-21/6.png"/>

</div>

<div align=center>

<img src="/img/2022-03-21/7.png"/>

</div>

We also use Flink Tasks, an ETL-based extension that includes an interface for editing, viewing status, going online, going offline, deleting, execution history, and monitoring. We designed the Flink UI using a proxy model and developed permission controls to prevent external parties from modifying it.

Flink starts by default based on a checkpoint, or can be created at a specified time, or submitted and started based on the last checkpoint.

Flink tasks support multiple mirror versions, as K8s is inherently mirror-running, you can specify mirrors directly to choose a package, or via the file to submit the task.

Also, Batch type tasks may be run once and finished or may be scheduled on a cycle basis and exit automatically after execution, which is not quite the same as Flink, so for this type of task, we would deal it based on Apache DolphinScheduler.

## 03 Running K8s tasks

### Workflow scheduling for K8s tasks

We added some Flink batch and Spark batch tasks at the bottom and added some configurations such as the resources used, the namespace to be run, and so on. The image information can be started with some custom parameters, and when wrapped up it is equivalent to the plugin model, which is perfectly extended by Apache DolphinScheduler.

<div align=center>

<img src="/img/2022-03-21/8.png"/>

</div>

### Spark Tasks

Under Spark tasks, you can view information such as CPU, files upload supports Spark Jar packages, or can be configured separately.

<div align=center>

<img src="/img/2022-03-21/9.png"/>

</div>

This multi-threaded upper layer can dramatically increase processing speed.

## 04 Others and Delineation

### Watch Status

<div align=center>

<img src="/img/2022-03-21/10.jpeg"/>

</div>

In addition to the above changes, we have also optimized the task run state.

 

When a task is submitted, the runtime may fail and even the parallelism of the task may change based on certain policies in the real run state. In this case, we need to watch and fetch the task status in real-time and synchronize it with the Apache DolphinScheduler system to ensure that the status seen in the interface is always accurate.

 

For batch, we can treat it with or without the watch, as it is not a standalone task that requires fully watch and the namespace resource usage is based on watch mode so that the state is always accurate.

### Multiple environments

Multi-environment means that the same task can be pushed to different K8s clusters, such as a Flink task.

 

In terms of code, there are two ways to do watch, one is to put some pods separately, for example when using the K8s module, define information about multiple K8s clusters, create some watch pods on each cluster to watch the status of tasks in the cluster and do some proxy functions. Another option is to follow the API or a separate service and start a watch service to track all K8s clusters. However, this does not allow you to do proxying outside of the K8s internal and external networks.

 

There are several options to watch Batch, one of them is by synchronization based on Apache DolphinScheduler, which is more compatible with the latter. We may submit a PR on this work in the future soon. Spark uses the same model, providing a number of pods to interact with, and the internal code we use is the Fabric K8s client.

 

Going forward, we will be working with Apache DolphinScheduler to support the features discussed here and share more information about our progress. Thank you all!

