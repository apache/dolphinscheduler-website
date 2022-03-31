# SQL

## Overview

SQL task, used to connect to database and execute SQL.

## Create Data Source

Refer to [Data Source](../datasource/introduction.md)

## Create Task

- Click Project Management-Project Name-Workflow Definition, and click the "Create Workflow" button to enter the DAG editing page.
- Drag <img src="/img/tasks/icons/sql.png" width="25"/> from the toolbar to the drawing board.

## Task Parameter

- Data source: select the corresponding data source
- sql type: supports query and non-query. The query is a select type query, which is returned with a result set. You can specify three templates for email notification as form, attachment or form attachment. Non-queries are returned without a result set, and are for three types of operations: update, delete, and insert.
- sql parameter: the input parameter format is key1=value1;key2=value2...
- sql statement: SQL statement
- UDF function: For data sources of type HIVE, you can refer to UDF functions created in the resource center. UDF functions are not supported for other types of data sources.
- Custom parameters: SQL task type, and stored procedure is a custom parameter order to set values for the method. The custom parameter type and data type are the same as the stored procedure task type. The difference is that the SQL task type custom parameter will replace the ${variable} in the SQL statement.
- Pre-sql: Pre-sql is executed before the sql statement.
- Post-sql: Post-sql is executed after the sql statement.

## Task Example

### Create a Temporary Table in Hive and Write Data

This example creates a temporary table `tmp_hello_world` in hive and write a row of data. Before creating a temporary table, we need to ensure that the table does not exist, so we will use custom parameters to obtain the time of the day as the suffix of the table name every time we run, so that this task can run every day. The format of the created table name is: `tmp_hello_world_{yyyyMMdd}`.

![hive-sql](/img/tasks/demo/hive-sql.png)

### After Running the Task Successfully, Query the Results in Hive.

Log in to the bigdata cluster and use 'hive' command or 'beeline' or 'JDBC' and other methods to connect to the 'Apache Hive' for the query. The query SQL is `select * from tmp_hello_world_{yyyyMMdd}`, please replace '{yyyyMMdd}' with the date of the running day. The query screenshot is as follows:

![hive-sql](/img/tasks/demo/hive-result.png)

## Notice

Pay attention to the selection of SQL type. If it is an insert operation, you need to select "Non Query" type.