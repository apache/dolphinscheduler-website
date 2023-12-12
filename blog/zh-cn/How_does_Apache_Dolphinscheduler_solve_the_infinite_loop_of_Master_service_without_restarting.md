---
title: Apache Dolphinscheduler如何不重启解决Master服务死循环
keywords: Apache DolphinScheduler, 死循环, Master
description: 相信不少使用过3.0的用户都遇到过Master服务中存在一些工作流一直不停的死循环的问题，本人到现在也没找到触发的原因，但是通过与同事的摸索，暂时找到了一个可以借助Arthas解决死循环的方法。
---

# 个人建议

Apache Dolphinscheduler作为一个开源的调度平台，目前已经更新到了3.X版本，4.0版本也已经呼之欲出。3.0版本作为尝鲜版本，新添加了许多的功能，同时也存在非常多的隐患，本人使用3.0版本作为生产调度也踩了很多坑，到现在依然存在很多难以解决的问题，所以建议小伙伴们尽量使用2.x版本，相对稳定一些。

> 近期在跟社区的沟通中，**最新3.2.0版本，该问题已经得到解决！**感兴趣可以了解最新版本。

![](/img/2023-10-31/6.png)

下面主要记录的是一个3.0比较难搞的问题，相信不少使用过3.0的用户都遇到过Master服务中存在一些工作流一直不停的死循环的问题，本人到现在也没找到触发的原因，但是通过与同事的摸索，暂时找到了一个可以借助Arthas解决死循环的方法。

## 死循环的影响

**CPU飙高**：每个工作流的运行在Master中都是一个线程，当这个线程一直没有结束时，是会占用CPU资源的，当服务中存在大量的线程死循环时，可想而知，服务器的资源压力有多大。

**磁盘打满**：循环的线程内存在日志打印，当大量的线程无时无刻在打印日志时，日志文件会迅速堆积，磁盘的大小是固定的，当磁盘使用率超过一定的阀值时，其他的程序也会因为磁盘可用空间不足而受影响。有些人设置了Logback等日志框架配置，限定了日志文件的总大小，但是这样也会引发日志快速覆盖问题，无法找到可用的日志。

**数据库压力**：每个循环里面都有相关的数据库查询操作，大量的查询会造成数据库压力短期内迅速增大，如果数据库性能不能很好的话，可能数据库就会先挂了。

## 解决思路

首先我们需要判断循环类型，是内存性死循环还是数据库性死循环，因为内存性死循环，我们大部分可以通过修改数据库来解决，但是内存性死循环，我们就必须借助某些工具，去内存中修改。

通过日志查看，循环代码，并找到循环数据的来源。

![](/img/2023-10-31/1.png)

通过查看日志，发现每次出现循环时都会出现“Start workflow error”、"Failed to submit the workflow instance"报错，当工作流出现问题时，程序会将工作流事件重新放回到执行队列中，等待下次执行，这样就变成了无限循环报错。

通过“Failed to submit the workflow instance”，我们在项目里全局搜索，查看报错的逻辑是什么，是如何将报错的工作流处理事件重新添加到处理队列中的。



![](/img/2023-10-31/2.png)![](/img/2023-10-31/3.png)



从上面被红框圈出来的关键处代理，我们可以梳理出一个基本的master服务处理工作流的一个事件流程，工作流的线程类（WorkflowExecuteRunnable）被放到缓存中，缓存的key是工作流实例的ID,同时每一个工作流都有对应的事件，事件中存储工作流实例的ID，每次执行事件时都会从缓存中获取线程类，当线程类执行失败时便重新创建一个事件加入事件队列中执行，依次往复，除非缓存中的数据被清除了，才会结束循环。具体流程如下图：

![](/img/2023-10-31/4.png)



通过清理内存中的工作流线程即可解决循环问题。



## 三、实际操作

进入Master服务的日志目录

通过日志查找所有在循环中的工作流实例的id

```
grep WorkflowInstance  dolphinscheduler-master.log|grep "Start workflow error" |awk -F 'WorkflowInstance-' '{print $2}'| awk -F']' '{print $1}' |sort |uniq
```

安装Arthas，启动Arthas,选择API-Server服务,先使用API服务物理删除循环的工作流实例相关的数据库数据，防止下次重启后依然循环。

在Arthas中调用下面的方法

```
ognl  '@org.apache.dolphinscheduler.service.bean.SpringApplicationContext@applicationContext.getBean("processServiceImpl").deleteWorkProcessInstanceById("工作流实例id")'
ognl  '@org.apache.dolphinscheduler.service.bean.SpringApplicationContext@applicationContext.getBean("processServiceImpl").deleteAllSubWorkProcessByParentId("工作流实例id")'
ognl  '@org.apache.dolphinscheduler.service.bean.SpringApplicationContext@applicationContext.getBean("processServiceImpl").deleteWorkProcessMapByParentId("工作流实例id")'
ognl  '@org.apache.dolphinscheduler.service.bean.SpringApplicati
onContext@applicationContext.getBean("processServiceImpl").deleteWorkTaskInstanceByProcessInstanceId("工作流实例id")'
```

![](/img/2023-10-31/5.png)



ognl表达式参考这个链接 https://arthas.aliyun.com/doc/ognl.html

通过Arthas进入master-server 调用ognl清除工作流缓存

```
ognl  '@org.apache.dolphinscheduler.service.bean.SpringApplicationContext@applicationContext.getBean("processInstanceExecCacheManagerImpl").removeByProcessInstanceId("工作流实例id")'
```
