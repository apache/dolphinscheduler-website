# 伪集群部署

伪集群部署目的是在单台机器部署 DolphinScheduler 服务，master、worker、api server、logger server在同一台机器上

## 生产准备

* [JDK 1.8+](https://www.oracle.com/java/technologies/downloads/)
* [DolphinScheduler](https://dolphinscheduler.apache.org/zh-cn/download/download.html)
* [PostgreSQL 8.2.15+](https://www.postgresql.org/download/)
* [MySQL 5.7+](https://dev.mysql.com/downloads/mysql/)
* [ZooKeeper 3.4.6+](https://zookeeper.apache.org/releases.html)
* 进程树分析
  * macOS安装`pstree`
  * Fedora/Red/Hat/CentOS/Ubuntu/Debian安装`psmisc`

> **_注意:_** DolphinScheduler 本身不依赖 Hadoop、Hive、Spark，但如果你运行的任务需要依赖他们，就需要有对应的环境支持

## 安装 DolphinScheduler

创建 dolphinscheduler 用户

```shell
# 创建 root 用户
useradd dolphinscheduler
# 设置密码
echo "dolphinscheduler" | passwd --stdin dolphinscheduler
# 配置免密
sed -i '$adolphinscheduler  ALL=(ALL)  NOPASSWD: NOPASSWD: ALL' /etc/sudoers
sed -i 's/Defaults    requirett/#Defaults    requirett/g' /etc/sudoers
# 修改目录权限
chown -R dolphinscheduler:dolphinscheduler apache-dolphinscheduler-*-bin
```

配置免密登陆

```shell
su dolphinscheduler

ssh-keygen -t rsa -P '' -f ~/.ssh/id_rsa
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```
启动 Zookeeper

```shell
# 修改配置
cp `zoo_sample.cfg` `conf/zoo.cfg`
vi conf/zoo.cfg
dataDir=./tmp/zookeeper
# 启动 zookeeper
./bin/zkServer.sh start
```


修改配置：

部署需要修改**INSTALL MACHINE、DolphinScheduler ENV、Database、Registry Server**

```shell
# ---------------------------------------------------------
# INSTALL MACHINE
# ---------------------------------------------------------
# 单节点部署 master、worker、API server，服务器IP为机器IP或localhost
ips="localhost"
masters="localhost"
workers="localhost:default"
alertServer="localhost"
apiServers="localhost"
pythonGatewayServers="localhost"

# DolphinScheduler安装路径
installPath="~/dolphinscheduler"

# 创建用户
deployUser="dolphinscheduler"

# ---------------------------------------------------------
# DolphinScheduler ENV
# ---------------------------------------------------------
# JAVA_HOME 路径
javaHome="/..."

# ---------------------------------------------------------
# Database
# ---------------------------------------------------------
# 数据库类型:用户名/密码/IP/端口/元数据库
#DATABASE_TYPE 目前支持 mysql/postgresql/H2
DATABASE_TYPE="mysql"
SPRING_DATASOURCE_URL="jdbc:mysql://ds1:3306/ds_201_doc?useUnicode=true&characterEncoding=UTF-8"
# ---------------------------------------------------------
# Registry Server
# ---------------------------------------------------------
# 注册中心地址
registryServers="localhost:2181"
```

初始化数据库

```shell
mysql -uroot -p

mysql> CREATE DATABASE dolphinscheduler DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci;

# 修改 {user} 和 {password}
mysql> GRANT ALL PRIVILEGES ON dolphinscheduler.* TO '{user}'@'%' IDENTIFIED BY '{password}';
mysql> GRANT ALL PRIVILEGES ON dolphinscheduler.* TO '{user}'@'localhost' IDENTIFIED BY '{password}';

mysql> flush privileges;
```

shell 脚本初始化数据库

```shell
sh script/create-dolphinscheduler.sh
```

## 启动 DolphinScheduler

使用上面创建的**部署用户**运行以下命令完成部署，部署后的运行日志将存放在 logs 文件夹内

```shell
sh install.sh

# 首次部署，可能出现 5 次`sh: bin/dolphinscheduler-daemon.sh: No such file or directory`相关信息
```

登录 DolphinScheduler

浏览器访问地址：http://localhost:12345/dolphinscheduler
默认密码：admin/dolphinscheduler123

关闭 DolphinScheduler

```shell
# 所有服务
sh ./bin/stop-all.sh

# 所有服务
sh ./bin/start-all.sh

# Master
sh ./bin/dolphinscheduler-daemon.sh stop master-server
sh ./bin/dolphinscheduler-daemon.sh start master-server

# Worker
sh ./bin/dolphinscheduler-daemon.sh start worker-server
sh ./bin/dolphinscheduler-daemon.sh stop worker-server

# Api
sh ./bin/dolphinscheduler-daemon.sh start api-server
sh ./bin/dolphinscheduler-daemon.sh stop api-server

# Logger
sh ./bin/dolphinscheduler-daemon.sh start logger-server
sh ./bin/dolphinscheduler-daemon.sh stop logger-server

# Alert
sh ./bin/dolphinscheduler-daemon.sh start alert-server
sh ./bin/dolphinscheduler-daemon.sh stop alert-server

# Python Gateway
sh ./bin/dolphinscheduler-daemon.sh start python-gateway-server
sh ./bin/dolphinscheduler-daemon.sh stop python-gateway-server
```
