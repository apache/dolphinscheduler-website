# 子流程节点

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