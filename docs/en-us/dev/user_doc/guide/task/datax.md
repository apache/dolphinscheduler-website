# DataX Node

- Drag from the toolbar <img src="/img/datax.png" width="35"/> task node into the canvas, as shown in the figure below:

  <p align="center">
   <img src="/img/datax-en.png" width="80%" />
  </p>

- Custom template: When you turn on the custom template switch, you can customize the JSON configuration content of the DataX node (applicable when the control configuration does not satisfy requirements)
- Data source: select the data source to extract data
- SQL statement: the SQL statement used to extract data from the target database, the SQL query column name is automatically parsed when execute the node, and mapped to the target table to synchronize column name. When the column names of the source table and the target table are inconsistent, they can be converted by column alias (as)
- Target database: select the target database for data synchronization
- Target table: the name of the target table for data synchronization
- Pre-SQL: Pre-SQL executes before the SQL statement (executed by the target database)
- Post-SQL: Post-SQL executes after the SQL statement (executed by the target database)
- JSON: JSON configuration file for DataX synchronization
- Custom parameters: SQL task type, and stored procedure is a custom parameter order, to set customized parameter type and data type for the method is the same as the stored procedure task type. The difference is that the custom parameter of the SQL task type replaces the `${variable}` in the SQL statement.
