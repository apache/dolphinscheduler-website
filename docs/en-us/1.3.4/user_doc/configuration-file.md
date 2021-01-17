

# Preface
This document explains the DolphinScheduler application configurations according to DolphinScheduler-1.3.x versions.

# Directory Structure
Currently, all the configuration files are under [conf ] directory. Please check the following simplified DolphinScheduler installation directories to have a direct view about the position [conf] directory in and configuration files inside. This document only describes DolphinScheduler configurations and other modules are not going into.

[Note: the DolphinScheduler (hereinafter called the ‘DS’) .]
```

├─bin                               DS application commands directory
│  ├─dolphinscheduler-daemon.sh         startup/shutdown DS application 
│  ├─start-all.sh                       startup all DS services with configurations
│  ├─stop-all.sh                        shutdown all DS services with configurations
├─conf                              configurations directory
│  ├─application-api.properties         API-service config properties
│  ├─datasource.properties              datasource config properties
│  ├─zookeeper.properties               zookeeper config properties
│  ├─master.properties                  master config properties
│  ├─worker.properties                  worker config properties
│  ├─quartz.properties                  quartz config properties
│  ├─common.properties                  common-service[storage] config properties
│  ├─alert.properties                   alert-service config properties
│  ├─config                             environment variables config directory
│      ├─install_config.conf                DS environment variables configuration script[install/start DS]
│  ├─env                                load environment variables configs script directory
│      ├─dolphinscheduler_env.sh            load environment variables configs [eg: JAVA_HOME,HADOOP_HOME, HIVE_HOME ...]
│  ├─org                                mybatis mapper files directory
│  ├─i18n                               i18n configs directory
│  ├─logback-api.xml                    API-service log config
│  ├─logback-master.xml                 master-service log config
│  ├─logback-worker.xml                 worker-service log config
│  ├─logback-alert.xml                  alert-service log config
├─sql                                   DS metadata to create/upgrade .sql directory
│  ├─create                             create SQL scripts directory
│  ├─upgrade                            upgrade SQL scripts directory
│  ├─dolphinscheduler-postgre.sql       postgre database init script
│  ├─dolphinscheduler_mysql.sql         mysql database init script
│  ├─soft_version                       current DS version-id file
├─script                            DS services deployment, database create/upgrade scripts directory
│  ├─create-dolphinscheduler.sh         DS database init script
│  ├─upgrade-dolphinscheduler.sh        DS database upgrade script
│  ├─monitor-server.sh                  DS monitor-server start script       
│  ├─scp-hosts.sh                       transfer installation files script                                     
│  ├─remove-zk-node.sh                  cleanup zookeeper caches script       
├─ui                                front-end web resources directory
├─lib                               DS .jar dependencies directory
├─install.sh                        auto-setup DS services script


```


# Configurations in Details

serial number| service classification| config file|
|--|--|--|
1|startup/shutdown DS application|dolphinscheduler-daemon.sh
2|datasource config properties| datasource.properties
3|zookeeper config properties|zookeeper.properties
4|common-service[storage] config properties|common.properties
5|API-service config properties|application-api.properties
6|master config properties|master.properties
7|worker config properties|worker.properties
8|alert-service config properties|alert.properties
9|quartz config properties|quartz.properties
10|DS environment variables configuration script[install/start DS]|install_config.conf
11|load environment variables configs <br /> [eg: JAVA_HOME,HADOOP_HOME, HIVE_HOME ...]|dolphinscheduler_env.sh
12|services log config files|API-service log config : logback-api.xml  <br /> master-service log config  : logback-master.xml    <br /> worker-service log config : logback-worker.xml  <br /> alert-service log config : logback-alert.xml 


## 1.dolphinscheduler-daemon.sh [startup/shutdown DS application]
dolphinscheduler-daemon.sh is responsible for DS startup & shutdown. 
Essentially, start-all.sh/stop-all.sh startup/shutdown the cluster via dolphinscheduler-daemon.sh.
Currently, DS just makes a basic config, please config further JVＭ options based on your practical situation of resources.

Default simplified parameters are:
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

> "-XX:DisableExplicitGC" is not recommended due to may lead to memory link (DS dependent on Netty to communicate). 

