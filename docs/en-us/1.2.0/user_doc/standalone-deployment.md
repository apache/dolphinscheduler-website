# Standalone Deployment

DolphinScheduler Standalone deployment is divided into two parts: backend deployment and frontend deployment.

# 1. Backend Deployment

### 1.1: Before you begin (please install requirement basic software by yourself)

 * PostgreSQL (8.2.15+) or MySQL (5.6 or 5.7): Choose One
 * [JDK](https://www.oracle.com/technetwork/java/javase/downloads/index.html) (1.8+):  Required. Double-check configure JAVA_HOME and PATH environment variables in /etc/profile
 * ZooKeeper (3.4.6+): Required
 * Hadoop (2.6+) or MinIO: Optional. If you need to upload a resource function, you can choose a local file directory as the upload folder for a single machine (this operation does not need to deploy Hadoop). Of course, you can also choose to upload to Hadoop or MinIO.

```markdown
 Tips：DolphinScheduler itself does not rely on Hadoop, Hive, Spark, only use their clients for the corresponding task of running.
```

### 1.2: Download the backend package.

- Please download the latest version of the default installation package to the server deployment directory. For example, use /opt/dolphinscheduler as the installation and deployment directory. Download address: [Download](/en-us/download/download.html) (Take 1.2.0 for an example). Download the package and move to the installation and deployment directory. Then unzip it.

```shell
# Create the deployment directory. Do not choose a deployment directory with a high-privilege directory such as / root or / home.
mkdir -p /opt/dolphinscheduler;
cd /opt/dolphinscheduler;
# unzip
tar -zxvf apache-dolphinscheduler-incubating-1.2.0-dolphinscheduler-backend-bin.tar.gz -C /opt/dolphinscheduler;
 
mv apache-dolphinscheduler-incubating-1.2.0-dolphinscheduler-backend-bin  dolphinscheduler-backend
```

###1.3: Create an individual user for deployment and grant directory operation permissions

- Create an individual user, and be sure to configure sudo passwordless. Take creating 'dolphinscheduler' user as an example.

```shell
# useradd need root permission
useradd dolphinscheduler;

# setup password
echo "dolphinscheduler" | passwd --stdin dolphinscheduler

# setup sudo passwordless
sed -i '$adolphinscheduler  ALL=(ALL)  NOPASSWD: NOPASSWD: ALL' /etc/sudoers
sed -i 's/Defaults    requirett/#Defaults    requirett/g' /etc/sudoers

# Modify the directory permissions so that the deployment user has operation permissions on the dolphinscheduler-backend directory 
chown -R dolphinscheduler:dolphinscheduler dolphinscheduler-backend
```

```
 Notes：
 - Because the task execution service is based on 'sudo -u {linux-user}' to switch between different Linux users to implement multi-tenant running jobs, the deployment user needs to have sudo permissions and is passwordless. The first-time learners who can ignore it if they don't understand.
 - If find the "Default requiretty" in the "/etc/sudoers" file, also comment out.
 - If you need to use resource upload, you need to assign the user of permission to operate the local file system, HDFS or MinIO.
```

### 1.4: ssh passwordless configuration

- Switch to deployment user and configure ssh passwordless login

```shell
su dolphinscheduler;

ssh-keygen -t rsa -P '' -f ~/.ssh/id_rsa
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

Note: *If configure success, the dolphinscheduler user does not need to enter a password when executing the command `ssh localhost`*

### 1.5: Database initialization

- Into the database. The default database is PostgreSQL. If you select MySQL, you need to add the mysql-connector-java driver package to the lib directory of DolphinScheduler.
``` 
mysql -uroot -p
```

- After entering the database command line window, execute the database initialization command and set the user and password. **Note: {user} and {password} need to be replaced with a specific database username and password** 

    ``` mysql
    mysql> CREATE DATABASE dolphinscheduler DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci;
    mysql> GRANT ALL PRIVILEGES ON dolphinscheduler.* TO '{user}'@'%' IDENTIFIED BY '{password}';
    mysql> GRANT ALL PRIVILEGES ON dolphinscheduler.* TO '{user}'@'localhost' IDENTIFIED BY '{password}';
    mysql> flush privileges;
    ```


- Create tables and import basic data

    - Modify the following configuration in application-dao.properties under the conf directory

      - ```shell
        vi conf/application-dao.properties 
        ```

    - If you choose MySQL, please comment out the relevant configuration of PostgreSQL (vice versa), you also need to manually add the [[mysql-connector-java driver jar] (https://downloads.MySQL.com/archives/c-j/)] package to lib under the directory, and then configure the database connection information correctly.
    
    ```properties
      # postgre
      # spring.datasource.driver-class-name=org.postgresql.Driver
      # spring.datasource.url=jdbc:postgresql://localhost:5432/dolphinscheduler
      # mysql
      spring.datasource.driver-class-name=com.mysql.jdbc.Driver
      spring.datasource.url=jdbc:mysql://xxx:3306/dolphinscheduler?useUnicode=true&characterEncoding=UTF-8     # Replace the correct IP address
      spring.datasource.username=xxx						# replace the currect {user} value
      spring.datasource.password=xxx						# replace the currect {password} value
    ```

    - After modifying and saving, execute the create table and import data script in the script directory.

    ```shell
    sh script/create-dolphinscheduler.sh
    ```

​       *Note: If you execute the above script and report "/bin/java: No such file or directory" error, please configure JAVA_HOME and PATH variables in /etc/profile*

### 1.6: Modify runtime parameters.

- Modify the environment variable in `.dolphinscheduler_env.sh` file which on the 'conf/env' directory (take the relevant software installed under '/opt/soft' as an example)

    ```shell
    export HADOOP_HOME=/opt/soft/hadoop
    export HADOOP_CONF_DIR=/opt/soft/hadoop/etc/hadoop
    #export SPARK_HOME1=/opt/soft/spark1
    export SPARK_HOME2=/opt/soft/spark2
    export PYTHON_HOME=/opt/soft/python
    export JAVA_HOME=/opt/soft/java
    export HIVE_HOME=/opt/soft/hive
    export FLINK_HOME=/opt/soft/flink
    export PATH=$HADOOP_HOME/bin:$SPARK_HOME2/bin:$PYTHON_HOME:$JAVA_HOME/bin:$HIVE_HOME/bin:$PATH:$FLINK_HOME/bin:$PATH
    ```

     `Note: This step is very important. For example, JAVA_HOME and PATH must be configured. Those that are not used can be ignored or commented out. If ".dolphinscheduler_env.sh" cannot be found, run "ls -a"`

    

- Create Soft link jdk to /usr/bin/java (still JAVA_HOME=/opt/soft/java as an example)

    ```shell
    sudo ln -s /opt/soft/java/bin/java /usr/bin/java
    ```

 - Modify the parameters in the one-click deployment script `install.sh`, pay special attention to the configuration of the following parameters.

    ```shell
    # Choose mysql or postgresql
    dbtype="mysql"
    
    # Database connection address
    dbhost="localhost:3306"
    
    # Database schema name
    dbname="dolphinscheduler"
    
    # Database username
    username="xxx"    
    
    # Database password, if there are special characters, please use '\' escape, you need to modify the specific value of {passowrd} set above
    passowrd="xxx"
    
    # The directory where DS is installed, such as: '/opt/soft/dolphinscheduler', which is different from the current directory.
    installPath="/opt/soft/dolphinscheduler"
    
    # The system user created in section 1.3.
    deployUser="dolphinscheduler"
    
    # Zookeeper connection address, standalone machine is localhost:2181, port must be provided.
    zkQuorum="localhost:2181"
    
    # On machine which the DS service is deployed, set localhost
    ips="localhost"
    
    # On machine which the master service is deployed, set localhost
    masters="localhost"
    
    # On machine which the worker service is deployed, set localhost
    workers="localhost"
    
    # On machine which the alert service is deployed, set localhost
    alertServer="localhost"
    
    # On machine which the api service is deployed, set localhost
    apiServers="localhost"
    
    
    # EMail configuration, taking QQ mailbox as an example
    # EMail protocol
    mailProtocol="SMTP"
    
    # EMail server address
    mailServerHost="smtp.exmail.qq.com"
    
    # EMail server Port
    mailServerPort="25"
    
    # mailSender and mailUser can be the same one.
    # Sender
    mailSender="xxx@qq.com"
    
    # Receiver
    mailUser="xxx@qq.com"
    
    # EMail password
    mailPassword="xxx"
    
    # Set true if the mailbox is TLS protocol, otherwise set to false.
    starttlsEnable="true"
    
    # Mail service address value, refer to mailServerHost above.
    sslTrust="smtp.exmail.qq.com"
    
    # Set true if the mailbox is SSL protocol, otherwise set to false. Note: starttlsEnable and sslEnable cannot be true at the same time.
    sslEnable="false"
    
    # Download path of excel
    xlsFilePath="/tmp/xls"
    
    # Where are some sql and other resource files used for business uploaded. Can be set: HDFS, S3, NONE. If a standalone wants to use the local file system, please configure it as HDFS, because HDFS supports the local file system; if you do not need the resource upload function, select NONE. One important point: using a local file system does not require the deployment of Hadoop.
    resUploadStartupType="HDFS"
    
    # Take the local file system as an example.
    # Note: If you want to upload resource files to HDFS and the NameNode has HA enabled, you need to put core-site.xml and hdfs-site.xml in the installPath/conf directory. In this example, it is placed under /opt/soft/dolphinscheduler/conf, and Configure the namenode cluster name; if the NameNode is not HA, modify it to a specific IP or host name.
    defaultFS="file:///data/dolphinscheduler"    # hdfs://{ip|hostname}:8020
    
    
    # If the ResourceManager is HA, configure it as the active-standby IP or hostname of the ResourceManager node, such as "192.168.xx.xx, 192.168.xx.xx"; otherwise, if it is a single ResourceManager or yarn is not used at all, please configure yarnHaIps = "". That's it, I don't use yarn here, the configuration is "".
    yarnHaIps=""
    
    # If it is a single ResourceManager, configure it as the ResourceManager node ip or hostname, otherwise, keep the default value. Yarn is not used here, keep the default.
    singleYarnIp="ark1"
    
    # Since HDFS supports the local file system, you need to ensure that the local folder exists and has read and write permissions.
    hdfsPath="/data/dolphinscheduler"
    ```
    
    *Note: If you plan to use the `Resource Center` function, execute the following command:*
    
    ```shell
    sudo mkdir /data/dolphinscheduler
    sudo chown -R dolphinscheduler:dolphinscheduler /data/dolphinscheduler
    ```

### 1.7: Install python's Zookeeper tool kazoo

- Install python's Zookeeper tool. `This step is only used for one-click deployment.`

```shell
# Install pip
sudo yum -y install python-pip;  # ubuntu: sudo apt-get install python-pip
sudo pip install kazoo;
```

  *Note: If yum does not find python-pip, you can also install it by following commands*

```shell
sudo curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
sudo python get-pip.py  # python3: sudo python3 get-pip.py 
# then
sudo pip install kazoo;
```

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



# 2. Frontend Deployment

Please download the latest version of the frontend installation package to the server deployment directory, download address: [Download] (/en-us/download/download.html) (Take 1.2.0 version as an example ), Upload the tar.gz package to this directory after downloading and unzip it.

```shell
cd /opt/dolphinscheduler;

tar -zxvf apache-dolphinscheduler-incubating-1.2.0-dolphinscheduler-front-bin.tar.gz -C /opt/dolphinscheduler;

mv apache-dolphinscheduler-incubating-1.2.0-dolphinscheduler-front-bin dolphinscheduler-ui
```



**Choose any one of the following methods, automated deployment is recommended.**

### 2.1 Automated Deployment

- Enter the dolphinscheduler-ui directory and execute (`Note: Automated deployment will automatically download nginx`)

  ```shell
  cd dolphinscheduler-ui;
  sh ./install-dolphinscheduler-ui.sh;
  ```

  - After the execution, please type the frontend port during operation, the default port is 8888, if you choose the default, please press enter directly, or type another port.
  - Then it will let you type the api-server ip that interacts with the frontend UI.
  - Next is the port of the api-server that lets you type to interact with the frontend UI.
  - Next is the operating system selection.
  - Wait for deployment to complete.

- After deployment, in order to prevent too large resources from uploading to the resource center, it is recommended to modify the nginx upload size parameters, as follows:

  - Add Nginx configuration client_max_body_size 1024m, you can add it in the http method body.

  ```shell
  vi /etc/nginx/nginx.conf
  
  # add param
  client_max_body_size 1024m;
  ```

  - Then restart Nginx service

  ```shell
  systemctl restart nginx
  ```

- Visit the front page address: http://localhost:8888. If the front login page appears, the front web installation is complete.

  default user password：admin/dolphinscheduler123
  
  <p align="center">
     <img src="/img/login.png" width="60%" />
   </p>

### 2.2 Manual Deployment
- Install nginx by yourself, download it from the official website: Or `yum install nginx -y` 

- Modify the nginx configuration file (Note: some place need to be modified by yourself)

```html
vi /etc/nginx/nginx.conf

server {
    listen       8888; # Your Port
    server_name  localhost;
    #charset koi8-r;
    #access_log  /var/log/nginx/host.access.log  main;
    location / {
        root   /opt/soft/dolphinscheduler-ui/dist;      # Your dist directory which you unzip
        index  index.html index.html;
    }
    location /dolphinscheduler {
        proxy_pass http://localhost:12345;    # Your ApiApplicationServer address
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header x_real_ipP $remote_addr;
        proxy_set_header remote_addr $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_http_version 1.1;
        proxy_connect_timeout 4s;
        proxy_read_timeout 30s;
        proxy_send_timeout 12s;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
    #error_page  404              /404.html;
    # redirect server error pages to the static page /50x.html
    #
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }
}
```
- Then restart Nginx service

  ```shell
  systemctl restart nginx
  ```

- Visit the front page address: http://localhost:8888. If the front login page appears, the front web installation is complete.

  default user password：admin/dolphinscheduler123
  
  <p align="center">
     <img src="/img/login.png" width="60%" />
   </p>



# 3. Start and stop service

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

