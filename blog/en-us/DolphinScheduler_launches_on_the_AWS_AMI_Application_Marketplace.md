---
title: DolphinScheduler launches on the AWS AMI Application Marketplace
keywords: Apache,DolphinScheduler,scheduler,big data,ETL,airflow,hadoop,orchestration,dataops,Kubernetes
description: Apache DolphinScheduler has officially launched on the AWS EC2 AMI application marketplace
---
# DolphinScheduler launches on the AWS AMI Application Marketplace

![](/blog/img/media/16714207955368/16714208087579.jpg)
# Introduction

Apache DolphinScheduler has officially launched on the AWS EC2 AMI application marketplace, which means that if you want to use or experience DolphinScheduler in AWS, you can directly use this EC2 AMI to start the DolphinScheduler service. When started, your EC2 instance will start a DolphinScheduler standalone service, which is a complete DolphinScheduler component and can perform various tasks of DolphinScheduler.

It should be noted that standalone is not used in the production environment, because all its services are in one process, the metadata is stored in memory by default, and the data will no longer exist when the service is terminated. But it is still very useful because we can quickly start a service for experience verification. If you want to start a DolphinScheduler cluster, you can refer to the Launch Cluster chapter of this article. For more AMI-related information, please check https://aws.amazon.com/marketplace/pp/prodview-cbwnzxolq46yo

# Why launch in AWS?

Amazon Web Services (AWS) is the world’s most comprehensive and broadly adopted cloud platform, offering over 200 fully featured services from data centers globally. Millions of customers — including the fastest-growing startups, largest enterprises, and leading government agencies — are using AWS to lower costs, become more agile, and innovate faster.

# What’s EC2?

Amazon Elastic Compute Cloud (Amazon EC2) provides scalable computing capacity in the Amazon Web Services (AWS) Cloud. Using Amazon EC2 eliminates your need to invest in hardware up-front, so you can develop and deploy applications faster. You can use Amazon EC2 to launch as many or as few virtual servers as you need, configure security and networking, and manage storage. Amazon EC2 enables you to scale up or down to handle changes in requirements or spikes in popularity, reducing your need to forecast traffic. Users can choose services that suit their needs on EC2, and can choose task capacity, CPU, and memory models. Before launching EC2 instance, users can choose different operating systems, such as Windows, Linux, and Mac, which are called Amazon Machine Images (AMI) in EC2.

# What’s EC2 AMI?
As mentioned above, when starting an EC2 instance, you can specify a mirror, which is Amazon Machine Image (AMI). An Amazon Machine Image (AMI) is a supported and maintained image provided by AWS that provides the information required to launch an instance. You must specify an AMI when you launch an instance. You can launch multiple instances from a single AMI when you require multiple instances with the same configuration. You can use different AMIs to launch instances when you require instances with different configurations. An AMI includes the following:

* One or more Amazon Elastic Block Store (Amazon EBS) snapshots, or, for instance-store-backed AMIs, a template for the root volume of the instance (for example, an operating system, an application server, and applications).
* Launch permissions that control which AWS accounts can use the AMI to launch instances.
* A block device mapping specifies the volumes to attach to the instance when it’s launched.

The AMIs officially provided by AWS are all basic images, which generally only contain operating systems, such as Windows, Linux, and Mac. Another powerful function of AMI is that it allows users to customize AMI based on the base image, which means that users can install any software in the running EC2 instance, and finally take a snapshot of the instance content to define an AMI.

# Usage
## Launch Single Instance

The way to launch EC2 instance through DolphinScheduler AMI is very simple, just click the launch instance on the EC2 page, then click browse more AMIs, and enter DolphinScheduler in the input box. Then select AMI and fill in the instance type, key pair, network, and click launch instance to start the instance.

![launch instance](/blog/img/media/16714207955368/16714208965363.jpg)

![Browse more AMIs](/blog/img/media/16714207955368/16714209112764.jpg)

![Search for dolphinscheduler](/blog/img/media/16714207955368/16714209218058.jpg)

![Launch instance based on DolphinScheduler AMI](/blog/img/media/16714207955368/16714209322012.jpg)

It takes some time to start the instance. We can check the network configuration at this time. We need to make sure that ports 12345 and 22 are enabled, which are the port of the DolphinScheduler service and the ssh port.

![](/blog/img/media/16714207955368/16714209468073.jpg)

3–5 minutes later, you can access the DolphinScheduler service through the public DNS or public IPv4 of the EC2 instance plus port 12345. The username and password to log in to the DolphinScheduler service are user and the current EC2 instance id respectively.

Note: The password of DolphinScheduler is dynamic, and it will be automatic change after EC2 instance launch to keep your service safe. And you can find it in your EC2 console home. See the AMI container product for more detail about AWS requests for AMI providers.
## Launch Cluster
https://github.com/WhaleOps/packer_tmpl/blob/main/aws/ami/dolphinscheduler/README.md#cluster-server

The above tutorial tells us how to start a single instance, so what should we do if we want to start a DolphinScheduler cluster?

## Add New Key Pairs for Cluster

