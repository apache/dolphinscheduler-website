# Dolphin Scheduler 1.2.1部署参数分析

<a name="0P7uB"></a>
### Dolphin Scheduler目录配置文件解读
![image.png](/img/doc-img/1.2.1/deployparam-img/dir.png)

- bin 启动脚本
- conf 配置文件
- lib ds依赖的jar包
- script 数据库创建升级脚本，部署分发脚本
- sql ds的元数据创建升级sql文件
- ui 前端资源
- install脚本 部署ds主要的配置文件修改处
<a name="poKCK"></a>
#### bin
bin目录下比较重要的是dolphinscheduler-daemon文件，之前版本中极容易出现的找不到jdk问题来源，当前版本的jdk已经export了本机的$JAVA_HOME，再也不用担心找不到jdk了。<br />![image.png](/img/doc-img/1.2.1/deployparam-img/daemon.png)
<a name="lmmR2"></a>
#### conf
非常重要的配置文件目录！！！非常重要的配置文件目录！！！非常重要的配置文件目录！！！<br />![image.png](/img/doc-img/1.2.1/deployparam-img/conf.png)

- env目录下的dolphinscheduller_env文件中记录了所有跟ds-task相关的环境变量,1.2.1版本增加了spark版本切换功能，特别注意SPARK_HOME1和SPARK_HOME2不能注释掉，需要正确配置，实现spark组件版本切换。下面给出CDH中的配置，测试环境中没有部署Flink，请忽略Flink的配置。
```shell
export HADOOP_HOME=/opt/cloudera/parcels/CDH/lib/hadoop
export HADOOP_CONF_DIR=/opt/cloudera/parcels/CDH/lib/hadoop/etc/hadoop
export SPARK_HOME1=/opt/cloudera/parcels/CDH/lib/spark
export SPARK_HOME2=/opt/cloudera/parcels/SPARK2/lib/spark2
export PYTHON_HOME=/usr/local/anaconda3/bin/python
export JAVA_HOME=/usr/java/jdk1.8.0_131
export HIVE_HOME=/opt/cloudera/parcels/CDH/lib/hive
export FLINK_HOME=/opt/soft/flink
export PATH=$HADOOP_HOME/bin:$SPARK_HOME1/bin:$SPARK_HOME2/bin:$PYTHON_HOME:$JAVA_HOME/bin:$HIVE_HOME/bin:$PATH:$FLINK_HOME/bin:$PATH
```

- application.properties重要，记录了ds的元数据库配置，master和worker的配置。重要配置如下：
  - 元数据库ds默认是pg，如果需要调整为MySQL，需要在lib目录下放入MySQL的jdbc-jar包
  - 这里配置了master和worker的执行线程数量，可以根据环境进行调整
  - worker.reserved.memory是worker的内存阈值，现在默认是0.1G，已经偏小不用再次修改
```shell
# base spring data source configuration
spring.datasource.type=com.alibaba.druid.pool.DruidDataSource
# postgre
spring.datasource.driver-class-name=org.postgresql.Driver
spring.datasource.url=jdbc:postgresql://localhost:5432/dolphinscheduler
# mysql
#spring.datasource.driver-class-name=com.mysql.jdbc.Driver
#spring.datasource.url=jdbc:mysql://192.168.xx.xx:3306/dolphinscheduler?useUnicode=true&characterEncoding=UTF-8
spring.datasource.username=test
spring.datasource.password=test

# master settings
# master execute thread num
master.exec.threads=100

# worker settings
# worker execute thread num
worker.exec.threads=100

# only larger than reserved memory, worker server can work. default value : physical memory * 1/6, unit is G.
worker.reserved.memory=0.1
```

- quartz.properties，记录了ds的quartz元数据
  - 默认依然是pg，如果需要调整为MySQL，需要在lib目录下放入MySQL的jdbc-jar包
  - 数据库选型的修改不用在这里修改，参数统一在install.sh中进行修改，这里只是给出参数的影响范围
