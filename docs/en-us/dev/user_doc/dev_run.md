## Development Environment Setup

>    Reference: [DolphinScheduler builds the development environment on Windows local.](/zh-cn/blog/DS_run_in_windows.html)

#### 1. Download the source code

GitHub ：https://github.com/apache/dolphinscheduler

```shell
mkdir dolphinscheduler
cd dolphinscheduler
git clone git@github.com:apache/dolphinscheduler.git
```

We use the dev branch here.

#### 2. The zookeeper installation for Windows

i. Download [zookeeper](https://www.apache.org/dyn/closer.lua/zookeeper/zookeeper-3.6.3/apache-zookeeper-3.6.3-bin.tar.gz)

ii. Unzip apache-zookeeper-3.6.3-bin.tar.gz

iii. Create new zkData, zkLog folders in zk's directory.

iv. Copy the zoo_sample.cfg file from the conf directory. Then rename it to zoo.cfg and change the configuration of the data and logs in it. For example: 

```
dataDir=D:\\code\\apache-zookeeper-3.6.3-bin\\zkData
dataLogDir=D:\\code\\apache-zookeeper-3.6.3-bin\\zkLog
```

v. Run zkServer.cmd in the bin, and then run zkCli.cmd to view the running status of zk. If you can view the zk node information, it means the installation is successful.

#### 3. Set up the back-end

i. Create a new database locally for debugging. DolphinScheduler supports mysql and postgresql, here we use mysql for configuration and the database name could be : dolphinscheduler.

ii. Import the code into IDEA, modify pom.xml in the root project, and change the scope of the mysql-connector-java dependency to compile.

iii. Run `mvn -U install package -Prelease -Dmaven.test.skip=true `in terminal to install the required registered plugins.

iv. Modify the datasource.properties of the dolphinscheduler-dao module: 

```properties
# mysql
spring.datasource.driver-class-name=com.mysql.jdbc.Driver
spring.datasource.url=jdbc:mysql://localhost:3306/dolphinscheduler?useUnicode=true&characterEncoding=UTF-8
spring.datasource.username=root
spring.datasource.password=123456
```

v. Refresh the dao module and run the main method of org.apache.dolphinscheduler.dao.upgrade.shell.CreateDolphinScheduler to automatically insert the tables and data which are required by the project.If you encounter problems such as non-existent database fields, you can try to solve them by running the sql file of the corresponding database under `dolphinscheduler\sql`.

vi. Modify registry.properties for dolphinscheduler-service module and worker.properties for dolphinscheduler-server module respectively, note: `1.3.6-SNAPSHOT` here is based on the actual generated file

```properties
#registry.plugin.dir config the Registry Plugin dir.
registry.plugin.dir=./dolphinscheduler-dist/target/dolphinscheduler-dist-1.3.6-SNAPSHOT/lib/plugin/registry/zookeeper

registry.plugin.name=zookeeper
registry.servers=127.0.0.1:2181
```

```properties
#task.plugin.dir config the #task.plugin.dir config the Task Plugin dir . WorkerServer while find and load the Task Plugin Jar from this dir when deploy and start WorkerServer on the server .
task.plugin.dir=./dolphinscheduler-task-plugin/dolphinscheduler-task-shell/target/dolphinscheduler-task-shell-1.3.6-SNAPSHOT
```

vii. Add the console output to logback-worker.xml, logback-master.xml, and logback-api.xml.

```xml
<root level="INFO">
    <appender-ref ref="STDOUT"/>  <!-- Add the console output -->
    <appender-ref ref="APILOGFILE"/>
    <appender-ref ref="SKYWALKING-LOG"/>
</root>
```

viii. Start the MasterServer

 Run the main method of org.apache.dolphinscheduler.server.master.MasterServer. You need to set the following VM options:

```
-Dlogging.config=classpath:logback-master.xml -Ddruid.mysql.usePingMethod=false
```

ix. Start the WorkerServer 

Run the main method of org.apache.dolphinscheduler.server.worker.WorkerServer. You need to set the following VM options:

```
-Dlogging.config=classpath:logback-worker.xml -Ddruid.mysql.usePingMethod=false
```

x. Start the ApiApplicationServer

Run the main method of org.apache.dolphinscheduler.api.ApiApplicationServer. You need to set the following VM options:

```
-Dlogging.config=classpath:logback-api.xml -Dspring.profiles.active=api
```

xi. LoggerServer is already integrated into the Master and Worker, so there is no need to start them independently

xii. Backend swagger address: http://localhost:12345/dolphinscheduler/doc.html?language=zh_CN&lang=cn

#### 4. Set up the front-end

i. Install node

​	a. Install nvm

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash

​	b. Refresh the environment variables

​	source ~/.bash_profile

​	c. Install node

​	nvm install v12.20.2 

note: Mac users could install npm through brew: brew install npm

d. Validate the node installation

​	node --version

ii. cd  dolphinscheduler-ui and run the following command:

```shell
npm install
npm run start
```

iii. Visit [http://localhost:8888](http://localhost:8888/)

iv. Sign in with the administrator account

>    username: admin
>
>    password: dolphinscheduler123
