---
title:Technical Practice of Apache DolphinScheduler in Kubernetes System
keywords: Apache,DolphinScheduler,scheduler,big data,ETL,airflow,hadoop,orchestration,dataops,Kubernetes
description:Kubernetes is a cluster system based on container technology
---
# Technical Practice of Apache DolphinScheduler in Kubernetes System

<div align=center>
<img src="/img/2022-02-24/1.jpeg"/>
</div>

Author | Yang Dian, Data and Algorithm Platform Architect | Shenzhen Transportation Center 

Editor | warrior_

> Editor's note：

> Kubernetes is a cluster system based on container technology, implements container orchestration, provides microservices and buses, and involves a large number of knowledge systems.

> Starting from the author's actual work experience, this article shows us the use and technology sharing of DolphinScheduler in practice scenarios, hoping it can inspire those who have the same experience.

## Why do we use DolphinSchedule? What value does it bring to us? And what problems did we encounter?

Apache DolphinScheduler is an excellent distributed and easily scalable visual workflow task scheduling platform.

In the field I'm working in, the application of DolphinScheduler can quickly solve the top ten pain points of data development for enterprises:

- Multi-source data connection and access, most common data sources in the technical field can be accessed, and adding new data sources does not require too many changes;
- Diversified +specialized + massive data task management, which really revolves problems focusing on big data (Hadoop family, Flink, etc.) task scheduling, and is significantly different from traditional schedulers;
- Graphical task arrangement, super convenient user experience, competitive ability with commercial products, especially to most foreign open source products that cannot directly generate data tasks by dragging and dropping;
- Task details, rich viewing of tasks, log, and time-running axis display, which well meet developers' requirement of refined data tasks management, quickly locating slow SQL and performance bottlenecks;
- Support for a variety of distributed file systems, enrich users' choices for unstructured data;
- Native multi-tenant management to meet the data task management and isolation requirements of large organizations;
- Fully automatic distributed scheduling algorithm to balance all scheduling tasks;
- The native function of cluster monitoring, which can monitor CPU, memory, number of connections, Zookeeper status is suitable for one-stop operation and maintenance for SME;
- The native task alarm function, which minimizes the risk of task operation;
- The strong community-based operation, listening to the real voice of customers, constantly adding new functions, and continuously optimizing the customer experience.

I also encountered many new challenges in the projects launching various types of Apache DolphinScheduler:
- How to deploy Apache DolphinScheduler with less human resources, and can a fully automatic cluster installation and deployment mode be realized?
- How to standardize technical component implementation specifications?
- Can unmanned supervision and system self-healing be achieved?
- How to install and update the air-gap mode under the network security control?
- Can it automatically expand without disturbing?
- How to build and integrate the monitoring system?

To solve the above challenges, we repeatedly integrated Apache DolphinScheduler into the existing Kubernetes cloud-native system to tackle problems and make Apache DolphinScheduler technology more powerful.

## Kubernetes Technical System Bring New Technical Features to Apache DolphinScheduler


After using Kubernetes to manage Apache DolphinScheduler, the overall technical solutions are quickly enriched and efficient technical features added, by which the above practical challenges  tackled quickly:
- The development environment and production environment was rapidly established in various independent deployment projects, and all can be implemented by one-key deployment and one-key upgrade;
- Overall supports offline installation, and the installation speed is faster;
- Unify the installation configuration information as much as possible to reduce the abnormal configuration of multiple projects. All configuration items can be managed through the internal git of the enterprise based on different projects;
- Combine with object storage technology to unify unstructured data technology;
- The convenient monitoring system is integrated with the existing prometheus monitoring system;
- Mixed-use of multiple schedulers;
- Fully automatic resource scheduling capability;
- Fast self-healing ability, automatic abnormal restart, and restart mode based on probe mode.

The cases in this article are based on Apache DolphinScheduler version 1.3.9.

## Automated and Efficient Deployment Based on Helm tools

First, let's introduce the installation method based on the Helm provided by the official website. Helm is the best way to find, share and use software to build Kubernetes, which is one of the graduate projects of cloud-native CNCF.

<div align=center>
<img src="/img/2022-02-24/2.png"/>
</div>

