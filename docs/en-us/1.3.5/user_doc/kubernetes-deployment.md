# QuickStart in Kubernetes

## Prerequisites

 - [Helm](https://helm.sh/) 3.1.0+
 - [Kubernetes](https://kubernetes.io/) 1.12+
 - PV provisioner support in the underlying infrastructure

## Installing the Chart

Please download the source code package apache-dolphinscheduler-incubating-1.3.5-src.zip, download address: [download](/en-us/download/download.html)

To install the chart with the release name `dolphinscheduler`, please execute the following commands:

```
$ unzip apache-dolphinscheduler-incubating-1.3.5-src.zip
$ cd apache-dolphinscheduler-incubating-1.3.5-src-release/docker/kubernetes/dolphinscheduler
$ helm repo add bitnami https://charts.bitnami.com/bitnami
$ helm dependency update .
$ helm install dolphinscheduler . --set image.tag=1.3.5
```

To install the chart with a namespace named `test`:

```bash
$ helm install dolphinscheduler . -n test
```

> **Tip**: If a namespace named `test` is used, the option `-n test` needs to be added to the `helm` and `kubectl` command

These commands deploy DolphinScheduler on the Kubernetes cluster in the default configuration. The [Configuration](#configuration) section lists the parameters that can be configured during installation.

> **Tip**: List all releases using `helm list`

The **PostgreSQL** (with username `root`, password `root` and database `dolphinscheduler`) and **ZooKeeper** services will start by default

## Access DolphinScheduler UI

If `ingress.enabled` in `values.yaml` is set to `true`, you just access `http://${ingress.host}/dolphinscheduler` in browser.

> **Tip**: If there is a problem with ingress access, please contact the Kubernetes administrator and refer to the [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/)

Otherwise, you need to execute port-forward command like:

```bash
$ kubectl port-forward --address 0.0.0.0 svc/dolphinscheduler-api 12345:12345
$ kubectl port-forward --address 0.0.0.0 -n test svc/dolphinscheduler-api 12345:12345 # with test namespace
```

> **Tip**: If the error of `unable to do port forwarding: socat not found` appears, you need to install `socat` at first

And then access the web: http://localhost:12345/dolphinscheduler (The local address is http://localhost:12345/dolphinscheduler)

The default username is `admin` and the default password is `dolphinscheduler123`

Please refer to the `Quick Start` in the chapter [Quick Start](./quick-start.md) to explore how to use DolphinScheduler

## Uninstalling the Chart

To uninstall/delete the `dolphinscheduler` deployment:

```bash
$ helm uninstall dolphinscheduler
```

The command removes all the Kubernetes components but PVC's associated with the chart and deletes the release.

To delete the PVC's associated with `dolphinscheduler`:

```bash
$ kubectl delete pvc -l app.kubernetes.io/instance=dolphinscheduler
```

> **Note**: Deleting the PVC's will delete all data as well. Please be cautious before doing it.

## Configuration

The configuration file is `values.yaml`, and the [DolphinScheduler Kubernetes Configuration](https://github.com/apache/dolphinscheduler/blob/1.3.5/docker/kubernetes/dolphinscheduler/README.md#configuration) lists the configurable parameters of the DolphinScheduler and their default values.

## FAQ

### How to view the logs of a pod container?

List all pods (aka `po`):

```
kubectl get po
kubectl get po -n test # with test namespace
```

View the logs of a pod container named dolphinscheduler-master-0:

```
kubectl logs dolphinscheduler-master-0
kubectl logs -f dolphinscheduler-master-0 # follow log output
kubectl logs --tail 10 dolphinscheduler-master-0 -n test # show last 10 lines from the end of the logs
```

### How to scale api, master and worker on Kubernetes?

List all deployments (aka `deploy`):

```
kubectl get deploy
kubectl get deploy -n test # with test namespace
```

Scale api to 3 replicas:

```
kubectl scale --replicas=3 deploy dolphinscheduler-api
kubectl scale --replicas=3 deploy dolphinscheduler-api -n test # with test namespace
```

List all statefulsets (aka `sts`):

```
kubectl get sts
kubectl get sts -n test # with test namespace
```

Scale master to 2 replicas:

```
kubectl scale --replicas=2 sts dolphinscheduler-master
kubectl scale --replicas=2 sts dolphinscheduler-master -n test # with test namespace
```

Scale worker to 6 replicas:

```
kubectl scale --replicas=6 sts dolphinscheduler-worker
kubectl scale --replicas=6 sts dolphinscheduler-worker -n test # with test namespace
```

### How to use MySQL as the DolphinScheduler's database instead of PostgreSQL?

Not yet supported, the version 1.3.6 will support

### How to support MySQL datasource in `Datasource manage`?

> Because of the commercial license, we cannot directly use the driver of MySQL.
>
> If you want to add MySQL datasource, you can build a new image based on the `apache/dolphinscheduler` image as follows.

1. Download the MySQL driver [mysql-connector-java-5.1.49.jar](https://repo1.maven.org/maven2/mysql/mysql-connector-java/5.1.49/mysql-connector-java-5.1.49.jar) (require `>=5.1.47`)

2. Create a new `Dockerfile` to add MySQL driver:

```
FROM dolphinscheduler.docker.scarf.sh/apache/dolphinscheduler:1.3.5
COPY mysql-connector-java-5.1.49.jar /opt/dolphinscheduler/lib
```

3. Build a new docker image including MySQL driver:

```
docker build -t apache/dolphinscheduler:mysql-driver .
```

4. Push the docker image `apache/dolphinscheduler:mysql-driver` to a docker registry

5. Modify image `registry` and `repository`, and update `tag` to `mysql-driver` in `values.yaml`

6. Run a DolphinScheduler release in Kubernetes (See **Installing the Chart**)

7. Add a MySQL datasource in `Datasource manage`

### How to support Oracle datasource in `Datasource manage`?

> Because of the commercial license, we cannot directly use the driver of Oracle.
>
> If you want to add Oracle datasource, you can build a new image based on the `apache/dolphinscheduler` image as follows.

1. Download the Oracle driver [ojdbc8.jar](https://repo1.maven.org/maven2/com/oracle/database/jdbc/ojdbc8/) (such as `ojdbc8-19.9.0.0.jar`)

2. Create a new `Dockerfile` to add Oracle driver:

```
FROM dolphinscheduler.docker.scarf.sh/apache/dolphinscheduler:1.3.5
COPY ojdbc8-19.9.0.0.jar /opt/dolphinscheduler/lib
```

3. Build a new docker image including Oracle driver:

```
docker build -t apache/dolphinscheduler:oracle-driver .
```

4. Push the docker image `apache/dolphinscheduler:oracle-driver` to a docker registry

5. Modify image `registry` and `repository`, and update `tag` to `oracle-driver` in `values.yaml`

6. Run a DolphinScheduler release in Kubernetes (See **Installing the Chart**)

7. Add a Oracle datasource in `Datasource manage`
