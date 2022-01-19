# Pseudo-Cluster Deployment

The purpose of pseudo-cluster deployment is to deploy the DolphinScheduler service on a single machine. In this mode, DolphinScheduler's master, worker, api server, are all on the same machine.

If you are a green hand and want to experience DolphinScheduler, we recommended you install follow [Standalone](standalone.md). If you want to experience more complete functions or schedule large tasks number, we recommended you install follow [pseudo-cluster deployment](pseudo-cluster.md). If you want to using DolphinScheduler in production, we recommended you follow [cluster deployment](cluster.md) or [kubernetes](kubernetes.md)

## Prepare

Pseudo-cluster deployment of DolphinScheduler requires external software support

* JDK：Download [JDK][jdk] (1.8+), and configure `JAVA_HOME` to and `PATH` variable. You can skip this step, if it already exists in your environment.
* Binary package: Download the DolphinScheduler binary package at [download page](https://dolphinscheduler.apache.org/en-us/download/download.html)
* Database: [PostgreSQL](https://www.postgresql.org/download/) (8.2.15+) or [MySQL](https://dev.mysql.com/downloads/mysql/) (5.7+), you can choose one of the two, such as MySQL requires JDBC Driver 8.0.16
* Registry Center: [ZooKeeper](https://zookeeper.apache.org/releases.html) (3.4.6+)，[download link][zookeeper]
* Process tree analysis
  * `pstree` for macOS
  * `psmisc` for Fedora/Red/Hat/CentOS/Ubuntu/Debian

> **_Note:_** DolphinScheduler itself does not depend on Hadoop, Hive, Spark, but if you need to run tasks that depend on them, you need to have the corresponding environment support

## DolphinScheduler startup environment

### Configure user exemption and permissions

Create a deployment user, and be sure to configure `sudo` without password. We here make a example for user dolphinscheduler.

```shell
# To create a user, login as root
useradd dolphinscheduler

# Add password
echo "dolphinscheduler" | passwd --stdin dolphinscheduler

# Configure sudo without password
sed -i '$adolphinscheduler  ALL=(ALL)  NOPASSWD: NOPASSWD: ALL' /etc/sudoers
sed -i 's/Defaults    requirett/#Defaults    requirett/g' /etc/sudoers

# Modify directory permissions and grant permissions for user you created above
chown -R dolphinscheduler:dolphinscheduler dolphinscheduler-bin
```

> **_NOTICE:_**
>
> * Because DolphinScheduler's multi-tenant task switch user by command `sudo -u {linux-user}`, the deployment user needs to have sudo privileges and is password-free. If novice learners don’t understand, you can ignore this point for the time being.
> * If you find the line "Defaults requirest" in the `/etc/sudoers` file, please comment it

### Configure machine SSH password-free login

Since resources need to be sent to different machines during installation, SSH password-free login is required between each machine. The steps to configure password-free login are as follows

```shell
su dolphinscheduler

ssh-keygen -t rsa -P '' -f ~/.ssh/id_rsa
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

> **_Notice:_** After the configuration is complete, you can run the command `ssh localhost` to test if it work or not, if you can login with ssh without password.

### Start zookeeper

Go to the zookeeper installation directory, copy configure file `zoo_sample.cfg` to `conf/zoo.cfg`, and change value of dataDir in `conf/zoo.cfg` to `dataDir=./tmp/zookeeper`

```shell
# Start zookeeper
./bin/zkServer.sh start
```

### Initialize the database

DolphinScheduler metadata is stored in relational database. Currently, PostgreSQL and MySQL are supported. If you use MySQL, you need to manually download [mysql-connector-java driver][mysql] (8.0.16) and move it to the lib directory of DolphinScheduler. Let's take MySQL as an example for how to initialize the database

```shell
mysql -uroot -p

mysql> CREATE DATABASE dolphinscheduler DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci;

# Change {user} and {password} by requests
mysql> GRANT ALL PRIVILEGES ON dolphinscheduler.* TO '{user}'@'%' IDENTIFIED BY '{password}';
mysql> GRANT ALL PRIVILEGES ON dolphinscheduler.* TO '{user}'@'localhost' IDENTIFIED BY '{password}';

mysql> flush privileges;
```

Run the latest schema file manually in `dolphinscheduler/dolphinscheduler-dao/src/main/resources/sql/dolphinscheduler_*.sql` to initialization you database. If you use MySQL, please run `dolphinscheduler/dolphinscheduler-dao/src/main/resources/sql/dolphinscheduler_mysql.sql`, for PostgreSQL run `dolphinscheduler/dolphinscheduler-dao/src/main/resources/sql/dolphinscheduler_postgre.sql`

> **_NOTICE:_** In the latest version, the way running command `sh script/create-dolphinscheduler.sh` initialization database is broken, We have created a [issue-6597][issue] to track and fix this problem

<!--
Modify the database configuration and initialize

```properties
spring.datasource.driver-class-name=com.mysql.jdbc.Driver
spring.datasource.url=jdbc:mysql://localhost:3306/dolphinscheduler?useUnicode=true&characterEncoding=UTF-8&allowMultiQueries=true
# Modify it if you are not using dolphinscheduler/dolphinscheduler as your username and password
spring.datasource.username=dolphinscheduler
spring.datasource.password=dolphinscheduler
```

After modifying and saving, execute the following command to create database table and inti basic data.

```shell
sh script/create-dolphinscheduler.sh
```
-->

## Modify configuration

After completing the preparation of the basic environment, you need to modify the configuration file according to your environment. The configuration file is in the path of `conf/config/install_config.conf`. Generally, you just needs to modify the **INSTALL MACHINE, DolphinScheduler ENV, Database, Registry Server** part to complete the deployment, the following describes the parameters that must be modified

```shell
# ---------------------------------------------------------
# INSTALL MACHINE
# ---------------------------------------------------------
# Because the master, worker, and API server are deployed on a single node, the IP of the server is the machine IP or localhost
ips="localhost"
masters="localhost"
workers="localhost:default"
alertServer="localhost"
apiServers="localhost"

# DolphinScheduler installation path, it will auto create if not exists
installPath="~/dolphinscheduler"

# Deploy user, use what you create in section **Configure machine SSH password-free login**
deployUser="dolphinscheduler"

# ---------------------------------------------------------
# DolphinScheduler ENV
# ---------------------------------------------------------
# The path of JAVA_HOME, which JDK install path in section **Prepare**
javaHome="/your/java/home/here"

# ---------------------------------------------------------
# Database
# ---------------------------------------------------------
# Database type, username, password, IP, port, metadata. For now dbtype supports `mysql` and `postgresql`
dbtype="mysql"
dbhost="localhost:3306"
# Have to modify if you are not using dolphinscheduler/dolphinscheduler as your username and password
username="dolphinscheduler"
password="dolphinscheduler"
dbname="dolphinscheduler"

# ---------------------------------------------------------
# Registry Server
# ---------------------------------------------------------
# Registration center address, the address of zookeeper service
registryServers="localhost:2181"
```

## Start DolphinScheduler

Use deployment user you created above, running the following command to complete the deployment, and the server log will be stored in the logs folder

```shell
sh install.sh
```

> **_Note:_** For the first time deployment, there maybe occur five times of `sh: bin/dolphinscheduler-daemon.sh: No such file or directory` in terminal
, this is non-important information and you can ignore it.

## Login DolphinScheduler

The browser access address http://localhost:12345/dolphinscheduler can login DolphinScheduler UI. The default username and password are **admin/dolphinscheduler123**

## Start or stop server

```shell
# Stop all DolphinScheduler server
sh ./bin/stop-all.sh

# Start all DolphinScheduler server
sh ./bin/start-all.sh

# Start or stop DolphinScheduler Master
sh ./bin/dolphinscheduler-daemon.sh stop master-server
sh ./bin/dolphinscheduler-daemon.sh start master-server

# Start or stop DolphinScheduler Worker
sh ./bin/dolphinscheduler-daemon.sh start worker-server
sh ./bin/dolphinscheduler-daemon.sh stop worker-server

# Start or stop DolphinScheduler Api
sh ./bin/dolphinscheduler-daemon.sh start api-server
sh ./bin/dolphinscheduler-daemon.sh stop api-server

# Start or stop Alert
sh ./bin/dolphinscheduler-daemon.sh start alert-server
sh ./bin/dolphinscheduler-daemon.sh stop alert-server
```

> **_Note:_**: Please refer to the section of "System Architecture Design" for service usage

[jdk]: https://www.oracle.com/technetwork/java/javase/downloads/index.html
[zookeeper]: https://zookeeper.apache.org/releases.html
[mysql]: https://downloads.MySQL.com/archives/c-j/
[issue]: https://github.com/apache/dolphinscheduler/issues/6597
