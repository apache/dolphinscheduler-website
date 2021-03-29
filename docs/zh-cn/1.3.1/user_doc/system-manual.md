# 系统使用手册


## 快速上手

  > 请参照[快速上手](quick-start.html)

## 操作指南

### 1. 首页
   首页包含用户所有项目的任务状态统计、流程状态统计、工作流定义统计。
    <p align="center">
     <img src="/img/home.png" width="80%" />
    </p>

### 2. 项目管理
#### 2.1 创建项目
  - 点击"项目管理"进入项目管理页面，点击“创建项目”按钮，输入项目名称，项目描述，点击“提交”，创建新的项目。
  
    <p align="center">
        <img src="/img/project.png" width="80%" />
    </p>

#### 2.2 项目首页
   - 在项目管理页面点击项目名称链接，进入项目首页，如下图所示，项目首页包含该项目的任务状态统计、流程状态统计、工作流定义统计。
     <p align="center">
        <img src="/img/project-home.png" width="80%" />
     </p>
 
 - 任务状态统计：在指定时间范围内，统计任务实例中状态为提交成功、正在运行、准备暂停、暂停、准备停止、停止、失败、成功、需要容错、kill、等待线程的个数
 - 流程状态统计：在指定时间范围内，统计工作流实例中状态为提交成功、正在运行、准备暂停、暂停、准备停止、停止、失败、成功、需要容错、kill、等待线程的个数
 - 工作流定义统计：统计用户创建的工作流定义及管理员授予该用户的工作流定义

