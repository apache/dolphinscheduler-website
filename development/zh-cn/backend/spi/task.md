## DolphinScheduler Task SPI 主要设计

#### 开发环境如何使用？

首先你需要执行 `mvn -U install -Dmaven.test.skip=true` 安装插件，生成注册中心的插件 jar。目录是：dolphinscheduler-dist/target/dolphinscheduler-dist-${VERSION}/lib/plugin/task（版本号会跟随主版本号变更）

注意：${VERSION} 需要根据当前版本手动修改

执行此命令会生成所有模块默认提供的所有插件。

其次在（dolphinscheduler-server/src/main/resources/worker.properties）进行配置插件目录
```
task.plugin.dir config the #task.plugin.dir config the Task Plugin dir . WorkerServer while find and load the Task Plugin Jar from this dir when deploy and start WorkerServer on the server .
task.plugin.dir=dolphinscheduler-dist/target/dolphinscheduler-dist-${VERSION}/lib/plugin/task
```
本地开发调试也可采用以下方式进行配置，例如：
```
maven.local.repository=/Users/localRepository
#task.plugin.binding config the task plugin need be load when development and run in IDE
task.plugin.binding=./dolphinscheduler-task-plugin/dolphinscheduler-task-shell/pom.xml
```
请根据实际情况进行配置。

#### 如何进行任务插件开发？

### 后端开发：

org.apache.dolphinscheduler.spi.task.TaskChannel

插件实现以上接口即可。主要包含创建任务（任务初始化，任务运行等方法）、任务取消，如果是 yarn 任务，则需要实现 org.apache.dolphinscheduler.plugin.task.api.AbstractYarnTask。

我们在 dolphinscheduler-task-api 模块提供了所有任务对外访问的 API，而 dolphinscheduler-spi 模块则是 spi 通用代码库，定义了所有的插件模块，比如告警模块，注册中心模块等，你可以详细阅读查看。
