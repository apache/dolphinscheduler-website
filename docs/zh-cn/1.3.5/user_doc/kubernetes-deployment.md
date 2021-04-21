## 快速试用 Kubernetes 部署

## 先决条件(请自行安装)

- [Helm](https://helm.sh/) 3.1.0+
- [Kubernetes](https://kubernetes.io/) 1.12+
- PV 供应(需要基础设施支持)

## 安装 dolphinscheduler

发布一个名为 `dolphinscheduler` 的版本(release)，请执行以下操作：

```bash
# 通过wget下载源码包
$ wget https://mirrors.tuna.tsinghua.edu.cn/apache/dolphinscheduler/1.3.5/apache-dolphinscheduler-incubating-1.3.5-src.zip
# 通过curl下载源码包
$ curl -O https://mirrors.tuna.tsinghua.edu.cn/apache/dolphinscheduler/1.3.5/apache-dolphinscheduler-incubating-1.3.5-src.zip
$ unzip apache-dolphinscheduler-incubating-1.3.5-src.zip
$ mv apache-dolphinscheduler-incubating-1.3.5-src-release dolphinscheduler-src
$ cd dolphinscheduler-src/docker/kubernetes/dolphinscheduler
$ helm repo add bitnami https://charts.bitnami.com/bitnami
$ helm dependency update .
$ helm install dolphinscheduler .
```

将名为 `dolphinscheduler` 的版本(release) 发布到 `test` 的命名空间中：

```bash
$ helm install dolphinscheduler . -n test
```

> **提示**: 如果名为 `test` 的命名空间被使用, 选项参数 `-n test` 需要添加到 `helm` 和 `kubectl` 命令中

这些命令以默认配置在 Kubernetes 集群上部署 DolphinScheduler，[配置](#configuration)部分列出了可以在安装过程中配置的参数

> **提示**: 列出所有已发布的版本，使用 `helm list`

## 访问 DolphinScheduler 前端页面

如果 `values.yaml` 文件中的 `ingress.enabled` 被设置为 `true`, 在浏览器中访问 `http://${ingress.host}/dolphinscheduler` 即可

> **提示**: 如果 ingress 访问遇到问题，请联系 Kubernetes 管理员并查看 [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/)

否则，你需要执行 port-forward 端口转发命令：

```bash
$ kubectl port-forward --address 0.0.0.0 svc/dolphinscheduler-api 12345:12345
$ kubectl port-forward --address 0.0.0.0 -n test svc/dolphinscheduler-api 12345:12345 # 使用 test 命名空间
```

> **提示**: 如果出现 `unable to do port forwarding: socat not found` 错误, 需要先安装 `socat`

然后访问前端页面: http://192.168.xx.xx:12345/dolphinscheduler

默认的用户是`admin`，默认的密码是`dolphinscheduler123`

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

配置文件为 `values.yaml`，[DolphinScheduler Kubernetes 配置](https://github.com/apache/dolphinscheduler/blob/1.3.5-release/docker/kubernetes/dolphinscheduler/README.md) 列出了 DolphinScheduler 的可配置参数及其默认值

## FAQ

### 如何用 MySQL 替代 PostgreSQL 作为 DolphinScheduler 的数据库？

尚不支持，1.3.6 版本将支持

### 如何在数据源中心支持 MySQL 数据源？

> 由于商业许可证的原因，我们不能直接使用 MySQL 的驱动包.
>
> 如果你要添加 MySQL 数据源, 你可以基于官方镜像 `apache/dolphinscheduler` 进行构建.

1. 下载 MySQL 驱动包 [mysql-connector-java-5.1.49.jar](https://repo1.maven.org/maven2/mysql/mysql-connector-java/5.1.49/mysql-connector-java-5.1.49.jar) (要求 `>=5.1.47`)

2. 创建一个新的 `Dockerfile`，用于添加 MySQL 驱动包:

```
FROM apache/dolphinscheduler:latest
COPY mysql-connector-java-5.1.49.jar /opt/dolphinscheduler/lib
```

3. 构建一个包含 MySQL 驱动包的新镜像:

```
docker build -t apache/dolphinscheduler:mysql-driver .
```

4. 推送 docker 镜像 `apache/dolphinscheduler:mysql-driver` 到一个 docker registry 中

5. 修改 `values.yaml` 文件中 image 的 `registry` 和 `repository` 字段， 并更新 `tag` 为 `mysql-driver`

6. 部署 dolphinscheduler (详见**安装 dolphinscheduler**)

7. 在数据源中心添加一个 MySQL 数据源

### 如何在数据源中心支持 Oracle 数据源？

> 由于商业许可证的原因，我们不能直接使用 Oracle 的驱动包.
>
> 如果你要添加 Oracle 数据源, 你可以基于官方镜像 `apache/dolphinscheduler` 进行构建.

1. 下载 Oracle 驱动包 [ojdbc8.jar](https://repo1.maven.org/maven2/com/oracle/database/jdbc/ojdbc8/) (例如 `ojdbc8-19.9.0.0.jar`)

2. 创建一个新的 `Dockerfile`，用于添加 Oracle 驱动包:

```
FROM apache/dolphinscheduler:latest
COPY ojdbc8-19.9.0.0.jar /opt/dolphinscheduler/lib
```

3. 构建一个包含 Oracle 驱动包的新镜像:

```
docker build -t apache/dolphinscheduler:oracle-driver .
```

4. 推送 docker 镜像 `apache/dolphinscheduler:oracle-driver` 到一个 docker registry 中

5. 修改 `values.yaml` 文件中 image 的 `registry` 和 `repository` 字段， 并更新 `tag` 为 `oracle-driver`

6. 部署 dolphinscheduler (详见**安装 dolphinscheduler**)

7. 在数据源中心添加一个 Oracle 数据源

更多信息请查看 [dolphinscheduler](https://github.com/apache/dolphinscheduler.git) 文档.
