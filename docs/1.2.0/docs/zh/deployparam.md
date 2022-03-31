# Dolphin Scheduler 1.2.0 部署参数分析

### Dolphin Scheduler目录配置文件解读
（讲解配置文件的作用，具体配置在install.sh部署文件中完成）<br />![image.png](/img/doc-img/1.2.0/deployparam-img/deploydir.png)

- bin 启动脚本
- conf 配置文件
- lib ds依赖的jar包
- script 数据库创建升级脚本，部署分发脚本
- sql ds的元数据创建升级sql文件
- install脚本 部署ds主要的配置文件修改处
<a name="poKCK"></a>
#### bin
bin目录下比较重要的是dolphinscheduler-daemon文件，之前版本中极容易出现的找不到jdk问题来源，当前版本的jdk已经export了本机的$JAVA_HOME，再也不用担心找不到jdk了。<br />![image.png](/img/doc-img/1.2.0/deployparam-img/daemon-120.png)
<a name="lmmR2"></a>
#### conf
非常重要的配置文件目录！！！<br />非常重要的配置文件目录！！！<br />非常重要的配置文件目录！！！<br />![image.png](/img/doc-img/1.2.0/deployparam-img/conf-120.png)

- env目录下的.dolphinscheduller_env.sh文件中记录了所有跟ds-task相关的环境变量,1.2.0版本的Spark不具备指定Spark版本的功能，可以注释掉SPARK_HOME1或者将SPARK_HOME1和SPARK_HOME2均配置为集群中的Spark2。下面给出CDH中的配置，测试环境中没有部署Flink，请忽略Flink的配置。（特别注意这是个隐藏文件，需要ls -al）
```shell
export HADOOP_HOME=/opt/cloudera/parcels/CDH/lib/hadoop
export HADOOP_CONF_DIR=/opt/cloudera/parcels/CDH/lib/hadoop/etc/hadoop
#可以注释掉，也可以配置为SPARK_HOME2
#export SPARK_HOME1=/opt/cloudera/parcels/SPARK2/lib/spark2
export SPARK_HOME2=/opt/cloudera/parcels/SPARK2/lib/spark2
export PYTHON_HOME=/usr/local/anaconda3/bin/python
export JAVA_HOME=/usr/java/jdk1.8.0_131
export HIVE_HOME=/opt/cloudera/parcels/CDH/lib/hive
export FLINK_HOME=/opt/soft/flink
export PATH=$HADOOP_HOME/bin:$SPARK_HOME1/bin:$SPARK_HOME2/bin:$PYTHON_HOME:$JAVA_HOME/bin:$HIVE_HOME/bin:$PATH:$FLINK_HOME/bin:$PATH
```
<a name="chqEB"></a>
#### common目录
common目录包含：common.properties和hadoop/hadoop.properties

- common.properies
  - ds的task队列实现方式，默认是Zookeeper
  - ds的task和资源的worker执行路径
  - 资源中心
    - 资源中心可选择HDFS和S3
  - 资源文件类型
  - kerberos
  - 开发状态
    - 开发测试可以开启，生产环境建议设置为false
  - ds的环境变量配置，本地调试的时候，需要保证dolphinscheduler.env.path存在
- hadoop.properties
  - hdfs namenode配置
    - 单点可以直接写namenode的ip
    - hdfsHA需要将集群的core-site.xml和hdfs-site.xml文件拷贝到ds的conf目录下
  - s3配置
  - yarn resourcemanager配置
    - 单点配置yarn.application.status.address
    - HA配置yarn.resourcemanager.ha.rm.ids
<a name="ggGBc"></a>
#### config目录
config目录包含install_config.conf和run_config.conf

- install_config.conf
  - ds的安装路径
  - 部署用户
  - 部署ds的机器组ip
- run_config.conf
  - 指定ds的masters，workers，alertServer，apiServer部署在哪些机器上
<a name="AC8Jm"></a>
#### alert.properties

- 邮件告警配置
- excel下载目录
- 企业微信配置
<a name="1qiHb"></a>
#### application-api.properties

