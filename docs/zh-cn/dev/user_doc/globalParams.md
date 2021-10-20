### DolphinScheduler 全局变量

DolphinScheduler 中所涉及的变量部分包含三种类型

①. 在工作流保存页面定义时定义的变量

②. 上游节点传递的变量

③. 节点的自有变量，用户在【自定义参数】定义的变量，并且用户可以在工作流定义时定义该部分变量的值。

本文所讲述的全局变量指的是 ② 上游节点传递的变量；

#### 用户使用手册

##### 参数的使用：

当您在定义一个节点时，该节点可能会使用到上述三种变量，使用方式为${变量名}。三种变量的优先级为 ①>②>③，即当三种变量名称重复时，优先使用 ① 的值，其次是 ②，再次是 ③。目前参数的使用适用于所有节点。

需要注意的是，在使用上游节点传递的变量时，该部分变量可能会存在名称相同的情况。如果发生此类情况，程序会使用其中非空的值，如果存在多个非空值，则选择最先结束的上游节点所传递的值。这点需要在定义流程时用户事先知晓。

例如下图中的关系

1：先以 shell 节点解释第一种情况

<img src="/img/globalParam/image-20210723102938239.png" alt="image-20210723102938239" style="zoom:50%;" />

节点 【useParam】可以使用到节点【createParam】中设置的变量。而节点 【useParam】与节点【noUseParam】中并没有依赖关系，所以并不会获取到节点【noUseParam】的变量。上图中只是以 shell 节点作为例子，其他类型节点具有相同的使用规则。

<img src="/img/globalParam/image-20210723103316896.png" alt="image-20210723103316896" style="zoom:50%;" />

其中节点【createParam】在使用变量时直接使用即可。另外该节点设置了 "key" 和 "key1" 两个变量，这里用户用定义了一个与上游节点传递的变量名相同的变量 key1，并且复制了值为 "12"，但是由于我们设置的优先级的关系，这里的值 "12" 会被抛弃，最终使用上游节点设置的变量值。

2：我们再以 sql 节点来解释另外一种情况

<img src="/img/globalParam/image-20210723103937052.png" alt="image-20210723103937052" style="zoom:50%;" />

节点【use_create】的定义如下：

![image-20210723104411489](/img/globalParam/image-20210723104411489.png)

"status" 是当前节点设置的节点的自有变量。但是用户在保存时也同样设置了 "status" 变量，并且赋值为 -1。那在该 SQL 执行时，status 的值为优先级更高的 -1。抛弃了节点的自有变量的值。

这里的 "id" 是上游节点设置的变量，用户在节点【createParam1】、节点【createParam2】中设置了相同参数名 "id" 的参数。而节点【use_create】中使用了最先结束的【createParam1】的值。

##### 参数的设置：

当定义上游节点时，如果有需要将该节点的结果传递给有依赖关系的下游节点，需要在【当前节点设置】的【自定义参数】设置一个方向是 OUT 的变量。目前我们主要针对 SQL 和 SHELL 节点做了可以向下传递参数的功能。

###### SQL 节点：

prop 为用户指定；方向选择为 OUT，只有当方向为 OUT 时才会被定义为变量输出；数据类型可以根据需要选择不同数据结构；value 部分不需要填写。

如果 SQL 节点的结果只有一行，一个或多个字段，prop 的名字需要和字段名称一致。数据类型可选择为除 LIST 以外的其他类型。变量会选择 SQL 查询结果中的列名中与该变量名称相同的列对应的值。

如果 SQL 节点的结果为多行，一个或多个字段，prop 的名字需要和字段名称一致。数据类型选择为LIST。获取到 SQL 查询结果后会将对应列转化为 LIST<VARCHAR>，并将该结果转化为 JSON 后作为对应变量的值。



我们再以上图中包含 SQL 节点的流程举例说明：

上图中节点【createParam1】的定义如下：

<img src="/img/globalParam/image-20210723104957031.png" alt="image-20210723104957031" style="zoom:50%;" />

节点【createParam2】的定义如下：

<img src="/img/globalParam/image-20210723105026924.png" alt="image-20210723105026924" style="zoom:50%;" />

您可以在【工作流实例】页面，找到对应的节点实例，便可以查看该变量的值。

节点实例【createParam1】如下：

<img src="/img/globalParam/image-20210723105131381.png" alt="image-20210723105131381" style="zoom:50%;" />

这里当然 "id" 的值会等于 12.

