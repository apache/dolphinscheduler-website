SkyWalking Agent
==================

dolphinscheduler-skywalking 模块为 Dolphinscheduler 提供了 [Skywalking](https://skywalking.apache.org/) 监控代理。

# 安装 Skywalking agent

### 配置环境变量 ( Docker Compose 部署)

修改 `docker/docker-swarm/config.env.sh` 中 SKYWALKING 环境变量:

```
SKYWALKING_ENABLE=true
SW_AGENT_COLLECTOR_BACKEND_SERVICES=127.0.0.1:11800
SW_GRPC_LOG_SERVER_HOST=127.0.0.1
SW_GRPC_LOG_SERVER_PORT=11800
```

运行

```shell
$ docker-compose up -d
```

### 配置环境变量 ( Docker 部署)

```shell
$ docker run -d --name dolphinscheduler \
-e DATABASE_HOST="192.168.x.x" -e DATABASE_PORT="5432" -e DATABASE_DATABASE="dolphinscheduler" \
-e DATABASE_USERNAME="test" -e DATABASE_PASSWORD="test" \
-e ZOOKEEPER_QUORUM="192.168.x.x:2181" \
-e SKYWALKING_ENABLE="true" \
-e SW_AGENT_COLLECTOR_BACKEND_SERVICES="your.skywalking-oap-server.com:11800" \
-e SW_GRPC_LOG_SERVER_HOST="your.skywalking-log-reporter.com" \
-e SW_GRPC_LOG_SERVER_PORT="11800" \
-p 12345:12345 \
apache/dolphinscheduler:2.0.2 all
```

### 配置 install_config.conf ( DolphinScheduler install.sh 部署)

添加以下配置至 `${workDir}/conf/config/install_config.conf`.

```properties

# skywalking config
# note: enable skywalking tracking plugin
enableSkywalking="true"
# note: configure skywalking backend service address
skywalkingServers="your.skywalking-oap-server.com:11800"
# note: configure skywalking log reporter host
skywalkingLogReporterHost="your.skywalking-log-reporter.com"
# note: configure skywalking log reporter port
skywalkingLogReporterPort="11800"

```

# 使用Skywalking agent

#### 导入图表到 Skywalking server

```shell

copy `${dolphinscheduler.home}/ext/skywalking-agent/dashboard/dolphinscheduler.yml`
to `${skywalking-oap-server.home}/config/ui-initialized-templates/`
Skywalking oap-server。
```
#### 查看 dolphinscheduler 图表

如果已经在浏览器打开过 Skywalking，则需要清空浏览器缓存。

![img1](/img/skywalking/import-dashboard-1.jpg)
