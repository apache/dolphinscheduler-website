# Spark 节点

- 通过SPARK节点，可以直接直接执行SPARK程序，对于spark节点，worker会使用`spark-submit`方式提交任务

> 拖动工具栏中![PNG](https://analysys.github.io/easyscheduler_docs_cn/images/toolbar_SPARK.png)任务节点到画板中，如图所示：

<p align="center">
   <img src="/img/spark_edit.png" width="80%" />
 </p>

- 程序类型：支持JAVA、Scala和Python三种语言
- 主函数的class：是Spark程序的入口Main Class的全路径
- 主jar包：是Spark的jar包
- 部署方式：支持yarn-cluster、yarn-client和local三种模式
- Driver内核数：可以设置Driver内核数及内存数
- Executor数量：可以设置Executor数量、Executor内存数和Executor内核数
- 命令行参数：是设置Spark程序的输入参数，支持自定义参数变量的替换。
- 其他参数：支持 --jars、--files、--archives、--conf格式
- 资源：如果其他参数中引用了资源文件，需要在资源中选择指定
- 自定义参数：是MR局部的用户自定义参数，会替换脚本中以${变量}的内容
