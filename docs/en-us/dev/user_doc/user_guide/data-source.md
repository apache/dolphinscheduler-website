
# Data Source

Data source center supports MySQL, POSTGRESQL, HIVE/IMPALA, SPARK, CLICKHOUSE, ORACLE, SQLSERVER and other data sources

- Click "Data Source Center -> Create Data Source" to create different types of data sources according to requirements.
- Click "Test Connection" to test whether the data source can be successfully connected.

## MySQL


- Data source: select MYSQL
- Data source name: enter the name of the data source
- Description: Enter a description of the data source
- IP hostname: enter the IP to connect to MySQL
- Port: Enter the port to connect to MySQL
- Username: Set the username for connecting to MySQL
- Password: Set the password for connecting to MySQL
- Database name: Enter the name of the database connected to MySQL
- Jdbc connection parameters: parameter settings for MySQL connection, filled in in JSON form

<p align="center">
   <img src="/img/mysql-en.png" width="80%" />
 </p>

## POSTGRESQL

- Data source: select POSTGRESQL
- Data source name: enter the name of the data source
- Description: Enter a description of the data source
- IP/Host Name: Enter the IP to connect to POSTGRESQL
- Port: Enter the port to connect to POSTGRESQL
- Username: Set the username for connecting to POSTGRESQL
- Password: Set the password for connecting to POSTGRESQL
- Database name: Enter the name of the database connected to POSTGRESQL
- Jdbc connection parameters: parameter settings for POSTGRESQL connection, filled in in JSON form

<p align="center">
   <img src="/img/postgresql-en.png" width="80%" />
 </p>

## HIVE

### Use HiveServer2

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

### Use HiveServer2 HA Zookeeper

 <p align="center">
    <img src="/img/hive1-en.png" width="80%" />
  </p>

Note: If you enable **kerberos**, you need to fill in **Principal**

<p align="center">
    <img src="/img/hive-en.png" width="80%" />
  </p>

## Spark

<p align="center">
   <img src="/img/spark-en.png" width="80%" />
 </p>

- Data source: select Spark
- Data source name: enter the name of the data source
- Description: Enter a description of the data source
- IP/Hostname: Enter the IP connected to Spark
- Port: Enter the port connected to Spark
- Username: Set the username for connecting to Spark
- Password: Set the password for connecting to Spark
- Database name: Enter the name of the database connected to Spark
- Jdbc connection parameters: parameter settings for Spark connection, filled in in JSON form
