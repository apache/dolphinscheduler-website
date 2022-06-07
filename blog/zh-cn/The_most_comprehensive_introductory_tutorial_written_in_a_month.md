# 达人专栏 | 还不会用 Apache Dolphinscheduler？大佬用时一个月写出的最全入门教程

<div align=center>
<img src="/img/2022-05-23/ch/1.png"/>
</div>

作者 | 欧阳涛 招联金融大数据开发工程师

海豚调度(Apache DolphinScheduler，下文简称DS)是分布式易扩展的可视化DAG工作流任务调度系统，致力于解决数据处理流程中错综复杂的依赖关系，使调度系统在数据处理流程中开箱即用。Apache DolphinScheduler作为Apache的顶级开源项目，与其他开源项目相似的地方在于，其运行以及安装都是从脚本开始的。


脚本的位置都是根目录的script文件夹下的，脚本执行顺序如下:


1、查看启动的脚本start-all.sh，可以发现启动4个最重要的启动服务，分别是dolphinscheduler-daemon.sh start  master-server/worker-server/alert-server/api-server


2、在dolphinscheduler-daemon.sh脚本中会首先执行dolphinscheduler-env.sh脚本，这个脚本作用是引入环境，包括Hadoop、Spark、Flink、Hive环境等。由于DS需要调度这些任务，如果不引入这些环境，即使调度成功，执行也无法成功。


3、紧接着在dolphinscheduler-daemon.sh脚本中循环执行上述4个模块下的bin/start.sh.如下图所示：

<div align=center>
<img src="/img/2022-05-23/ch/2.png"/>
</div>

如下图所示：执行dolphinscheduler-daemon.sh start master-server 时会去 master 模块的src/main/bin 执行start.sh，打开start.sh后，可以发现启动了一个MasterServer，其他Worker，Alert以及API模块等同理。

<div align=center>
<img src="/img/2022-05-23/ch/3.png"/>
</div>


至此，从脚本如何运行代码这块就已经结束了，接下来我们将详细介绍一下这4个模块的主要用途。Master主要负责 DAG 任务切分、任务提交监控，并同时监听其它Master和Worker的健康状态等；Worker主要负责任务的执行；Alert是负责警告服务；API负责DS的增删改查业务逻辑，即网页端看到的项目管理、资源管理、安全管理等等。
 

其实，如果大家接触过其他大数据项目，例如Flink、Hdfs、Hbase等，就会发现这些架构都是类似的，像hdfs是NameNode和WorkNode的架构；Hbase是HMasterServer和HRegionServer的架构；Flink是JobManager和TaskManager的架构等，如果你能够熟练掌握这些框架，想必对于DS的掌握也会更容易的了。
 

Master，Worker这些都是通过SpringBoot的启动，创建的对象也都是由Spring托管，如果大家平常接触Spring较多的话，那么笔者认为您理解DS一定会比其他的开源项目更容易。
 

## 备注:

 
1、运行脚本中还有一个python-gateway-server模块，这个模块是用python代码编写工作流的，并不在本文考虑范围之内，所以就暂时忽略，如果详细了解此模块的话，在社区请教其他同学的了。

2、启动Alert脚本是执行Alert模块下的alert-server的脚本，因为Alert也是个父模块的，笔者不打算讲alert-server。相信在看完Master和Worker的执行流程之后，Alert模块应该不难理解。

3、另外，初次接触DS的同学会发现Alert模块有个alert-api模块，笔者想说的是这alert-api和前面所说的api-server没有一丁点关系，api-server是启动api模块的ApiApplicationServer脚本，负责整个DS的业务逻辑的，而alert-api则是负责告警的spi的插件接口，打开alert-api模块可以发这里面的代码全是接口和定义，没有处理任何逻辑的，所以还是很好区分的了。同理task模块下的task-api与alert-api只是职责相同，处理的是不同功能而已。

4、DS的全都是SpringBoot管理的，如果有同学没搞过SpringBoot或者Spring的话，可以参考下列网址以及网上的其他相关资料等。

https://spring.io/quickstart


如果想详细了解警告模块，请参考下方链接以及咨询其他同学。

https://dolphinscheduler.apache.org/zh-cn/blog/Hangzhou_cisco.html

 
Apache DolphinScheduler项目官网的地址为:https://github.com/apache/dolphinscheduler

 
下一章，笔者将介绍DS最重要的两个模块Master和Worker，以及它们如何进行通信的，敬请期待。

