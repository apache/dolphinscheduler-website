## 快速试用 DolphinScheduler

有 2 种方式可以快速试用 DolphinScheduler，分别介绍
### 一、以 docker-compose 的方式启动(推荐)
这种方式需要先安装 docker-compose , docker-compose 的安装网上已经有非常多的资料，请自行安装即可

##### 1、下载源码 zip 包

- 请下载最新版本的源码包并进行解压

```shell
# 创建源码存放目录
mkdir -p /opt/soft/dolphinscheduler;
cd /opt/soft/dolphinscheduler;

# 下载源码包
wget https://mirrors.tuna.tsinghua.edu.cn/apache/incubator/dolphinscheduler/1.3.4/apache-dolphinscheduler-incubating-1.3.4-src.zip

# 解压缩
unzip apache-dolphinscheduler-incubating-1.3.4-src.zip
 
mv apache-dolphinscheduler-incubating-1.3.4-src-release  dolphinscheduler-src
```

##### 2、安装并启动服务
```
cd dolphinscheduler-src
docker-compose -f ./docker/docker-swarm/docker-compose.yml up -d
```

##### 3、登录系统   
访问前端界面： http://192.168.xx.xx:8888
 <p align="center">
   <img src="/img/login.png" width="60%" />
 </p>
然后参考用户手册章节的`快速上手`即可进行使用


下面介绍第 2 种方式
### 二、以 docker 方式启动
这种方式需要先安装 docker , docker 的安装网上已经有非常多的资料，请自行安装即可
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

如下:(注: {user} 和 {password} 需要替换为具体的数据库用户名和密码)

```
$ docker run -dit --name dolphinscheduler \
-e ZOOKEEPER_QUORUM="l92.168.x.x:2181"
-e DATABASE_HOST="192.168.x.x" -e DATABASE_PORT="5432" -e DATABASE_DATABASE="dolphinscheduler" \
-e DATABASE_USERNAME="{user}" -e DATABASE_PASSWORD="{password}" \
-p 8888:8888 \
dolphinscheduler all
```
##### 6、登录系统   
访问前端界面： http://192.168.xx.xx:8888
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

你能够通执行以下指令仅运行dolphinscheduler中的部分服务。

* 启动一个 **master server**, 如下:

```
$ docker run -dit --name dolphinscheduler \
-e ZOOKEEPER_QUORUM="l92.168.x.x:2181"
-e DATABASE_HOST="192.168.x.x" -e DATABASE_PORT="5432" -e DATABASE_DATABASE="dolphinscheduler" \
-e DATABASE_USERNAME="test" -e DATABASE_PASSWORD="test" \
dolphinscheduler master-server
```

* 启动一个 **worker server**, 如下:

```
$ docker run -dit --name dolphinscheduler \
-e ZOOKEEPER_QUORUM="l92.168.x.x:2181"
-e DATABASE_HOST="192.168.x.x" -e DATABASE_PORT="5432" -e DATABASE_DATABASE="dolphinscheduler" \
-e DATABASE_USERNAME="test" -e DATABASE_PASSWORD="test" \
dolphinscheduler worker-server
```

* 启动一个 **api server**, 如下:

```
$ docker run -dit --name dolphinscheduler \
-e DATABASE_HOST="192.168.x.x" -e DATABASE_PORT="5432" -e DATABASE_DATABASE="dolphinscheduler" \
-e DATABASE_USERNAME="test" -e DATABASE_PASSWORD="test" \
-p 12345:12345 \
dolphinscheduler api-server
```

* 启动一个 **alert server**, 如下:

```
$ docker run -dit --name dolphinscheduler \
-e DATABASE_HOST="192.168.x.x" -e DATABASE_PORT="5432" -e DATABASE_DATABASE="dolphinscheduler" \
-e DATABASE_USERNAME="test" -e DATABASE_PASSWORD="test" \
dolphinscheduler alert-server
```

* 启动一个 **frontend**, 如下:

```
$ docker run -dit --name dolphinscheduler \
-e FRONTEND_API_SERVER_HOST="192.168.x.x" -e FRONTEND_API_SERVER_PORT="12345" \
-p 8888:8888 \
dolphinscheduler frontend
```

**注意**: 当你运行dolphinscheduler中的部分服务时，你必须指定这些环境变量 `DATABASE_HOST` `DATABASE_PORT` `DATABASE_DATABASE` `DATABASE_USERNAME` `DATABASE_PASSWORD` `ZOOKEEPER_QUORUM`。




