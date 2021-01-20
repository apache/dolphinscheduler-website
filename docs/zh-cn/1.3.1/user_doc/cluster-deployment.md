# 集群部署(Cluster)

# 1、基础软件安装(必装项请自行安装)

 * PostgreSQL (8.2.15+) or MySQL (5.7系列)  :  两者任选其一即可
 * [JDK](https://www.oracle.com/technetwork/java/javase/downloads/index.html) (1.8+) :  必装，请安装好后在/etc/profile下配置 JAVA_HOME 及 PATH 变量
 * ZooKeeper (3.4.6+) ：必装 
 * Hadoop (2.6+) or MinIO ：选装，如果需要用到资源上传功能，可以选择上传到Hadoop or MinIO上

```markdown
 注意：DolphinScheduler本身不依赖Hadoop、Hive、Spark,仅是会调用他们的Client，用于对应任务的提交。
```

# 2、下载二进制tar.gz包

- 请下载最新版本的后端安装包至服务器部署目录,比如创建 /opt/dolphinscheduler 做为安装部署目录，下载地址： [下载](/zh-cn/download/download.html)，下载后上传tar包到该目录中，并进行解压

```shell
# 创建部署目录,部署目录请不要创建在/root、/home等高权限目录 
mkdir -p /opt/dolphinscheduler;
cd /opt/dolphinscheduler;
# 解压缩
tar -zxvf apache-dolphinscheduler-incubating-1.3.1-dolphinscheduler-bin.tar.gz -C /opt/dolphinscheduler;

mv apache-dolphinscheduler-incubating-1.3.1-dolphinscheduler-bin  dolphinscheduler-bin
```

# 3、创建部署用户和hosts映射

- 在**所有**部署调度的机器上创建部署用户，并且一定要配置sudo免密。假如我们计划在ds1,ds2,ds3,ds4这4台机器上部署调度，首先需要在每台机器上都创建部署用户

```shell
# 创建用户需使用root登录，设置部署用户名，请自行修改，后面以dolphinscheduler为例
useradd dolphinscheduler;

# 设置用户密码，请自行修改，后面以dolphinscheduler123为例
echo "dolphinscheduler123" | passwd --stdin dolphinscheduler

# 配置sudo免密
echo 'dolphinscheduler  ALL=(ALL)  NOPASSWD: NOPASSWD: ALL' >> /etc/sudoers
sed -i 's/Defaults    requirett/#Defaults    requirett/g' /etc/sudoers

```

```
 注意：
 - 因为是以 sudo -u {linux-user} 切换不同linux用户的方式来实现多租户运行作业，所以部署用户需要有 sudo 权限，而且是免密的。
 - 如果发现/etc/sudoers文件中有"Default requiretty"这行，也请注释掉
 - 如果用到资源上传的话，还需要在`HDFS或者MinIO`上给该部署用户分配读写的权限
```

# 4、配置hosts映射和ssh打通及修改目录权限

- 以第一台机器(hostname为ds1)作为部署机，在ds1上配置所有待部署机器的hosts, 在ds1以root登录

  ```shell
  vi /etc/hosts
  
  #add ip hostname
  192.168.xxx.xxx ds1
  192.168.xxx.xxx ds2
  192.168.xxx.xxx ds3
  192.168.xxx.xxx ds4
  ```

  *注意：请删掉或者注释掉127.0.0.1这行*

- 同步ds1上的/etc/hosts到所有部署机器

  ```shell
  for ip in ds2 ds3;     #请将此处ds2 ds3替换为自己要部署的机器的hostname
  do
      sudo scp -r /etc/hosts  $ip:/etc/          #在运行中需要输入root密码
  done
  ```

  *备注：当然 通过`sshpass -p xxx sudo scp -r /etc/hosts $ip:/etc/`就可以省去输入密码了*

  > centos下sshpass的安装：
  >
  > 1. 先安装epel
  >
  >    yum install -y epel-release
  >
  >    yum repolist
  >
  > 2. 安装完成epel之后，就可以按照sshpass了
  >
  >    yum install -y sshpass
  >
  >    

- 在ds1上，切换到部署用户并配置ssh本机免密登录

  ```shell
   su dolphinscheduler;
  
  ssh-keygen -t rsa -P '' -f ~/.ssh/id_rsa
  cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
  chmod 600 ~/.ssh/authorized_keys
  ```
​      注意：*正常设置后，dolphinscheduler用户在执行命令`ssh localhost` 是不需要再输入密码的*



- 在ds1上，配置部署用户dolphinscheduler ssh打通到其他待部署的机器

  ```shell
  su dolphinscheduler;
  for ip in ds2 ds3;     #请将此处ds2 ds3替换为自己要部署的机器的hostname
  do
      ssh-copy-id  $ip   #该操作执行过程中需要手动输入dolphinscheduler用户的密码
  done
  # 当然 通过 sshpass -p xxx ssh-copy-id $ip 就可以省去输入密码了
  ```

- 在ds1上，修改目录权限，使得部署用户对dolphinscheduler-bin目录有操作权限

  ```shell
  sudo chown -R dolphinscheduler:dolphinscheduler dolphinscheduler-bin
  ```

# 5、数据库初始化

- 进入数据库，默认数据库是PostgreSQL，如选择MySQL的话，后续需要添加mysql-connector-java驱动包到DolphinScheduler的lib目录下，这里以MySQL为例
``` 
mysql -h192.168.xx.xx -P3306 -uroot -p
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

    ```shell
      vi conf/datasource.properties
    ```

    - 如果选择 MySQL，请注释掉 PostgreSQL 相关配置(反之同理), 还需要手动添加 [[ mysql-connector-java 驱动 jar ](https://downloads.mysql.com/archives/c-j/)] 包到 lib 目录下，这里下载的是mysql-connector-java-5.1.47.jar，然后正确配置数据库连接相关信息
    
    ```properties
      #postgre
      #spring.datasource.driver-class-name=org.postgresql.Driver
      #spring.datasource.url=jdbc:postgresql://localhost:5432/dolphinscheduler
      # mysql
      spring.datasource.driver-class-name=com.mysql.jdbc.Driver
      spring.datasource.url=jdbc:mysql://xxx:3306/dolphinscheduler?useUnicode=true&characterEncoding=UTF-8&allowMultiQueries=true     需要修改ip
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

     `注: 这一步非常重要,例如 JAVA_HOME 和 PATH 是必须要配置的，没有用到的可以忽略或者注释掉`



- 将jdk软链到/usr/bin/java下(仍以 JAVA_HOME=/opt/soft/java 为例)

    ```shell
    sudo ln -s /opt/soft/java/bin/java /usr/bin/java
    ```

 - 修改一键部署配置文件 `conf/config/install_config.conf`中的各参数，特别注意以下参数的配置

    ```shell
    # 这里填 mysql or postgresql
    dbtype="mysql"

    # 数据库连接地址
    dbhost="192.168.xx.xx:3306"

    # 数据库名
    dbname="dolphinscheduler"

    # 数据库用户名，此处需要修改为上面设置的{user}具体值
    username="xxx"

    # 数据库密码, 如果有特殊字符，请使用\转义，需要修改为上面设置的{password}具体值
    password="xxx"

    #Zookeeper地址
    zkQuorum="192.168.xx.xx:2181,192.168.xx.xx:2181,192.168.xx.xx:2181"

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

    # 如果上传资源保存想保存在hadoop上，hadoop集群的NameNode启用了HA的话，需要将hadoop的配置文件core-site.xml和hdfs-site.xml放到安装路径(上面的installPath)的conf目录下，本例即是放到/opt/soft/dolphinscheduler/conf下面，并配置namenode cluster名称；如果NameNode不是HA,则只需要将mycluster修改为具体的ip或者主机名即可
    defaultFS="hdfs://mycluster:8020"


    # 如果没有使用到Yarn,保持以下默认值即可;如果ResourceManager是HA，则配置为ResourceManager节点的主备ip或者hostname,比如"192.168.xx.xx,192.168.xx.xx";如果是单ResourceManager请配置yarnHaIps=""即可
    yarnHaIps="192.168.xx.xx,192.168.xx.xx"

    # 如果ResourceManager是HA或者没有使用到Yarn保持默认值即可；如果是单ResourceManager，请配置真实的ResourceManager主机名或者ip
    singleYarnIp="yarnIp1"

    # 资源上传根路径,主持HDFS和S3,由于hdfs支持本地文件系统，需要确保本地文件夹存在且有读写权限
    resourceUploadPath="/data/dolphinscheduler"

    # 具备权限创建resourceUploadPath的用户
    hdfsRootUser="hdfs"



    #在哪些机器上部署DS服务，本机选localhost
    ips="ds1,ds2,ds3,ds4"

    #ssh端口,默认22
    sshPort="22"

    #master服务部署在哪台机器上
    masters="ds1,ds2"

    #worker服务部署在哪台机器上,并指定此worker属于哪一个worker组,下面示例的default即为组名
    workers="ds3:default,ds4:default"

    #报警服务部署在哪台机器上
    alertServer="ds2"

    #后端api服务部署在在哪台机器上
    apiServers="ds1"

    ```
    
    *特别注意：*
    
    - 如果需要用资源上传到Hadoop集群功能， 并且Hadoop集群的NameNode 配置了 HA的话 ，需要开启 HDFS类型的资源上传，同时需要将Hadoop集群下的core-site.xml和hdfs-site.xml复制到/opt/dolphinscheduler/conf，非NameNode HA跳过次步骤
   
   
   
# 7、一键部署

- 切换到部署用户dolphinscheduler，然后执行一键部署脚本

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


-----
### 附录：

 - 如果您需要使用到企业微信进行告警，请在安装完成后，修改 alert.properties 文件，然后重启 alert 服务即可：
   
    ```
    # 设置企业微信告警功能是否开启：开启为 true，否则为 false。
    enterprise.wechat.enable="true"
    ```
   
    ```
    # 设置 corpid，每个企业都拥有唯一的 corpid，获取此信息可在管理后台“我的企业”－“企业信息”下查看“企业 ID”（需要有管理员权限）
    enterprise.wechat.corp.id="xxx"
    ```
    <p align="center">
      <img src="/img/alert/corpid.png" width="60%" />
    </p>
    
    ```
    # 设置 secret，secret 是企业应用里面用于保障数据安全的“钥匙”，每一个应用都有一个独立的访问密钥。
    enterprise.wechat.secret="xxx"
    ```
    <p align="center">
     <img src="/img/alert/secret.png" width="60%" />
    </p>
    
    ```
    # 设置 agentid，每个应用都有唯一的 agentid。在管理后台->“应用与小程序”->“应用”，点进某个应用，即可看到 agentid。
    enterprise.wechat.agent.id="xxxx"
    ```
   <p align="center">
    <img src="/img/alert/agentid.png" width="60%" />
   </p>
   
    ```
    # 设置 userid，多个用逗号分隔。每个成员都有唯一的 userid，即所谓“帐号”。在管理后台->“通讯录”->点进某个成员的详情页，可以看到。
    enterprise.wechat.users=zhangsan,lisi
    ```
      <p align="center">
       <img src="/img/alert/userid.png" width="60%" />
      </p>
      
    ```
    # 获取 access_token 的地址，使用如下例子无需修改。
    enterprise.wechat.token.url=https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid={corpId}&corpsecret={secret}
   
    # 发送应用消息地址，使用如下例子无需改动。
    enterprise.wechat.push.url=https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token={token}
    
    #发送消息格式，无需改动
    enterprise.wechat.user.send.msg={\"touser\":\"{toUser}\",\"agentid\":\"{agentId}\",\"msgtype\":\"markdown\",\"markdown\":{\"content\":\"{msg}\"}}
   ```
 - 关于dolphinscheduler 在运行过程中，网卡使用说明：
 
   > master服务，worker服务在zookeeper注册时，会以ip:port的形式创建相关信息。
     
      在明确通信网卡情况下，可以指定网卡名称的方式获取ip地址，配置方式是在`common.properties`中修改配置：
                                                                                                                                                                                                                                                                                                                                                                                                                                                        
      ```
      dolphin.scheduler.network.interface.preferred=eth0
      ```  
                                                                                                                                                                                                                                                                                                                                                                                                                                                        
     如linux系统通过`ifconfig`命令查看网络信息,以下图为例，配置eth0就是使用图中eth0的网卡作为通信网卡：
     
      <p align="center">
           <img src="/img/network/network_config.png" width="60%" />
      </p>
                                       
     还可以使用dolphinscheduler提供的三种策略，获取可用ip：
   
      1. default: 优先获取内网网卡获取ip地址，其次获取外网网卡获取ip地址，在前两项失效情况下，使用第一块可用网卡的地址。
      2. inner: 使用内网网卡获取ip地址，如果获取失败抛出异常信息。
      3. outter: 使用外网网卡获取ip地址，如果获取失败抛出异常信息。
      
      配置方式是在`common.properties`中修改相关配置：
      
      ```
       # Network IP gets priority, default inner outer
       #dolphin.scheduler.network.priority.strategy=default
      ```
      以上配置修改后重启服务生效。                         
