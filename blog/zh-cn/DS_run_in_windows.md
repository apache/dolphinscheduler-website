# DolphinScheduler 在 Windows 本地搭建开发环境，源码启动

如果您对本地开发的视频教程感兴趣的话，也可以跟着视频来一步一步操作:
[![ DolphinScheduler 本地开发搭建 ](/img/build_dev_video.png)](https://www.bilibili.com/video/BV1hf4y1b7sX)

1. ## 下载源码

   官网 ：https://dolphinscheduler.apache.org/zh-cn/index.html

   地址 ：https://github.com/apache/dolphinscheduler.git

   这里选用 1.3.6-release 分支。

2. ## windows安装zk

   1. 下载zk  https://www.apache.org/dyn/closer.lua/zookeeper/zookeeper-3.6.3/apache-zookeeper-3.6.3-bin.tar.gz

   2. 解压apache-zookeeper-3.6.3-bin.tar.gz 

   3. 在zk的目录下新建data、log文件夹

   4. 将conf目录下的zoo_sample.cfg文件，复制一份，重命名为zoo.cfg，修改其中数据和日志的配置，如：

      ~~~properties
      dataDir=D:\\code\\apache-zookeeper-3.6.3-bin\\data
      dataLogDir=D:\\code\\apache-zookeeper-3.6.3-bin\\log
      ~~~

   5. 在bin中运行 zkServer.cmd，然后运行zkCli.cmd 查看zk运行状态，可以查看zk节点信息即代表安装成功。

3. ## 搭建后端环境

   1. 新建一个自我调试的mysql库，库名可为 ：dolphinschedulerKou

   2. 把代码导入idea，修改根项目中 pom.xml，将 mysql-connector-java 依赖的 scope 修改为 compile

   3. 修改 dolphinscheduler-dao 模块的 datasource.properties

      ~~~properties
      # mysql
      spring.datasource.driver-class-name=com.mysql.jdbc.Driver
      spring.datasource.url=jdbc:mysql://192.168.2.227:3306/dolphinschedulerKou?useUnicode=true&characterEncoding=UTF-8
      spring.datasource.username=root
      spring.datasource.password=Dm!23456
      ~~~

   4. 刷新 dao 模块，运行 org.apache.dolphinscheduler.dao.upgrade.shell.CreateDolphinScheduler 的 main 方法，自动插入项目所需的表和数据

   5. 修改 dolphinscheduler-service 模块的 zookeeper.properties

      ~~~properties
      zookeeper.quorum=localhost:2181
      ~~~

   6. 在logback-worker.xml、logback-master.xml、logback-api.xml中添加控制台输出

      ~~~xml
      <root level="INFO">
          <appender-ref ref="STDOUT"/>  <!-- 添加控制台输出 -->
          <appender-ref ref="APILOGFILE"/>
          <appender-ref ref="SKYWALKING-LOG"/>
      </root>
      ~~~

      

   7. 启动 MasterServer，执行 org.apache.dolphinscheduler.server.master.MasterServer 的 main 方法，需要设置 VM Options:

      ~~~
      -Dlogging.config=classpath:logback-master.xml -Ddruid.mysql.usePingMethod=false
      ~~~

   8. 启动WorkerServer，执行org.apache.dolphinscheduler.server.worker.WorkerServer的 main方法，需要设置 VM Options:

      ~~~
      -Dlogging.config=classpath:logback-worker.xml -Ddruid.mysql.usePingMethod=false
      ~~~

   9. 启动 ApiApplicationServer，执行 org.apache.dolphinscheduler.api.ApiApplicationServer 的 main 方法，需要设置 VM Options:

      ~~~
      -Dlogging.config=classpath:logback-api.xml -Dspring.profiles.active=api
      ~~~

   10. 如果需要用到日志功能，执行 org.apache.dolphinscheduler.server.log.LoggerServer 的main 方法。

   11. 后端swagger地址 ：http://localhost:12345/dolphinscheduler/doc.html?language=zh_CN&lang=cn

4. ## 搭建前端环境

   1. 本机安装node（不再赘述）

   2. 进入 dolphinscheduler-ui，运行

      ~~~shell
      npm install
      npm run start
      ~~~

   3. 访问 [http://localhost:8888](http://localhost:8888/)

   4. 登录管理员账号

      > 用户：admin    
      >
      > 密码：dolphinscheduler123

