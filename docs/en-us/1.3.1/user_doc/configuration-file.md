# Foreword
This document is a description of the dolphinscheduler configuration file, and the version is for dolphinscheduler-1.3.x.

# Directory Structure
All configuration files of dolphinscheduler are currently in the [conf] directory.

For a more intuitive understanding of the location of the [conf] directory and the configuration files it contains, please see the simplified description of the dolphinscheduler installation directory below.

This article mainly talks about the configuration file of dolphinscheduler. I won't go into details in other parts.

[Note: The following dolphinscheduler is referred to as DS.]
```

├─bin                               DS command storage directory
│  ├─dolphinscheduler-daemon.sh         Activate/deactivate DS service script
│  ├─start-all.sh                       Start all DS services according to the configuration file
│  ├─stop-all.sh                        Close all DS services according to the configuration file
├─conf                              Configuration file directory
│  ├─application-api.properties         api service configuration file
│  ├─datasource.properties              Database configuration file
│  ├─zookeeper.properties               zookeeper configuration file
│  ├─master.properties                  Master service configuration file
│  ├─worker.properties                  Worker service configuration file
│  ├─quartz.properties                  Quartz service configuration file
│  ├─common.properties                  Public service [storage] configuration file
│  ├─alert.properties                   alert service configuration file
│  ├─config                             Environment variable configuration folder
│      ├─install_config.conf                DS environment variable configuration script [for DS installation/startup]
│  ├─env                                Run script environment variable configuration directory
│      ├─dolphinscheduler_env.sh            Run the script to load the environment variable configuration file [such as: JAVA_HOME, HADOOP_HOME, HIVE_HOME ...]
│  ├─org                                mybatis mapper file directory
│  ├─i18n                               i18n configuration file directory
│  ├─logback-api.xml                    api service log configuration file
│  ├─logback-master.xml                 Master service log configuration file
│  ├─logback-worker.xml                 Worker service log configuration file
│  ├─logback-alert.xml                  alert service log configuration file
├─sql                               DS metadata creation and upgrade sql file
│  ├─create                             Create SQL script directory
│  ├─upgrade                            Upgrade SQL script directory
│  ├─dolphinscheduler-postgre.sql       Postgre database initialization script
│  ├─dolphinscheduler_mysql.sql         mysql database initialization version
│  ├─soft_version                       Current DS version identification file
├─script                            DS service deployment, database creation/upgrade script directory
│  ├─create-dolphinscheduler.sh         DS database initialization script      
│  ├─upgrade-dolphinscheduler.sh        DS database upgrade script                
│  ├─monitor-server.sh                  DS service monitoring startup script               
│  ├─scp-hosts.sh                       Install file transfer script                                                    
│  ├─remove-zk-node.sh                  Clean Zookeeper cache file script       
├─ui                                Front-end WEB resource directory
├─lib                               DS dependent jar storage directory
├─install.sh                        Automatically install DS service script


```


# Detailed configuration file

