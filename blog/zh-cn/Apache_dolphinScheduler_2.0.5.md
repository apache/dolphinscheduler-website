# Apache DolphinScheduler 2.0.5 发布，Worker 容错流程优化

<div align=center>
<img src="/img/2022-3-7/1.png"/>
</div>

今天，Apache DolphinScheduler 宣布 2.0.5 版本正式发布。此次版本进行了一些功能优化，如 Worker 的容错流程优化，在资源中心增加了重新上传文件的功能，并进行了若干 Bug 修复。


## 优化

### Worker 容错流程

2.0.5 版本优化了 worker 的容错流程，使得服务器由于压力过大导致 worker 服务中断时，可以正常将任务转移至其他worker 上继续执行，避免任务中断。

### 禁止运行任务页面标志

优化禁止运行任务的页面显示标志，区别于正常执行的任务显示，以免用户混淆工作状态。

<div align=center>

<img src="/img/2022-3-7/2.png"/>

</div>

### 任务框增加提示语

2.0.5 版本在任务框上增加了提示语，可以显示出全部的长任务名字，方便用户查看。

<div align=center>

<img src="/img/2022-3-7/3.png"/>

</div>

### 资源中心增加重新上传文件功能

在资源中心增加了重新上传文件的功能，当用户需要修改执行脚本时，无需再重新配置任务参数，可实现自动更新执行脚本功能。

### 修改工作流后跳转到列表页

改变了此前修改工作流以后页面仍然留在 DAG 页面的现状，优化后可跳转到列表页，便于用户后续操作。

### 钉钉告警插件新增 Markdown 信息类型

在钉钉告警插件的告警内容中新增 Markdown 信息类型，丰富信息类型支持。

## Bug 修复

[[#8213](https://github.com/apache/dolphinscheduler/issues/8213)] 修复了当 worker 分组包含大写字母时，任务运行错误的问题；

[[#8347](https://github.com/apache/dolphinscheduler/pull/8347)] 修复了当任务失败重试时，工作流不能被停止的问题；

[[#8135](https://github.com/apache/dolphinscheduler/issues/8135)] 修复了 jdbc 连接参数不能输入‘@’的问题；

[[#8367](https://github.com/apache/dolphinscheduler/issues/8367)]  修复了补数时可能不会正常结束的问题；

[[#8170](https://github.com/apache/dolphinscheduler/issues/8170)]  修复了从页面上不能进入子工作流的问题。

**2.0.5 下载地址**：

[https://dolphinscheduler.apache.org/zh-cn/download/download.html](https://dolphinscheduler.apache.org/zh-cn/download/download.html)

**Release Note：**[https://github.com/apache/dolphinscheduler/releases/tag/2.0.5](https://github.com/apache/dolphinscheduler/releases/tag/2.0.5)

## 感谢贡献者

感谢 Apache DolphinScheduler 2.0.5 版本的贡献者，贡献者 GitHub ID 列表如下（排名不分先后）：

<div align=center>

<img src="/img/2022-3-7/4.png"/>

</div>

