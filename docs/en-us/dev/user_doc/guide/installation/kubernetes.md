# Kubernetes Deployment

Kubernetes deployment is deploy DolphinScheduler in a Kubernetes cluster, which can schedule a large number of tasks and can be used in production.

If you are a green hand and want to experience DolphinScheduler, we recommended you install follow [Standalone](standalone.md). If you want to experience more complete functions or schedule large tasks number, we recommended you install follow [pseudo-cluster deployment](pseudo-cluster.md). If you want to using DolphinScheduler in production, we recommended you follow [cluster deployment](cluster.md) or [kubernetes](kubernetes.md)


## Production preparation

 - [Helm](https://helm.sh/) 3.1.0+
 - [Kubernetes](https://kubernetes.io/) 1.12+

## install dolphinscheduler

Please download the source package apache-dolphinscheduler-2.0.2-src.tar.gz, download address: [download](/zh-cn/download/download.html)

To release a release named `dolphinscheduler`, execute the following command:

````
$ tar -zxvf apache-dolphinscheduler-2.0.2-src.tar.gz
$ cd apache-dolphinscheduler-2.0.2-src/docker/kubernetes/dolphinscheduler
$ helm repo add bitnami https://charts.bitnami.com/bitnami
$ helm dependency update .
$ helm install dolphinscheduler . --set image.tag=2.0.2
````

Publish a release named `dolphinscheduler` into the `test` namespace:

```bash
$ helm install dolphinscheduler . -n test
````

> **hint**: if a namespace named `test` is used, the option parameter `-n test` needs to be added to the `helm` and `kubectl` commands

These commands deploy DolphinScheduler on a Kubernetes cluster with the default configuration, the [Appendix-Configuration](#appendix-configuration) section lists the parameters that can be configured during installation

> **hint**: to list all published versions, use `helm list`

**PostgreSQL** (user `root`, password `root`, database `dolphinscheduler`) and **ZooKeeper** services will be started by default

## Visit the DolphinScheduler front-end page

If `ingress.enabled` in `values.yaml` file is set to `true`, just visit `http://${ingress.host}/dolphinscheduler` in your browser

> **TIP**: If you have problems accessing ingress, contact your Kubernetes administrator and see [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/)

Otherwise, when `api.service.type=ClusterIP`, you need to execute the port-forward command:

```bash
$ kubectl port-forward --address 0.0.0.0 svc/dolphinscheduler-api 12345:12345
$ kubectl port-forward --address 0.0.0.0 -n test svc/dolphinscheduler-api 12345:12345 # use the test namespace
````

> **hint**: If you get `unable to do port forwarding: socat not found` error, you need to install `socat` first

Then visit the front-end page: http://192.168.xx.xx:12345/dolphinscheduler (local address is http://127.0.0.1:12345/dolphinscheduler)

Or when `api.service.type=NodePort` you need to execute the command:

```bash
NODE_IP=$(kubectl get no -n {{ .Release.Namespace }} -o jsonpath="{.items[0].status.addresses[0].address}")
NODE_PORT=$(kubectl get svc {{ template "dolphinscheduler.fullname" . }}-api -n {{ .Release.Namespace }} -o jsonpath="{.spec.ports[0].nodePort}")
echo http://$NODE_IP:$NODE_PORT/dolphinscheduler
````

Then visit the front-end page: http://192.168.xx.xx:12345/dolphinscheduler

The default user is `admin` and the default password is `dolphinscheduler123`

Please refer to [Quick Start](/zh-cn/docs/2.0.2/user_doc/guide/quick-start.html) in the user manual chapter to see how to use DolphinScheduler

## uninstall dolphinscheduler

To uninstall the release named `dolphinscheduler`, execute:

```bash
$ helm uninstall dolphinscheduler
````

This command will remove all Kubernetes components (except PVCs) related to `dolphinscheduler` and remove the release

To delete a PVC related to `dolphinscheduler`, execute:

```bash
$ kubectl delete pvc -l app.kubernetes.io/instance=dolphinscheduler
````

> **NOTE**: Deleting PVC will also delete all data, please be careful!

## configure

The configuration file is `values.yaml`, the [Appendix-Configuration](#appendix-configuration) table lists the configurable parameters of DolphinScheduler and their default values

## Support matrix

| Type | Support | Remarks |
| ------------------------------------------------- ----------- | ------- | --------------------- |
| Shell | Yes | |
| Python2 | Yes | |
| Python3 | Indirect support | See FAQ |
| Hadoop2 | Indirect Support | See FAQ |
| Hadoop3 | Not yet determined | Not yet tested |
| Spark-Local(client) | Indirect support | See FAQ |
| Spark-YARN(cluster) | Indirect support | See FAQ |
| Spark-Standalone(cluster) | Not yet | |
| Spark-Kubernetes(cluster) | Not yet | |
| Flink-Local(local>=1.11) | Not yet | Generic CLI mode not yet supported |
| Flink-YARN(yarn-cluster) | Indirect support | See FAQ |
| Flink-YARN(yarn-session/yarn-per-job/yarn-application>=1.11) | Not yet | Generic CLI mode not yet supported |
| Flink-Standalone(default) | Not yet | |
| Flink-Standalone(remote>=1.11) | Not yet | Generic CLI mode not yet supported |
| Flink-Kubernetes(default) | Not yet | |
| Flink-Kubernetes(remote>=1.11) | Not yet | Generic CLI mode not yet supported |
| Flink-NativeKubernetes(kubernetes-session/application>=1.11) | Not yet | Generic CLI mode not yet supported |
| MapReduce | Indirect Support | See FAQ |
| Kerberos | Indirect Support | See FAQ |
| HTTP | Yes |
