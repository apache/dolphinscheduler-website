
dolphinscheduler-skywalking
=============================

dolphinscheduler-skywalking 模块为 Dolphinscheduler 项目提供了 [Skywalking](https://skywalking.apache.org/) 监控代理。

本文档介绍了如何通过此模块接入 Skywalking。

# 安装

以下配置用于启用 Skywalking agent。

### 通过配置环境变量 (使用 Docker 部署时)

```shell

docker run -d --name dolphinscheduler \
    -e SKYWALKING_ENABLE=true \
    -e SW_AGENT_COLLECTOR_BACKEND_SERVICES="your.skywalking-oap-server.com:11800" \
    ...
    apache/dolphinscheduler:latest all

```

### 通过配置 install_config.conf (使用 Dolphinscheduler install.sh 部署时)

添加以下配置到 `${workDir}/conf/config/install_config.conf`.

```properties

# skywalking config
# note: enable skywalking tracking plugin
enableSkywalking="true"
# note: configure skywalking backend service address
skywalkingServers="your.skywalking-oap-server.com:11800"

```

# 使用

### 导入图表

#### 导入图表模板到 Skywalking server

导入 `${dolphinscheduler.home}/skywalking-agent/dashboard/dolphinscheduler.yml` 文件到 `${skywalking-oap-server.home}/config/ui-initialized-templates/` 目录下，并重启 Skywalking oap-server.

#### 导入图表到 Skywalking web 站点

![img1](/img/skywalking/import-dashboard-1.jpg)

![img1](/img/skywalking/import-dashboard-2.jpg)

![img1](/img/skywalking/import-dashboard-3.jpg)
