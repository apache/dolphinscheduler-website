# Apache DolphinScheduler在Kubernetes体系中的技术实战

作者 | 杨滇，深圳交通中心 数据和算法平台架构师

## Kubernetes技术体系给Apache DolphinScheduler带来的技术新特性

Apache DolphinScheduler是当前非常优秀的分布式易扩展的可视化工作流任务调度平台。

基于笔者所在公司业务的特性，阐述我们使用 Kubernetes 作为Apache DolphinScheduler的技术底座的原因：

+ 各类独立部署项目，需要快速建立开发环境和生产环境；
+ 项目环境互联网访问受限，服务器只能使用离线的安装方式；
+ 尽可能统一的安装配置的信息，减少多个项目配置的异常；
+ 与对象存储技术的结合，统一非结构化数据的技术；
+ 便捷的监控体系，与现有监控集成；
+ 多种调度器的混合使用；
+ 全自动的资源调整能力；
+ 快速的自愈能力；

本文的案例都是基于Apache DolphinScheduler1.3.9版本为基础。Hadoop

## 基于helm工具的自动化高效部署方式

首先，我们介绍基于官网提供的helm的安装方式。Helm 是查找、分享和使用软件构建 Kubernetes 的最优方式。也是云原生CNCF的毕业项目之一。

<div align=center>
<img src="/img/2022-02-22/2.png"/>
</div>

海豚的官网和GitHub上有非常详细的配置文件和案例。这里我们重点介绍一些社区中经常出现的咨询和问题。

官网文档地址 https://dolphinscheduler.apache.org/zh-cn/docs/1.3.9/user_doc/kubernetes-deployment.html

GitHub文件夹地址  https://github.com/apache/dolphinscheduler/tree/1.3.9-release/docker/kubernetes/dolphinscheduler/

+ 在value.yaml文件中修改镜像，以实现离线安装（air-gap install）；
  https://about.gitlab.com/topics/gitops/
  ~~~yaml
  image:
    repository: "apache/dolphinscheduler"
    tag: "1.3.9"
    pullPolicy: "IfNotPresent"
  ~~~

  针对公司内部安装好的harbor，或者其他公有云的私仓，进行pull，tag，以及push。这里我们假定私仓地址是harbor.abc.com，你所在构建镜像的主机已经进行了docker login harbor.abc.com， 且已经建立和授权私仓下面新建apache项目。

  执行shell命令

  ~~~shell
  docker pull apache/dolphinscheduler:1.3.9
  dock tag apache/dolphinscheduler:1.3.9 harbor.abc.com/apache/dolphinscheduler:1.3.9
  docker push apache/dolphinscheduler:1.3.9
  ~~~

  再替换value文件中的镜像信息，这里我们推荐使用Always的方式拉取镜像，生产环境中尽量每次去检查是否是最新的镜像内容，保证软件制品的正确性。此外，很多同学会把tag写成latest（制作镜像不写tag信息，这样在生产环境非常危险，任何人push了镜像，就相当于改变了latest的tag的镜像，而且也无法判断latest是什么版本，所以建议要明确每次发版的tag，并且使用Always。

  ~~~yaml
  image:
    repository: "harbor.abc.com/apache/dolphinscheduler"
    tag: "1.3.9"
    pullPolicy: "Always"GitHub
  ~~~

  把https://GitHub.com/apache/dolphinscheduler/tree/1.3.9-release/docker/Kubernetes/dolphinscheduler 整个目录copy到可以执行helm命令的主机，然后按照官网执行

  ~~~shell
  kubectl create ns ds139Git
 MySQL install dolphinscheduler . -n ds139
  ~~~

  即可实现离线安装。

