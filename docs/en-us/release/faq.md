<!-- markdown-link-check-disable -->
## Q: What's the name of this project?

A: DolphinScheduler

---

## Q: DolphinScheduler service introduction and recommended running memory

A: DolphinScheduler consists of 5 services, MasterServer, WorkerServer, ApiServer, AlertServer, LoggerServer and UI.

| Service                   | Description                                                  |
| ------------------------- | ------------------------------------------------------------ |
| MasterServer              | Mainly responsible for DAG segmentation and task status monitoring |
| WorkerServer/LoggerServer | Mainly responsible for the submission, execution and update of task status. LoggerServer is used for Rest Api to view logs through RPC |
| ApiServer                 | Provides the Rest Api service for the UI to call             |
| AlertServer               | Provide alarm service                                        |
| UI                        | Front page display                                           |

Note：**Due to the large number of services, it is recommended that the single-machine deployment is preferably 4 cores and 16G or more.**

---

## Q: Which mailboxes does the system support?

A: Support most mailboxes, qq, 163, 126, 139, outlook, aliyun, etc. are supported. Support TLS and SSL protocols, optionally configured in alert.properties

---

## Q: What are the common system variable time parameters and how do I use them?

A: Please refer to 'System parameter' in the system-manual

---

## Q: pip install kazoo This installation gives an error. Is it necessary to install?

A: This is the python connection Zookeeper needs to use, it is used to delete the master/worker temporary node info in the Zookeeper. so you can ignore error if it's your first install. after version 1.3.0, kazoo is not been needed, we use program to replace what kazoo done

---

## Q: How to specify the machine running task

A: version 1.2 and berfore, Use **the administrator** to create a Worker group, **specify the Worker group** when the **process definition starts**, or **specify the Worker group on the task node**. If not specified, use Default, **Default is to select one of all the workers in the cluster to use for task submission and execution.**
version 1.3, you can set worker group for the worker

---

## Q: Priority of the task

A: We also support **the priority of processes and tasks**. Priority We have five levels of **HIGHEST, HIGH, MEDIUM, LOW and LOWEST**. **You can set the priority between different process instances, or you can set the priority of different task instances in the same process instance.** For details, please refer to the task priority design in the architecture-design.

---

## Q: dolphinscheduler-grpc gives an error

A: Execute in the root directory: mvn -U clean package assembly:assembly -Dmaven.test.skip=true , then refresh the entire project. version 1.3 not use grpc, we use netty directly

---

## Q: Does DolphinScheduler support running on windows?

A: In theory, **only the Worker needs to run on Linux**. Other services can run normally on Windows. But it is still recommended to deploy on Linux.

---

## Q: UI compiles node-sass prompt in linux: Error: EACCESS: permission denied, mkdir xxxx

A: Install **npm install node-sass --unsafe-perm** separately, then **npm install**

---

## Q: UI cannot log in normally.

A:   1, if it is node startup, check whether the .env API_BASE configuration under dolphinscheduler-ui is the Api Server service address.

​       2, If it is nginx booted and installed via **install-dolphinscheduler-ui.sh**, check if the proxy_pass      			configuration in **/etc/nginx/conf.d/dolphinscheduler.conf** is the Api Server service address

​       3, if the above configuration is correct, then please check if the Api Server service is normal,

​		   curl http://192.168.xx.xx:12345/dolphinscheduler/users/get-user-info, check the Api Server log,

​          if  Prompt cn.dolphinscheduler.api.interceptor.LoginHandlerInterceptor:[76] - session info is null,   		  which proves that the Api Server service is normal.

​	4, if there is no problem above, you need to check if **server.context-path and server.port configuration** in **application.properties** is correct

---

## Q: After the process definition is manually started or scheduled, no process instance is generated.

A:   1, first **check whether the MasterServer service exists through jps**, or directly check whether there is a master service in zk from the service monitoring.

​       2,If there is a master service, check **the command status statistics** or whether new records are added in **t_ds_error_command**. If it is added, **please check the message field.**

---

## Q : The task status is always in the successful submission status.

A:   1, **first check whether the WorkerServer service exists through jps**, or directly check whether there is a worker service in zk from the service monitoring.

​       2,If the **WorkerServer** service is normal, you need to **check whether the MasterServer puts the task task in the zk queue. You need to check whether the task is blocked in the MasterServer log and the zk queue.**

​       3, if there is no problem above, you need to locate whether the Worker group is specified, but **the machine grouped by the worker is not online**.

---

## Q: Is there a Docker image and a Dockerfile?

A: Provide Docker image and Dockerfile.

Docker image address: https://hub.docker.com/r/escheduler/escheduler_images

Dockerfile address: https://github.com/qiaozhanwei/escheduler_dockerfile/tree/master/docker_escheduler

---

## Q : Need to pay attention to the problem in install.sh

A:   1, if the replacement variable contains special characters, **use the \ transfer character to transfer**

​       2, installPath="/data1_1T/dolphinscheduler", **this directory can not be the same as the install.sh directory currently installed with one click.**

​       3, deployUser = "dolphinscheduler", **the deployment user must have sudo privileges**, because the worker is executed by sudo -u tenant sh xxx.command

​       4, monitorServerState = "false", whether the service monitoring script is started, the default is not to start the service monitoring script. **If the service monitoring script is started, the master and worker services are monitored every 5 minutes, and if the machine is down, it will automatically restart.**

​       5, hdfsStartupSate="false", whether to enable HDFS resource upload function. The default is not enabled. **If it is not enabled, the resource center cannot be used.** If enabled, you need to configure the configuration of fs.defaultFS and yarn in conf/common/hadoop/hadoop.properties. If you use namenode HA, you need to copy core-site.xml and hdfs-site.xml to the conf root directory.

​    Note: **The 1.0.x version does not automatically create the hdfs root directory, you need to create it yourself, and you need to deploy the user with hdfs operation permission.**

---

## Q : Process definition and process instance offline exception

A : For **versions prior to 1.0.4**, modify the code under the escheduler-api cn.escheduler.api.quartz package.

```
public boolean deleteJob(String jobName, String jobGroupName) {
    lock.writeLock().lock();
    try {
      JobKey jobKey = new JobKey(jobName,jobGroupName);
      if(scheduler.checkExists(jobKey)){
        logger.info("try to delete job, job name: {}, job group name: {},", jobName, jobGroupName);
        return scheduler.deleteJob(jobKey);
      }else {
        return true;
      }

    } catch (SchedulerException e) {
      logger.error(String.format("delete job : %s failed",jobName), e);
    } finally {
      lock.writeLock().unlock();
    }
    return false;
  }
```

---

## Q: Can the tenant created before the HDFS startup use the resource center normally?

A: No. Because the tenant created by HDFS is not started, the tenant directory will not be registered in HDFS. So the last resource will report an error.

---

## Q: In the multi-master and multi-worker state, the service is lost, how to be fault-tolerant

A: **Note:** **Master monitors Master and Worker services.**

​    1，If the Master service is lost, other Masters will take over the process of the hanged Master and continue to monitor the Worker task status.

​    2，If the Worker service is lost, the Master will monitor that the Worker service is gone. If there is a Yarn task, the Kill Yarn task will be retried.

Please see the fault-tolerant design in the architecture for details.

---

## Q : Fault tolerance for a machine distributed by Master and Worker

A: The 1.0.3 version only implements the fault tolerance of the Master startup process, and does not take the Worker Fault Tolerance. That is to say, if the Worker hangs, no Master exists. There will be problems with this process. We will add Master and Worker startup fault tolerance in version **1.1.0** to fix this problem. If you want to manually modify this problem, you need to **modify the running task for the running worker task that is running the process across the restart and has been dropped. The running process is set to the failed state across the restart**. Then resume the process from the failed node.

---

## Q : Timing is easy to set to execute every second

A : Note when setting the timing. If the first digit (* * * * * ? *) is set to *, it means execution every second. **We will add a list of recently scheduled times in version 1.1.0.** You can see the last 5 running times online at http://cron.qqe2.com/

---

## Q: Is there a valid time range for timing?

A: Yes, **if the timing start and end time is the same time, then this timing will be invalid timing. If the end time of the start and end time is smaller than the current time, it is very likely that the timing will be automatically deleted.**

---

## Q : There are several implementations of task dependencies

A:	1, the task dependency between **DAG**, is **from the zero degree** of the DAG segmentation

​		2, there are **task dependent nodes**, you can achieve cross-process tasks or process dependencies, please refer to the (DEPENDENT) node design in the system-manual.

​	Note: **Cross-project processes or task dependencies are not supported**

---

## Q: There are several ways to start the process definition.

A:   1, in **the process definition list**, click the **Start** button.

​       2, **the process definition list adds a timer**, scheduling start process definition.

​       3, process definition **view or edit** the DAG page, any **task node right click** Start process definition.

​       4, you can define DAG editing for the process, set the running flag of some tasks to **prohibit running**, when the process definition is started, the connection of the node will be removed from the DAG.

