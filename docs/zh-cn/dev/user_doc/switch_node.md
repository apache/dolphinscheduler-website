### **DolphinScheduler\**** ***\*-SWITCH节点\****

Dolphinscheduler中目前包含条件判断的节点有两个，condition节点和switch节点。Condition节点主要依据上游节点的执行状态（成功、失败）执行对应分支。Switch节点主要依据全局变量的值和用户所编写的表达式判断结果执行对应分支。本文所讲述的是switch节点相关内容。

 

#### ***\*用户使用手册\****

1.首先我们画一个简单的工作流定义：

<img src="/img/switchNode/image-20210901144536115.png" alt="image-20210901144536115" style="zoom: 67%;" />

2.其中sql1节点会产生一个全局变量（有关于全局变量的请参考Global-Params），名称为id：

<img src="/img/switchNode/image-20210901144649439.png" alt="image-20210901144649439" style="zoom:67%;" />

3. 用户在switch节点的“条件”框内定义表达式，当然这个表达式需要用到上游节点产生的全局变量，而上游节点不只是相邻的上游节点，可以是有依赖关系的任何一个上游节点。变量的引用仍然使用${变量名}的方式。

<img src="/img/switchNode/image-20210901144752457.png" alt="image-20210901144752457" style="zoom:67%;" />

您可以编写多个条件，对应执行不同的分支。如果只定义了条件，没有定义“分支流转”的部分，那当满足该条件后，工作流定义的该分支便结束了。上图中突出的“分支流转”，也就是定义了sql4的部分，是当所有的条件都不满足之后选择的分支。当然这部分也可以不选择任何下游节点，同样上面的条件都不满足后该分支便会结束。

4. 下游有三个分支，我们简单的工作流定义中每个分支只包含了一个节点。实际上，sql1定义的全局变量id的值为12，最终经过switch节点运行之后，sql3、sql4会被抛弃运行，sql2被执行。

 

#### ***\*开发文档\****

 

1. 用户定义的表达式和分支流转的信息存在了taskdefinition中的taskParams中，当switch被执行到时，会被格式化为SwitchParameters。

2. SwitchTaskExecThread从上到下（用户在页面上定义的表达式顺序）处理switch中定义的表达式，从varPool中获取变量的值，通过js解析表达式，如果表达式返回true，则停止检查，并且记录该表达式的顺序，这里我们记录为resultConditionLocation。SwitchTaskExecThread的任务便结束了。

3. 当switch节点运行结束之后，如果没有发生错误（较为常见的是用户定义的表达式不合规范或参数名有问题），这个时候MasterExecThread.submitPostNode会获取DAG的下游节点继续执行。

4. DagHelper.parsePostNodes中如果发现当前节点（刚刚运行完成功的节点）是switch节点的话，会获取resultConditionLocation，将SwitchParameters中除了resultConditionLocation以外的其他分支全部skip掉。这样留下来的就只有需要执行的分支了。

以上便是switch工作的流程。

 

 

 

 

 

 

 

 

 

 