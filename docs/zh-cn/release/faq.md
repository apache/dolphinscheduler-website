<!-- markdown-link-check-disable -->
## Q：项目的名称是？

A：DolphinScheduler

---

## Q：DolphinScheduler 服务介绍及建议运行内存

A：DolphinScheduler 由 5 个服务组成，MasterServer、WorkerServer、ApiServer、AlertServer、LoggerServer 和 UI。

| 服务                      | 说明                                                         |
| ------------------------- | ------------------------------------------------------------ |
| MasterServer              | 主要负责 **DAG** 的切分和任务状态的监控                      |
| WorkerServer/LoggerServer | 主要负责任务的提交、执行和任务状态的更新。LoggerServer 用于 Rest Api 通过 **RPC** 查看日志 |
| ApiServer                 | 提供 Rest Api 服务，供 UI 进行调用                            |
| AlertServer               | 提供告警服务                                                 |
| UI                        | 前端页面展示                                                 |

注意：**由于服务比较多，建议单机部署最好是 4 核 16G 以上**

---


## Q：系统支持哪些邮箱？

A：支持绝大多数邮箱，qq、163、126、139、outlook、aliyun 等皆支持。支持 **TLS 和 SSL** 协议，可以在 alert.properties 中选择性配置

---

## Q：常用的系统变量时间参数有哪些，如何使用？

