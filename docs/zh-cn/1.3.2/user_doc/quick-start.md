# 快速上手

* 管理员用户登录
  >地址：http://192.168.xx.xx:12345/dolphinscheduler 用户名密码：admin/dolphinscheduler123

<p align="center">
   <img src="/img/login.png" width="60%" />
 </p>

* 创建队列
<p align="center">
   <img src="/img/create-queue.png" width="60%" />
 </p>

  * 创建租户
   <p align="center">
    <img src="/img/addtenant.png" width="60%" />
  </p>

  * 创建普通用户
<p align="center">
   <img src="/img/useredit2.png" width="60%" />
 </p>

  * 创建告警组
 <p align="center">
    <img src="/img/mail_edit.png" width="60%" />
  </p>

 * 创建Worker分组
 
 1.3.x版本为了支持docker,暂时不支持页面添加Worker分组,只能通过修改 **conf/worker.properties** 配置文件方式添加.
 参考[用户手册: 5.7 Worker分组](/zh-cn/docs/1.3.2/user_doc/system-manual.html?_blank) 
 
 
 * 创建token令牌
 <p align="center">
    <img src="/img/creat_token.png" width="60%" />
  </p>

  * 使用普通用户登录
  > 点击右上角用户名“退出”，重新使用普通用户登录。

  * 项目管理->创建项目->点击项目名称
<p align="center">
   <img src="/img/project.png" width="60%" />
 </p>

  * 点击工作流定义->创建工作流定义->上线工作流定义

<p align="center">
   <img src="/img/dag1.png" width="60%" />
 </p>

  * 运行工作流定义->点击工作流实例->点击工作流实例名称->双击任务节点->查看任务执行日志

 <p align="center">
   <img src="/img/task-log.png" width="60%" />
</p>