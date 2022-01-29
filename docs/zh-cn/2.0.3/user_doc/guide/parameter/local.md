# 本地参数

## 作用域

在任务定义页面配置参数，默认作用域仅限该任务，如果已经配置[参数传递](context.md)则可将该参数作用到下游任务中。

## 使用方式

在任务定义页面，点击“自定义参数”右边加号，填写对应的变量名称和对应的值，保存即可

<p align="center">
   <img src="/img/supplement_local_parameter.png" width="80%" />
 </p>

本地参数中调用系统内置参数，将内置参数对应的值填到`value`中，如下图中`${biz_date}`以及`${curdate}`

<p align="center">
   <img src="/img/global_parameter.png" width="80%" />
</p>

本地参数中调用系统内置参数，将内置参数对应的值填到`value`中，如上图中的`${biz_date}`以及`${curdate}`
