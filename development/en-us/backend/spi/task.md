## DolphinScheduler Task SPI main design

#### How to use development environment?

Note: **${VERSION}** needs to be manually modified according to the current version.

First you need to execute the `mvn -U install -Dmaven.test.skip=true` to install the plugin for generating the plugin JAR of the registry. The directory is: dolphinscheduler-dist/target/dolphinscheduler-dist-${VERSION}/lib/plugin/task (The version number will follow the change of the main version number)

Executing this command will generate all plugins provided by default for all modules.

Next, configure the plugin directory in (dolphinscheduler-server/src/main/resources/worker.properties)

```
task.plugin.dir config the #task.plugin.dir config the Task Plugin dir . WorkerServer while find and load the Task Plugin Jar from this dir when deploy and start WorkerServer on the server .
task.plugin.dir=./dolphinscheduler-dist/target/dolphinscheduler-dist-${VERSION}/lib/plugin/task
```

The following configurations can be used for local development debugging, for example:

```
maven.local.repository=/Users/localRepository
#task.plugin.binding config the task plugin need be load when development and run in IDE
task.plugin.binding=./dolphinscheduler-task-plugin/dolphinscheduler-task-shell/pom.xml
```

Please configure according to the actual situation.

#### How to do task plugin development?

### Back-end development:

org.apache.dolphinscheduler.spi.task.TaskChannel

The plugin should implements the above interface.  It mainly contains methods for creating tasks (task initialization, task run, etc.), task cancellation, and if it is a yarn task, it needs to implement org.apache.dolphinscheduler.plugin.task.api.AbstractYarnTask.

We provide the API for all tasks to be accessed externally in the dolphinscheduler-task-api module. And dolphinscheduler-spi module is the spi common code base that defines all the plug-in modules like alert module, registry module etc. You can read it in detail to see it.