---

## Q : Python task setting Python version

A:	1，**for the version after 1.0.3** only need to modify PYTHON_HOME in conf/env/.dolphinscheduler_env.sh

```
export PYTHON_HOME=/bin/python
```

Note: This is **PYTHON_HOME** , which is the absolute path of the python command, not the simple PYTHON_HOME. Also note that when exporting the PATH, you need to directly

```
export PATH=$HADOOP_HOME/bin:$SPARK_HOME1/bin:$SPARK_HOME2/bin:$PYTHON_HOME:$JAVA_HOME/bin:$HIVE_HOME/bin:$PATH
```

​		2，For versions prior to 1.0.3, the Python task only supports the Python version of the system. It does not support specifying the Python version.

---

## Q：Worker Task will generate a child process through sudo -u tenant sh xxx.command, will kill when kill

A：  We will add the kill task in 1.0.4 and kill all the various child processes generated by the task.

---

## Q ： How to use the queue in DolphinScheduler, what does the user queue and tenant queue mean?

A ： The queue in the DolphinScheduler can be configured on the user or the tenant. **The priority of the queue specified by the user is higher than the priority of the tenant queue.** For example, to specify a queue for an MR task, the queue is specified by mapreduce.job.queuename.

Note: When using the above method to specify the queue, the MR uses the following methods:

```
	      Configuration conf = new Configuration();
        GenericOptionsParser optionParser = new GenericOptionsParser(conf, args);
        String[] remainingArgs = optionParser.getRemainingArgs();
```



If it is a Spark task --queue mode specifies the queue

---

## Q : Master or Worker reports the following alarm

<p align="center">
   <img src="https://analysys.github.io/easyscheduler_docs/images/master_worker_lack_res.png" width="60%" />
 </p>



A ： Change the value of master.properties **master.reserved.memory** under conf to a smaller value, say 0.1 or the value of worker.properties **worker.reserved.memory** is a smaller value, say 0.1

---

## Q: The hive version is 1.1.0+cdh5.15.0, and the SQL hive task connection is reported incorrectly.

<p align="center">
   <img src="https://analysys.github.io/easyscheduler_docs/images/cdh_hive_error.png" width="60%" />
 </p>


A ： Will hive pom

```
<dependency>
    <groupId>org.apache.hive</groupId>
    <artifactId>hive-jdbc</artifactId>
    <version>2.1.0</version>
</dependency>
```

change into

```
<dependency>
    <groupId>org.apache.hive</groupId>
    <artifactId>hive-jdbc</artifactId>
    <version>1.1.0</version>
</dependency>
```

---

## Q : how to add a worker server
A: 1, Create deployment user and hosts mapping, please refer 1.3 part of [cluster deployment](/en-us/docs/1.3.4/user_doc/cluster-deployment.html)

​		2, Configure hosts mapping and ssh access and modify directory permissions. please refer 1.4 part of [cluster deployment](/en-us/docs/1.3.4/user_doc/cluster-deployment.html)

​		3, Copy the deployment directory from worker server that has already deployed

​		4, Go to bin dir, then start worker server and logger server

        ```
        ./dolphinscheduler-daemon.sh start worker-server
        ./dolphinscheduler-daemon.sh start logger-server
        ```

---

