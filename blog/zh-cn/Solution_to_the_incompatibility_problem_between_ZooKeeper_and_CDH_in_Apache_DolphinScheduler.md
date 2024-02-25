---
title: Apache DolphinScheduler 中 ZooKeeper与CDH 不兼容问题的解决方案
keywords: Apache DolphinScheduler, ZooKeeper, CDH
description: 我们针对海豚调度和自助查询上运行的大数据任务自研了一款大数据任务实时智能诊断引擎。其工作流异常诊断覆盖率达85%，自助查询异常诊断覆盖率达88%，根据诊断引擎的报告平均每周进行6次“尝试自愈”操作，减少了数仓同学67%的凌晨值班告警电话。
---

# 背景

看到Apache DolphinScheduler社区群有很多用户反馈和讨论这块问题，针对不兼容的问题，不仅需要自己重新编译各一个新包，而且因为默认是使用zk-3.8的配置，所以会出现不兼容问题。使用zk-3.4配置即可适配3.4.x

### 解决办法（一）

#切换到项目源码的根路径中执行

```
mvn clean package -T 1C -Prelease '-Dmaven.test.skip=true' '-Dcheckstyle.skip=true' '-Dmaven.javadoc.skip=true' '-Dzk-3.4'
```

**上述命令解释**

```
mvn clean package  依次执行了clean、resources、compile、testResources、testCompile、test、jar(打包)等７个阶段。
```

指定多线程编译，可以增加~

**拓展**

```
-Dmaven.compile.fork=true 表示开启多线程
mvn -T 4 install -- will use 4 threads
mvn -T 1C install -- will use 1 thread per available CPU core
mvn clean package -T 1C -Dmaven.compile.fork=true
-Prelease 是 Maven Release Plugin 的配置
```

**Maven中-DskipTests和-Dmaven.test.skip=true的区别**

在使用mvn package进行编译、打包时，Maven会执行src/test/java中的JUnit测试用例，有时为了编译过程中跳过测试步骤，会使用参数-DskipTests和-Dmaven.test.skip=true，这两个参数的主要区别是：

```
-DskipTests，不执行测试用例，但编译测试用例类生成相应的class文件至target/test-classes下。
-Dmaven.test.skip=true，不执行测试用例，也不编译测试用例类。
-D参数
如果参数不存在于 pom.xml 文件中，它将被设置。如果参数已经存在 pom.xml 文件中，其值将被作为参数传递的值覆盖。
```

### 解决办法(二）

修改源码中的pom.xml配置文件

#### 1、从github下载源码

直接访问[https://github.com/](https://github.com/)，登陆之后搜索Apache DolphinScheduler！

![](/img/2024-02-18/1.png)

**在百度直接搜：**

![](/img/2024-02-18/2.png)

![](/img/2024-02-18/3.png)

![](/img/2024-02-18/4.png)

官网网址：
[https://github.com/apache/dolphinscheduler](https://github.com/apache/dolphinscheduler)

选择 release版本

![](/img/2024-02-18/5.png)

![](/img/2024-02-18/6.png)

#### 2、将下载好的zip包解压出来，并导入IDEA工具中

![](/img/2024-02-18/7.png)

![](/img/2024-02-18/8.png)

#### 3、修改maven和jdk配置

![](/img/2024-02-18/9.png)

![](/img/2024-02-18/10.png)

#### 4、MVN命令操作

**根目录执行**

mvn clean package -T 1C -Prelease '-Dmaven.test.skip=true' '-Dcheckstyle.skip=true' '-Dmaven.javadoc.skip=true' '-Dzk-3.4'

**报错如下**

Failed to execute goal com.diffplug.spotless:spotless-maven-plugin:2.27.2:check (default) on project dolphinscheduler: The following files had format violations:

![](/img/2024-02-18/11.png)

这个是问题没有因为没有[格式化](https://so.csdn.net/so/search?q=%E6%A0%BC%E5%BC%8F%E5%8C%96&spm=1001.2101.3001.7020)代码，所以在校验的时候不通过

根据上面的提示只需要执行下命令：`mvn spotless:apply `就可以了

![](/img/2024-02-18/12.png)

**随后会刷屏，过一会就会出现如下图，完事了**

![](/img/2024-02-18/13.png)

**再次根目录执行**

mvn clean package -T 1C -Prelease '-Dmaven.test.skip=true' '-Dcheckstyle.skip=true' '-Dmaven.javadoc.skip=true' '-Dzk-3.4'

**报错如下**

![](/img/2024-02-18/14.png)

从提示中可以看出来，`com.github.eirslett：frontend-maven-plugin`这个插件有问题

首先看看本地的maven仓库中，有没有把这个插件通过依赖下载出来

![](/img/2024-02-18/15.png)

**在****d:\\IdeaProjects\\dolphinscheduler-3.2.0-release\\dolphinscheduler-ui\\pom.xml****文件中**

把<goals>标签全都删除掉，防止构建时用npm的方式下载插件。

![](/img/2024-02-18/16.png)

**再次根目录执行**

mvn clean package -T 1C -Prelease '-Dmaven.test.skip=true' '-Dcheckstyle.skip=true' '-Dmaven.javadoc.skip=true' '-Dzk-3.4'

![](/img/2024-02-18/17.png)

可以看到，已经编译成功了。找到打好包生成的目标文件，位置是：项目源码目录\\dolphinscheduler-dist\\target

我的位置是 D:\\IdeaProjects\\dolphinscheduler-3.2.0-release\\dolphinscheduler-dist\\target

![](/img/2024-02-18/18.png)

#### 5、修改源码中的依赖配置

我不知道配置文件的指定的位置，在IDEA开发工具中按ctrl+shift+f组合键， 在项目所有文件中搜索：zookeeper.version

![](/img/2024-02-18/19.png)

在` d:\\IdeaProjects\\dolphinscheduler-3.2.0-release\\dolphinscheduler-bom\\pom.xml `文件中找到

![](/img/2024-02-18/20.png)

修改一下源码，修改后如下图所示

![](/img/2024-02-18/21.png)

根目录执行

```
mvn clean package -T 1C -Prelease '-Dmaven.test.skip=true' '-Dcheckstyle.skip=true' '-Dmaven.javadoc.skip=true'
```

![](/img/2024-02-18/22.png)

可以看到，已经编译成功了。希望本文能帮助更多用户解决问题，如果您对这个话题感兴趣，欢迎来社区交流！