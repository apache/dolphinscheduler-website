## Development Environment Setup

#### Preparation.
1. Start with a copy of the code from the remote repository fork [dolphinscheduler](https://github.com/apache/incubator-dolphinscheduler) to your own repository.
2. Install MySQL/PostgreSQL, JDK, MAVEN in the development environment.
3. Bring your repository clone to your local computer by running:

 ` git clone https://github.com/apache/incubator-dolphinscheduler.git`
 
4. After cloning the project, go to the project directory and execute the following commands. 
```
1. git branch -a    #View the branch.
2. git checkout dev #Switch to the dev branch.
3. git pull #Synchronize with the branch.
4. mvn -U clean package -Prelease -Dmaven.test.skip=true   #Because the project uses gRPC, you need to compile the classes that your project needs to                                                             build first.
```
#### Install node.
1. Install nvm.
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
2. Refresh the environment variable.
source ~/.bash_profile
3. Install node.
nvm install v12.12.0  
Note: mac users can also install npm: brew install npm via brew.
4. Verify that the node installation was successful.
 node --version 

#### Install zookeeper.
1. Download zookeeper.
http://apache.mirrors.hoobly.com/zookeeper/zookeeper-3.6.1/apache-zookeeper-3.6.1-bin.tar.gz
2. Copy the profile.
cp conf/zoo_sample.cfg conf/zoo.cfg
3. Modify the configuration.
vi conf/zoo.cfg  
4. Start/stop zookeeper.
./bin/zkServer.sh start
./bin/zkServer.sh stop

#### Create a database.
1. Create a user name ds_user and password dolphinscheduler.
```
mysql> CREATE DATABASE dolphinscheduler DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci;
mysql> GRANT ALL PRIVILEGES ON dolphinscheduler.* TO 'ds_user'@'%' IDENTIFIED BY 'dolphinscheduler';
mysql> GRANT ALL PRIVILEGES ON dolphinscheduler.* TO 'ds_user'@'localhost' IDENTIFIED BY 'dolphinscheduler';
mysql> flush privileges;

```
#### Build the front end.
1. Go to the directory of dolphinscheduler-ui.
cd dolphinscheduler-ui
2. Perform npm install.

#### Build the back end.
1. Import the project into your favourite IDEA.
file-->open
2. Modify the database configuration information in the 'datasource.properties' file in the datasource directory of the dao module.
 ```
       spring.datasource.driver-class-name=com.mysql.jdbc.Driver
       spring.datasource.url=jdbc:mysql://localhost:3306/dolphinscheduler
       spring.datasource.username=ds_user
       spring.datasource.password=dolphinscheduler  
   ```
3. Modify pom.xml in the root project and modify the copy on which mysql-connector-java depends to compile.

4. Refresh the dao module and run the main method of org.apache.dolphinscheduler.dao.upgrade.shell.CreateDolphinScheduler to automatically insert the tables and data required for the project.

5. Modify the link information in the service module zookeeper.properties (zookeeper.quorum)
zookeeper.quorum=localhost:2181

6. Modify the .env file for the dolphinscheduler-ui module.
```
API_BASE = http://localhost:12345
DEV_HOST = localhost
``` 
#### Start the project.
1. Start zookeeper.
./bin/zkServer.sh start
2. To start MasterServer and perform the main method of org.apache.dolphinscheduler.server.masterServer, you need to set up VM Options:
   ```
       -Dlogging.config=classpath:logback-master.xml -Ddruid.mysql.usePingMethod=false
   ```
   
3. To start WorkerServer and perform the main method of org.apache.dolphinscheduler.server.workerServer, you need to set up VM Options:
   ```
       -Dlogging.config=classpath:logback-worker.xml -Ddruid.mysql.usePingMethod=false
   ```
   
4. To start the ApiApplication Server and perform the main method of the org.apache.dolphinscheduler.api.ApiApplicationServer, you need to set up VM Options:
   ```
       -Dlogging.config=classpath:logback-api.xml -Dspring.profiles.active=api
   ```
   
5. Other modules are not started here for the time being, and if other modules are started, then query the script/dolphinscheduler-daemon.sh file and set the appropriate VM Options.
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
   
6. Start the front-end ui module.
change to the dolphinscheduler-ui directory, perform npm run start.

#### Access the project.
1. Visit http://localhost:8888.
Enter the administrator account admin, password dolphinscheduler123 to log in.
