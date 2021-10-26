# Python节点

- 使用python节点，可以直接执行python脚本，对于python节点，worker会使用`python **`方式提交任务。

> 拖动工具栏中的![PNG](https://analysys.github.io/easyscheduler_docs_cn/images/toolbar_PYTHON.png)任务节点到画板中，如下图所示：

<p align="center">
   <img src="/img/python_edit.png" width="80%" />
 </p>

- 脚本：用户开发的Python程序
- 资源：是指脚本中需要调用的资源文件列表
- 自定义参数：是Python局部的用户自定义参数，会替换脚本中以${变量}的内容
- 注意：若引入资源目录树下的python文件，需添加__init__.py文件
