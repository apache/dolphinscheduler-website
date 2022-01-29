# HIVE数据源

## 使用HiveServer2

 <p align="center">
    <img src="/img/hive_edit.png" width="80%" />
  </p>

- 数据源：选择HIVE
- 数据源名称：输入数据源
- 描述：输入数据源描述
- IP/主机名：输入连接HIVE IP
- 端口：输入连接HIVE端口
- 用户名：设置连接HIVE用户名
- 密码：设置连接HIVE的密码
- 数据库名：输入连接HIVE数据库
- Jdbc连接参数：用于HIVE连接参数设置，以JSON形式填写

## 使用HiveServer2 HA Zookeeper

 <p align="center">
    <img src="/img/hive_edit2.png" width="80%" />
  </p>


注意：

没有开启kerberos情况下需保证参数 `hadoop.security.authentication.startup.state` 值为 `false`，参数 `java.security.krb5.conf.path` 值为空.

开启**kerberos**，需在 `common.properties` 配置以下参数：

```conf
# whether to startup kerberos
hadoop.security.authentication.startup.state=true

# java.security.krb5.conf path
java.security.krb5.conf.path=/opt/krb5.conf

# login user from keytab username
login.user.keytab.username=hdfs-mycluster@ESZ.COM

# login user from keytab path
login.user.keytab.path=/opt/hdfs.headless.keytab
