# DolphinScheduler Expansion and Reduction

## 1. Expansion 
This article describes how to add a new master service or worker service to an existing DolphinScheduler cluster.
```
 Attention: There cannot be more than one master service process or worker service process on a physical machine.
       If the physical machine where the expansion master or worker node is located has already installed the scheduled service, skip to [1.4 Modify configuration] Edit the configuration file `conf/config/install_config.conf` on **all ** nodes, add masters or workers parameter, and restart the scheduling cluster.
```

### 1.1 Basic software installation (please install the mandatory items yourself)

* [required] [JDK](https://www.oracle.com/technetwork/java/javase/downloads/index.html) (1.8+):Must be installed, please install and configure JAVA_HOME and PATH variables under /etc/profile
* [optional] If the expansion is a worker node, you need to consider whether to install an external client, such as Hadoop, Hive, Spark Client.


```markdown
 Attention: DolphinScheduler itself does not depend on Hadoop, Hive, Spark, but will only call their Client for the corresponding task submission.
```

### 1.2 Get installation package
- Check which version of DolphinScheduler is used in your existing environment, and get the installation package of the corresponding version, if the versions are different, there may be compatibility problems.
- Confirm the unified installation directory of other nodes, this article assumes that DolphinScheduler is installed in /opt/ directory, and the full path is /opt/dolphinscheduler.
- Please download the corresponding version of the installation package to the server installation directory, uncompress it and rename it to dolphinscheduler and store it in the /opt directory. 
- Add database dependency package, this article uses Mysql database, add mysql-connector-java driver package to /opt/dolphinscheduler/lib directory.
```shell
# create the installation directory, please do not create the installation directory in /root, /home and other high privilege directories 
mkdir -p /opt
cd /opt
# decompress
tar -zxvf apache-dolphinscheduler-1.3.8-bin.tar.gz -C /opt 
cd /opt
mv apache-dolphinscheduler-1.3.8-bin  dolphinscheduler
```

```markdown
 Attention: The installation package can be copied directly from an existing environment to an expanded physical machine for use.
```

### 1.3 Create Deployment Users

- Create deployment users on **all** expansion machines, and be sure to configure sudo-free. If we plan to deploy scheduling on four expansion machines, ds1, ds2, ds3, and ds4, we first need to create deployment users on each machine

```shell
# to create a user, you need to log in with root and set the deployment user name, please modify it yourself, later take dolphinscheduler as an example
useradd dolphinscheduler;

# set the user password, please change it by yourself, later take dolphinscheduler123 as an example
echo "dolphinscheduler123" | passwd --stdin dolphinscheduler

# configure sudo password-free
echo 'dolphinscheduler  ALL=(ALL)  NOPASSWD: NOPASSWD: ALL' >> /etc/sudoers
sed -i 's/Defaults    requirett/#Defaults    requirett/g' /etc/sudoers

```

```markdown
 Attention:
 - Since it is sudo -u {linux-user} to switch between different Linux users to run multi-tenant jobs, the deploying user needs to have sudo privileges and be password free.
 - If you find the line "Default requiretty" in the /etc/sudoers file, please also comment it out.
 - If resource uploads are used, you also need to assign read and write permissions to the deployment user on `HDFS or MinIO`.
```

### 1.4 Modify configuration

- From an existing node such as Master/Worker, copy the conf directory directly to replace the conf directory in the new node. After copying, check if the configuration items are correct.
    
    ```markdown
    Highlights:
    datasource.properties: database connection information 
    zookeeper.properties: information for connecting zk 
    common.properties: Configuration information about the resource store (if hadoop is set up, please check if the core-site.xml and hdfs-site.xml configuration files exist).
    env/dolphinscheduler_env.sh: environment Variables
    ````

- Modify the `dolphinscheduler_env.sh` environment variable in the conf/env directory according to the machine configuration (take the example that the software used is installed in /opt/soft)

    ```shell
        export HADOOP_HOME=/opt/soft/hadoop
        export HADOOP_CONF_DIR=/opt/soft/hadoop/etc/hadoop
        # export SPARK_HOME1=/opt/soft/spark1
        export SPARK_HOME2=/opt/soft/spark2
        export PYTHON_HOME=/opt/soft/python
        export JAVA_HOME=/opt/soft/jav
        export HIVE_HOME=/opt/soft/hive
        export FLINK_HOME=/opt/soft/flink
        export DATAX_HOME=/opt/soft/datax/bin/datax.py
        export PATH=$HADOOP_HOME/bin:$SPARK_HOME2/bin:$PYTHON_HOME:$JAVA_HOME/bin:$HIVE_HOME/bin:$PATH:$FLINK_HOME/bin:$DATAX_HOME:$PATH
    
    ```

    `Attention: This step is very important, such as JAVA_HOME and PATH is necessary to configure, not used can be ignored or commented out`


- Softlink the JDK to /usr/bin/java (still using JAVA_HOME=/opt/soft/java as an example)

    ```shell
    sudo ln -s /opt/soft/java/bin/java /usr/bin/java
    ```

 - Modify the configuration file `conf/config/install_config.conf` on the **all** nodes, synchronizing the following configuration.
    
    * To add a new master node, you need to modify the ips and masters parameters.
    * To add a new worker node, modify the ips and workers parameters.

```shell
# which machines to deploy DS services on, separated by commas between multiple physical machines
ips="ds1,ds2,ds3,ds4"

# ssh port,default 22
sshPort="22"

# which machine the master service is deployed on
masters="existing master01,existing master02,ds1,ds2"

# the worker service is deployed on which machine, and specify the worker belongs to which worker group, the following example of "default" is the group name
workers="existing worker01:default,existing worker02:default,ds3:default,ds4:default"

```
- If the expansion is for worker nodes, you need to set the worker group. Please refer to the security [Worker grouping](./security.md)

- On all new nodes, change the directory permissions so that the deployment user has access to the dolphinscheduler directory

```shell
sudo chown -R dolphinscheduler:dolphinscheduler dolphinscheduler
```

### 1.4. Restart the cluster & verify

- restart the cluster

```shell
# stop command:

bin/stop-all.sh # stop all services

sh bin/dolphinscheduler-daemon.sh stop master-server  # stop master service
sh bin/dolphinscheduler-daemon.sh stop worker-server  # stop worker service
sh bin/dolphinscheduler-daemon.sh stop api-server     # stop api    service
sh bin/dolphinscheduler-daemon.sh stop alert-server   # stop alert  service


# start command::
bin/start-all.sh # start all services

sh bin/dolphinscheduler-daemon.sh start master-server  # start master service
sh bin/dolphinscheduler-daemon.sh start worker-server  # start worker service
sh bin/dolphinscheduler-daemon.sh start api-server     # start api    service
sh bin/dolphinscheduler-daemon.sh start alert-server   # start alert  service

```

```
 Attention: When using stop-all.sh or stop-all.sh, if the physical machine executing the command is not configured to be ssh-free on all machines, it will prompt for the password
```


- After the script is completed, use the `jps` command to see if each node service is started (`jps` comes with the `Java JDK`)

```
    MasterServer         ----- master service
    WorkerServer         ----- worker service
    ApiApplicationServer ----- api    service
    AlertServer          ----- alert  service
```

After successful startup, you can view the logs, which are stored in the logs folder.

```Log Path
 logs/
    ├── dolphinscheduler-alert-server.log
    ├── dolphinscheduler-master-server.log
    ├── dolphinscheduler-worker-server.log
    ├── dolphinscheduler-api-server.log
```
If the above services are started normally and the scheduling system page is normal, check whether there is an expanded Master or Worker service in the [Monitor] of the web system. If it exists, the expansion is complete.

-----------------------------------------------------------------------------

## 2. Reduction
The reduction is to reduce the master or worker services for the existing DolphinScheduler cluster.
There are two steps for shrinking. After performing the following two steps, the shrinking operation can be completed.

### 2.1 Stop the service on the scaled-down node
 * If you are scaling down the master node, identify the physical machine where the master service is located, and stop the master service on the physical machine.
 * If the worker node is scaled down, determine the physical machine where the worker service is to be scaled down and stop the worker services on the physical machine.
 
```shell
# stop command:
bin/stop-all.sh # stop all services

sh bin/dolphinscheduler-daemon.sh stop master-server  # stop master service
sh bin/dolphinscheduler-daemon.sh stop worker-server  # stop worker service
sh bin/dolphinscheduler-daemon.sh stop api-server     # stop api    service
sh bin/dolphinscheduler-daemon.sh stop alert-server   # stop alert  service


# start command:
bin/start-all.sh # start all services

sh bin/dolphinscheduler-daemon.sh start master-server # start master service
sh bin/dolphinscheduler-daemon.sh start worker-server # start worker service
sh bin/dolphinscheduler-daemon.sh start api-server    # start api    service
sh bin/dolphinscheduler-daemon.sh start alert-server  # start alert  service

```

```
 Attention: When using stop-all.sh or stop-all.sh, if the machine without the command is not configured to be ssh-free for all machines, it will prompt for the password.
```

- After the script is completed, use the `jps` command to see if each node service was successfully shut down (`jps` comes with the `Java JDK`)

```
    MasterServer         ----- master service
    WorkerServer         ----- worker service
    ApiApplicationServer ----- api    service
    AlertServer          ----- alert  service
```
If the corresponding master service or worker service does not exist, then the master/worker service is successfully shut down.


### 2.2 Modify the configuration file

 - modify the configuration file `conf/config/install_config.conf` on the **all** nodes, synchronizing the following configuration.
    
    * to scale down the master node, modify the ips and masters parameters.
    * to scale down worker nodes, modify the ips and workers parameters.

```shell
# which machines to deploy DS services on, "localhost" for this machine
ips="ds1,ds2,ds3,ds4"

# ssh port,default: 22
sshPort="22"

# which machine the master service is deployed on
masters="existing master01,existing master02,ds1,ds2"

# The worker service is deployed on which machine, and specify which worker group this worker belongs to, the following example of "default" is the group name
workers="existing worker01:default,existing worker02:default,ds3:default,ds4:default"

```
