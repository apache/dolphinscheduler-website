## DolphinScheduler Datasource SPI main design

#### How to use development environment?

Note: **${VERSION}** needs to be manually modified according to the current version.

First you need to execute the `mvn -U install -Dmaven.test.skip=true` to install the plugin for generating the plugin JAR of the registry. The directory is: dolphinscheduler-dist/target/dolphinscheduler-dist-${VERSION}/lib/plugin/task (The version number will follow the change of the main version number)

Executing this command will generate all plugins provided by default for all modules.

Next, configure the plugin directory in (dolphinscheduler-server/src/main/resources/worker.properties)

```
datasource.plugin.dir =./dolphinscheduler-dist/target/dolphinscheduler-dist-${VERSION}/lib/plugin/datasource
```

The following configurations can be used for local development debugging, for example:

```
maven.local.repository=/Users/localRepository
datasource.plugin.binding=./dolphinscheduler-datasource-plugin/dolphinscheduler-datasource-sqlserver/pom.xml
```

Please configure according to the actual situation.

#### How to do Datasource plugin development?

### Back-end development:

org.apache.dolphinscheduler.spi.datasource.DataSourceChannel
org.apache.dolphinscheduler.spi.datasource.DataSourceChannelFactory
org.apache.dolphinscheduler.spi.DolphinSchedulerPlugin
org.apache.dolphinscheduler.plugin.datasource.api.client.CommonDataSourceClient

1. In the first step, the data source plug-in can implement the above interfaces and inherit the general client. For details, refer to the implementation of data source plug-ins such as sqlserver and mysql. The addition methods of all RDBMS plug-ins are the same.

2. Add the driver configuration in the data source plug-in pom.xml, or place the driver package under the corresponding data source plug-in directory after typing the package
We provide the API for all tasks to be accessed externally in the dolphinscheduler-task-api module. And dolphinscheduler-spi module is the spi common code base that defines all the plug-in modules like alert module, registry module etc. You can read it in detail to see it.

We provide APIs for external access of all data sources in the dolphin scheduler data source API module