A：请参考[使用手册](https://dolphinscheduler.apache.org/zh-cn/docs/1.3.4/user_doc/system-manual.html) 第8小节

---

## Q：pip install kazoo 这个安装报错。是必须安装的吗？

A： 这个是 python 连接 Zookeeper 需要使用到的，用于删除Zookeeper中的master/worker临时节点信息。所以如果是第一次安装，就可以忽略错误。在1.3.0之后，kazoo不再需要了，我们用程序来代替kazoo所做的

---

## Q：怎么指定机器运行任务

A：使用 **管理员** 创建 Worker 分组，在 **流程定义启动** 的时候可**指定Worker分组**或者在**任务节点上指定Worker分组**。如果不指定，则使用 Default，**Default默认是使用的集群里所有的Worker中随机选取一台来进行任务提交、执行**

---

## Q：任务的优先级

A：我们同时 **支持流程和任务的优先级**。优先级我们有 **HIGHEST、HIGH、MEDIUM、LOW 和 LOWEST** 五种级别。**可以设置不同流程实例之间的优先级，也可以设置同一个流程实例中不同任务实例的优先级**。详细内容请参考任务优先级设计 https://analysys.github.io/easyscheduler_docs_cn/%E7%B3%BB%E7%BB%9F%E6%9E%B6%E6%9E%84%E8%AE%BE%E8%AE%A1.html#%E7%B3%BB%E7%BB%9F%E6%9E%B6%E6%9E%84%E8%AE%BE%E8%AE%A1

----

## Q：dolphinscheduler-grpc 报错

A：在 1.2 及以前版本中，在根目录下执行：mvn -U clean package assembly:assembly -Dmaven.test.skip=true,然后刷新下整个项目就好，1.3版本中不再使用 GRPC 进行通信了

----

## Q：DolphinScheduler 支持 windows 上运行么

A： 理论上只有 **Worker 是需要在 Linux 上运行的**，其它的服务都是可以在 windows 上正常运行的。但是还是建议最好能在 linux 上部署使用

-----

## Q：UI 在 linux 编译 node-sass 提示：Error：EACCESS:permission denied，mkdir xxxx

A：单独安装 **npm install node-sass --unsafe-perm**，之后再 **npm install**

---

## Q：UI 不能正常登陆访问

A：     1，如果是 node 启动的查看 dolphinscheduler-ui 下的 .env 文件里的 API_BASE 配置是否是 Api Server 服务地址

​       2，如果是 nginx 启动的并且是通过 **install-dolphinscheduler-ui.sh** 安装的，查看             

​              **/etc/nginx/conf.d/dolphinscheduler.conf** 中的 proxy_pass 配置是否是 Api Server 服务地址

​       3，如果以上配置都是正确的，那么请查看 Api Server 服务是否是正常的，

​			curl http://192.168.xx.xx:12345/dolphinscheduler/users/get-user-info 查看 Api Server 日志，

​			如果提示 cn.dolphinscheduler.api.interceptor.LoginHandlerInterceptor:[76] - session info is null，则证明 Api Server 服务是正常的

​       4，如果以上都没有问题，需要查看一下 **application.properties** 中的 **server.context-path 和 server.port 配置**是否正确
注意：1.3 版本直接使用 Jetty 进行前端代码的解析，无需再安装配置 nginx 了

---

## Q：流程定义手动启动或调度启动之后，没有流程实例生成

A： 	  1，首先通过 **jps 查看MasterServer服务是否存在**，或者从服务监控直接查看 zk 中是否存在 master 服务

​	   2，如果存在 master 服务，查看 **命令状态统计** 或者 **t_ds_error_command** 中是否增加的新记录，如果增加了，**请查看 message 字段定位启动异常原因**

---

## Q：任务状态一直处于提交成功状态

A：        1，首先通过 **jps 查看 WorkerServer 服务是否存在**，或者从服务监控直接查看 zk 中是否存在 worker 服务

​          2，如果 **WorkerServer** 服务正常，需要 **查看 MasterServer 是否把 task 任务放到 zk 队列中** ，**需要查看 MasterServer 日志及 zk 队列中是否有任务阻塞**

​	   3，如果以上都没有问题，需要定位是否指定了 Worker 分组，但是 **Worker 分组的机器不是在线状态**

---

## Q：install.sh 中需要注意问题

A：  	   1，如果替换变量中包含特殊字符，**请用 \ 转移符进行转移**

​	    2，installPath="/data1_1T/dolphinscheduler"，**这个目录不能和当前要一键安装的 install.sh 目录是一样的**

​	    3，deployUser="dolphinscheduler"，**部署用户必须具有 sudo 权限**，因为 worker 是通过 sudo -u 租户 sh xxx.command 进行执行的

​	    4，monitorServerState="false"，服务监控脚本是否启动，默认是不启动服务监控脚本的。**如果启动服务监控脚本，则每 5 分钟定时来监控 master 和 worker 的服务是否 down 机，如果 down 机则会自动重启**

​	    5，hdfsStartupSate="false"，是否开启 HDFS 资源上传功能。默认是不开启的，**如果不开启则资源中心是不能使用的**。如果开启，需要 conf/common/hadoop/hadoop.properties 中配置 fs.defaultFS 和 yarn 的相关配置，如果使用 namenode HA，需要将 core-site.xml 和 hdfs-site.xml 复制到conf根目录下

​	注意：**1.0.x 版本是不会自动创建 hdfs 根目录的，需要自行创建，并且需要部署用户有hdfs的操作权限**

---

## Q：流程定义和流程实例下线异常

A ： 对于 **1.0.4 以前的版本中**，修改 dolphinscheduler-api cn.dolphinscheduler.api.quartz 包下的代码即可

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

## Q：HDFS 启动之前创建的租户，能正常使用资源中心吗

A： 不能。因为在未启动 HDFS 创建的租户，不会在 HDFS 中注册租户目录。所以上次资源会报错

## Q：多 Master 和多 Worker 状态下，服务掉了，怎么容错

A：  **注意：Master 监控 Master 及 Worker 服务。**

​	1，如果 Master 服务掉了，其它的 Master 会接管挂掉的 Master 的流程，继续监控 Worker task 状态

​	2，如果 Worker 服务掉了，Master 会监控到 Worker 服务掉了，如果存在 Yarn 任务，Kill Yarn 任务之后走重试

具体请看容错设计：https://analysys.github.io/easyscheduler_docs_cn/%E7%B3%BB%E7%BB%9F%E6%9E%B6%E6%9E%84%E8%AE%BE%E8%AE%A1.html#%E7%B3%BB%E7%BB%9F%E6%9E%B6%E6%9E%84%E8%AE%BE%E8%AE%A1

---

## Q：对于 Master 和 Worker 一台机器伪分布式下的容错

A ： 1.0.3 版本只实现了 Master 启动流程容错，不走 Worker 容错。也就是说如果 Worker 挂掉的时候，没有 Master 存在。这流程将会出现问题。我们会在 **1.1.0** 版本中增加 Master 和 Worker 启动自容错，修复这个问题。如果想手动修改这个问题，需要针对 **跨重启正在运行流程** **并且已经掉的正在运行的 Worker 任务，需要修改为失败**，**同时跨重启正在运行流程设置为失败状态**。然后从失败节点进行流程恢复即可

---

## Q：定时容易设置成每秒执行

A ： 设置定时的时候需要注意，如果第一位（* * * * * ? *）设置成 \* ，则表示每秒执行。**我们将会在 1.1.0 版本中加入显示最近调度的时间列表** ，使用 http://cron.qqe2.com/  可以在线看近 5 次运行时间



## Q：定时有有效时间范围吗

A：有的，**如果定时的起止时间是同一个时间，那么此定时将是无效的定时**。**如果起止时间的结束时间比当前的时间小，很有可能定时会被自动删除**



## Q：任务依赖有几种实现

A：  1，**DAG** 之间的任务依赖关系，是从 **入度为零** 进行 DAG 切分的

​	 2，有 **任务依赖节点** ，可以实现跨流程的任务或者流程依赖，具体请参考 依赖(DEPENDENT)节点：https://analysys.github.io/easyscheduler_docs_cn/%E7%B3%BB%E7%BB%9F%E4%BD%BF%E7%94%A8%E6%89%8B%E5%86%8C.html#%E4%BB%BB%E5%8A%A1%E8%8A%82%E7%82%B9%E7%B1%BB%E5%9E%8B%E5%92%8C%E5%8F%82%E6%95%B0%E8%AE%BE%E7%BD%AE


## Q：流程定义有几种启动方式

A： 1，在 **流程定义列表**，点击 **启动** 按钮

​		2，**流程定义列表添加定时器**，调度启动流程定义

​		3，流程定义 **查看或编辑** DAG 页面，任意 **任务节点右击** 启动流程定义

​		4，可以对流程定义 DAG 编辑，设置某些任务的运行标志位 **禁止运行**，则在启动流程定义的时候，将该节点的连线将从 DAG 中去掉

## Q：Python 任务设置 Python 版本

A：  只需要修改 conf/env/dolphinscheduler_env.sh 中的 PYTHON_HOME

```
export PYTHON_HOME=/bin/python
```

注意：这了 **PYTHON_HOME** ，是 python 命令的绝对路径，而不是单纯的 PYTHON_HOME，还需要注意的是 export PATH 的时候，需要直接

```
export PATH=$HADOOP_HOME/bin:$SPARK_HOME1/bin:$SPARK_HOME2/bin:$PYTHON_HOME:$JAVA_HOME/bin:$HIVE_HOME/bin:$PATH
```


## Q：Worker Task 通过 sudo -u 租户 sh xxx.command 会产生子进程，在 kill 的时候，是否会杀掉

A： 我们会在 1.0.4 中增加 kill 任务同时，kill 掉任务产生的各种所有子进程



## Q：DolphinScheduler 中的队列怎么用，用户队列和租户队列是什么意思

A ： DolphinScheduler 中的队列可以在用户或者租户上指定队列，**用户指定的队列优先级是高于租户队列的优先级的。**，例如：对 MR 任务指定队列，是通过 mapreduce.job.queuename 来指定队列的。

注意：MR 在用以上方法指定队列的时候，传递参数请使用如下方式：

```
	Configuration conf = new Configuration();
        GenericOptionsParser optionParser = new GenericOptionsParser(conf, args);
        String[] remainingArgs = optionParser.getRemainingArgs();
```


如果是 Spark 任务 --queue 方式指定队列



## Q：Master 或者 Worker 报如下告警

<p align="center">
   <img src="https://analysys.github.io/easyscheduler_docs_cn/images/master_worker_lack_res.png" width="60%" />
 </p>


A ： 修改 conf 下的 master.properties **master.reserved.memory** 的值为更小的值，比如说 0.1 或者

worker.properties **worker.reserved.memory** 的值为更小的值，比如说 0.1



## Q：hive 版本是 1.1.0+cdh5.15.0，SQL hive 任务连接报错

<p align="center">
   <img src="https://analysys.github.io/easyscheduler_docs_cn/images/cdh_hive_error.png" width="60%" />
 </p>



A： 将 hive pom

```
<dependency>
    <groupId>org.apache.hive</groupId>
    <artifactId>hive-jdbc</artifactId>
    <version>2.1.0</version>
</dependency>
```

修改为

```
<dependency>
    <groupId>org.apache.hive</groupId>
    <artifactId>hive-jdbc</artifactId>
    <version>1.1.0</version>
</dependency>
```

---

## Q：如何增加一台工作服务器
A： 1，参考官网[部署文档](/zh-cn/docs/1.3.4/user_doc/cluster-deployment.html) 1.3 小节，创建部署用户和 hosts 映射

​	2，参考官网[部署文档](/zh-cn/docs/1.3.4/user_doc/cluster-deployment.html) 1.4 小节，配置 hosts 映射和 ssh 打通及修改目录权限.
          1.4 小节的最后一步是在当前新增机器上执行的，即需要给部署目录部署用户的权限

​	3，复制正在运行的服务器上的部署目录到新机器的同样的部署目录下

​	4，到 bin 下，启动 worker server 和 logger server
```
        ./dolphinscheduler-daemon.sh start worker-server
        ./dolphinscheduler-daemon.sh start logger-server
```

---

## Q：DolphinScheduler 什么时候发布新版本，同时新旧版本区别，以及如何升级，版本号规范
A：1，Apache 项目的发版流程是通过邮件列表完成的。 你可以订阅 DolphinScheduler 的邮件列表，订阅之后如果有发版，你就可以收到邮件。请参照这篇[指引](https://github.com/apache/dolphinscheduler#get-help)来订阅 DolphinScheduler 的邮件列表。

   2，当项目发版的时候，会有发版说明告知具体的变更内容，同时也会有从旧版本升级到新版本的升级文档。

   3，版本号为 x.y.z, 当 x 增加时代表全新架构的版本。当 y 增加时代表与 y 版本之前的不兼容需要升级脚本或其他人工处理才能升级。当 z 增加代表是 bug 修复，升级完全兼容。无需额外处理。之前有个问题 1.0.2 的升级不兼容 1.0.1 需要升级脚本。

---

## Q：后续任务在前置任务失败情况下仍旧可以执行
A：在启动工作流的时候，你可以设置失败策略：继续还是失败。
![设置任务失败策略](https://user-images.githubusercontent.com/15833811/80368215-ee378080-88be-11ea-9074-01a33d012b23.png)

---

## Q：工作流模板 DAG、工作流实例、工作任务及实例之间是什么关系 工作流模板 DAG、工作流实例、工作任务及实例之间是什么关系，一个 dag 支持最大并发 100，是指产生 100 个工作流实例并发运行吗？一个 dag 中的任务节点，也有并发数的配置，是指任务也可以并发多个线程运行吗？最大数 100 吗？
A：

1.2.1 version
```
   master.properties
   设置 master 节点并发执行的最大工作流数
   master.exec.threads=100

   Control the number of parallel tasks in each workflow
   设置每个工作流可以并发执行的最大任务数
   master.exec.task.number=20

   worker.properties
   设置 worker 节点并发执行的最大任务数
   worker.exec.threads=100
```

---

## Q：工作组管理页面没有展示按钮
<p align="center">
   <img src="https://user-images.githubusercontent.com/39816903/81903776-d8cb9180-95f4-11ea-98cb-94ca1e6a1db5.png" width="60%" />
</p>
A：1.3.0 版本，为了支持 k8s，worker ip 一直变动，因此我们不能在 UI 界面上配置，工作组可以配置在 worker.properties 上配置名称。

---

## Q：为什么不把 mysql 的 jdbc 连接包添加到 docker 镜像里面
A：Mysql jdbc 连接包的许可证和 apache v2 的许可证不兼容，因此它不能被加入到 docker 镜像里面。

---

## Q：当一个任务提交多个 yarn 程序的时候经常失败
<p align="center">
   <img src="https://user-images.githubusercontent.com/16174111/81312485-476e9380-90b9-11ea-9aad-ed009db899b1.png" width="60%" />
</p>
A：这个 Bug 在 dev 分支已修复，并加入到需求/待做列表。

---

## Q：Master 服务和 Worker 服务在运行几天之后停止了
<p align="center">
   <img src="https://user-images.githubusercontent.com/18378986/81293969-c3101680-90a0-11ea-87e5-ac9f0dd53f5e.png" width="60%" />
</p>
A：会话超时时间太短了，只有 0.3 秒，修改 zookeeper.properties 的配置项：

```
   zookeeper.session.timeout=60000
   zookeeper.connection.timeout=30000
```

---

## Q：使用 docker-compose 默认配置启动，显示 zookeeper 错误
<p align="center">
   <img src="https://user-images.githubusercontent.com/42579056/80374318-13c98780-88c9-11ea-8d5f-53448b957f02.png" width="60%" />
 </p>
A：这个问题在 dev-1.3.0 版本解决了。这个 [pr](https://github.com/apache/dolphinscheduler/pull/2595) 已经解决了这个 bug，主要的改动点：

```
    在docker-compose.yml文件中增加zookeeper的环境变量ZOO_4LW_COMMANDS_WHITELIST。
    把minLatency,avgLatency and maxLatency的类型从int改成float。
```

---

## Q：界面上显示任务一直运行，结束不了，从日志上看任务实例为空
<p align="center">
   <img src="https://user-images.githubusercontent.com/51871547/80302626-b1478d00-87dd-11ea-97d4-08aa2244a6d0.jpg" width="60%" />
 </p>
<p align="center">
   <img src="https://user-images.githubusercontent.com/51871547/80302626-b1478d00-87dd-11ea-97d4-08aa2244a6d0.jpg" width="60%" />
 </p>
A：这个 [bug](https://github.com/apache/dolphinscheduler/issues/1477)  描述了问题的详情。这个问题在 1.2.1 版本已经被修复了。
对于 1.2.1 以下的版本，这种情况的一些提示：

```
1，清空 zk 下这个路径的任务：/dolphinscheduler/task_queue
2，修改任务状态为失败（int 值 6）
3，运行工作流来从失败中恢复
```

---

## Q：zk 中注册的 master 信息 ip 地址是 127.0.0.1，而不是配置的域名所对应或者解析的 ip 地址，可能导致不能查看任务日志
A：修复 bug：
```
   1、confirm hostname
   $hostname
   hadoop1
   2、hostname -i
   127.0.0.1 10.3.57.15
   3、edit /etc/hosts,delete hadoop1 from 127.0.0.1 record
   $cat /etc/hosts
   127.0.0.1 localhost
   10.3.57.15 ds1 hadoop1
   4、hostname -i
   10.3.57.15
```   
   hostname 命令返回服务器主机名，hostname -i 返回的是服务器主机名在 /etc/hosts 中所有匹配的ip地址。所以我把 /etc/hosts 中 127.0.0.1 中的主机名删掉，只保留内网 ip 的解析就可以了，没必要把 127.0.0.1 整条注释掉, 只要 hostname 命令返回值在 /etc/hosts 中对应的内网 ip 正确就可以，ds 程序取了第一个值，我理解上 ds 程序不应该用 hostname -i 取值这样有点问题，因为好多公司服务器的主机名都是运维配置的，感觉还是直接取配置文件的域名解析的返回 ip 更准确，或者 znode 中存域名信息而不是 /etc/hosts。

---

## Q：调度系统设置了一个秒级的任务，导致系统挂掉
A：调度系统不支持秒级任务。

---

## Q：编译前后端代码 (dolphinscheduler-ui) 报错不能下载"https://github.com/sass/node-sass/releases/download/v4.13.1/darwin-x64-72_binding.node"
A：1，cd dolphinscheduler-ui 然后删除 node_modules 目录
```
sudo rm -rf node_modules
```   
   ​	2，通过 npm.taobao.org 下载 node-sass
 ```
 sudo npm uninstall node-sass
 sudo npm i node-sass --sass_binary_site=https://npm.taobao.org/mirrors/node-sass/
 ```
   3，如果步骤 2 报错，请重新构建 node-saas [参考链接](/zh-cn/docs/1.3.4/user_doc/frontend-development.html)
```
 sudo npm rebuild node-sass
 ```
当问题解决之后，如果你不想每次编译都下载这个 node，你可以设置系统环境变量：SASS_BINARY_PATH= /xxx/xxx/xxx/xxx.node。

---

## Q：当使用 mysql 作为 ds 数据库需要如何配置
A：1，修改项目根目录 maven 配置文件，移除 scope 的 test 属性，这样 mysql 的包就可以在其它阶段被加载
```
<dependency>
	<groupId>mysql</groupId>
	<artifactId>mysql-connector-java</artifactId>
	<version>${mysql.connector.version}</version>
	<scope>test<scope>
</dependency>
```   
   ​	2，修改 application-dao.properties 和 quzrtz.properties 来使用 mysql 驱动
   默认驱动是 postgres 主要由于许可证原因。

---

## Q：shell 任务是如何运行的
A：1，被执行的服务器在哪里配置，以及实际执行的服务器是哪台? 要指定在某个 worker 上去执行，可以在 worker 分组中配置，固定 IP，这样就可以把路径写死。如果配置的 worker 分组有多个 worker，实际执行的服务器由调度决定的，具有随机性。

   ​	2，如果是服务器上某个路径的一个 shell 文件，怎么指向这个路径？服务器上某个路径下的 shell 文件，涉及到权限问题，不建议这么做。建议你可以使用资源中心的存储功能，然后在 shell 编辑器里面使用资源引用就可以，系统会帮助你把脚本下载到执行目录下。如果以 hdfs 作为资源中心，在执行的时候，调度器会把依赖的 jar 包，文件等资源拉到 worker 的执行目录上，我这边是 /tmp/escheduler/exec/process，该配置可以在 install.sh 中进行指定。

   3，以哪个用户来执行任务？执行任务的时候，调度器会采用 sudo -u 租户的方式去执行，租户是一个 linux 用户。

---

## Q：生产环境部署方式有推荐的最佳实践吗
A：1，如果没有很多任务要运行，出于稳定性考虑我们建议使用 3 个节点，并且最好把 Master/Worder 服务部署在不同的节点。如果你只有一个节点，当然只能把所有的服务部署在同一个节点！通常来说，需要多少节点取决于你的业务，海豚调度系统本身不需要很多的资源。充分测试之后，你们将找到使用较少节点的合适的部署方式。

---

## Q：DEPENDENT 节点
A：1，DEPENDENT 节点实际是没有执行体的，是专门用来配置数据周期依赖逻辑，然后再把执行节点挂载后面，来实现任务间的周期依赖。

---

## Q：如何改变 Master 服务的启动端口
<p align="center">
   <img src="https://user-images.githubusercontent.com/8263441/62352160-0f3e9100-b53a-11e9-95ba-3ae3dde49c72.png" width="60%" />
 </p>
A：1，修改 application_master.properties 配置文件，例如：server.port=12345。

---

## Q：调度任务不能上线
A：1，我们可以成功创建调度任务，并且表 t_scheduler_schedules 中也成功加入了一条记录，但当我点击上线后，前端页面无反应且会把 t_scheduler_schedules 这张表锁定，我测试过将 t_scheduler_schedules 中的 RELEASE_state 字段手动更新为 1 这样前端会显示为上线状态。DS 版本 1.2+ 表名是 t_ds_schedules，其它版本表名是 t_scheduler_schedules。

---

## Q：请问 swagger ui 的地址是什么
A：1，1.2+ 版本地址是：http://apiServerIp:apiServerPort/dolphinscheduler/doc.html?language=zh_CN&lang=cn，其它版本是 http://apiServerIp:apiServerPort/escheduler/doc.html?language=zh_CN&lang=cn。

---

## Q：前端安装包缺少文件
<p align="center">
   <img src="https://user-images.githubusercontent.com/41460919/61437083-d960b080-a96e-11e9-87f1-297ba3aca5e3.png" width="60%" />
 </p>
 <p align="center">
    <img src="https://user-images.githubusercontent.com/41460919/61437218-1b89f200-a96f-11e9-8e48-3fac47eb2389.png" width="60%" />
  </p>
A： 1，用户修改了 api server 配置文件中的![apiServerContextPath](https://user-images.githubusercontent.com/41460919/61678323-1b09a680-ad35-11e9-9707-3ba68bbc70d6.png)配置项，导致了这个问题，恢复成默认配置之后问题解决。

---

## Q：上传比较大的文件卡住
<p align="center">
   <img src="https://user-images.githubusercontent.com/21357069/58231400-805b0e80-7d69-11e9-8107-7f37b06a95df.png" width="60%" />
 </p>
A：1，编辑 ngnix 配置文件 vi /etc/nginx/nginx.conf，更改上传大小 client_max_body_size 1024m。

   ​	2，更新 google chrome 版本到最新版本。

---

## Q：创建 spark 数据源，点击“测试连接”，系统回退回到登入页面
A：1，edit /etc/nginx/conf.d/escheduler.conf
```
     proxy_connect_timeout 300s;
     proxy_read_timeout 300s;
     proxy_send_timeout 300s;
```

---

## Q：欢迎订阅 DolphinScheduler 开发邮件列表
A：在使用 DolphinScheduler 的过程中，如果您有任何问题或者想法、建议，都可以通过 Apache 邮件列表参与到 DolphinScheduler 的社区建设中来。
   发送订阅邮件也非常简单，步骤如下:

   1，用自己的邮箱向 dev-subscribe@dolphinscheduler.apache.org 发送一封邮件，主题和内容任意。

   2， 接收确认邮件并回复。 完成步骤1后，您将收到一封来自 dev-help@dolphinscheduler.apache.org 的确认邮件（如未收到，请确认邮件是否被自动归入垃圾邮件、推广邮件、订阅邮件等文件夹）。然后直接回复该邮件，或点击邮件里的链接快捷回复即可，主题和内容任意。

   3， 接收欢迎邮件。 完成以上步骤后，您会收到一封主题为 WELCOME to dev@dolphinscheduler.apache.org 的欢迎邮件，至此您已成功订阅 Apache DolphinScheduler的邮件列表。

---

## Q：工作流依赖
A：1，目前是按照自然天来判断，上月末：判断时间是工作流 A start_time/scheduler_time between '2019-05-31 00:00:00' and '2019-05-31 23:59:59'。上月：是判断上个月从 1 号到月末每天都要有完成的A实例。上周： 上周 7 天都要有完成的 A 实例。前两天： 判断昨天和前天，两天都要有完成的 A 实例。

---

## Q：DS 后端接口文档
A：1，http://106.75.43.194:8888/dolphinscheduler/doc.html?language=zh_CN&lang=zh。


## dolphinscheduler 在运行过程中，ip 地址获取错误的问题

master 服务、worker 服务在 zookeeper 注册时，会以 ip:port 的形式创建相关信息

如果 ip 地址获取错误，请检查网络信息，如 Linux 系统通过 `ifconfig` 命令查看网络信息，以下图为例：

<p align="center">
  <img src="/img/network/network_config.png" width="60%" />
</p>

可以使用 dolphinscheduler 提供的三种策略，获取可用 ip：

* default: 优先获取内网网卡获取 ip 地址，其次获取外网网卡获取 ip 地址，在前两项失效情况下，使用第一块可用网卡的地址
* inner: 使用内网网卡获取 ip地址，如果获取失败抛出异常信息
* outer: 使用外网网卡获取 ip地址，如果获取失败抛出异常信息

配置方式是在 `common.properties` 中修改相关配置：

```shell
# network IP gets priority, default: inner outer
# dolphin.scheduler.network.priority.strategy=default
```

以上配置修改后重启服务生效

如果 ip 地址获取依然错误，请下载 [dolphinscheduler-netutils.jar](/asset/dolphinscheduler-netutils.jar) 到相应机器，执行以下命令以进一步排障，并反馈给社区开发人员：

```shell
java -jar target/dolphinscheduler-netutils.jar
```

## 配置 sudo 免密，用于解决默认配置 sudo 权限过大或不能申请 root 权限的使用问题

配置 dolphinscheduler OS 账号的 sudo 权限为部分普通用户范围内的一个普通用户管理者，限制指定用户在指定主机上运行某些命令，详细配置请看 sudo 权限管理
例如 sudo 权限管理配置 dolphinscheduler OS 账号只能操作用户 userA,userB,userC 的权限（其中用户 userA,userB,userC 用于多租户向大数据集群提交作业）

```shell
echo 'dolphinscheduler  ALL=(userA,userB,userC)  NOPASSWD: NOPASSWD: ALL' >> /etc/sudoers
sed -i 's/Defaults    requirett/#Defaults    requirett/g' /etc/sudoers
```

---

## 关于 Kubernetes 部署

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

> 由于商业许可证的原因，我们不能直接使用 MySQL 的驱动包.
>
> 如果你要使用 MySQL, 你可以基于官方镜像 `apache/dolphinscheduler` 进行构建.

1. 下载 MySQL 驱动包 [mysql-connector-java-8.0.16.jar](https://repo1.maven.org/maven2/mysql/mysql-connector-java/8.0.16/mysql-connector-java-8.0.16.jar)

2. 创建一个新的 `Dockerfile`，用于添加 MySQL 的驱动包:

```
FROM dolphinscheduler.docker.scarf.sh/apache/dolphinscheduler:1.3.8
COPY mysql-connector-java-8.0.16.jar /opt/dolphinscheduler/lib
```

3. 构建一个包含 MySQL 驱动包的新镜像:

```
docker build -t apache/dolphinscheduler:mysql-driver .
```

4. 推送 docker 镜像 `apache/dolphinscheduler:mysql-driver` 到一个 docker registry 中

5. 修改 `values.yaml` 文件中 image 的 `repository` 字段，并更新 `tag` 为 `mysql-driver`

6. 修改 `values.yaml` 文件中 postgresql 的 `enabled` 为 `false`

7. 修改 `values.yaml` 文件中的 externalDatabase 配置 (尤其修改 `host`, `username` 和 `password`)

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

8. 部署 dolphinscheduler (详见**安装 dolphinscheduler**)

### 如何在数据源中心支持 MySQL 数据源？

> 由于商业许可证的原因，我们不能直接使用 MySQL 的驱动包.
>
> 如果你要添加 MySQL 数据源, 你可以基于官方镜像 `apache/dolphinscheduler` 进行构建.

1. 下载 MySQL 驱动包 [mysql-connector-java-8.0.16.jar](https://repo1.maven.org/maven2/mysql/mysql-connector-java/8.0.16/mysql-connector-java-8.0.16.jar)

2. 创建一个新的 `Dockerfile`，用于添加 MySQL 驱动包:

```
FROM dolphinscheduler.docker.scarf.sh/apache/dolphinscheduler:1.3.8
COPY mysql-connector-java-8.0.16.jar /opt/dolphinscheduler/lib
```

3. 构建一个包含 MySQL 驱动包的新镜像:

```
docker build -t apache/dolphinscheduler:mysql-driver .
```

4. 推送 docker 镜像 `apache/dolphinscheduler:mysql-driver` 到一个 docker registry 中

5. 修改 `values.yaml` 文件中 image 的 `repository` 字段，并更新 `tag` 为 `mysql-driver`

6. 部署 dolphinscheduler (详见**安装 dolphinscheduler**)

7. 在数据源中心添加一个 MySQL 数据源

### 如何在数据源中心支持 Oracle 数据源？

> 由于商业许可证的原因，我们不能直接使用 Oracle 的驱动包.
>
> 如果你要添加 Oracle 数据源, 你可以基于官方镜像 `apache/dolphinscheduler` 进行构建.

1. 下载 Oracle 驱动包 [ojdbc8.jar](https://repo1.maven.org/maven2/com/oracle/database/jdbc/ojdbc8/) (例如 `ojdbc8-19.9.0.0.jar`)

2. 创建一个新的 `Dockerfile`，用于添加 Oracle 驱动包:

```
FROM dolphinscheduler.docker.scarf.sh/apache/dolphinscheduler:1.3.8
COPY ojdbc8-19.9.0.0.jar /opt/dolphinscheduler/lib
```

3. 构建一个包含 Oracle 驱动包的新镜像:

```
docker build -t apache/dolphinscheduler:oracle-driver .
```

4. 推送 docker 镜像 `apache/dolphinscheduler:oracle-driver` 到一个 docker registry 中

5. 修改 `values.yaml` 文件中 image 的 `repository` 字段，并更新 `tag` 为 `oracle-driver`

6. 部署 dolphinscheduler (详见**安装 dolphinscheduler**)

7. 在数据源中心添加一个 Oracle 数据源

### 如何支持 Python 2 pip 以及自定义 requirements.txt？

1. 创建一个新的 `Dockerfile`，用于安装 pip:

```
FROM dolphinscheduler.docker.scarf.sh/apache/dolphinscheduler:1.3.8
COPY requirements.txt /tmp
RUN apt-get update && \
    apt-get install -y --no-install-recommends python-pip && \
    pip install --no-cache-dir -r /tmp/requirements.txt && \
    rm -rf /var/lib/apt/lists/*
```

这个命令会安装默认的 **pip 18.1**. 如果你想升级 pip, 只需添加一行

```
    pip install --no-cache-dir -U pip && \
```

2. 构建一个包含 pip 的新镜像:

```
docker build -t apache/dolphinscheduler:pip .
```

3. 推送 docker 镜像 `apache/dolphinscheduler:pip` 到一个 docker registry 中

4. 修改 `values.yaml` 文件中 image 的 `repository` 字段，并更新 `tag` 为 `pip`

5. 部署 dolphinscheduler (详见**安装 dolphinscheduler**)

6. 在一个新 Python 任务下验证 pip

### 如何支持 Python 3？

1. 创建一个新的 `Dockerfile`，用于安装 Python 3:

```
FROM dolphinscheduler.docker.scarf.sh/apache/dolphinscheduler:1.3.8
RUN apt-get update && \
    apt-get install -y --no-install-recommends python3 && \
    rm -rf /var/lib/apt/lists/*
```

这个命令会安装默认的 **Python 3.7.3**. 如果你也想安装 **pip3**, 将 `python3` 替换为 `python3-pip` 即可

```
    apt-get install -y --no-install-recommends python3-pip && \
```

2. 构建一个包含 Python 3 的新镜像:

```
docker build -t apache/dolphinscheduler:python3 .
```

3. 推送 docker 镜像 `apache/dolphinscheduler:python3` 到一个 docker registry 中

4. 修改 `values.yaml` 文件中 image 的 `repository` 字段，并更新 `tag` 为 `python3`

5. 修改 `values.yaml` 文件中的 `PYTHON_HOME` 为 `/usr/bin/python3`

6. 部署 dolphinscheduler (详见**安装 dolphinscheduler**)

7. 在一个新 Python 任务下验证 Python 3

### 如何支持 Hadoop, Spark, Flink, Hive 或 DataX？

以 Spark 2.4.7 为例:

1. 下载 Spark 2.4.7 发布的二进制包 `spark-2.4.7-bin-hadoop2.7.tgz`

2. 确保 `common.sharedStoragePersistence.enabled` 开启

3. 部署 dolphinscheduler (详见**安装 dolphinscheduler**)

4. 复制 Spark 3.1.1 二进制包到 Docker 容器中

```bash
kubectl cp spark-2.4.7-bin-hadoop2.7.tgz dolphinscheduler-worker-0:/opt/soft
kubectl cp -n test spark-2.4.7-bin-hadoop2.7.tgz dolphinscheduler-worker-0:/opt/soft # with test namespace
```

因为存储卷 `sharedStoragePersistence` 被挂载到 `/opt/soft`, 因此 `/opt/soft` 中的所有文件都不会丢失

5. 登录到容器并确保 `SPARK_HOME2` 存在

```bash
kubectl exec -it dolphinscheduler-worker-0 bash
kubectl exec -n test -it dolphinscheduler-worker-0 bash # with test namespace
cd /opt/soft
tar zxf spark-2.4.7-bin-hadoop2.7.tgz
rm -f spark-2.4.7-bin-hadoop2.7.tgz
ln -s spark-2.4.7-bin-hadoop2.7 spark2 # or just mv
$SPARK_HOME2/bin/spark-submit --version
```

如果一切执行正常，最后一条命令将会打印 Spark 版本信息

6. 在一个 Shell 任务下验证 Spark

```
$SPARK_HOME2/bin/spark-submit --class org.apache.spark.examples.SparkPi $SPARK_HOME2/examples/jars/spark-examples_2.11-2.4.7.jar
```

检查任务日志是否包含输出 `Pi is roughly 3.146015`

7. 在一个 Spark 任务下验证 Spark

文件 `spark-examples_2.11-2.4.7.jar` 需要先被上传到资源中心，然后创建一个 Spark 任务并设置:

- Spark版本: `SPARK2`
- 主函数的Class: `org.apache.spark.examples.SparkPi`
- 主程序包: `spark-examples_2.11-2.4.7.jar`
- 部署方式: `local`

同样地, 检查任务日志是否包含输出 `Pi is roughly 3.146015`

8. 验证 Spark on YARN

Spark on YARN (部署方式为 `cluster` 或 `client`) 需要 Hadoop 支持. 类似于 Spark 支持, 支持 Hadoop 的操作几乎和前面的步骤相同

确保 `$HADOOP_HOME` 和 `$HADOOP_CONF_DIR` 存在

### 如何支持 Spark 3？

事实上，使用 `spark-submit` 提交应用的方式是相同的, 无论是 Spark 1, 2 或 3. 换句话说，`SPARK_HOME2` 的语义是第二个 `SPARK_HOME`, 而非 `SPARK2` 的 `HOME`, 因此只需设置 `SPARK_HOME2=/path/to/spark3` 即可

以 Spark 3.1.1 为例:

1. 下载 Spark 3.1.1 发布的二进制包 `spark-3.1.1-bin-hadoop2.7.tgz`

2. 确保 `common.sharedStoragePersistence.enabled` 开启

3. 部署 dolphinscheduler (详见**安装 dolphinscheduler**)

4. 复制 Spark 3.1.1 二进制包到 Docker 容器中

```bash
kubectl cp spark-3.1.1-bin-hadoop2.7.tgz dolphinscheduler-worker-0:/opt/soft
kubectl cp -n test spark-3.1.1-bin-hadoop2.7.tgz dolphinscheduler-worker-0:/opt/soft # with test namespace
```

5. 登录到容器并确保 `SPARK_HOME2` 存在

```bash
kubectl exec -it dolphinscheduler-worker-0 bash
kubectl exec -n test -it dolphinscheduler-worker-0 bash # with test namespace
cd /opt/soft
tar zxf spark-3.1.1-bin-hadoop2.7.tgz
rm -f spark-3.1.1-bin-hadoop2.7.tgz
ln -s spark-3.1.1-bin-hadoop2.7 spark2 # or just mv
$SPARK_HOME2/bin/spark-submit --version
```

如果一切执行正常，最后一条命令将会打印 Spark 版本信息

6. 在一个 Shell 任务下验证 Spark

```
$SPARK_HOME2/bin/spark-submit --class org.apache.spark.examples.SparkPi $SPARK_HOME2/examples/jars/spark-examples_2.12-3.1.1.jar
```

检查任务日志是否包含输出 `Pi is roughly 3.146015`

### 如何在 Master、Worker 和 Api 服务之间支持共享存储？

例如, Master、Worker 和 Api 服务可能同时使用 Hadoop

1. 修改 `values.yaml` 文件中下面的配置项

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

`storageClassName` 和 `storage` 需要被修改为实际值

> **注意**: `storageClassName` 必须支持访问模式: `ReadWriteMany`

2. 将 Hadoop 复制到目录 `/opt/soft`

3. 确保 `$HADOOP_HOME` 和 `$HADOOP_CONF_DIR` 正确

### 如何支持本地文件存储而非 HDFS 和 S3？

修改 `values.yaml` 文件中下面的配置项

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

`storageClassName` 和 `storage` 需要被修改为实际值

> **注意**: `storageClassName` 必须支持访问模式: `ReadWriteMany`

### 如何支持 S3 资源存储，例如 MinIO？

以 MinIO 为例: 修改 `values.yaml` 文件中下面的配置项

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

`BUCKET_NAME`, `MINIO_IP`, `MINIO_ACCESS_KEY` 和 `MINIO_SECRET_KEY` 需要被修改为实际值

> **注意**: `MINIO_IP` 只能使用 IP 而非域名, 因为 DolphinScheduler 尚不支持 S3 路径风格访问 (S3 path style access)

### 如何配置 SkyWalking？

修改 `values.yaml` 文件中的 SKYWALKING 配置项

```yaml
common:
  configmap:
    SKYWALKING_ENABLE: "true"
    SW_AGENT_COLLECTOR_BACKEND_SERVICES: "127.0.0.1:11800"
    SW_GRPC_LOG_SERVER_HOST: "127.0.0.1"
    SW_GRPC_LOG_SERVER_PORT: "11800"
```

## 附录-配置

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

我们会持续收集更多的 FAQ。
