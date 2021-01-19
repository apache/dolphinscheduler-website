# Backend Deployment Document

There are two deployment modes for the backend: 

- automatic deployment  
- source code compile and then deployment

## Preparations

Download the latest version of the installation package, download address：  [download](/en-us/download/download.html),
download apache-dolphinscheduler-incubating-x.x.x-dolphinscheduler-backend-bin.tar.gz



#### Preparations 1: Installation of basic software (self-installation of required items)

 * PostgreSQL (8.2.15+) or MySQL (5.5+) :  You can choose either PostgreSQL or MySQL.
 * JDK (1.8+) :  Mandatory
 * ZooKeeper(3.4.6+) ：Mandatory
 * Hadoop (2.6+) or MinIo ：Optionally, if you need to use the resource upload function, You can choose either Hadoop or MinIo.
 * Hive (1.2.1) :   Optional, hive task submission needs to be installed
 * Spark(1.x,2.x) :  Optional, Spark task submission needs to be installed

```
 Note: DolphinScheduler itself does not rely on Hadoop, Hive, Spark, PostgreSQL, but only calls their Client to run the corresponding tasks.
```

#### Preparations 2: Create deployment users

- Deployment users are created on all machines that require deployment scheduling, because the worker service executes jobs in `sudo-u {linux-user}`, so deployment users need sudo privileges and are confidential.

```
vi /etc/sudoers

# For example, the deployment user is an dolphinscheduler account
dolphinscheduler  ALL=(ALL)       NOPASSWD: NOPASSWD: ALL

# And you need to comment out the Default requiretty line
#Default requiretty
```

#### Preparations 3: SSH Secret-Free Configuration
Configure SSH secret-free login on deployment machines and other installation machines. If you want to install dolphinscheduler on deployment machines, you need to configure native password-free login itself.

- Connect the host and other machines SSH

#### Preparations 4: database initialization

* Create databases and accounts

    Execute the following command to create database and account
    
    ```
    CREATE DATABASE dolphinscheduler DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci;
    GRANT ALL PRIVILEGES ON dolphinscheduler.* TO '{user}'@'%' IDENTIFIED BY '{password}';
    GRANT ALL PRIVILEGES ON dolphinscheduler.* TO '{user}'@'localhost' IDENTIFIED BY '{password}';
    flush privileges;
    ```

* creates tables and imports basic data
    Modify the following attributes in ./conf/application-dao.properties

    ```
        spring.datasource.url
        spring.datasource.username
        spring.datasource.password
    ```
    
    Execute scripts for creating tables and importing basic data
    
    ```
    sh ./script/create-dolphinscheduler.sh
    ```

#### Preparations 5: Modify the deployment directory permissions and operation parameters

     instruction of dolphinscheduler-backend directory 

```directory
bin : Basic service startup script
DISCLAIMER-WIP : DISCLAIMER-WIP
conf : Project Profile
lib : The project relies on jar packages, including individual module jars and third-party jars
LICENSE : LICENSE
licenses : licenses
NOTICE : NOTICE
script :  Cluster Start, Stop and Service Monitor Start and Stop scripts
sql : The project relies on SQL files
install.sh :  One-click deployment script
```

- Modify permissions (please modify the 'deployUser' to the corresponding deployment user) so that the deployment user has operational privileges on the dolphinscheduler-backend directory

    `sudo chown -R deployUser:deployUser dolphinscheduler-backend`

- Modify the `.dolphinscheduler_env.sh` environment variable in the conf/env/directory

- Modify deployment parameters (depending on your server and business situation):

 - Modify the parameters in `install.sh` to replace the values required by your business
   - MonitorServerState switch variable, added in version 1.0.3, controls whether to start the self-start script (monitor master, worker status, if off-line will start automatically). The default value of "false" means that the self-start script is not started, and if it needs to start, it is changed to "true".
   - 'hdfsStartupSate' switch variable controls whether to start hdfs
      The default value of "false" means not to start hdfs
      Change the variable to 'true' if you want to use hdfs, you also need to create the hdfs root path by yourself, that 'hdfsPath' in install.sh.

 - If you use hdfs-related functions, you need to copy**hdfs-site.xml** and **core-site.xml** to the conf directory


