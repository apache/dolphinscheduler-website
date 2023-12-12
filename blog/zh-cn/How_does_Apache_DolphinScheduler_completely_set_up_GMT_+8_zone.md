### 

---
title: Apache DolphinScheduler如何完全设置东八区？
keywords: Apache DolphinScheduler, 时区, 东八区
description: 为了兼容全世界不同时区，Apache DolphinScheduler 使用的是 UTC 0 时区，包括保存到数据库表中的数据时区，以及展示到页面上的时区。
---

 

### 默认情况

为了兼容全世界不同时区，Apache DolphinScheduler 使用的是 UTC 0 时区，包括保存到数据库表中的数据时区，以及展示到页面上的时区。

如果我们想在页面上看到东八区时间，则需要在页面上手动选择上海时区，如下图所示：

![](/img/2023-11-9/1.png)

这样选择之后，虽然页面上显示的时间是对的，但是具体单个任务中的日志时间依然是 0 时区，而且底层表中所有数据的时间也是 0 时区。

如果想要页面上显示的时间是东八区，而且任务日志中的时区也是东八区，并且表中保存的数据时间也是东八区，则需要修改如下几个地方的设置。_（修改有风险。请备份好您的相关文件。）_

### 配置修改

首先切换到你解压的安装包根目录，然后修改下面说明的文件。

1.环境变量文件

文件位置：bin/env/dolphinscheduler_env.sh  
文件修改内容： 

```
export SPRING_DATASOURCE_URL="jdbc:mysql://node01:3306/dolphinscheduler?useUnicode=true&characterEncoding=UTF-8&useSSL=false&serverTimezone=Asia/Shanghai"
export SPRING_JACKSON_TIME_ZONE=${SPRING_JACKSON_TIME_ZONE:-GMT+8}
```

第一个环境配置的连接 mysql 的 url，最后面添加时区设置，同时也要注意，自己的 mysql 数据库使用的也是东八区。

第二个环境配置的是启动 spring 容器时使用的时区设置，也设置为东八区。该环境变量会被海豚所有角色在启动 JVM 时设置到 JAVA OPTS 中。

2.各角色 spring 配置文件

文件位置：${角色}/conf/application.yaml

角色包括：alert-server、api-server、master-server、worker-server。  
文件修改内容： 

```
spring:
  banner:
    charset: UTF-8
  jackson:
    time-zone: GMT+8
    date-format: "yyyy-MM-dd HH:mm:ss"
```

1. 1. 要修改的是`time-zone`的内容，将其改为`GMT+8`。

修改之后，直接执行bin/install.sh文件，安装海豚调度器即可。

最后要记得，Apache DolphinScheduler 页面右上角依然要选择上海时区。

---
