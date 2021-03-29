# Cluster Deployment

# 1、Before you begin (please install requirement basic software by yourself)

 * PostgreSQL (8.2.15+) or MySQL (5.7)  :  Choose One
 * [JDK](https://www.oracle.com/technetwork/java/javase/downloads/index.html) (1.8+) :  Required. Double-check configure JAVA_HOME and PATH environment variables in /etc/profile
 * ZooKeeper (3.4.6+) ：Required
 * Hadoop (2.6+) or MinIO ：Optional. If you need to upload a resource function, you can choose a local file directory as the upload folder for a single machine (this operation does not need to deploy Hadoop). Of course, you can also choose to upload to Hadoop or MinIO.

```markdown
 Tips：DolphinScheduler itself does not rely on Hadoop, Hive, Spark, only use their clients for the corresponding task of running.
```

# 2、Download the binary package.

- Please download the latest version of the default installation package to the server deployment directory. For example, use /opt/dolphinscheduler as the installation and deployment directory. Download address: [Download](/en-us/download/download.html)，Download the package and move to the installation and deployment directory. Then unzip it.

```shell
# Create the deployment directory. Do not choose a deployment directory with a high-privilege directory such as / root or / home.
mkdir -p /opt/dolphinscheduler;
cd /opt/dolphinscheduler;
# unzip
tar -zxvf apache-dolphinscheduler-incubating-1.3.1-dolphinscheduler-bin.tar.gz -C /opt/dolphinscheduler;

mv apache-dolphinscheduler-incubating-1.3.1-dolphinscheduler-bin  dolphinscheduler-bin
```

# 3、Create deployment user and hosts mapping

- Create a deployment user on the ** all ** deployment machines, and be sure to configure sudo passwordless. If we plan to deploy DolphinScheduler on 4 machines: ds1, ds2, ds3, and ds4, we first need to create a deployment user on each machine.

```shell
# To create a user, you need to log in as root and set the deployment user name. Please modify it yourself. The following uses dolphinscheduler as an example.
useradd dolphinscheduler;

# Set the user password, please modify it yourself. The following takes dolphinscheduler123 as an example.
echo "dolphinscheduler123" | passwd --stdin dolphinscheduler

# Configure sudo passwordless
echo 'dolphinscheduler  ALL=(ALL)  NOPASSWD: NOPASSWD: ALL' >> /etc/sudoers
sed -i 's/Defaults    requirett/#Defaults    requirett/g' /etc/sudoers

```

```
 Notes：
 - Because the task execution service is based on 'sudo -u {linux-user}' to switch between different Linux users to implement multi-tenant running jobs, the deployment user needs to have sudo permissions and is passwordless. The first-time learners who can ignore it if they don't understand.
 - If find the "Default requiretty" in the "/etc/sudoers" file, also comment out.
 - If you need to use resource upload, you need to assign the user of permission to operate the local file system, HDFS or MinIO.
```

# 4、Configure hosts mapping and ssh access and modify directory permissions.

- Use the first machine (hostname is ds1) as the deployment machine, configure the hosts of all machines to be deployed on ds1, and login as root on ds1.

  ```shell
  vi /etc/hosts

  #add ip hostname
  192.168.xxx.xxx ds1
  192.168.xxx.xxx ds2
  192.168.xxx.xxx ds3
  192.168.xxx.xxx ds4
  ```

  *Note: Please delete or comment out the line 127.0.0.1*

- Sync /etc/hosts on ds1 to all deployment machines

  ```shell
  for ip in ds2 ds3;     # Please replace ds2 ds3 here with the hostname of machines you want to deploy
  do
      sudo scp -r /etc/hosts  $ip:/etc/          # Need to enter root password during operation
  done
  ```

  *Note: can use `sshpass -p xxx sudo scp -r /etc/hosts $ip:/etc/` to avoid type password.*

  > Install sshpass in Centos：
  >
  > 1. Install epel
  >
  >    yum install -y epel-release
  >
  >    yum repolist
  >
  > 2. After installing epel, you can install sshpass
  >
  >    yum install -y sshpass
  >
  >

- On ds1, switch to the deployment user and configure ssh passwordless login

  ```shell
   su dolphinscheduler;

  ssh-keygen -t rsa -P '' -f ~/.ssh/id_rsa
  cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
  chmod 600 ~/.ssh/authorized_keys
  ```
​      Note: *If configure success, the dolphinscheduler user does not need to enter a password when executing the command `ssh localhost`*



- On ds1, configure the deployment user dolphinscheduler ssh to connect to other machines to be deployed.

  ```shell
  su dolphinscheduler;
  for ip in ds2 ds3;     # Please replace ds2 ds3 here with the hostname of the machine you want to deploy.
  do
      ssh-copy-id  $ip   # You need to manually enter the password of the dolphinscheduler user during the operation.
  done
  # can use `sshpass -p xxx ssh-copy-id $ip` to avoid type password.
  ```

- On ds1, modify the directory permissions so that the deployment user has operation permissions on the dolphinscheduler-bin directory.

  ```shell
  sudo chown -R dolphinscheduler:dolphinscheduler dolphinscheduler-bin
  ```

# 5、Database initialization

- Into the database. The default database is PostgreSQL. If you select MySQL, you need to add the mysql-connector-java driver package to the lib directory of DolphinScheduler.
```
mysql -h192.168.xx.xx -P3306 -uroot -p
```

- After entering the database command line window, execute the database initialization command and set the user and password. **Note: {user} and {password} need to be replaced with a specific database username and password**

 ``` mysql
    mysql> CREATE DATABASE dolphinscheduler DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci;
    mysql> GRANT ALL PRIVILEGES ON dolphinscheduler.* TO '{user}'@'%' IDENTIFIED BY '{password}';
    mysql> GRANT ALL PRIVILEGES ON dolphinscheduler.* TO '{user}'@'localhost' IDENTIFIED BY '{password}';
    mysql> flush privileges;
 ```

- Create tables and import basic data

    - Modify the following configuration in datasource.properties under the conf directory

    ```shell
      vi conf/datasource.properties
    ```

    - If you choose Mysql, please comment out the relevant configuration of PostgreSQL (vice versa), you also need to manually add the [[mysql-connector-java driver jar] (https://downloads.mysql.com/archives/c-j/)] package to lib under the directory, and then configure the database connection information correctly.

    ```properties
      #postgre
      #spring.datasource.driver-class-name=org.postgresql.Driver
      #spring.datasource.url=jdbc:postgresql://localhost:5432/dolphinscheduler
      # mysql
      spring.datasource.driver-class-name=com.mysql.jdbc.Driver
      spring.datasource.url=jdbc:mysql://xxx:3306/dolphinscheduler?useUnicode=true&characterEncoding=UTF-8&allowMultiQueries=true     # Replace the correct IP address
      spring.datasource.username=xxx						# replace the correct {user} value
      spring.datasource.password=xxx						# replace the correct {password} value
    ```

    - After modifying and saving, execute the create table and import data script in the script directory.

    ```shell
    sh script/create-dolphinscheduler.sh
    ```

​       *Note: If you execute the above script and report "/bin/java: No such file or directory" error, please configure JAVA_HOME and PATH variables in /etc/profile*

# 6、Modify runtime parameters.

- Modify the environment variable in `dolphinscheduler_env.sh` file which on the 'conf/env' directory (take the relevant software installed under '/opt/soft' as an example)

    ```shell
        export HADOOP_HOME=/opt/soft/hadoop
        export HADOOP_CONF_DIR=/opt/soft/hadoop/etc/hadoop
        #export SPARK_HOME1=/opt/soft/spark1
        export SPARK_HOME2=/opt/soft/spark2
        export PYTHON_HOME=/opt/soft/python
        export JAVA_HOME=/opt/soft/java
        export HIVE_HOME=/opt/soft/hive
        export FLINK_HOME=/opt/soft/flink
        export DATAX_HOME=/opt/soft/datax/bin/datax.py
        export PATH=$HADOOP_HOME/bin:$SPARK_HOME2/bin:$PYTHON_HOME:$JAVA_HOME/bin:$HIVE_HOME/bin:$PATH:$FLINK_HOME/bin:$DATAX_HOME:$PATH

        ```

     `Note: This step is very important. For example, JAVA_HOME and PATH must be configured. Those that are not used can be ignored or commented out.`



- Create Soft link jdk to /usr/bin/java (still JAVA_HOME=/opt/soft/java as an example)

    ```shell
    sudo ln -s /opt/soft/java/bin/java /usr/bin/java
    ```

 - Modify the parameters in the one-click deployment config file `conf/config/install_config.conf`, pay special attention to the configuration of the following parameters.

    ```shell
    # choose mysql or postgresql
    dbtype="mysql"

    # Database connection address and port
    dbhost="192.168.xx.xx:3306"

    # database name
    dbname="dolphinscheduler"

    # database username
    username="xxx"

    # database password
    # NOTICE: if there are special characters, please use the \ to escape, for example, `[` escape to `\[`
    password="xxx"

    #Zookeeper cluster
    zkQuorum="192.168.xx.xx:2181,192.168.xx.xx:2181,192.168.xx.xx:2181"

    # Note: the target installation path for dolphinscheduler, please not config as the same as the current path (pwd)
    installPath="/opt/soft/dolphinscheduler"

    # deployment user
    # Note: the deployment user needs to have sudo privileges and permissions to operate hdfs. If hdfs is enabled, the root directory needs to be created by itself
    deployUser="dolphinscheduler"

    # alert config，take QQ email for example
    # mail protocol
    mailProtocol="SMTP"

    # mail server host
    mailServerHost="smtp.qq.com"

    # mail server port
    # note: Different protocols and encryption methods correspond to different ports, when SSL/TLS is enabled, make sure the port is correct.
    mailServerPort="25"

    # mail sender
    mailSender="xxx@qq.com"

    # mail user
    mailUser="xxx@qq.com"

    # mail sender password
    # note: The mail.passwd is email service authorization code, not the email login password.
    mailPassword="xxx"

    # Whether TLS mail protocol is supported,true is supported and false is not supported
    starttlsEnable="true"

    # Whether TLS mail protocol is supported,true is supported and false is not supported。
    # note: only one of TLS and SSL can be in the true state.
    sslEnable="false"

    # note: sslTrust is the same as mailServerHost
    sslTrust="smtp.qq.com"


    # resource storage type：HDFS,S3,NONE
    resourceStorageType="HDFS"

    # If resourceStorageType = HDFS, and your Hadoop Cluster NameNode has HA enabled, you need to put core-site.xml and hdfs-site.xml in the installPath/conf directory. In this example, it is placed under /opt/soft/dolphinscheduler/conf, and configure the namenode cluster name; if the NameNode is not HA, modify it to a specific IP or host name.
    # if S3，write S3 address，HA，for example ：s3a://dolphinscheduler，
    # Note，s3 be sure to create the root directory /dolphinscheduler
    defaultFS="hdfs://mycluster:8020"


    # if not use hadoop resourcemanager, please keep default value; if resourcemanager HA enable, please type the HA ips ; if resourcemanager is single, make this value empty
    yarnHaIps="192.168.xx.xx,192.168.xx.xx"

    # if resourcemanager HA enable or not use resourcemanager, please skip this value setting; If resourcemanager is single, you only need to replace yarnIp1 to actual resourcemanager hostname.
    singleYarnIp="yarnIp1"

    # resource store on HDFS/S3 path, resource file will store to this hadoop hdfs path, self configuration, please make sure the directory exists on hdfs and have read write permissions。/dolphinscheduler is recommended
    resourceUploadPath="/dolphinscheduler"

    # who have permissions to create directory under HDFS/S3 root path
    # Note: if kerberos is enabled, please config hdfsRootUser=
    hdfsRootUser="hdfs"



    # install hosts
    # Note: install the scheduled hostname list. If it is pseudo-distributed, just write a pseudo-distributed hostname
    ips="ds1,ds2,ds3,ds4"

    # ssh port, default 22
    # Note: if ssh port is not default, modify here
    sshPort="22"

    # run master machine
    # Note: list of hosts hostname for deploying master
    masters="ds1,ds2"

    # run worker machine
    # note: need to write the worker group name of each worker, the default value is "default"
    workers="ds3:default,ds4:default"

    # run alert machine
    # note: list of machine hostnames for deploying alert server
    alertServer="ds2"

    # run api machine
    # note: list of machine hostnames for deploying api server
    apiServers="ds1"

    ```

    *Attention:*

    - If you need to upload resources to the Hadoop cluster, and the NameNode of the Hadoop cluster is configured with HA, you need to enable HDFS resource upload, and you need to copy the core-site.xml and hdfs-site.xml in the Hadoop cluster to /opt/ dolphinscheduler/conf. Non-NameNode HA skips the next step.

# 7、Automated Deployment

- Switch to the deployment user and execute the one-click deployment script

    `sh install.sh`

   ```
   Note:
   For the first deployment, the following message appears in step 3 of `3, stop server` during operation. This message can be ignored.
   sh: bin/dolphinscheduler-daemon.sh: No such file or directory
   ```

- After the script is completed, the following 5 services will be started. Use the `jps` command to check whether the services are started (` jps` comes with `java JDK`)

```aidl
    MasterServer         ----- master service
    WorkerServer         ----- worker service
    LoggerServer         ----- logger service
    ApiApplicationServer ----- api service
    AlertServer          ----- alert service
```
If the above services are started normally, the automatic deployment is successful.


After the deployment is successful, you can view the logs. The logs are stored in the logs folder.

```log path
 logs/
    ├── dolphinscheduler-alert-server.log
    ├── dolphinscheduler-master-server.log
    |—— dolphinscheduler-worker-server.log
    |—— dolphinscheduler-api-server.log
    |—— dolphinscheduler-logger-server.log
```



# 8、login

- Access the address of the front page, interface IP (self-modified)
http://192.168.xx.xx:12345/dolphinscheduler

   <p align="center">
     <img src="/img/login.png" width="60%" />
   </p>



# 9、Start and stop service

* Stop all services

  ` sh ./bin/stop-all.sh`

* Start all services

  ` sh ./bin/start-all.sh`

* Start and stop master service

```shell
sh ./bin/dolphinscheduler-daemon.sh start master-server
sh ./bin/dolphinscheduler-daemon.sh stop master-server
```

* Start and stop worker Service

```shell
sh ./bin/dolphinscheduler-daemon.sh start worker-server
sh ./bin/dolphinscheduler-daemon.sh stop worker-server
```

* Start and stop api Service

```shell
sh ./bin/dolphinscheduler-daemon.sh start api-server
sh ./bin/dolphinscheduler-daemon.sh stop api-server
```

* Start and stop logger Service

```shell
sh ./bin/dolphinscheduler-daemon.sh start logger-server
sh ./bin/dolphinscheduler-daemon.sh stop logger-server
```

* Start and stop alert service

```shell
sh ./bin/dolphinscheduler-daemon.sh start alert-server
sh ./bin/dolphinscheduler-daemon.sh stop alert-server
```

``Note: Please refer to the "Architecture Design" section for service usage``