In the next step we will use ssh connect to existing EC2 instances, and currently our cluster.sh script only supports one single key pair. So we need to create a new one and then use it when launching instances. Go to EC2 -> Network & Security -> Key Pairs -> Create Key Pair. Keep it carefully, otherwise, you can not log in to your instance.
## Add a New Security Group for Cluster
Go to EC2 -> Network & Security -> Security Groups -> Create Security Group to create a new security group, you should add the following points to Inbound rules for this security group:

* 22: default ssh point
* 2181: Zookeeper connect point
* 5432: PostgreSQL connect point
* 1234: Dolphin Scheduler’s MasterServer point
* 5678: DolphinScheduler’s WorkerServer point
* 12345: DolphinScheduler’s web UI point

![](/blog/img/media/16714207955368/16714210083690.jpg)


## Launch Multiple EC2 Instances

Currently, you have to build this AMI by yourself and then launch a new EC2 instance from EC2 -> Images -> AMIs sidebar path, select the AMI you built, and then click Launch instance from AMI bottom, In EC2 -> Instances -> Launch an instance page, you should choose the existing key pair which you created in new key pair for cluster section, it can be found in Key pair -> Select key pair. Also, you should choose the existing security group which you created in the new security group for the cluster section, it can be found in Network settings -> Select existing security group -> Select security group. At last, launch multiple instances based on your cluster number(in this tutorial we use 8 instances to create a cluster), from the Number of instances input box in the Summary plane.

## Get cluster.sh and cluster_env.sh Script
If you already clone this project, you should go to the directory packer_tmpl/aws/ami/dolphinscheduler/bin, and you can see two scripts named cluster.sh and cluster_env.sh. And if you do not clone this repository from GitHub, you can get those two scripts by the following command

```
wget https://raw.githubusercontent.com/WhaleOps/pa
cker_tmpl/main/aws/ami/dolphinscheduler/bin/cluster.sh
wget https://raw.githubusercontent.com/WhaleOps/packer_tmpl/main/aws/ami/dolphinscheduler/bin/cluster_env.sh
```
> NOTE: If your network can not connect to GitHub, the above command will fail with an error log like connecting to raw.githubusercontent.com (raw.githubusercontent.com)|0.0.0.0|:443… failed: Connection refused. You should find out a method to make your network can connect to host raw.githubusercontent.com or download these two scripts from the GitHub website.

## Modify cluster_env.sh Script
You have to modify your cluster_env.sh script, which includes your key pair and EC2 instance's IPv4 address or IPv4 DNS. For example, we launch 8 EC2 instances, and we want to deploy two master-server, 3 worker-server, an API -server, an alert server, one database, and a zookeeper server, and each instance IPv4 address as below:

* 192.168.1.1: master-server
* 192.168.1.2: master-server
* 192.168.1.3: worker-server
* 192.168.1.4: worker-server
* 192.168.1.5: worker-server
* 192.168.1.6: API-server
* 192.168.1.7: alert-server
* 192.168.1.8: metadata database (PostgreSQL), zookeeper

We should tell our deploy plan to cluster_env.sh otherwise it will never know how to deploy it(here we only show some necessary changed content without comment)

```
export ips="192.168.1.1,192.168.1.2,192.168.1.3,192.168.1.4,192.168.1.5,192.168.1.6,192.168.1.7,192.168.1.8"

```
```
export masters="192.168.1.1,192.168.1.2"
export workers="192.168.1.3:default,192.168.1.4:default,192.168.1.5:default"
export alertServer="192.168.1.6"
export apiServers="192.168.1.7"
export DATABASE_SERVER="192.168.1.8"
export REGISTRY_SERVER="192.168.1.8"
```
Should also add your key pair location which you create in new key pair for the cluster, an absolute path is encouraged to use(here we only show some necessary changed content without comment)

```
# Do not change this if you use this AMI to launch your instance
export INSTANCE_USER=${INSTANCE_USER:-"ubuntu"}
# You have to change to your key pair path
export INSTANCE_KEY_PAIR="/change/to/your/personal/to/key/pair"
```

## Execute cluster.sh Script
After modifying cluster_env.sh you can execute the script by command

`
./cluster.sh start
`
The time it takes depends on your network speed, and after it finishes, your EC2 instances will be combined into a DolphinScheduler cluster.

## What Should I do After Execute cluster.sh
After that, you can log in DolphinScheduler service with user/EC2_DYNAMIC_INSTANCE_ID as the default username/password via instance’s [API-SERVER-Public-IPv4-address]:12345/dolphinscheduler/ui or [API-SERVER-Public-IPv4-DNS]:12345 /dolphinscheduler/ui. For about how to use DolphinScheduler you view the detail in the functions of DolphinScheduler.

## Contributing
We build AMI through the packer and make it completely open source. We welcome anyone interested in the project to view and contribute. DolphinScheduler AMI source code can be viewed at ami-dolphinscheduler[https://github.com/WhaleOps/packer_tmpl/blob/main/aws/ami/dolphinscheduler/README.md]. For how to contribute code, you can learn how to contribute[https://github.com/WhaleOps/packer_tmpl/blob/main/aws/ami/dolphinscheduler/README.md#contributing].

## Recap

* Briefly introduce what AWS, EC2, and EC2 AMI are, and how to create an EC2 instance through AMI;
* Introduces how to use DolphinScheduler AMI, how to start a single instance and form a cluster;
* Emphasize again that standalone is only for testing and experience
* How to contribute if you are interested in the project