# SQL

## 综述

SQL任务类型，用于连接远程数据库并执行相应SQL。

## 创建数据源

- 点击数据源中心的“创建数据源”按钮，输入连接信息并测试连接。

## 创建任务

- 点击项目管理-项目名称-工作流定义，点击"创建工作流"按钮，进入DAG编辑页面。
- 工具栏中拖动 <img src="/img/tasks/demo/sql-icon.png" width="25"/> 到画板中，选择需要连接的数据源，即可完成创建。

## 任务参数

- 数据源：选择对应的数据源
- sql类型：支持查询和非查询两种，查询是select类型的查询，是有结果集返回的，可以指定邮件通知为表格、附件或表格附件三种模板。非查询是没有结果集返回的，是针对update、delete、insert三种类型的操作。
- sql参数：输入参数格式为key1=value1;key2=value2…
- sql语句：SQL语句
- UDF函数：对于HIVE类型的数据源，可以引用资源中心中创建的UDF函数，其他类型的数据源暂不支持UDF函数。
- 自定义参数：SQL任务类型，而存储过程是自定义参数顺序的给方法设置值自定义参数类型和数据类型同存储过程任务类型一样。区别在于SQL任务类型自定义参数会替换sql语句中${变量}。
- 前置sql:前置sql在sql语句之前执行。
- 后置sql:后置sql在sql语句之后执行。

## 任务样例

### 在hive中创建临时表并写入数据

该样例向hive中创建临时表`tmp_hello_world`并写入一行数据。选择SQL类型为非查询，在创建临时表之前需要确保该表不存在，所以会用到SQL任务中“前置sql”的功能，在“sql语句”执行之前将该表删除。

<img src="/img/tasks/demo/hive-sql-zh.png" alt="hive-sql-zh" style="zoom:80%;" />

运行该任务成功之后在hive中查询结果

<img src="/img/tasks/demo/hive-result.png" alt="hive-result" style="zoom:80%;" />

## 注意事项

注意SQL类型的选择，如果是INSERT等操作需要选择非查询类型。