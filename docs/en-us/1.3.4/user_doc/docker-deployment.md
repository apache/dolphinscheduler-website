## Try DolphinScheduler quickly

There are 2 ways to quickly intall DolphinScheduler 

### The first way：Start with docker-compose (recommended)
In this way, you need to install docker-compose first, please install it yourself

##### 1、 Download the source code zip package

-Please download the latest version of the source code package and unzip it
```shell
mkdir -p /opt/soft/dolphinscheduler;
cd /opt/soft/dolphinscheduler;

# download source code package
wget https://mirrors.tuna.tsinghua.edu.cn/apache/incubator/dolphinscheduler/1.3.4/apache-dolphinscheduler-incubating-1.3.4-src.zip

# unzip
unzip apache-dolphinscheduler-incubating-1.3.4-src.zip
 
mv apache-dolphinscheduler-incubating-1.3.4-src-release  dolphinscheduler-src
```
##### 2、 Install and start the service
```
cd dolphinscheduler-src
docker-compose -f ./docker/docker-swarm/docker-compose.yml up -d
```

##### 3、 Login the system
Visit the front-end UI: http://192.168.xx.xx:8888
  <p align="center">
    <img src="/img/login.png" width="60%" />
  </p>
Then refer to the `Quick Start` in the chapter of the user manual to use




### The Second way: start in docker mode

##### 1. Basic software installation (please install by yourself)
  * PostgreSQL (8.2.15+)
  * ZooKeeper (3.4.6+)
  * Docker
 
##### 2. Please login to the PostgreSQL database and create a database named `dolphinscheduler`

##### 3. Initialize the database, import `sql/dolphinscheduler-postgre.sql` 

##### 4. Download the DolphinScheduler Image
```
docker pull apache/dolphinscheduler:latest
```

##### 5. Run a DolphinScheduler instance

start service: 

```
$ docker run -dit --name dolphinscheduler \
-e ZOOKEEPER_QUORUM="l92.168.x.x:2181"
-e DATABASE_HOST="192.168.x.x" -e DATABASE_PORT="5432" -e DATABASE_DATABASE="dolphinscheduler" \
-e DATABASE_USERNAME="{user}" -e DATABASE_PASSWORD="{password}" \
-p 8888:8888 \
dolphinscheduler all
```
Note: {user} and {password} need to be replaced with your database user name and password)



## Appendix

### When the container starts, the following services are automatically started:

```aidl
     MasterServer ----- master service
     WorkerServer ----- worker service
     LoggerServer ----- logger service
     ApiApplicationServer ----- api service
     AlertServer ----- alert service
```
### If you just want to run some services in dolphinscheduler

You can run some services in dolphinscheduler.

* Start a **master server**, For example:

```
$ docker run -dit --name dolphinscheduler \
-e ZOOKEEPER_QUORUM="l92.168.x.x:2181"
-e DATABASE_HOST="192.168.x.x" -e DATABASE_PORT="5432" -e DATABASE_DATABASE="dolphinscheduler" \
-e DATABASE_USERNAME="test" -e DATABASE_PASSWORD="test" \
dolphinscheduler master-server
```

* Start a **worker server**, For example:

```
$ docker run -dit --name dolphinscheduler \
-e ZOOKEEPER_QUORUM="l92.168.x.x:2181"
-e DATABASE_HOST="192.168.x.x" -e DATABASE_PORT="5432" -e DATABASE_DATABASE="dolphinscheduler" \
-e DATABASE_USERNAME="test" -e DATABASE_PASSWORD="test" \
dolphinscheduler worker-server
```

* Start a **api server**, For example:

```
$ docker run -dit --name dolphinscheduler \
-e DATABASE_HOST="192.168.x.x" -e DATABASE_PORT="5432" -e DATABASE_DATABASE="dolphinscheduler" \
-e DATABASE_USERNAME="test" -e DATABASE_PASSWORD="test" \
-p 12345:12345 \
dolphinscheduler api-server
```

* Start a **alert server**, For example:

```
$ docker run -dit --name dolphinscheduler \
-e DATABASE_HOST="192.168.x.x" -e DATABASE_PORT="5432" -e DATABASE_DATABASE="dolphinscheduler" \
-e DATABASE_USERNAME="test" -e DATABASE_PASSWORD="test" \
dolphinscheduler alert-server
```

* Start a **frontend**, For example:

```
$ docker run -dit --name dolphinscheduler \
-e FRONTEND_API_SERVER_HOST="192.168.x.x" -e FRONTEND_API_SERVER_PORT="12345" \
-p 8888:8888 \
dolphinscheduler frontend
```

**Note**: You must be specify `DATABASE_HOST` `DATABASE_PORT` `DATABASE_DATABASE` `DATABASE_USERNAME` `DATABASE_PASSWORD` `ZOOKEEPER_QUORUM` when start a standalone dolphinscheduler server.