```shell
#org.quartz.jobStore.driverDelegateClass = org.quartz.impl.jdbcjobstore.StdJDBCDelegate
org.quartz.jobStore.driverDelegateClass = org.quartz.impl.jdbcjobstore.PostgreSQLDelegate
#org.quartz.dataSource.myDs.driver = com.mysql.jdbc.Driver
org.quartz.dataSource.myDs.driver = org.postgresql.Driver
#org.quartz.dataSource.myDs.URL = jdbc:mysql://192.168.xx.xx:3306/dolphinscheduler?characterEncoding=utf8
org.quartz.dataSource.myDs.URL = jdbc:postgresql://localhost:5432/dolphinscheduler?characterEncoding=utf8
org.quartz.dataSource.myDs.user = test
org.quartz.dataSource.myDs.password = test
```
<a name="IMogw"></a>
#### install脚本
install.sh部署脚本是ds部署中的重头戏，下面将参数分组进行分析。
<a name="rYEds"></a>
#### 数据库配置
```shell
# for example postgresql or mysql ...
dbtype="postgresql"

# db config
# db address and port
dbhost="192.168.xx.xx:5432"

# db name
dbname="dolphinscheduler"

# db username
username="xx"

# db passwprd
# Note: if there are special characters, please use the \ transfer character to transfer
passowrd="xx"
```
dbtype参数可以设置postgresql和mysql，这里指定了ds连接元数据库的jdbc相关信息
<a name="K4u2S"></a>
#### 部署用户&目录
```shell
# conf/config/install_config.conf config
# Note: the installation path is not the same as the current path (pwd)
installPath="/opt/ds-agent"

# deployment user
# Note: the deployment user needs to have sudo privileges and permissions to operate hdfs. If hdfs is enabled, the root directory needs to be created by itself
deployUser="dolphinscheduler"
```
installPath是安装路径，在执行install.sh之后，会把ds安装到指定目录，如/opt/ds-agent。installPath不要和当前要一键安装的install.sh是同一目录。<br />deployUser是指ds的部署用户，该用户需要在部署ds的机器上打通sudo免密，并且需要具有操作hdfs的权限，建议挂到hadoop的supergroup组下。
<a name="6rEDt"></a>
#### zk集群&角色指定
配置zk集群的时候，特别注意：要用ip:2181的方式配置上去，一定要把端口带上。<br />ds一共包括master worker alert api四种角色，其中alert api只需指定一台机器即可，master和worker可以部署多态机器。下面的例子就是在4台机器中，部署2台master，2台worker，1台alert，1台api<br />ips参数，填写所有需要部署机器的hostname<br />masters，填写部署master机器的hostname<br />workers，填写部署worker机器的hostname<br />alertServer，填写部署alert机器的hostname<br />apiServers，填写部署api机器的hostname<br />zkroot参数可以通过调整，在一套zk集群中，托管多个ds集群，如配置zkRoot="/dspro",zkRoot="/dstest"
```shell
# zk cluster
zkQuorum="192.168.xx.xx:2181,192.168.xx.xx:2181,192.168.xx.xx:2181"

# install hosts
# Note: install the scheduled hostname list. If it is pseudo-distributed, just write a pseudo-distributed hostname
ips="192.168.0.1,192.168.0.2,192.168.0.3，192.168.0.4"

# ssh port, default 22
# Note: if ssh port is not default, modify here
sshPort=22

# run master machine
# Note: list of hosts hostname for deploying master
masters="192.168.0.1,192.168.0.2"

# run worker machine
# note: list of machine hostnames for deploying workers
workers="192.168.0.3,192.168.0.4"

# run alert machine
# note: list of machine hostnames for deploying alert server
alertServer="192.168.0.1"

# run api machine
# note: list of machine hostnames for deploying api server
apiServers="192.168.0.1"

# zk config
# zk root directory
zkRoot="/dolphinscheduler"

# zk session timeout
zkSessionTimeout="300"

# zk connection timeout
zkConnectionTimeout="300"

# zk retry interval
zkRetryMaxSleep="100"

# zk retry maximum number of times
zkRetryMaxtime="5"
```
<a name="7aGb8"></a>
#### 邮件配置&excel文件路径
邮件配置这块也是大家非常容易出问题的，建议可以拉一下ds的代码，跑一下alert.MailUtilisTest这个测试类，下面给出QQ邮箱配置方式。如果是内网邮箱，需要注意的是ssl是否需要关闭，以及mail.user登陆用户是否需要去掉邮箱后缀。<br />excel路径则需要保证该路径的写入权限
```shell
#QQ邮箱配置
# alert config
# mail protocol
mailProtocol="SMTP"

# mail server host
mailServerHost="smtp.qq.com"

# mail server port
mailServerPort="465"

# sender
mailSender="783xx8369@qq.com"

# user
mailUser="783xx8369@qq.com"

# sender password
mailPassword="邮箱授权码"

# TLS mail protocol support
starttlsEnable="false"

sslTrust="smtp.qq.com"

# SSL mail protocol support
# note: The SSL protocol is enabled by default. 
# only one of TLS and SSL can be in the true state.
sslEnable="true"

# download excel path
xlsFilePath="/tmp/xls"
```
<a name="T4u9c"></a>
#### 资源中心&YARN
ds的资源中心支持HDFS和S3.<br />resUploadStartupType="HDFS"则开启hdfs作为资源中心。<br />defaultFS，如果hdfs没有配置HA则需要在这里写上单点namenode的ip，如果HDFS是HA则需要将集群的core-site.xml文件和hdfs-site.xml文件拷贝到conf目录下<br />yarnHaIps，如果yarn启用了HA，配置两个resourcemanager的ip，如果是单点，配置空字符串<br />singleYarnIp，如果yarn是单点，配置resourcemanager的ip<br />hdfsPath，HDFS上ds存储资源的根路径，可采用默认值，如果是从1.1.0版本进行升级，需要注意这个地方，改为/escheduler
```shell
# resource Center upload and select storage method：HDFS,S3,NONE
resUploadStartupType="NONE"

# if resUploadStartupType is HDFS，defaultFS write namenode address，HA you need to put core-site.xml and hdfs-site.xml in the conf directory.
# if S3，write S3 address，HA，for example ：s3a://dolphinscheduler，
# Note，s3 be sure to create the root directory /dolphinscheduler
defaultFS="hdfs://mycluster:8020"

# if S3 is configured, the following configuration is required.
s3Endpoint="http://192.168.xx.xx:9010"
s3AccessKey="xxxxxxxxxx"
s3SecretKey="xxxxxxxxxx"

# resourcemanager HA configuration, if it is a single resourcemanager, here is yarnHaIps=""
yarnHaIps="192.168.xx.xx,192.168.xx.xx"

# if it is a single resourcemanager, you only need to configure one host name. If it is resourcemanager HA, the default configuration is fine.
singleYarnIp="ark1"

# hdfs root path, the owner of the root path must be the deployment user. 
# versions prior to 1.1.0 do not automatically create the hdfs root directory, you need to create it yourself.
hdfsPath="/dolphinscheduler"

# have users who create directory permissions under hdfs root path /
# Note: if kerberos is enabled, hdfsRootUser="" can be used directly.
hdfsRootUser="hdfs"
```
<a name="0bSHO"></a>
#### 开发状态
devState在测试环境部署的时候可以调为true，生产环境部署建议调为false
```shell
# development status, if true, for the SHELL script, you can view the encapsulated SHELL script in the execPath directory. 
# If it is false, execute the direct delete
devState="true"
```
<a name="x9hTX"></a>
#### 角色参数
下面的参数主要是调整的application.properties里边的配置，涉及master,worker和apiserver<br />apiServerPort可以自定义修改apiserver的端口，注意需要跟前端保持一致。<br />master和worker的参数，初次部署建议保持默认值，如果在运行当中出现性能问题在作调整，有条件可以压一下自身环境中的master和worker的最佳线程数。
```shell
# master config 
# master execution thread maximum number, maximum parallelism of process instance
masterExecThreads="100"

# the maximum number of master task execution threads, the maximum degree of parallelism for each process instance
masterExecTaskNum="20"

# master heartbeat interval
masterHeartbeatInterval="10"

# master task submission retries
masterTaskCommitRetryTimes="5"

# master task submission retry interval
masterTaskCommitInterval="1000"

# master maximum cpu average load, used to determine whether the master has execution capability
masterMaxCpuLoadAvg="100"

# master reserve memory to determine if the master has execution capability
masterReservedMemory="0.1"

# worker config
# worker execution thread
workerExecThreads="100"

# worker heartbeat interval
workerHeartbeatInterval="10"

# worker number of fetch tasks
workerFetchTaskNum="3"

# worker reserve memory to determine if the master has execution capability
workerReservedMemory="0.1"

# api config
# api server port
apiServerPort="12345"
```
<a name="3QaMD"></a>
### 特别注意

- ds需要启用资源中心之后，才可以创建租户，因此资源中心的配置一定要正确
- ds老版本部署需要配置JDK的问题已经解决
- installPath不要和当前要一键安装的install.sh是同一目录
- ds的task运行都依赖env目录下的环境变量文件，需要正确配置
- HDFS高可用，需要把core-site.xml和hdfs-site.xml文件拷贝到conf目录下
- 邮件配置中mailUser和mailSender的区别

