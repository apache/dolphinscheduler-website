# 快速试用 Kubernetes 部署

## 先决条件

 - [Helm](https://helm.sh/) 3.1.0+
 - [Kubernetes](https://kubernetes.io/) 1.12+
 - PV 供应(需要基础设施支持)

## 安装 dolphinscheduler

> 注意：您需要在本地更改 `Chart.yaml` 文件才能使其正常工作。 由于 Bitnami 存储库的更改，https://charts.bitnami.com/bitnami 被截断，
> 仅包含最近 6 个月（从 2022 年 1 月起）的条目。 只有这个 url 才包含了：https://raw.githubusercontent.com/bitnami/charts/archive-full-index/bitnami 完整的 index.yaml。
> 如果您想了解更多细节，请访问：https://github.com/bitnami/charts/issues/10833。
>
> 更改您的 `Chart.yaml` 并将所有 `repository: https://charts.bitnami.com/bitnami` 替换为 `repository: https://raw.githubusercontent.com/bitnami/charts/archive-full-index/bitnami`

请下载源码包 apache-dolphinscheduler-incubating-1.3.5-src.zip，下载地址: [下载](/zh-cn/download/download.html)

发布一个名为 `dolphinscheduler` 的版本(release)，请执行以下命令：

```
$ unzip apache-dolphinscheduler-incubating-1.3.5-src.zip
$ cd apache-dolphinscheduler-incubating-1.3.5-src-release/docker/kubernetes/dolphinscheduler
$ helm repo add bitnami https://charts.bitnami.com/bitnami
$ helm dependency update .
$ helm install dolphinscheduler . --set image.tag=1.3.5
```

将名为 `dolphinscheduler` 的版本(release) 发布到 `test` 的命名空间中：

```bash
$ helm install dolphinscheduler . -n test
```

> **提示**: 如果名为 `test` 的命名空间被使用, 选项参数 `-n test` 需要添加到 `helm` 和 `kubectl` 命令中

这些命令以默认配置在 Kubernetes 集群上部署 DolphinScheduler，[配置](#configuration)部分列出了可以在安装过程中配置的参数  <!-- markdown-link-check-disable-line -->

> **提示**: 列出所有已发布的版本，使用 `helm list`

**PostgreSQL** (用户 `root`, 密码 `root`, 数据库 `dolphinscheduler`) 和 **ZooKeeper** 服务将会默认启动

## 访问 DolphinScheduler 前端页面

如果 `values.yaml` 文件中的 `ingress.enabled` 被设置为 `true`, 在浏览器中访问 `http://${ingress.host}/dolphinscheduler` 即可

> **提示**: 如果 ingress 访问遇到问题，请联系 Kubernetes 管理员并查看 [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/)

否则，你需要执行 port-forward 端口转发命令：

```bash
$ kubectl port-forward --address 0.0.0.0 svc/dolphinscheduler-api 12345:12345
$ kubectl port-forward --address 0.0.0.0 -n test svc/dolphinscheduler-api 12345:12345 # 使用 test 命名空间
```

> **提示**: 如果出现 `unable to do port forwarding: socat not found` 错误, 需要先安装 `socat`

访问前端页面：http://localhost:12345/dolphinscheduler，如果有需要请修改成对应的 IP 地址

默认的用户是`admin`，默认的密码是`dolphinscheduler123`

请参考用户手册章节的[快速上手](./quick-start.md) 查看如何使用DolphinScheduler

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

配置文件为 `values.yaml`，[DolphinScheduler Kubernetes 配置](https://github.com/apache/dolphinscheduler/blob/1.3.5/docker/kubernetes/dolphinscheduler/README.md#configuration) 列出了 DolphinScheduler 的可配置参数及其默认值

## FAQ

### 如何查看一个 pod 容器的日志？

列出所有 pods (别名 `po`):

```
kubectl get po
kubectl get po -n test # with test namespace
```

查看名为 dolphinscheduler-master-0 的 pod 容器的日志:

```
kubectl logs dolphinscheduler-master-0
kubectl logs -f dolphinscheduler-master-0 # 跟随日志输出
kubectl logs --tail 10 dolphinscheduler-master-0 -n test # 显示倒数10行日志
```

### 如何在 Kubernetes 上扩缩容 api, master 和 worker？

列出所有 deployments (别名 `deploy`):

```
kubectl get deploy
kubectl get deploy -n test # with test namespace
```

扩缩容 api 至 3 个副本:

```
kubectl scale --replicas=3 deploy dolphinscheduler-api
kubectl scale --replicas=3 deploy dolphinscheduler-api -n test # with test namespace
```

列出所有 statefulsets (别名 `sts`):

```
kubectl get sts
kubectl get sts -n test # with test namespace
```

扩缩容 master 至 2 个副本:

```
kubectl scale --replicas=2 sts dolphinscheduler-master
kubectl scale --replicas=2 sts dolphinscheduler-master -n test # with test namespace
```

扩缩容 worker 至 6 个副本:

```
kubectl scale --replicas=6 sts dolphinscheduler-worker
kubectl scale --replicas=6 sts dolphinscheduler-worker -n test # with test namespace
```

### 如何用 MySQL 替代 PostgreSQL 作为 DolphinScheduler 的数据库？

尚不支持，1.3.6 版本将支持

### 如何在数据源中心支持 MySQL 数据源？

> 由于商业许可证的原因，我们不能直接使用 MySQL 的驱动包.
>
> 如果你要添加 MySQL 数据源, 你可以基于官方镜像 `apache/dolphinscheduler` 进行构建.

1. 下载 MySQL 驱动包 [mysql-connector-java-5.1.49.jar](https://repo1.maven.org/maven2/mysql/mysql-connector-java/5.1.49/mysql-connector-java-5.1.49.jar) (要求 `>=5.1.47`)

2. 创建一个新的 `Dockerfile`，用于添加 MySQL 驱动包:

```
FROM dolphinscheduler.docker.scarf.sh/apache/dolphinscheduler:1.3.5
COPY mysql-connector-java-5.1.49.jar /opt/dolphinscheduler/lib
```

3. 构建一个包含 MySQL 驱动包的新镜像:

```
docker build -t apache/dolphinscheduler:mysql-driver .
```

4. 推送 docker 镜像 `apache/dolphinscheduler:mysql-driver` 到一个 docker registry 中

5. 修改 `values.yaml` 文件中 image 的 `registry` 和 `repository` 字段，并更新 `tag` 为 `mysql-driver`

6. 部署 dolphinscheduler (详见**安装 dolphinscheduler**)

7. 在数据源中心添加一个 MySQL 数据源

### 如何在数据源中心支持 Oracle 数据源？

> 由于商业许可证的原因，我们不能直接使用 Oracle 的驱动包.
>
> 如果你要添加 Oracle 数据源, 你可以基于官方镜像 `apache/dolphinscheduler` 进行构建.

1. 下载 Oracle 驱动包 [ojdbc8.jar](https://repo1.maven.org/maven2/com/oracle/database/jdbc/ojdbc8/) (例如 `ojdbc8-19.9.0.0.jar`)

2. 创建一个新的 `Dockerfile`，用于添加 Oracle 驱动包:

```
FROM dolphinscheduler.docker.scarf.sh/apache/dolphinscheduler:1.3.5
COPY ojdbc8-19.9.0.0.jar /opt/dolphinscheduler/lib
```

3. 构建一个包含 Oracle 驱动包的新镜像:

```
docker build -t apache/dolphinscheduler:oracle-driver .
```

4. 推送 docker 镜像 `apache/dolphinscheduler:oracle-driver` 到一个 docker registry 中

5. 修改 `values.yaml` 文件中 image 的 `registry` 和 `repository` 字段，并更新 `tag` 为 `oracle-driver`

6. 部署 dolphinscheduler (详见**安装 dolphinscheduler**)

7. 在数据源中心添加一个 Oracle 数据源