+ 集成DataX MySQL Oracle客户端组件，首先下载以下组件

  https://repo1.maven.org/maven2/MySQL/MySQL-connector-java/5.1.49/MySQL-connector-java-5.1.49.jar

  https://repo1.maven.org/maven2/com/Oracle/database/jdbc/ojdbc8/

  https://GitHub.com/alibaba/DataX/blob/master/userGuid.md 根据提示进行编译构建，文件包位于 {DataX_source_code_home}/target/DataX/DataX/ 

  基于以上plugin组件新建dockerfile，基础镜像可以使用已经push到私仓的镜像。

  ~~~dock
  FROM harbor.abc.com/apache/dolphinscheduler:1.3.9
  COPY *.jar /opt/dolphinscheduler/lib/
  RUN mkdir -p /opt/soft/DataX
  COPY DataX /opt/soft/DataX
  ~~~

  保存dockerfile，执行shell命令

  ~~~shell
  docker build -t harbor.abc.com/apache/dolphinscheduler:1.3.9-MySQL-Oracle-DataX .  #不要忘记最后一个点
  docker push harbor.abc.com/apache/dolphinscheduler:1.3.9-MySQL-Oracle-DataX
  ~~~

  修改value文件

  ~~~yaml
  image:
    repository: "harbor.abc.com/apache/dolphinscheduler"
    tag: "1.3.9-MySQL-Oracle-DataX"
    pullPolicy: "Always"
  ~~~

  执行helm install dolphinscheduler . -n ds139，或者执行helm upgrade dolphinscheduler -n ds139，也可以先helm uninstall dolphinscheduler -n ds139，再执行helm install dolphinscheduler . -n ds139。

+ 通常生产环境建议使用独立外置postgresql作为管理数据库，并且使用独立安装的zookeeper环境（本案例使用了zookeeper operator https://GitHub.com/pravega/zookeeper-operator ，与Apache DolphinScheduler在同一个Kubernetes集群中）。

  ~~~yaml
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
  ~~~



## 基于argo-cd的Gitops部署方式

argo-cd是基于Kubernetes 的声明式Gitops持续交付工具。argo-cd是CNCF的孵化项目，Gitops的最佳实践工具。关于Gitops的解释可以参考https://about.gitlab.com/topics/gitops/

<div align=center>
<img src="/img/2022-02-22/3.png"/>
</div>

Gitops可以为Apache DolphinScheduler的实施带来以下优点。

+ 图形化安装集群化的软件，一键安装；
+ Git记录全发版流程，一键回滚；
+ 便捷的海豚工具日志查看；

使用argo-cd的实施安装步骤：

+ 从GitHub上下载Apache DolphinScheduler源码，修改value文件，参考上个章节helm安装需要修改的内容；

+ 把修改后的源码目录新建Git项目，并且push到公司内部的Gitlab中，GitHub源码的目录名为docker/Kubernetes/dolphinscheduler；

+ 在argo-cd中配置Gitlab信息，我们使用https的模式；

<div align=center>
<img src="/img/2022-02-22/4.png"/>
</div>

+ argo-cd新建部署工程，填写相关信息

<div align=center>
<img src="/img/2022-02-22/5.png"/>
</div>

<div align=center>
<img src="/img/2022-02-22/6.png"/>
</div>

+ 对Git中的部署信息进行刷新和拉取，实现最后的部署工作；可以看到pod，configmap，secret，service等等资源全自动拉起。

<div align=center>
<img src="/img/2022-02-22/7.png"/>
</div>

<div align=center>
<img src="/img/2022-02-22/8.png"/>
</div>

