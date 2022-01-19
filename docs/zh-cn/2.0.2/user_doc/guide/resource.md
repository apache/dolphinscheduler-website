# 资源中心

如果需要用到资源上传功能，针对单机可以选择本地文件目录作为上传文件夹(此操作不需要部署 Hadoop)。当然也可以选择上传到 Hadoop or MinIO 集群上，此时则需要有Hadoop (2.6+) 或者 MinIO 等相关环境

> **_注意:_**
>
> * 如果用到资源上传的功能，那么 [安装部署](installation/standalone.md)中，部署用户需要有这部分的操作权限
> * 如果 Hadoop 集群的 NameNode 配置了 HA 的话，需要开启 HDFS 类型的资源上传，同时需要将 Hadoop 集群下的 `core-site.xml` 和 `hdfs-site.xml` 复制到 `/opt/dolphinscheduler/conf`，非 NameNode HA 跳过次步骤

## hdfs资源配置

- 上传资源文件和udf函数，所有上传的文件和资源都会被存储到hdfs上，所以需要以下配置项：

```  
conf/common.properties  
    # Users who have permission to create directories under the HDFS root path
    hdfs.root.user=hdfs
    # data base dir, resource file will store to this hadoop hdfs path, self configuration, please make sure the directory exists on hdfs and have read write permissions。"/dolphinscheduler" is recommended
    resource.upload.path=/dolphinscheduler
    # resource storage type : HDFS,S3,NONE
    resource.storage.type=HDFS
    # whether kerberos starts
    hadoop.security.authentication.startup.state=false
    # java.security.krb5.conf path
    java.security.krb5.conf.path=/opt/krb5.conf
    # loginUserFromKeytab user
    login.user.keytab.username=hdfs-mycluster@ESZ.COM
    # loginUserFromKeytab path
    login.user.keytab.path=/opt/hdfs.headless.keytab    
    # if resource.storage.type is HDFS，and your Hadoop Cluster NameNode has HA enabled, you need to put core-site.xml and hdfs-site.xml in the installPath/conf directory. In this example, it is placed under /opt/soft/dolphinscheduler/conf, and configure the namenode cluster name; if the NameNode is not HA, modify it to a specific IP or host name.
    # if resource.storage.type is S3，write S3 address，HA，for example ：s3a://dolphinscheduler，
    # Note，s3 be sure to create the root directory /dolphinscheduler
    fs.defaultFS=hdfs://mycluster:8020    
    #resourcemanager ha note this need ips , this empty if single
    yarn.resourcemanager.ha.rm.ids=192.168.xx.xx,192.168.xx.xx    
    # If it is a single resourcemanager, you only need to configure one host name. If it is resourcemanager HA, the default configuration is fine
    yarn.application.status.address=http://xxxx:8088/ws/v1/cluster/apps/%s

```

## 文件管理

> 是对各种资源文件的管理，包括创建基本的txt/log/sh/conf/py/java等文件、上传jar包等各种类型文件，可进行编辑、重命名、下载、删除等操作。
  <p align="center">
   <img src="/img/file-manage.png" width="80%" />
 </p>

* 创建文件

  > 文件格式支持以下几种类型：txt、log、sh、conf、cfg、py、java、sql、xml、hql、properties

    <p align="center">
        <img src="/img/file_create.png" width="80%" />
    </p>

* 上传文件
  > 上传文件：点击"上传文件"按钮进行上传，将文件拖拽到上传区域，文件名会自动以上传的文件名称补全

    <p align="center">
        <img src="/img/file_upload.png" width="80%" />
    </p>

* 文件查看

  > 对可查看的文件类型，点击文件名称，可查看文件详情

    <p align="center">
        <img src="/img/file_detail.png" width="80%" />
    </p>

* 下载文件

  > 点击文件列表的"下载"按钮下载文件或者在文件详情中点击右上角"下载"按钮下载文件

* 文件重命名

<p align="center">
   <img src="/img/file_rename.png" width="80%" />
 </p>

* 删除

>  文件列表->点击"删除"按钮，删除指定文件

## UDF管理

### 资源管理

  > 资源管理和文件管理功能类似，不同之处是资源管理是上传的UDF函数，文件管理上传的是用户程序，脚本及配置文件
  > 操作功能：重命名、下载、删除。

* 上传udf资源

  > 和上传文件相同。

### 函数管理

* 创建udf函数

  > 点击“创建UDF函数”，输入udf函数参数，选择udf资源，点击“提交”，创建udf函数。
  > 目前只支持HIVE的临时UDF函数

- UDF函数名称：输入UDF函数时的名称
- 包名类名：输入UDF函数的全路径  
- UDF资源：设置创建的UDF对应的资源文件

<p align="center">
   <img src="/img/udf_edit.png" width="80%" />
 </p>