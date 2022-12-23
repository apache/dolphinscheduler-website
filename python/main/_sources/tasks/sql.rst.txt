.. Licensed to the Apache Software Foundation (ASF) under one
   or more contributor license agreements.  See the NOTICE file
   distributed with this work for additional information
   regarding copyright ownership.  The ASF licenses this file
   to you under the Apache License, Version 2.0 (the
   "License"); you may not use this file except in compliance
   with the License.  You may obtain a copy of the License at

..   http://www.apache.org/licenses/LICENSE-2.0

.. Unless required by applicable law or agreed to in writing,
   software distributed under the License is distributed on an
   "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
   KIND, either express or implied.  See the License for the
   specific language governing permissions and limitations
   under the License.

SQL
===

An example for SQL task, including how to use it and the detail of it parameters.

This task type can execute multiple type of database SQL, which includes

- MySQL
- PostgreSQL
- Oracle
- SQL Server
- DB2
- Hive
- Presto
- Trino
- ClickHouse

Example
-------

.. literalinclude:: ../../../src/pydolphinscheduler/examples/task_sql_example.py
   :start-after: [start workflow_declare]
   :end-before: [end workflow_declare]

You can see that SQL task support three ways to declare SQL, which are

- Bare SQL: Put bare SQL statement in the ``sql`` parameter, such as ``select * from table1``.

   .. literalinclude:: ../../../src/pydolphinscheduler/examples/task_sql_example.py
      :start-after: [start bare_sql_desc]
      :end-before: [end bare_sql_desc]

- SQL Files: .

   .. literalinclude:: ../../../src/pydolphinscheduler/examples/task_sql_example.py
      :start-after: [start sql_file_desc]
      :end-before: [end sql_file_desc]

If you want to do some preparation before executing SQL, or do some clean up after executing SQL, you can use 
``pre_statements`` and ``post_statements`` parameters to do that. Both ``pre_statements`` and ``post_statements``
support one or multiple statements, you can assign type sequence of SQL statements to them if you want to execute
multiple statements. But if you only need to execute one statement, you can assign a string to them.

   .. literalinclude:: ../../../src/pydolphinscheduler/examples/task_sql_example.py
      :start-after: [start sql_with_pre_post_desc]
      :end-before: [end sql_with_pre_post_desc]

.. note::

   Parameter ``pre_statements`` and ``post_statements`` only support not query statements, such as ``create table``,
   ``drop table``, ``update table`` currently. And also it only support bare SQL instead of SQL files now.

Dive Into
---------

.. automodule:: pydolphinscheduler.tasks.sql


YAML file example
-----------------

.. literalinclude:: ../../../examples/yaml_define/Sql.yaml
   :start-after: # under the License.
   :language: yaml

example_sql.sql:

.. literalinclude:: ../../../examples/yaml_define/example_sql.sql
   :start-after: */
   :language: sql
