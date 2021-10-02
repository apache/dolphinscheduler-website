#### 搭建 dev 分支开发环境

1. **下载源码**

     GitHub ：https://github.com/apache/dolphinscheduler

     ```shell
     mkdir dolphinscheduler
     cd dolphinscheduler
     git clone git@github.com:apache/dolphinscheduler.git
     ```

     这里选用 dev 分支。

2. ** 安装 ZooKeeper**

     1.   下载 ZooKeeper https://www.apache.org/dyn/closer.lua/zookeeper/zookeeper-3.6.3/apache-zookeeper-3.6.3-bin.tar.gz

     2.   解压 apache-zookeeper-3.6.3-bin.tar.gz

     3.   在 ZooKeeper 的目录下新建 zkData、zkLog文件夹

     4.   将 conf 目录下的 zoo_sample.cfg 文件，复制一份，重命名为 zoo.cfg，修改其中数据和日志的配置，如：

          ```shell
          dataDir=/data/zookeeper/data ## 此处使用绝对路径
          dataLogDir=/data/zookeeper/datalog
          ```

     5.   在 bin 中运行 zkServer.sh，然后运行 zkCli.sh 查看 ZooKeeper 运行状态，可以查看 ZooKeeper 节点信息即代表安装成功。

3. **搭建后端环境**

     1.   在本地新建一个数据库用于调试，DolphinScheduler 支持 MySQL 和 PostgreSQL，这里使用 MySQL 进行配置，库名可为 ：dolphinscheduler；

     2.   把代码导入 IDEA，修改根项目中 pom.xml，将 mysql-connector-java 依赖的 scope 修改为 compile；

     3.   在 terminal 中执行 `mvn -U clean install package -Prelease -Dmaven.test.skip=true`，安装所需要的注册插件；

     4.   修改 dolphinscheduler-dao 模块的 datasource.properties；

          ```properties
          # mysql
          spring.datasource.driver-class-name=com.mysql.jdbc.Driver
          spring.datasource.url=jdbc:mysql://xxx:3306/dolphinscheduler?useUnicode=true&characterEncoding=UTF-8&allowMultiQueries=true     # 替换您的数据库 ip 地址
          spring.datasource.username=xxx						# 替换您的数据库用户名
          spring.datasource.password=xxx						# 替换您的数据库密码
          ```

     5.   刷入项目所需的表和数据；dev 分支数据库字段变化比较频繁，在数据库里直接运行项目根目录下 `dolphinscheduler\sql` 文件夹下对应数据库的 sql 文件 ，MySQL 下直接运行 `dolphinscheduler_mysql.sql`

     6.   分别修改 dolphinscheduler-service 模块的 registry.properties 和 dolphinscheduler-server 模块的 worker.properties，注意：这里的 `1.3.6-SNAPSHOT` 需要根据实际生成的文件进行填写 

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

     7.   在 logback-worker.xml、logback-master.xml、logback-api.xml 中添加控制台输出；

          ```xml
          <root level="INFO">
              <appender-ref ref="STDOUT"/>  <!-- 添加控制台输出 -->
              <appender-ref ref="APILOGFILE"/>
              <appender-ref ref="SKYWALKING-LOG"/>
          </root>
          ```

     8.   启动 MasterServer，执行 org.apache.dolphinscheduler.server.master.MasterServer 的 main 方法，需要设置 VM Options:

          ```
          -Dlogging.config=classpath:logback-master.xml -Ddruid.mysql.usePingMethod=false
          ```

     9.   启动 WorkerServer，执行org.apache.dolphinscheduler.server.worker.WorkerServer的 main方法，需要设置 VM Options:

          ```
          -Dlogging.config=classpath:logback-worker.xml -Ddruid.mysql.usePingMethod=false
          ```

     10.   启动 ApiApplicationServer，执行 org.apache.dolphinscheduler.api.ApiApplicationServer 的 main 方法，需要设置 VM Options:

           ```
           -Dlogging.config=classpath:logback-api.xml -Dspring.profiles.active=api
           ```

     11.   如果需要用到日志功能，执行 org.apache.dolphinscheduler.server.log.LoggerServer 的 main 方法。

     12.   后端 Open API 文档地址 ：http://localhost:12345/dolphinscheduler/doc.html?language=zh_CN&lang=cn

4.   **搭建前端环境** 

     1.   #### 安装 node

          1.   安装 nvm
               curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash
          2.   刷新环境变量
               source ~/.bash_profile
          3.   安装 node
               nvm install v12.20.2 备注: Mac 用户还可以通过 brew 安装 npm: brew install npm
          4.   验证 node 安装成功
               node --version

     2.   进入 dolphinscheduler-ui，运行

          ```shell
          npm install
          npm run start
          ```

     3.   访问 [http://localhost:8888](http://localhost:8888/)

     4.   登录管理员账号

          >    用户：admin
          >
          >    密码：dolphinscheduler123
