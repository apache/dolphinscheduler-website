## 环境搭建

如果您对本地开发的视频教程感兴趣的话，也可以跟着视频来一步一步操作:
[![ DolphinScheduler 本地开发搭建 ](/img/build_dev_video.png)](https://www.bilibili.com/video/BV1hf4y1b7sX)

#### 准备工作

1. 首先从远端仓库 fork [dolphinscheduler](https://github.com/apache/dolphinscheduler) 一份代码到自己的仓库中

2. 在开发环境中安装好 MySQL/PostgreSQL、JDK、MAVEN

3. 把自己仓库 clone 到本地

```bash
git clone https://github.com/apache/dolphinscheduler.git
```

4. git clone 项目后，进入项目目录，执行以下命令

```bash
1. git branch -a #查看分支
2. git checkout dev #切换到dev分支
3. git pull #同步分支
4. mvn -U clean package -Prelease -Dmaven.test.skip=true #mvn打包
```

#### 安装node

1. 安装nvm  
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash

2. 刷新环境变量  
    source ~/.bash_profile

3. 安装node  
    nvm install v12.20.2
    备注: Mac用户还可以通过brew安装npm: brew install npm

4. 验证node安装成功  
    node --version  

#### 安装 zookeeper

1. 下载 zookeeper  
    https://www.apache.org/dyn/closer.lua/zookeeper/zookeeper-3.6.3/apache-zookeeper-3.6.3-bin.tar.gz

2. 复制配置文件  
    cp conf/zoo_sample.cfg conf/zoo.cfg

3. 修改配置  
    vi conf/zoo.cfg  
    dataDir=./tmp/zookeeper

4. 启动/停止 zookeeper  
    ./bin/zkServer.sh start
    ./bin/zkServer.sh stop

#### 创建数据库

1. 创建用户名为 ds_user，密码为 dolphinscheduler 的用户  

```
mysql> CREATE DATABASE dolphinscheduler DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci;
mysql> GRANT ALL PRIVILEGES ON dolphinscheduler.* TO 'ds_user'@'%' IDENTIFIED BY 'dolphinscheduler';
mysql> GRANT ALL PRIVILEGES ON dolphinscheduler.* TO 'ds_user'@'localhost' IDENTIFIED BY 'dolphinscheduler';
mysql> flush privileges;
```

#### 搭建前端

1. 进入 dolphinscheduler-ui 的目录  
    cd dolphinscheduler-ui

2. 执行 npm install  

#### 搭建后端

1. 将项目导入到 idea 中  
    file-->open

2. 修改 dao 模块 resource 目录下 datasource.properties 文件中的数据库配置信息     

```
spring.datasource.driver-class-name=com.mysql.jdbc.Driver
spring.datasource.url=jdbc:mysql://127.0.0.1:3306/dolphinscheduler?useUnicode=true&characterEncoding=UTF-8
spring.datasource.username=ds_user
spring.datasource.password=dolphinscheduler
```

3. 修改根项目中 pom.xml，将 mysql-connector-java 依赖的 scope 修改为 compile  

4. 刷新 dao 模块，运行 org.apache.dolphinscheduler.dao.upgrade.shell.CreateDolphinScheduler 的 main 方法，自动插入项目所需的表和数据  

5. 修改 service 模块 zookeeper.properties 中 quorum 配置 
    zookeeper.quorum=localhost:2181

#### 启动项目

1. 启动 zookeeper   
    ./bin/zkServer.sh start

2. 启动 MasterServer，执行 org.apache.dolphinscheduler.server.master.MasterServer 的 main 方法，需要设置 VM Options:  

```
-Dlogging.config=classpath:logback-master.xml -Ddruid.mysql.usePingMethod=false
```

3. 启动WorkerServer，执行org.apache.dolphinscheduler.server.worker.WorkerServer的 main方法，需要设置 VM Options:  

```
-Dlogging.config=classpath:logback-worker.xml -Ddruid.mysql.usePingMethod=false
```

4. 启动 ApiApplicationServer，执行 org.apache.dolphinscheduler.api.ApiApplicationServer 的 main 方法，需要设置 VM Options:   

```
-Dlogging.config=classpath:logback-api.xml -Dspring.profiles.active=api
```

5. 这里暂时不启动其它模块，如果启动其它模块，那么去查询script/dolphinscheduler-daemon.sh文件，设置相应的 VM Options  

```
if [ "$command" = "api-server" ]; then
  LOG_FILE="-Dlogging.config=classpath:logback-api.xml -Dspring.profiles.active=api"
  CLASS=org.apache.dolphinscheduler.api.ApiApplicationServer
elif [ "$command" = "master-server" ]; then
  LOG_FILE="-Dlogging.config=classpath:logback-master.xml -Ddruid.mysql.usePingMethod=false"
  CLASS=org.apache.dolphinscheduler.server.master.MasterServer
elif [ "$command" = "worker-server" ]; then
  LOG_FILE="-Dlogging.config=classpath:logback-worker.xml -Ddruid.mysql.usePingMethod=false"
  CLASS=org.apache.dolphinscheduler.server.worker.WorkerServer
elif [ "$command" = "alert-server" ]; then
  LOG_FILE="-Dlogback.configurationFile=conf/logback-alert.xml"
  CLASS=org.apache.dolphinscheduler.alert.AlertServer
elif [ "$command" = "logger-server" ]; then
  CLASS=org.apache.dolphinscheduler.server.log.LoggerServer
else
  echo "Error: No command named '$command' was found."
  exit 1
fi
```

6. 启动前端 ui 模块  

```bash
cd dolphinscheduler-ui
npm run start
```

#### 访问项目

1. 访问 http://localhost:8888

2. 登录管理员账号  
    用户: admin  
    密码: dolphinscheduler123
