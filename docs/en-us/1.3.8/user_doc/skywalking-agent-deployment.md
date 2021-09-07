SkyWalking Agent Deployment
=============================

The dolphinscheduler-skywalking module provides [Skywalking](https://skywalking.apache.org/) monitor agent for the Dolphinscheduler project.

This document describes how to enable Skywalking 8.4+ support with this module (recommended to use SkyWalking 8.5.0).

# Installation

The following configuration is used to enable Skywalking agent.

### Through environment variable configuration (for Docker Compose)

Modify SKYWALKING environment variables in `docker/docker-swarm/config.env.sh`:

```
SKYWALKING_ENABLE=true
SW_AGENT_COLLECTOR_BACKEND_SERVICES=127.0.0.1:11800
SW_GRPC_LOG_SERVER_HOST=127.0.0.1
SW_GRPC_LOG_SERVER_PORT=11800
```

And run

```shell
$ docker-compose up -d
```

### Through environment variable configuration (for Docker)

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
apache/dolphinscheduler:1.3.8 all
```

### Through install_config.conf configuration (for DolphinScheduler install.sh)

Add the following configurations to `${workDir}/conf/config/install_config.conf`.

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

# Usage

### Import dashboard

#### Import dolphinscheduler dashboard to skywalking sever

Copy the `${dolphinscheduler.home}/ext/skywalking-agent/dashboard/dolphinscheduler.yml` file into `${skywalking-oap-server.home}/config/ui-initialized-templates/` directory, and restart Skywalking oap-server.

#### View dolphinscheduler dashboard

If you have opened Skywalking dashboard with a browser before, you need to clear browser cache.

![img1](/img/skywalking/import-dashboard-1.jpg)
