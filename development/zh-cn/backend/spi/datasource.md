## DolphinScheduler Datasource SPI 主要设计

#### 开发环境如何使用？

首先你需要执行 `mvn -U install -Dmaven.test.skip=true` 安装插件，生成注册中心的插件 jar。目录是：dolphinscheduler-dist/target/dolphinscheduler-dist-${VERSION}/lib/plugin/datasource（版本号会跟随主版本号变更）

注意：**${VERSION}** 需要根据当前版本手动修改

执行此命令会生成所有模块默认提供的所有插件。

其次在（dolphinscheduler-common/src/main/resources/common.properties）进行配置插件目录
```
datasource.plugin.dir =./dolphinscheduler-dist/target/dolphinscheduler-dist-${VERSION}/lib/plugin/datasource
```
本地开发调试也可采用以下方式进行配置，例如：
```
maven.local.repository=/Users/localRepository
datasource.plugin.binding=./dolphinscheduler-datasource-plugin/dolphinscheduler-datasource-sqlserver/pom.xml
```
请根据实际情况进行配置。

#### 如何进行数据源插件开发？

### 后端开发：

org.apache.dolphinscheduler.spi.datasource.DataSourceChannel
org.apache.dolphinscheduler.spi.datasource.DataSourceChannelFactory
org.apache.dolphinscheduler.spi.DolphinSchedulerPlugin
org.apache.dolphinscheduler.plugin.datasource.api.client.CommonDataSourceClient

1. 第一步数据源插件实现以上接口和继承通用client即可，具体可以参考sqlserver、mysql等数据源插件实现，所有RDBMS插件的添加方式都是一样的。
2. 在数据源插件pom.xml添加驱动配置，或者打完包之后把驱动包放置对应的数据源插件目录下面

我们在 dolphinscheduler-datasource-api 模块提供了所有数据源对外访问的 API
