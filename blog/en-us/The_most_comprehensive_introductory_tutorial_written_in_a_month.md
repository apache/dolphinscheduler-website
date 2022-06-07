---
title:# Community Star Series | 1 Don’t know how to use Apache DolphinScheduler? A community talent writes the usage tutorial of it in one month!
keywords: Apache,DolphinScheduler,scheduler,big data,ETL,airflow,hadoop,orchestration,dataops,Meetup
description: Apache DolphinScheduler (hereinafter referred to as DS) is a distributed and easily scalable visual DAG workflow task scheduling system
---
# Community Star Series | 1 Don’t know how to use Apache DolphinScheduler? A community talent writes the usage tutorial of it in one month!

<div align=center>
<img src="/img/2022-05-23/en/1.png"/>
</div>

Author | Ouyang Tao, Big Data Development Engineer

Apache DolphinScheduler (hereinafter referred to as DS) is a distributed and easily scalable visual DAG workflow task scheduling system, dedicated to solving the intricate dependencies in the data processing, thus making it be used out of the box in the data processing. The top open source project, similar to other open-source projects, runs and installs from a script.

The scripts are all located in the script folder in the root directory and are executed in the following order:

- Check the start script start-all.sh, you can find the start of the four most important startup services, respectively dolphinscheduler-daemon.sh start master-server/worker-server/alert-server/api-server
- The dolphinscheduler-daemon.sh script will first execute the dolphinscheduler-env.sh script, which serves to introduce the environment, including the Hadoop, Spark, Flink, Hive environments, etc. As DS needs to schedule these tasks, if these environments are not introduced, the execution will not succeed even if the scheduling is completed.
- Immediately afterward, the dolphinscheduler-daemon.sh script loops through bin/start.sh under the four modules mentioned above, as shown in the following image.


<div align=center>
<img src="/img/2022-05-23/en/2.png"/>
</div>

As shown in the picture below: the execution of dolphinscheduler-daemon.sh start master-server will go to the master module’s src/main/bin and execute start.sh. After opening start.sh, you can find that a MasterServer is started. And the other Worker, Alert and API modules are started as the same.


<div align=center>
<img src="/img/2022-05-23/en/3.png"/>
</div>


This is the end of the scripting process, and we will now describe the main purpose of the four modules: Master is responsible for DAG task slicing, task submission monitoring, and listening to the health status of other Masters and Workers; Worker is responsible for task execution; Alert aims to the alert service; API works for the business logic of DS, i.e. project management, resource management, security management, etc. as seen on the web.

If you are familiar with other big data projects, such as Flink, Hdfs, Hbase, etc., you will find that these architectures are similar, such as hdfs is architected as the NameNode and WorkNode; Hbase is architected as the HMasterServer and HRegionServer; Flink adopts the architecture as JobManager and TaskManager, etc., if you can master these frameworks, I think the mastery of DS will be easier.

Master and Worker are started through SpringBoot, and the objects created are also hosted by Spring, if you use Spring regularly, I think you will understand DS much easier than other open-source projects.

## **Notes**：

- There is a python-gateway-server module in the run script, which is written in python code workflow and is not in the scope of this article, so I ignore it this time, if you understand this module in detail, you’d better turn to the community.

- Start Alert script executes the Alert module under the alert-server script, because Alert is also a parent module, I do not intend to talk about alert-server much here. I believe that after going through the implementation process of Master and Worker, Alert module should not be difficult to understand.

- In addition, if you know about DS for the first time, you will find an alert-api in the Alert module, I want to specify that this alert-api and the aforementioned api-server are totally unrelated, api-server is the ApiApplicationServer script to start the api module, and responsible for the server logic of the entire DS. The api-server is the ApiApplicationServer script that starts the api module and is work for the business logic of the whole DS, while alert-api is the plug-in interface of the spi that is responsible for alerting, and you can open the alert-api module to find that the code inside is all interfaces and definitions and does not deal with any logic. Similarly, the task-api and alert-api under the task module just have the same responsibilities, but deal with different functions.

- DS is all managed by SpringBoot, so if you have never worked with SpringBoot or Spring, you can refer to the following URLs and other relevant information on the web. https://spring.io/quickstart


Know more about the warning module, please refer to the link below or consult other community members.

https://dolphinscheduler.apache.org/zh-cn/blog/Hangzhou_cisco.html

The official website of the Apache DolphinScheduler project can be found at: https://github.com/apache/dolphinscheduler

In the next chapter, I will introduce the two most important modules of DS, Master, and Worker, and how they communicate with each other, stay tuned!
