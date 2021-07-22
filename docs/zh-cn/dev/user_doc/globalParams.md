### DolphinScheduler 全局变量

Dolphinscheduler中所涉及的变量部分包含三种类型

  	 ①：在工作流保存页面定义时定义的变量

  	 ②：上游节点传递的变量

  	 ③：节点的自有变量，用户在【自定义参数】定义的变量，并且用户可以在工作流定义时定义该部分变量的值。

本文所讲述的全局变量指的是②-上游节点传递的变量；

#### 用户使用手册

##### 参数的使用：

当您在定义一个节点时，该节点可能会使用到上述三种变量，使用方式为${变量名}。三种变量的优先级为①>②>③，即当三种变量名称重复时，优先使用①的值，其次是②，再次是③。目前参数的使用适用于所有节点。

需要注意的是，在使用上游节点传递的变量时，该部分变量可能会存在名称相同的情况。如果发生此类情况，程序会使用其中非空的值，如果存在多个非空值，则选择最先结束的上游节点所传递的值。这点需要在定义流程时用户事先知晓。

##### 参数的设置：

当定义上游节点时，如果有需要将该节点的结果传递给有依赖关系的下游节点，需要在【当前节点设置】的【自定义参数】设置一个方向是OUT的变量。目前我们主要针对SQL和SHELL节点做了可以向下传递参数的功能。

###### SQL节点：

prop为用户指定；方向选择为OUT，只有当方向为OUT时才会被定义为变量输出；数据类型可以根据需要选择不同数据结构；value部分不需要填写。

如果SQL节点的结果只有一行，一个或多个字段，prop的名字需要和字段名称一致。数据类型可选择为除LIST以外的其他类型。变量会选择SQL查询结果中的列名中与该变量名称相同的列对应的值。

如果SQL节点的结果为多行，一个或多个字段，prop的名字需要和字段名称一致。数据类型选择为LIST。获取到SQL查询结果后会将对应列转化为LIST<VARCHAR>，并将该结果转化为JSON后作为对应变量的值。

###### SHELL节点：

prop为用户指定；方向选择为OUT，只有当方向为OUT时才会被定义为变量输出；数据类型可以根据需要选择不同数据结构；value部分不需要填写。

用户需要传递参数，在定义shell脚本时，需要输出格式为$setVaule(key=value)的语句，key为对应参数的prop，value为该参数的值。

#### 开发文档

用户在定义方向为OUT的参数后，会保存在task的localParam中。

##### 参数的使用：

从DAG中获取当前需要创建的taskInstance的直接前置节点preTasks，获取preTasks的varPool，将该varPool（List<Property>）合并为一个varPool，在合并过程中，如果发现有相同的变量名的变量，按照以下逻辑处理

​	（1）若所有的值都是null，则合并后的值为null

​	（2）若有且只有一个值为非null，则合并后的值为该非null值

​	（3）若所有的值都不是null，则根据取varPool的taskInstance的endtime最早的一个

在合并过程中将所有的合并过来的Property的方向更新为IN

合并后的结果保存在taskInstance.varPool中。

Worker收到后将varPool解析为Map<String,Property> 的格式，其中map的key为property.prop也就是变量名。

在processor处理参数时，会将varPool和localParam和globalParam三个变量池参数合并，合并过程中若有参数名重复的参数，按照以下优先级进行替换，高优先级保留，低优先级被替换：

​	   globalParam ：高

 	  varPool ：中

 	  localParam ：低

参数会在节点内容执行之前利用正则表达式比配到${变量名}，替换为对应的值。

##### 参数的设置：

目前仅支持SQL和SHELL节点的参数获取。

- 从localParam中获取方向为OUT的参数，根据不同节点的类型做以下方式处理。

###### SQL节点：

参数返回的结构为List<Map<String,String>>

其中，List的元素为每行数据，Map的key为列名，value为该列对应的值

 	  (1) 若SQL语句返回为有一行数据，则根据用户在定义task时定义的OUT参数名匹配列名，若没有匹配到则放弃。

 	  (2) 若SQL语句返回多行，按照根据用户在定义task时定义的类型为LIST的OUT参数名匹配列名，将对应列的所有行数据转换为List<String>，作为该参数的值。若没有匹配到则放弃。

###### SHELL节点：

processor执行后的结果返回为Map<String,String>

用户在定义shell脚本时需要在输出中定义$setVaule(key=value)

在参数处理时去掉$setVaule()，按照“=”进行拆分，第0个为key，第1个为value。

同样匹配用户定义task时定义的OUT参数名与key，将value作为该参数的值。

- 返回参数处理

  获取到的processor的结果为String

  判断processor是否为空，为空退出

  判断localParam是否为空，为空退出

  获取localParam中为OUT的参数，为空退出

  将String按照上诉格式格式化（SQL为List<Map<String,String>>，shell为Map<String,String>）

  将匹配好值的参数赋值给varPool（List<Property>，其中包含原有IN的参数）

- varPool格式化为json，传递给master。

- Master接收到varPool后，将其中为OUT的参数回写到localParam中。