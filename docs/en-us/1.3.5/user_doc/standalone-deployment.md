# Standalone Deployment

# 1、Install basic softwares (please install required softwares by yourself)

 * PostgreSQL (8.2.15+) or MySQL (5.7)  :  Choose One, JDBC Driver 5.1.47+ is required if MySQL is used
 * [JDK](https://www.oracle.com/technetwork/java/javase/downloads/index.html) (1.8+) :  Required. Double-check configure JAVA_HOME and PATH environment variables in /etc/profile
 * ZooKeeper (3.4.6+) ：Required
 * Hadoop (2.6+) or MinIO ：Optional. If you need resource function, for Standalone Deployment you can choose a local directory as the upload destination (this does not need Hadoop deployed). Of course, you can also choose to upload to Hadoop or MinIO.

```markdown
 Tips：DolphinScheduler itself does not rely on Hadoop, Hive, Spark, only use their clients to run corresponding task.
```

# 2、Download the binary tar.gz package.

- Please download the latest version installation package to the server deployment directory. For example, use /opt/dolphinscheduler as the installation and deployment directory. Download address: [Download](/en-us/download/download.html), download package, move to deployment directory and unzip it.

```shell
# Create the deployment directory. Please do not choose a high-privilege directory such as /root or /home.
mkdir -p /opt/dolphinscheduler;
cd /opt/dolphinscheduler;

# unzip
tar -zxvf apache-dolphinscheduler-incubating-1.3.2-dolphinscheduler-bin.tar.gz -C /opt/dolphinscheduler;

# rename
mv apache-dolphinscheduler-incubating-1.3.2-dolphinscheduler-bin  dolphinscheduler-bin
```

# 3、Create deployment user and assign directory operation permissions

- Create a deployment user, and be sure to configure sudo secret-free. Here take the creation of a dolphinscheduler user as example.

```shell
# To create a user, you need to log in as root and set the deployment user name.
useradd dolphinscheduler;

# Set the user password, please modify it yourself.
echo "dolphinscheduler123" | passwd --stdin dolphinscheduler

# Configure sudo secret-free
echo 'dolphinscheduler  ALL=(ALL)  NOPASSWD: NOPASSWD: ALL' >> /etc/sudoers
sed -i 's/Defaults    requirett/#Defaults    requirett/g' /etc/sudoers

# Modify the directory permissions so that the deployment user has operation permissions on the dolphinscheduler-bin directory
chown -R dolphinscheduler:dolphinscheduler dolphinscheduler-bin
```

```
 Notes：
 - Because the task execution is based on 'sudo -u {linux-user}' to switch among different Linux users to implement multi-tenant job running, so the deployment user must have sudo permissions and is secret-free. If beginner learners don’t understand, you can ignore this point for now.
 - Please comment out line "Default requiretty", if it present in "/etc/sudoers" file. 
 - If you need to use resource upload, you need to assign user the permission to operate the local file system, HDFS or MinIO.
```

# 4、SSH secret-free configuration

- Switch to the deployment user and configure SSH local secret-free login

  ```shell
  su dolphinscheduler;

  ssh-keygen -t rsa -P '' -f ~/.ssh/id_rsa
  cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
  chmod 600 ~/.ssh/authorized_keys
  ```
  
​  Note: *If configure successed, the dolphinscheduler user does not need to enter a password when executing the command `ssh localhost`.*

# 5、Database initialization

- Log in to the database, the default database type is PostgreSQL. If you choose MySQL, you need to add the mysql-connector-java driver package to the lib directory of DolphinScheduler.
```
mysql -uroot -p
```

- After log into the database command line window, execute the database initialization command and set the user and password. 

**Note: {user} and {password} need to be replaced with a specific database username and password.**

 ``` mysql
    mysql> CREATE DATABASE dolphinscheduler DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci;
    mysql> GRANT ALL PRIVILEGES ON dolphinscheduler.* TO '{user}'@'%' IDENTIFIED BY '{password}';
    mysql> GRANT ALL PRIVILEGES ON dolphinscheduler.* TO '{user}'@'localhost' IDENTIFIED BY '{password}';
    mysql> flush privileges;
 ```

- Create tables and import basic data

    - Modify the following configuration in datasource.properties under the conf directory.

    ```shell
      vi conf/datasource.properties
    ```

    - If you choose Mysql, please comment out the relevant configuration of PostgreSQL (vice versa), you also need to manually add the [[mysql-connector-java driver jar] (https://downloads.mysql.com/archives/c-j/)] package to lib directory, and then configure the database connection information correctly.

    ```properties
      #postgre
      #spring.datasource.driver-class-name=org.postgresql.Driver
      #spring.datasource.url=jdbc:postgresql://localhost:5432/dolphinscheduler
      # mysql
      spring.datasource.driver-class-name=com.mysql.jdbc.Driver
      spring.datasource.url=jdbc:mysql://xxx:3306/dolphinscheduler?useUnicode=true&characterEncoding=UTF-8&allowMultiQueries=true     # Replace the correct IP address
      spring.datasource.username=xxx						# replace the correct {username} value
      spring.datasource.password=xxx						# replace the correct {password} value
    ```

    - After modifying and saving, execute **create-dolphinscheduler.sh** in the script directory.

    ```shell
    sh script/create-dolphinscheduler.sh
    ```

​       *Note: If you execute the above script and report "/bin/java: No such file or directory" error, please configure JAVA_HOME and PATH variables in /etc/profile.*

# 6、Modify runtime parameters.

- Modify the environment variable in `dolphinscheduler_env.sh` file under 'conf/env' directory (take the relevant software installed under '/opt/soft' as example)

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

     `Note: This step is very important. For example, JAVA_HOME and PATH must be configured. Those that are not used can be ignored or commented out. If you can not find dolphinscheduler_env.sh, please run ls -a.`

- Create JDK soft link to /usr/bin/java (still JAVA_HOME=/opt/soft/java as an example)

    ```shell
    sudo ln -s /opt/soft/java/bin/java /usr/bin/java
    ```

 - Modify the parameters in the one-click deployment config file `conf/config/install_config.conf`, pay special attention to the configuration of the following parameters.

    ```shell
    # choose mysql or postgresql
    dbtype="mysql"

    # Database connection address and port
    dbhost="localhost:3306"

    # database name
    dbname="dolphinscheduler"

    # database username
    username="xxx"

    # database password
    # NOTICE: if there are special characters, please use the \ to escape, for example, `[` escape to `\[`
    password="xxx"

    # Zookeeper address, localhost:2181, remember port 2181
    zkQuorum="localhost:2181"

    # Note: the target installation path for dolphinscheduler, please do not use current path (pwd)
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
    # note: Different protocols and encryption methods correspond to different ports, when SSL/TLS is enabled, port may be different, make sure the port is correct.
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

    # here is an example of saving to a local file system
    # Note: If you want to upload resource file(jar file and so on)to HDFS and the NameNode has HA enabled, you need to put core-site.xml and hdfs-site.xml of hadoop cluster in the installPath/conf directory. In this example, it is placed under /opt/soft/dolphinscheduler/conf, and Configure the namenode cluster name; if the NameNode is not HA, modify it to a specific IP or host name.
    defaultFS="file:///data/dolphinscheduler"

    # if not use hadoop resourcemanager, please keep default value; if resourcemanager HA enable, please type the HA ips ; if resourcemanager is single, make this value empty
    yarnHaIps="192.168.xx.xx,192.168.xx.xx"

    # if resourcemanager HA enable or not use resourcemanager, please skip this value setting; If resourcemanager is single, you only need to replace yarnIp1 to actual resourcemanager hostname.
    singleYarnIp="yarnIp1"

    # resource store on HDFS/S3 path, resource file will store to this hadoop hdfs path, self configuration, please make sure the directory exists on hdfs and have read write permissions。/dolphinscheduler is recommended
    resourceUploadPath="/data/dolphinscheduler"

    # specify the user who have permissions to create directory under HDFS/S3 root path
    hdfsRootUser="hdfs"

    # On which machines to deploy the DS service, choose localhost for this machine
    ips="localhost"

    # ssh port, default 22
    # Note: if ssh port is not default, modify here
    sshPort="22"

    # run master machine
    masters="localhost"

    # run worker machine
    workers="localhost"

    # run alert machine
    alertServer="localhost"

    # run api machine
    apiServers="localhost"

    ```

    *Attention:* if you need upload resource function, please execute below command:

    ```
    
    sudo mkdir /data/dolphinscheduler
    sudo chown -R dolphinscheduler:dolphinscheduler /data/dolphinscheduler 
    
    ```

# 7、Automated Deployment

- Switch to the deployment user and execute the one-click deployment script

    `sh install.sh`

   ```
   Note:
   For the first deployment, the following message appears in step 3 of `3, stop server` during operation. This message can be ignored.
   sh: bin/dolphinscheduler-daemon.sh: No such file or directory
   ```

- After script completed, the following 5 services will be started. Use `jps` command to check whether the services started (` jps` comes with `java JDK`)

```aidl
    MasterServer         ----- master service
    WorkerServer         ----- worker service
    LoggerServer         ----- logger service
    ApiApplicationServer ----- api service
    AlertServer          ----- alert service
```
If the above services started normally, the automatic deployment is successful.

After the deployment is success, you can view logs. Logs stored in the logs folder.

```log path
 logs/
    ├── dolphinscheduler-alert-server.log
    ├── dolphinscheduler-master-server.log
    |—— dolphinscheduler-worker-server.log
    |—— dolphinscheduler-api-server.log
    |—— dolphinscheduler-logger-server.log
```

# 8、login

- Access the front page address, interface IP (self-modified)
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