## Deployment
Either of the following two methods can be deployed,binary file deployment is recommended, and experienced partners can use source deployment as well.

### Binary file Deployment

- Install ZooKeeper tools

   `pip install kazoo`

- Switch to deployment user, one-click deployment

    `sh install.sh` 

- Use the `jps` command to check if the services are started (`jps` comes from `Java JDK`)

```aidl
    MasterServer         ----- Master Service
    WorkerServer         ----- Worker Service
    LoggerServer         ----- Logger Service
    ApiApplicationServer ----- API Service
    AlertServer          ----- Alert Service
```

If all services are normal, the automatic deployment is successful


After successful deployment, the log can be viewed and stored in a specified folder.

```logPath
 logs/
    ├── dolphinscheduler-alert-server.log
    ├── dolphinscheduler-master-server.log
    |—— dolphinscheduler-worker-server.log
    |—— dolphinscheduler-api-server.log
    |—— dolphinscheduler-logger-server.log
```

### Compile source code to deploy

After downloading the release version of the source package, unzip it into the root directory

* Build a tar package

    Execute the compilation command：

    ```
     mvn -U clean package -Prelease -Dmaven.test.skip=true
    ```

    View directory

    After normal compilation, `apache-dolphinscheduler-incubating-${latest.release.version}-dolphinscheduler-backend-bin.tar.gz`
is generated in the `./dolphinscheduler-dist/dolphinscheduler-backend/target` directory

* OR build a rpm package 

    The rpm package can be installed on the Linux platform using the rpm command or yum. The rpm package can be used to help Dolphinscheduler better integrate with other management tools, such as ambari, cloudera manager.

    Execute the compilation command：

    ```
     mvn -U clean package -Prpmbuild -Dmaven.test.skip=true
    ```

    View directory

    After normal compilation, `apache-dolphinscheduler-incubating-${latest.release.version}-1.noarch.rpm`
    is generated in the `./dolphinscheduler-dist/target/rpm/apache-dolphinscheduler-incubating/RPMS/noarch/` directory


* Decompress the compiled tar.gz package or use the rpm command to install (the rpm installation method will install dolphinscheduler in the /opt/soft directory) . The dolphinscheduler directory structure is like this:

     ```
      ../
         ├── bin
         ├── conf
         |── DISCLAIMER
         |—— install.sh
         |—— lib
         |—— LICENSE
         |—— licenses
         |—— NOTICE
         |—— script
         |—— sql
     ```


- Install ZooKeeper tools

   `pip install kazoo`

- Switch to deployment user, one-click deployment

    `sh install.sh`

### Start-and-stop services commonly used in systems (for service purposes, please refer to System Architecture Design for details)

* stop all services in the cluster
  
   ` sh ./bin/stop-all.sh`
   
* start all services in the cluster
  
   ` sh ./bin/start-all.sh`

* start and stop one master server

```master
sh ./bin/dolphinscheduler-daemon.sh start master-server
sh ./bin/dolphinscheduler-daemon.sh stop master-server
```

* start and stop one worker server

```worker
sh ./bin/dolphinscheduler-daemon.sh start worker-server
sh ./bin/dolphinscheduler-daemon.sh stop worker-server
```

* start and stop api server

```Api
sh ./bin/dolphinscheduler-daemon.sh start api-server
sh ./bin/dolphinscheduler-daemon.sh stop api-server
```
* start and stop logger server

```Logger
sh ./bin/dolphinscheduler-daemon.sh start logger-server
sh ./bin/dolphinscheduler-daemon.sh stop logger-server
```
* start and stop alert server

```Alert
sh ./bin/dolphinscheduler-daemon.sh start alert-server
sh ./bin/dolphinscheduler-daemon.sh stop alert-server
```

## Database Upgrade
Modify the following properties in ./conf/application-dao.properties

    ```
        spring.datasource.url
        spring.datasource.username
        spring.datasource.password
    ```
The database can be upgraded automatically by executing the following command:
```upgrade
sh ./script/upgrade-dolphinscheduler.sh
```


