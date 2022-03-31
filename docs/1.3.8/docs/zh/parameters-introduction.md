# Dolphinscheduler 参数使用说明

#### 1. 系统参数

<table>
    <tr><th>变量名</th><th>声明方式</th><th>含义</th></tr>
    <tr>
        <td>system.biz.date</td>
        <td>${system.biz.date}</td>
        <td>日常调度实例定时的定时时间前一天，格式为 yyyyMMdd，补数据时，该日期 +1</td>
    </tr>
    <tr>
        <td>system.biz.curdate</td>
        <td>${system.biz.curdate}</td>
        <td>日常调度实例定时的定时时间，格式为 yyyyMMdd，补数据时，该日期 +1</td>
    </tr>
    <tr>
        <td>system.datetime</td>
        <td>${system.datetime}</td>
        <td>日常调度实例定时的定时时间，格式为 yyyyMMddHHmmss，补数据时，该日期 +1</td>
    </tr>
</table>



#### 2.自定义参数

##### 2.1 时间自定义参数

  - 支持代码中自定义变量名，声明方式：${变量名}。可以是引用 "系统参数" 或指定 "常量"。

  - 我们定义这种基准变量为 \$[...] 格式的，\$[yyyyMMddHHmmss] 是可以任意分解组合的，比如：\$[yyyyMMdd], \$[HHmmss], \$[yyyy-MM-dd] 等

  - 也可以通过以下两种方式：


        1.使用add_months()函数，该函数用于加减月份，
        第一个入口参数为[yyyyMMdd]，表示返回时间的格式
        第二个入口参数为月份偏移量，表示加减多少个月
    	* 后 N 年：$[add_months(yyyyMMdd,12*N)]
        * 前 N 年：$[add_months(yyyyMMdd,-12*N)]
        * 后 N 月：$[add_months(yyyyMMdd,N)]
        * 前 N 月：$[add_months(yyyyMMdd,-N)]
        *******************************************
        2.直接加减数字
        在自定义格式后直接“+/-”数字
        * 后 N 周：$[yyyyMMdd+7*N]
        * 前 N 周：$[yyyyMMdd-7*N]
        * 后 N 天：$[yyyyMMdd+N]
        * 前 N 天：$[yyyyMMdd-N]
        * 后 N 小时：$[HHmmss+N/24]
        * 前 N 小时：$[HHmmss-N/24]
        * 后 N 分钟：$[HHmmss+N/24/60]
        * 前 N 分钟：$[HHmmss-N/24/60]

##### 2.2 <span id=UserDefinedParameters>用户自定义参数</span>

  - 用户自定义参数分为全局参数和局部参数。全局参数是保存工作流定义和工作流实例的时候传递的全局参数，全局参数可以在整个流程中的任何一个任务节点的局部参数引用。
  - 设置全局参数的方法是，定义完成工作流后，点击页面右上角的”保存“按钮，在弹窗内点击“设置全局”下方的“+”按钮，如图：


<p align="center">
   <img src="/img/supplement_global_parameter.png" width="80%" />
</p>
​		这里定义的global_bizdate参数可以被其它任一节点的局部参数引用，并设置global_bizdate的value为通过引用系统参数                                    		system.biz.date获得的值：

<p align="center">
   <img src="/img/local_parameter.png" width="80%" />
 </p>

 - 设置局部参数的方法是，在定义工作流时，双击任一节点，点击弹窗中的自定义参数旁的‘+‘按钮：

<p align="center">
   <img src="/img/supplement_local_parameter.png" width="80%" />
 </p>

<p align="center">
   <img src="/img/global_parameter.png" width="80%" />
 </p>

​		观察上图的最后一行，local_param_bizdate通过\${global_bizdate}来引用全局参数，在shell脚本中可以通过\${local_param_bizdate}来引全局变量 global_bizdate的值，或通过JDBC直接将local_param_bizdate的值set进去。

​		同理，local_param通过${local_param}引用上一节中定义的全局参数。

​		biz_date、biz_curdate、system.datetime都是用户自定义的参数，通过${全局参数}进行赋值。

