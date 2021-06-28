### DolphinScheduler Registry SPI 主要设计

#### 如何使用？
首先你需要执行maven install 安装插件，生成注册中心的插件jar。目录是：dolphinscheduler-dist/target/dolphinscheduler-dist-1.3.6-SNAPSHOT/lib/plugin/registry

其次进行以下配置（以zookeeper为例）

|参数 |默认值| 描述|
|--|--|--|
zookeeper.quorum|localhost:2181| zk集群连接信息
registry.plugin.dir|/Users/kris/workspaces/incubator-dolphinscheduler/dolphinscheduler-dist/target/dolphinscheduler-dist-1.3.6-SNAPSHOT/lib/plugin/registry/zookeeper|注册中心插件目录
registry.plugin.name|zookeeper|注册中心具体插件名称
registry.plugin.binding|registry|DolphinScheduler插件类别
registry.servers|127.0.0.1:2181|zk连接地址

具体配置信息请参考具体插件提供的参数信息，例如zk：org/apache/dolphinscheduler/plugin/registry/zookeeper/ZookeeperConfiguration.java
所有配置信息前缀需要+registry，如base.sleep.time.ms，在registry中应该这样配置：registry.base.sleep.time.ms=100
