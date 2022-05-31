# 3.0.0 alpha 重磅发布！九大新功能、全新 UI 解锁调度系统新能力

<div align=center>

<img src="/img/2020-04-25/1.jpeg"/>

</div>

>2022 年 4 月 22 日，Apache DolphinScheduler 正式宣布 3.0.0 alpha 版本发布！此次版本升级迎来了自发版以来的最大变化，众多全新功能和特性为用户带来新的体验和价值。
>3.0.0-alpha 的关键字，总结起来是 “更快、更现代化、更强、更易维护”。
* **更快、更现代化：** 重构了 UI 界面，新 UI 不仅用户响应速度提高数十倍，开发者构建速度也提高数百倍，且页面布局、图标样式都更加现代化；
* **更强：** 带来了许多振奋人心的新功能，如数据质量评估、自定义时区、支持 AWS，并新增多个任务插件和多个告警插件；
* **更易维护：** 后端服务拆分更加符合容器化和微服务化的发展趋势，还能明确各个服务的职责，让维护更加简单。
## **新功能和新特性**

### 全新 UI，前端代码更健壮，速度更快

3.0.0-alpha 最大的变化是引入了新的 UI，切换语言页面无需重新加载，并且新增了深色主题。新 UI 使用了 Vue3、TSX、Vite 相关技术栈。对比旧版 UI，新 UI 不仅更加现代化，操作也更加人性化，前端的鲁棒性也更强，使用户在编译时一旦发现代码中的问题，可以对接口参数进行校验，从而使前端代码更加健壮。

此外，新架构和新技术栈不仅能让用户在操作 Apache DolphinScheduler 时响应速度有数十倍的提升，同时开发者本地编译和启动 UI 的速度有了数百倍的提升，这将大大缩短开发者调试和打包代码所需的时间。

新 UI 使用体验：

<div align=center>

<img src="/img/2020-04-25/2.png"/>

</div>

本地启动耗时对比

<div align=center>

<img src="/img/2020-04-25/3.png"/>

</div>

首页

<div align=center>

<img src="/img/2020-04-25/4.png"/>

</div>

工作流实例页面

<div align=center>

<img src="/img/2020-04-25/5.jpeg"/>

</div>

Shell 任务页面

<div align=center>

<img src="/img/2020-04-25/6.png"/>

</div>

MySQL 数据源页面


### 支持 AWS

随着 Apache DolphinScheduler 用户群体越来越丰富，吸引了很多海外用户。但在海外业务场景下，用户在调研过程中发现有两个影响用户便捷体验 Apache DolphinScheduler 的点，一个是时区问题，另一个则是对海外云厂商，尤其是对 AWS 的支持不足。为此，我们决定对AWS 较为重要的组件进行支持，这也是此版本的最重大的变化之一。

目前，Apache DolphinScheduler 对 AWS 的支持已经涵盖 **Amazon EMR** 和 **Amazon Redshift**两个 AWS 的任务类型，并实现了资源中心支持 **Amazon S3 存储**。