+ 通过kubectl命令可以看到相关资源信息；

  ~~~shell
  [root@tpk8s-master01 ~]# kubectl get po -n ds139
  NAME                                     READY   STATUS    RESTARTS   AGE
  dolphinscheduler-alert-96c74dc84-72cc9   1/1     Running   0          22m
  dolphinscheduler-api-78db664b7b-gsltq    1/1     Running   0          22m
  dolphinscheduler-master-0                1/1     Running   0          22m
  dolphinscheduler-master-1                1/1     Running   0          22m
  dolphinscheduler-master-2                1/1     Running   0          22m
  dolphinscheduler-worker-0                1/1     Running   0          22m
  dolphinscheduler-worker-1                1/1     Running   0          22m
  dolphinscheduler-worker-2                1/1     Running   0          22m
  
  [root@tpk8s-master01 ~]# kubectl get statefulset -n ds139
  NAME                      READY   AGE
  dolphinscheduler-master   3/3     22m
  dolphinscheduler-worker   3/3     22m
  
  [root@tpk8s-master01 ~]# kubectl get cm -n ds139
  NAME                      DATA   AGE
  dolphinscheduler-alert    15     23m
  dolphinscheduler-api      1      23m
  dolphinscheduler-common   29     23m
  dolphinscheduler-master   10     23m
  dolphinscheduler-worker   7      23m
  
  [root@tpk8s-master01 ~]# kubectl get service -n ds139
  NAME                               TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)              AGE
  dolphinscheduler-api               ClusterIP   10.43.238.5   <none>        12345/TCP            23m
  dolphinscheduler-master-headless   ClusterIP   None          <none>        5678/TCP             23m
  dolphinscheduler-worker-headless   ClusterIP   None          <none>        1234/TCP,50051/TCP   23m
  
  [root@tpk8s-master01 ~]# kubectl get ingress -n ds139
  NAME               CLASS    HOSTS           ADDRESS
  dolphinscheduler   <none>   ds139.abc.com   
  
  ~~~

  

+ 可以看到所有的pod都分撒在Kubernetes集群中不同的host上，例如worker1和2都在不同的节点上。

<div align=center>
<img src="/img/2022-02-22/9.png"/>
</div>

<div align=center>
<img src="/img/2022-02-22/10.png"/>
</div>

+ 我们配置了ingress，公司内部配置了泛域名就可以方便的使用域名进行访问；

<div align=center>
<img src="/img/2022-02-22/11.png"/>
</div>

  可以登录域名进行访问。

<div align=center>
<img src="/img/2022-02-22/12.png"/>
</div>

  具体配置可以修改value文件中的内容：

  ~~~yaml
  ingress:
    enabled: true
    host: "ds139.abc.com"
    path: "/dolphinscheduler"
    tls:
      enabled: false
      secretName: "dolphinscheduler-tls"
  ~~~

- 方便查看Apache DolphinScheduler各个组件的内部日志：

<div align=center>
<img src="/img/2022-02-22/13.png"/>
</div>

+ 对部署好的系统进行检查，3个master，3个worker，zookeeper都配置正常；

<div align=center>
<img src="/img/2022-02-22/14.png"/>
</div>

<div align=center>
<img src="/img/2022-02-22/15.png"/>
</div>

<div align=center>
<img src="/img/2022-02-22/16.png"/>
</div>

+ 使用argo-cd可以非常方便的进行修改master，worker，api，alert等组件的副本数量，海豚的helm配置也预留了cpu和内存的设置信息。这里我们修改value中的副本值。修改后，提交公司内部Gitlab。

  ~~~~yaml
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
  ~~~~

- 只需要在argo-cd点击sync同步，对应的pods都按照需求进行了增加

<div align=center>
<img src="/img/2022-02-22/17.png"/>
</div>

<div align=center>
<img src="/img/2022-02-22/18.png"/>
</div>

  ~~~
  [root@tpk8s-master01 ~]# kubectl get po -n ds139
  NAME                                     READY   STATUS    RESTARTS   AGE
  dolphinscheduler-alert-96c74dc84-72cc9   1/1     Running   0          43m
  dolphinscheduler-alert-96c74dc84-j6zdh   1/1     Running   0          2m27s
  dolphinscheduler-alert-96c74dc84-rn9wb   1/1     Running   0          2m27s
  dolphinscheduler-api-78db664b7b-6j8rj    1/1     Running   0          2m27s
  dolphinscheduler-api-78db664b7b-bsdgv    1/1     Running   0          2m27s
  dolphinscheduler-api-78db664b7b-gsltq    1/1     Running   0          43m
  dolphinscheduler-master-0                1/1     Running   0          43m
  dolphinscheduler-master-1                1/1     Running   0          43m
  dolphinscheduler-master-2                1/1     Running   0          43m
  dolphinscheduler-master-3                1/1     Running   0          2m27s
  dolphinscheduler-master-4                1/1     Running   0          2m27s
  dolphinscheduler-worker-0                1/1     Running   0          43m
  dolphinscheduler-worker-1                1/1     Running   0          43m
  dolphinscheduler-worker-2                1/1     Running   0          43m
  dolphinscheduler-worker-3                1/1     Running   0          2m27s
  dolphinscheduler-worker-4                1/1     Running   0          2m27s
  ~~~



