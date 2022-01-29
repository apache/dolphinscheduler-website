# 在 Docker 中启动 DolphinScheduler

## 生产准备

 - [Docker](https://docs.docker.com/engine/install/) 1.13.1+
 - [Docker Compose](https://docs.docker.com/compose/) 1.11.0+

## 在你开始之前

### docker-compose 启动 DolphinScheduler

安装 [docker-compose](https://docs.docker.com/compose/)

Windows 7-10 安装 [Docker Toolbox](https://github.com/docker/toolbox/releases)
Windows 10 64-bit 安装 [Docker Desktop](https://docs.docker.com/docker-for-windows/install/)

[系统要求](https://docs.docker.com/docker-for-windows/install/#system-requirements)

- 请配置内存不少于 4GB

Mac 用户点击  `Docker Desktop -> Preferences -> Resources -> Memory`

Windows Docker Toolbox 需要配置：

 **内存**：打开 Oracle VirtualBox Manager，如果你双击 Docker Quickstart Terminal 并成功运行 Docker Toolbox，你将会看到一个名为 `default` 的虚拟机. 点击 `设置 -> 系统 -> 主板 -> 内存大小`

 **端口转发**：点击 `设置 -> 网络 -> 高级 -> 端口转发 -> 添加`. `名称`，`主机端口` 和 `子系统端口` 都填写 `12345`，不填 `主机IP` 和 `子系统IP`

Windows Docker Desktop

**Hyper-V 模式**：点击 `Docker Desktop -> Settings -> Resources -> Memory`

**WSL 2 模式**：参考 [WSL 2 utility VM](https://docs.microsoft.com/zh-cn/windows/wsl/wsl-config#configure-global-options-with-wslconfig)

#### 下载源码包

源码包 apache-dolphinscheduler-2.0.2-src.tar.gz，下载地址: [下载](/zh-cn/download/download.html)

#### 拉取镜像并启动服务

> 对于 Mac 和 Linux 用户，打开 **Terminal**
> 对于 Windows Docker Toolbox 用户，打开 **Docker Quickstart Terminal**
> 对于 Windows Docker Desktop 用户，打开 **Windows PowerShell**

```
$ tar -zxvf apache-dolphinscheduler-2.0.2-src.tar.gz
$ cd apache-dolphinscheduler-2.0.2-src/docker/docker-swarm
$ docker pull dolphinscheduler.docker.scarf.sh/apache/dolphinscheduler:2.0.2
$ docker tag apache/dolphinscheduler:2.0.2 apache/dolphinscheduler:latest
$ docker-compose up -d
```

> PowerShell 应该使用 `cd apache-dolphinscheduler-2.0.2-src\docker\docker-swarm`

**PostgreSQL** (用户 `root`, 密码 `root`, 数据库 `dolphinscheduler`) 和 **ZooKeeper** 服务将会默认启动

#### 登录系统

访问前端页面： http://192.168.xx.xx:12345/dolphinscheduler (本地地址为 http://127.0.0.1:12345/dolphinscheduler)

默认的用户是`admin`，默认的密码是`dolphinscheduler123`

<p align="center">
  <img src="/img/login.png" width="60%" />
</p>

请参考用户手册章节的[快速上手](/zh-cn/docs/2.0.2/user_doc/guide/quick-start.html)查看如何使用DolphinScheduler

### 通过指定已存在 PostgreSQL 与 ZooKeeper 服务

安装 [docker](https://docs.docker.com/engine/install/)

#### 基础安装

 - PostgreSQL (8.2.15+ 以上)
 - ZooKeeper (3.4.6+ 以上)
 - Docker (1.13.1+ 以上)

#### 登录 PostgreSQL 数据库，创建 `dolphinscheduler` 数据库

#### 初始化，导入 `sql/dolphinscheduler_postgre.sql`  创建表及基础数据导入

#### 下载 DolphinScheduler 镜像

我们已将面向用户的 DolphinScheduler 镜像上传至 docker 仓库，用户无需在本地构建镜像，直接执行以下命令从 docker 仓库 pull 镜像：

```
docker pull dolphinscheduler.docker.scarf.sh/apache/dolphinscheduler:2.0.2
```

#### 运行 DolphinScheduler 实例

```
$ docker run -d --name dolphinscheduler \
-e DATABASE_HOST="192.168.x.x" -e DATABASE_PORT="5432" -e DATABASE_DATABASE="dolphinscheduler" \
-e DATABASE_USERNAME="test" -e DATABASE_PASSWORD="test" \
-e ZOOKEEPER_QUORUM="192.168.x.x:2181" \
-p 12345:12345 \
apache/dolphinscheduler:2.0.2 all
```

### 运行 DolphinScheduler 中独立服务

容器启动时，启动服务

```
    MasterServer         ----- master服务
    WorkerServer         ----- worker服务
    LoggerServer         ----- logger服务
    ApiApplicationServer ----- api服务
    AlertServer          ----- alert服务
    PythonGatewayServer  ----- python gateway服务
```

如果你只是想运行 dolphinscheduler 中的部分服务

你可以够通执行以下命令来运行dolphinscheduler中的部分服务

* 启动一个 **master server** :

```
$ docker run -d --name dolphinscheduler-master \
-e DATABASE_HOST="192.168.x.x" -e DATABASE_PORT="5432" -e DATABASE_DATABASE="dolphinscheduler" \
-e DATABASE_USERNAME="test" -e DATABASE_PASSWORD="test" \
-e ZOOKEEPER_QUORUM="192.168.x.x:2181" \
apache/dolphinscheduler:2.0.2 master-server
```

* 启动一个 **worker server** (包括 **logger server**) :

```
$ docker run -d --name dolphinscheduler-worker \
-e DATABASE_HOST="192.168.x.x" -e DATABASE_PORT="5432" -e DATABASE_DATABASE="dolphinscheduler" \
-e DATABASE_USERNAME="test" -e DATABASE_PASSWORD="test" \
-e ZOOKEEPER_QUORUM="192.168.x.x:2181" \
apache/dolphinscheduler:2.0.2 worker-server
```

* 启动一个 **api server** :

```
$ docker run -d --name dolphinscheduler-api \
-e DATABASE_HOST="192.168.x.x" -e DATABASE_PORT="5432" -e DATABASE_DATABASE="dolphinscheduler" \
-e DATABASE_USERNAME="test" -e DATABASE_PASSWORD="test" \
-e ZOOKEEPER_QUORUM="192.168.x.x:2181" \
-p 12345:12345 \
apache/dolphinscheduler:2.0.2 api-server
```

* 启动一个 **alert server** :

```
$ docker run -d --name dolphinscheduler-alert \
-e DATABASE_HOST="192.168.x.x" -e DATABASE_PORT="5432" -e DATABASE_DATABASE="dolphinscheduler" \
-e DATABASE_USERNAME="test" -e DATABASE_PASSWORD="test" \
apache/dolphinscheduler:2.0.2 alert-server
```

* 启动一个 **python gateway server** :

```
$ docker run -d --name dolphinscheduler-python-gateway \
-e DATABASE_HOST="192.168.x.x" -e DATABASE_PORT="5432" -e DATABASE_DATABASE="dolphinscheduler" \
-e DATABASE_USERNAME="test" -e DATABASE_PASSWORD="test" \
apache/dolphinscheduler:2.0.2 python-gateway-server
```

**注意**: 当你运行dolphinscheduler中的部分服务时，你必须指定这些环境变量 `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_DATABASE`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`, `ZOOKEEPER_QUORUM`。

## 环境变量

Docker 容器通过环境变量进行配置，[附录-环境变量](#appendix-environment-variables) 列出了 DolphinScheduler 的可配置环境变量及其默认值

特别地，在 Docker Compose 和 Docker Swarm 中，可以通过环境变量配置文件 `config.env.sh` 进行配置

## 支持矩阵

| Type                                                         | 支持     | 备注                  |
| ------------------------------------------------------------ | ------- | --------------------- |
| Shell                                                        | 是      |                       |
| Python2                                                      | 是      |                       |
| Python3                                                      | 间接支持 | 详见 FAQ               |
| Hadoop2                                                      | 间接支持 | 详见 FAQ               |
| Hadoop3                                                      | 尚未确定 | 尚未测试                |
| Spark-Local(client)                                          | 间接支持 | 详见 FAQ               |
| Spark-YARN(cluster)                                          | 间接支持 | 详见 FAQ               |
| Spark-Standalone(cluster)                                    | 尚不    |                        |
| Spark-Kubernetes(cluster)                                    | 尚不    |                        |
| Flink-Local(local>=1.11)                                     | 尚不    | Generic CLI 模式尚未支持 |
| Flink-YARN(yarn-cluster)                                     | 间接支持 | 详见 FAQ               |
| Flink-YARN(yarn-session/yarn-per-job/yarn-application>=1.11) | 尚不    | Generic CLI 模式尚未支持 |
| Flink-Standalone(default)                                    | 尚不    |                        |
| Flink-Standalone(remote>=1.11)                               | 尚不    | Generic CLI 模式尚未支持 |
| Flink-Kubernetes(default)                                    | 尚不    |                        |
| Flink-Kubernetes(remote>=1.11)                               | 尚不    | Generic CLI 模式尚未支持 |
| Flink-NativeKubernetes(kubernetes-session/application>=1.11) | 尚不    | Generic CLI 模式尚未支持 |
| MapReduce                                                    | 间接支持 | 详见 FAQ               |
| Kerberos                                                     | 间接支持 | 详见 FAQ               |
| HTTP                                                         | 是      |                       |
| DataX                                                        | 间接支持 | 详见 FAQ               |
| Sqoop                                                        | 间接支持 | 详见 FAQ               |
| SQL-MySQL                                                    | 间接支持 | 详见 FAQ               |
| SQL-PostgreSQL                                               | 是      |                       |
| SQL-Hive                                                     | 间接支持 | 详见 FAQ               |
| SQL-Spark                                                    | 间接支持 | 详见 FAQ               |
| SQL-ClickHouse                                               | 间接支持 | 详见 FAQ               |
| SQL-Oracle                                                   | 间接支持 | 详见 FAQ               |
| SQL-SQLServer                                                | 间接支持 | 详见 FAQ               |
| SQL-DB2                                                      | 间接支持 | 详见 FAQ               |



## 附录 - 环境变量

- 数据库

**`DATABASE_TYPE`**

配置`database`的`TYPE`， 默认值 `postgresql`。

**注意**: 当运行`dolphinscheduler`中`master-server`、`worker-server`、`api-server`、`alert-server`这些服务时，必须指定这个环境变量，以便于你更好的搭建分布式服务。

**`DATABASE_DRIVER`**

配置`database`的`DRIVER`， 默认值 `org.postgresql.Driver`。

**注意**: 当运行`dolphinscheduler`中`master-server`、`worker-server`、`api-server`、`alert-server`这些服务时，必须指定这个环境变量，以便于你更好的搭建分布式服务。

**`DATABASE_HOST`**

配置`database`的`HOST`， 默认值 `127.0.0.1`。

**注意**: 当运行`dolphinscheduler`中`master-server`、`worker-server`、`api-server`、`alert-server`这些服务时，必须指定这个环境变量，以便于你更好的搭建分布式服务。

**`DATABASE_PORT`**

配置`database`的`PORT`， 默认值 `5432`。

**注意**: 当运行`dolphinscheduler`中`master-server`、`worker-server`、`api-server`、`alert-server`这些服务时，必须指定这个环境变量，以便于你更好的搭建分布式服务。

**`DATABASE_USERNAME`**

配置`database`的`USERNAME`， 默认值 `root`。

**注意**: 当运行`dolphinscheduler`中`master-server`、`worker-server`、`api-server`、`alert-server`这些服务时，必须指定这个环境变量，以便于你更好的搭建分布式服务。

**`DATABASE_PASSWORD`**

配置`database`的`PASSWORD`， 默认值 `root`。

**注意**: 当运行`dolphinscheduler`中`master-server`、`worker-server`、`api-server`、`alert-server`这些服务时，必须指定这个环境变量，以便于你更好的搭建分布式服务。

**`DATABASE_DATABASE`**

配置`database`的`DATABASE`， 默认值 `dolphinscheduler`。

**注意**: 当运行`dolphinscheduler`中`master-server`、`worker-server`、`api-server`、`alert-server`这些服务时，必须指定这个环境变量，以便于你更好的搭建分布式服务。

**`DATABASE_PARAMS`**

配置`database`的`PARAMS`， 默认值 `characterEncoding=utf8`。

**注意**: 当运行`dolphinscheduler`中`master-server`、`worker-server`、`api-server`、`alert-server`这些服务时，必须指定这个环境变量，以便于你更好的搭建分布式服务。

- ZooKeeper

**`ZOOKEEPER_QUORUM`**

配置`dolphinscheduler`的`Zookeeper`地址, 默认值 `127.0.0.1:2181`。

**注意**: 当运行`dolphinscheduler`中`master-server`、`worker-server`、`api-server`这些服务时，必须指定这个环境变量，以便于你更好的搭建分布式服务。

**`ZOOKEEPER_ROOT`**

配置`dolphinscheduler`在`zookeeper`中数据存储的根目录，默认值 `/dolphinscheduler`。

- 通用

**`DOLPHINSCHEDULER_OPTS`**

配置`dolphinscheduler`的`jvm options`，适用于`master-server`、`worker-server`、`api-server`、`alert-server`、`logger-server`，默认值 `""`、

**`DATA_BASEDIR_PATH`**

用户数据目录, 用户自己配置, 请确保这个目录存在并且用户读写权限， 默认值 `/tmp/dolphinscheduler`。

**`RESOURCE_STORAGE_TYPE`**

配置`dolphinscheduler`的资源存储类型，可选项为 `HDFS`、`S3`、`NONE`，默认值 `HDFS`。

**`RESOURCE_UPLOAD_PATH`**

配置`HDFS/S3`上的资源存储路径，默认值 `/dolphinscheduler`。

**`FS_DEFAULT_FS`**

配置资源存储的文件系统协议，如 `file:///`, `hdfs://mycluster:8020` or `s3a://dolphinscheduler`，默认值 `file:///`。

**`FS_S3A_ENDPOINT`**

当`RESOURCE_STORAGE_TYPE=S3`时，需要配置`S3`的访问路径，默认值 `s3.xxx.amazonaws.com`。

**`FS_S3A_ACCESS_KEY`**

当`RESOURCE_STORAGE_TYPE=S3`时，需要配置`S3`的`s3 access key`，默认值 `xxxxxxx`。

**`FS_S3A_SECRET_KEY`**

当`RESOURCE_STORAGE_TYPE=S3`时，需要配置`S3`的`s3 secret key`，默认值 `xxxxxxx`。

**`HADOOP_SECURITY_AUTHENTICATION_STARTUP_STATE`**

配置`dolphinscheduler`是否启用kerberos，默认值 `false`。

**`JAVA_SECURITY_KRB5_CONF_PATH`**

配置`dolphinscheduler`的java.security.krb5.conf路径，默认值 `/opt/krb5.conf`。

**`LOGIN_USER_KEYTAB_USERNAME`**

配置`dolphinscheduler`登录用户的keytab用户名，默认值 `hdfs@HADOOP.COM`。

**`LOGIN_USER_KEYTAB_PATH`**

配置`dolphinscheduler`登录用户的keytab路径，默认值 `/opt/hdfs.keytab`。

**`KERBEROS_EXPIRE_TIME`**

配置`dolphinscheduler`的kerberos过期时间，单位为小时，默认值 `2`。

**`HDFS_ROOT_USER`**

当`RESOURCE_STORAGE_TYPE=HDFS`时，配置`dolphinscheduler`的hdfs的root用户名，默认值 `hdfs`。

**`RESOURCE_MANAGER_HTTPADDRESS_PORT`**

配置`dolphinscheduler`的resource manager httpaddress 端口，默认值 `8088`。

**`YARN_RESOURCEMANAGER_HA_RM_IDS`**

配置`dolphinscheduler`的yarn resourcemanager ha rm ids，默认值 `空`。

**`YARN_APPLICATION_STATUS_ADDRESS`**

配置`dolphinscheduler`的yarn application status地址，默认值 `http://ds1:%s/ws/v1/cluster/apps/%s`。

**`SKYWALKING_ENABLE`**

配置`skywalking`是否启用. 默认值 `false`。

**`SW_AGENT_COLLECTOR_BACKEND_SERVICES`**

配置`skywalking`的collector后端地址. 默认值 `127.0.0.1:11800`。

**`SW_GRPC_LOG_SERVER_HOST`**

配置`skywalking`的grpc服务主机或IP. 默认值 `127.0.0.1`。

**`SW_GRPC_LOG_SERVER_PORT`**

配置`skywalking`的grpc服务端口. 默认值 `11800`。

**`HADOOP_HOME`**

配置`dolphinscheduler`的`HADOOP_HOME`，默认值 `/opt/soft/hadoop`。

**`HADOOP_CONF_DIR`**

配置`dolphinscheduler`的`HADOOP_CONF_DIR`，默认值 `/opt/soft/hadoop/etc/hadoop`。

**`SPARK_HOME1`**

配置`dolphinscheduler`的`SPARK_HOME1`，默认值 `/opt/soft/spark1`。

**`SPARK_HOME2`**

配置`dolphinscheduler`的`SPARK_HOME2`，默认值 `/opt/soft/spark2`。

**`PYTHON_HOME`**

配置`dolphinscheduler`的`PYTHON_HOME`，默认值 `/usr/bin/python`。

**`JAVA_HOME`**

配置`dolphinscheduler`的`JAVA_HOME`，默认值 `/usr/local/openjdk-8`。

**`HIVE_HOME`**

配置`dolphinscheduler`的`HIVE_HOME`，默认值 `/opt/soft/hive`。

**`FLINK_HOME`**

配置`dolphinscheduler`的`FLINK_HOME`，默认值 `/opt/soft/flink`。

**`DATAX_HOME`**

配置`dolphinscheduler`的`DATAX_HOME`，默认值 `/opt/soft/datax`。

- Master Server

**`MASTER_SERVER_OPTS`**

配置`master-server`的`jvm options`，默认值 `-Xms1g -Xmx1g -Xmn512m`。

**`MASTER_EXEC_THREADS`**

配置`master-server`中的执行线程数量，默认值 `100`。

**`MASTER_EXEC_TASK_NUM`**

配置`master-server`中的执行任务数量，默认值 `20`。

**`MASTER_DISPATCH_TASK_NUM`**

配置`master-server`中的派发任务数量，默认值 `3`。

**`MASTER_HOST_SELECTOR`**

配置`master-server`中派发任务时worker host的选择器，可选值为`Random`, `RoundRobin`和`LowerWeight`，默认值 `LowerWeight`。

**`MASTER_HEARTBEAT_INTERVAL`**

配置`master-server`中的心跳交互时间，默认值 `10`。

**`MASTER_TASK_COMMIT_RETRYTIMES`**

配置`master-server`中的任务提交重试次数，默认值 `5`。

**`MASTER_TASK_COMMIT_INTERVAL`**

配置`master-server`中的任务提交交互时间，默认值 `1`。

**`MASTER_MAX_CPULOAD_AVG`**

配置`master-server`中的CPU中的`load average`值，默认值 `-1`。

**`MASTER_RESERVED_MEMORY`**

配置`master-server`的保留内存，单位为G，默认值 `0.3`。

- Worker Server

**`WORKER_SERVER_OPTS`**

配置`worker-server`的`jvm options`，默认值 `-Xms1g -Xmx1g -Xmn512m`。

**`WORKER_EXEC_THREADS`**

配置`worker-server`中的执行线程数量，默认值 `100`。

**`WORKER_HEARTBEAT_INTERVAL`**

配置`worker-server`中的心跳交互时间，默认值 `10`。

**`WORKER_MAX_CPULOAD_AVG`**

配置`worker-server`中的CPU中的最大`load average`值，默认值 `-1`。

**`WORKER_RESERVED_MEMORY`**

配置`worker-server`的保留内存，单位为G，默认值 `0.3`。

**`WORKER_GROUPS`**

配置`worker-server`的分组，默认值 `default`。

- Alert Server

**`ALERT_SERVER_OPTS`**

配置`alert-server`的`jvm options`，默认值 `-Xms512m -Xmx512m -Xmn256m`。

**`XLS_FILE_PATH`**

配置`alert-server`的`XLS`文件的存储路径，默认值 `/tmp/xls`。

**`MAIL_SERVER_HOST`**

配置`alert-server`的邮件服务地址，默认值 `空`。

**`MAIL_SERVER_PORT`**

配置`alert-server`的邮件服务端口，默认值 `空`。

**`MAIL_SENDER`**

配置`alert-server`的邮件发送人，默认值 `空`。

**`MAIL_USER=`**

配置`alert-server`的邮件服务用户名，默认值 `空`。

**`MAIL_PASSWD`**

配置`alert-server`的邮件服务用户密码，默认值 `空`。

**`MAIL_SMTP_STARTTLS_ENABLE`**

配置`alert-server`的邮件服务是否启用TLS，默认值 `true`。

**`MAIL_SMTP_SSL_ENABLE`**

配置`alert-server`的邮件服务是否启用SSL，默认值 `false`。

**`MAIL_SMTP_SSL_TRUST`**

配置`alert-server`的邮件服务SSL的信任地址，默认值 `空`。

**`ENTERPRISE_WECHAT_ENABLE`**

配置`alert-server`的邮件服务是否启用企业微信，默认值 `false`。

**`ENTERPRISE_WECHAT_CORP_ID`**

配置`alert-server`的邮件服务企业微信`ID`，默认值 `空`。

**`ENTERPRISE_WECHAT_SECRET`**

配置`alert-server`的邮件服务企业微信`SECRET`，默认值 `空`。

**`ENTERPRISE_WECHAT_AGENT_ID`**

配置`alert-server`的邮件服务企业微信`AGENT_ID`，默认值 `空`。

**`ENTERPRISE_WECHAT_USERS`**

配置`alert-server`的邮件服务企业微信`USERS`，默认值 `空`。

- Api Server

**`API_SERVER_OPTS`**

配置`api-server`的`jvm options`，默认值 `-Xms512m -Xmx512m -Xmn256m`。

- Logger Server

**`LOGGER_SERVER_OPTS`**

配置`logger-server`的`jvm options`，默认值 `-Xms512m -Xmx512m -Xmn256m`。
