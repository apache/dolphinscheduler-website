# Flink节点

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