## Apache DolphinScheduler与s3对象存储技术集成

许多同学在海豚的社区中提问，如何配置s3 minio的集成。这里给出基于Kubernetes的helm配置。

+ 修改value中s3的部分，建议使用ip+端口指向minio服务器。

  ~~~yaml
  common:
    ## Configmap
    configmap:
      DOLPHINSCHEDULER_OPTS: ""
      DATA_BASEDIR_PATH: "/tmp/dolphinscheduler"
      RESOURCE_STORAGE_TYPE: "S3"
      RESOURCE_UPLOAD_PATH: "/dolphinscheduler"
      FS_DEFAULT_FS: "s3a://dfs"
      FS_S3A_ENDPOINT: "http://192.168.1.100:9000"
      FS_S3A_ACCESS_KEY: "admin"
      FS_S3A_SECRET_KEY: "password"
  ~~~

+ minio中存放海豚文件的bucket名字是dolphinscheduler，这里新建文件夹和文件进行测试。

<div align=center>
<img src="/img/2022-02-22/19.png"/>
</div>

<div align=center>
<img src="/img/2022-02-22/19-1.png"/>
</div>

  

## Apache DolphinScheduler与 Kube-prometheus 的技术集成

+ 我们在Kubernetes使用kube-prometheus operator技术，实现了在部署海豚后，自动实现了对海豚各个组件的资源监控。

+ 请注意kube-prometheus的版本，需要对应Kubernetes主版本。https://GitHub.com/prometheus-operator/kube-prometheus

<div align=center>
<img src="/img/2022-02-22/20.png"/>
</div>

<div align=center>
<img src="/img/2022-02-22/21.png"/>
</div>

<div align=center>
<img src="/img/2022-02-22/18.png"/>
</div>

<div align=center>
<img src="/img/2022-02-22/22.png"/>
</div>
  

## Apache DolphinScheduler与 Service Mesh 的技术集成

+ 通过 Service Mesh 技术可以实现对海豚内部的服务调用，以及海豚api外部调用的可观测性分析，以实现Apache DolphinScheduler产品的自身服务优化。

+ 我们使用linkerd作为Service Mesh的产品进行集成，linkerd也是CNCF优秀的毕业项目。

 <div align=center>
<img src="/img/2022-02-22/23.png"/>
</div>



+ 只需要在海豚helm的value文件中修改annotations，重新部署，就可以快速实现mesh proxy sidecar的注入。可以对master，worker，api，alert等组件都注入。

  ~~~yaml
    annotations: #{}
      linkerd.io/inject: enabled
  ~~~

可以观察组件之间的服务通信质量，每秒请求的次数等等。

<div align=center>
<img src="/img/2022-02-22/24.png"/>
</div>

<div align=center>
<img src="/img/2022-02-22/25.png"/>
</div>


## 未来Apache DolphinScheduler基于云原生技术的展望

Apache DolphinScheduler作为面向新一代云原生大数据工具，未来可以在Kubernetes生态集成更多的优秀工具和特性，满足更多的用户群体和场景。

+ 和argo-workflow的集成，可以通过api，cli等方式在Apache DolphinScheduler中调用argo-workflow单个作业，dag作业，以及周期性作业；

+ 使用hpa的方式，自动扩缩容worker，实现无人干预的水平扩展方式；

+ 集成Kubernetes的spark operator和Hadoopoperator工具，全面的云原生化；

+ 实现多云和多集群的分布式作业调度；

+ 采用sidecar实现定期删除worker作业日志；

<div align=center>
<img src="/img/2022-02-22/26.png"/>
</div>



