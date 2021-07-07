### Dolphinscheduler Registry SPI main design

#### How to use？

First you need to execute the `mvn -U install package -Prelease -Dmaven.test.skip=true` installation plugin to generate the plugin JAR of the registry. The directory is: dolphinscheduler-dist/target/dolphinscheduler-dist-1.3.6-SNAPSHOT/lib/plugin/registry

Next, do the following configuration (using zookeeper as an example)

|        Parameter        | Default                                                      | Description                              |
| :---------------------: | ------------------------------------------------------------ | ---------------------------------------- |
|    zookeeper.quorum     | localhost:2181                                               | zk Cluster connection information        |
|   registry.plugin.dir   | /Users/username/workspaces/dolphinscheduler/dolphinscheduler-dist/target/dolphinscheduler-dist-1.3.6-SNAPSHOT/lib/plugin/registry/zookeeper | Registration Center Plugin Directory     |
| registry.plugin.name\|  | zookeeper                                                    | Registration Center specific plugin name |
| registry.plugin.binding | registry                                                     | Dolphinscheduler plugin category         |
|    registry.servers     | 127.0.0.1:2181                                               | ZK connection address                    |

For specific configuration information, please refer to the parameter information that provided by the specific plugin, for example zk: org/apache/dolphinscheduler/plugin/registry/zookeeper/ZookeeperConfiguration.java All configuration information should be prefixed with +registry. For example, base.sleep.time.ms should be configured in the registry like this: registry.base.sleep.time.ms=100.

#### FAQ

1: not found registry plugin

Please check that `mvn -U install package -Prelease -Dmaven.test.skip=true` is executed, and that the directory configured in registry.plugin.dir in the configuration file contains the relevant plugins.

2：registry connect timeout

You can increase the relevant timeout parameters.