There are very detailed configuration files and cases on Apache DolphinScheduler official website and GitHub. Here I‘ll highlight some of the FAQs in the community.

Official website document address
https://dolphinscheduler.apache.org/en-us/docs/1.3.9/user_doc/kubernetes-deployment.html

GitHub folder address
https://github.com/apache/dolphinscheduler/tree/1.3.9-release/docker/kubernetes/dolphinscheduler

Modify the image in the value.yaml file for offline installation (air-gap install);

```
image:
repository: "apache/dolphinscheduler"
tag: "1.3.9"
pullPolicy: "IfNotPresent"
```

Pull, tag, and push for harbors installed in the company or private warehouses of other public clouds. Here we assume that the private warehouse address is harbor.abc.com, the host where the image is built has been docker login harbor.abc.com, and the new apache project under the private warehouse has been established and authorized.

execute shell commands

```
docker pull apache/dolphinscheduler:1.3.9
dock tag apache/dolphinscheduler:1.3.9 
harbor.abc.com/apache/dolphinscheduler:1.3.9
docker push apache/dolphinscheduler:1.3.9
```


Then replace the image information in the value file. Here we recommend using the Always method to pull the image. In the production environment, try to check whether it is the latest image content every time to ensure the correctness of the software product. In addition, many coders are used to writing the tag as latest, and making the image without adding the tag information, which is very dangerous in the production environment. Because the image of the latest will be changed once anyone pushes the image and it is impossible to judge the version of the latest. So, it is recommended to be clear about the tags of each release, and use Always.

```
image:
repository: "harbor.abc.com/apache/dolphinscheduler"
tag: "1.3.9"
pullPolicy: "Always"
```

Copy the entire directory of https://github.com/apache/dolphinscheduler/tree/1.3.9-release/docker/kubernetes/dolphinscheduler to a host that can execute the Helm command, and then execute
```
kubectl create ns ds139
helm install dolphinscheduler . -n ds139 following the official website instruction to install offline.
```
to install offline.

- To integrate DataX, MySQL, Oracle client components, first download the following components:
https://repo1.maven.org/maven2/mysql/mysql-connector-java/5.1.49/mysql-connector-java-5.1.49.jar
https://repo1.maven.org/maven2/com/oracle/database/jdbc/ojdbc8/
https://github.com/alibaba/DataX/blob/master/userGuid.md Compile 

build and compile according to the prompt, and the file package is located in {DataX_source_code_home}/target/datax/datax/


Create a new dockerfile based on the above plugin components, and the image that has been pushed to the private warehouse can be applied to the basic image.

```
FROM harbor.abc.com/apache/dolphinscheduler:1.3.9
COPY *.jar /opt/dolphinscheduler/lib/
RUN mkdir -p /opt/soft/datax
COPY datax /opt/soft/datax
```

Save the dockerfile and execute the shell command


```
docker build -t harbor.abc.com/apache/dolphinscheduler:1.3.9-mysql-oracle-datax . #Don't forget the last point
docker push harbor.abc.com/apache/dolphinscheduler:1.3.9-mysql-oracle-datax
```

Modify the value file

```
image:
repository: "harbor.abc.com/apache/dolphinscheduler"
tag: "1.3.9-mysql-oracle-datax"
pullPolicy: "Always"
```

Execute helm install dolphinscheduler . -n ds139
or helm upgrade dolphinscheduler -n ds139, or  firstly helm uninstall dolphinscheduler -n ds139, and then execute helm install dolphinscheduler . -n ds139.

