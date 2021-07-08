### DolphinScheduler Registry SPI main design

#### How to use it？

First you need to execute the `mvn -U install package -Prelease -Dmaven.test.skip=true` to install the plugin for generating the plugin JAR of the registry. The directory is: dolphinscheduler-dist/target/dolphinscheduler-dist-1.3.6-SNAPSHOT/lib/plugin/registry.

Next, do the following configuration (using zookeeper as an example)

|        Parameter        | Default                                                      | Description                              |
| :---------------------: | ------------------------------------------------------------ | ---------------------------------------- |
|   registry.plugin.dir   | /Users/username/workspaces/dolphinscheduler/dolphinscheduler-dist/target/dolphinscheduler-dist-1.3.6-SNAPSHOT/lib/plugin/registry/zookeeper | Registration Center Plugin Directory     |
| registry.plugin.name\|  | zookeeper                                                    | Registration Center specific plugin name |
| registry.plugin.binding | registry                                                     | Dolphinscheduler plugin category         |
|    registry.servers     | 127.0.0.1:2181                                               | ZK connection address                    |

For the specific configuration information, please refer to the parameter information that provided by the specific plugin. Taking zk as an example, all the parameters of this configuration information about zk are in the class org/apache/dolphinscheduler/plugin/registry/zookeeper/ZookeeperConfiguration.java. If a parameter is needed to be changed to a specific value instead of the default, it can be configured directly in the registry. However, the prefix should be added to indicate this is a parameter of the registry. For example, "base.sleep.time.ms" should be configured in the registry as: "registry.base.sleep.time.ms=100".

#### FAQ

1: not found registry plugin

Please check if `mvn -U install package -Prelease -Dmaven.test.skip=true` is executed. Besides, please check if the directory is configured in registry.plugin.dir in the configuration file contains the relevant plugins.

2：registry connect timeout

You can add the relevant timeout parameters.