我们再来看节点实例【createParam2】的情况。

<img src="/img/globalParam/image-20210723105255850.png" alt="image-20210723105255850" style="zoom:50%;" />

这里只有 "id" 的值。尽管用户定义的 sql 查到的是 "id" 和 "database_name" 两个字段，但是由于只定义了一个为 out 的变量 "id"，所以只会设置一个变量。由于显示的原因，这里已经替您查好了该 list 的长度为 10。

###### SHELL 节点：

prop 为用户指定；方向选择为 OUT，只有当方向为 OUT 时才会被定义为变量输出；数据类型可以根据需要选择不同数据结构；value 部分不需要填写。


用户需要传递参数，在定义 shell 脚本时，需要输出格式为 $setValue(key=value) 的语句，key 为对应参数的 prop，value 为该参数的值。


例如下图中：

<img src="/img/globalParam/image-20210723101242216.png" alt="image-20210723101242216" style="zoom:50%;" />

shell 节点定义时当日志检测到 ${setValue(key=value1)} 的格式时，会将 value1 赋值给 key，下游节点便可以直接使用变量 key 的值。同样，您可以在【工作流实例】页面，找到对应的节点实例，便可以查看该变量的值。

<img src="/img/globalParam/image-20210723102522383.png" alt="image-20210723102522383" style="zoom:50%;" />



#### 开发文档

用户在定义方向为 OUT 的参数后，会保存在 task 的 localParam 中。

##### 参数的使用：

从 DAG 中获取当前需要创建的 taskInstance 的直接前置节点 preTasks，获取 preTasks 的 varPool，将该 varPool（List<Property>）合并为一个 varPool，在合并过程中，如果发现有相同的变量名的变量，按照以下逻辑处理

1. 若所有的值都是 null，则合并后的值为 null

2. 若有且只有一个值为非 null，则合并后的值为该非 null 值

3. 若所有的值都不是 null，则根据取 varPool 的 taskInstance 的 endtime 最早的一个


在合并过程中将所有的合并过来的 Property 的方向更新为 IN

合并后的结果保存在 taskInstance.varPool 中。

Worker 收到后将 varPool 解析为 Map<String,Property> 的格式，其中 map 的 key 为 property.prop 也就是变量名。

在 processor 处理参数时，会将 varPool 和 localParam 和 globalParam 三个变量池参数合并，合并过程中若有参数名重复的参数，按照以下优先级进行替换，高优先级保留，低优先级被替换：

- globalParam ：高
- varPool ：中
- localParam ：低

参数会在节点内容执行之前利用正则表达式比配到 ${变量名}，替换为对应的值。

##### 参数的设置：

目前仅支持 SQL 和 SHELL 节点的参数获取。

- 从 localParam 中获取方向为 OUT 的参数，根据不同节点的类型做以下方式处理。

###### SQL 节点：

参数返回的结构为 List<Map<String,String>>

其中，List 的元素为每行数据，Map 的 key 为列名，value 为该列对应的值

 	  (1) 若 SQL 语句返回为有一行数据，则根据用户在定义 task 时定义的 OUT 参数名匹配列名，若没有匹配到则放弃。
 	
 	  (2) 若 SQL 语句返回多行，按照根据用户在定义 task 时定义的类型为 LIST 的 OUT 参数名匹配列名，将对应列的所有行数据转换为 List<String>，作为该参数的值。若没有匹配到则放弃。

###### SHELL 节点：

processor 执行后的结果返回为 Map<String,String>

用户在定义 shell 脚本时需要在输出中定义 ${setValue(key=value)}

<u>(注：如遇环境解析该语句出错，可在两侧加引号，例如：'${setValue(key=value)}')</u>

在参数处理时去掉 $setValue()，按照 “=” 进行拆分，第 0 个为 key，第 1 个为 value。

同样匹配用户定义 task 时定义的 OUT 参数名与 key，将 value 作为该参数的值。

- 返回参数处理

     获取到的 processor 的结果为 String

     判断 processor 是否为空，为空退出

     判断 localParam 是否为空，为空退出

     获取 localParam 中为 OUT 的参数，为空退出

     将String按照上诉格式格式化（SQL为List<Map<String,String>>，shell为Map<String,String>）

     将匹配好值的参数赋值给 varPool（List<Property>，其中包含原有 IN 的参数）

- varPool 格式化为 json，传递给 master。

- Master 接收到 varPool 后，将其中为 OUT 的参数回写到 localParam 中。
