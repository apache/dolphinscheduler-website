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

After downloading apache-dolphinscheduler-incubating-1.3.4-src.zip, uncompress it

```
$ unzip apache-dolphinscheduler-incubating-1.3.4-src.zip
```

#### 2. Pull Image and Start the Service

```
$ cd apache-dolphinscheduler-incubating-1.3.4-src-release/docker/docker-swarm
$ docker pull apache/dolphinscheduler:1.3.4
$ docker tag apache/dolphinscheduler:1.3.4 apache/dolphinscheduler:latest
$ docker-compose up -d
```

#### 3. Login

Visit the Web UI: http://192.168.xx.xx:8888

The default username is `admin` and the default password is `dolphinscheduler123`

<p align="center">
  <img src="/img/login_en.png" width="60%" />
</p>

Please refer to the `Quick Start` in the chapter [User Manual](/en-us/docs/1.3.4/user_doc/quick-start.html) to explore how to use DolphinScheduler

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
docker pull apache/dolphinscheduler:1.3.4
```

#### 5. Run a DolphinScheduler Instance

```
$ docker run -d --name dolphinscheduler \
-e DATABASE_HOST="192.168.x.x" -e DATABASE_PORT="5432" -e DATABASE_DATABASE="dolphinscheduler" \
-e DATABASE_USERNAME="test" -e DATABASE_PASSWORD="test" \
-e ZOOKEEPER_QUORUM="192.168.x.x:2181" \
-p 8888:8888 \
apache/dolphinscheduler:1.3.4 all
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
apache/dolphinscheduler:1.3.4 master-server
```

* Start a **worker server** (including **logger server**), For example:

```
$ docker run -d --name dolphinscheduler-worker \
-e DATABASE_HOST="192.168.x.x" -e DATABASE_PORT="5432" -e DATABASE_DATABASE="dolphinscheduler" \
-e DATABASE_USERNAME="test" -e DATABASE_PASSWORD="test" \
-e ZOOKEEPER_QUORUM="192.168.x.x:2181" \
apache/dolphinscheduler:1.3.4 worker-server
```

* Start a **api server**, For example:

```
$ docker run -d --name dolphinscheduler-api \
-e DATABASE_HOST="192.168.x.x" -e DATABASE_PORT="5432" -e DATABASE_DATABASE="dolphinscheduler" \
-e DATABASE_USERNAME="test" -e DATABASE_PASSWORD="test" \
-e ZOOKEEPER_QUORUM="192.168.x.x:2181" \
-p 12345:12345 \
apache/dolphinscheduler:1.3.4 api-server
```

* Start a **alert server**, For example:

```
$ docker run -d --name dolphinscheduler-alert \
-e DATABASE_HOST="192.168.x.x" -e DATABASE_PORT="5432" -e DATABASE_DATABASE="dolphinscheduler" \
-e DATABASE_USERNAME="test" -e DATABASE_PASSWORD="test" \
apache/dolphinscheduler:1.3.4 alert-server
```

* Start a **frontend**, For example:

```
$ docker run -d --name dolphinscheduler-frontend \
-e FRONTEND_API_SERVER_HOST="192.168.x.x" -e FRONTEND_API_SERVER_PORT="12345" \
-p 8888:8888 \
apache/dolphinscheduler:1.3.4 frontend
```

**Note**: You must be specify `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_DATABASE`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`, `ZOOKEEPER_QUORUM` when start a standalone dolphinscheduler server.
