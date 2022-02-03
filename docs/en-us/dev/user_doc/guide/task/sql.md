# SQL

## Overview

SQL task, used to connect to remote database and execute SQL.

## create data source

Click the "create Datasource" button in the Datasource, enter the connection information and test the connection.

## Create Task

- Click Project Management-Project Name-Workflow Definition, and click the "Create Workflow" button to enter the DAG editing page.
- Drag <img src="/img/tasks/demo/sql-icon.png" width="25"/> from the toolbar to the drawing board.

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

### Create a temporary table in hive and write data

This example creates a temporary table `tmp_hello_world` in hive and write a row of data. Before creating a temporary table, you need to ensure that the table does not exist, so you will use the "Pre Statement" function in the SQL task to delete the table before the "SQL statement" is executed.

<img src="/img/tasks/demo/hive-sql-en.png" alt="hive-sql-en" style="zoom:80%;" />

After running the task successfully, query the results in hive.

<img src="/img/tasks/demo/hive-result.png" alt="hive-result" style="zoom:80%;" />

## Notice

Pay attention to the selection of SQL type. If it is an insert operation, you need to select "Non Query" type.