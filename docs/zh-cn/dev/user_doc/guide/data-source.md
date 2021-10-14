# 数据源
TODO
数据源中心支持MySQL、POSTGRESQL、HIVE/IMPALA、SPARK、CLICKHOUSE、ORACLE、SQLSERVER等数据源。

- 点击“数据源中心->创建数据源”，根据需求创建不同类型的数据源。
- 点击“测试连接”，测试数据源是否可以连接成功。

## MySQL数据源

- 数据源：选择MYSQL
- 数据源名称：输入数据源的名称
- 描述：输入数据源的描述
- IP主机名：输入连接MySQL的IP
- 端口：输入连接MySQL的端口
- 用户名：设置连接MySQL的用户名
- 密码：设置连接MySQL的密码
- 数据库名：输入连接MySQL的数据库名称
- Jdbc连接参数：用于MySQL连接的参数设置，以JSON形式填写

<p align="center">
   <img src="/img/mysql_edit.png" width="80%" />
 </p>

## POSTGRESQL数据源

- 数据源：选择POSTGRESQL
- 数据源名称：输入数据源的名称
- 描述：输入数据源的描述
- IP/主机名：输入连接POSTGRESQL的IP
- 端口：输入连接POSTGRESQL的端口
- 用户名：设置连接POSTGRESQL的用户名
- 密码：设置连接POSTGRESQL的密码
- 数据库名：输入连接POSTGRESQL的数据库名称
- Jdbc连接参数：用于POSTGRESQL连接的参数设置，以JSON形式填写

<p align="center">
   <img src="/img/postgresql_edit.png" width="80%" />
 </p>

## HIVE数据源

### 使用HiveServer2

 <p align="center">
    <img src="/img/hive_edit.png" width="80%" />
  </p>

- 数据源：选择HIVE
- 数据源名称：输入数据源的名称
- 描述：输入数据源的描述
- IP/主机名：输入连接HIVE的IP
- 端口：输入连接HIVE的端口
- 用户名：设置连接HIVE的用户名
- 密码：设置连接HIVE的密码
- 数据库名：输入连接HIVE的数据库名称
- Jdbc连接参数：用于HIVE连接的参数设置，以JSON形式填写

### 使用HiveServer2 HA Zookeeper

 <p align="center">
    <img src="/img/hive_edit2.png" width="80%" />
  </p>


注意：如果开启了**kerberos**，则需要填写 **Principal**
<p align="center">
    <img src="/img/hive_kerberos.png" width="80%" />
  </p>

## Spark数据源

<p align="center">
   <img src="/img/spark_datesource.png" width="80%" />
 </p>

- 数据源：选择Spark
- 数据源名称：输入数据源的名称
- 描述：输入数据源的描述
- IP/主机名：输入连接Spark的IP
- 端口：输入连接Spark的端口
- 用户名：设置连接Spark的用户名
- 密码：设置连接Spark的密码
- 数据库名：输入连接Spark的数据库名称
- Jdbc连接参数：用于Spark连接的参数设置，以JSON形式填写

注意：如果开启了**kerberos**，则需要填写 **Principal**

<p align="center">
    <img src="/img/sparksql_kerberos.png" width="80%" />
  </p>
