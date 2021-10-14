# SQL节点

- 拖动工具栏中的![PNG](https://analysys.github.io/easyscheduler_docs_cn/images/toolbar_SQL.png)任务节点到画板中
- 非查询SQL功能：编辑非查询SQL任务信息，sql类型选择非查询，如下图所示：
  <p align="center">
   <img src="/img/sql-node.png" width="80%" />
 </p>

- 查询SQL功能：编辑查询SQL任务信息，sql类型选择查询，选择表格或附件形式发送邮件到指定的收件人，如下图所示。

<p align="center">
   <img src="/img/sql-node2.png" width="80%" />
 </p>

- 数据源：选择对应的数据源
- sql类型：支持查询和非查询两种，查询是select类型的查询，是有结果集返回的，可以指定邮件通知为表格、附件或表格附件三种模板。非查询是没有结果集返回的，是针对update、delete、insert三种类型的操作。
- sql参数：输入参数格式为key1=value1;key2=value2…
- sql语句：SQL语句
- UDF函数：对于HIVE类型的数据源，可以引用资源中心中创建的UDF函数,其他类型的数据源暂不支持UDF函数。
- 自定义参数：SQL任务类型，而存储过程是自定义参数顺序的给方法设置值自定义参数类型和数据类型同存储过程任务类型一样。区别在于SQL任务类型自定义参数会替换sql语句中${变量}。
- 前置sql:前置sql在sql语句之前执行。
- 后置sql:后置sql在sql语句之后执行。