## Q : When DolphinScheduler release a new version, and the change between current version and latest, and how to upgrade, and version number specification
A: 1, The release process of Apache Project happens in the mailing list. You can subscribe DolphinScheduler's mailing list and then when the release is in process, you'll receive release emails. Please follow this [introduction](https://github.com/apache/dolphinscheduler#get-help) to subscribe DolphinScheduler's mailing list.

2, When new version published, there would be release note which describe the change log, and there also have upgrade document for the previous version to new's.

3, Version number is x.y.z, when x is increased, it represents the version of the new architecture. When y is increased, it means that it is incompatible with the y version before it needs to be upgraded by script or other manual processing. When the z increase represents a bug fix, the upgrade is fully compatible. No additional processing is required. Remaining problem, the 1.0.2 upgrade is not compatible with 1.0.1 and requires an upgrade script.

---

## Q : Subsequent tasks can execute even front task failed
A: When start the workflow, you can set the task failure strategy: continue or failure.
![set task failure strategy](https://user-images.githubusercontent.com/15833811/80368215-ee378080-88be-11ea-9074-01a33d012b23.png)

---

## Q : Workflow template DAG, workflow instance, work task and what is the relationship among them? A DAG supports a maximum concurrency of 100, does it mean that 100 workflow instances are generated and run concurrently? A task node in a DAG also has a concurrent number configuration. Does it mean that tasks can run concurrently with multiple threads? Is the maximum number 100?
A:

1.2.1 version
```
master.properties
Control the max parallel number of master node workflows
master.exec.threads=100

Control the max number of parallel tasks in each workflow
master.exec.task.number=20

worker.properties
Control the max parallel number of worker node tasks
worker.exec.threads=100
```

---

## Q : Worker group manage page no buttons displayed
<p align="center">
   <img src="https://user-images.githubusercontent.com/39816903/81903776-d8cb9180-95f4-11ea-98cb-94ca1e6a1db5.png" width="60%" />
</p>
A: For version 1.3.0, we want to support k8s, while the ip always will be changed, so can't config on the UI, worker can config group name in the worker.properties.

---

## Q : Why not add mysql jdbc connector to docker image
A: The license of mysql jdbc connector is not compatible with apache v2 license, so it can't be included by docker image.

---

## Q : Allways fail when a task instance submit multiple yarn application
<p align="center">
   <img src="https://user-images.githubusercontent.com/16174111/81312485-476e9380-90b9-11ea-9aad-ed009db899b1.png" width="60%" />
 </p>
A： This bug have fix in dev and in Requirement/TODO list.

---

## Q : Master server and worker server stop abnormally after run for a few days
<p align="center">
   <img src="https://user-images.githubusercontent.com/18378986/81293969-c3101680-90a0-11ea-87e5-ac9f0dd53f5e.png" width="60%" />
 </p>
A: Session timeout is too short, only 0.3 seconds. Change the config item in zookeeper.properties:

```
   zookeeper.session.timeout=60000
   zookeeper.connection.timeout=30000
```

---

## Q : Started using the docker-compose default configuration and display zookeeper errors
<p align="center">
   <img src="https://user-images.githubusercontent.com/42579056/80374318-13c98780-88c9-11ea-8d5f-53448b957f02.png" width="60%" />
 </p>
A: This problem is solved in dev-1.3.0. This [pr](https://github.com/apache/dolphinscheduler/pull/2595) has solved this bug, brief change log:

```
    1. add zookeeper environment variable ZOO_4LW_COMMANDS_WHITELIST in docker-compose.yml file.
    2. change the data type of minLatency, avgLatency and maxLatency from int to float.
```

---

## Q : Interface show some task would be running all the time when db delayed and log show task instance is null
<p align="center">
   <img src="https://user-images.githubusercontent.com/51871547/80302626-b1478d00-87dd-11ea-97d4-08aa2244a6d0.jpg" width="60%" />
 </p>
<p align="center">
   <img src="https://user-images.githubusercontent.com/51871547/80302626-b1478d00-87dd-11ea-97d4-08aa2244a6d0.jpg" width="60%" />
 </p>

A: This [bug](https://github.com/apache/dolphinscheduler/issues/1477) describe the problem detail and it has been been solved in version 1.2.1.

For version under 1.2.1, some tips for this situation:

```
1. clear the task queue in zk for path: /dolphinscheduler/task_queue
2. change the state of the task to failed( integer value: 6).
3. run the work flow by recover from failed
```

---

## Q : Zookeeper masters znode list ip address is 127.0.0.1, instead of wanted ip eth0 or eth1, and may can't see task log
A: bug fix:
   ```
      1, confirm hostname
      $hostname
      hadoop1
      2, hostname -i
      127.0.0.1 10.3.57.15
      3, edit /etc/hosts,delete hadoop1 from 127.0.0.1 record
      $cat /etc/hosts
      127.0.0.1 localhost
      10.3.57.15 ds1 hadoop1
      4, hostname -i
      10.3.57.15
   ```   

   Hostname cmd return server hostname, hostname -i return all matched ips configured in /etc/hosts. So after I delete the hostname matched with 127.0.0.1, and only remain internal ip resolution, instead of remove all the 127.0.0.1 resolution record. As long as hostname cmd return the correct internal ip configured in /etc/hosts can fix this bug. DolphinScheduler use the first record returned by hostname -i command. In my opion, DS should not use hostname -i to get the ip , as in many companies the devops configured the server name, we suggest use ip configured in configuration file or znode instead of /etc/hosts.

---

## Q : The scheduling system set a second frequency task, causing the system to crash
A: The scheduling system not support second frequency task.

---

## Q : Compile front-end code(dolphinscheduler-ui) show error cannot download "https://github.com/sass/node-sass/releases/download/v4.13.1/darwin-x64-72_binding.node"
A: 1, cd dolphinscheduler-ui and delete node_modules directory
```
sudo rm -rf node_modules
```   
   ​	2, install node-sass through npm.taobao.org
 ```
 sudo npm uninstall node-sass
 sudo npm i node-sass --sass_binary_site=https://npm.taobao.org/mirrors/node-sass/
 ```
   3, if the 2nd step failure, please, [referer url](/en-us/docs/1.3.4/user_doc/frontend-development.html)
```
 sudo npm rebuild node-sass
 ```
When solved this problem, if you don't want to download this node every time, you can set system environment variable: SASS_BINARY_PATH= /xxx/xxx/xxx/xxx.node.

---

## Q : How to config when use mysql as database instead of postgres
A: 1, Edit project root dir maven config file, remove scope test property so that mysql driver can be loaded.
```
<dependency>
	<groupId>mysql</groupId>
	<artifactId>mysql-connector-java</artifactId>
	<version>${mysql.connector.version}</version>
	<scope>test<scope>
</dependency>
```   
   ​	2, Edit application-dao.properties and quzrtz.properties config file to use mysql driver.
   Default is postgresSql driver because of license problem.

---

## Q : How does a shell task run
A: 1, Where is the executed server? Specify one worker to run the task, you can create worker group in Security Center, then the task can be send to the particular worker. If a worker group have multiple servers, which server actually execute is determined by scheduling and has randomness.

   ​	2, If it is a shell file of a path on the server, how to point to the path? The server shell file, involving permissions issues, it is not recommended to do so. It is recommended that you use the storage function of the resource center, and then use the resource reference in the shell editor. The system will help you download the script to the execution directory. If the task dependent on resource center files, worker use "hdfs dfs -get" to get the resource files in HDFS, then run the task in /tmp/escheduler/exec/process, this path can be customized when installtion dolphinscheduler.

   3, Which user execute the task? Task is run by the tenant through "sudo -u ${tenant}", tenant is a linux user.

---

## Q : What’s the best deploy mode you suggest in production env
A: 1, I suggest you use 3 nodes for stability if you don't have too many tasks to run. And deploy Master/Worker server on different nodes is better. If you only have one node, you of course only can deploy them together! By the way, how many machines you need is determined by your business. The DolphinScheduler system itself does not use too many resources. Test more, and you'll find the right way to use a few machines.

---

## Q : DEPENDENT Task Node
A: 1, DEPENDENT task node actually does not have script, it used for config data cycle dependent logic, and then add task node after that to realize task cycle dependent.

---

## Q : How to change the boot port of the master
<p align="center">
   <img src="https://user-images.githubusercontent.com/8263441/62352160-0f3e9100-b53a-11e9-95ba-3ae3dde49c72.png" width="60%" />
 </p>
A: 1, modify application_master.properties, for example: server.port=12345.

---

## Q : Scheduled tasks cannot be online
A: 1, We can successly create scheduled task and add one record into t_scheduler_schedules table, but when I click online, front page no reaction and will lock table t_scheduler_schedules, and tested set field release_state value to 1 in table t_scheduler_schedules, and task display online state. For DS version above 1.2 table name is t_ds_schedules, other version table name is t_scheduler_schedules.

---

## Q : What is the address of swagger ui
A: 1, For version 1.2+ is http://apiServerIp:apiServerPort/dolphinscheduler/doc.html others is http://apiServerIp:apiServerPort/escheduler/doc.html.

---

## Q : Front-end installation package is missing files
<p align="center">
   <img src="https://user-images.githubusercontent.com/41460919/61437083-d960b080-a96e-11e9-87f1-297ba3aca5e3.png" width="60%" />
 </p>
 <p align="center">
    <img src="https://user-images.githubusercontent.com/41460919/61437218-1b89f200-a96f-11e9-8e48-3fac47eb2389.png" width="60%" />
  </p>

A: 1, User changed the config api server config file and item
 ![apiServerContextPath](https://user-images.githubusercontent.com/41460919/61678323-1b09a680-ad35-11e9-9707-3ba68bbc70d6.png), thus lead to the problem. After resume to the default value and problem solved.

---

## Q : Upload a relatively large file blocked
<p align="center">
   <img src="https://user-images.githubusercontent.com/21357069/58231400-805b0e80-7d69-11e9-8107-7f37b06a95df.png" width="60%" />
 </p>
A: 1, Edit ngnix config file, edit upload max size client_max_body_size 1024m.

   ​	2, the version of Google Chrome is old, and the latest version of the browser has been updated.


---

## Q : Create a spark data source, click "Test Connection", the system will fall back to the login page
A: 1, edit nginx config file /etc/nginx/conf.d/escheduler.conf
```
     proxy_connect_timeout 300s;
     proxy_read_timeout 300s;
     proxy_send_timeout 300s;
```

---

## Q : Welcome to subscribe the DolphinScheduler development mailing list
A: In the process of using DolphinScheduler, if you have any questions or ideas, suggestions, you can participate in the DolphinScheduler community building through the Apache mailing list. Sending a subscription email is also very simple, the steps are as follows:

1, Send an email to dev-subscribe@dolphinscheduler.apache.org with your own email address, subject and content.

2, Receive confirmation email and reply. After completing step 1, you will receive a confirmation email from dev-help@dolphinscheduler.apache.org (if not received, please confirm whether the email is automatically classified as spam, promotion email, subscription email, etc.) . Then reply directly to the email, or click on the link in the email to reply quickly, the subject and content are arbitrary.

3, Receive a welcome email. After completing the above steps, you will receive a welcome email with the subject WELCOME to dev@dolphinscheduler.apache.org, and you have successfully subscribed to the Apache DolphinScheduler mailing list.

---

## Q : Workflow Dependency
A: 1, It is currently judged according to natural days, at the end of last month: the judgment time is the workflow A start_time/scheduler_time between '2019-05-31 00:00:00' and '2019-05-31 23:59:59'. Last month: It is judged that there is an A instance completed every day from the 1st to the end of the month. Last week: There are completed A instances 7 days last week. The first two days: Judging yesterday and the day before yesterday, there must be a completed A instance for two days.

---

## Q : DS Backend Inteface Document
A: 1, http://106.75.43.194:8888/dolphinscheduler/doc.html?language=en.

## During the operation of dolphinscheduler, the ip address is obtained incorrectly

When the master service and worker service are registered with zookeeper, relevant information will be created in the form of ip:port

If the ip address is obtained incorrectly, please check the network information. For example, in the Linux system, use the `ifconfig` command to view the network information. The following figure is an example:

<p align="center">
  <img src="/img/network/network_config.png" width="60%" />
</p>

You can use the three strategies provided by dolphinscheduler to get the available ip:

* default: First using internal network card to obtain the IP address, and then using external network card. If all above fail, use the address of the first available network card
* inner: Use the internal network card to obtain the ip address, if fails thrown an exception.
* outer: Use the external network card to obtain the ip address, if fails thrown an exception.

Modify the configuration in `common.properties`:

```shell
# network IP gets priority, default: inner outer
# dolphin.scheduler.network.priority.strategy=default
```

After configuration is modified, restart the service to activation

If the ip address is still wrong, please download [dolphinscheduler-netutils.jar](/asset/dolphinscheduler-netutils.jar) to the machine, execute the following commands and feedback the output to the community developers:

```shell
java -jar target/dolphinscheduler-netutils.jar
```

## Configure sudo to be secret free, which is used to solve the problem of using the default configuration sudo authority to be too large or unable to apply for root authority

Configure the sudo permission of the dolphinscheduler account to be an ordinary user manager within the scope of some ordinary users, and restrict specified users to run certain commands on the specified host. For detailed configuration, please see sudo rights management
For example, sudo permission management configuration dolphinscheduler OS account can only operate the permissions of users userA, userB, userC (users userA, userB, and userC are used for multi-tenant submitting jobs to the big data cluster)

```shell
echo 'dolphinscheduler  ALL=(userA,userB,userC)  NOPASSWD: NOPASSWD: ALL' >> /etc/sudoers
sed -i 's/Defaults    requirett/#Defaults    requirett/g' /etc/sudoers
```

---

## About ds Kubernetes deployment related issues

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

List all stateful sets (aka `sts`):

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

> Because of the commercial license, we cannot directly use the driver of MySQL.
>
> If you want to use MySQL, you can build a new image based on the `apache/dolphinscheduler` image as follows.

1. Download the MySQL driver [mysql-connector-java-8.0.16.jar](https://repo1.maven.org/maven2/mysql/mysql-connector-java/8.0.16/mysql-connector-java-8.0.16.jar)

2. Create a new `Dockerfile` to add MySQL driver:

```
FROM dolphinscheduler.docker.scarf.sh/apache/dolphinscheduler:1.3.8
COPY mysql-connector-java-8.0.16.jar /opt/dolphinscheduler/lib
```

3. Build a new docker image including MySQL driver:

```
docker build -t apache/dolphinscheduler:mysql-driver .
```

4. Push the docker image `apache/dolphinscheduler:mysql-driver` to a docker registry

5. Modify image `repository` and update `tag` to `mysql-driver` in `values.yaml`

6. Modify postgresql `enabled` to `false` in `values.yaml`

7. Modify externalDatabase (especially modify `host`, `username` and `password`) in `values.yaml`:

```yaml
externalDatabase:
  type: "mysql"
  driver: "com.mysql.jdbc.Driver"
  host: "localhost"
  port: "3306"
  username: "root"
  password: "root"
  database: "dolphinscheduler"
  params: "useUnicode=true&characterEncoding=UTF-8"
```

8. Run a DolphinScheduler release in Kubernetes (See **Installing the Chart**)

### How to support MySQL datasource in `Datasource manage`?

> Because of the commercial license, we cannot directly use the driver of MySQL.
>
> If you want to add MySQL datasource, you can build a new image based on the `apache/dolphinscheduler` image as follows.

1. Download the MySQL driver [mysql-connector-java-8.0.16.jar](https://repo1.maven.org/maven2/mysql/mysql-connector-java/8.0.16/mysql-connector-java-8.0.16.jar)

2. Create a new `Dockerfile` to add MySQL driver:

```
FROM dolphinscheduler.docker.scarf.sh/apache/dolphinscheduler:1.3.8
COPY mysql-connector-java-8.0.16.jar /opt/dolphinscheduler/lib
```

3. Build a new docker image including MySQL driver:

```
docker build -t apache/dolphinscheduler:mysql-driver .
```

4. Push the docker image `apache/dolphinscheduler:mysql-driver` to a docker registry

5. Modify image `repository` and update `tag` to `mysql-driver` in `values.yaml`

6. Run a DolphinScheduler release in Kubernetes (See **Installing the Chart**)

7. Add a MySQL datasource in `Datasource manage`

### How to support Oracle datasource in `Datasource manage`?

> Because of the commercial license, we cannot directly use the driver of Oracle.
>
> If you want to add Oracle datasource, you can build a new image based on the `apache/dolphinscheduler` image as follows.

1. Download the Oracle driver [ojdbc8.jar](https://repo1.maven.org/maven2/com/oracle/database/jdbc/ojdbc8/) (such as `ojdbc8-19.9.0.0.jar`)

2. Create a new `Dockerfile` to add Oracle driver:

```
FROM dolphinscheduler.docker.scarf.sh/apache/dolphinscheduler:1.3.8
COPY ojdbc8-19.9.0.0.jar /opt/dolphinscheduler/lib
```

3. Build a new docker image including Oracle driver:

```
docker build -t apache/dolphinscheduler:oracle-driver .
```

4. Push the docker image `apache/dolphinscheduler:oracle-driver` to a docker registry

5. Modify image `repository` and update `tag` to `oracle-driver` in `values.yaml`

6. Run a DolphinScheduler release in Kubernetes (See **Installing the Chart**)

7. Add an Oracle datasource in `Datasource manage`

### How to support Python 2 pip and custom requirements.txt?

1. Create a new `Dockerfile` to install pip:

```
FROM dolphinscheduler.docker.scarf.sh/apache/dolphinscheduler:1.3.8
COPY requirements.txt /tmp
RUN apt-get update && \
    apt-get install -y --no-install-recommends python-pip && \
    pip install --no-cache-dir -r /tmp/requirements.txt && \
    rm -rf /var/lib/apt/lists/*
```

The command will install the default **pip 18.1**. If you upgrade the pip, just add one line

```
    pip install --no-cache-dir -U pip && \
```

2. Build a new docker image including pip:

```
docker build -t apache/dolphinscheduler:pip .
```

3. Push the docker image `apache/dolphinscheduler:pip` to a docker registry

4. Modify image `repository` and update `tag` to `pip` in `values.yaml`

5. Run a DolphinScheduler release in Kubernetes (See **Installing the Chart**)

6. Verify pip under a new Python task

### How to support Python 3?

1. Create a new `Dockerfile` to install Python 3:

```
FROM dolphinscheduler.docker.scarf.sh/apache/dolphinscheduler:1.3.8
RUN apt-get update && \
    apt-get install -y --no-install-recommends python3 && \
    rm -rf /var/lib/apt/lists/*
```

The command will install the default **Python 3.7.3**. If you also want to install **pip3**, just replace `python3` with `python3-pip` like

```
    apt-get install -y --no-install-recommends python3-pip && \
```

2. Build a new docker image including Python 3:

```
docker build -t apache/dolphinscheduler:python3 .
```

3. Push the docker image `apache/dolphinscheduler:python3` to a docker registry

4. Modify image `repository` and update `tag` to `python3` in `values.yaml`

5. Modify `PYTHON_HOME` to `/usr/bin/python3` in `values.yaml`

6. Run a DolphinScheduler release in Kubernetes (See **Installing the Chart**)

7. Verify Python 3 under a new Python task

### How to support Hadoop, Spark, Flink, Hive or DataX?

Take Spark 2.4.7 as an example:

1. Download the Spark 2.4.7 release binary `spark-2.4.7-bin-hadoop2.7.tgz`

2. Ensure that `common.sharedStoragePersistence.enabled` is turned on

3. Run a DolphinScheduler release in Kubernetes (See **Installing the Chart**)

4. Copy the Spark 2.4.7 release binary into the Docker container

```bash
kubectl cp spark-2.4.7-bin-hadoop2.7.tgz dolphinscheduler-worker-0:/opt/soft
kubectl cp -n test spark-2.4.7-bin-hadoop2.7.tgz dolphinscheduler-worker-0:/opt/soft # with test namespace
```

Because the volume `sharedStoragePersistence` is mounted on `/opt/soft`, all files in `/opt/soft` will not be lost

5. Attach the container and ensure that `SPARK_HOME2` exists

```bash
kubectl exec -it dolphinscheduler-worker-0 bash
kubectl exec -n test -it dolphinscheduler-worker-0 bash # with test namespace
cd /opt/soft
tar zxf spark-2.4.7-bin-hadoop2.7.tgz
rm -f spark-2.4.7-bin-hadoop2.7.tgz
ln -s spark-2.4.7-bin-hadoop2.7 spark2 # or just mv
$SPARK_HOME2/bin/spark-submit --version
```

The last command will print the Spark version if everything goes well

6. Verify Spark under a Shell task

```
$SPARK_HOME2/bin/spark-submit --class org.apache.spark.examples.SparkPi $SPARK_HOME2/examples/jars/spark-examples_2.11-2.4.7.jar
```

Check whether the task log contains the output like `Pi is roughly 3.146015`

7. Verify Spark under a Spark task

The file `spark-examples_2.11-2.4.7.jar` needs to be uploaded to the resources first, and then create a Spark task with:

- Spark Version: `SPARK2`
- Main Class: `org.apache.spark.examples.SparkPi`
- Main Package: `spark-examples_2.11-2.4.7.jar`
- Deploy Mode: `local`

Similarly, check whether the task log contains the output like `Pi is roughly 3.146015`

8. Verify Spark on YARN

Spark on YARN (Deploy Mode is `cluster` or `client`) requires Hadoop support. Similar to Spark support, the operation of supporting Hadoop is almost the same as the previous steps

Ensure that `$HADOOP_HOME` and `$HADOOP_CONF_DIR` exists

### How to support Spark 3?

In fact, the way to submit applications with `spark-submit` is the same, regardless of Spark 1, 2 or 3. In other words, the semantics of `SPARK_HOME2` is the second `SPARK_HOME` instead of `SPARK2`'s `HOME`, so just set `SPARK_HOME2=/path/to/spark3`

Take Spark 3.1.1 as an example:

1. Download the Spark 3.1.1 release binary `spark-3.1.1-bin-hadoop2.7.tgz`

2. Ensure that `common.sharedStoragePersistence.enabled` is turned on

3. Run a DolphinScheduler release in Kubernetes (See **Installing the Chart**)

4. Copy the Spark 3.1.1 release binary into the Docker container

```bash
kubectl cp spark-3.1.1-bin-hadoop2.7.tgz dolphinscheduler-worker-0:/opt/soft
kubectl cp -n test spark-3.1.1-bin-hadoop2.7.tgz dolphinscheduler-worker-0:/opt/soft # with test namespace
```

5. Attach the container and ensure that `SPARK_HOME2` exists

```bash
kubectl exec -it dolphinscheduler-worker-0 bash
kubectl exec -n test -it dolphinscheduler-worker-0 bash # with test namespace
cd /opt/soft
tar zxf spark-3.1.1-bin-hadoop2.7.tgz
rm -f spark-3.1.1-bin-hadoop2.7.tgz
ln -s spark-3.1.1-bin-hadoop2.7 spark2 # or just mv
$SPARK_HOME2/bin/spark-submit --version
```

The last command will print the Spark version if everything goes well

6. Verify Spark under a Shell task

```
$SPARK_HOME2/bin/spark-submit --class org.apache.spark.examples.SparkPi $SPARK_HOME2/examples/jars/spark-examples_2.12-3.1.1.jar
```

Check whether the task log contains the output like `Pi is roughly 3.146015`

### How to support shared storage between Master, Worker and Api server?

For example, Master, Worker and API server may use Hadoop at the same time

1. Modify the following configurations in `values.yaml`

```yaml
common:
  sharedStoragePersistence:
    enabled: false
    mountPath: "/opt/soft"
    accessModes:
    - "ReadWriteMany"
    storageClassName: "-"
    storage: "20Gi"
```

`storageClassName` and `storage` need to be modified to actual values

> **Note**: `storageClassName` must support the access mode: `ReadWriteMany`

2. Copy the Hadoop into the directory `/opt/soft`

3. Ensure that `$HADOOP_HOME` and `$HADOOP_CONF_DIR` are correct

### How to support local file resource storage instead of HDFS and S3?

Modify the following configurations in `values.yaml`

```yaml
common:
  configmap:
    RESOURCE_STORAGE_TYPE: "HDFS"
    RESOURCE_UPLOAD_PATH: "/dolphinscheduler"
    FS_DEFAULT_FS: "file:///"
  fsFileResourcePersistence:
    enabled: true
    accessModes:
    - "ReadWriteMany"
    storageClassName: "-"
    storage: "20Gi"
```

`storageClassName` and `storage` need to be modified to actual values

> **Note**: `storageClassName` must support the access mode: `ReadWriteMany`

### How to support S3 resource storage like MinIO?

Take MinIO as an example: Modify the following configurations in `values.yaml`

```yaml
common:
  configmap:
    RESOURCE_STORAGE_TYPE: "S3"
    RESOURCE_UPLOAD_PATH: "/dolphinscheduler"
    FS_DEFAULT_FS: "s3a://BUCKET_NAME"
    FS_S3A_ENDPOINT: "http://MINIO_IP:9000"
    FS_S3A_ACCESS_KEY: "MINIO_ACCESS_KEY"
    FS_S3A_SECRET_KEY: "MINIO_SECRET_KEY"
```

`BUCKET_NAME`, `MINIO_IP`, `MINIO_ACCESS_KEY` and `MINIO_SECRET_KEY` need to be modified to actual values

> **Note**: `MINIO_IP` can only use IP instead of domain name, because DolphinScheduler currently doesn't support S3 path style access

### How to configure SkyWalking?

Modify SKYWALKING configurations in `values.yaml`:

```yaml
common:
  configmap:
    SKYWALKING_ENABLE: "true"
    SW_AGENT_COLLECTOR_BACKEND_SERVICES: "127.0.0.1:11800"
    SW_GRPC_LOG_SERVER_HOST: "127.0.0.1"
    SW_GRPC_LOG_SERVER_PORT: "11800"
```

## Appendix-Configuration

| Parameter                                                                         | Description                                                                                                                    | Default                                               |
| --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------- |
| `timezone`                                                                        | World time and date for cities in all time zones                                                                               | `Asia/Shanghai`                                       |
|                                                                                   |                                                                                                                                |                                                       |
| `image.repository`                                                                | Docker image repository for the DolphinScheduler                                                                               | `apache/dolphinscheduler`                             |
| `image.tag`                                                                       | Docker image version for the DolphinScheduler                                                                                  | `latest`                                              |
| `image.pullPolicy`                                                                | Image pull policy. One of Always, Never, IfNotPresent                                                                          | `IfNotPresent`                                        |
| `image.pullSecret`                                                                | Image pull secret. An optional reference to secret in the same namespace to use for pulling any of the images                  | `nil`                                                 |
|                                                                                   |                                                                                                                                |                                                       |
| `postgresql.enabled`                                                              | If not exists external PostgreSQL, by default, the DolphinScheduler will use a internal PostgreSQL                             | `true`                                                |
| `postgresql.postgresqlUsername`                                                   | The username for internal PostgreSQL                                                                                           | `root`                                                |
| `postgresql.postgresqlPassword`                                                   | The password for internal PostgreSQL                                                                                           | `root`                                                |
| `postgresql.postgresqlDatabase`                                                   | The database for internal PostgreSQL                                                                                           | `dolphinscheduler`                                    |
| `postgresql.persistence.enabled`                                                  | Set `postgresql.persistence.enabled` to `true` to mount a new volume for internal PostgreSQL                                   | `false`                                               |
| `postgresql.persistence.size`                                                     | `PersistentVolumeClaim` size                                                                                                   | `20Gi`                                                |
| `postgresql.persistence.storageClass`                                             | PostgreSQL data persistent volume storage class. If set to "-", storageClassName: "", which disables dynamic provisioning      | `-`                                                   |
| `externalDatabase.type`                                                           | If exists external PostgreSQL, and set `postgresql.enabled` value to false. DolphinScheduler's database type will use it       | `postgresql`                                          |
| `externalDatabase.driver`                                                         | If exists external PostgreSQL, and set `postgresql.enabled` value to false. DolphinScheduler's database driver will use it     | `org.postgresql.Driver`                               |
| `externalDatabase.host`                                                           | If exists external PostgreSQL, and set `postgresql.enabled` value to false. DolphinScheduler's database host will use it       | `localhost`                                           |
| `externalDatabase.port`                                                           | If exists external PostgreSQL, and set `postgresql.enabled` value to false. DolphinScheduler's database port will use it       | `5432`                                                |
| `externalDatabase.username`                                                       | If exists external PostgreSQL, and set `postgresql.enabled` value to false. DolphinScheduler's database username will use it   | `root`                                                |
| `externalDatabase.password`                                                       | If exists external PostgreSQL, and set `postgresql.enabled` value to false. DolphinScheduler's database password will use it   | `root`                                                |
| `externalDatabase.database`                                                       | If exists external PostgreSQL, and set `postgresql.enabled` value to false. DolphinScheduler's database database will use it   | `dolphinscheduler`                                    |
| `externalDatabase.params`                                                         | If exists external PostgreSQL, and set `postgresql.enabled` value to false. DolphinScheduler's database params will use it     | `characterEncoding=utf8`                              |
|                                                                                   |                                                                                                                                |                                                       |
| `zookeeper.enabled`                                                               | If not exists external Zookeeper, by default, the DolphinScheduler will use a internal Zookeeper                               | `true`                                                |
| `zookeeper.fourlwCommandsWhitelist`                                               | A list of comma separated Four Letter Words commands to use                                                                    | `srvr,ruok,wchs,cons`                                 |
| `zookeeper.persistence.enabled`                                                   | Set `zookeeper.persistence.enabled` to `true` to mount a new volume for internal Zookeeper                                     | `false`                                               |
| `zookeeper.persistence.size`                                                      | `PersistentVolumeClaim` size                                                                                                   | `20Gi`                                                |
| `zookeeper.persistence.storageClass`                                              | Zookeeper data persistent volume storage class. If set to "-", storageClassName: "", which disables dynamic provisioning       | `-`                                                   |
| `zookeeper.zookeeperRoot`                                                         | Specify dolphinscheduler root directory in Zookeeper                                                                           | `/dolphinscheduler`                                   |
| `externalZookeeper.zookeeperQuorum`                                               | If exists external Zookeeper, and set `zookeeper.enabled` value to false. Specify Zookeeper quorum                             | `127.0.0.1:2181`                                      |
| `externalZookeeper.zookeeperRoot`                                                 | If exists external Zookeeper, and set `zookeeper.enabled` value to false. Specify dolphinscheduler root directory in Zookeeper | `/dolphinscheduler`                                   |
|                                                                                   |                                                                                                                                |                                                       |
| `common.configmap.DOLPHINSCHEDULER_OPTS`                                          | The jvm options for dolphinscheduler, suitable for all servers                                                                 | `""`                                                  |
| `common.configmap.DATA_BASEDIR_PATH`                                              | User data directory path, self configuration, please make sure the directory exists and have read write permissions            | `/tmp/dolphinscheduler`                               |
| `common.configmap.RESOURCE_STORAGE_TYPE`                                          | Resource storage type: HDFS, S3, NONE                                                                                          | `HDFS`                                                |
| `common.configmap.RESOURCE_UPLOAD_PATH`                                           | Resource store on HDFS/S3 path, please make sure the directory exists on hdfs and have read write permissions                  | `/dolphinscheduler`                                   |
| `common.configmap.FS_DEFAULT_FS`                                                  | Resource storage file system like `file:///`, `hdfs://mycluster:8020` or `s3a://dolphinscheduler`                              | `file:///`                                            |
| `common.configmap.FS_S3A_ENDPOINT`                                                | S3 endpoint when `common.configmap.RESOURCE_STORAGE_TYPE` is set to `S3`                                                       | `s3.xxx.amazonaws.com`                                |
| `common.configmap.FS_S3A_ACCESS_KEY`                                              | S3 access key when `common.configmap.RESOURCE_STORAGE_TYPE` is set to `S3`                                                     | `xxxxxxx`                                             |
| `common.configmap.FS_S3A_SECRET_KEY`                                              | S3 secret key when `common.configmap.RESOURCE_STORAGE_TYPE` is set to `S3`                                                     | `xxxxxxx`                                             |
| `common.configmap.HADOOP_SECURITY_AUTHENTICATION_STARTUP_STATE`                   | Whether to startup kerberos                                                                                                    | `false`                                               |
| `common.configmap.JAVA_SECURITY_KRB5_CONF_PATH`                                   | The java.security.krb5.conf path                                                                                               | `/opt/krb5.conf`                                      |
| `common.configmap.LOGIN_USER_KEYTAB_USERNAME`                                     | The login user from keytab username                                                                                            | `hdfs@HADOOP.COM`                                     |
| `common.configmap.LOGIN_USER_KEYTAB_PATH`                                         | The login user from keytab path                                                                                                | `/opt/hdfs.keytab`                                    |
| `common.configmap.KERBEROS_EXPIRE_TIME`                                           | The kerberos expire time, the unit is hour                                                                                     | `2`                                                   |
| `common.configmap.HDFS_ROOT_USER`                                                 | The HDFS root user who must have the permission to create directories under the HDFS root path                                 | `hdfs`                                                |
| `common.configmap.RESOURCE_MANAGER_HTTPADDRESS_PORT`                              | Set resource manager httpaddress port for yarn                                                                                 | `8088`                                                |
| `common.configmap.YARN_RESOURCEMANAGER_HA_RM_IDS`                                 | If resourcemanager HA is enabled, please set the HA IPs                                                                        | `nil`                                                 |
| `common.configmap.YARN_APPLICATION_STATUS_ADDRESS`                                | If resourcemanager is single, you only need to replace ds1 to actual resourcemanager hostname, otherwise keep default          | `http://ds1:%s/ws/v1/cluster/apps/%s`               |
| `common.configmap.SKYWALKING_ENABLE`                                              | Set whether to enable skywalking                                                                                               | `false`                                               |
| `common.configmap.SW_AGENT_COLLECTOR_BACKEND_SERVICES`                            | Set agent collector backend services for skywalking                                                                            | `127.0.0.1:11800`                                     |
| `common.configmap.SW_GRPC_LOG_SERVER_HOST`                                        | Set grpc log server host for skywalking                                                                                        | `127.0.0.1`                                           |
| `common.configmap.SW_GRPC_LOG_SERVER_PORT`                                        | Set grpc log server port for skywalking                                                                                        | `11800`                                               |
| `common.configmap.HADOOP_HOME`                                                    | Set `HADOOP_HOME` for DolphinScheduler's task environment                                                                      | `/opt/soft/hadoop`                                    |
| `common.configmap.HADOOP_CONF_DIR`                                                | Set `HADOOP_CONF_DIR` for DolphinScheduler's task environment                                                                  | `/opt/soft/hadoop/etc/hadoop`                         |
| `common.configmap.SPARK_HOME1`                                                    | Set `SPARK_HOME1` for DolphinScheduler's task environment                                                                      | `/opt/soft/spark1`                                    |
| `common.configmap.SPARK_HOME2`                                                    | Set `SPARK_HOME2` for DolphinScheduler's task environment                                                                      | `/opt/soft/spark2`                                    |
| `common.configmap.PYTHON_HOME`                                                    | Set `PYTHON_HOME` for DolphinScheduler's task environment                                                                      | `/usr/bin/python`                                     |
| `common.configmap.JAVA_HOME`                                                      | Set `JAVA_HOME` for DolphinScheduler's task environment                                                                        | `/usr/local/openjdk-8`                                |
| `common.configmap.HIVE_HOME`                                                      | Set `HIVE_HOME` for DolphinScheduler's task environment                                                                        | `/opt/soft/hive`                                      |
| `common.configmap.FLINK_HOME`                                                     | Set `FLINK_HOME` for DolphinScheduler's task environment                                                                       | `/opt/soft/flink`                                     |
| `common.configmap.DATAX_HOME`                                                     | Set `DATAX_HOME` for DolphinScheduler's task environment                                                                       | `/opt/soft/datax`                                     |
| `common.sharedStoragePersistence.enabled`                                         | Set `common.sharedStoragePersistence.enabled` to `true` to mount a shared storage volume for Hadoop, Spark binary and etc      | `false`                                               |
| `common.sharedStoragePersistence.mountPath`                                       | The mount path for the shared storage volume                                                                                   | `/opt/soft`                                           |
| `common.sharedStoragePersistence.accessModes`                                     | `PersistentVolumeClaim` access modes, must be `ReadWriteMany`                                                                  | `[ReadWriteMany]`                                     |
| `common.sharedStoragePersistence.storageClassName`                                | Shared Storage persistent volume storage class, must support the access mode: ReadWriteMany                                    | `-`                                                   |
| `common.sharedStoragePersistence.storage`                                         | `PersistentVolumeClaim` size                                                                                                   | `20Gi`                                                |
| `common.fsFileResourcePersistence.enabled`                                        | Set `common.fsFileResourcePersistence.enabled` to `true` to mount a new file resource volume for `api` and `worker`            | `false`                                               |
| `common.fsFileResourcePersistence.accessModes`                                    | `PersistentVolumeClaim` access modes, must be `ReadWriteMany`                                                                  | `[ReadWriteMany]`                                     |
| `common.fsFileResourcePersistence.storageClassName`                               | Resource persistent volume storage class, must support the access mode: ReadWriteMany                                          | `-`                                                   |
| `common.fsFileResourcePersistence.storage`                                        | `PersistentVolumeClaim` size                                                                                                   | `20Gi`                                                |
|                                                                                   |                                                                                                                                |                                                       |
| `master.podManagementPolicy`                                                      | PodManagementPolicy controls how pods are created during initial scale up, when replacing pods on nodes, or when scaling down  | `Parallel`                                            |
| `master.replicas`                                                                 | Replicas is the desired number of replicas of the given Template                                                               | `3`                                                   |
| `master.annotations`                                                              | The `annotations` for master server                                                                                            | `{}`                                                  |
| `master.affinity`                                                                 | If specified, the pod's scheduling constraints                                                                                 | `{}`                                                  |
| `master.nodeSelector`                                                             | NodeSelector is a selector which must be true for the pod to fit on a node                                                     | `{}`                                                  |
| `master.tolerations`                                                              | If specified, the pod's tolerations                                                                                            | `{}`                                                  |
| `master.resources`                                                                | The `resource` limit and request config for master server                                                                      | `{}`                                                  |
| `master.configmap.MASTER_SERVER_OPTS`                                             | The jvm options for master server                                                                                              | `-Xms1g -Xmx1g -Xmn512m`                              |
| `master.configmap.MASTER_EXEC_THREADS`                                            | Master execute thread number to limit process instances                                                                        | `100`                                                 |
| `master.configmap.MASTER_EXEC_TASK_NUM`                                           | Master execute task number in parallel per process instance                                                                    | `20`                                                  |
| `master.configmap.MASTER_DISPATCH_TASK_NUM`                                       | Master dispatch task number per batch                                                                                          | `3`                                                   |
| `master.configmap.MASTER_HOST_SELECTOR`                                           | Master host selector to select a suitable worker, optional values include Random, RoundRobin, LowerWeight                      | `LowerWeight`                                         |
| `master.configmap.MASTER_HEARTBEAT_INTERVAL`                                      | Master heartbeat interval, the unit is second                                                                                  | `10`                                                  |
| `master.configmap.MASTER_TASK_COMMIT_RETRYTIMES`                                  | Master commit task retry times                                                                                                 | `5`                                                   |
| `master.configmap.MASTER_TASK_COMMIT_INTERVAL`                                    | master commit task interval, the unit is second                                                                                | `1`                                                   |
| `master.configmap.MASTER_MAX_CPULOAD_AVG`                                         | Master max cpuload avg, only higher than the system cpu load average, master server can schedule                               | `-1` (`the number of cpu cores * 2`)                  |
| `master.configmap.MASTER_RESERVED_MEMORY`                                         | Master reserved memory, only lower than system available memory, master server can schedule, the unit is G                     | `0.3`                                                 |
| `master.livenessProbe.enabled`                                                    | Turn on and off liveness probe                                                                                                 | `true`                                                |
| `master.livenessProbe.initialDelaySeconds`                                        | Delay before liveness probe is initiated                                                                                       | `30`                                                  |
| `master.livenessProbe.periodSeconds`                                              | How often to perform the probe                                                                                                 | `30`                                                  |
| `master.livenessProbe.timeoutSeconds`                                             | When the probe times out                                                                                                       | `5`                                                   |
| `master.livenessProbe.failureThreshold`                                           | Minimum consecutive successes for the probe                                                                                    | `3`                                                   |
| `master.livenessProbe.successThreshold`                                           | Minimum consecutive failures for the probe                                                                                     | `1`                                                   |
| `master.readinessProbe.enabled`                                                   | Turn on and off readiness probe                                                                                                | `true`                                                |
| `master.readinessProbe.initialDelaySeconds`                                       | Delay before readiness probe is initiated                                                                                      | `30`                                                  |
| `master.readinessProbe.periodSeconds`                                             | How often to perform the probe                                                                                                 | `30`                                                  |
| `master.readinessProbe.timeoutSeconds`                                            | When the probe times out                                                                                                       | `5`                                                   |
| `master.readinessProbe.failureThreshold`                                          | Minimum consecutive successes for the probe                                                                                    | `3`                                                   |
| `master.readinessProbe.successThreshold`                                          | Minimum consecutive failures for the probe                                                                                     | `1`                                                   |
| `master.persistentVolumeClaim.enabled`                                            | Set `master.persistentVolumeClaim.enabled` to `true` to mount a new volume for `master`                                        | `false`                                               |
| `master.persistentVolumeClaim.accessModes`                                        | `PersistentVolumeClaim` access modes                                                                                           | `[ReadWriteOnce]`                                     |
| `master.persistentVolumeClaim.storageClassName`                                   | `Master` logs data persistent volume storage class. If set to "-", storageClassName: "", which disables dynamic provisioning   | `-`                                                   |
| `master.persistentVolumeClaim.storage`                                            | `PersistentVolumeClaim` size                                                                                                   | `20Gi`                                                |
|                                                                                   |                                                                                                                                |                                                       |
| `worker.podManagementPolicy`                                                      | PodManagementPolicy controls how pods are created during initial scale up, when replacing pods on nodes, or when scaling down  | `Parallel`                                            |
| `worker.replicas`                                                                 | Replicas is the desired number of replicas of the given Template                                                               | `3`                                                   |
| `worker.annotations`                                                              | The `annotations` for worker server                                                                                            | `{}`                                                  |
| `worker.affinity`                                                                 | If specified, the pod's scheduling constraints                                                                                 | `{}`                                                  |
| `worker.nodeSelector`                                                             | NodeSelector is a selector which must be true for the pod to fit on a node                                                     | `{}`                                                  |
| `worker.tolerations`                                                              | If specified, the pod's tolerations                                                                                            | `{}`                                                  |
| `worker.resources`                                                                | The `resource` limit and request config for worker server                                                                      | `{}`                                                  |
| `worker.configmap.WORKER_SERVER_OPTS`                                             | The jvm options for worker server                                                                                              | `-Xms1g -Xmx1g -Xmn512m`                              |
| `worker.configmap.WORKER_EXEC_THREADS`                                            | Worker execute thread number to limit task instances                                                                           | `100`                                                 |
| `worker.configmap.WORKER_HEARTBEAT_INTERVAL`                                      | Worker heartbeat interval, the unit is second                                                                                  | `10`                                                  |
| `worker.configmap.WORKER_MAX_CPULOAD_AVG`                                         | Worker max cpuload avg, only higher than the system cpu load average, worker server can be dispatched tasks                    | `-1` (`the number of cpu cores * 2`)                  |
| `worker.configmap.WORKER_RESERVED_MEMORY`                                         | Worker reserved memory, only lower than system available memory, worker server can be dispatched tasks, the unit is G          | `0.3`                                                 |
| `worker.configmap.WORKER_GROUPS`                                                  | Worker groups                                                                                                                  | `default`                                             |
| `worker.livenessProbe.enabled`                                                    | Turn on and off liveness probe                                                                                                 | `true`                                                |
| `worker.livenessProbe.initialDelaySeconds`                                        | Delay before liveness probe is initiated                                                                                       | `30`                                                  |
| `worker.livenessProbe.periodSeconds`                                              | How often to perform the probe                                                                                                 | `30`                                                  |
| `worker.livenessProbe.timeoutSeconds`                                             | When the probe times out                                                                                                       | `5`                                                   |
| `worker.livenessProbe.failureThreshold`                                           | Minimum consecutive successes for the probe                                                                                    | `3`                                                   |
| `worker.livenessProbe.successThreshold`                                           | Minimum consecutive failures for the probe                                                                                     | `1`                                                   |
| `worker.readinessProbe.enabled`                                                   | Turn on and off readiness probe                                                                                                | `true`                                                |
| `worker.readinessProbe.initialDelaySeconds`                                       | Delay before readiness probe is initiated                                                                                      | `30`                                                  |
| `worker.readinessProbe.periodSeconds`                                             | How often to perform the probe                                                                                                 | `30`                                                  |
| `worker.readinessProbe.timeoutSeconds`                                            | When the probe times out                                                                                                       | `5`                                                   |
| `worker.readinessProbe.failureThreshold`                                          | Minimum consecutive successes for the probe                                                                                    | `3`                                                   |
| `worker.readinessProbe.successThreshold`                                          | Minimum consecutive failures for the probe                                                                                     | `1`                                                   |
| `worker.persistentVolumeClaim.enabled`                                            | Set `worker.persistentVolumeClaim.enabled` to `true` to enable `persistentVolumeClaim` for `worker`                            | `false`                                               |
| `worker.persistentVolumeClaim.dataPersistentVolume.enabled`                       | Set `worker.persistentVolumeClaim.dataPersistentVolume.enabled` to `true` to mount a data volume for `worker`                  | `false`                                               |
| `worker.persistentVolumeClaim.dataPersistentVolume.accessModes`                   | `PersistentVolumeClaim` access modes                                                                                           | `[ReadWriteOnce]`                                     |
| `worker.persistentVolumeClaim.dataPersistentVolume.storageClassName`              | `Worker` data persistent volume storage class. If set to "-", storageClassName: "", which disables dynamic provisioning        | `-`                                                   |
| `worker.persistentVolumeClaim.dataPersistentVolume.storage`                       | `PersistentVolumeClaim` size                                                                                                   | `20Gi`                                                |
| `worker.persistentVolumeClaim.logsPersistentVolume.enabled`                       | Set `worker.persistentVolumeClaim.logsPersistentVolume.enabled` to `true` to mount a logs volume for `worker`                  | `false`                                               |
| `worker.persistentVolumeClaim.logsPersistentVolume.accessModes`                   | `PersistentVolumeClaim` access modes                                                                                           | `[ReadWriteOnce]`                                     |
| `worker.persistentVolumeClaim.logsPersistentVolume.storageClassName`              | `Worker` logs data persistent volume storage class. If set to "-", storageClassName: "", which disables dynamic provisioning   | `-`                                                   |
| `worker.persistentVolumeClaim.logsPersistentVolume.storage`                       | `PersistentVolumeClaim` size                                                                                                   | `20Gi`                                                |
|                                                                                   |                                                                                                                                |                                                       |
| `alert.replicas`                                                                  | Replicas is the desired number of replicas of the given Template                                                               | `1`                                                   |
| `alert.strategy.type`                                                             | Type of deployment. Can be "Recreate" or "RollingUpdate"                                                                       | `RollingUpdate`                                       |
| `alert.strategy.rollingUpdate.maxSurge`                                           | The maximum number of pods that can be scheduled above the desired number of pods                                              | `25%`                                                 |
| `alert.strategy.rollingUpdate.maxUnavailable`                                     | The maximum number of pods that can be unavailable during the update                                                           | `25%`                                                 |
| `alert.annotations`                                                               | The `annotations` for alert server                                                                                             | `{}`                                                  |
| `alert.affinity`                                                                  | If specified, the pod's scheduling constraints                                                                                 | `{}`                                                  |
| `alert.nodeSelector`                                                              | NodeSelector is a selector which must be true for the pod to fit on a node                                                     | `{}`                                                  |
| `alert.tolerations`                                                               | If specified, the pod's tolerations                                                                                            | `{}`                                                  |
| `alert.resources`                                                                 | The `resource` limit and request config for alert server                                                                       | `{}`                                                  |
| `alert.configmap.ALERT_SERVER_OPTS`                                               | The jvm options for alert server                                                                                               | `-Xms512m -Xmx512m -Xmn256m`                          |
| `alert.configmap.XLS_FILE_PATH`                                                   | XLS file path                                                                                                                  | `/tmp/xls`                                            |
| `alert.configmap.MAIL_SERVER_HOST`                                                | Mail `SERVER HOST `                                                                                                            | `nil`                                                 |
| `alert.configmap.MAIL_SERVER_PORT`                                                | Mail `SERVER PORT`                                                                                                             | `nil`                                                 |
| `alert.configmap.MAIL_SENDER`                                                     | Mail `SENDER`                                                                                                                  | `nil`                                                 |
| `alert.configmap.MAIL_USER`                                                       | Mail `USER`                                                                                                                    | `nil`                                                 |
| `alert.configmap.MAIL_PASSWD`                                                     | Mail `PASSWORD`                                                                                                                | `nil`                                                 |
| `alert.configmap.MAIL_SMTP_STARTTLS_ENABLE`                                       | Mail `SMTP STARTTLS` enable                                                                                                    | `false`                                               |
| `alert.configmap.MAIL_SMTP_SSL_ENABLE`                                            | Mail `SMTP SSL` enable                                                                                                         | `false`                                               |
| `alert.configmap.MAIL_SMTP_SSL_TRUST`                                             | Mail `SMTP SSL TRUST`                                                                                                          | `nil`                                                 |
| `alert.configmap.ENTERPRISE_WECHAT_ENABLE`                                        | `Enterprise Wechat` enable                                                                                                     | `false`                                               |
| `alert.configmap.ENTERPRISE_WECHAT_CORP_ID`                                       | `Enterprise Wechat` corp id                                                                                                    | `nil`                                                 |
| `alert.configmap.ENTERPRISE_WECHAT_SECRET`                                        | `Enterprise Wechat` secret                                                                                                     | `nil`                                                 |
| `alert.configmap.ENTERPRISE_WECHAT_AGENT_ID`                                      | `Enterprise Wechat` agent id                                                                                                   | `nil`                                                 |
| `alert.configmap.ENTERPRISE_WECHAT_USERS`                                         | `Enterprise Wechat` users                                                                                                      | `nil`                                                 |
| `alert.livenessProbe.enabled`                                                     | Turn on and off liveness probe                                                                                                 | `true`                                                |
| `alert.livenessProbe.initialDelaySeconds`                                         | Delay before liveness probe is initiated                                                                                       | `30`                                                  |
| `alert.livenessProbe.periodSeconds`                                               | How often to perform the probe                                                                                                 | `30`                                                  |
| `alert.livenessProbe.timeoutSeconds`                                              | When the probe times out                                                                                                       | `5`                                                   |
| `alert.livenessProbe.failureThreshold`                                            | Minimum consecutive successes for the probe                                                                                    | `3`                                                   |
| `alert.livenessProbe.successThreshold`                                            | Minimum consecutive failures for the probe                                                                                     | `1`                                                   |
| `alert.readinessProbe.enabled`                                                    | Turn on and off readiness probe                                                                                                | `true`                                                |
| `alert.readinessProbe.initialDelaySeconds`                                        | Delay before readiness probe is initiated                                                                                      | `30`                                                  |
| `alert.readinessProbe.periodSeconds`                                              | How often to perform the probe                                                                                                 | `30`                                                  |
| `alert.readinessProbe.timeoutSeconds`                                             | When the probe times out                                                                                                       | `5`                                                   |
| `alert.readinessProbe.failureThreshold`                                           | Minimum consecutive successes for the probe                                                                                    | `3`                                                   |
| `alert.readinessProbe.successThreshold`                                           | Minimum consecutive failures for the probe                                                                                     | `1`                                                   |
| `alert.persistentVolumeClaim.enabled`                                             | Set `alert.persistentVolumeClaim.enabled` to `true` to mount a new volume for `alert`                                          | `false`                                               |
| `alert.persistentVolumeClaim.accessModes`                                         | `PersistentVolumeClaim` access modes                                                                                           | `[ReadWriteOnce]`                                     |
| `alert.persistentVolumeClaim.storageClassName`                                    | `Alert` logs data persistent volume storage class. If set to "-", storageClassName: "", which disables dynamic provisioning    | `-`                                                   |
| `alert.persistentVolumeClaim.storage`                                             | `PersistentVolumeClaim` size                                                                                                   | `20Gi`                                                |
|                                                                                   |                                                                                                                                |                                                       |
| `api.replicas`                                                                    | Replicas is the desired number of replicas of the given Template                                                               | `1`                                                   |
| `api.strategy.type`                                                               | Type of deployment. Can be "Recreate" or "RollingUpdate"                                                                       | `RollingUpdate`                                       |
| `api.strategy.rollingUpdate.maxSurge`                                             | The maximum number of pods that can be scheduled above the desired number of pods                                              | `25%`                                                 |
| `api.strategy.rollingUpdate.maxUnavailable`                                       | The maximum number of pods that can be unavailable during the update                                                           | `25%`                                                 |
| `api.annotations`                                                                 | The `annotations` for api server                                                                                               | `{}`                                                  |
| `api.affinity`                                                                    | If specified, the pod's scheduling constraints                                                                                 | `{}`                                                  |
| `api.nodeSelector`                                                                | NodeSelector is a selector which must be true for the pod to fit on a node                                                     | `{}`                                                  |
| `api.tolerations`                                                                 | If specified, the pod's tolerations                                                                                            | `{}`                                                  |
| `api.resources`                                                                   | The `resource` limit and request config for api server                                                                         | `{}`                                                  |
| `api.configmap.API_SERVER_OPTS`                                                   | The jvm options for api server                                                                                                 | `-Xms512m -Xmx512m -Xmn256m`                          |
| `api.livenessProbe.enabled`                                                       | Turn on and off liveness probe                                                                                                 | `true`                                                |
| `api.livenessProbe.initialDelaySeconds`                                           | Delay before liveness probe is initiated                                                                                       | `30`                                                  |
| `api.livenessProbe.periodSeconds`                                                 | How often to perform the probe                                                                                                 | `30`                                                  |
| `api.livenessProbe.timeoutSeconds`                                                | When the probe times out                                                                                                       | `5`                                                   |
| `api.livenessProbe.failureThreshold`                                              | Minimum consecutive successes for the probe                                                                                    | `3`                                                   |
| `api.livenessProbe.successThreshold`                                              | Minimum consecutive failures for the probe                                                                                     | `1`                                                   |
| `api.readinessProbe.enabled`                                                      | Turn on and off readiness probe                                                                                                | `true`                                                |
| `api.readinessProbe.initialDelaySeconds`                                          | Delay before readiness probe is initiated                                                                                      | `30`                                                  |
| `api.readinessProbe.periodSeconds`                                                | How often to perform the probe                                                                                                 | `30`                                                  |
| `api.readinessProbe.timeoutSeconds`                                               | When the probe times out                                                                                                       | `5`                                                   |
| `api.readinessProbe.failureThreshold`                                             | Minimum consecutive successes for the probe                                                                                    | `3`                                                   |
| `api.readinessProbe.successThreshold`                                             | Minimum consecutive failures for the probe                                                                                     | `1`                                                   |
| `api.persistentVolumeClaim.enabled`                                               | Set `api.persistentVolumeClaim.enabled` to `true` to mount a new volume for `api`                                              | `false`                                               |
| `api.persistentVolumeClaim.accessModes`                                           | `PersistentVolumeClaim` access modes                                                                                           | `[ReadWriteOnce]`                                     |
| `api.persistentVolumeClaim.storageClassName`                                      | `api` logs data persistent volume storage class. If set to "-", storageClassName: "", which disables dynamic provisioning      | `-`                                                   |
| `api.persistentVolumeClaim.storage`                                               | `PersistentVolumeClaim` size                                                                                                   | `20Gi`                                                |
| `api.service.type`                                                                | `type` determines how the Service is exposed. Valid options are ExternalName, ClusterIP, NodePort, and LoadBalancer            | `ClusterIP`                                           |
| `api.service.clusterIP`                                                           | `clusterIP` is the IP address of the service and is usually assigned randomly by the master                                    | `nil`                                                 |
| `api.service.nodePort`                                                            | `nodePort` is the port on each node on which this service is exposed when type=NodePort                                        | `nil`                                                 |
| `api.service.externalIPs`                                                         | `externalIPs` is a list of IP addresses for which nodes in the cluster will also accept traffic for this service               | `[]`                                                  |
| `api.service.externalName`                                                        | `externalName` is the external reference that kubedns or equivalent will return as a CNAME record for this service             | `nil`                                                 |
| `api.service.loadBalancerIP`                                                      | `loadBalancerIP` when service.type is LoadBalancer. LoadBalancer will get created with the IP specified in this field          | `nil`                                                 |
| `api.service.annotations`                                                         | `annotations` may need to be set when service.type is LoadBalancer                                                             | `{}`                                                  |
|                                                                                   |                                                                                                                                |                                                       |
| `ingress.enabled`                                                                 | Enable ingress                                                                                                                 | `false`                                               |
| `ingress.host`                                                                    | Ingress host                                                                                                                   | `dolphinscheduler.org`                                |
| `ingress.path`                                                                    | Ingress path                                                                                                                   | `/dolphinscheduler`                                   |
| `ingress.tls.enabled`                                                             | Enable ingress tls                                                                                                             | `false`                                               |
| `ingress.tls.secretName`                                                          | Ingress tls secret name                                                                                                        | `dolphinscheduler-tls`                                |

---

## We will collect more FAQ later
