# 单机部署

单机部署仅建议20个以下工作流使用，因为其采用 H2 Database, Zookeeper Testing Server，任务过多可能导致不稳定

## 生产准备

* [JDK 1.8+](https://www.oracle.com/technetwork/java/javase/downloads/index.html)
* [DolphinScheduler](https://dolphinscheduler.apache.org/zh-cn/download/download.html)

## 安装 DolphinScheduler

解压 DolphinScheduler

```shell
# 解压并运行
tar -xvzf apache-dolphinscheduler-*-bin.tar.gz
cd apache-dolphinscheduler-*-bin
sh ./bin/dolphinscheduler-daemon.sh start standalone-server
```

登录 DolphinScheduler

浏览器访问地址：http://localhost:12345/dolphinscheduler
默认密码：admin/dolphinscheduler123

关闭 DolphinScheduler

```shell
# 启动 DolphinScheduler 服务
sh ./bin/dolphinscheduler-daemon.sh start standalone-server
# 停止 DolphinScheduler 服务
sh ./bin/dolphinscheduler-daemon.sh stop standalone-server
```