## 2.datasource.properties [datasource config properties]
DS uses Druid to manage database connections and default simplified configs are:
|Parameters | Default value| Description|
|--|--|--|
spring.datasource.driver-class-name||datasource driver
spring.datasource.url||datasource connection url
spring.datasource.username||datasource username
spring.datasource.password||datasource password
spring.datasource.initialSize|5| initail connection pool size number
spring.datasource.minIdle|5| minimum connection pool size number
spring.datasource.maxActive|5| maximum connection pool size number
spring.datasource.maxWait|60000| max wait mili-seconds
spring.datasource.timeBetweenEvictionRunsMillis|60000| idle connection check interval
spring.datasource.timeBetweenConnectErrorMillis|60000| retry interval
spring.datasource.minEvictableIdleTimeMillis|300000| connections over minEvictableIdleTimeMillis will be collect when idle check
spring.datasource.validationQuery|SELECT 1| validate connection by running the SQL
spring.datasource.validationQueryTimeout|3| validate connection timeout[seconds]
spring.datasource.testWhileIdle|true| set whether the pool validates the allocated connection when a new connection request comes
spring.datasource.testOnBorrow|true| validity check when the program requests a new connection
spring.datasource.testOnReturn|false| validity check when the program recalls a connection
spring.datasource.defaultAutoCommit|true| whether auto commit
spring.datasource.keepAlive|true| runs validationQuery SQL to avoid the connection closed by pool when the connection idles over minEvictableIdleTimeMillis
spring.datasource.poolPreparedStatements|true| Open PSCache
spring.datasource.maxPoolPreparedStatementPerConnectionSize|20| specify the size of PSCache on each connection


## 3.zookeeper.properties [zookeeper config properties]
|Parameters | Default value| Description|
|--|--|--|
zookeeper.quorum|localhost:2181| zookeeper cluster connection info
zookeeper.dolphinscheduler.root|/dolphinscheduler| DS is stored under zookeeper root directory
zookeeper.session.timeout|60000|  session timeout
zookeeper.connection.timeout|30000| connection timeout
zookeeper.retry.base.sleep|100| time to wait between subsequent retries
zookeeper.retry.max.sleep|30000| maximum time to wait between subsequent retries
zookeeper.retry.maxtime|10| maximum retry times


## 4.common.properties [hadoop、s3、yarn config properties]
Currently, common.properties mainly configures hadoop/s3a related configurations. 
|Parameters | Default value| Description|
|--|--|--|
resource.storage.type|NONE| type of resource files: HDFS, S3, NONE
resource.upload.path|/dolphinscheduler| storage path of resource files
data.basedir.path|/tmp/dolphinscheduler| local directory used to store temp files
hadoop.security.authentication.startup.state|false| whether hadoop grant kerberos permission
java.security.krb5.conf.path|/opt/krb5.conf|kerberos config directory
login.user.keytab.username|hdfs-mycluster@ESZ.COM|kerberos username
login.user.keytab.path|/opt/hdfs.headless.keytab|kerberos user keytab
resource.view.suffixs| txt,log,sh,conf,cfg,py,java,sql,hql,xml,properties| file types supported by resource center
hdfs.root.user|hdfs| configure users with corresponding permissions if storage type is HDFS
fs.defaultFS|hdfs://mycluster:8020|If resource.storage.type=S3, then the request url would be similar to 's3a://dolphinscheduler'. Otherwise if resource.storage.type=HDFS and hadoop supports HA, please copy core-site.xml and hdfs-site.xml into 'conf' directory. 
fs.s3a.endpoint||s3 endpoint url
fs.s3a.access.key||s3 access key
fs.s3a.secret.key|     |s3 secret key
yarn.resourcemanager.ha.rm.ids|     | specify the yarn resourcemanager url. if resourcemanager supports HA, input HA IP addresses (separated by comma), or input null for standalone
yarn.application.status.address|http://ds1:8088/ws/v1/cluster/apps/%s| keep default if resourcemanager supports HA or not use resourcemanager. Or replace ds1 with corresponding hostname if resourcemanager in standalone mode.
dolphinscheduler.env.path|env/dolphinscheduler_env.sh| load environment variables configs [eg: JAVA_HOME,HADOOP_HOME, HIVE_HOME ...]
development.state|false| specify whether in development state
kerberos.expire.time|7|kerberos expire time [hour]


