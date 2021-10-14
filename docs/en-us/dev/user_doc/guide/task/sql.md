# SQL

- Drag in the toolbar![PNG](https://analysys.github.io/easyscheduler_docs_cn/images/toolbar_SQL.png)Task node into the drawing board
- Non-query SQL function: edit non-query SQL task information, select non-query for sql type, as shown in the figure below:
 <p align="center">
  <img src="/img/sql-en.png" width="80%" />
</p>

- Query SQL function: Edit and query SQL task information, sql type selection query, select form or attachment to send mail to the specified recipient, as shown in the figure below.

<p align="center">
   <img src="/img/sql-node-en.png" width="80%" />
 </p>

- Data source: select the corresponding data source
- sql type: supports query and non-query. The query is a select type query, which is returned with a result set. You can specify three templates for email notification as form, attachment or form attachment. Non-queries are returned without a result set, and are for three types of operations: update, delete, and insert.
- sql parameter: the input parameter format is key1=value1;key2=value2...
- sql statement: SQL statement
- UDF function: For data sources of type HIVE, you can refer to UDF functions created in the resource center. UDF functions are not supported for other types of data sources.
- Custom parameters: SQL task type, and stored procedure is a custom parameter order to set values for the method. The custom parameter type and data type are the same as the stored procedure task type. The difference is that the SQL task type custom parameter will replace the \${variable} in the SQL statement.
- Pre-sql: Pre-sql is executed before the sql statement.
- Post-sql: Post-sql is executed after the sql statement.