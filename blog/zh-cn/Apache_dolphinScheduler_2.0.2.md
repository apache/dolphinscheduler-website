# WorkflowAsCode 来了，Apache DolphinScheduler 2.0.2 惊喜发布！

<div align=center>
<img src="/img/2022-1-13/1_3XcwBeN5HkBzZ76zXDcigw.jpeg"/>
</div>

千呼万唤中，WorkflowAsCode 功能终于在 2.0.2 版本中如约上线，为有动态、批量创建和更新工作流需求的用户带来福音。

此外，新版本还新增企业微信告警群聊会话消息推送，简化了元数据初始化流程，并修复了旧版本中强制终止后服务重启失败，添加 Hive 数据源失败等问题。</font>

## 01 新功能

### 1 WorkflowAsCode


首先在新功能上，2.0.2 版本重磅发布了 PythonGatewayServer， 这是一个 Workflow-as-code 的服务端，与 apiServer 等服务的启动方式相同。

启用 PythonGatewayServer 后，所有 Python API 的请求都会发送到 PythonGatewayServer。Workflow-as-code 让用户可以通过 Python API 创建工作流，对于有动态、批量地创建和更新工作流的用户来说是一个好消息。通过 Workflow-as-code 创建的工作流与其他工作流一样，都可以在 web UI 查看。

以下为一个 Workflow-as-code 测试用例：

```py

# 定义工作流属性，包括名称、调度周期、开始时间、使用租户等信息
with ProcessDefinition(
    name="tutorial",
    schedule="0 0 0 * * ? *",
    start_time="2021-01-01",
    tenant="tenant_exists",
) as pd:
    # 定义4个任务，4个都是 shell 任务，shell 任务的必填参数为任务名、命令信息，这里都是 echo 的 shell 命令
    task_parent = Shell(name="task_parent", command="echo hello pydolphinscheduler")
    task_child_one = Shell(name="task_child_one", command="echo 'child one'")
    task_child_two = Shell(name="task_child_two", command="echo 'child two'")
    task_union = Shell(name="task_union", command="echo union")

    # 定义任务间依赖关系
    # 这里将 task_child_one，task_child_two 先声明成一个任务组，通过 python 的 list 声明
    task_group = [task_child_one, task_child_two]
    # 使用 set_downstream 方法将任务组 task_group 声明成 task_parent 的下游，如果想要声明上游则使用 set_upstream
    task_parent.set_downstream(task_group)

    # 使用位操作符 << 将任务 task_union 声明成 task_group 的下游，同时支持通过位操作符 >> 声明
    task_union << task_group

```

上面的代码运行后，可以在 web UI 看到的工作流如下：

```                --> task_child_one
                /                    \
task_parent -->                        -->  task_union
                \                   /
                  --> task_child_two
```
### 2 企业微信告警方式支持群聊消息推送

在此前版本中，微信告警方式仅支持消息通知方式；在 2.0.2 版本中，用户在使用企业微信的告警时，支持进行应用内以群聊会话消息推送的方式推送给用户。

## 02 优化

### 1 简化元数据初始化流程

首次安装 Apache DolphinScheduler 时，运行 create-dolphinscheduler.sh 需要从最早的版本逐步升级到当前版本。为了更方便快捷地初始化元数据流程，2.0.2 版本让用户可以直接安装当前版本的数据库脚本，提升安装速度。

### 2 删除补数日期中的“+1”（天）

删除了补数日期中的“+1”天，以避免补数时 UI 日期总显示 +1 给用户造成的困惑。
## 03 Bug 修复

[#7661] 修复 logger 在 worker 中的内存泄漏
[#7750] 兼容历史版本数据源连接信息
[#7705] 内存限制导致从 1.3.5 升级到 2.0.2 出现错误
[#7786] 强制终止后服务重启失败
[#7660] 流程定义版本创建时间错误
[#7607] 执行 PROCEDURE 节点失败
[#7639] 在通用配置项中添加 quartz 和 zookeeper 默认配置
[#7654] 在依赖节点中，出现不属于当前项目的选项时报错
[#7658] 工作流复制错误
[#7609] worker sendResult 成功但 master 未收到错误时，工作流始终在运行
[#7554] Standalone Server 中的 H2 会在数分钟后自动重启，导致数据异常丢失
[#7434] 执行 MySQL 建表语句报错
[#7537] 依赖节点重试延迟不起作用
[#7392] 添加 Hive 数据源失败

下载：https://dolphinscheduler.apache.org/zh-cn/download/download.html
Release Note：https://github.com/apache/dolphinscheduler/releases/tag/2.0.2

## 04 致谢

一如既往地，感谢所有为 2.0.2版本建言献策并付诸行动的 Contributor（排名不分先后），是你们的智慧和付出让 Apache DolphinScheduler 更加符合用户的使用需求。

<div align=center>
<img src="/img/2022-1-13/1_IFBxUh2I0LFWF3Jkwz1e5g.png"/>
</div>


## 05 参与贡献


随着国内开源的迅猛崛起，Apache DolphinScheduler 社区迎来蓬勃发展，为了做更好用、易用的调度，真诚欢迎热爱开源的伙伴加入到开源社区中来，为中国开源崛起献上一份自己的力量，让本土开源走向全球。

参与 DolphinScheduler 社区有非常多的参与贡献的方式，包括：

贡献第一个PR(文档、代码) 我们也希望是简单的，第一个PR用于熟悉提交的流程和社区协作以及感受社区的友好度。

社区汇总了以下适合新手的问题列表：https://github.com/apache/dolphinscheduler/issues/5689

非新手问题列表：https://github.com/apache/dolphinscheduler/issues?q=is%3Aopen+is%3Aissue+label%3A%22volunteer+wanted%22

如何参与贡献链接：https://dolphinscheduler.apache.org/en-us/docs/dev/user_doc/contribute/join/review.html

来吧，DolphinScheduler开源社区需要您的参与，为中国开源崛起添砖加瓦吧，哪怕只是小小的一块瓦，汇聚起来的力量也是巨大的。


社区官网
https://dolphinscheduler.apache.org/

代码仓地址
https://github.com/apache/dolphinscheduler

您的 Star，是 Apache DolphinScheduler 为爱发电的动力❤️ ～









