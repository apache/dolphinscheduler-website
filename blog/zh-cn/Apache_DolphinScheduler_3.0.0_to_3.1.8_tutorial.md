```
title: Apache DolphinScheduler 3.0.0 升级到 3.1.8 教程
keywords: Apache DolphinScheduler, 升级, 教程
description: 安装部署的流程可参考官网的文档Version 3.1.8/部署指南/伪集群部署安装部署的流程可参考官网的文档
```

## 背景介绍

[Version 3.1.8/部署指南/伪集群部署(Pseudo-Cluster)
https://dolphinscheduler.apache.org/zh-cn/docs/3.1.8/guide/installation/pseudo-cluster](https://dolphinscheduler.apache.org/zh-cn/docs/3.1.8/guide/installation/pseudo-cluster "Version 3.1.8/部署指南/伪集群部署(Pseudo-Cluster)")

本文开始之前，我先补充说明一下升级 Apache DolphinScheduler 的几个关键点

## 元数据备份

做好已有**元数据做备份**（以 MySQL 为例，[元数据存储](https://so.csdn.net/so/search?q=%E5%85%83%E6%95%B0%E6%8D%AE%E5%AD%98%E5%82%A8&spm=1001.2101.3001.7020)在 Mysql 的 dolphinscheduler 数据库里）

### 伪代码

    mysqldump -u root -p dolphinscheduler > dolphinscheduler_backup_XXX.sql

apache-dolphinscheduler-3.1.8-bin/bin/env/**install_env.sh**

apache-dolphinscheduler-3.1.8-bin/bin/env/**dolphinscheduler_env.sh**

这两个文件的配置项，可以从旧版本的相应文件里直接复制粘贴

需要将使用到的数据库（比如 MySQL）的 connector (本人亲测 mysql-connector-java-8.0.30.jar 适用，其他 connector 版本未测试)放到相应的 libs 库里

**api-server/libs**

**alert-server/libs**

**master-server/libs**

**worker-server/libs**

**tools/libs**

伪代码如下

    cp XXX/mysql-connector-java-8.0.30.jar XXX/apache-dolphinscheduler-3.1.8-bin/api-server/libs/
    cp XXX/mysql-connector-java-8.0.30.jar XXX/apache-dolphinscheduler-3.1.8-bin/alert-server/libs
    cp XXX/mysql-connector-java-8.0.30.jar XXX/apache-dolphinscheduler-3.1.8-bin/master-server/libs
    cp XXX/mysql-connector-java-8.0.30.jar XXX/apache-dolphinscheduler-3.1.8-bin/worker-server/libs
    cp XXX/mysql-connector-java-8.0.30.jar XXX/apache-dolphinscheduler-3.1.8-bin/tools/libs

common.properties 文件，需要修改相应的参数

**alert-server/conf/common.properties**  
**api-server/conf/common.properties**  
**master-server/conf/common.properties**  
**worker-server/conf/common.properties**

本人升级时，只修改了

api-server/conf/common.properties

worker-server/conf/common.properties

这两个文件的三个参数

（

resource.storage.type

resource.storage.upload.base.path

resource.hdfs.fs.defaultFS

）

需要注意的是，3.1.8 此文件的有些参数名和 3.0.0 此文件中的参数名有变化。

_3.0.0 参数_ _resource.upload.path_

**对应**

3.1.8 参数 resource.storage.upload.base.path

_3.0.0 参数_ _fs.defaultFS_ 

**对应** 

3.1.8 参数 resource.hdfs.fs.defaultFS

## CDH集群升级

如果是 CDH 集群（比如 CDH 6.2.1）升级使用  Apache DolphinScheduler 3.1.8

还需要替换相应的 Zookeeper jar 包， **否则会有  Zookeeper Failed to delete registry key 报错提示

**

### 参考文章

Dolphin3.0在伪集群模式下总是会报zookeeper Failed to delete registry key，我该怎么排查这个问题：
_https://github.com/apache/dolphinscheduler/discussions/11948_

看看是不是 Zookeeper 的版本不兼容，DolphinScheduler3.1.8 版本的 zookeeper 和 curator 是下面这个:  

curator-client-5.3.0.jar  
curator-recipes-5.3.0.jar  
curator-framework-5.3.0.jar  
zookeeper-3.8.0.jar

将/api-server/libs，master-server/libs，worker-server/libs，/tools/libs 下的 zookeeper，curator 的版本**替换成 Zookeeper 服务版本一致**才行。

**注意**：zookeeper-3.4.x 对应的 curator-\*版本必须是 4.2.0

CDH6.2.1 使用的是

ZooKeeper

3.4.5+cdh6.2.1

即 Zookeeper-3.4.5 版本，需要下载相应的 jar 包  zookeeper-3.4.5.jar,可从如下网站上搜索下载 jar 包:_https://nowjava.com/jar/_

此外还需要下载下面三个 jar 包

- curator-client-4.2.0.jar  
- curator-recipes-4.2.0.jar  
- curator-framework-4.2.0.jar

即：

- zookeeper-3.4.5.jar
- curator-client-4.2.0.jar  
- curator-recipes-4.2.0.jar  
- curator-framework-4.2.0.jar

将这 4 个 jar 包放到如下

- api-server/libs
- master-server/libs
- worker-server/libs
- tools/libs

这四个目录，并替换原先的版本 jar 包，伪代码如下

    ####################### 
    cd XXX/apache-dolphinscheduler-3.1.8-bin/api-server/libs/ 
    
    rm -f zookeeper-3.8.0.jar
    cp XXXX/zookeeper-3.4.5.jar . 
    
    rm -f curator-*
    cp XXXX/curator-*4.2* . 
    
    ####################### 
    
    cd XXX/apache-dolphinscheduler-3.1.8-bin/master-server/libs 
    
    rm -f zookeeper-3.8.0.jar
    cp XXXX/zookeeper-3.4.5.jar . 
    
    rm -f curator-*
    cp XXXX/curator-*4.2* . 
    
    ####################### 
    
    cd XXX/apache-dolphinscheduler-3.1.8-bin/worker-server/libs 
    
    rm -f zookeeper-3.8.0.jar
    cp XXXX/zookeeper-3.4.5.jar . 
    
    rm -f curator-*
    cp XXXX/curator-*4.2* . 
    
    ####################### 
    
    cd XXX/apache-dolphinscheduler-3.1.8-bin/tools/libs 
    
    rm -f zookeeper-3.8.0.jar
    cp XXXX/zookeeper-3.4.5.jar . 
    
    rm -f curator-*
    cp XXXX/curator-*4.2* . 
    
    #######################

以上这五点都修改完后，停掉 Apache DolphinScheduler 3.0.0

### 伪代码

    su - dolphinschedulercd XXXX/apache-dolphinscheduler-3.0.0-bin# 一键停止集群所有服务bash ./bin/stop-all.sh

初始化 DolphinScheduler 3.1.8

    cd XXXX/apache-dolphinscheduler-3.1.8-bin 
    
    sh ./tools/bin/upgrade-schema.sh
    
    
    cd XXXX/apache-dolphinscheduler-3.1.8-bin 
    
    sh ./bin/install.sh

   到这里就升级完成了