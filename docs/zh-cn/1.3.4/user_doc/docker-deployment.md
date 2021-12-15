# 快速试用 Docker 部署

## 先决条件

 - [Docker](https://docs.docker.com/engine/install/) 1.13.1+
 - [Docker Compose](https://docs.docker.com/compose/) 1.11.0+

## 如何使用 Docker 镜像

有 3 种方式可以快速试用 DolphinScheduler

### 一、以 docker-compose 的方式启动 DolphinScheduler (推荐)

这种方式需要先安装 [docker-compose](https://docs.docker.com/compose/), docker-compose 的安装网上已经有非常多的资料，请自行安装即可

#### 1、下载源码包

请下载源码包 apache-dolphinscheduler-incubating-1.3.4-src.zip，下载地址: [下载](https://dolphinscheduler.apache.org/zh-cn/download/download.html)

#### 2、拉取镜像并启动服务

```
$ unzip apache-dolphinscheduler-incubating-1.3.4-src.zip
$ cd apache-dolphinscheduler-incubating-1.3.4-src-release/docker/docker-swarm
$ docker pull dolphinscheduler.docker.scarf.sh/apache/dolphinscheduler:1.3.4
$ docker tag apache/dolphinscheduler:1.3.4 apache/dolphinscheduler:latest
$ docker-compose up -d
```

**PostgreSQL** (用户 `root`, 密码 `root`, 数据库 `dolphinscheduler`) 和 **ZooKeeper** 服务将会默认启动

#### 3、登录系统

访问前端页面： http://192.168.xx.xx:8888 (本地地址为 http://127.0.0.1:8888)

默认的用户是`admin`，默认的密码是`dolphinscheduler123`

<p align="center">
  <img src="/img/login.png" width="60%" />
</p>

请参考用户手册章节的[快速上手](/zh-cn/docs/1.3.4/user_doc/quick-start.html)查看如何使用DolphinScheduler

### 二、通过指定已存在的 PostgreSQL 和 ZooKeeper 服务

这种方式需要先安装 [docker](https://docs.docker.com/engine/install/), docker 的安装网上已经有非常多的资料，请自行安装即可

#### 1、基础软件安装 (请自行安装)

 - PostgreSQL (8.2.15+)
 - ZooKeeper (3.4.6+)
 - Docker (1.13.1+)

#### 2、请登录 PostgreSQL 数据库，创建名为 `dolphinscheduler` 数据库

#### 3、初始化数据库，导入 `sql/dolphinscheduler-postgre.sql` 进行创建表及基础数据导入

#### 4、下载 DolphinScheduler 镜像

我们已将面向用户的 DolphinScheduler 镜像上传至 docker 仓库，用户无需在本地构建镜像，直接执行以下命令从 docker 仓库 pull 镜像：

```
docker pull dolphinscheduler.docker.scarf.sh/apache/dolphinscheduler:1.3.4
```

#### 5、运行一个 DolphinScheduler 实例

```
$ docker run -d --name dolphinscheduler \
-e DATABASE_HOST="192.168.x.x" -e DATABASE_PORT="5432" -e DATABASE_DATABASE="dolphinscheduler" \
-e DATABASE_USERNAME="test" -e DATABASE_PASSWORD="test" \
-e ZOOKEEPER_QUORUM="192.168.x.x:2181" \
-p 8888:8888 \
apache/dolphinscheduler:1.3.4 all
```

注：数据库用户 test 和密码 test 需要替换为实际的 PostgreSQL 用户和密码，192.168.x.x 需要替换为 PostgreSQL 和 ZooKeeper 的主机 IP

#### 6、登录系统

同上

### 三、运行 DolphinScheduler 中的独立服务

在容器启动时，会自动启动以下服务：

```
    MasterServer         ----- master服务
    WorkerServer         ----- worker服务
    LoggerServer         ----- logger服务
    ApiApplicationServer ----- api服务
    AlertServer          ----- alert服务
```

如果你只是想运行 dolphinscheduler 中的部分服务

你可以够通执行以下命令来运行dolphinscheduler中的部分服务

* 启动一个 **master server**, 如下:

```
$ docker run -d --name dolphinscheduler-master \
-e DATABASE_HOST="192.168.x.x" -e DATABASE_PORT="5432" -e DATABASE_DATABASE="dolphinscheduler" \
-e DATABASE_USERNAME="test" -e DATABASE_PASSWORD="test" \
-e ZOOKEEPER_QUORUM="192.168.x.x:2181" \
apache/dolphinscheduler:1.3.4 master-server
```

* 启动一个 **worker server** (包括 **logger server**), 如下:

```
$ docker run -d --name dolphinscheduler-worker \
-e DATABASE_HOST="192.168.x.x" -e DATABASE_PORT="5432" -e DATABASE_DATABASE="dolphinscheduler" \
-e DATABASE_USERNAME="test" -e DATABASE_PASSWORD="test" \
-e ZOOKEEPER_QUORUM="192.168.x.x:2181" \
apache/dolphinscheduler:1.3.4 worker-server
```

* 启动一个 **api server**, 如下:

```
$ docker run -d --name dolphinscheduler-api \
-e DATABASE_HOST="192.168.x.x" -e DATABASE_PORT="5432" -e DATABASE_DATABASE="dolphinscheduler" \
-e DATABASE_USERNAME="test" -e DATABASE_PASSWORD="test" \
-e ZOOKEEPER_QUORUM="192.168.x.x:2181" \
-p 12345:12345 \
apache/dolphinscheduler:1.3.4 api-server
```

* 启动一个 **alert server**, 如下:

```
$ docker run -d --name dolphinscheduler-alert \
-e DATABASE_HOST="192.168.x.x" -e DATABASE_PORT="5432" -e DATABASE_DATABASE="dolphinscheduler" \
-e DATABASE_USERNAME="test" -e DATABASE_PASSWORD="test" \
apache/dolphinscheduler:1.3.4 alert-server
```

* 启动一个 **frontend**, 如下:

```
$ docker run -d --name dolphinscheduler-frontend \
-e FRONTEND_API_SERVER_HOST="192.168.x.x" -e FRONTEND_API_SERVER_PORT="12345" \
-p 8888:8888 \
apache/dolphinscheduler:1.3.4 frontend
```

**注意**: 当你运行dolphinscheduler中的部分服务时，你必须指定这些环境变量 `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_DATABASE`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`, `ZOOKEEPER_QUORUM`。
