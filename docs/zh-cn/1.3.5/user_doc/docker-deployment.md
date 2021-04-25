## 快速试用 Docker 部署

有 2 种方式可以快速试用 DolphinScheduler，分别介绍
### 一、以 docker-compose 的方式启动(推荐)
这种方式需要先安装 [docker-compose](https://docs.docker.com/compose/) , docker-compose 的安装网上已经有非常多的资料，请自行安装即可

##### 1、下载源码 zip 包

请下载最新版本的源码包，下载地址: [下载](/zh-cn/download/download.html)

下载 apache-dolphinscheduler-incubating-1.3.5-src.zip 后，解压缩

```shell
# 解压缩
unzip apache-dolphinscheduler-incubating-1.3.5-src.zip

mv apache-dolphinscheduler-incubating-1.3.5-src-release dolphinscheduler-src
```

##### 2、安装并启动服务
```
cd dolphinscheduler-src/docker/docker-swarm
docker-compose up -d
```

##### 3、登录系统
访问前端页面： http://192.168.xx.xx:12345/dolphinscheduler

默认的用户是`admin`，默认的密码是`dolphinscheduler123`
 <p align="center">
   <img src="/img/login.png" width="60%" />
 </p>
然后参考用户手册章节的`快速上手`即可进行使用

### 二、以 docker 方式启动
这种方式需要先安装 [docker](https://docs.docker.com/engine/install/), docker 的安装网上已经有非常多的资料，请自行安装即可

##### 1、基础软件安装(请自行安装)
 * PostgreSQL (8.2.15+)
 * ZooKeeper (3.4.6+)
 * Docker

##### 2、请登录 PostgreSQL 数据库，创建名为 `dolphinscheduler` 数据库

##### 3、初始化数据库，导入 `sql/dolphinscheduler-postgre.sql` 进行创建表及基础数据导入

##### 4、下载 DolphinScheduler 镜像
我们已将面向用户的 DolphinScheduler 镜像上传至 docker 仓库，用户无需在本地构建镜像，直接执行以下命令从 docker 仓库 pull 镜像：
```
docker pull apache/dolphinscheduler:latest
```

##### 5、运行一个 DolphinScheduler 实例
如下:

```
$ docker run -d --name dolphinscheduler \
-e ZOOKEEPER_QUORUM="192.168.x.x:2181" \
-e DATABASE_HOST="192.168.x.x" -e DATABASE_PORT="5432" -e DATABASE_DATABASE="dolphinscheduler" \
-e DATABASE_USERNAME="test" -e DATABASE_PASSWORD="test" \
-p 12345:12345 \
apache/dolphinscheduler:latest all
```
注：{username} 和 {password} 需要替换为具体的数据库用户名和密码，192.168.x.x 需要替换为 zookeeper 和 数据库的主机 IP

##### 6、登录系统
默认的用户是`admin`，默认的密码是`dolphinscheduler123`

访问前端页面： http://192.168.xx.xx:12345/dolphinscheduler
 <p align="center">
   <img src="/img/login.png" width="60%" />
 </p>
然后参考用户手册章节的`快速上手`即可进行使用

## 附录

### 在容器启动时，会自动启动以下服务：

```
    MasterServer         ----- master服务
    WorkerServer         ----- worker服务
    LoggerServer         ----- logger服务
    ApiApplicationServer ----- api服务
    AlertServer          ----- alert服务
```
### 如果你只是想运行 dolphinscheduler 中的部分服务

你能够通执行以下指令仅运行dolphinscheduler中的部分服务

* 创建一个 **本地卷** 用于资源存储，如下:

```
docker volume create dolphinscheduler-resource-local
```

* 启动一个 **master server**, 如下:

```
$ docker run -d --name dolphinscheduler-master \
-e ZOOKEEPER_QUORUM="192.168.x.x:2181" \
-e DATABASE_HOST="192.168.x.x" -e DATABASE_PORT="5432" -e DATABASE_DATABASE="dolphinscheduler" \
-e DATABASE_USERNAME="test" -e DATABASE_PASSWORD="test" \
apache/dolphinscheduler:latest master-server
```

* 启动一个 **worker server** (包括 **logger server**), 如下:

```
$ docker run -d --name dolphinscheduler-worker \
-e ZOOKEEPER_QUORUM="192.168.x.x:2181" \
-e DATABASE_HOST="192.168.x.x" -e DATABASE_PORT="5432" -e DATABASE_DATABASE="dolphinscheduler" \
-e DATABASE_USERNAME="test" -e DATABASE_PASSWORD="test" \
-v dolphinscheduler-resource-local:/dolphinscheduler \
apache/dolphinscheduler:latest worker-server
```

* 启动一个 **api server**, 如下:

```
$ docker run -d --name dolphinscheduler-api \
-e ZOOKEEPER_QUORUM="192.168.x.x:2181" \
-e DATABASE_HOST="192.168.x.x" -e DATABASE_PORT="5432" -e DATABASE_DATABASE="dolphinscheduler" \
-e DATABASE_USERNAME="test" -e DATABASE_PASSWORD="test" \
-v dolphinscheduler-resource-local:/dolphinscheduler \
-p 12345:12345 \
apache/dolphinscheduler:latest api-server
```

* 启动一个 **alert server**, 如下:

```
$ docker run -d --name dolphinscheduler-alert \
-e DATABASE_HOST="192.168.x.x" -e DATABASE_PORT="5432" -e DATABASE_DATABASE="dolphinscheduler" \
-e DATABASE_USERNAME="test" -e DATABASE_PASSWORD="test" \
apache/dolphinscheduler:latest alert-server
```

**注意**: 当你运行dolphinscheduler中的部分服务时，你必须指定这些环境变量 `DATABASE_HOST` `DATABASE_PORT` `DATABASE_DATABASE` `DATABASE_USERNAME` `DATABASE_PASSWORD` `ZOOKEEPER_QUORUM`。

## 环境变量

DolphinScheduler Docker 容器通过环境变量进行配置，缺省时将会使用默认值。

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

**`DOLPHINSCHEDULER_ENV_PATH`**

任务执行时的环境变量配置文件， 默认值 `/opt/dolphinscheduler/conf/env/dolphinscheduler_env.sh`。

**`DOLPHINSCHEDULER_DATA_BASEDIR_PATH`**

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

**`ZOOKEEPER_QUORUM`**

配置`master-server`和`worker-serverr`的`Zookeeper`地址, 默认值 `127.0.0.1:2181`。

**注意**: 当运行`dolphinscheduler`中`master-server`、`worker-server`这些服务时，必须指定这个环境变量，以便于你更好的搭建分布式服务。

**`ZOOKEEPER_ROOT`**

配置`dolphinscheduler`在`zookeeper`中数据存储的根目录，默认值 `/dolphinscheduler`。

**`MASTER_EXEC_THREADS`**

配置`master-server`中的执行线程数量，默认值 `100`。

**`MASTER_EXEC_TASK_NUM`**

配置`master-server`中的执行任务数量，默认值 `20`。

**`MASTER_HEARTBEAT_INTERVAL`**

配置`master-server`中的心跳交互时间，默认值 `10`。

**`MASTER_TASK_COMMIT_RETRYTIMES`**

配置`master-server`中的任务提交重试次数，默认值 `5`。

**`MASTER_TASK_COMMIT_INTERVAL`**

配置`master-server`中的任务提交交互时间，默认值 `1000`。

**`MASTER_MAX_CPULOAD_AVG`**

配置`master-server`中的CPU中的`load average`值，默认值 `100`。

**`MASTER_RESERVED_MEMORY`**

配置`master-server`的保留内存，默认值 `0.1`。

**`MASTER_LISTEN_PORT`**

配置`master-server`的端口，默认值 `5678`。

**`WORKER_EXEC_THREADS`**

配置`worker-server`中的执行线程数量，默认值 `100`。

**`WORKER_HEARTBEAT_INTERVAL`**

配置`worker-server`中的心跳交互时间，默认值 `10`。

**`WORKER_MAX_CPULOAD_AVG`**

配置`worker-server`中的CPU中的最大`load average`值，默认值 `100`。

**`WORKER_RESERVED_MEMORY`**

配置`worker-server`的保留内存，默认值 `0.1`。

**`WORKER_LISTEN_PORT`**

配置`worker-server`的端口，默认值 `1234`。

**`WORKER_GROUP`**

配置`worker-server`的分组，默认值 `default`。

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

## FAQ

### 如何通过 docker-compose 停止 dolphinscheduler？

停止所有容器:

```
docker-compose stop
```

停止所有容器并移除所有容器，网络和存储卷:

```
docker-compose down -v
```

### 如何在 Docker Swarm 上部署 dolphinscheduler？

假设 Docker Swarm 集群已经部署（如果还没有创建 Docker Swarm 集群，请参考 [create-swarm](https://docs.docker.com/engine/swarm/swarm-tutorial/create-swarm/)）

启动名为 dolphinscheduler 的 stack

```
docker stack deploy -c docker-stack.yml dolphinscheduler
```

启动并移除名为 dolphinscheduler 的 stack

```
docker stack rm dolphinscheduler
```

### 如何用 MySQL 替代 PostgreSQL 作为 DolphinScheduler 的数据库？

> 由于商业许可证的原因，我们不能直接使用 MySQL 的驱动包和客户端.
>
> 如果你要使用 MySQL, 你可以基于官方镜像 `apache/dolphinscheduler` 进行构建.

1. 下载 MySQL 驱动包 [mysql-connector-java-5.1.49.jar](https://repo1.maven.org/maven2/mysql/mysql-connector-java/5.1.49/mysql-connector-java-5.1.49.jar) (要求 `>=5.1.47`)

2. 创建一个新的 `Dockerfile`，用于添加 MySQL 的驱动包和客户端:

```
FROM apache/dolphinscheduler:latest
COPY mysql-connector-java-5.1.49.jar /opt/dolphinscheduler/lib
RUN apk add --update --no-cache mysql-client
```

3. 构建一个包含 MySQL 的驱动包和客户端的新镜像:

```
docker build -t apache/dolphinscheduler:mysql .
```

4. 修改 `docker-compose.yml` 文件中的所有 image 字段为 `apache/dolphinscheduler:mysql`

> 如果你想在 Docker Swarm 上部署 dolphinscheduler，你需要修改 `docker-stack.yml`

5. 注释 `docker-compose.yml` 文件中的 `dolphinscheduler-postgresql` 块

6. 在 `docker-compose.yml` 文件中添加 `dolphinscheduler-mysql` 服务（**可选**，你可以直接使用一个外部的 MySQL 数据库）

7. 修改 `docker-compose.yml` 文件中的所有 DATABASE 环境变量

```
DATABASE_TYPE: mysql
DATABASE_DRIVER: com.mysql.jdbc.Driver
DATABASE_HOST: dolphinscheduler-mysql
DATABASE_PORT: 3306
DATABASE_USERNAME: root
DATABASE_PASSWORD: root
DATABASE_DATABASE: dolphinscheduler
DATABASE_PARAMS: useUnicode=true&characterEncoding=UTF-8
```

> 如果你已经添加了 `dolphinscheduler-mysql` 服务，设置 `DATABASE_HOST` 为 `dolphinscheduler-mysql` 即可

8. 运行 dolphinscheduler (详见**如何使用docker镜像**)

### 如何在数据源中心支持 MySQL 数据源？

> 由于商业许可证的原因，我们不能直接使用 MySQL 的驱动包.
>
> 如果你要添加 MySQL 数据源, 你可以基于官方镜像 `apache/dolphinscheduler` 进行构建.

1. 下载 MySQL 驱动包 [mysql-connector-java-5.1.49.jar](https://repo1.maven.org/maven2/mysql/mysql-connector-java/5.1.49/mysql-connector-java-5.1.49.jar) (要求 `>=5.1.47`)

2. 创建一个新的 `Dockerfile`，用于添加 MySQL 驱动包:

```
FROM apache/dolphinscheduler:latest
COPY mysql-connector-java-5.1.49.jar /opt/dolphinscheduler/lib
```

3. 构建一个包含 MySQL 驱动包的新镜像:

```
docker build -t apache/dolphinscheduler:mysql-driver .
```

4. 将 `docker-compose.yml` 文件中的所有 image 字段 修改为 `apache/dolphinscheduler:mysql-driver`

> 如果你想在 Docker Swarm 上部署 dolphinscheduler，你需要修改 `docker-stack.yml`

5. 运行 dolphinscheduler (详见**如何使用docker镜像**)

6. 在数据源中心添加一个 MySQL 数据源

### 如何在数据源中心支持 Oracle 数据源？

> 由于商业许可证的原因，我们不能直接使用 Oracle 的驱动包.
>
> 如果你要添加 Oracle 数据源, 你可以基于官方镜像 `apache/dolphinscheduler` 进行构建.

1. 下载 Oracle 驱动包 [ojdbc8.jar](https://repo1.maven.org/maven2/com/oracle/database/jdbc/ojdbc8/) (such as `ojdbc8-19.9.0.0.jar`)

2. 创建一个新的 `Dockerfile`，用于添加 Oracle 驱动包:

```
FROM apache/dolphinscheduler:latest
COPY ojdbc8-19.9.0.0.jar /opt/dolphinscheduler/lib
```

3. 构建一个包含 Oracle 驱动包的新镜像:

```
docker build -t apache/dolphinscheduler:oracle-driver .
```

4. 将 `docker-compose.yml` 文件中的所有 image 字段 修改为 `apache/dolphinscheduler:oracle-driver`

> 如果你想在 Docker Swarm 上部署 dolphinscheduler，你需要修改 `docker-stack.yml`

5. 运行 dolphinscheduler (详见**如何使用docker镜像**)

6. 在数据源中心添加一个 Oracle 数据源

更多信息请查看 [dolphinscheduler](https://github.com/apache/dolphinscheduler.git) 文档.
