# HIVE

## Use HiveServer2

 <p align="center">
    <img src="/img/hive-en.png" width="80%" />
  </p>

- Data source: select HIVE
- Data source name: enter the name of the data source
- Description: Enter a description of the data source
- IP/Host Name: Enter the IP connected to HIVE
- Port: Enter the port connected to HIVE
- Username: Set the username for connecting to HIVE
- Password: Set the password for connecting to HIVE
- Database name: Enter the name of the database connected to HIVE
- Jdbc connection parameters: parameter settings for HIVE connection, filled in in JSON form

> NOTICE: If you wish execute multiple HIVE SQL in the same session, you could set `support.hive.oneSession = true` in
> configure `common.properties`. It is helpful when you try to set env before running HIVE SQL. Parameter
> `support.hive.oneSession` default value is `false` and SQL would run in different session if their more than one.

## Use HiveServer2 HA Zookeeper

 <p align="center">
    <img src="/img/hive1-en.png" width="80%" />
  </p>
Note: If Kerberos is not enabled, ensure that the parameter `hadoop.security.authentication.startup.state`. The state value is `false`, Parameter `java.security.krb5.conf.path` value is null or empty If **Kerberos** is enabled, it needs to be in common Properties configure the following parameters

```conf
# whether to startup kerberos
hadoop.security.authentication.startup.state=true

# java.security.krb5.conf path
java.security.krb5.conf.path=/opt/krb5.conf

# login user from keytab username
login.user.keytab.username=hdfs-mycluster@ESZ.COM

# login user from keytab path
login.user.keytab.path=/opt/hdfs.headless.keytab
```