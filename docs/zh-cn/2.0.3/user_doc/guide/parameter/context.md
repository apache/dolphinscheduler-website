# 参数引用过

DolphinScheduler 提供参数间相互引用的能力，包括：本地参数引用全局参数、上下游参数传递。
参数引用的存在，会涉及当参数名相同时，参数的优先级问题，详见[参数优先级](priority.md)

## 本地任务引用全局参数

本地任务引用全局参数的前提是已经定义[全局参数](global.md)并与[本地参数](local.md)中使用方法类似，需要注意参数的值要配置成全局参数中的key

![parameter-call-global-in-local](/img/global_parameter.png)

```properties

`${biz_date}`与`${curdate}`作为本地参数引用全局参数

local_param_bizdate通过\${global_bizdate}来引用全局参数

shell脚本中可通过\${local_param_bizdate}来引全局变量 global_bizdate的值或通过JDBC直接将local_param_bizdate的值set进去

local_param通过${local_param}引用上一节中定义的全局参数

biz_date、biz_curdate、system.datetime为用户自定义的参数，通过${全局参数}进行赋值

```

## 上游任务传递给下游任务

DolphinScheduler 允许任务间进行参数传递，仅支持上游单向传递给下游的任务类型有：

* [Shell](../task/shell.md)
* [SQL](../task/sql.md)
* [Procedure](../task/stored-procedure.md)

定义上游节点时，如果需要将该节点的结果传递给有依赖关系的下游节点，需要在【当前节点设置】的【自定义参数】设置一个方向是 OUT 的变量。目前仅针对 SQL 和 SHELL 节点做可以向下传递参数功能。

### SQL

- prop 为用户指定
- 方向选择为 OUT，仅当方向为 OUT 时会被定义为变量输出
- 数据类型可根据需要选择不同数据结构
- value 部分不需要填写

具体如下案例：

>
如果 SQL 节点的结果为单行、一个或多个字段，prop 的名字需要和字段名称一致
数据类型可选择为除 LIST 以外的其他类型。
变量会选择 SQL 查询结果中的列名中与该变量名称相同的列对应的值

>
如果 SQL 节点的结果为多行，一个或多个字段，prop 的名字需要和字段名称一致
数据类型选择为LIST
获取到 SQL 查询结果后会将对应列转化为 LIST<VARCHAR>，并将该结果转化为 JSON 后作为对应变量的值。

包含 SQL 节点的流程案例如下：

- 节点【createParam1】定义

<img src="/img/globalParam/image-20210723104957031.png" alt="image-20210723104957031" style="zoom:50%;" />

- 节点【createParam2】定义

<img src="/img/globalParam/image-20210723105026924.png" alt="image-20210723105026924" style="zoom:50%;" />

- 以节点实例【createParam1】在【工作流实例】页面，查看该变量的值

<img src="/img/globalParam/image-20210723105131381.png" alt="image-20210723105131381" style="zoom:50%;" />

- 以节点实例【createParam2】在【工作流实例】页面，查看该变量的值

<img src="/img/globalParam/image-20210723105255850.png" alt="image-20210723105255850" style="zoom:50%;" />

 【createParam2】只显示 "id" 的值。尽管用户定义的 sql 查到的是 "id" 和 "database_name" 两个字段，但是由于只定义了一个为 out 的变量 "id"，所以只会设置一个变量。由于显示的原因，这里已经替您查好了该 list 的长度为 10。

### SHELL

- prop 为用户指定
- 方向选择为 OUT，只有当方向为 OUT 时才会被定义为变量输出
- 数据类型可以根据需要选择不同数据结构
- value 部分不需要填写


用户传递参数在定义 shell 脚本时需要输出格式为： ${setValue(key=value)} ，key 对应参数的 prop，value 为参数的值。


通过 `echo '${setValue(trans=hello trans)}'`, 将'trans'设置为"hello trans", 在下游任务中就可使用trans变量如下图：


<img src="/img/globalParam/trans-shell.png" alt="trans-shell" style="zoom:50%;" />


shell 节点定义时当日志检测到 ${setValue(key=value1)} 格式，会将 value1 赋值给 key，下游节点便直接使用变量 key 的值。在【工作流实例】页面，找到对应的节点实例，便可以查看该变量 key 的值。

<img src="/img/globalParam/use-parameter-shell.png" alt="use-parameter-shell" style="zoom:50%;" />
