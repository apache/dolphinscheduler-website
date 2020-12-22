# 单机部署(Standalone)

# 1、基础软件安装(必装项请自行安装)

 * PostgreSQL (8.2.15+) or MySQL (5.7系列)  :  两者任选其一即可
 * [JDK](https://www.oracle.com/technetwork/java/javase/downloads/index.html) (1.8+) :  必装，请安装好后在/etc/profile下配置 JAVA_HOME 及 PATH 变量
 * ZooKeeper (3.4.6+) ：必装 
 * Hadoop (2.6+) or MinIO ：选装， 如果需要用到资源上传功能，针对单机可以选择本地文件目录作为上传文件夹(此操作不需要部署Hadoop)；当然也可以选择上传到Hadoop or MinIO集群上

```markdown
 注意：DolphinScheduler本身不依赖Hadoop、Hive、Spark,仅是会调用他们的Client，用于对应任务的运行。
```

# 2、下载二进制tar.gz包

- 请下载最新版本的后端安装包至服务器部署目录,比如创建 /opt/dolphinscheduler 做为安装部署目录，下载地址： [下载](https://dolphinscheduler.apache.org/zh-cn/docs/release/download.html)，下载后上传tar包到该目录中，并进行解压

```shell
# 创建部署目录,部署目录请不要创建在/root、/home等高权限目录 
mkdir -p /opt/dolphinscheduler;
cd /opt/dolphinscheduler;
# 解压缩
tar -zxvf apache-dolphinscheduler-incubating-1.3.1-dolphinscheduler-bin.tar.gz -C /opt/dolphinscheduler;
 
mv apache-dolphinscheduler-incubating-1.3.1-dolphinscheduler-bin  dolphinscheduler-bin
```

# 3、创建部署用户并赋予目录操作权限

- 创建部署用户，并且一定要配置sudo免密。以创建dolphinscheduler用户为例

```shell
# 创建用户需使用root登录
useradd dolphinscheduler;

# 添加密码
echo "dolphinscheduler" | passwd --stdin dolphinscheduler

# 配置sudo免密
sed -i '$adolphinscheduler  ALL=(ALL)  NOPASSWD: NOPASSWD: ALL' /etc/sudoers
sed -i 's/Defaults    requirett/#Defaults    requirett/g' /etc/sudoers

# 修改目录权限，使得部署用户对dolphinscheduler-bin目录有操作权限
chown -R dolphinscheduler:dolphinscheduler dolphinscheduler-bin
```

```
 注意：
 - 因为任务执行服务是以 sudo -u {linux-user} 切换不同linux用户的方式来实现多租户运行作业，所以部署用户需要有 sudo 权限，而且是免密的。初学习者不理解的话，完全可以暂时忽略这一点
 - 如果发现/etc/sudoers文件中有"Default requiretty"这行，也请注释掉
 - 如果用到资源上传的话，还需要给该部署用户分配操作`本地文件系统或者HDFS或者MinIO`的权限
```

# 4、ssh免密配置

- 切换到部署用户并配置ssh本机免密登录

```shell
su dolphinscheduler;

ssh-keygen -t rsa -P '' -f ~/.ssh/id_rsa
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```
注意：*正常设置后，dolphinscheduler用户在执行命令`ssh localhost` 是不需要再输入密码的*

# 5、数据库初始化

- 进入数据库，默认数据库是PostgreSQL，如选择MySQL的话，后续需要添加mysql-connector-java驱动包到DolphinScheduler的lib目录下
``` 
mysql -uroot -p
```

- 进入数据库命令行窗口后，执行数据库初始化命令，设置访问账号和密码。**注: {user} 和 {password} 需要替换为具体的数据库用户名和密码** 

    ``` mysql
    mysql> CREATE DATABASE dolphinscheduler DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci;
    mysql> GRANT ALL PRIVILEGES ON dolphinscheduler.* TO '{user}'@'%' IDENTIFIED BY '{password}';
    mysql> GRANT ALL PRIVILEGES ON dolphinscheduler.* TO '{user}'@'localhost' IDENTIFIED BY '{password}';
    mysql> flush privileges;
    ```


- 创建表和导入基础数据

    - 修改 conf 目录下 datasource.properties 中的下列配置

      - ```shell
        vi conf/datasource.properties
        ```

    - 如果选择 MySQL，请注释掉 PostgreSQL 相关配置(反之同理), 还需要手动添加 [[ mysql-connector-java 驱动 jar ](https://downloads.MySQL.com/archives/c-j/)] 包到 lib 目录下，这里下载的是mysql-connector-java-5.1.47.jar，然后正确配置数据库连接相关信息
    
    ```properties
      # postgre
      #spring.datasource.driver-class-name=org.postgresql.Driver
      #spring.datasource.url=jdbc:postgresql://localhost:5432/dolphinscheduler
      # mysql
      spring.datasource.driver-class-name=com.mysql.jdbc.Driver
      spring.datasource.url=jdbc:mysql://xxx:3306/dolphinscheduler?useUnicode=true&characterEncoding=UTF-8&allowMultiQueries=true     需要修改ip，本机localhost即可
      spring.datasource.username=xxx						需要修改为上面的{user}值
      spring.datasource.password=xxx						需要修改为上面的{password}值
    ```

    - 修改并保存完后，执行 script 目录下的创建表及导入基础数据脚本

    ```shell
    sh script/create-dolphinscheduler.sh
    ```

​       *注意: 如果执行上述脚本报 ”/bin/java: No such file or directory“ 错误，请在/etc/profile下配置  JAVA_HOME 及 PATH 变量*

# 6、修改运行参数

- 修改 conf/env 目录下的 `dolphinscheduler_env.sh` 环境变量(以相关用到的软件都安装在/opt/soft下为例)

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

     `注: 这一步非常重要,例如 JAVA_HOME 和 PATH 是必须要配置的，没有用到的可以忽略或者注释掉；如果找不到dolphinscheduler_env.sh, 请运行 ls -a`

    

- 将jdk软链到/usr/bin/java下(仍以 JAVA_HOME=/opt/soft/java 为例)

    ```shell
    sudo ln -s /opt/soft/java/bin/java /usr/bin/java
    ```

 - 修改一键部署配置文件 `conf/config/install_config.conf`中的各参数，特别注意以下参数的配置

    ```shell
    # 这里填 mysql or postgresql
    dbtype="mysql"
    
    # 数据库连接地址
    dbhost="localhost:3306"
    
    # 数据库名
    dbname="dolphinscheduler"
    
    # 数据库用户名，此处需要修改为上面设置的{user}具体值
    username="xxx"    
    
    # 数据库密码, 如果有特殊字符，请使用\转义，需要修改为上面设置的{password}具体值
    password="xxx"

    #Zookeeper地址，单机本机是localhost:2181，记得把2181端口带上
    zkQuorum="localhost:2181"
    
    #将DS安装到哪个目录，如: /opt/soft/dolphinscheduler，不同于现在的目录
    installPath="/opt/soft/dolphinscheduler"
    
    #使用哪个用户部署，使用第3节创建的用户
    deployUser="dolphinscheduler"
    
    # 邮件配置，以qq邮箱为例
    # 邮件协议
    mailProtocol="SMTP"

    # 邮件服务地址
    mailServerHost="smtp.qq.com"

    # 邮件服务端口
    mailServerPort="25"

    # mailSender和mailUser配置成一样即可
    # 发送者
    mailSender="xxx@qq.com"

    # 发送用户
    mailUser="xxx@qq.com"

    # 邮箱密码
    mailPassword="xxx"

    # TLS协议的邮箱设置为true，否则设置为false
    starttlsEnable="true"

    # 开启SSL协议的邮箱配置为true，否则为false。注意: starttlsEnable和sslEnable不能同时为true
    sslEnable="false"

    # 邮件服务地址值，参考上面 mailServerHost
    sslTrust="smtp.qq.com"

    # 业务用到的比如sql等资源文件上传到哪里，可以设置：HDFS,S3,NONE，单机如果想使用本地文件系统，请配置为HDFS，因为HDFS支持本地文件系统；如果不需要资源上传功能请选择NONE。强调一点：使用本地文件系统不需要部署hadoop
    resourceStorageType="HDFS"

    # 这里以保存到本地文件系统为例
    #注：但是如果你想上传到HDFS的话，NameNode启用了HA，则需要将hadoop的配置文件core-site.xml和hdfs-site.xml放到conf目录下，本例即是放到/opt/dolphinscheduler/conf下面，并配置namenode cluster名称；如果NameNode不是HA,则修改为具体的ip或者主机名即可
    defaultFS="file:///data/dolphinscheduler"    #hdfs://{具体的ip/主机名}:8020

    # 如果没有使用到Yarn,保持以下默认值即可；如果ResourceManager是HA，则配置为ResourceManager节点的主备ip或者hostname,比如"192.168.xx.xx,192.168.xx.xx";如果是单ResourceManager请配置yarnHaIps=""即可
    yarnHaIps="192.168.xx.xx,192.168.xx.xx"

    # 如果ResourceManager是HA或者没有使用到Yarn保持默认值即可；如果是单ResourceManager，请配置真实的ResourceManager主机名或者ip
    singleYarnIp="yarnIp1"

    # 资源上传根路径,支持HDFS和S3,由于hdfs支持本地文件系统，需要确保本地文件夹存在且有读写权限
    resourceUploadPath="/data/dolphinscheduler"

    # 具备权限创建resourceUploadPath的用户
    hdfsRootUser="hdfs"

    #在哪些机器上部署DS服务，本机选localhost
    ips="localhost"

    #ssh端口,默认22
    sshPort="22"
    
    #master服务部署在哪台机器上
    masters="localhost"

    #worker服务部署在哪台机器上,并指定此worker属于哪一个worker组,下面示例的default即为组名
    workers="localhost:default"
    
    #报警服务部署在哪台机器上
    alertServer="localhost"
    
    #后端api服务部署在在哪台机器上
    apiServers="localhost"

    ```
    

    
    *注：如果打算用到`资源中心`功能，请执行以下命令：*
    
    ```shell
    sudo mkdir /data/dolphinscheduler
    sudo chown -R dolphinscheduler:dolphinscheduler /data/dolphinscheduler
    ```

# 7、一键部署

- 切换到部署用户，执行一键部署脚本

    `sh install.sh` 

    ```
    注意：
    第一次部署的话，在运行中第3步`3,stop server`出现5次以下信息，此信息可以忽略
    sh: bin/dolphinscheduler-daemon.sh: No such file or directory
    ```

- 脚本完成后，会启动以下5个服务，使用`jps`命令查看服务是否启动(`jps`为`java JDK`自带)

```aidl
    MasterServer         ----- master服务
    WorkerServer         ----- worker服务
    LoggerServer         ----- logger服务
    ApiApplicationServer ----- api服务
    AlertServer          ----- alert服务
```
如果以上服务都正常启动，说明自动部署成功


部署成功后，可以进行日志查看，日志统一存放于logs文件夹内

```日志路径
 logs/
    ├── dolphinscheduler-alert-server.log
    ├── dolphinscheduler-master-server.log
    |—— dolphinscheduler-worker-server.log
    |—— dolphinscheduler-api-server.log
    |—— dolphinscheduler-logger-server.log
```



# 8、登录系统

- 访问前端页面地址,接口ip(自行修改)
http://192.168.xx.xx:12345/dolphinscheduler

   <p align="center">
     <img src="/img/login.png" width="60%" />
   </p>

# 9、启停服务

* 一键停止集群所有服务

  ` sh ./bin/stop-all.sh`

* 一键开启集群所有服务

  ` sh ./bin/start-all.sh`

* 启停Master

```shell
sh ./bin/dolphinscheduler-daemon.sh start master-server
sh ./bin/dolphinscheduler-daemon.sh stop master-server
```

* 启停Worker

```shell
sh ./bin/dolphinscheduler-daemon.sh start worker-server
sh ./bin/dolphinscheduler-daemon.sh stop worker-server
```

* 启停Api

```shell
sh ./bin/dolphinscheduler-daemon.sh start api-server
sh ./bin/dolphinscheduler-daemon.sh stop api-server
```

* 启停Logger

```shell
sh ./bin/dolphinscheduler-daemon.sh start logger-server
sh ./bin/dolphinscheduler-daemon.sh stop logger-server
```

* 启停Alert

```shell
sh ./bin/dolphinscheduler-daemon.sh start alert-server
sh ./bin/dolphinscheduler-daemon.sh stop alert-server
```

`注：服务用途请具体参见《系统架构设计》小节`

