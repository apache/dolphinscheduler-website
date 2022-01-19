# Set-up DolphinScheduler Development Environment and Run Source Code on Windows OS

1. ## Download Source Code

   Official Website: https://dolphinscheduler.apache.org/en-us/index.html

   GitHub Repository: https://github.com/apache/dolphinscheduler.git

   Here we use 1.3.6-release tag.

2. ## Install Zookeeper on Windows

   1. Download zookeeper https://www.apache.org/dyn/closer.lua/zookeeper/zookeeper-3.6.3/apache-zookeeper-3.6.3-bin.tar.gz.

   2. Unzip 'apache-zookeeper-3.6.3-bin.tar.gz'.

   3. Create 'data' and 'log' folder under zookeeper directory.

   4. Copy the 'zoo_sample.cfg' file in the 'conf' directory, rename it to 'zoo.cfg' and modify the data and log directory settings:

      ~~~properties
      dataDir=I:\\setup\\apache-zookeeper-3.6.3-bin\\data
      dataLogDir=I:\\setup\\apache-zookeeper-3.6.3-bin\\log
      ~~~

   5. Run the 'zkServer.cmd' in the bin directory, then run 'zkCli.cmd' to check the running status. Check zookeeper node information under root directory which shows success installation.

3. ## Set-up Backend Environment

   1. Create MYSQL database for debugging, named as 'dolphinschedulerKou'.

   2. Import Maven project to IDEA, find 'pom.xml' under the root directory and modify the scope of 'mysql-connector-java' to compile.

   3. Modify the 'datasource.properties' of module 'dolphinscheduler-dao'.

      ~~~properties
      # mysql
      spring.datasource.driver-class-name=com.mysql.jdbc.Driver
      spring.datasource.url=jdbc:mysql://localhost:3306/dolphinschedulerTest?useUnicode=true&characterEncoding=UTF-8
      spring.datasource.username=root
      spring.datasource.password=rootroot
      ~~~

   4. Refresh dao module and run the main method of 'org.apache.dolphinscheduler.dao.upgrade.shell.CreateDolphinScheduler', the method will create project needed tables and data automatically.

   5. Modify the 'zookeeper.properties' of module 'dolphinscheduler-service'.

      ~~~properties
      zookeeper.quorum=localhost:2181
      ~~~

   6. Add standard output in the 'logback-worker.xml', 'logback-master.xml' and 'logback-api.xml'.

      ~~~xml
      <root level="INFO">
          <appender-ref ref="STDOUT"/>  <!-- Add Standard Output -->
          <appender-ref ref="APILOGFILE"/>
          <appender-ref ref="SKYWALKING-LOG"/>
      </root>
      ~~~


7. Start the MasterServer by execute the main method of 'org.apache.dolphinscheduler.server.master.MasterServer' and VM Options need to be set are:

   ~~~
   -Dlogging.config=classpath:logback-master.xml -Ddruid.mysql.usePingMethod=false
   ~~~

8. Start the WorkerServer by execute the main method of 'org.apache.dolphinscheduler.server.worker.WorkerServer' and VM Options need to be set are:

   ~~~
   -Dlogging.config=classpath:logback-worker.xml -Ddruid.mysql.usePingMethod=false
   ~~~

9. Start the ApiApplicationServer by execute the main method of 'org.apache.dolphinscheduler.api.ApiApplicationServer' and VM Options need to be set are:

   ~~~
   -Dlogging.config=classpath:logback-api.xml -Dspring.profiles.active=api
   ~~~

10. If you need to use the log function, execute the main method of 'org.apache.dolphinscheduler.server.log.LoggerServer'.

11. Backend swagger url: http://localhost:12345/dolphinscheduler/doc.html?language=en_us&lang=en.

4. ## Set-up Frontend Environment

   1. Install node (no more details).

   2. Enter the folder 'dolphinscheduler-ui' and run.

      ~~~shell
      npm install
      npm run start
      ~~~

   3. Visit [http://localhost:8888](http://localhost:8888/).

   4. Sign in with admin account.

      > Username: admin
      >
      > Password: dolphinscheduler123
