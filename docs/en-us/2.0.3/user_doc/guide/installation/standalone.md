# Standalone

Standalone only for quick look for DolphinScheduler.

If you are a green hand and want to experience DolphinScheduler, we recommended you install follow [Standalone](standalone.md). If you want to experience more complete functions or schedule large tasks number, we recommended you install follow [pseudo-cluster deployment](pseudo-cluster.md). If you want to using DolphinScheduler in production, we recommended you follow [cluster deployment](cluster.md) or [kubernetes](kubernetes.md)

> **_Note:_** Standalone only recommends the use of less than 20 workflows, because it uses H2 Database, Zookeeper Testing Server, too many tasks may cause instability

## Prepare

* JDK：Download [JDK][jdk] (1.8+), and configure `JAVA_HOME` to and `PATH` variable. You can skip this step, if it already exists in your environment.
* Binary package: Download the DolphinScheduler binary package at [download page](https://dolphinscheduler.apache.org/en-us/download/download.html)

## Start DolphinScheduler Standalone Server

### Extract and Start DolphinScheduler

There is a standalone startup script in the binary compressed package, which can be quickly started after extract. Switch to a user with sudo permission and run the script

```shell
# Extract and start Standalone Server
tar -xvzf apache-dolphinscheduler-*-bin.tar.gz
cd apache-dolphinscheduler-*-bin
sh ./bin/dolphinscheduler-daemon.sh start standalone-server
```

### Login DolphinScheduler

The browser access address http://localhost:12345/dolphinscheduler can login DolphinScheduler UI. The default username and password are **admin/dolphinscheduler123**

### Start/Stop Server

The script `./bin/dolphinscheduler-daemon.sh` can not only quickly start standalone, but also stop the service operation. All the commands are as follows

```shell
# Start Standalone Server
sh ./bin/dolphinscheduler-daemon.sh start standalone-server
# Stop Standalone Server
sh ./bin/dolphinscheduler-daemon.sh stop standalone-server
```

[jdk]: https://www.oracle.com/technetwork/java/javase/downloads/index.html
