# 集群部署

集群部署是在多台机器部署 DolphinScheduler 服务，用于复杂大量任务场景。

## 部署步骤

集群部署(Cluster)使用的脚本和配置文件可参考：[伪集群部署](pseudo-cluster.md)配置。
区别就是[伪集群部署](pseudo-cluster.md)针对的是一台机器，而集群部署(Cluster)需要针对多台机器。

### 生产准备 && 安装 DolphinScheduler

可参考：[伪集群部署](pseudo-cluster.md)“，集群部署区别需要在每台机器中进行配置

### 修改相关配置

部署脚本通过 `scp` 将需要资源传输各个机器上，我们仅需要修改运行`install.sh`脚本所在机器配置即可。
配置文件路径在`conf/config/install_config.conf`
修改**INSTALL MACHINE,DolphinScheduler ENV,Database,Registry Server**

```shell
#----------------------------------------------------------
#修改参数说明
# ---------------------------------------------------------
# INSTALL MACHINE
# ---------------------------------------------------------
# 需要配置master、worker、API server，所在服务器的IP均为机器IP或者localhost
# 如果是配置hostname的话，需要保证机器间可以通过hostname相互链接
# 如下图所示，部署 DolphinScheduler 机器的 hostname 为 ds1,ds2,ds3,ds4,ds5，其中 ds1,ds2 安装 master 服务，ds3,ds4,ds5安装 worker 服务，alert server安装在ds4中，api server 安装在ds5中
ips="ds1,ds2,ds3,ds4,ds5"
masters="ds1,ds2"
workers="ds3:default,ds4:default,ds5:default"
alertServer="ds4"
apiServers="ds5"
pythonGatewayServers="ds5"
```

## 启动 DolphinScheduler

[参考伪集群部署](pseudo-cluster.md)