- apiserver端口，上下文，日志等
<a name="IiX6U"></a>
#### application-dao.properties
敲黑板，重点！！！ds的元数据库配置，在ds-1.2.0中默认的数据库是pg，如果要使用MySQL，需要将MySQL的jdbc包放到lib目录下。

- ds元数据库配置
<a name="oomWN"></a>
#### master.properties

- master执行线程数
- master并行任务上限
- master资源CPU和内存阈值，超出阈值不会进行dag切分
<a name="ZeAdP"></a>
#### worker.properties

- worker执行线程数
- worker一次提交任务数
- worker资源CPU和内存阈值，超出不会去task队列拉取task
<a name="saeo8"></a>
#### Zookeeper.properties

- zk集群
- ds所需zk的znode，包含dag和task的分布式锁和master和worker的容错
<a name="2eTCI"></a>
#### quartz.properties
ds的定时由quartz框架完成，特别注意里边有quartz的数据库配置！！！

- quartz的基本属性，线程池和job配置
- quartz元数据库配置
<a name="vWF4U"></a>
### install脚本
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

- dbtype参数可以设置postgresql和mysql，这里指定了ds连接元数据库的jdbc相关信息
<a name="K4u2S"></a>
#### 部署用户&目录
```shell
# conf/config/install_config.conf config
# Note: the installation path is not the same as the current path (pwd)
installPath="/data1_1T/dolphinscheduler"

# deployment user
# Note: the deployment user needs to have sudo privileges and permissions to operate hdfs. If hdfs is enabled, the root directory needs to be created by itself
deployUser="dolphinscheduler"
```

- installPath是安装路径，在执行install.sh之后，会把ds安装到指定目录，如/opt/ds-agent。installPath不要和当前要一键安装的install.sh是同一目录。
- deployUser是指ds的部署用户，该用户需要在部署ds的机器上打通sudo免密，并且需要具有操作hdfs的权限，建议挂到hadoop的supergroup组下。
<a name="6rEDt"></a>
#### zk集群&角色指定

- 配置zk集群的时候，特别注意：要用ip:2181的方式配置上去，一定要把端口带上。
- ds一共包括master worker alert api四种角色，其中alert api只需指定一台机器即可，master和worker可以部署多态机器。下面的例子就是在4台机器中，部署2台master，2台worker，1台alert，1台api
- ips参数，填写所有需要部署机器的hostname
- masters，填写部署master机器的hostname
- workers，填写部署worker机器的hostname
- alertServer，填写部署alert机器的hostname
- apiServers，填写部署api机器的hostname
- zkroot参数可以通过调整，在一套zk集群中，托管多个ds集群，如配置zkRoot="/dspro",zkRoot="/dstest"
```shell
# zk cluster
zkQuorum="192.168.xx.xx:2181,192.168.xx.xx:2181,192.168.xx.xx:2181"

# install hosts
# Note: install the scheduled hostname list. If it is pseudo-distributed, just write a pseudo-distributed hostname
ips="ark0,ark1,ark2,ark3"

# conf/config/run_config.conf config
# run master machine
# Note: list of hosts hostname for deploying master
masters="ark0,ark1"

# run worker machine
# note: list of machine hostnames for deploying workers
workers="ark2,ark3"

# run alert machine
# note: list of machine hostnames for deploying alert server
alertServer="ark3"

# run api machine
# note: list of machine hostnames for deploying api server
apiServers="ark1"

# zk config
# zk root directory
zkRoot="/dolphinscheduler"

# used to record the zk directory of the hanging machine
zkDeadServers="$zkRoot/dead-servers"

# masters directory
zkMasters="$zkRoot/masters"

# workers directory
zkWorkers="$zkRoot/workers"

# zk master distributed lock
mastersLock="$zkRoot/lock/masters"

# zk worker distributed lock
workersLock="$zkRoot/lock/workers"

# zk master fault-tolerant distributed lock
mastersFailover="$zkRoot/lock/failover/masters"

# zk worker fault-tolerant distributed lock
workersFailover="$zkRoot/lock/failover/workers"

# zk master start fault tolerant distributed lock
mastersStartupFailover="$zkRoot/lock/failover/startup-masters"

# zk session timeout
zkSessionTimeout="300"

# zk connection timeout
zkConnectionTimeout="300"

# zk retry interval
zkRetrySleep="100"

# zk retry maximum number of times
zkRetryMaxtime="5"
```
<a name="7aGb8"></a>
#### 邮件配置&excel文件路径