## 5.application-api.properties [API-service log config]
|Parameters | Default value| Description|
|--|--|--|
server.port|12345|api service communication port
server.servlet.session.timeout|7200|session timeout
server.servlet.context-path|/dolphinscheduler | request path
spring.servlet.multipart.max-file-size|1024MB| maximum file size
spring.servlet.multipart.max-request-size|1024MB| maximum request size
server.jetty.max-http-post-size|5000000| jetty maximum post size
spring.messages.encoding|UTF-8| message encoding
spring.jackson.time-zone|GMT+8| time zone
spring.messages.basename|i18n/messages| i18n config
security.authentication.type|PASSWORD| authentication type


## 6.master.properties [master-service log config]
|Parameters | Default value| Description|
|--|--|--|
master.listen.port|5678|master communication port
master.exec.threads|100|work threads count
master.exec.task.num|20|parallel task count
master.dispatch.task.num | 3|dispatch task count
master.heartbeat.interval|10|heartbeat interval
master.task.commit.retryTimes|5|task retry times
master.task.commit.interval|1000|task commit interval|
master.max.cpuload.avg|-1|master service operates when cpu load less than this number. (default -1: cpu cores * 2)
master.reserved.memory|0.3|specify memory threshold value, master service operates when available memory greater than the threshold


## 7.worker.properties [worker-service log config]
|Parameters | Default value| Description|
|--|--|--|
worker.listen.port|1234|worker communication port
worker.exec.threads|100|work threads count
worker.heartbeat.interval|10|heartbeat interval
worker.max.cpuload.avg|-1|worker service operates when CPU load less than this number. (default -1: CPU cores * 2)
worker.reserved.memory|0.3|specify memory threshold value, worker service operates when available memory greater than threshold
worker.group|default|workgroup grouping config. <br> worker will join corresponding group according to this config when startup


## 8.alert.properties [alert-service log config]
|Parameters | Default value| Description|
|--|--|--|
alert.type|EMAIL|alter type|
mail.protocol|SMTP|mail server protocol
mail.server.host|xxx.xxx.com|mail server host
mail.server.port|25|mail server port
mail.sender|xxx@xxx.com|mail sender email
mail.user|xxx@xxx.com|mail sender email name
mail.passwd|111111|mail sender email password
mail.smtp.starttls.enable|true|specify mail whether open tls
mail.smtp.ssl.enable|false|specify mail whether open ssl
mail.smtp.ssl.trust|xxx.xxx.com|specify mail ssl trust list
xls.file.path|/tmp/xls|mail attachment temp storage directory
||following configure WeCom[optional]|
enterprise.wechat.enable|false|specify whether enable WeCom
enterprise.wechat.corp.id|xxxxxxx|WeCom corp id
enterprise.wechat.secret|xxxxxxx|WeCom secret
enterprise.wechat.agent.id|xxxxxxx|WeCom agent id
enterprise.wechat.users|xxxxxxx|WeCom users
enterprise.wechat.token.url|https://qyapi.weixin.qq.com/cgi-bin/gettoken?  <br /> corpid=$corpId&corpsecret=$secret|WeCom token url
enterprise.wechat.push.url|https://qyapi.weixin.qq.com/cgi-bin/message/send?  <br /> access_token=$token|WeCom push url
enterprise.wechat.user.send.msg||send message format
enterprise.wechat.team.send.msg||group message format
plugin.dir|/Users/xx/your/path/to/plugin/dir|plugin directory


## 9.quartz.properties [quartz config properties]
This part describes quartz configs and please configure them based on your practical situation and resources.
|Parameters | Default value| Description|
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


## 10.install_config.conf [DS environment variables configuration script[install/start DS]]
install_config.conf is a bit complicated and is mainly used in the following two places.
* 1.DS cluster auto installation

> System will load configs in the install_config.conf and auto-configure files below, based on the file content when executing 'install.sh'.
> Files such as dolphinscheduler-daemon.sh、datasource.properties、zookeeper.properties、common.properties、application-api.properties、master.properties、worker.properties、alert.properties、quartz.properties and etc.