Serial number| Service classification |  Configuration file|
|--|--|--|
1|Activate/deactivate DS service script|dolphinscheduler-daemon.sh
2|Database connection configuration | datasource.properties
3|Zookeeper connection configuration|zookeeper.properties
4|Common [storage] configuration|common.properties
5|API service configuration|application-api.properties
6|Master service configuration|master.properties
7|Worker service configuration|worker.properties
8|Alert service configuration|alert.properties
9|Quartz configuration|quartz.properties
10|DS environment variable configuration script [for DS installation/startup]|install_config.conf
11|Run the script to load the environment variable configuration file <br />[for example: JAVA_HOME,HADOOP_HOME, HIVE_HOME ...|dolphinscheduler_env.sh
12|Service log configuration files|api service log configuration file : logback-api.xml  <br /> Master service log configuration file  : logback-master.xml    <br /> Worker service log configuration file : logback-worker.xml  <br /> alertService log configuration file : logback-alert.xml 


## 1.dolphinscheduler-daemon.sh [Activate/deactivate DS service script]
The dolphinscheduler-daemon.sh script is responsible for DS startup & shutdown 
start-all.sh/stop-all.sh eventually starts and shuts down the cluster through dolphinscheduler-daemon.sh.
At present, DS has only made a basic setting. Please set the JVM parameters according to the actual situation of their resources.

The default simplified parameters are as follows:
```bash
export DOLPHINSCHEDULER_OPTS="
-server 
-Xmx16g 
-Xms1g 
-Xss512k 
-XX:+UseConcMarkSweepGC 
-XX:+CMSParallelRemarkEnabled 
-XX:+UseFastAccessorMethods 
-XX:+UseCMSInitiatingOccupancyOnly 
-XX:CMSInitiatingOccupancyFraction=70
"
```

> It is not recommended to set "-XX:DisableExplicitGC", DS uses Netty for communication. Setting this parameter may cause memory leaks.

## 2.datasource.properties [Database Connectivity]
Use Druid to manage the database connection in DS.The default simplified configuration is as follows.
|Parameter | Defaults| Description|
|--|--|--|
spring.datasource.driver-class-name| |Database driver
spring.datasource.url||Database connection address
spring.datasource.username||Database username
spring.datasource.password||Database password
spring.datasource.initialSize|5| Number of initial connection pools
spring.datasource.minIdle|5| Minimum number of connection pools
spring.datasource.maxActive|5| Maximum number of connection pools
spring.datasource.maxWait|60000| Maximum waiting time
spring.datasource.timeBetweenEvictionRunsMillis|60000| Connection detection cycle
spring.datasource.timeBetweenConnectErrorMillis|60000| Retry interval
spring.datasource.minEvictableIdleTimeMillis|300000| The minimum time a connection remains idle without being evicted
spring.datasource.validationQuery|SELECT 1|SQL to check whether the connection is valid
spring.datasource.validationQueryTimeout|3| Timeout to check if the connection is valid[seconds]
spring.datasource.testWhileIdle|true| Check when applying for connection, if idle time is greater than timeBetweenEvictionRunsMillis，Run validationQuery to check whether the connection is valid.
spring.datasource.testOnBorrow|true| Execute validationQuery to check whether the connection is valid when applying for connection
spring.datasource.testOnReturn|false| When returning the connection, execute validationQuery to check whether the connection is valid
spring.datasource.defaultAutoCommit|true| Whether to enable automatic submission
spring.datasource.keepAlive|true| For connections within the minIdle number in the connection pool, if the idle time exceeds minEvictableIdleTimeMillis, the keepAlive operation will be performed.
spring.datasource.poolPreparedStatements|true| Open PSCache
spring.datasource.maxPoolPreparedStatementPerConnectionSize|20| To enable PSCache, you must configure greater than 0, when greater than 0,PoolPreparedStatements automatically trigger modification to true.


## 3.zookeeper.properties [Zookeeper connection configuration]
|Parameter |Defaults| Description| 
|--|--|--|
zookeeper.quorum|localhost:2181| zk cluster connection information
zookeeper.dolphinscheduler.root|/dolphinscheduler| DS stores root directory in zookeeper
zookeeper.session.timeout|60000|  session time out
zookeeper.connection.timeout|30000|  Connection timed out
zookeeper.retry.base.sleep|100| Basic retry time difference
zookeeper.retry.max.sleep|30000| Maximum retry time
zookeeper.retry.maxtime|10|Maximum number of retries


## 4.common.properties [hadoop, s3, yarn configuration]
The common.properties configuration file is currently mainly used to configure hadoop/s3a related configurations. 
|Parameter |Defaults| Description| 
|--|--|--|
resource.storage.type|NONE|Resource file storage type: HDFS,S3,NONE
resource.upload.path|/dolphinscheduler|Resource file storage path
data.basedir.path|/tmp/dolphinscheduler|Local working directory for storing temporary files
hadoop.security.authentication.startup.state|false|hadoop enable kerberos permission
java.security.krb5.conf.path|/opt/krb5.conf|kerberos configuration directory
login.user.keytab.username|hdfs-mycluster@ESZ.COM|kerberos login user
login.user.keytab.path|/opt/hdfs.headless.keytab|kerberos login user keytab
resource.view.suffixs| txt,log,sh,conf,cfg,py,java,sql,hql,xml,properties|File formats supported by the resource center
hdfs.root.user|hdfs|If the storage type is HDFS, you need to configure users with corresponding operation permissions
fs.defaultFS|hdfs://mycluster:8020|Request address if resource.storage.type=S3 ,the value is similar to: s3a://dolphinscheduler. If resource.storage.type=HDFS, If hadoop configured HA, you need to copy the core-site.xml and hdfs-site.xml files to the conf directory
fs.s3a.endpoint||s3 endpoint address
fs.s3a.access.key||s3 access key
fs.s3a.secret.key|     |s3 secret key
yarn.resourcemanager.ha.rm.ids|     |yarn resourcemanager address, If the resourcemanager has HA turned on, enter the IP address of the HA (separated by commas). If the resourcemanager is a single node, the value can be empty.
yarn.application.status.address|http://ds1:8088/ws/v1/cluster/apps/%s|If resourcemanager has HA enabled or resourcemanager is not used, keep the default value. If resourcemanager is a single node, you need to configure ds1 as the hostname corresponding to resourcemanager
dolphinscheduler.env.path|env/dolphinscheduler_env.sh|Run the script to load the environment variable configuration file [eg: JAVA_HOME, HADOOP_HOME, HIVE_HOME ...]
development.state|false|Is it in development mode
kerberos.expire.time|7|kerberos expiration time [hour]


## 5.application-api.properties [API service configuration]
|Parameter |Defaults| Description| 
|--|--|--|
server.port|12345|API service communication port
server.servlet.session.timeout|7200|session timeout
server.servlet.context-path|/dolphinscheduler |Request path
spring.servlet.multipart.max-file-size|1024MB|Maximum upload file size
spring.servlet.multipart.max-request-size|1024MB|Maximum request size
server.jetty.max-http-post-size|5000000|Jetty service maximum send request size
spring.messages.encoding|UTF-8|Request encoding
spring.jackson.time-zone|GMT+8|Set time zone
spring.messages.basename|i18n/messages|i18n configuration
security.authentication.type|PASSWORD|Permission verification type


## 6.master.properties [Master service configuration]
|Parameter |Defaults| Description| 
|--|--|--|
master.listen.port|5678|master communication port
master.exec.threads|100| Number of worker threads
master.exec.task.num|20|Number of parallel tasks
master.dispatch.task.num | 3|Number of distribution tasks
master.heartbeat.interval|10|Heartbeat interval
master.task.commit.retryTimes|5|Number of task retries
master.task.commit.interval|1000|Task submission interval
master.max.cpuload.avg|-1|When the CPU is less than this configuration, the master service can work. The default value is -1 :  cpu cores * 2
master.reserved.memory|0.3|Memory threshold limit, the available memory is greater than this value, the master service can work.


## 7.worker.properties [Worker service configuration]
|Parameter |Defaults| Description| 
|--|--|--|
worker.listen.port|1234|worker communication port
worker.exec.threads|100|Number of worker threads
worker.heartbeat.interval|10|Heartbeat interval
worker.max.cpuload.avg|-1|When the CPU is less than this configuration, the worker service can work. The default value is -1 :  cpu cores * 2
worker.reserved.memory|0.3|Memory threshold limit, the available memory is greater than this value, the worker service can work.
worker.group|default|Workgroup grouping configuration. <br> When the worker starts, it will automatically join the corresponding group according to the configuration.


## 8.alert.properties [Alert alert service configuration]
|Parameter |Defaults| Description| 
|--|--|--|
alert.type|EMAIL|Alarm type|
mail.protocol|SMTP| Mail server protocol
mail.server.host|xxx.xxx.com|Mail server address
mail.server.port|25|Mail server port
mail.sender|xxx@xxx.com|Sender mailbox
mail.user|xxx@xxx.com|Sender's email name
mail.passwd|111111|Sender email password
mail.smtp.starttls.enable|true|Whether the mailbox opens tls
mail.smtp.ssl.enable|false|Whether the mailbox opens ssl
mail.smtp.ssl.trust|xxx.xxx.com|Email ssl whitelist
xls.file.path|/tmp/xls|Temporary working directory for mailbox attachments
||The following is the enterprise WeChat configuration[Optional]|
enterprise.wechat.enable|false|Whether the enterprise WeChat is enabled
enterprise.wechat.corp.id|xxxxxxx|
enterprise.wechat.secret|xxxxxxx|
enterprise.wechat.agent.id|xxxxxxx|
enterprise.wechat.users|xxxxxxx|
enterprise.wechat.token.url|https://qyapi.weixin.qq.com/cgi-bin/gettoken?  <br /> corpid=$corpId&corpsecret=$secret|
enterprise.wechat.push.url|https://qyapi.weixin.qq.com/cgi-bin/message/send?  <br /> access_token=$token|
enterprise.wechat.user.send.msg||Send message format
enterprise.wechat.team.send.msg||Group message format
plugin.dir|/Users/xx/your/path/to/plugin/dir|Plugin directory


## 9.quartz.properties [Quartz configuration]
This is mainly quartz configuration, please configure it in combination with actual business scenarios & resources, this article will not be expanded for the time being.
|Parameter |Defaults| Description| 
|--|--|--|
org.quartz.jobStore.driverDelegateClass | org.quartz.impl.jdbcjobstore.StdJDBCDelegate
org.quartz.jobStore.driverDelegateClass | org.quartz.impl.jdbcjobstore.PostgreSQLDelegate
org.quartz.scheduler.instanceName | DolphinScheduler
org.quartz.scheduler.instanceId | AUTO
org.quartz.scheduler.makeSchedulerThreadDaemon | true
org.quartz.jobStore.useProperties | false
org.quartz.threadPool.class | org.quartz.simpl.SimpleThreadPool
org.quartz.threadPool.makeThreadsDaemons | true
org.quartz.threadPool.threadCount | 25
org.quartz.threadPool.threadPriority | 5
org.quartz.jobStore.class | org.quartz.impl.jdbcjobstore.JobStoreTX
org.quartz.jobStore.tablePrefix | QRTZ_
org.quartz.jobStore.isClustered | true
org.quartz.jobStore.misfireThreshold | 60000
org.quartz.jobStore.clusterCheckinInterval | 5000
org.quartz.jobStore.acquireTriggersWithinLock|true
org.quartz.jobStore.dataSource | myDs
org.quartz.dataSource.myDs.connectionProvider.class | org.apache.dolphinscheduler.service.quartz.DruidConnectionProvider


## 10.install_config.conf [DS environment variable configuration script [for DS installation/startup]]
The install_config.conf configuration file is more cumbersome.This file is mainly used in two places.
* 1.Automatic installation of DS cluster.

> Calling the install.sh script will automatically load the configuration in this file, and automatically configure the content in the above configuration file according to the content in this file.
> Such as::dolphinscheduler-daemon.sh、datasource.properties、zookeeper.properties、common.properties、application-api.properties、master.properties、worker.properties、alert.properties、quartz.properties Etc..


* 2.DS cluster startup and shutdown.
>When the DS cluster is started up and shut down, it will load the masters, workers, alertServer, apiServers and other parameters in the configuration file to start/close the DS cluster.

The contents of the file are as follows:
```bash

# Note: If the configuration file contains special characters,such as: `.*[]^${}\+?|()@#&`, Please escape,
#      Examples: `[` Escape to `\[`

# Database type, currently only supports postgresql or mysql
dbtype="mysql"

# Database address & port
dbhost="192.168.xx.xx:3306"

# Database Name
dbname="dolphinscheduler"


# Database Username
username="xx"

# Database Password
password="xx"

# Zookeeper address
zkQuorum="192.168.xx.xx:2181,192.168.xx.xx:2181,192.168.xx.xx:2181"

# Where to install DS, such as: /data1_1T/dolphinscheduler，
installPath="/data1_1T/dolphinscheduler"

# Which user to use for deployment
# Note: The deployment user needs sudo permissions and can operate hdfs.
#     If you use hdfs, the root directory must be created by the user. Otherwise, there will be permissions related issues.
deployUser="dolphinscheduler"


# The following is the alarm service configuration
# Mail server address
mailServerHost="smtp.exmail.qq.com"

# Mail Server Port
mailServerPort="25"

# Sender
mailSender="xxxxxxxxxx"

# Sending user
mailUser="xxxxxxxxxx"

# email Password
mailPassword="xxxxxxxxxx"

# TLS protocol mailbox is set to true, otherwise set to false
starttlsEnable="true"

# The mailbox with SSL protocol enabled is set to true, otherwise it is false. Note: starttlsEnable and sslEnable cannot be true at the same time
sslEnable="false"

# Mail service address value, same as mailServerHost
sslTrust="smtp.exmail.qq.com"

#Where to upload resource files such as sql used for business, you can set: HDFS, S3, NONE. If you want to upload to HDFS, please configure as HDFS; if you do not need the resource upload function, please select NONE.
resourceStorageType="NONE"

# if S3，write S3 address，HA，for example ：s3a://dolphinscheduler，
# Note，s3 be sure to create the root directory /dolphinscheduler
defaultFS="hdfs://mycluster:8020"

# If the resourceStorageType is S3, the parameters to be configured are as follows:
s3Endpoint="http://192.168.xx.xx:9010"
s3AccessKey="xxxxxxxxxx"
s3SecretKey="xxxxxxxxxx"

# If the ResourceManager is HA, configure it as the primary and secondary ip or hostname of the ResourceManager node, such as "192.168.xx.xx, 192.168.xx.xx", otherwise if it is a single ResourceManager or yarn is not used at all, please configure yarnHaIps="" That’s it, if yarn is not used, configure it as ""
yarnHaIps="192.168.xx.xx,192.168.xx.xx"

# If it is a single ResourceManager, configure it as the ResourceManager node ip or host name, otherwise keep the default value.
singleYarnIp="yarnIp1"

# The storage path of resource files in HDFS/S3
resourceUploadPath="/dolphinscheduler"


# HDFS/S3  Operating user
hdfsRootUser="hdfs"

# The following is the kerberos configuration

# Whether kerberos is turned on
kerberosStartUp="false"
# kdc krb5 config file path
krb5ConfPath="$installPath/conf/krb5.conf"
# keytab username
keytabUserName="hdfs-mycluster@ESZ.COM"
# username keytab path
keytabPath="$installPath/conf/hdfs.headless.keytab"


# api service port
apiServerPort="12345"


# Hostname of all hosts where DS is deployed
ips="ds1,ds2,ds3,ds4,ds5"

# ssh port, default 22
sshPort="22"

# Deploy master service host
masters="ds1,ds2"

# The host where the worker service is deployed
# Note: Each worker needs to set a worker group name, the default value is "default"
workers="ds1:default,ds2:default,ds3:default,ds4:default,ds5:default"

#  Deploy the alert service host
alertServer="ds3"

# Deploy api service host
apiServers="ds1"
```

## 11.dolphinscheduler_env.sh [Environment variable configuration]
When submitting a task through a shell-like method, the environment variables in the configuration file are loaded into the host.
The types of tasks involved are: Shell tasks, Python tasks, Spark tasks, Flink tasks, Datax tasks, etc.
```bash
export HADOOP_HOME=/opt/soft/hadoop
export HADOOP_CONF_DIR=/opt/soft/hadoop/etc/hadoop
export SPARK_HOME1=/opt/soft/spark1
export SPARK_HOME2=/opt/soft/spark2
export PYTHON_HOME=/opt/soft/python
export JAVA_HOME=/opt/soft/java
export HIVE_HOME=/opt/soft/hive
export FLINK_HOME=/opt/soft/flink
export DATAX_HOME=/opt/soft/datax/bin/datax.py

export PATH=$HADOOP_HOME/bin:$SPARK_HOME1/bin:$SPARK_HOME2/bin:$PYTHON_HOME:$JAVA_HOME/bin:$HIVE_HOME/bin:$PATH:$FLINK_HOME/bin:$DATAX_HOME:$PATH

```

## 12.Service log configuration files
Correspondence service| Log file name |
|--|--|--|
api service log configuration file |logback-api.xml|
Master service log configuration file|logback-master.xml |
Worker service log configuration file|logback-worker.xml |
alert service log configuration file|logback-alert.xml |
