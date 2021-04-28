# 快速试用 Docker 部署

## 先决条件

 - [Docker](https://docs.docker.com/engine/install/) 1.13.1+
 - [Docker Compose](https://docs.docker.com/compose/) 1.11.0+

## 如何使用 Docker 镜像

有 3 种方式可以快速试用 DolphinScheduler

### 一、以 docker-compose 的方式启动 DolphinScheduler (推荐)

这种方式需要先安装 [docker-compose](https://docs.docker.com/compose/) , docker-compose 的安装网上已经有非常多的资料，请自行安装即可

#### 1、下载源码包

请下载最新版本的源码包，下载地址: [下载](/zh-cn/download/download.html)

下载 apache-dolphinscheduler-1.3.6-src.tar.gz 后，解压缩

```shell
$ tar -zxvf apache-dolphinscheduler-1.3.6-src.tar.gz
```

#### 2、安装并启动服务

```shell
$ cd apache-dolphinscheduler-1.3.6-src/docker/docker-swarm
$ docker-compose up -d
```

#### 3、登录系统

访问前端页面： http://192.168.xx.xx:12345/dolphinscheduler

默认的用户是`admin`，默认的密码是`dolphinscheduler123`

<p align="center">
  <img src="/img/login.png" width="60%" />
</p>

请参考用户手册章节的[快速上手](/zh-cn/docs/1.3.6/user_doc/quick-start.html)查看如何使用DolphinScheduler

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
docker pull apache/dolphinscheduler:1.3.6
```

#### 5、运行一个 DolphinScheduler 实例

```
$ docker run -d --name dolphinscheduler \
-e DATABASE_HOST="192.168.x.x" -e DATABASE_PORT="5432" -e DATABASE_DATABASE="dolphinscheduler" \
-e DATABASE_USERNAME="test" -e DATABASE_PASSWORD="test" \
-e ZOOKEEPER_QUORUM="192.168.x.x:2181" \
-p 12345:12345 \
apache/dolphinscheduler:1.3.6 all
```

注：数据库用户和密码需要替换为具体的数据库用户名和密码，192.168.x.x 需要替换为 zookeeper 和 数据库的主机 IP

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
apache/dolphinscheduler:1.3.6 master-server
```

* 启动一个 **worker server** (包括 **logger server**), 如下:

```
$ docker run -d --name dolphinscheduler-worker \
-e DATABASE_HOST="192.168.x.x" -e DATABASE_PORT="5432" -e DATABASE_DATABASE="dolphinscheduler" \
-e DATABASE_USERNAME="test" -e DATABASE_PASSWORD="test" \
-e ZOOKEEPER_QUORUM="192.168.x.x:2181" \
apache/dolphinscheduler:1.3.6 worker-server
```

* 启动一个 **api server**, 如下:

```
$ docker run -d --name dolphinscheduler-api \
-e DATABASE_HOST="192.168.x.x" -e DATABASE_PORT="5432" -e DATABASE_DATABASE="dolphinscheduler" \
-e DATABASE_USERNAME="test" -e DATABASE_PASSWORD="test" \
-e ZOOKEEPER_QUORUM="192.168.x.x:2181" \
-p 12345:12345 \
apache/dolphinscheduler:1.3.6 api-server
```

* 启动一个 **alert server**, 如下:

```
$ docker run -d --name dolphinscheduler-alert \
-e DATABASE_HOST="192.168.x.x" -e DATABASE_PORT="5432" -e DATABASE_DATABASE="dolphinscheduler" \
-e DATABASE_USERNAME="test" -e DATABASE_PASSWORD="test" \
apache/dolphinscheduler:1.3.6 alert-server
```

**注意**: 当你运行dolphinscheduler中的部分服务时，你必须指定这些环境变量 `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_DATABASE`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`, `ZOOKEEPER_QUORUM`。

## 如何构建一个 Docker 镜像

你可以在类Unix系统和Windows系统中构建一个docker镜像。

类Unix系统, 如下:

```bash
$ sh ./docker/build/hooks/build
```

Windows系统, 如下:

```bat
C:\dolphinscheduler>.\docker\build\hooks\build.bat
```

如果你不理解 `./docker/build/hooks/build` `./docker/build/hooks/build.bat` 这些脚本，请阅读里面的内容

## 环境变量

Docker 容器通过环境变量进行配置，[DolphinScheduler Docker 环境变量](https://github.com/apache/dolphinscheduler/blob/1.3.6/docker/build/README_zh_CN.md#%E7%8E%AF%E5%A2%83%E5%8F%98%E9%87%8F) 列出了 DolphinScheduler 的可配置环境变量及其默认值

特别地，在 Docker Compose 和 Docker Swarm 中，可以分别通过环境变量配置文件 `docker-compose.yml` 和 `docker-stack.yml` 进行配置

## FAQ

### 如何通过 docker-compose 停止 DolphinScheduler？

停止所有容器:

```
docker-compose stop
```

停止所有容器并移除所有容器，网络和存储卷:

```
docker-compose down -v
```

### 如何在 Docker Swarm 上部署 DolphinScheduler？

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
FROM apache/dolphinscheduler:1.3.6
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
FROM apache/dolphinscheduler:1.3.6
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
FROM apache/dolphinscheduler:1.3.6
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