#### 2.3 工作流定义
#### <span id=creatDag>2.3.1 创建工作流定义</span>
  - 点击项目管理->工作流->工作流定义，进入工作流定义页面，点击“创建工作流”按钮，进入**工作流DAG编辑**页面，如下图所示：
    <p align="center">
        <img src="/img/dag0.png" width="80%" />
    </p>  
  - 工具栏中拖拽<img src="/img/shell.png" width="35"/>到画板中，新增一个Shell任务,如下图所示：
    <p align="center">
        <img src="/img/shell_dag.png" width="80%" />
    </p>  
  - **添加shell任务的参数设置：**
  1. 填写“节点名称”，“描述”，“脚本”字段；
  1. “运行标志”勾选“正常”，若勾选“禁止执行”，运行工作流不会执行该任务；
  1. 选择“任务优先级”：当worker线程数不足时，级别高的任务在执行队列中会优先执行，相同优先级的任务按照先进先出的顺序执行；
  1. 超时告警（非必选）：勾选超时告警、超时失败，填写“超时时长”，当任务执行时间超过**超时时长**，会发送告警邮件并且任务超时失败；
  1. 资源（非必选）。资源文件是资源中心->文件管理页面创建或上传的文件，如文件名为`test.sh`，脚本中调用资源命令为`sh test.sh`；
  1. 自定义参数（非必填），参考[自定义参数](#UserDefinedParameters)；
  1. 点击"确认添加"按钮，保存任务设置。
  
  - **增加任务执行的先后顺序：** 点击右上角图标<img src="/img/line.png" width="35"/>连接任务；如下图所示，任务2和任务3并行执行，当任务1执行完，任务2、3会同时执行。

    <p align="center">
       <img src="/img/dag2.png" width="80%" />
    </p>

  - **删除依赖关系：** 点击右上角"箭头"图标<img src="/img/arrow.png" width="35"/>，选中连接线，点击右上角"删除"图标<img src="/img/delete.png" width="35"/>，删除任务间的依赖关系。
    <p align="center">
       <img src="/img/dag3.png" width="80%" />
    </p>

  - **保存工作流定义：** 点击”保存“按钮，弹出"设置DAG图名称"弹框，如下图所示，输入工作流定义名称，工作流定义描述，设置全局参数（选填，参考[自定义参数](#UserDefinedParameters)），点击"添加"按钮，工作流定义创建成功。
    <p align="center">
       <img src="/img/dag4.png" width="80%" />
     </p>
  > 其他类型任务，请参考 [任务节点类型和参数设置](#TaskParamers)。
#### 2.3.2  工作流定义操作功能
  点击项目管理->工作流->工作流定义，进入工作流定义页面，如下图所示:
      <p align="center">
          <img src="/img/work_list.png" width="80%" />
      </p>
  工作流定义列表的操作功能如下：
  - **编辑：** 只能编辑"下线"的工作流定义。工作流DAG编辑同[创建工作流定义](#creatDag)。
  - **上线：** 工作流状态为"下线"时，上线工作流，只有"上线"状态的工作流能运行，但不能编辑。
  - **下线：** 工作流状态为"上线"时，下线工作流，下线状态的工作流可以编辑，但不能运行。
  - **运行：** 只有上线的工作流能运行。运行操作步骤见[2.3.3 运行工作流](#runWorkflow)
  - **定时：** 只有上线的工作流能设置定时，系统自动定时调度工作流运行。创建定时后的状态为"下线"，需在定时管理页面上线定时才生效。定时操作步骤见[2.3.4 工作流定时](#creatTiming)。
  - **定时管理：** 定时管理页面可编辑、上线/下线、删除定时。
  - **删除：** 删除工作流定义。
  - **下载：** 下载工作流定义到本地。
  - **树形图：** 以树形结构展示任务节点的类型及任务状态，如下图所示：
    <p align="center">
        <img src="/img/tree.png" width="80%" />
    </p>  

#### <span id=runWorkflow>2.3.3 运行工作流</span>
  - 点击项目管理->工作流->工作流定义，进入工作流定义页面，如下图所示，点击"上线"按钮<img src="/img/online.png" width="35"/>，上线工作流。
    <p align="center">
        <img src="/img/work_list.png" width="80%" />
    </p>

  - 点击”运行“按钮，弹出启动参数设置弹框，如下图所示，设置启动参数，点击弹框中的"运行"按钮，工作流开始运行，工作流实例页面生成一条工作流实例。
     <p align="center">
       <img src="/img/run-work.png" width="80%" />
     </p>  
  <span id=runParamers>工作流运行参数说明：</span> 
       
    * 失败策略：当某一个任务节点执行失败时，其他并行的任务节点需要执行的策略。”继续“表示：某一任务失败后，其他任务节点正常执行；”结束“表示：终止所有正在执行的任务，并终止整个流程。
    * 通知策略：当流程结束，根据流程状态发送流程执行信息通知邮件，包含任何状态都不发，成功发，失败发，成功或失败都发。
    * 流程优先级：流程运行的优先级，分五个等级：最高（HIGHEST），高(HIGH),中（MEDIUM）,低（LOW），最低（LOWEST）。当master线程数不足时，级别高的流程在执行队列中会优先执行，相同优先级的流程按照先进先出的顺序执行。
    * worker分组：该流程只能在指定的worker机器组里执行。默认是Default，可以在任一worker上执行。
    * 通知组：选择通知策略||超时报警||发生容错时，会发送流程信息或邮件到通知组里的所有成员。
    * 收件人：选择通知策略||超时报警||发生容错时，会发送流程信息或告警邮件到收件人列表。
    * 抄送人：选择通知策略||超时报警||发生容错时，会抄送流程信息或告警邮件到抄送人列表。
    * 补数：包括串行补数、并行补数2种模式。串行补数：指定时间范围内，从开始日期至结束日期依次执行补数，只生成一条流程实例；并行补数：指定时间范围内，多天同时进行补数，生成N条流程实例。 
  * 补数： 执行指定日期的工作流定义，可以选择补数时间范围（目前只支持针对连续的天进行补数)，比如需要补5月1号到5月10号的数据，如下图所示： 
    <p align="center">
        <img src="/img/complement.png" width="80%" />
    </p>

    >串行模式：补数从5月1号到5月10号依次执行，流程实例页面生成一条流程实例；
    
    >并行模式：同时执行5月1号到5月10号的任务，流程实例页面生成十条流程实例。

#### <span id=creatTiming>2.3.4 工作流定时</span>
  - 创建定时：点击项目管理->工作流->工作流定义，进入工作流定义页面，上线工作流，点击"定时"按钮<img src="/img/timing.png" width="35"/>,弹出定时参数设置弹框，如下图所示：
    <p align="center">
        <img src="/img/time-schedule.png" width="80%" />
    </p>
  - 选择起止时间。在起止时间范围内，定时运行工作流；不在起止时间范围内，不再产生定时工作流实例。
  - 添加一个每天凌晨5点执行一次的定时，如下图所示：
    <p align="center">
        <img src="/img/time-schedule2.png" width="80%" />
    </p>
  - 失败策略、通知策略、流程优先级、Worker分组、通知组、收件人、抄送人同[工作流运行参数](#runParamers)。
  - 点击"创建"按钮，创建定时成功，此时定时状态为"**下线**"，定时需**上线**才生效。
  - 定时上线：点击"定时管理"按钮<img src="/img/timeManagement.png" width="35"/>，进入定时管理页面，点击"上线"按钮，定时状态变为"上线"，如下图所示，工作流定时生效。
    <p align="center">
        <img src="/img/time-schedule3.png" width="80%" />
    </p>
#### 2.3.5 导入工作流
  点击项目管理->工作流->工作流定义，进入工作流定义页面，点击"导入工作流"按钮，导入本地工作流文件，工作流定义列表显示导入的工作流，状态为下线。

#### 2.4 工作流实例
#### 2.4.1 查看工作流实例
   - 点击项目管理->工作流->工作流实例，进入工作流实例页面，如下图所示：
        <p align="center">
           <img src="/img/instance-list.png" width="80%" />
        </p>           
   -  点击工作流名称，进入DAG查看页面，查看任务执行状态，如下图所示。
      <p align="center">
        <img src="/img/instance-detail.png" width="80%" />
      </p>
#### 2.4.2 查看任务日志
   - 进入工作流实例页面，点击工作流名称，进入DAG查看页面，双击任务节点，如下图所示：
      <p align="center">
        <img src="/img/instanceViewLog.png" width="80%" />
      </p>
   - 点击"查看日志"，弹出日志弹框，如下图所示,任务实例页面也可查看任务日志，参考[任务查看日志](#taskLog)。
      <p align="center">
        <img src="/img/task-log.png" width="80%" />
      </p>
#### 2.4.3 查看任务历史记录
   - 点击项目管理->工作流->工作流实例，进入工作流实例页面，点击工作流名称，进入工作流DAG页面;
   - 双击任务节点，如下图所示，点击"查看历史"，跳转到任务实例页面，并展示该工作流实例运行的任务实例列表
      <p align="center">
        <img src="/img/task_history.png" width="80%" />
      </p>
      
#### 2.4.4 查看运行参数
   - 点击项目管理->工作流->工作流实例，进入工作流实例页面，点击工作流名称，进入工作流DAG页面; 
   - 点击左上角图标<img src="/img/run_params_button.png" width="35"/>，查看工作流实例的启动参数；点击图标<img src="/img/global_param.png" width="35"/>，查看工作流实例的全局参数和局部参数，如下图所示：
      <p align="center">
        <img src="/img/run_params.png" width="80%" />
      </p>      
 
#### 2.4.4 工作流实例操作功能
   点击项目管理->工作流->工作流实例，进入工作流实例页面，如下图所示：          
      <p align="center">
        <img src="/img/instance-list.png" width="80%" />
      </p>

  - **编辑：** 只能编辑已终止的流程。点击"编辑"按钮或工作流实例名称进入DAG编辑页面，编辑后点击"保存"按钮，弹出保存DAG弹框，如下图所示，在弹框中勾选"是否更新到工作流定义"，保存后则更新工作流定义；若不勾选，则不更新工作流定义。
       <p align="center">
         <img src="/img/editDag.png" width="80%" />
       </p>
  - **重跑：** 重新执行已经终止的流程。
  - **恢复失败：** 针对失败的流程，可以执行恢复失败操作，从失败的节点开始执行。
  - **停止：** 对正在运行的流程进行**停止**操作，后台会先`kill`worker进程,再执行`kill -9`操作
  - **暂停：** 对正在运行的流程进行**暂停**操作，系统状态变为**等待执行**，会等待正在执行的任务结束，暂停下一个要执行的任务。
  - **恢复暂停：** 对暂停的流程恢复，直接从**暂停的节点**开始运行
  - **删除：** 删除工作流实例及工作流实例下的任务实例
  - **甘特图：** Gantt图纵轴是某个工作流实例下的任务实例的拓扑排序，横轴是任务实例的运行时间,如图示：         
       <p align="center">
           <img src="/img/gant-pic.png" width="80%" />
       </p>

#### 2.5 任务实例
  - 点击项目管理->工作流->任务实例，进入任务实例页面，如下图所示，点击工作流实例名称，可跳转到工作流实例DAG图查看任务状态。
       <p align="center">
          <img src="/img/task-list.png" width="80%" />
       </p>

  - <span id=taskLog>查看日志：</span>点击操作列中的“查看日志”按钮，可以查看任务执行的日志情况。
       <p align="center">
          <img src="/img/task-log2.png" width="80%" />
       </p>

### 3. 资源中心
#### 3.1 hdfs资源配置
  - 上传资源文件和udf函数，所有上传的文件和资源都会被存储到hdfs上，所以需要以下配置项：
  
```  
conf/common.properties  
    # Users who have permission to create directories under the HDFS root path
    hdfs.root.user=hdfs
    # data base dir, resource file will store to this hadoop hdfs path, self configuration, please make sure the directory exists on hdfs and have read write permissions。"/dolphinscheduler" is recommended
    resource.upload.path=/dolphinscheduler
    # resource storage type : HDFS,S3,NONE
    resource.storage.type=HDFS
    # whether kerberos starts
    hadoop.security.authentication.startup.state=false
    # java.security.krb5.conf path
    java.security.krb5.conf.path=/opt/krb5.conf
    # loginUserFromKeytab user
    login.user.keytab.username=hdfs-mycluster@ESZ.COM
    # loginUserFromKeytab path
    login.user.keytab.path=/opt/hdfs.headless.keytab    
    # if resource.storage.type is HDFS，and your Hadoop Cluster NameNode has HA enabled, you need to put core-site.xml and hdfs-site.xml in the installPath/conf directory. In this example, it is placed under /opt/soft/dolphinscheduler/conf, and configure the namenode cluster name; if the NameNode is not HA, modify it to a specific IP or host name.
    # if S3，write S3 address，HA，for example ：s3a://dolphinscheduler，
    # Note，s3 be sure to create the root directory /dolphinscheduler
    fs.defaultFS=hdfs://mycluster:8020    
    #resourcemanager ha note this need ips , this empty if single
    yarn.resourcemanager.ha.rm.ids=192.168.xx.xx,192.168.xx.xx    
    # If it is a single resourcemanager, you only need to configure one host name. If it is resourcemanager HA, the default configuration is fine
    yarn.application.status.address=http://xxxx:8088/ws/v1/cluster/apps/%s

```

#### 3.2 文件管理

  > 是对各种资源文件的管理，包括创建基本的txt/log/sh/conf/py/java等文件、上传jar包等各种类型文件，可进行编辑、重命名、下载、删除等操作。
  <p align="center">
   <img src="/img/file-manage.png" width="80%" />
 </p>

  * 创建文件
 > 文件格式支持以下几种类型：txt、log、sh、conf、cfg、py、java、sql、xml、hql、properties

<p align="center">
   <img src="/img/file_create.png" width="80%" />
 </p>

  * 上传文件

> 上传文件：点击"上传文件"按钮进行上传，将文件拖拽到上传区域，文件名会自动以上传的文件名称补全

<p align="center">
   <img src="/img/file_upload.png" width="80%" />
 </p>


  * 文件查看

> 对可查看的文件类型，点击文件名称，可查看文件详情

<p align="center">
   <img src="/img/file_detail.png" width="80%" />
 </p>

  * 下载文件

> 点击文件列表的"下载"按钮下载文件或者在文件详情中点击右上角"下载"按钮下载文件

  * 文件重命名

<p align="center">
   <img src="/img/file_rename.png" width="80%" />
 </p>

  * 删除
>  文件列表->点击"删除"按钮，删除指定文件

#### 3.3 UDF管理
#### 3.3.1 资源管理
  > 资源管理和文件管理功能类似，不同之处是资源管理是上传的UDF函数，文件管理上传的是用户程序，脚本及配置文件
  > 操作功能：重命名、下载、删除。

  * 上传udf资源
  > 和上传文件相同。
  

#### 3.3.2 函数管理

  * 创建udf函数
  > 点击“创建UDF函数”，输入udf函数参数，选择udf资源，点击“提交”，创建udf函数。

 > 目前只支持HIVE的临时UDF函数

  - UDF函数名称：输入UDF函数时的名称
  - 包名类名：输入UDF函数的全路径  
  - UDF资源：设置创建的UDF对应的资源文件

<p align="center">
   <img src="/img/udf_edit.png" width="80%" />
 </p>


### 4. 创建数据源
  > 数据源中心支持MySQL、POSTGRESQL、HIVE/IMPALA、SPARK、CLICKHOUSE、ORACLE、SQLSERVER等数据源

#### 4.1 创建/编辑MySQL数据源

  - 点击“数据源中心->创建数据源”，根据需求创建不同类型的数据源。

  - 数据源：选择MYSQL
  - 数据源名称：输入数据源的名称
  - 描述：输入数据源的描述
  - IP主机名：输入连接MySQL的IP
  - 端口：输入连接MySQL的端口
  - 用户名：设置连接MySQL的用户名
  - 密码：设置连接MySQL的密码
  - 数据库名：输入连接MySQL的数据库名称
  - Jdbc连接参数：用于MySQL连接的参数设置，以JSON形式填写

<p align="center">
   <img src="/img/mysql_edit.png" width="80%" />
 </p>

  > 点击“测试连接”，测试数据源是否可以连接成功。

#### 4.2 创建/编辑POSTGRESQL数据源

- 数据源：选择POSTGRESQL
- 数据源名称：输入数据源的名称
- 描述：输入数据源的描述
- IP/主机名：输入连接POSTGRESQL的IP
- 端口：输入连接POSTGRESQL的端口
- 用户名：设置连接POSTGRESQL的用户名
- 密码：设置连接POSTGRESQL的密码
- 数据库名：输入连接POSTGRESQL的数据库名称
- Jdbc连接参数：用于POSTGRESQL连接的参数设置，以JSON形式填写

<p align="center">
   <img src="/img/postgresql_edit.png" width="80%" />
 </p>

#### 4.3 创建/编辑HIVE数据源

1.使用HiveServer2方式连接

 <p align="center">
    <img src="/img/hive_edit.png" width="80%" />
  </p>

  - 数据源：选择HIVE
  - 数据源名称：输入数据源的名称
  - 描述：输入数据源的描述
  - IP/主机名：输入连接HIVE的IP
  - 端口：输入连接HIVE的端口
  - 用户名：设置连接HIVE的用户名
  - 密码：设置连接HIVE的密码
  - 数据库名：输入连接HIVE的数据库名称
  - Jdbc连接参数：用于HIVE连接的参数设置，以JSON形式填写

2.使用HiveServer2 HA Zookeeper方式连接

 <p align="center">
    <img src="/img/hive_edit2.png" width="80%" />
  </p>


注意：如果开启了**kerberos**，则需要填写 **Principal**
<p align="center">
    <img src="/img/hive_kerberos.png" width="80%" />
  </p>




#### 4.4 创建/编辑Spark数据源

<p align="center">
   <img src="/img/spark_datesource.png" width="80%" />
 </p>

- 数据源：选择Spark
- 数据源名称：输入数据源的名称
- 描述：输入数据源的描述
- IP/主机名：输入连接Spark的IP
- 端口：输入连接Spark的端口
- 用户名：设置连接Spark的用户名
- 密码：设置连接Spark的密码
- 数据库名：输入连接Spark的数据库名称
- Jdbc连接参数：用于Spark连接的参数设置，以JSON形式填写



注意：如果开启了**kerberos**，则需要填写 **Principal**

<p align="center">
    <img src="/img/sparksql_kerberos.png" width="80%" />
  </p>



### 5. 安全中心（权限系统）

     * 安全中心只有管理员账户才有权限操作，分别有队列管理、租户管理、用户管理、告警组管理、worker分组管理、令牌管理等功能，在用户管理模块可以对资源、数据源、项目等授权
     * 管理员登录，默认用户名密码：admin/dolphinscheduler123

#### 5.1 创建队列
  - 队列是在执行spark、mapreduce等程序，需要用到“队列”参数时使用的。
  - 管理员进入安全中心->队列管理页面，点击“创建队列”按钮，创建队列。
 <p align="center">
    <img src="/img/create-queue.png" width="80%" />
  </p>


#### 5.2 添加租户
  - 租户对应的是Linux的用户，用于worker提交作业所使用的用户。如果linux没有这个用户，worker会在执行脚本的时候创建这个用户。
  - 租户编码：**租户编码是Linux上的用户，唯一，不能重复**
  - 管理员进入安全中心->租户管理页面，点击“创建租户”按钮，创建租户。

 <p align="center">
    <img src="/img/addtenant.png" width="80%" />
  </p>

#### 5.3 创建普通用户
  -  用户分为**管理员用户**和**普通用户**
  
    * 管理员有授权和用户管理等权限，没有创建项目和工作流定义的操作的权限。
    * 普通用户可以创建项目和对工作流定义的创建，编辑，执行等操作。
    * 注意：如果该用户切换了租户，则该用户所在租户下所有资源将复制到切换的新租户下。
  - 管理员进入安全中心->用户管理页面，点击“创建用户”按钮，创建用户。        
<p align="center">
   <img src="/img/useredit2.png" width="80%" />
 </p>
  
  > **编辑用户信息** 
   - 管理员进入安全中心->用户管理页面，点击"编辑"按钮，编辑用户信息。
   - 普通用户登录后，点击用户名下拉框中的用户信息，进入用户信息页面，点击"编辑"按钮，编辑用户信息。
  
  > **修改用户密码** 
   - 管理员进入安全中心->用户管理页面，点击"编辑"按钮，编辑用户信息时，输入新密码修改用户密码。
   - 普通用户登录后，点击用户名下拉框中的用户信息，进入修改密码页面，输入密码并确认密码后点击"编辑"按钮，则修改密码成功。
   

#### 5.4 创建告警组
  * 告警组是在启动时设置的参数，在流程结束以后会将流程的状态和其他信息以邮件形式发送给告警组。
  - 管理员进入安全中心->告警组管理页面，点击“创建告警组”按钮，创建告警组。

  <p align="center">
    <img src="/img/mail_edit.png" width="80%" />
  </p>


#### 5.5 令牌管理
  > 由于后端接口有登录检查，令牌管理提供了一种可以通过调用接口的方式对系统进行各种操作。
  - 管理员进入安全中心->令牌管理页面，点击“创建令牌”按钮，选择失效时间与用户，点击"生成令牌"按钮，点击"提交"按钮，则选择用户的token创建成功。

  <p align="center">
      <img src="/img/creat_token.png" width="80%" />
   </p>
  
  - 普通用户登录后，点击用户名下拉框中的用户信息，进入令牌管理页面，选择失效时间，点击"生成令牌"按钮，点击"提交"按钮，则该用户创建token成功。
    
  - 调用示例：
  
```令牌调用示例
    /**
     * test token
     */
    public  void doPOSTParam()throws Exception{
        // create HttpClient
        CloseableHttpClient httpclient = HttpClients.createDefault();

        // create http post request
        HttpPost httpPost = new HttpPost("http://127.0.0.1:12345/escheduler/projects/create");
        httpPost.setHeader("token", "123");
        // set parameters
        List<NameValuePair> parameters = new ArrayList<NameValuePair>();
        parameters.add(new BasicNameValuePair("projectName", "qzw"));
        parameters.add(new BasicNameValuePair("desc", "qzw"));
        UrlEncodedFormEntity formEntity = new UrlEncodedFormEntity(parameters);
        httpPost.setEntity(formEntity);
        CloseableHttpResponse response = null;
        try {
            // execute
            response = httpclient.execute(httpPost);
            // response status code 200
            if (response.getStatusLine().getStatusCode() == 200) {
                String content = EntityUtils.toString(response.getEntity(), "UTF-8");
                System.out.println(content);
            }
        } finally {
            if (response != null) {
                response.close();
            }
            httpclient.close();
        }
    }
```

#### 5.6 授予权限

    * 授予权限包括项目权限，资源权限，数据源权限，UDF函数权限。
    * 管理员可以对普通用户进行非其创建的项目、资源、数据源和UDF函数进行授权。因为项目、资源、数据源和UDF函数授权方式都是一样的，所以以项目授权为例介绍。
    * 注意：对于用户自己创建的项目，该用户拥有所有的权限。则项目列表和已选项目列表中不会显示。
 
  - 管理员进入安全中心->用户管理页面，点击需授权用户的“授权”按钮，如下图所示：
  <p align="center">
   <img src="/img/auth_user.png" width="80%" />
 </p>

  - 选择项目，进行项目授权。

<p align="center">
   <img src="/img/auth_project.png" width="80%" />
 </p>
  
  - 资源、数据源、UDF函数授权同项目授权。

### 6. 监控中心

#### 6.1 服务管理
  - 服务管理主要是对系统中的各个服务的健康状况和基本信息的监控和显示

#### 6.1.1 master监控
  - 主要是master的相关信息。
<p align="center">
   <img src="/img/master-jk.png" width="80%" />
 </p>

#### 6.1.2 worker监控
  - 主要是worker的相关信息。

<p align="center">
   <img src="/img/worker-jk.png" width="80%" />
 </p>

#### 6.1.3 Zookeeper监控
  - 主要是zookpeeper中各个worker和master的相关配置信息。

<p align="center">
   <img src="/img/zk-jk.png" width="80%" />
 </p>

#### 6.1.4 DB监控
  - 主要是DB的健康状况

<p align="center">
   <img src="/img/mysql-jk.png" width="80%" />
 </p>
 
#### 6.2 统计管理
<p align="center">
   <img src="/img/Statistics.png" width="80%" />
 </p>
 
  - 待执行命令数：统计t_ds_command表的数据
  - 执行失败的命令数：统计t_ds_error_command表的数据
  - 待运行任务数：统计Zookeeper中task_queue的数据
  - 待杀死任务数：统计Zookeeper中task_kill的数据
 
### 7. <span id=TaskParamers>任务节点类型和参数设置</span>

#### 7.1 Shell节点
  > shell节点，在worker执行的时候，会生成一个临时shell脚本，使用租户同名的linux用户执行这个脚本。
  - 点击项目管理-项目名称-工作流定义，点击"创建工作流"按钮，进入DAG编辑页面。
  - 工具栏中拖动<img src="/img/shell.png" width="35"/>到画板中，如下图所示：

    <p align="center">
        <img src="/img/shell_dag.png" width="80%" />
    </p> 

- 节点名称：一个工作流定义中的节点名称是唯一的。
- 运行标志：标识这个节点是否能正常调度,如果不需要执行，可以打开禁止执行开关。
- 描述信息：描述该节点的功能。
- 任务优先级：worker线程数不足时，根据优先级从高到低依次执行，优先级一样时根据先进先出原则执行。
- Worker分组：任务分配给worker组的机器机执行，选择Default，会随机选择一台worker机执行。
- 失败重试次数：任务失败重新提交的次数，支持下拉和手填。
- 失败重试间隔：任务失败重新提交任务的时间间隔，支持下拉和手填。
- 超时告警：勾选超时告警、超时失败，当任务超过"超时时长"后，会发送告警邮件并且任务执行失败.
- 脚本：用户开发的SHELL程序。
- 资源：是指脚本中需要调用的资源文件列表，资源中心-文件管理上传或创建的文件。
- 自定义参数：是SHELL局部的用户自定义参数，会替换脚本中以${变量}的内容。

#### 7.2 子流程节点
  - 子流程节点，就是把外部的某个工作流定义当做一个任务节点去执行。
> 拖动工具栏中的![PNG](https://analysys.github.io/easyscheduler_docs_cn/images/toolbar_SUB_PROCESS.png)任务节点到画板中，如下图所示：

<p align="center">
   <img src="/img/subprocess_edit.png" width="80%" />
 </p>

- 节点名称：一个工作流定义中的节点名称是唯一的
- 运行标志：标识这个节点是否能正常调度
- 描述信息：描述该节点的功能
- 超时告警：勾选超时告警、超时失败，当任务超过"超时时长"后，会发送告警邮件并且任务执行失败.
- 子节点：是选择子流程的工作流定义，右上角进入该子节点可以跳转到所选子流程的工作流定义

#### 7.3 依赖(DEPENDENT)节点
  - 依赖节点，就是**依赖检查节点**。比如A流程依赖昨天的B流程执行成功，依赖节点会去检查B流程在昨天是否有执行成功的实例。

> 拖动工具栏中的![PNG](https://analysys.github.io/easyscheduler_docs_cn/images/toolbar_DEPENDENT.png)任务节点到画板中，如下图所示：

<p align="center">
   <img src="/img/dependent_edit.png" width="80%" />
 </p>

  > 依赖节点提供了逻辑判断功能，比如检查昨天的B流程是否成功，或者C流程是否执行成功。

  <p align="center">
   <img src="/img/depend-node.png" width="80%" />
 </p>

  > 例如，A流程为周报任务，B、C流程为天任务，A任务需要B、C任务在上周的每一天都执行成功，如图示：

 <p align="center">
   <img src="/img/depend-node2.png" width="80%" />
 </p>

  > 假如，周报A同时还需要自身在上周二执行成功：

 <p align="center">
   <img src="/img/depend-node3.png" width="80%" />
 </p>

#### 7.4 存储过程节点
  - 根据选择的数据源，执行存储过程。
> 拖动工具栏中的![PNG](https://analysys.github.io/easyscheduler_docs_cn/images/toolbar_PROCEDURE.png)任务节点到画板中，如下图所示：

<p align="center">
   <img src="/img/procedure_edit.png" width="80%" />
 </p>

- 数据源：存储过程的数据源类型支持MySQL和POSTGRESQL两种，选择对应的数据源
- 方法：是存储过程的方法名称
- 自定义参数：存储过程的自定义参数类型支持IN、OUT两种，数据类型支持VARCHAR、INTEGER、LONG、FLOAT、DOUBLE、DATE、TIME、TIMESTAMP、BOOLEAN九种数据类型

#### 7.5 SQL节点
  - 拖动工具栏中的![PNG](https://analysys.github.io/easyscheduler_docs_cn/images/toolbar_SQL.png)任务节点到画板中
  - 非查询SQL功能：编辑非查询SQL任务信息，sql类型选择非查询，如下图所示：
  <p align="center">
   <img src="/img/sql-node.png" width="80%" />
 </p>

  - 查询SQL功能：编辑查询SQL任务信息，sql类型选择查询，选择表格或附件形式发送邮件到指定的收件人，如下图所示。

<p align="center">
   <img src="/img/sql-node2.png" width="80%" />
 </p>

- 数据源：选择对应的数据源
- sql类型：支持查询和非查询两种，查询是select类型的查询，是有结果集返回的，可以指定邮件通知为表格、附件或表格附件三种模板。非查询是没有结果集返回的，是针对update、delete、insert三种类型的操作。
- sql参数：输入参数格式为key1=value1;key2=value2…
- sql语句：SQL语句
- UDF函数：对于HIVE类型的数据源，可以引用资源中心中创建的UDF函数,其他类型的数据源暂不支持UDF函数。
- 自定义参数：SQL任务类型，而存储过程是自定义参数顺序的给方法设置值自定义参数类型和数据类型同存储过程任务类型一样。区别在于SQL任务类型自定义参数会替换sql语句中${变量}。
- 前置sql:前置sql在sql语句之前执行。
- 后置sql:后置sql在sql语句之后执行。


#### 7.6 SPARK节点
  - 通过SPARK节点，可以直接直接执行SPARK程序，对于spark节点，worker会使用`spark-submit`方式提交任务

> 拖动工具栏中的![PNG](https://analysys.github.io/easyscheduler_docs_cn/images/toolbar_SPARK.png)任务节点到画板中，如下图所示：

<p align="center">
   <img src="/img/spark_edit.png" width="80%" />
 </p>

- 程序类型：支持JAVA、Scala和Python三种语言
- 主函数的class：是Spark程序的入口Main Class的全路径
- 主jar包：是Spark的jar包
- 部署方式：支持yarn-cluster、yarn-client和local三种模式
- Driver内核数：可以设置Driver内核数及内存数
- Executor数量：可以设置Executor数量、Executor内存数和Executor内核数
- 命令行参数：是设置Spark程序的输入参数，支持自定义参数变量的替换。
- 其他参数：支持 --jars、--files、--archives、--conf格式
- 资源：如果其他参数中引用了资源文件，需要在资源中选择指定
- 自定义参数：是MR局部的用户自定义参数，会替换脚本中以${变量}的内容

 注意：JAVA和Scala只是用来标识，没有区别，如果是Python开发的Spark则没有主函数的class，其他都是一样

#### 7.7 MapReduce(MR)节点
  - 使用MR节点，可以直接执行MR程序。对于mr节点，worker会使用`hadoop jar`方式提交任务


> 拖动工具栏中的![PNG](https://analysys.github.io/easyscheduler_docs_cn/images/toolbar_MR.png)任务节点到画板中，如下图所示：

 1. JAVA程序

 <p align="center">
   <img src="/img/mr_java.png" width="80%" />
 </p>
 
- 主函数的class：是MR程序的入口Main Class的全路径
- 程序类型：选择JAVA语言 
- 主jar包：是MR的jar包
- 命令行参数：是设置MR程序的输入参数，支持自定义参数变量的替换
- 其他参数：支持 –D、-files、-libjars、-archives格式
- 资源： 如果其他参数中引用了资源文件，需要在资源中选择指定
- 自定义参数：是MR局部的用户自定义参数，会替换脚本中以${变量}的内容

2. Python程序

<p align="center">
   <img src="/img/mr_edit.png" width="80%" />
 </p>

- 程序类型：选择Python语言 
- 主jar包：是运行MR的Python jar包
- 其他参数：支持 –D、-mapper、-reducer、-input  -output格式，这里可以设置用户自定义参数的输入，比如：
- -mapper  "mapper.py 1"  -file mapper.py   -reducer reducer.py  -file reducer.py –input /journey/words.txt -output /journey/out/mr/${currentTimeMillis}
- 其中 -mapper 后的 mapper.py 1是两个参数，第一个参数是mapper.py，第二个参数是1
- 资源： 如果其他参数中引用了资源文件，需要在资源中选择指定
- 自定义参数：是MR局部的用户自定义参数，会替换脚本中以${变量}的内容

#### 7.8 Python节点
  - 使用python节点，可以直接执行python脚本，对于python节点，worker会使用`python **`方式提交任务。


> 拖动工具栏中的![PNG](https://analysys.github.io/easyscheduler_docs_cn/images/toolbar_PYTHON.png)任务节点到画板中，如下图所示：

<p align="center">
   <img src="/img/python_edit.png" width="80%" />
 </p>

- 脚本：用户开发的Python程序
- 资源：是指脚本中需要调用的资源文件列表
- 自定义参数：是Python局部的用户自定义参数，会替换脚本中以${变量}的内容
- 注意：若引入资源目录树下的python文件，需添加__init__.py文件

#### 7.9 Flink节点
  - 拖动工具栏中的<img src="/img/flink.png" width="35"/>任务节点到画板中，如下图所示：

<p align="center">
  <img src="/img/flink_edit.png" width="80%" />
</p>


- 程序类型：支持JAVA、Scala和Python三种语言
- 主函数的class：是Flink程序的入口Main Class的全路径
- 主jar包：是Flink的jar包
- 部署方式：支持cluster、local三种模式
- slot数量：可以设置slot数
- taskManage数量：可以设置taskManage数
- jobManager内存数：可以设置jobManager内存数
- taskManager内存数：可以设置taskManager内存数
- 命令行参数：是设置Spark程序的输入参数，支持自定义参数变量的替换。
- 其他参数：支持 --jars、--files、--archives、--conf格式
- 资源：如果其他参数中引用了资源文件，需要在资源中选择指定
- 自定义参数：是Flink局部的用户自定义参数，会替换脚本中以${变量}的内容

 注意：JAVA和Scala只是用来标识，没有区别，如果是Python开发的Flink则没有主函数的class，其他都是一样

#### 7.10 http节点  

  - 拖动工具栏中的<img src="/img/http.png" width="35"/>任务节点到画板中，如下图所示：

<p align="center">
   <img src="/img/http_edit.png" width="80%" />
 </p>

- 节点名称：一个工作流定义中的节点名称是唯一的。
- 运行标志：标识这个节点是否能正常调度,如果不需要执行，可以打开禁止执行开关。
- 描述信息：描述该节点的功能。
- 任务优先级：worker线程数不足时，根据优先级从高到低依次执行，优先级一样时根据先进先出原则执行。
- Worker分组：任务分配给worker组的机器机执行，选择Default，会随机选择一台worker机执行。
- 失败重试次数：任务失败重新提交的次数，支持下拉和手填。
- 失败重试间隔：任务失败重新提交任务的时间间隔，支持下拉和手填。
- 超时告警：勾选超时告警、超时失败，当任务超过"超时时长"后，会发送告警邮件并且任务执行失败.
- 请求地址：http请求URL。
- 请求类型：支持GET、POSt、HEAD、PUT、DELETE。
- 请求参数：支持Parameter、Body、Headers。
- 校验条件：支持默认响应码、自定义响应码、内容包含、内容不包含。
- 校验内容：当校验条件选择自定义响应码、内容包含、内容不包含时，需填写校验内容。
- 自定义参数：是http局部的用户自定义参数，会替换脚本中以${变量}的内容。

#### 7.11 DATAX节点

  - 拖动工具栏中的<img src="/img/datax.png" width="35"/>任务节点到画板中

  <p align="center">
   <img src="/img/datax_edit.png" width="80%" />
  </p>

- 自定义模板：打开自定义模板开关时，可以自定义datax节点的json配置文件内容（适用于控件配置不满足需求时）
- 数据源：选择抽取数据的数据源
- sql语句：目标库抽取数据的sql语句，节点执行时自动解析sql查询列名，映射为目标表同步列名，源表和目标表列名不一致时，可以通过列别名（as）转换
- 目标库：选择数据同步的目标库
- 目标表：数据同步的目标表名
- 前置sql:前置sql在sql语句之前执行（目标库执行）。
- 后置sql:后置sql在sql语句之后执行（目标库执行）。
- json：datax同步的json配置文件
- 自定义参数：SQL任务类型，而存储过程是自定义参数顺序的给方法设置值自定义参数类型和数据类型同存储过程任务类型一样。区别在于SQL任务类型自定义参数会替换sql语句中${变量}。

#### 8. 参数
#### 8.1 系统参数

<table>
    <tr><th>变量</th><th>含义</th></tr>
    <tr>
        <td>${system.biz.date}</td>
        <td>日常调度实例定时的定时时间前一天，格式为 yyyyMMdd，补数据时，该日期 +1</td>
    </tr>
    <tr>
        <td>${system.biz.curdate}</td>
        <td>日常调度实例定时的定时时间，格式为 yyyyMMdd，补数据时，该日期 +1</td>
    </tr>
    <tr>
        <td>${system.datetime}</td>
        <td>日常调度实例定时的定时时间，格式为 yyyyMMddHHmmss，补数据时，该日期 +1</td>
    </tr>
</table>


#### 8.2 时间自定义参数

  - 支持代码中自定义变量名，声明方式：${变量名}。可以是引用 "系统参数" 或指定 "常量"。

  - 我们定义这种基准变量为 $[...] 格式的，$[yyyyMMddHHmmss] 是可以任意分解组合的，比如：$[yyyyMMdd], $[HHmmss], $[yyyy-MM-dd] 等

  - 也可以使用以下格式：
  

        * 后 N 年：$[add_months(yyyyMMdd,12*N)]
        * 前 N 年：$[add_months(yyyyMMdd,-12*N)]
        * 后 N 月：$[add_months(yyyyMMdd,N)]
        * 前 N 月：$[add_months(yyyyMMdd,-N)]
        * 后 N 周：$[yyyyMMdd+7*N]
        * 前 N 周：$[yyyyMMdd-7*N]
        * 后 N 天：$[yyyyMMdd+N]
        * 前 N 天：$[yyyyMMdd-N]
        * 后 N 小时：$[HHmmss+N/24]
        * 前 N 小时：$[HHmmss-N/24]
        * 后 N 分钟：$[HHmmss+N/24/60]
        * 前 N 分钟：$[HHmmss-N/24/60]

#### 8.3 <span id=UserDefinedParameters>用户自定义参数</span>

  - 用户自定义参数分为全局参数和局部参数。全局参数是保存工作流定义和工作流实例的时候传递的全局参数，全局参数可以在整个流程中的任何一个任务节点的局部参数引用。
    例如：

<p align="center">
   <img src="/img/local_parameter.png" width="80%" />
 </p>

  - global_bizdate为全局参数，引用的是系统参数。

<p align="center">
   <img src="/img/global_parameter.png" width="80%" />
 </p>

 - 任务中local_param_bizdate通过\${global_bizdate}来引用全局参数，对于脚本可以通过\${local_param_bizdate}来引全局变量global_bizdate的值，或通过JDBC直接将local_param_bizdate的值set进去
