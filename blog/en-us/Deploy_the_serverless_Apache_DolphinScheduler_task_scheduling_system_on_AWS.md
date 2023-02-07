# Deploy the serverless Apache DolphinScheduler task scheduling system on AWS


## Background

In the scenarios of data warehouse ETL, offline and real-time computing, the dependency scheduling relationship of data tasks is getting more and more complex. The AWS platform provides tools with certain scheduling and task orchestration abilities, such as Apache Airflow (MWAA) and Step function, Glue Workflow, etc. But they all lack the support of visually integrated management operations. 

Apache DolphinScheduler **aims to solve complex big data task dependencies,** and provide applications with data and relationships in various OPS orchestrations, as well as solve the problem that data R&D ETL dependencies are too intricate to monitor the health status of tasks.

To introduce Apache DolphinScheduler, while **considering the robustness of production and ease of maintenance**, this article provides a deployment plan using a completely serverless EKS on Fargate container service and Aurora Serverless PostgreSQL database on the AWS platform and gives detailed deployment steps and maintenance guide.

### Introduction to DolphinScheduler
Apache DolphinScheduler is a distributed and scalable open-source workflow coordination platform with a powerful DAG visualization interface. It assembles tasks in a DAG (Directed Acyclic Graph, DAG) streaming manner, which can monitor the execution status of tasks on time, and supports operations such as retry, specified node recovery failure, suspension, recovery, and termination of tasks.

The DolphinScheduler architecture mainly includes MasterServer, WorkerServer, AlertServer, ApiServer, ZooKeeper, and UI. Among them, MasterServer and WorkerServer adopt the distributed and non-central design concept to be responsible for task segmentation, task submission monitoring, task execution, and log service respectively. AlertServer is mainly responsible for processing requests from the front-end UI layer. The service uniformly provides RESTful API to provide external request services. AlertServer provides alerting services. Both MasterServer and WorkerServer nodes in the system use ZooKeeper for cluster management and fault tolerance. The architecture design diagram is as follows:
picture

### Introduction to AWS serverless container EKS on Fargate
AWS Fargate is a technology that provides containers with the right-sized computing capacity on demand. With AWS Fargate, users no longer have to provision, configure, or scale groups of virtual machines themselves to run containers. There is also no need to choose server types, determine when to scale out node groups, and optimize cluster packaging. Users can control which pods are launched on Fargate and how they run using Fargate configuration files. A Fargate profile is defined as part of an Amazon EKS cluster.

Amazon EKS integrates Kubernetes with AWS Fargate using a controller built by AWS that uses the upstream scalability model provided by Kubernetes. These controllers run as part of the Amazon EKS-managed Kubernetes control plane and are responsible for scheduling native Kubernetes pods onto Fargate. Fargate controllers include a new scheduler that runs alongside the default Kubernetes scheduler, in addition to several transformation and validation admission controllers. When you launch pods that meet the conditions to run on Fargate, the Fargate controller running in the cluster identifies, updates, and schedules the pods onto Fargate.
### Introduction to AWS Serverless Database Aurora Serverless
Amazon Aurora Serverless is an on-demand, auto-scaling configuration of Amazon Aurora. Amazon Aurora Serverless automatically starts up, shuts down, and scales capacity up or down based on the needs of your application. Users can run databases on AWS without having to manage database capacity. With Aurora Serverless, users create a database, specify the desired range of database capacity, and connect to applications. You pay only for the database capacity you use per second while the database is active, and you can migrate between standard and serverless configurations in just a few steps in the Amazon Relational Database Service (Amazon RDS) console.
## Deployment instructions

### Overall deployment architecture
picture
1. The EKS cluster is located in two availability zones, deployed in a private subnet, and uses the ECR image warehouse to manage the DolphinScheduler image;
2. EKS uses Fargate nodes, persistently stored on EFS, resource storage uses S3 object storage service, and Aurora Serverless pgsql is used to provide metadata database;
3. The DolphinScheduler API, worker, and master nodes are scaled up and down through the springboard machine kubectl command;
4. Use aws load balancer controller to deploy internet-facing load balancing, and proxy api ui provides external access.

