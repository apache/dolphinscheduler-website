### DolphinScheduler Registry SPI 主要设计

#### 如何使用？
首先你需要执行 mvn install 安装插件，生成注册中心的插件 jar。目录是：dolphinscheduler-dist/target/dolphinscheduler-dist-1.3.6-SNAPSHOT/lib/plugin/registry

其次进行以下配置（以 zookeeper 为例）

|参数 |默认值| 描述|
|--|--|--|
registry.plugin.dir|/Users/用户名/workspaces/dolphinscheduler/dolphinscheduler-dist/target/dolphinscheduler-dist-1.3.6-SNAPSHOT/lib/plugin/registry/zookeeper | 注册中心插件目录
registry.plugin.name|zookeeper|注册中心具体插件名称
registry.plugin.binding|registry|DolphinScheduler 插件类别
registry.servers|127.0.0.1:2181|zk 连接地址

具体配置信息请参考具体插件提供的参数信息，例如 zk：org/apache/dolphinscheduler/plugin/registry/zookeeper/ZookeeperConfiguration.java
所有配置信息前缀需要 +registry，如 base.sleep.time.ms，在 registry 中应该这样配置：registry.base.sleep.time.ms=100


#### FAQ
1: not found registry plugin

请检查是否有执行 mvn install，此外，请检查配置文件中的 registry.plugin.dir 中配置的目录是否有相关插件。

2：registry connect timeout

可以增加相关超时参数。
