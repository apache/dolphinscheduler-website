
dolphinscheduler-skywalking
=============================

The dolphinscheduler-skywalking module provides [Skywalking](https://skywalking.apache.org/) monitor agent for the Dolphinscheduler project.

This document describes how to enable Skywalking support with this module.

# Installation

The following configuration is used to enable Skywalking agent.

Please make sure the Skywalking oap-server is started.

### Through environment variable configuration (for Docker)

```shell

docker run -d --name dolphinscheduler \
    -e SKYWALKING_ENABLE=true \
    -e SW_AGENT_COLLECTOR_BACKEND_SERVICES="your.skywalking-oap-server.com:11800" \
    ...
    apache/dolphinscheduler:latest all

```

### Through install_config.conf configuration (for Dolphinscheduler install.sh)

Add the following configurations to `${workDir}/conf/config/install_config.conf`.

```properties

# skywalking config
# note: enable skywalking tracking plugin
enableSkywalking="true"
# note: configure skywalking backend service address
skywalkingServers="your.skywalking-oap-server.com:11800"

```

# Usage

### Import dashboard

Import dolphinscheduler dashboard to skywalking website.

![img1](/img/skywalking/import-dashboard-1.jpg)

![img1](/img/skywalking/import-dashboard-2.jpg)

![img1](/img/skywalking/import-dashboard-3.jpg)