### Preparations
* Network planning, taking us-east-1 as an example, create a vpc network: 10.9.0.0/16, where the public network segment is in two AZs, 10.9.1.0/24 and 10.9.2.0/24, Pod network Segment 10.9.10.0/24 and 10.9.11.0/24, Node network segment 10.9.20.0/24 and 10.9.21.0/24, the service network segment is generated by the EKS cluster as a virtual network segment, not in the VPC subnet. Create an Internet gateway in the VPC, create a NAT gateway in the public subnet, and create a springboard server for command line management. Add a routing table, the public subnet is associated with the Internet gateway, and other subnets access Internet services through the NAT gateway by default.
* EKS cluster creation
* Conveniently, use the AWS console to create an EKS cluster, associate the above VPC and subnet (reference: https://docs.aws.amazon.com/zh_cn/eks/latest/userguide/create-cluster.html), and create a cluster on the springboard Configure communication with the cluster in. We use EKS version 1.24 here.
* Database and Storage Services
* Also use the AWS console to create a serverless Aurora PostgreSQL database cluster in the VPC private subnet (reference: https://docs.aws.amazon.com/zh_cn/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2.create-cluster. html). We use aurora-postgresql version 14.4 here.

picture
* Build DolphinScheduler custom image
To customize based on the official open source image, use AWS ECR for image management, create DolphinScheduler image ECR warehouse respectively, and push the official image to it (reference: https://docs.aws.amazon.com/zh_cn/AmazonECR/latest/ userguide/docker-push-ecr-image.html). We use DolphinScheduler 3.1.2 version here.

picture

### Install AWS load balancer controller
1. Associate the OIDB identity provider with the EKS cluster. Amazon EKS supports the use of OpenID Connect (OIDC) identity providers as a method of authenticating users to your cluster. An EKS cluster has an (OIDC) issuer URL associated with it. To use AWS Identity and Access Management (IAM) roles with service accounts, an IAM OIDC provider must exist for the cluster. Create an OIDC provider for the cluster using eksctl or the AWS Management Console. (Reference: https://docs.aws.amazon.com/zh_cn/eks/latest/userguide/enable-iam-roles-for-service-accounts.html)
2. Follow the official documentation steps to create an IAM role, create a Kubernetes service account named aws-load-balancer-controller in the kube-system namespace of AWS Load Balancer Controller, and annotate the Kubernetes service account with the name of the IAM role. Install the AWS Load Balancer Controller using helm. (Reference: https://docs.aws.amazon.com/zh_cn/eks/latest/userguide/aws-load-balancer-controller.html)

### Use Helm to deploy Dolphinscheduler
1. Download the source package apache-dolphinscheduler--src.tar.gz version 3.1.2 (https://dolphinscheduler.apache.org/zh-cn/download/3.1.2). Unzip it on the jump server.
```
$ tar -zxvf apache-dolphinscheduler-<version>-src.tar.gz
$ cd apache-dolphinscheduler-<version>-
src/deploy/kubernetes/dolphinscheduler
```

2. Modify the configuration file values.yaml
```
##Modify the mirror warehouse address to AWS ecr
image:
   registry: "xxxxxx.dkr.ecr.us-east-1.amazonaws.com" -- ECR mirror address
   tag: "3.1.2"
## Use an external data source
postgresql:
   enabled: false
mysql:
   enabled: false
externalDatabase:
   type: "postgresql"
   host: "dolphinscheduler.cluster-xxxxx.us-east-1.rds.amazonaws.com"
   port: "5432"
   username: "postgres"
   password: "xxxxxxxx"
   database: "dolphinscheduler"
   params: "characterEncoding=utf8"
  ## Use S3 to store resource files
conf:
   common:
     resource.storage.type: S3
     resource.aws.access.key.id: xxxxxxx
     resource.aws.secret.access.key: xxxxxxxxx
     resource.aws.region: us-east-1
     resource.aws.s3.bucket.name: dolphinscheduler-resourse
     resource.aws.s3.endpoint: https://S3.us-east-1.amazonaws.com

```
3. Set resource requirements for alert, api, worker, and 
```
master services:
master:
   resources:
     limits:
       memory: "8Gi"
       cpu: "4"
     requests:
       memory: "2Gi"
       cpu: "500m"
worker:
   resources:
     limits:
       memory: "8Gi"
       cpu: "4"
     requests:
       memory: "2Gi"
       cpu: "500m"
api:
   ...
alert:
   ...
```
4. Create namespace dolphinscheduler
```
$ kubectl create namespace dolphinscheduler

```
5. Create a fargate configuration file, respectively define the Fargate configuration file associated with the namespace dolphinscheduler and kube-system to specify which pods use Fargate at startup, and then schedule pods on Fargate in the cluster. (Reference: https://docs.aws.amazon.com/zh_cn/eks/latest/userguide/fargate-profile.html)
6. Publish dolphinscheduler to the namespace of dolphinscheduler
```
$ cd apache-dolphinscheduler-<version>-src/deploy/kubernetes/dolphinscheduler
$ helm repo add bitnami https://charts.bitnami.com/bitnami
$ helm dependency update .
$ helm install dolphinscheduler . --set image.tag=3.1.2 -n dolphinscheduler --set region=us-east-1 --set vpcId=vpc-xxx
```
7. Create a network load balancer to provide external access uri
```
$ echo "
apiVersion: v1
kind: Service
metadata:
   namespace: dolphinscheduler
   name: service-dolphinscheduler
   annotations:
     service.beta.kubernetes.io/aws-load-balancer-type: external
     service.beta.kubernetes.io/aws-load-balancer-nlb-target-type: ip
     service.beta.kubernetes.io/aws-load-balancer-scheme: internet-facing
     service.beta.kubernetes.io/subnets: subnet-xxx, subnet-xxx
spec:
   ports:
     - port: 12345
       targetPort: 12345
       protocol: TCP
   type: LoadBalancer
   selector:
     app.kubernetes.io/name: dolphinscheduler-api
" | kubectl apply -f -
```
Get load balancing dns service address
```
$ kubectl get service service-dolphinscheduler -n dolphinscheduler
NAME TYPE CLUSTER-IP EXTERNAL-IP PORT(S) AGE
sample-service LoadBalancer 10.9.240.137 k8s-nlbsampl-nlbsampl-xxxxxxxxxx-xxxxxxxxxxxxxxxxx.elb.region-code.amazonaws.com 12345:32400/TCP 16h

```
Visit dolphinscheduler address: http://k8s-nlbsampl-nlbsampl-xxxxxxxxxx-xxxxxxxxxxxxxxxxx.elb.region-code.amazonaws.com:12345/dolphinscheduler/ui
picture
picture
### Connect to Amazon Athena data source test
1. Install the Athena JDBC driver to the API server and worker server, create a DockerFile to rebuild the image, and push it to the ECR warehouse.
```
##Example worker image DokcerFile
FROM dolphinscheduler.docker.scarf.sh/apache/dolphinscheduler-worker:3.1.2
RUN apt-get update && \
     apt-get install -y --no-install-recommends python3 && \
     apt-get install -y --no-install-recommends python3-pip && \
     rm -rf /var/lib/apt/lists/*
RUN cd /opt/dolphinscheduler/libs/ && \
     wget https://s3.cn-north-1.amazonaws.com.cn/athena-downloads-cn/drivers/JDBC/SimbaAthenaJDBC-2.0.31.1000/AthenaJDBC42.jar
```
2. Update dolphinscheduler
```
helm upgrade dolphinscheduler

```
3. Create Athena connection and test
picture
4. Execute the workflow to view the log
picture
## FAQ

### How to install dependency packages and plug-ins?
Installing dependency packages by re-editing the image, usually, you only need to update the worker server image. The instance refers to Section 2.5.
### How to expand and shrink nodes?
Execute the kubectl command on the jump server to expand and shrink
```
## Scale up and down api to 3 replicas
kubectl scale --replicas=3 deploy dolphinscheduler-api -n dolphinscheduler
## Scale master to 2 replicas
kubectl scale --replicas=2 sts dolphinscheduler-master -n dolphinscheduler
## Scale worker to 2 replicas
kubectl scale --replicas=6 sts dolphinscheduler-worker -n dolphinscheduler
```
### How to make service storage persistent?
1. Install the EFS CSI driver (reference: https://docs.aws.amazon.com/zh_cn/eks/latest/userguide/efs-csi.html)
2. Create efs file system and access point (reference: https://docs.aws.amazon.com/zh_cn/efs/latest/ug/creating-using.html)
3. Create a PersistentVolume
```
echo "
apiVersion: v1
kind: PersistentVolume
metadata:
   name: dolphin-efs-pv
spec:
   capacity:
     storage: 100Gi
   volumeMode: Filesystem
   accessModes:
     - ReadWriteMany
   persistentVolumeReclaimPolicy: Retain
   storageClassName: efs-sc
   csi:
     driver: efs.csi.aws.com
     volumeHandle: fs-xxx::fsap-xxx // fsap
" | kubectl apply -f -

```
4. Modify the values.yaml and template/pvc-xx.yaml files, enable service persistent storage and associate PersistentVolume
```
sharedStoragePersistence: enabled: true mountPath: "/opt/soft" accessModes: - "ReadWriteMany" ## storageClassName must support the access mode: ReadWriteMany storageClassName: "efs-sc" storage: "20Gi"

{{- if .Values.common.sharedStoragePersistence.enabled }}
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
   name: {{ include "dolphinscheduler.fullname" . }}-shared
   labels:
     app.kubernetes.io/name: {{ include "dolphinscheduler.fullname" . }}-shared
     {{- include "dolphinscheduler.common.labels" . | nindent 4 }}
   annotations:
     "helm.sh/resource-policy": keep
spec:
   accessModes:
   {{- range.Values.common.sharedStoragePersistence.accessModes }}
     - {{ . | quote }}
   {{- end }}
   storageClassName: {{ .Values.common.sharedStoragePersistence.storageClassName | quote }}
   volumeName: dolphin-efs-pv
   resources:
     requests:
       storage: {{ .Values.common.sharedStoragePersistence.storage | quote }}
{{- end }}
```
5. Use helm to deploy or update.
### Where can I get support?
1. For AWS platform services, seek expert guidance through AWS Support https://aws.amazon.com/cn/premiumsupport/
2. Communicate about DolphinScheduler through the GitHub issue https://github.com/apache/dolphinscheduler
## Reference link

* Dolphinschduler [architecture design](https://dolphinscheduler.apache.org/en-us/docs/3.1.2/architecture/design)
* EKS subnet tag solution: https://aws.amazon.com/cn/premiumsupport/knowledge-center/eks-load-balancer-controller-subnets/
* Running stateful workloads with Amazon EKS on AWS Fargate using Amazon EFS: https://aws.amazon.com/blogs/containers/running-stateful-workloads-with-amazon-eks-on-aws-fargate-using-amazon-efs /
* Serverless on AWS: https://aws.amazon.com/cn/serverless/