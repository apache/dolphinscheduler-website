# 全局参数

## 作用域

在工作流定义页面配置的参数，作用于该工作流中全部的任务

## 使用方式

全局参数配置方式如下：在工作流定义页面，点击“设置全局”右边加号，填写对应变量名称和对应值，保存即可

<p align="center">
   <img src="/img/supplement_global_parameter.png" width="80%" />
</p>

定义global_bizdate参数可以被其它任一节点的局部参数引用，并设置global_bizdate的value通过引用参数system.biz.date获得的值

<p align="center">
   <img src="/img/local_parameter.png" width="80%" />
</p>
