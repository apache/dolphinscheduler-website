#### Preparation

1. First, fork the [dolphinscheduler](https://github.com/apache/incubator-dolphinscheduler) code from the remote repository to your local repository.

2. Install MySQL/PostgreSQL, JDK and MAVEN in your own software development environment.

3. Clone your forked repository to the local file system.
```
    git clone https://github.com/apache/incubator-dolphinscheduler.git`
```
4. After finished the clone, go into the project directory and execute the following commands:
```
    git branch -a  #check the branch
    git checkout dev #switch to the dev branch
    git pull #sychronize the branch with the remote branch
    mvn -U clean package -Prelease -Dmaven.test.skip=true  #because the project uses gRPC, you need to compile the project to generate the required classes
```
#### Install node

1. Install nvm  
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh 

2. Refresh the environment variables  
source ~/.bash_profile

3. Install node  
nvm install v12.12.0  
note:mac users could install npm through brew:brew install npm

4. Validate the node installation  
node --version

#### Install zookeeper

1. Download zookeeper  
http://apache.mirrors.hoobly.com/zookeeper/zookeeper-3.6.2/apache-zookeeper-3.6.2-bin.tar.gz

2. Copy the zookeeper config file  
cp conf/zoo_sample.cfg conf/zoo.cfg

3. Modify zookepper cofig  
vi conf/zoo.cfg  
dataDir=./tmp/zookeeper

4. Start/stop zookeeper  
./bin/zkServer.sh start  
./bin/zkServer.sh stop

#### Create database

Create user, user name: ds_user, password: dolphinscheduler
```
    mysql> CREATE DATABASE dolphinscheduler DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci;
    mysql> GRANT ALL PRIVILEGES ON dolphinscheduler.* TO 'ds_user'@'%' IDENTIFIED BY 'dolphinscheduler';
    mysql> GRANT ALL PRIVILEGES ON dolphinscheduler.* TO 'ds_user'@'localhost' IDENTIFIED BY 'dolphinscheduler';
    mysql> flush privileges;
```

#### Set up the front-end

1. Enter the dolphinscheduler-ui directory  
cd dolphinscheduler-ui

2. Run npm install

#### Set up the back-end

1. Import the project to IDEA  
file-->open

2. Modify the database configuration in the datasource.properties file in the resource directory of the dao module
```
    spring.datasource.driver-class-name=com.mysql.jdbc.Driver
    spring.datasource.url=jdbc:mysql://localhost:3306/dolphinscheduler
    spring.datasource.username=ds_user
    spring.datasource.password=dolphinscheduler  
```

3. Modify pom.xml in the root directory and modify the scope of mysql-connector-java to complie

4. Refresh the dao module, run the main method of org.apache.dolphinscheduler.dao.upgrade.shell.CreateDolphinScheduler to automatically insert the tables and data required by the project.

5. Modify the service module  
try to change the zookeeper.quorum part of the zookeeper.properties file
zookeeper.quorum=localhost:2181

6. Modify the .env file of the dolphinscheduler-ui module
```
    API_BASE = http://localhost:12345
    DEV_HOST = localhost
```

#### Start the project

1. Start zookeeper  
./bin/zkServer.sh start

2. Start MasterServer  
run the main method of org.apache.dolphinscheduler.server.master.MasterServer, you need to set the following VM options:
```
    -Dlogging.config=classpath:logback-master.xml -Ddruid.mysql.usePingMethod=false
```
3. Start WorkerServer  
run the main method of org.apache.dolphinscheduler.server.worker.WorkerServer, you need to set the following VM options:
```
    -Dlogging.config=classpath:logback-worker.xml -Ddruid.mysql.usePingMethod=false
```
4. Start ApiApplicationServer  
run the main method of org.apache.dolphinscheduler.api.ApiApplicationServer, you need to set the following VM options:
```
    -Dlogging.config=classpath:logback-api.xml -Dspring.profiles.active=api
```
5. We are not going to start the other modules. if they are required to be started, check script/dolphinscheduler-daemon.sh and set them the same VM Options.
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

6. cd dolphinscheduler-ui directory and run npm run start

#### Visit the project
1. Visit http://localhost:12345/dolphinscheduler

2. Sign in with the administrator account
username: admin  
password: dolphinscheduler123