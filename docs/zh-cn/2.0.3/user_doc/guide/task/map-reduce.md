# MapReduce(MR)节点

- 使用MR节点，可以直接执行MR程序。对于mr节点，worker会使用`hadoop jar`方式提交任务


> 拖动工具栏中的![PNG](https://analysys.github.io/easyscheduler_docs_cn/images/toolbar_MR.png)任务节点到画板中，如下图所示：

## JAVA程序

 <p align="center">
   <img src="/img/mr_java.png" width="80%" />
 </p>
 
- 主函数的class：是MR程序的入口Main Class的全路径
- 程序类型：选择JAVA语言 
- 主jar包：是MR的jar包
- 命令行参数：是设置MR程序的输入参数，支持自定义参数变量的替换
- 其他参数：支持 –D、-files、-libjars、-archives格式
- 资源： 如果其他参数中引用了资源文件，需要在资源中选择指定
- 自定义参数：是MR局部的用户自定义参数，会替换脚本中以${变量}的内容

## Python程序

<p align="center">
   <img src="/img/mr_edit.png" width="80%" />
 </p>

- 程序类型：选择Python语言 
- 主jar包：是运行MR的Python jar包
- 其他参数：支持 –D、-mapper、-reducer、-input  -output格式，这里可以设置用户自定义参数的输入，比如：
- -mapper  "mapper.py 1"  -file mapper.py   -reducer reducer.py  -file reducer.py –input /journey/words.txt -output /journey/out/mr/${currentTimeMillis}
- 其中 -mapper 后的 mapper.py 1是两个参数，第一个参数是mapper.py，第二个参数是1
- 资源： 如果其他参数中引用了资源文件，需要在资源中选择指定
- 自定义参数：是MR局部的用户自定义参数，会替换脚本中以${变量}的内容
