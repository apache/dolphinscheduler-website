# QuickStart in Docker

## Prerequisites

 - [Docker](https://docs.docker.com/engine/install/) 1.13.1+
 - [Docker Compose](https://docs.docker.com/compose/) 1.11.0+

## How to use this Docker image

Here're 3 ways to quickly install DolphinScheduler

### The First Way: Start a DolphinScheduler by docker-compose (recommended)

In this way, you need to install [docker-compose](https://docs.docker.com/compose/) as a prerequisite, please install it yourself according to the rich docker-compose installation guidance on the Internet

#### 1. Download the Source Code Package

Please download the latest version of the source code package, download address: [download](/en-us/download/download.html)

After downloading apache-dolphinscheduler-1.3.6-src.tar.gz, unzip it

```shell
$ tar -zxvf apache-dolphinscheduler-1.3.6-src.tar.gz
```

#### 2. Install and Start the Service

```shell
$ cd apache-dolphinscheduler-1.3.6-src/docker/docker-swarm
$ docker-compose up -d
```

#### 3. Login

Visit the Web UI: http://192.168.xx.xx:12345/dolphinscheduler

The default username is `admin` and the default password is `dolphinscheduler123`

<p align="center">
  <img src="/img/login_en.png" width="60%" />
</p>

Please refer to the `Quick Start` in the chapter [User Manual](/en-us/docs/1.3.6/user_doc/quick-start.html) to explore how to use DolphinScheduler

### The Second Way: Start via specifying the existing PostgreSQL and ZooKeeper service

In this way, you need to install [docker](https://docs.docker.com/engine/install/) as a prerequisite, please install it yourself according to the rich docker installation guidance on the Internet

#### 1. Basic Required Software (please install by yourself)

 - PostgreSQL (8.2.15+)
 - ZooKeeper (3.4.6+)
 - Docker (1.13.1+)

#### 2. Please login to the PostgreSQL database and create a database named `dolphinscheduler`

#### 3. Initialize the database, import `sql/dolphinscheduler-postgre.sql` to create tables and initial data

#### 4. Download the DolphinScheduler Image

We have already uploaded user-oriented DolphinScheduler image to the Docker repository so that you can pull the image from the docker repository:

```
docker pull apache/dolphinscheduler:1.3.6
```

#### 5. Run a DolphinScheduler Instance

```
$ docker run -d --name dolphinscheduler \
-e DATABASE_HOST="192.168.x.x" -e DATABASE_PORT="5432" -e DATABASE_DATABASE="dolphinscheduler" \
-e DATABASE_USERNAME="test" -e DATABASE_PASSWORD="test" \
-e ZOOKEEPER_QUORUM="192.168.x.x:2181" \
-p 12345:12345 \
apache/dolphinscheduler:1.3.6 all
```

Note: database username and password need to be replaced with your database username and password, 192.168.x.x need to be replaced with your relate zookeeper or database host IP

#### 6. Login

Same as above

### The Third Way: Start a standalone DolphinScheduler server

The following services are automatically started when the container starts:

```
     MasterServer         ----- master service
     WorkerServer         ----- worker service
     LoggerServer         ----- logger service
     ApiApplicationServer ----- api service
     AlertServer          ----- alert service
```

If you just want to run part of the services in the DolphinScheduler

You can start some services in DolphinScheduler by running the following commands.

* Start a **master server**, For example:

```
$ docker run -d --name dolphinscheduler-master \
-e DATABASE_HOST="192.168.x.x" -e DATABASE_PORT="5432" -e DATABASE_DATABASE="dolphinscheduler" \
-e DATABASE_USERNAME="test" -e DATABASE_PASSWORD="test" \
-e ZOOKEEPER_QUORUM="192.168.x.x:2181" \
apache/dolphinscheduler:1.3.6 master-server
```

* Start a **worker server** (including **logger server**), For example:

```
$ docker run -d --name dolphinscheduler-worker \
-e DATABASE_HOST="192.168.x.x" -e DATABASE_PORT="5432" -e DATABASE_DATABASE="dolphinscheduler" \
-e DATABASE_USERNAME="test" -e DATABASE_PASSWORD="test" \
-e ZOOKEEPER_QUORUM="192.168.x.x:2181" \
apache/dolphinscheduler:1.3.6 worker-server
```

* Start a **api server**, For example:

```
$ docker run -d --name dolphinscheduler-api \
-e DATABASE_HOST="192.168.x.x" -e DATABASE_PORT="5432" -e DATABASE_DATABASE="dolphinscheduler" \
-e DATABASE_USERNAME="test" -e DATABASE_PASSWORD="test" \
-e ZOOKEEPER_QUORUM="192.168.x.x:2181" \
-p 12345:12345 \
apache/dolphinscheduler:1.3.6 api-server
```

* Start a **alert server**, For example:

```
$ docker run -d --name dolphinscheduler-alert \
-e DATABASE_HOST="192.168.x.x" -e DATABASE_PORT="5432" -e DATABASE_DATABASE="dolphinscheduler" \
-e DATABASE_USERNAME="test" -e DATABASE_PASSWORD="test" \
apache/dolphinscheduler:1.3.6 alert-server
```

**Note**: You must be specify `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_DATABASE`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`, `ZOOKEEPER_QUORUM` when start a standalone dolphinscheduler server.

## How to build a Docker image

You can build a docker image in A Unix-like operating system, and you can also build it in Windows operating system.

In Unix-Like, Example:

```bash
$ sh ./docker/build/hooks/build
```

In Windows, Example:

```bat
C:\dolphinscheduler>.\docker\build\hooks\build.bat
```

Please read `./docker/build/hooks/build` `./docker/build/hooks/build.bat` script files if you don't understand

## Environment Variables

The Docker container is configured through environment variables, and the [DolphinScheduler Docker Environment Variables](https://github.com/apache/dolphinscheduler/blob/1.3.6/docker/build/README.md#environment-variables) lists the configurable environment variables of the DolphinScheduler chart and their default values

Especially, it can be configured through the environment variable configuration file `docker-compose.yml` and `docker-stack.yml` in Docker Compose and Docker Swarm separately

## FAQ

### How to stop DolphinScheduler by docker-compose?

Stop containers:

```
docker-compose stop
```

Stop containers and remove containers, networks and volumes:

```
docker-compose down -v
```

### How to deploy DolphinScheduler on Docker Swarm?

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
FROM apache/dolphinscheduler:1.3.6
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

7. Modify all DATABASE environment variables in `docker-compose.yml`

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
FROM apache/dolphinscheduler:1.3.6
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
FROM apache/dolphinscheduler:1.3.6
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
