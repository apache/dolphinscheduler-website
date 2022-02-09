# Kubernetes 部署

Kubernetes部署目的是在Kubernetes集群中部署 DolphinScheduler 服务，能调度大量任务，可用于在生产中部署。

如果你是新手，想要体验 DolphinScheduler 的功能，推荐使用[Standalone](standalone.md)方式体检。如果你想体验更完整的功能，或者更大的任务量，推荐使用[伪集群部署](pseudo-cluster.md)。如果你是在生产中使用，推荐使用[集群部署](cluster.md)或者[kubernetes](kubernetes.md)


## 生产准备

 - [Helm](https://helm.sh/) 3.1.0+
 - [Kubernetes](https://kubernetes.io/) 1.12+

## 安装 dolphinscheduler

请下载源码包 apache-dolphinscheduler-2.0.2-src.tar.gz，下载地址: [下载](/zh-cn/download/download.html)

发布一个名为 `dolphinscheduler` 的版本(release)，请执行以下命令：

```
$ tar -zxvf apache-dolphinscheduler-2.0.2-src.tar.gz
$ cd apache-dolphinscheduler-2.0.2-src/docker/kubernetes/dolphinscheduler
$ helm repo add bitnami https://charts.bitnami.com/bitnami
$ helm dependency update .
$ helm install dolphinscheduler . --set image.tag=2.0.2
```

将名为 `dolphinscheduler` 的版本(release) 发布到 `test` 的命名空间中：

```bash
$ helm install dolphinscheduler . -n test
```

> **提示**: 如果名为 `test` 的命名空间被使用, 选项参数 `-n test` 需要添加到 `helm` 和 `kubectl` 命令中

这些命令以默认配置在 Kubernetes 集群上部署 DolphinScheduler，[附录-配置](#appendix-configuration)部分列出了可以在安装过程中配置的参数

> **提示**: 列出所有已发布的版本，使用 `helm list`

**PostgreSQL** (用户 `root`, 密码 `root`, 数据库 `dolphinscheduler`) 和 **ZooKeeper** 服务将会默认启动

## 访问 DolphinScheduler 前端页面

如果 `values.yaml` 文件中的 `ingress.enabled` 被设置为 `true`, 在浏览器中访问 `http://${ingress.host}/dolphinscheduler` 即可

> **提示**: 如果 ingress 访问遇到问题，请联系 Kubernetes 管理员并查看 [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/)

否则，当 `api.service.type=ClusterIP` 时，你需要执行 port-forward 端口转发命令：

```bash
$ kubectl port-forward --address 0.0.0.0 svc/dolphinscheduler-api 12345:12345
$ kubectl port-forward --address 0.0.0.0 -n test svc/dolphinscheduler-api 12345:12345 # 使用 test 命名空间
```

> **提示**: 如果出现 `unable to do port forwarding: socat not found` 错误, 需要先安装 `socat`

然后访问前端页面: http://192.168.xx.xx:12345/dolphinscheduler (本地地址为 http://127.0.0.1:12345/dolphinscheduler)

或者当 `api.service.type=NodePort` 时，你需要执行命令：

```bash
NODE_IP=$(kubectl get no -n {{ .Release.Namespace }} -o jsonpath="{.items[0].status.addresses[0].address}")
NODE_PORT=$(kubectl get svc {{ template "dolphinscheduler.fullname" . }}-api -n {{ .Release.Namespace }} -o jsonpath="{.spec.ports[0].nodePort}")
echo http://$NODE_IP:$NODE_PORT/dolphinscheduler
```

然后访问前端页面: http://192.168.xx.xx:12345/dolphinscheduler

默认的用户是`admin`，默认的密码是`dolphinscheduler123`

请参考用户手册章节的[快速上手](/zh-cn/docs/2.0.2/user_doc/guide/quick-start.html)查看如何使用DolphinScheduler

## 卸载 dolphinscheduler

卸载名为 `dolphinscheduler` 的版本(release)，请执行：

```bash
$ helm uninstall dolphinscheduler
```

该命令将删除与 `dolphinscheduler` 相关的所有 Kubernetes 组件（但PVC除外），并删除版本(release)

要删除与 `dolphinscheduler` 相关的PVC，请执行：

```bash
$ kubectl delete pvc -l app.kubernetes.io/instance=dolphinscheduler
```

> **注意**: 删除PVC也会删除所有数据，请谨慎操作！

## 配置

配置文件为 `values.yaml`，[附录 - 配置](#appendix-configuration) 表格列出了 DolphinScheduler 的可配置参数及其默认值

## 支持矩阵

| Type                                                         | 支持     | 备注                  |
| ------------------------------------------------------------ | ------- | --------------------- |
| Shell                                                        | 是      |                       |
| Python2                                                      | 是      |                       |
| Python3                                                      | 间接支持 | 详见 FAQ               |
| Hadoop2                                                      | 间接支持 | 详见 FAQ               |
| Hadoop3                                                      | 尚未确定 | 尚未测试                |
| Spark-Local(client)                                          | 间接支持 | 详见 FAQ               |
| Spark-YARN(cluster)                                          | 间接支持 | 详见 FAQ               |
| Spark-Standalone(cluster)                                    | 尚不    |                        |
| Spark-Kubernetes(cluster)                                    | 尚不    |                        |
| Flink-Local(local>=1.11)                                     | 尚不    | Generic CLI 模式尚未支持 |
| Flink-YARN(yarn-cluster)                                     | 间接支持 | 详见 FAQ               |
| Flink-YARN(yarn-session/yarn-per-job/yarn-application>=1.11) | 尚不    | Generic CLI 模式尚未支持 |
| Flink-Standalone(default)                                    | 尚不    |                        |
| Flink-Standalone(remote>=1.11)                               | 尚不    | Generic CLI 模式尚未支持 |
| Flink-Kubernetes(default)                                    | 尚不    |                        |
| Flink-Kubernetes(remote>=1.11)                               | 尚不    | Generic CLI 模式尚未支持 |
| Flink-NativeKubernetes(kubernetes-session/application>=1.11) | 尚不    | Generic CLI 模式尚未支持 |
| MapReduce                                                    | 间接支持 | 详见 FAQ               |
| Kerberos                                                     | 间接支持 | 详见 FAQ               |
| HTTP                                                         | 是      |