- Generally, it is recommended to use an independent external PostgreSQL as the management database in the production environment, and use the independently installed Zookeeper environment (I used the Zookeeper operator  https://github.com/pravega/zookeeper-operator in this case, which is scheduled in the same Kubernetes cluster as Apache DolphinScheduler ). We found that after using the external database, completely deleting  and redeploying the Apache DolphinScheduler in Kubernetes, the task data, tenant data, user data, etc. are retained, which once again verifies the high availability of the system and data integrity. (If the pvc is deleted, the historical job log will be lost)

```
## If not exists external database, by default, Dolphinscheduler's database will use it.
postgresql:
enabled: false
postgresqlUsername: "root"
postgresqlPassword: "root"
postgresqlDatabase: "dolphinscheduler"
persistence:
  enabled: false
  size: "20Gi"
  storageClass: "-"

## If exists external database, and set postgresql.enable value to false.
## external database will be used, otherwise Dolphinscheduler's database will be used.
externalDatabase:
type: "postgresql"
driver: "org.postgresql.Driver"
host: "192.168.1.100"
port: "5432"
username: "admin"
password: "password"
database: "dolphinscheduler"
params: "characterEncoding=utf8"
 
## If not exists external zookeeper, by default, Dolphinscheduler's zookeeper will use it.
zookeeper:
enabled: false
fourlwCommandsWhitelist: "srvr,ruok,wchs,cons"
persistence:
  enabled: false
  size: "20Gi"
  storageClass: "storage-nfs"
zookeeperRoot: "/dolphinscheduler"

## If exists external zookeeper, and set zookeeper.enable value to false.
## If zookeeper.enable is false, Dolphinscheduler's zookeeper will use it.
externalZookeeper:
zookeeperQuorum: "zookeeper-0.zookeeper-headless.zookeeper.svc.cluster.local:2181,zookeeper-1.zookeeper-headless.zookeeper.svc.cluster.local:2181,zookeeper-2.zookeeper-headless.zookeeper.svc.cluster.local:2181"
zookeeperRoot: "/dolphinscheduler"
```

## How to deploy GitOps based on Argo CD

Argo CD is a declarative GitOps continuous delivery tool based on Kubernetes. GitOps is an incubation project of CNCF and a best practice tool for GitOps. For more details of GitOps, please refer to https://about.gitlab.com/topics/gitops/

<div align=center>
<img src="/img/2022-02-24/3.png"/>
</div>

GitOps can bring the following advantages to the implementation of Apache DolphinScheduler.
- Graphical & one-click installation of clustered software;
- Git records the full release process, one-click rollback;
- Convenient DolphinScheduler tool log viewing.

Implementation installation steps using Argo CD:
- Download the Apache DolphinScheduler source code from GitHub, modify the value file, and refer to the content that needs to be modified in the helm installation in the previous chapter;
- Create a new git project in the modified source code directory, and push it to the company's internal GitLab. The directory name of the GitHub source code is docker/kubernetes/dolphinscheduler;
- Configure GitLab information in Argo CD, we use https mode here;

<div align=center>
<img src="/img/2022-02-24/4.png"/>
</div>

- Argo CD Create a new deployment project and fill in the relevant information

<div align=center>
<img src="/img/2022-02-24/5.png"/>
</div>

<div align=center>
<img src="/img/2022-02-24/6.png"/>
</div>

Refresh and pull the deployment information in git to complete the final deployment work. You can see that pod, configmap, secret, service, ingress and other resources are automatically pulled up, and Argo CD displays the commit information and submitter username used by git push before, which completely records all release event information. At the same time, you can also roll back to the historical version with one click.

<div align=center>
<img src="/img/2022-02-24/7.png"/>
</div>
<div align=center>
<img src="/img/2022-02-24/8.png"/>
</div>

- Relevant resource information can be seen through the kubectl command;
```
[root@tpk8s-master01 ~]# kubectl get po -n ds139
NAME READY STATUS RESTARTS AGE
dolphinscheduler-alert-96c74dc84-72cc9 1/1 Running 0 22m
dolphinscheduler-api-78db664b7b-gsltq 1/1 Running 0 22m
dolphinscheduler-master-0 1/1 Running 0 22m
dolphinscheduler-master-1 1/1 Running 0 22m
dolphinscheduler-master-2 1/1 Running 0 22m
dolphinscheduler-worker-0 1/1 Running 0 22m
dolphinscheduler-worker-1 1/1 Running 0 22m
dolphinscheduler-worker-2 1/1 Running 0 22m

[root@tpk8s-master01 ~]# kubectl get statefulset -n ds139
NAME READY AGE
dolphinscheduler-master 3/3 22m
dolphinscheduler-worker 3/3 22m

[root@tpk8s-master01 ~]# kubectl get cm -n ds139
NAME DATA AGE
dolphinscheduler-alert 15 23m
dolphinscheduler-api 1 23m
dolphinscheduler-common 29 23m
dolphinscheduler-master 10 23m
dolphinscheduler-worker 7 23m

[root@tpk8s-master01 ~]# kubectl get service -n ds139
NAME TYPE CLUSTER-IP EXTERNAL-IP PORT(S) AGE
dolphinscheduler-api ClusterIP 10.43.238.5 <none> 12345/TCP 23m
dolphinscheduler-master-headless ClusterIP None <none> 5678/TCP 23m
dolphinscheduler-worker-headless ClusterIP None <none> 1234/TCP,50051/TCP 23m

[root@tpk8s-master01 ~]# kubectl get ingress -n ds139
NAME CLASS HOSTS ADDRESS
dolphinscheduler <none> ds139.abc.com
```

- You can see that all pods are scattered on different hosts in the Kubernetes cluster, for example, workers 1 and 2 are on different nodes.

<div align=center>
<img src="/img/2022-02-24/9.png"/>
</div>
<div align=center>
<img src="/img/2022-02-24/10.png"/>
</div>

We have configured ingress, and the company can easily use the domain name for access by configuring the pan-domain name within the company;
<div align=center>
<img src="/img/2022-02-24/11.png"/>
</div>

You can log in to the domain name for access：

http:ds.139.abc.com/dolphinscheduler/ui/#/home


- The specific configuration can modify the content in the value file:
```
ingress:
enabled: true
host: "ds139.abc.com"
path: "/dolphinscheduler"
tls:
  enabled: false
  secretName: "dolphinscheduler-tls"

```
- It is convenient to view the internal logs of each component of Apache DolphinScheduler:

<div align=center>
<img src="/img/2022-02-24/13.png"/>
</div>

- Check the deployed system, 3 masters, 3 workers, and Zookeeper are all configured normally;

<div align=center>
<img src="/img/2022-02-24/14.png"/>
</div>
<div align=center>
<img src="/img/2022-02-24/15.png"/>
</div>

- Using Argo CD, it is very convenient to modify the number of replicas of components such as master, worker, api, alert, etc. Apache DolphinScheduler's helm configuration also reserves the setting information of CPU and memory. Here we modify the copy value in value. After modification, git push it to the company's internal GitLab.
```
master:
 
 ## PodManagementPolicy controls how pods are created during initial scale up, when replacing pods on nodes, or when scaling down.
podManagementPolicy: "Parallel"
 ## Replicas is the desired number of replicas of the given Template.
replicas: "5"
 
worker:
 ## PodManagementPolicy controls how pods are created during initial scale up, when replacing pods on nodes, or when scaling down.
podManagementPolicy: "Parallel"
 ## Replicas is the desired number of replicas of the given Template.
replicas: "5"
 
 
alert:
 ## Number of desired pods. This is a pointer to distinguish between explicit zero and not specified. Defaults to 1.
replicas: "3"
 
api:
 ## Number of desired pods. This is a pointer to distinguish between explicit zero and not specified. Defaults to 1.
replicas: "3"
```

- Just click sync on Argo CD to synchronize, and the corresponding pods will be added as required

<div align=center>
<img src="/img/2022-02-24/17.png"/>
</div>
<div align=center>
<img src="/img/2022-02-24/18.png"/>
</div>

```
[root@tpk8s-master01 ~]# kubectl get po -n ds139
NAME                  READY STATUS RESTARTS AGE
dolphinscheduler-alert-96c74dc84-72cc9 1/1  Running 0    43m
dolphinscheduler-alert-96c74dc84-j6zdh 1/1  Running 0    2m27s
dolphinscheduler-alert-96c74dc84-rn9wb 1/1  Running 0    2m27s
dolphinscheduler-api-78db664b7b-6j8rj 1/1  Running 0    2m27s
dolphinscheduler-api-78db664b7b-bsdgv 1/1  Running 0    2m27s
dolphinscheduler-api-78db664b7b-gsltq 1/1  Running 0    43m
dolphinscheduler-master-0       1/1  Running 0    43m
dolphinscheduler-master-1       1/1  Running 0    43m
dolphinscheduler-master-2       1/1  Running 0    43m
dolphinscheduler-master-3       1/1  Running 0    2m27s
dolphinscheduler-master-4       1/1  Running 0    2m27s
dolphinscheduler-worker-0       1/1  Running 0    43m
dolphinscheduler-worker-1       1/1  Running 0    43m
dolphinscheduler-worker-2       1/1  Running 0    43m
dolphinscheduler-worker-3       1/1  Running 0    2m27s
dolphinscheduler-worker-4       1/1  Running 0    2m27s

```

## Apache DolphinScheduler integrates with S3 Object Storage Technology

How to configure the integration of s3 minio is one of the FAQs in the community. Here is the method of helm configuration based on Kubernetes.

- Modify the s3 part of value, it is recommended to use ip+port to point to the minio server.
```
common:
 ##Configmap
configmap:
  DOLPHINSCHEDULER_OPTS: ""
  DATA_BASEDIR_PATH: "/tmp/dolphinscheduler"
  RESOURCE_STORAGE_TYPE: "S3"
  RESOURCE_UPLOAD_PATH: "/dolphinscheduler"
  FS_DEFAULT_FS: "s3a://dfs"
  FS_S3A_ENDPOINT: "http://192.168.1.100:9000"
  FS_S3A_ACCESS_KEY: "admin"
  FS_S3A_SECRET_KEY: "password"
```

- The name of the bucket that stores dolphin files in minio is dolphinscheduler. I create new folders and files for testing here. The directory of the minio is under the tenant of the upload operation.

<div align=center>
<img src="/img/2022-02-24/19.png"/>
</div>

## Apache DolphinScheduler Integrates with Kube-Prometheus Technology



- We use the Kube-prometheus operator technology in Kubernetes to automatically monitor the resources of each component of  Apache DolphinScheduler after deploying.

- Please pay attention to that the version of kube-prometheus needs to correspond to the major version of Kubernetes. https://github.com/prometheus-operator/kube-prometheus

<div align=center>
<img src="/img/2022-02-24/20.png"/>
</div>
<div align=center>
<img src="/img/2022-02-24/21.png"/>
</div>
<div align=center>
<img src="/img/2022-02-24/22.png"/>
</div>

## Technical Integration of Apache DolphinScheduler and Service Mesh

-  Through the service mesh technology, the observability analysis of API external service calls and internal calls of Apache DolphinScheduler can be realized to optimize the Apache DolphinScheduler product services.

We use linkerd as a service mesh product for integration, which is also one of CNCF's excellent graduate projects.

<div align=center>
<img src="/img/2022-02-24/23.png"/>
</div>

Just modify the annotations in the value file of the Apache  DolphinScheduler helm and redeploy, you can quickly inject the mesh proxy sidecar, as well as master, worker, API, alert and other components.

```
annotations: #{}
   linkerd.io/inject: enabled
```
You can observe the quality of service communication between components, the number of requests per second, etc.

<div align=center>
<img src="/img/2022-02-24/24.png"/>
</div>
<div align=center>
<img src="/img/2022-02-24/25.png"/>
</div>

## Prospects on Apache DolphinScheduler Based on cloud-native Technology

As a new-generation Cloud-Native big data tool, Apache DolphinScheduler is expected to integrate more excellent tools and features in the Kubernetes ecosystem in the future to meet more requirements of diversified user groups and scenarios.

- Integration with Argo-workflow, users can call Argo-workflow single job, dag job, and periodic job in Apache DolphinScheduler through api, cli, etc.;
- Use HPA to automatically expand and shrink workers to achieve unattended horizontal expansion;
- Integrate the Spark operator and Flink operator tools of Kubernetes to achieve comprehensive cloud-native;
- Implement multi-cloud and multi-cluster distributed job scheduling, and strengthen the architectural attributes of serverless+faas classes;
- Use sidecar to periodically delete worker job logs to realize carefree operation and maintenance;

Finally, I strongly recommend you to use Slack to communicate with the Apache DolphinScheduler community, which is officially recommended！

<div align=center>
<img src="/img/2022-02-24/26.png"/>
</div>