* 针对 Amazon EMR，我们创建了一个新的任务类型，并提供了其 Run Job Flow 的功能，允许用户向 Amazon EMR 提交多个 steps 作业，并指定使用的资源数量。详情可见：[https://dolphinscheduler.apache.org/zh-cn/docs/latest/user_doc/guide/task/emr.html](https://dolphinscheduler.apache.org/zh-cn/docs/latest/user_doc/guide/task/emr.html)
<div align=center>

<img src="/img/2020-04-25/7.png"/>

</div>

Amazon EMR 任务定义

* 对于 Amazon Redshift，我们目前在 SQL 任务类型中扩展了对 Amazon Redshift 数据源的支持，现在用户可以在 SQL 任务中选择 Redshift 数据源来运行 Amazon Redshift 任务。
<div align=center>

<img src="/img/2020-04-25/8.png"/>

</div>

Amazon Redshift 支持

对于 Amazon S3，我们扩展了 Apache DolphinScheduler 的资源中心，使其不仅能支持本地资源、HDFS 资源存储，同时支持 Amazon S3 作为资源中心的储存。详情可见：[https://dolphinscheduler.apache.org/zh-cn/docs/3.0.0/user_doc/guide/resource/configuration.html](https://dolphinscheduler.apache.org/zh-cn/docs/3.0.0/user_doc/guide/resource/configuration.html)中的

```plain
`resource.storage.type`
```

后续我们将用户的实际需求支持更多 AWS 任务，敬请期待。

### 服务拆分

全新的 UI 是 3.0.0-alpha 前端的最大变化，而后端最大的变化就是对服务进行拆分。考虑到容器和微服务的概念越来越火热，Apache DolphinScheduler 开发者做出了重大决定：对后端服务进行拆分。按照职能，我们将服务拆分成了以下几部分：

* master-server: master服务
* worker-server: worker服务
* api-server: API服务
* alert-server: 告警服务
* standalone-server: standalone用于快速体验 dolphinscheduler 功能
* ui: UI资源
* bin: 快速启动脚本，主要是启动各个服务的脚本
* tools: 工具相关脚本，主要包含数据库创建，更新脚本
所有的服务都可以通过执行下面的命令进行启动或者停止。

```plain
`bin/dolphinscheduler-daemon.sh <start|stop> <server-name>`
```

### 
### 数据质量校验

此版本中，用户期待已久的数据质量校验应用功能上线，解决了从源头同步的数据条数准确性，单表或多表周均、月均波动超过阈值告警等数据质量问题。Apache DolphinScheduler 此前版本解决了将任务以特定顺序和时间运行的问题，但数据运行完之后对数据的质量一直没有较为通用的衡量标准，用户需要付出额外的开发成本。

现在，3.0.0-alpha 已经实现了数据质量原生支持，支持在工作流运行前进行数据质量校验过程，通过在数据质量功能模块中，由用户自定义数据质量的校验规则，实现了任务运行过程中对数据质量的严格控制和运行结果的监控。

<div align=center>

<img src="/img/2020-04-25/9.png"/>

</div>

<div align=center>

<img src="/img/2020-04-25/10.png"/>

</div>

### 任务组

任务组主要用于控制任务实例并发并明确组内优先级。用户在新建任务定义时，可配置当前任务对应的任务组，并配置任务在任务组内运行的优先级。当任务配置了任务组后，任务的执行除了要满足上游任务全部成功外，还需要满足当前任务组正在运行的任务小于资源池的大小。当大于或者等于资源池大小时，任务会进入等待状态等待下一次检查。当任务组中多个任务同时进到待运行队列中时，会先运行优先级高的任务。

详见链接：[https://dolphinscheduler.apache.org/zh-cn/docs/latest/user_doc/guide/resource/configuration.html](https://dolphinscheduler.apache.org/zh-cn/docs/latest/user_doc/guide/resource/configuration.html)

<div align=center>

<img src="/img/2020-04-25/11.png"/>

</div>

<div align=center>

<img src="/img/2020-04-25/12.png"/>

</div>

### 自定义时区

在 3.0.0-alpha 之前版本，Apache DolphinScheduler 默认的时间是 UTC+8 时区，但随着用户群体扩大，海外用户和在海外开展跨时区业务的用户在使用中经常被时区所困扰。3.0.0-alpha 支持时区切换后，时区问题迎刃而解，满足了海外用户和出海业务伙伴的需求。例如，如当企业业务涉及的时区包含东八区和西五区，如果想要使用同一个 DolphinScheduler 集群，可以分别创建多个用户，每个用户使用自己当地的时区，对应 DolphinScheduler 对象显示的时间均会切换为对应时区的当地时间，更加符合当地开发者的使用习惯。

<div align=center>

<img src="/img/2020-04-25/13.png"/>

</div>

详见链接：[https://dolphinscheduler.apache.org/zh-cn/docs/3.0.0/user_doc/guide/howto/general-setting.html](https://dolphinscheduler.apache.org/zh-cn/docs/3.0.0/user_doc/guide/howto/general-setting.html)

### 任务定义列表

使用 Apache DolphinScheduler 3.0.0-alpha 此前版本，用户如果想要操作任务，需要先找到对应的工作流，并在工作流中定位到任务的位置之后才能编辑。然而，当工作流数量变多或单个工作流有较多的任务时，找到对应任务的过程将会变得非常痛苦，这不符合 Apache DolphinScheduler 所追求的 easy to use 理念。所以，我们在 3.0.0-alpha 中增加了任务定义页面，让用户可以通过任务名称快速定位到任务，并对任务进行操作，轻松实现批量任务变更。

详见链接：[https://dolphinscheduler.apache.org/zh-cn/docs/latest/user_doc/guide/project/task-definition.html](https://dolphinscheduler.apache.org/zh-cn/docs/latest/user_doc/guide/project/task-definition.html)

### 新增告警类型

与此同时，3.0.0-alpha 告警类型也增加了对 Telegram、Webexteams 告警类型的支持。

### Python API 新功能

3.0.0-alpha 中，Python API 最大的变化是将对应的 PythonGatewayServer 集成到了 API-Server 服务，使得开启对外服务更加规整，且缓解了因服务拆分导致的二进制包变大的问题。同时，Python API 还增加了 CLI 和 configuration 模块，让用户可以自定义配置文件，修改配置更加便捷。

### 其他新功能

除了上述功能外，3.0.0-alpha 版本还进行了很多细节功能增强，如重构任务插件、数据源插件模块，让扩展更简单；恢复了对 Spark SQL 的支持；E2E 测试已经完美兼容新 UI 等。

## **主要优化项**

[#8584] 任务后端插件优化，新插件只需要修改插件自带的模块

[#8874] 在工作流下提交/创建 cron 时验证结束时间和开始时间

[#9016] Dependent 添加依赖时可以选择全局项目

[#9221] AlertSender 优化及关闭优化，如 MasterServer

[#9228] 实现使用 slot 扫描数据库

[#9230] python gateway server 集成到 apiserver 来减少二进制包大小

[#9372] [python] 将 pythonGatewayServer 迁移到 api 服务器

[#9443] [python] 添加缺失的配置和连接远程服务器文档

[#8719] [Master/Worker] 将任务 ack 更改为运行回调

[#9293] [Master] 添加任务事件线程池

## **主要 Bug 修复**

[#7236] 修复使用 S3a Minio 创建租户失败的问题

[#7416] 修复文本文件 busy 的问题

[#7896] 修复项目授权时生成一个重复授权项目的问题

[#8089] 修复因无法连接到 PostgreSQL 而启动服务器失败的问题

[#8183] 修复消息显示找不到数据源插件“Spark”的问题

[#8202] 修复 MapReduce 生成的命令内置参数位置错误的问题

[#8751] 解决更改参数用户，队列在 ProcessDefinition 中失效的问题

[#8756] 解决使用依赖组件的进程无法在测试和生产环境之间迁移

[#8760] 解决了资源文件删除条件的问题

[#8791] 修复编辑复制节点的表单时影响原始节点数据的问题

[#8951] 解决了 Worker 资源耗尽并导致停机的问题

[#9243] 解决了某些类型的警报无法显示项目名称的问题

## **Release Note**

 [https://github.com/apache/dolphinscheduler/releases/tag/3.0.0-alpha](https://github.com/apache/dolphinscheduler/releases/tag/3.0.0-alpha)

## **感谢贡献者**

按首字母排序

Aaron Lin, Amy0104, Assert, BaoLiang, Benedict Jin, BenjaminWenqiYu, Brennan Fox, Devosend, DingPengfei, DuChaoJiaYou, EdwardYang, Eric Gao, Frank Chen, GaoTianDuo, HanayoZz, Hua Jiang, Ivan0626, Jeff Zhan, Jiajie Zhong, JieguangZhou, Jiezhi.G, JinYong Li, J·Y, Kerwin, Kevin.Shin, KingsleyY, Kirs, KyoYang, LinKai, LiuBodong, Manhua, Martin Huang, Maxwell, Molin Wang, OS, QuakeWang, ReonYu, SbloodyS, Shiwen Cheng, ShuiMuNianHuaLP, ShuoTiann, Sunny Lei, Tom, Tq, Wenjun Ruan, X&Z, XiaochenNan, Yanbin Lin, Yao WANG, Zonglei Dong, aCodingAddict, aaronlinv, caishunfeng, calvin, calvinit, cheney, chouc, gaojun2048, guoshupei, hjli, huangxiaohai, janeHe13, jegger, jon-qj, kezhenxu94, labbomb, lgcareer, lhjzmn, lidongdai, lifeng, lilyzhou, lvshaokang, lyq, mans2singh, mask, mazhong, mgduoduo, myangle1120, nobolity, ououtt, ouyangyewei, pinkhello, qianli2022, ronyang1985, seagle, shuai hou, simsicon, songjianet, sparklezzz, springmonster, uh001, wangbowen, wangqiang, wangxj3, wangyang, wangyizhi, wind, worry, xiangzihao, xiaodi wang, xiaoguaiguai, xuhhui, yangyunxi, yc322, yihong, yimaixinchen, zchong, zekai-li, zhang, zhangxinruu, zhanqian, zhuangchong, zhuxt2015, zixi0825, zwZjut, 

天仇, 小张, 时光, 王强, 百岁, 弘树, 张俊杰, 罗铭涛

