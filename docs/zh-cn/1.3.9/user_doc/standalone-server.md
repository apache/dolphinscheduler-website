# 单机体验版极速部署(Standalone)

## NOTICE:
仅供单机体验使用（切勿生产使用），采用 H2 Database,Zookeeper Testing Server。

# 1、基础软件安装(必装项请自行安装)

* [JDK](https://www.oracle.com/technetwork/java/javase/downloads/index.html) (1.8+)：必装，请安装好后在/etc/profile下配置 JAVA_HOME 及 PATH 变量
* pstree or psmisc：Mac OS必装pstree，Fedora/Red/Hat/CentOS/Ubuntu/Debian必装psmisc
* Hadoop (2.6+) or MinIO：选装，如果需要用到资源上传功能，针对单机可以选择本地文件目录作为上传文件夹(此操作不需要部署 Hadoop )；当然也可以选择上传到 Hadoop or MinIO 集群上

```markdown
 注意：DolphinScheduler 本身不依赖 Hadoop、Hive、Spark，仅会调用它们的 Client，用于运行对应的任务
```

# 2、下载二进制tar.gz包

- 请下载最新版本的后端安装包至服务器部署目录，比如创建 /opt/dolphinscheduler 做为安装部署目录，下载地址： [下载](/zh-cn/download/download.html)，下载后上传 tar 包到该目录中，并进行解压

```shell
# 创建部署目录，部署目录请不要创建在 /root、/home 等高权限目录 
mkdir -p /opt/dolphinscheduler
cd /opt/dolphinscheduler

# 解压缩
tar -zxvf apache-dolphinscheduler-1.3.9-bin.tar.gz -C /opt/dolphinscheduler
 
mv apache-dolphinscheduler-1.3.9-bin  dolphinscheduler-bin
```

# 3、创建部署用户并赋予目录操作权限

- 创建部署用户，并且一定要配置 sudo 免密。以创建 dolphinscheduler 用户为例

```shell
# 创建用户需使用 root 登录
useradd dolphinscheduler

# 添加密码
echo "dolphinscheduler" | passwd --stdin dolphinscheduler

# 配置 sudo 免密
sed -i '$adolphinscheduler  ALL=(ALL)  NOPASSWD: NOPASSWD: ALL' /etc/sudoers
sed -i 's/Defaults    requirett/#Defaults    requirett/g' /etc/sudoers

# 修改目录权限，使得部署用户对 dolphinscheduler-bin 目录有操作权限
chown -R dolphinscheduler:dolphinscheduler dolphinscheduler-bin
```

注意：
- 因为任务执行服务是以 sudo -u {linux-user} 切换不同 linux 用户的方式来实现多租户运行作业，所以部署用户需要有 sudo 权限，而且是免密的。初学习者不理解的话，完全可以暂时忽略这一点
- 如果发现 /etc/sudoers 文件中有 "Defaults requirett" 这行，也请注释掉
- 如果用到资源上传的话，还需要给该部署用户分配操作`本地文件系统或者 HDFS 或者 MinIO `的权限

# 4、ssh免密配置

- 切换到部署用户并配置 ssh 本机免密登录

```shell
su dolphinscheduler

ssh-keygen -t rsa -P '' -f ~/.ssh/id_rsa
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```
*注意：正常设置后，dolphinscheduler 用户在执行命令 `ssh localhost` 是不需要再输入密码的*

# 5、修改运行参数

- 修改 conf/env 目录下的 `dolphinscheduler_env.sh` 环境变量(以相关用到的软件都安装在 /opt/soft 下为例)

```shell
export HADOOP_HOME=/opt/soft/hadoop
export HADOOP_CONF_DIR=/opt/soft/hadoop/etc/hadoop
# export SPARK_HOME1=/opt/soft/spark1
export SPARK_HOME2=/opt/soft/spark2
export PYTHON_HOME=/opt/soft/python
export JAVA_HOME=/opt/soft/java
export HIVE_HOME=/opt/soft/hive
export FLINK_HOME=/opt/soft/flink
export DATAX_HOME=/opt/soft/datax/bin/datax.py
export PATH=$HADOOP_HOME/bin:$SPARK_HOME2/bin:$PYTHON_HOME:$JAVA_HOME/bin:$HIVE_HOME/bin:$FLINK_HOME/bin:$DATAX_HOME:$PATH
```

*注意: 这一步非常重要，例如 JAVA_HOME 和 PATH 是必须要配置的，没有用到的可以忽略或者注释掉；如果找不到 dolphinscheduler_env.sh，请运行 `ls -a`*



- 将 jdk 软链到 /usr/bin/java 下(仍以 JAVA_HOME=/opt/soft/java 为例)

```shell
sudo ln -s /opt/soft/java/bin/java /usr/bin/java
```

*注：如果打算用到 `资源中心` 功能，请执行以下命令：*

```shell
sudo mkdir /data/dolphinscheduler
sudo chown -R dolphinscheduler:dolphinscheduler /data/dolphinscheduler
```

# 6、一键启动

- 切换到部署用户，执行一键部署脚本

```shell
sh ./bin/dolphinscheduler-daemon.sh start standalone-server
```

- 脚本完成后，会启动 StandAloneServer 个服务，使用 `jps`  命令查看服务是否启动( `jps` 为 `JDK` 自带)

```aidl
    StandAloneServer         ----- DolphinScheduler单机体验服务
```
如果以上服务都正常启动，说明自动部署成功


# 7、登录系统

- 访问前端页面地址，接口 ip (自行修改)
  http://192.168.xx.xx:12345/dolphinscheduler

   <p align="center">
     <img src="/img/login.png" width="60%" />
   </p>

# 8、启停服务

* 一键启停服务
```shell
sh ./bin/dolphinscheduler-daemon.sh start standalone-server
sh ./bin/dolphinscheduler-daemon.sh stop standalone-server
```


