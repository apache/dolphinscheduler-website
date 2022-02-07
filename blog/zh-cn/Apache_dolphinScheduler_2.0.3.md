# Apache DolphinScheduler 2.0.3 发布，支持钉钉告警签名校验，数据源可从多个会话获取链接

<div align=center>
<img src="/img/2.0.3/2022-1-27/1.png"/>
</div>


> 今天，Apache DolphinScheduler 宣布 2.0.3 版本正式发布。本版本支持钉钉告警签名校验，以及数据源从多个会话获取链接。此外，2.0.3 还对缓存管理、补数时间、日志中的数据源密码显示等进行优化，并修复了若干关键Bug。

## 新增功能
### 钉钉告警支持加签名校验

2.0.3 支持通过签名方式实现钉钉机器人报警的功能。

<div align=center>
<img src="/img/2.0.3/2022-1-27/2.png"/>
</div>

钉钉的参数配置

- Webhook

格式如下：https://oapi.dingtalk.com/robot/send?access_token=XXXXXX

- Keyword


安全设置的自定义关键词

- Secret


安全设置的加签

自定义机器人发送消息时，可以通过手机号码指定“被@人列表”。在“被@人列表”中的人员收到该消息时，会有@消息提醒。设置为免打扰模式，会话仍然会有通知提醒，在首屏出现“有人@你”提示。

- @Mobiles


被@人的手机号

- @UserIds


被@人的用户userid

- @All


是否@所有人

### 支持数据源从多个会话获取链接

此前，使用 JdbcDataSourceProvider.createOneSessionJdbcDataSource() 方法hive/impala 创建连接池设置了 MaximumPoolSize=1，但是调度任务中，如果 hive/impala 多任务同时运行，会出现 getConnection=null 的情况，SqlTask.prepareStatementAndBind() 方法会抛出空指针异常。




2.0.3 优化了这一点，支持数据源从多个会话获取链接。


## 优化
### 缓存管理优化，减少 Master 调度过程中的 DB 查询次数




由于主服务器调度进程，中会出现大量的数据库读操作，如 tenant、user、processDefinition 等，这一方面会给 DB 带来巨大压力，另一方面会减慢整个核心调度过程。




考虑到这部分业务数据是多读少写的场景，2.0.3 引入了缓存模块，主要作用于 Master 节点，将业务数据如租户、工作流定义等进行缓存，降低数据库查询压力，加快核心调度进程，详情可查看官网文档：https://dolphinscheduler.apache.org/en-us/docs/latest/user_doc/architecture/cache.html



### 补数时间区间从 “左闭右开” 改为 “左闭右闭”

此前，补数时间为“左闭右开”(startDate <= N < endDate)，不利于用户理解。优化之后，部署时间区间改为“左闭右闭”。

### 对日志中的数据源密码进行加密显示

数据源中的密码进行加密，加强隐私保护。



## Bug 修复

* zkRoot 配置不起作用
* 修复修改管理员账号的用户信息引起的错误
* 增加删除工作流定义同时删除工作流实例
* UDF 编辑文件夹对话框不能取消
* 修复因为 netty 通讯没有失败重试，worker 和 master 通讯失败，导致工作流一直运行中的问题
* 删除运行中的工作流，Master 会一直打印失败日志
* 修复环境变量中选择 workerGroup 的问题
* 修复依赖任务中告警设置不起作用的问题
* 工作流历史版本查询信息出错
* 解决高并发下任务日志输出影响性能的问题
* sub_process 节点的全局参数未传递给关联的工作流任务
* K8S 上 Master 任务登录时，查询日志无法显示内容
* 进程定义列表中存在重复进程
* 当流程实例 FailureStrategy.END 时任务失败，流程实例一直在运行
* t_ds_resources 表中的“is_directory”字段在 PostgreSQL 数据库中出现类型错误
* 修复 Oracle 的 JDBC 连接
* Dag 中有禁止节点时，执行流程异常
* querySimpleList 返回错误的项目代码 




**Release Note:** https://github.com/apache/dolphinscheduler/releases/tag/2.0.3

**下载地址：** https://dolphinscheduler.apache.org/en-us/download/download.html

## 感谢贡献者

感谢社区 Contributor 对本版本的积极贡献，以下为 Contributor 名单，排名不分先后：

<div align=center>
<img src="/img/2.0.3/2022-1-27/3.png"/>
</div>
