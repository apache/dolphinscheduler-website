## QuickStart in Docker

Here're 2 ways to quickly install DolphinScheduler

### The First Way：Start With docker-compose (Recommended)
In this way, you need to install [docker-compose](https://docs.docker.com/compose/) as a prerequisite, please install it yourself according to the rich docker-compose installation guidance on the Internet

##### 1、 Download the Source Code Zip Package

- Please download the latest version of the source code package and unzip it

```shell
mkdir -p /opt/soft/dolphinscheduler;
cd /opt/soft/dolphinscheduler;

# download source code package by wget
wget https://apache.website-solution.net/incubator/dolphinscheduler/1.3.5/apache-dolphinscheduler-incubating-1.3.5-src.zip

# download source code package by curl
curl -O https://apache.website-solution.net/incubator/dolphinscheduler/1.3.5/apache-dolphinscheduler-incubating-1.3.5-src.zip

# unzip
unzip apache-dolphinscheduler-incubating-1.3.5-src.zip

mv apache-dolphinscheduler-incubating-1.3.5-src-release dolphinscheduler-src
```

##### 2、 Install and Start the Service
```
cd dolphinscheduler-src/docker/docker-swarm
docker-compose up -d
```

##### 3、 Login
Visit the front-end UI: http://{your host ip}:12345/dolphinscheduler

The default username is `admin` and the default password is `dolphinscheduler123`
  <p align="center">
    <img src="/img/login_en.png" width="60%" />
  </p>
Please refer to the `Quick Start` in the chapter 'User Manual' to explore how to use DolphinScheduler

### The Second way: Start in the Docker Mode
In this way, you need to install [docker](https://docs.docker.com/engine/install/) as a prerequisite, please install it yourself according to the rich docker installation guidance on the Internet

##### 1. Basic Required Software (please install by yourself)
  * PostgreSQL (8.2.15+)
  * ZooKeeper (3.4.6+)
  * Docker

##### 2. Please login to the PostgreSQL database and create a database named `dolphinscheduler`

##### 3. Initialize the database, import `sql/dolphinscheduler-postgre.sql` to create tables and initial data

##### 4. Download the DolphinScheduler Image
We have already uploaded user-oriented DolphinScheduler image to the Docker repository so that you can pull the image from the docker repository and self-build image not needed:
```
docker pull apache/dolphinscheduler:latest
```

##### 5. Run a DolphinScheduler Instance
Check follows:

```
$ docker run -d --name dolphinscheduler \
-e ZOOKEEPER_QUORUM="192.168.x.x:2181" \
-e DATABASE_HOST="192.168.x.x" -e DATABASE_PORT="5432" -e DATABASE_DATABASE="dolphinscheduler" \
-e DATABASE_USERNAME="test" -e DATABASE_PASSWORD="test" \
-p 12345:12345 \
apache/dolphinscheduler:latest all
```
Note: {username} and {password} need to be replaced with your database username and password, 192.168.x.x need to be replaced with your relate zookeeper or database host IP

##### 6. Login
The default username is `admin` and the default password is `dolphinscheduler123`

Visit the front-end UI:  http://{your host ip}:12345/dolphinscheduler
  <p align="center">
    <img src="/img/login_en.png" width="60%" />
  </p>
Please refer to the `Quick Start` in the chapter 'User Manual' to explore how to use DolphinScheduler

## Appendix

### The following services are automatically started when the container starts:

```
     MasterServer         ----- master service
     WorkerServer         ----- worker service
     LoggerServer         ----- logger service
     ApiApplicationServer ----- api service
     AlertServer          ----- alert service
```
### If you just want to run part of the services in the DolphinScheduler

You can start selected services in DolphinScheduler by run the following commands.

* Create a **local volume** for resource storage, For example:

```
docker volume create dolphinscheduler-resource-local
```

* Start a **master server**, For example:

```
$ docker run -d --name dolphinscheduler-master \
-e ZOOKEEPER_QUORUM="192.168.x.x:2181" \
-e DATABASE_HOST="192.168.x.x" -e DATABASE_PORT="5432" -e DATABASE_DATABASE="dolphinscheduler" \
-e DATABASE_USERNAME="test" -e DATABASE_PASSWORD="test" \
apache/dolphinscheduler:latest master-server
```

* Start a **worker server** (including **logger server**), For example:

```
$ docker run -d --name dolphinscheduler-worker \
-e ZOOKEEPER_QUORUM="192.168.x.x:2181" \
-e DATABASE_HOST="192.168.x.x" -e DATABASE_PORT="5432" -e DATABASE_DATABASE="dolphinscheduler" \
-e DATABASE_USERNAME="test" -e DATABASE_PASSWORD="test" \
-v dolphinscheduler-resource-local:/dolphinscheduler \
apache/dolphinscheduler:latest worker-server
```

* Start a **api server**, For example:

```
$ docker run -d --name dolphinscheduler-api \
-e ZOOKEEPER_QUORUM="192.168.x.x:2181" \
-e DATABASE_HOST="192.168.x.x" -e DATABASE_PORT="5432" -e DATABASE_DATABASE="dolphinscheduler" \
-e DATABASE_USERNAME="test" -e DATABASE_PASSWORD="test" \
-v dolphinscheduler-resource-local:/dolphinscheduler \
-p 12345:12345 \
apache/dolphinscheduler:latest api-server
```

* Start a **alert server**, For example:

```
$ docker run -d --name dolphinscheduler-alert \
-e DATABASE_HOST="192.168.x.x" -e DATABASE_PORT="5432" -e DATABASE_DATABASE="dolphinscheduler" \
-e DATABASE_USERNAME="test" -e DATABASE_PASSWORD="test" \
apache/dolphinscheduler:latest alert-server
```

**Note**: You must specify the following environment variables: `DATABASE_HOST` `DATABASE_PORT` `DATABASE_DATABASE` `DATABASE_USERNAME` `DATABASE_PASSWORD` `ZOOKEEPER_QUORUM` when start part of the DolphinScheduler services.

## Environment Variables

The DolphinScheduler Docker container is configured through environment variables, and the default value will be used if an environment variable is not set.

**`DATABASE_TYPE`**

This environment variable sets the type for database. The default value is `postgresql`.

**Note**: You must be specify it when start a standalone dolphinscheduler server. Like `master-server`, `worker-server`, `api-server`, `alert-server`.

**`DATABASE_DRIVER`**

This environment variable sets the type for database. The default value is `org.postgresql.Driver`.

**Note**: You must be specify it when start a standalone dolphinscheduler server. Like `master-server`, `worker-server`, `api-server`, `alert-server`.

**`DATABASE_HOST`**

This environment variable sets the host for database. The default value is `127.0.0.1`.

**Note**: You must be specify it when start a standalone dolphinscheduler server. Like `master-server`, `worker-server`, `api-server`, `alert-server`.

**`DATABASE_PORT`**

This environment variable sets the port for database. The default value is `5432`.

**Note**: You must be specify it when start a standalone dolphinscheduler server. Like `master-server`, `worker-server`, `api-server`, `alert-server`.

**`DATABASE_USERNAME`**

This environment variable sets the username for database. The default value is `root`.

**Note**: You must be specify it when start a standalone dolphinscheduler server. Like `master-server`, `worker-server`, `api-server`, `alert-server`.

**`DATABASE_PASSWORD`**

This environment variable sets the password for database. The default value is `root`.

**Note**: You must be specify it when start a standalone dolphinscheduler server. Like `master-server`, `worker-server`, `api-server`, `alert-server`.

**`DATABASE_DATABASE`**

This environment variable sets the database for database. The default value is `dolphinscheduler`.

**Note**: You must be specify it when start a standalone dolphinscheduler server. Like `master-server`, `worker-server`, `api-server`, `alert-server`.

**`DATABASE_PARAMS`**

This environment variable sets the database for database. The default value is `characterEncoding=utf8`.

**Note**: You must be specify it when start a standalone dolphinscheduler server. Like `master-server`, `worker-server`, `api-server`, `alert-server`.

**`DOLPHINSCHEDULER_ENV_PATH`**

This environment variable sets the runtime environment for task. The default value is `/opt/dolphinscheduler/conf/env/dolphinscheduler_env.sh`.

**`DOLPHINSCHEDULER_DATA_BASEDIR_PATH`**

User data directory path, self configuration, please make sure the directory exists and have read write permissions. The default value is `/tmp/dolphinscheduler`

**`RESOURCE_STORAGE_TYPE`**

This environment variable sets resource storage type for dolphinscheduler like `HDFS`, `S3`, `NONE`. The default value is `HDFS`.

**`RESOURCE_UPLOAD_PATH`**

This environment variable sets resource store path on HDFS/S3 for resource storage. The default value is `/dolphinscheduler`.

**`FS_DEFAULT_FS`**

This environment variable sets fs.defaultFS for resource storage like `file:///`, `hdfs://mycluster:8020` or `s3a://dolphinscheduler`. The default value is `file:///`.

**`FS_S3A_ENDPOINT`**

This environment variable sets s3 endpoint for resource storage. The default value is `s3.xxx.amazonaws.com`.

**`FS_S3A_ACCESS_KEY`**

This environment variable sets s3 access key for resource storage. The default value is `xxxxxxx`.

**`FS_S3A_SECRET_KEY`**

This environment variable sets s3 secret key for resource storage. The default value is `xxxxxxx`.

**`ZOOKEEPER_QUORUM`**

This environment variable sets zookeeper quorum for `master-server` and `worker-serverr`. The default value is `127.0.0.1:2181`.

**Note**: You must be specify it when start a standalone dolphinscheduler server. Like `master-server`, `worker-server`.

**`ZOOKEEPER_ROOT`**

This environment variable sets zookeeper root directory for dolphinscheduler. The default value is `/dolphinscheduler`.

**`MASTER_EXEC_THREADS`**

This environment variable sets exec thread num for `master-server`. The default value is `100`.

**`MASTER_EXEC_TASK_NUM`**

This environment variable sets exec task num for `master-server`. The default value is `20`.

**`MASTER_HEARTBEAT_INTERVAL`**

This environment variable sets heartbeat interval for `master-server`. The default value is `10`.

**`MASTER_TASK_COMMIT_RETRYTIMES`**

This environment variable sets task commit retry times for `master-server`. The default value is `5`.

**`MASTER_TASK_COMMIT_INTERVAL`**

This environment variable sets task commit interval for `master-server`. The default value is `1000`.

**`MASTER_MAX_CPULOAD_AVG`**

This environment variable sets max cpu load avg for `master-server`. The default value is `100`.

**`MASTER_RESERVED_MEMORY`**

This environment variable sets reserved memory for `master-server`. The default value is `0.1`.

**`MASTER_LISTEN_PORT`**

This environment variable sets port for `master-server`. The default value is `5678`.

**`WORKER_EXEC_THREADS`**

This environment variable sets exec thread num for `worker-server`. The default value is `100`.

**`WORKER_HEARTBEAT_INTERVAL`**

This environment variable sets heartbeat interval for `worker-server`. The default value is `10`.

**`WORKER_MAX_CPULOAD_AVG`**

This environment variable sets max cpu load avg for `worker-server`. The default value is `100`.

**`WORKER_RESERVED_MEMORY`**

This environment variable sets reserved memory for `worker-server`. The default value is `0.1`.

**`WORKER_LISTEN_PORT`**

This environment variable sets port for `worker-server`. The default value is `1234`.

**`WORKER_GROUP`**

This environment variable sets group for `worker-server`. The default value is `default`.

**`XLS_FILE_PATH`**

This environment variable sets xls file path for `alert-server`. The default value is `/tmp/xls`.

**`MAIL_SERVER_HOST`**

This environment variable sets mail server host for `alert-server`. The default value is empty.

**`MAIL_SERVER_PORT`**

This environment variable sets mail server port for `alert-server`. The default value is empty.

**`MAIL_SENDER`**

This environment variable sets mail sender for `alert-server`. The default value is empty.

**`MAIL_USER=`**

This environment variable sets mail user for `alert-server`. The default value is empty.

**`MAIL_PASSWD`**

This environment variable sets mail password for `alert-server`. The default value is empty.

**`MAIL_SMTP_STARTTLS_ENABLE`**

This environment variable sets SMTP tls for `alert-server`. The default value is `true`.

**`MAIL_SMTP_SSL_ENABLE`**

This environment variable sets SMTP ssl for `alert-server`. The default value is `false`.

**`MAIL_SMTP_SSL_TRUST`**

This environment variable sets SMTP ssl truest for `alert-server`. The default value is empty.

**`ENTERPRISE_WECHAT_ENABLE`**

This environment variable sets enterprise wechat enable for `alert-server`. The default value is `false`.

**`ENTERPRISE_WECHAT_CORP_ID`**

This environment variable sets enterprise wechat corp id for `alert-server`. The default value is empty.

**`ENTERPRISE_WECHAT_SECRET`**

This environment variable sets enterprise wechat secret for `alert-server`. The default value is empty.

**`ENTERPRISE_WECHAT_AGENT_ID`**

This environment variable sets enterprise wechat agent id for `alert-server`. The default value is empty.

**`ENTERPRISE_WECHAT_USERS`**

This environment variable sets enterprise wechat users for `alert-server`. The default value is empty.

## FAQ

### How to stop dolphinscheduler by docker-compose?

Stop containers:

```
docker-compose stop
```

Stop containers and remove containers, networks and volumes:

```
docker-compose down -v
```

### How to deploy dolphinscheduler on Docker Swarm?

Assuming that the Docker Swarm cluster has been created (If there is no Docker Swarm cluster, please refer to [create-swarm](https://docs.docker.com/engine/swarm/swarm-tutorial/create-swarm/))

Start a stack named dolphinscheduler

```
docker stack deploy -c docker-stack.yml dolphinscheduler
```

Stop and remove the stack named dolphinscheduler

```
docker stack rm dolphinscheduler
```

### How to use MySQL as the DolphinScheduler's database instead of PostgreSQL?

> Because of the commercial license, we cannot directly use the driver and client of MySQL.
>
> If you want to use MySQL, you can build a new image based on the `apache/dolphinscheduler` image as follows.

1. Download the MySQL driver [mysql-connector-java-5.1.49.jar](https://repo1.maven.org/maven2/mysql/mysql-connector-java/5.1.49/mysql-connector-java-5.1.49.jar) (require `>=5.1.47`)

2. Create a new `Dockerfile` to add MySQL driver and client:

```
FROM apache/dolphinscheduler:latest
COPY mysql-connector-java-5.1.49.jar /opt/dolphinscheduler/lib
RUN apk add --update --no-cache mysql-client
```

3. Build a new docker image including MySQL driver and client:

```
docker build -t apache/dolphinscheduler:mysql .
```

4. Modify all `image` fields to `apache/dolphinscheduler:mysql` in `docker-compose.yml`

> If you want to deploy dolphinscheduler on Docker Swarm, you need modify `docker-stack.yml`

5. Comment the `dolphinscheduler-postgresql` block in `docker-compose.yml`

6. Add `dolphinscheduler-mysql` service in `docker-compose.yml` (**Optional**, you can directly use a external MySQL database)

7. Modify all DATABASE environments in `docker-compose.yml`

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

> If you have added `dolphinscheduler-mysql` service in `docker-compose.yml`, just set `DATABASE_HOST` to `dolphinscheduler-mysql`

8. Run a dolphinscheduler (See **How to use this docker image**)

### How to support MySQL datasource in `Datasource manage`?

> Because of the commercial license, we cannot directly use the driver of MySQL.
>
> If you want to add MySQL datasource, you can build a new image based on the `apache/dolphinscheduler` image as follows.

1. Download the MySQL driver [mysql-connector-java-5.1.49.jar](https://repo1.maven.org/maven2/mysql/mysql-connector-java/5.1.49/mysql-connector-java-5.1.49.jar) (require `>=5.1.47`)

2. Create a new `Dockerfile` to add MySQL driver:

```
FROM apache/dolphinscheduler:latest
COPY mysql-connector-java-5.1.49.jar /opt/dolphinscheduler/lib
```

3. Build a new docker image including MySQL driver:

```
docker build -t apache/dolphinscheduler:mysql-driver .
```

4. Modify all `image` fields to `apache/dolphinscheduler:mysql-driver` in `docker-compose.yml`

> If you want to deploy dolphinscheduler on Docker Swarm, you need modify `docker-stack.yml`

5. Run a dolphinscheduler (See **How to use this docker image**)

6. Add a MySQL datasource in `Datasource manage`

### How to support Oracle datasource in `Datasource manage`?

> Because of the commercial license, we cannot directly use the driver of Oracle.
>
> If you want to add Oracle datasource, you can build a new image based on the `apache/dolphinscheduler` image as follows.

1. Download the Oracle driver [ojdbc8.jar](https://repo1.maven.org/maven2/com/oracle/database/jdbc/ojdbc8/) (such as `ojdbc8-19.9.0.0.jar`)

2. Create a new `Dockerfile` to add Oracle driver:

```
FROM apache/dolphinscheduler:latest
COPY ojdbc8-19.9.0.0.jar /opt/dolphinscheduler/lib
```

3. Build a new docker image including Oracle driver:

```
docker build -t apache/dolphinscheduler:oracle-driver .
```

4. Modify all `image` fields to `apache/dolphinscheduler:oracle-driver` in `docker-compose.yml`

> If you want to deploy dolphinscheduler on Docker Swarm, you need modify `docker-stack.yml`

5. Run a dolphinscheduler (See **How to use this docker image**)

6. Add a Oracle datasource in `Datasource manage`

For more information please refer to the [incubator-dolphinscheduler](https://github.com/apache/incubator-dolphinscheduler.git) documentation.
