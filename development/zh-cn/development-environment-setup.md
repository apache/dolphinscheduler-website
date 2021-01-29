#### 准备工作
1. 首先从远端仓库fork [dolphinscheduler](https://github.com/apache/incubator-dolphinscheduler) 一份代码到自己的仓库中
2. 在开发环境中安装好MySQL/PostgreSQL、JDK、MAVEN
3. 把自己仓库clone到本地

    ` git clone https://github.com/apache/incubator-dolphinscheduler.git`
    
4. git clone项目后，进入项目目录，执行以下命令。
```
1. git branch -a    #查看分支
2. git checkout dev #切换到dev分支
3. git pull #同步分支
4. mvn -U clean package -Prelease -Dmaven.test.skip=true   #由于项目使用了gRPC，所以需要先编译项目生成需要的类。
```
#### 安装node
1. 安装nvm  
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
2. 刷新环境变量  
 source ~/.bash_profile
3. 安装node  
nvm install v12.12.0  
备注:mac用户还可以通过brew安装npm:brew install npm
4. 验证node安装成功  
 node --version  
 


#### 安装zookeeper  
1. 下载zookeeper  
http://apache.mirrors.hoobly.com/zookeeper/zookeeper-3.6.2/apache-zookeeper-3.6.2-bin.tar.gz
2. 复制配置文件  
cp conf/zoo_sample.cfg conf/zoo.cfg
3. 修改配置  
vi conf/zoo.cfg  
dataDir=./tmp/zookeeper
4. 启动/停止zookeeper  
./bin/zkServer.sh start
./bin/zkServer.sh stop

#### 创建数据库
1. 创建用户名为ds_user,密码为dolphinscheduler的用户  
```
mysql> CREATE DATABASE dolphinscheduler DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci;
mysql> GRANT ALL PRIVILEGES ON dolphinscheduler.* TO 'ds_user'@'%' IDENTIFIED BY 'dolphinscheduler';
mysql> GRANT ALL PRIVILEGES ON dolphinscheduler.* TO 'ds_user'@'localhost' IDENTIFIED BY 'dolphinscheduler';
mysql> flush privileges;

```

#### 搭建前端
1. 进入dolphinscheduler-ui的目录  
cd dolphinscheduler-ui
2. 执行npm install  


#### 搭建后端
1. 将项目导入到idea中  
file-->open
2. 修改dao模块resource目录下datasource.properties文件中的数据库配置信息      
   ```
       spring.datasource.driver-class-name=com.mysql.jdbc.Driver
       spring.datasource.url=jdbc:mysql://localhost:3306/dolphinscheduler
       spring.datasource.username=ds_user
       spring.datasource.password=dolphinscheduler  
   ```
3. 修改根项目中pom.xml，将mysql-connector-java依赖的scope修改为compile  

4. 刷新dao模块，运行org.apache.dolphinscheduler.dao.upgrade.shell.CreateDolphinScheduler的main方法，自动插入项目所需的表和数据  

5. 修改service模块zookeeper.properties中链接信息(zookeeper.quorum)    
 zookeeper.quorum=localhost:2181
 
6. 修改dolphinscheduler-ui模块的.env文件  
```
API_BASE = http://localhost:12345
DEV_HOST = localhost
``` 
#### 启动项目
1. 启动zookeeper   
./bin/zkServer.sh start
2. 启动MasterServer，执行org.apache.dolphinscheduler.server.master.MasterServer的main方法,需要设置VM Options:  
   ```
       -Dlogging.config=classpath:logback-master.xml -Ddruid.mysql.usePingMethod=false
   ```

3. 启动WorkerServer，执行org.apache.dolphinscheduler.server.worker.WorkerServer的main方法,需要设置VM Options:  
   ```
       -Dlogging.config=classpath:logback-worker.xml -Ddruid.mysql.usePingMethod=false
   ```

4. 启动ApiApplicationServer，执行org.apache.dolphinscheduler.api.ApiApplicationServer的main方法,需要设置VM Options:   
   ```
       -Dlogging.config=classpath:logback-api.xml -Dspring.profiles.active=api
   ```
   
5. ,这里暂时不启动其它模块，如果启动其它模块，那么去查询script/dolphinscheduler-daemon.sh文件,设置相应的VM Options  
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
         echo "Error: No command named \`$command' was found."
         exit 1
       fi
   ```
6. 启动前端ui模块  
cd dolphinscheduler-ui目录，执行npm run start

#### 访问项目
1. 访问http://localhost:12345/dolphinscheduler  
输入管理员账户admin,密码dolphinscheduler123进行登陆
