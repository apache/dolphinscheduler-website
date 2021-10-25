### **DolphinScheduler\**** ***\*-SWITCH节点\****

Dolphinscheduler中目前包含条件判断的节点有两个，condition节点和switch节点。Condition节点主要依据上游节点的执行状态（成功、失败）执行对应分支。Switch节点主要依据全局变量的值和用户所编写的表达式判断结果执行对应分支。本文所讲述的是switch节点相关内容。

#### ***\*开发文档\****

1. 用户定义的表达式和分支流转的信息存在了taskdefinition中的taskParams中，当switch被执行到时，会被格式化为SwitchParameters。

2. SwitchTaskExecThread从上到下（用户在页面上定义的表达式顺序）处理switch中定义的表达式，从varPool中获取变量的值，通过js解析表达式，如果表达式返回true，则停止检查，并且记录该表达式的顺序，这里我们记录为resultConditionLocation。SwitchTaskExecThread的任务便结束了。

3. 当switch节点运行结束之后，如果没有发生错误（较为常见的是用户定义的表达式不合规范或参数名有问题），这个时候MasterExecThread.submitPostNode会获取DAG的下游节点继续执行。

4. DagHelper.parsePostNodes中如果发现当前节点（刚刚运行完成功的节点）是switch节点的话，会获取resultConditionLocation，将SwitchParameters中除了resultConditionLocation以外的其他分支全部skip掉。这样留下来的就只有需要执行的分支了。

以上便是switch工作的流程。