* 2.Startup/shutdown DS cluster
> The system will load masters, workers, alertServer, apiServers and other parameters inside the file to startup/shutdown DS cluster.

File content as follows:
```bash

# Note:  please escape the character if the file contains special characters such as `.*[]^${}\+?|()@#&`.
#   eg: `[` escape to `\[`

# Database type (DS currently only supports postgresql and mysql)
dbtype="mysql"

# Database url & port
dbhost="192.168.xx.xx:3306"

# Database name
dbname="dolphinscheduler"


# Database username
username="xx"

# Database password
password="xx"

# Zookeeper url
zkQuorum="192.168.xx.xx:2181,192.168.xx.xx:2181,192.168.xx.xx:2181"

# DS installation path, such as '/data1_1T/dolphinscheduler'
installPath="/data1_1T/dolphinscheduler"

# Deployment user
# Note: Deployment user needs 'sudo' privilege and has rights to operate HDFS
#     Root directory must be created by the same user if using HDFS, otherwise permission related issues will be raised.
deployUser="dolphinscheduler"


# Followings are alert-service configs
# Mail server host
mailServerHost="smtp.exmail.qq.com"

# Mail server port
mailServerPort="25"

# Mail sender
mailSender="xxxxxxxxxx"

# Mail user
mailUser="xxxxxxxxxx"

# Mail password
mailPassword="xxxxxxxxxx"

# Mail supports TLS set true if not set false
starttlsEnable="true"

# Mail supports SSL set true if not set false. Note: starttlsEnable and sslEnable cannot both set true
sslEnable="false"

# Mail server host, same as mailServerHost
sslTrust="smtp.exmail.qq.com"

# Specify which resource upload function to use for resources storage such as sql files. And supported options are HDFS, S3 and NONE. HDFS for upload to HDFS and NONE for not using this function.
resourceStorageType="NONE"

# if S3, write S3 address. HA, for example: s3a://dolphinscheduler，
# Note: s3 make sure to create the root directory /dolphinscheduler
defaultFS="hdfs://mycluster:8020"

# If parameter 'resourceStorageType' is S3, following configs are needed:
s3Endpoint="http://192.168.xx.xx:9010"
s3AccessKey="xxxxxxxxxx"
s3SecretKey="xxxxxxxxxx"

# If ResourceManager supports HA, then input master and standby node IP or hostname, eg: '192.168.xx.xx,192.168.xx.xx'. Or else ResourceManager run in standalone mode, please set yarnHaIps="" and "" for not using yarn.
yarnHaIps="192.168.xx.xx,192.168.xx.xx"


# If ResourceManager runs in standalone, then set ResourceManager node ip or hostname, or else remain default.
singleYarnIp="yarnIp1"

# Storage path when using HDFS/S3
resourceUploadPath="/dolphinscheduler"


# HDFS/S3 root user
hdfsRootUser="hdfs"

# Followings are kerberos configs

# Spicify kerberos enable or not
kerberosStartUp="false"

# Kdc krb5 config file path
krb5ConfPath="$installPath/conf/krb5.conf"

# Keytab username
keytabUserName="hdfs-mycluster@ESZ.COM"

# Username keytab path
keytabPath="$installPath/conf/hdfs.headless.keytab"


# API-service port
apiServerPort="12345"


# All hosts deploy DS
ips="ds1,ds2,ds3,ds4,ds5"

# Ssh port, default 22
sshPort="22"

# Master service hosts
masters="ds1,ds2"

# All hosts deploy worker service
# Note: Each worker needs to set a worker group name and default name is "default"
workers="ds1:default,ds2:default,ds3:default,ds4:default,ds5:default"

#  Host deploy alert-service
alertServer="ds3"

# Host deploy API-service
apiServers="ds1"
```

## 11.dolphinscheduler_env.sh [load environment variables configs]
When using shell to commit tasks, DS will load environment variables inside dolphinscheduler_env.sh into the host.
Types of tasks involved are: Shell task、Python task、Spark task、Flink task、Datax task and etc.
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

## 12. Services logback configs
Services name| logback config name |
|--|--|--|
API-service logback config |logback-api.xml|
master-service logback config|logback-master.xml |
worker-service logback config|logback-worker.xml |
alert-service logback config|logback-alert.xml |