- 邮件配置这块也是大家非常容易出问题的，建议可以拉一下ds的代码，跑一下alert.MailUtilisTest这个测试类，下面给出QQ邮箱配置方式。如果是内网邮箱，需要注意的是ssl是否需要关闭，以及mail.user登陆用户是否需要去掉邮箱后缀。
- excel路径则需要保证该路径的写入权限
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

# alert port
alertPort=7789
```
<a name="h0lJz"></a>
#### apiServer配置

- apiServer这里可以关注一下，apiserver的端口和上下文即apiServerPort和apiServerContextPath参数
```shell
# api config
# api server port
apiServerPort="12345"

# api session timeout
apiServerSessionTimeout="7200"

# api server context path
apiServerContextPath="/dolphinscheduler/"

# spring max file size
springMaxFileSize="1024MB"

# spring max request size
springMaxRequestSize="1024MB"

# api max http post size
apiMaxHttpPostSize="5000000"
```
<a name="T4u9c"></a>
#### 资源中心&YARN

- ds的资源中心支持HDFS和S3.
- resUploadStartupType="HDFS"则开启hdfs作为资源中心。
- defaultFS，如果hdfs没有配置HA则需要在这里写上单点namenode的ip，如果HDFS是HA则需要将集群的core-site.xml文件和hdfs-site.xml文件拷贝到conf目录下
- yarnHaIps，如果yarn启用了HA，配置两个resourcemanager的ip，如果是单点，配置空字符串
- singleYarnIp，如果yarn是单点，配置resourcemanager的ip
- hdfsPath，HDFS上ds存储资源的根路径，可采用默认值，如果是从1.1.0版本进行升级，需要注意这个地方，改为/escheduler
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

- devState在测试环境部署的时候可以调为true，生产环境部署建议调为false
```shell
# development status, if true, for the SHELL script, you can view the encapsulated SHELL script in the execPath directory. 
# If it is false, execute the direct delete
devState="true"
```
<a name="x9hTX"></a>
#### 角色参数

- 下面的参数主要是调整的application.properties里边的配置，涉及master,worker和apiserver
- apiServerPort可以自定义修改apiserver的端口，注意需要跟前端保持一致。
- master和worker的参数，初次部署建议保持默认值，如果在运行当中出现性能问题在作调整，有条件可以压一下自身环境中的master和worker的最佳线程数。
- worker.reserved.memory是worker的内存阈值，masterReservedMemory是master的内存阈值，建议调整为0.1
- masterMaxCpuLoadAvg建议注释掉，ds-1.2.0master和worker的CPU负载给出了默认cpu线程数 * 2的默认值
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
masterTaskCommitInterval="100"

# master maximum cpu average load, used to determine whether the master has execution capability
#masterMaxCpuLoadAvg="10"

# master reserve memory to determine if the master has execution capability
masterReservedMemory="1"

# master port
masterPort=5566

# worker config 
# worker execution thread
workerExecThreads="100"

# worker heartbeat interval
workerHeartbeatInterval="10"

# worker number of fetch tasks
workerFetchTaskNum="3"

# worker reserve memory to determine if the master has execution capability
workerReservedMemory="1"

# master port
workerPort=7788
```
<a name="3QaMD"></a>
### 特别注意

- ds需要启用资源中心之后，才可以创建租户，因此资源中心的配置一定要正确
- ds老版本部署需要配置JDK的问题已经解决
- installPath不要和当前要一键安装的install.sh是同一目录
- ds的task运行都依赖env目录下的环境变量文件，需要正确配置
- HDFS高可用，需要把core-site.xml和hdfs-site.xml文件拷贝到conf目录下
- 邮件配置中mailUser和mailSender的区别

