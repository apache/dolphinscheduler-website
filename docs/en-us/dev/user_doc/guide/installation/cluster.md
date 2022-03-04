# Cluster Deployment

Cluster deployment is to deploy the DolphinScheduler on multiple machines for running a large number of tasks in production.

If you are a green hand and want to experience DolphinScheduler, we recommended you install follow [Standalone](standalone.md). If you want to experience more complete functions or schedule large tasks number, we recommended you install follow [pseudo-cluster deployment](pseudo-cluster.md). If you want to using DolphinScheduler in production, we recommended you follow [cluster deployment](cluster.md) or [kubernetes](kubernetes.md)

## Deployment Step

Cluster deployment uses the same scripts and configuration files as we deploy in [pseudo-cluster deployment](pseudo-cluster.md), so the prepare and required are the same as pseudo-cluster deployment. The difference is that [pseudo-cluster deployment](pseudo-cluster.md) is for one machine, while cluster deployment (Cluster) for multiple. and the steps of "Modify configuration" are quite different between pseudo-cluster deployment and cluster deployment.

### Prepare and DolphinScheduler Startup Environment

Because of cluster deployment for multiple machine, so you have to run you "Prepare" and "startup" in every machine in [pseudo-cluster.md](pseudo-cluster.md), except section "Configure machine SSH password-free login", "Start ZooKeeper", "Initialize the database", which is only for deployment or just need an single server

### Modify Configuration

This is a step that is quite different from [pseudo-cluster.md](pseudo-cluster.md), because the deployment script will transfer the resources required for installation machine to each deployment machine using `scp`. And we have to declare all machine we want to install DolphinScheduler and then run script `install.sh`. The configuration file is under the path `conf/config/install_config.conf`, here we only need to modify section **INSTALL MACHINE**, **DolphinScheduler ENV, Database, Registry Server** and keep other same as [pseudo-cluster deployment](pseudo-cluster .md), the following describes the parameters that must be modified

```shell
# ---------------------------------------------------------
# INSTALL MACHINE
# ---------------------------------------------------------
# Using IP or machine hostname for server going to deploy master, worker, API server, the IP of the server
# If you using hostname, make sure machine could connect each others by hostname
# As below, the hostname of the machine deploying DolphinScheduler is ds1, ds2, ds3, ds4, ds5, where ds1, ds2 install master server, ds3, ds4, and ds5 installs worker server, the alert server is installed in ds4, and the api server is installed in ds5
ips="ds1,ds2,ds3,ds4,ds5"
masters="ds1,ds2"
workers="ds3:default,ds4:default,ds5:default"
alertServer="ds4"
apiServers="ds5"
```

## Start and Login DolphinScheduler

Same as pseudo-cluster.md](pseudo-cluster.md)

## Start and Stop Server

Same as pseudo-cluster.md](pseudo-cluster.md)