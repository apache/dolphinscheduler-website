# DolphinScheduler 开发手册

## 前置条件

在搭建 DolphinScheduler 开发环境之前请确保你已经安装一下软件

* [Git](https://git-scm.com/downloads): 版本控制系统
* [JDK](https://www.oracle.com/technetwork/java/javase/downloads/index.html): 后端开发
* [Maven](http://maven.apache.org/download.cgi): Java包管理系统
* [Node](https://nodejs.org/en/download): 前端开发

### 克隆代码库

通过你 git 管理工具下载 git 代码，下面以 git-core 为例

```shell
mkdir dolphinscheduler
cd dolphinscheduler
git clone git@github.com:apache/dolphinscheduler.git
```

## 开发者须知

DolphinScheduler 开发环境配置有两个方式，分别是standalone模式，以及普通模式

* [standalone模式](#dolphinscheduler-standalone快速开发模式)：**推荐使用，但仅支持 1.3.9 及以后的版本**，方便快速的开发环境搭建，能解决大部分场景的开发。
* [普通模式](#dolphinscheduler-普通开发模式)：master、worker、api、logger等单独启动，能更好的的模拟真实生产环境，可以覆盖的测试环境更多。

## DolphinScheduler Standalone快速开发模式

> **_注意：_** 仅供单机开发调试使用，默认使用 H2 Database,Zookeeper Testing Server。
> 如需测试插件，可自行修改 StandaloneServer中`plugin.bind`，亦或修改配置文件。具体请查看插件说明。
> Standalone 仅在 DolphinScheduler 1.3.9 及以后的版本支持

### 分支选择

开发不同的代码需要基于不同的分支

* 如果想基于二进制包开发，切换到对应版本的代码，如 1.3.9 则是 `1.3.9-release`
* 如果想要开发最新代码，切换到 `dev` 分支

### 启动后端

编译后端相关依赖

```shell
mvn install -DskipTests
```

在 Intellij IDEA 找到并启动类 `org.apache.dolphinscheduler.server.StandaloneServer` 即可完成后端启动

### 启动前端

安装前端依赖并运行前端组件

```shell
cd dolphinscheduler-ui
npm install
npm run start
```

截止目前，前后端以成功运行起来，浏览器访问[http://localhost:8888](http://localhost:8888)，并使用默认账户密码 **admin/dolphinscheduler123** 即可完成登录

## DolphinScheduler 普通开发模式

### 必要软件安装

#### zookeeper

下载 [ZooKeeper](https://www.apache.org/dyn/closer.lua/zookeeper/zookeeper-3.6.3)，解压

* 在 ZooKeeper 的目录下新建 zkData、zkLog文件夹
* 将 conf 目录下的 `zoo_sample.cfg` 文件，复制一份，重命名为 `zoo.cfg`，修改其中数据和日志的配置，如：

    ```shell
    dataDir=/data/zookeeper/data ## 此处使用绝对路径
    dataLogDir=/data/zookeeper/datalog
    ```

* 运行 `./bin/zkServer.sh`。

#### 数据库

DolphinScheduler 的元数据存储在关系型数据库中，目前支持的关系型数据库包括 MySQL 以及 Postgresql。下面以MySQL为例，启动数据库并创建新database作为 DolphinScheduler 元数据库，这里以数据库名 dolphinscheduler 为例。

创建完新数据库后，将 `dolphinscheduler/sql/dolphinscheduler_mysql.sql` 下的 sql 文件直接在mysql中运行，完成数据库初始化。

#### 启动后端

下面步骤将引导如何启动 DolphinScheduler 后端服务。

##### 必要的准备工作

* 打开项目：使用开发工具打开项目，这里以 Intellij IDEA 为例，打开后需要一段时间，让 Intellij IDEA 完成以依赖的下载。
  
* 插件的配置（**仅 2.0 及以后的版本需要**）：编译对应的插件，在项目目录执行 `mvn -U clean install -Dmaven.test.skip=true` 完成注册插件的安装

  注意：${VERSION} 需要根据当前版本手动修改

  alert.properties
  * 告警插件配置
  ```alert.properties
   alert.plugin.dir=../../../../dolphinscheduler-dist/target/dolphinscheduler-dist-${VERSION}/lib/plugin/alert	
  ```
  registry.properties
  * 注册中心插件配置
  ```registry.properties
   alert.plugin.dir=../../../../dolphinscheduler-dist/target/dolphinscheduler-dist-${VERSION}/lib/plugin/registry/zookeeper	
  ```
  worker.properties
  * 任务插件配置
  ```worker.properties
     task.plugin.dir=../../../../dolphinscheduler-dist/target/dolphinscheduler-dist-${VERSION}/lib/plugin/task	
  ```
* 必要的修改
  * 如果使用 mysql 作为元数据库，需要先修改 `dolphinscheduler/pom.xml`，将 `mysql-connector-java` 依赖从 `scope` 改为 `compile`，使用 postgresql 则不需要。
  * 修改数据库配置，修改 `dolphinscheduler/dolphinscheduler-dao/datasource.properties` 文件中的数据库配置

  ```properties
  # 本样例以 MySQL 为例，其中数据库名为 dolphinscheduler，账户名密码均为 dolphinscheduler
  spring.datasource.driver-class-name=com.mysql.jdbc.Driver
  spring.datasource.url=jdbc:mysql://localhost:3306/dolphinscheduler?useUnicode=true&characterEncoding=UTF-8&allowMultiQueries=true
  spring.datasource.username=dolphinscheduler
  spring.datasource.password=dolphinscheduler
  ```

* 修改日志级别：修改一下文件，增加一行内容 `<appender-ref ref="STDOUT"/>` 使日志能在命令行中显示 `dolphinscheduler-server/src/main/resources/logback-worker.xml`，`dolphinscheduler-server/src/main/resources/logback-master.xml`，`dolphinscheduler-api/src/main/resources/logback-api.xml` 修改后的结果如下

  ```diff
  <root level="INFO">
  +  <appender-ref ref="STDOUT"/>
    <appender-ref ref="APILOGFILE"/>
    <appender-ref ref="SKYWALKING-LOG"/>
  </root>
  ```

> **_注意：_**：上述准备工作中，插件的安装仅 DolphinScheduler 2.0 及以后的版本需要运行，2.0 之前的版本不需要运行该命令

##### 启动服务

我们需要启动三个必须服务，包括 MasterServer，WorkerServer，ApiApplicationServer，如果有需求可以启动可选服务 LoggerServer

* MasterServer：在 Intellij IDEA 中执行 `org.apache.dolphinscheduler.server.master.MasterServer` 中的 `main` 方法，并配置 *VM Options* `-Dlogging.config=classpath:logback-master.xml -Ddruid.mysql.usePingMethod=false`
* WorkerServer：在 Intellij IDEA 中执行 `org.apache.dolphinscheduler.server.worker.WorkerServer` 中的 `main` 方法，并配置 *VM Options* `-Dlogging.config=classpath:logback-worker.xml -Ddruid.mysql.usePingMethod=false`
* ApiApplicationServer：在 Intellij IDEA 中执行 `org.apache.dolphinscheduler.api.ApiApplicationServer` 中的 `main` 方法，并配置 *VM Options* `-Dlogging.config=classpath:logback-api.xml -Dspring.profiles.active=api`。启动完成可以浏览 Open API 文档，地址为 http://localhost:12345/dolphinscheduler/doc.html
* LoggerServer：**这是非必须功能，可以不开启**，在 Intellij IDEA 中执行 `org.apache.dolphinscheduler.server.log.LoggerServer` 中的 `main` 方法

### 启动前端

安装前端依赖并运行前端组件

```shell
cd dolphinscheduler-ui
npm install
npm run start
```

截止目前，前后端以成功运行起来，浏览器访问[http://localhost:8888](http://localhost:8888)，并使用默认账户密码 **admin/dolphinscheduler123** 即可完成登录
