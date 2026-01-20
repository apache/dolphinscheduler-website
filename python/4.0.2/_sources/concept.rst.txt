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

Concepts
========

In this section, you would know the core concepts of *PyDolphinScheduler*.

Workflow
--------

Workflow describe the whole things except `tasks`_ and `tasks dependence`_, which including
name, schedule interval, schedule start time and end time. You would know scheduler 

Workflow could be initialized in normal assign statement or in context manger.

.. code-block:: python

   # Initialization with assign statement
   workflow = Workflow(name="my first workflow")

   # Or context manger 
   with Workflow(name="my first workflow") as workflow:
       workflow.submit()

Workflow is the main object communicate between *PyDolphinScheduler* and DolphinScheduler daemon.
After workflow and task is be declared, you could use `submit` and `run` notify server your definition.

If you just want to submit your definition and create workflow, without run it, you should use attribute `submit`.
But if you want to run the workflow after you submit it, you could use attribute `run`.

.. code-block:: python

   # Just submit definition, without run it
   workflow.submit()
   
   # Both submit and run definition
   workflow.run()

Schedule
~~~~~~~~

We use parameter `schedule` determine the schedule interval of workflow, *PyDolphinScheduler* support seven
asterisks expression, and each of the meaning of position as below

.. code-block:: text

    * * * * * * *
    ┬ ┬ ┬ ┬ ┬ ┬ ┬
    │ │ │ │ │ │ │
    │ │ │ │ │ │ └─── year
    │ │ │ │ │ └───── day of week (0 - 7) (0 to 6 are Sunday to Saturday, or use names; 7 is Sunday, the same as 0)
    │ │ │ │ └─────── month (1 - 12)
    │ │ │ └───────── day of month (1 - 31)
    │ │ └─────────── hour (0 - 23)
    │ └───────────── min (0 - 59)
    └─────────────── second (0 - 59)

Here we add some example crontab:

- `0 0 0 * * ? *`: Workflow execute every day at 00:00:00.
- `10 2 * * * ? *`: Workflow execute hourly day at ten pass two.
- `10,11 20 0 1,2 * ? *`: Workflow execute first and second day of month at 00:20:10 and 00:20:11.

Tenant
~~~~~~

Tenant is the user who run task command in machine or in virtual machine. it could be assign by simple string.

.. code-block:: python

   # 
   workflow = Workflow(name="workflow tenant", tenant="tenant_exists")

.. note::

   Make should tenant exists in target machine, otherwise it will raise an error when you try to run command

Execution Type
~~~~~~~~~~~~~~

Decision which behavior to run when workflow have multiple instances. when workflow
schedule interval is too short, it may cause multiple instances run at the same time. We can use this
parameter to control the behavior about how to run those workflow instances. Currently we
have four execution type:

* ``parallel`` (default value): it means all instances will allow to run even though the previous
  instance is not finished.
* ``serial_wait``: it means the all instance will wait for the previous instance to finish, and
  all the waiting instances will be executed base on scheduling order.
* ``serial_discard``: it means the all instance will be discard(abandon) if the previous instance
  is not finished.
* ``serial_priority``: it means the all instance will wait for the previous instance to finish,
  and all the waiting instances will be executed base on workflow priority order.

Parameter ``execution type`` can be set in

* Direct assign statement. You can pick execute type from above and direct assign to parameter
  ``execution_type``.

  .. code-block:: python

     workflow = Workflow(
         name="workflow_name",
         execution_type="parallel"
     )

* Via environment variables, configurations file setting, for more detail about those way setting, you can see
  you can read :doc:`config` section.

Tasks
-----

Task is the minimum unit running actual job, and it is nodes of DAG, aka directed acyclic graph. You could define
what you want to in the task. It have some required parameter to make uniqueness and definition.

Here we use :py:meth:`pydolphinscheduler.tasks.Shell` as example, parameter `name` and `command` is required and must be provider. Parameter
`name` set name to the task, and parameter `command` declare the command you wish to run in this task.

.. code-block:: python

   # We named this task as "shell", and just run command `echo shell task`
   shell_task = Shell(name="shell", command="echo shell task")

If you want to see all type of tasks, you could see :doc:`tasks/index`.

Tasks Dependence
~~~~~~~~~~~~~~~~

You could define many tasks in on single `Workflow`_. If all those task is in parallel processing,
then you could leave them alone without adding any additional information. But if there have some tasks should
not be run unless pre task in workflow have be done, we should set task dependence to them. Set tasks dependence
have two mainly way and both of them is easy. You could use bitwise operator `>>` and `<<`, or task attribute 
`set_downstream` and `set_upstream` to do it.

.. code-block:: python

   # Set task1 as task2 upstream
   task1 >> task2
   # You could use attribute `set_downstream` too, is same as `task1 >> task2`
   task1.set_downstream(task2)
   
   # Set task1 as task2 downstream
   task1 << task2
   # It is same as attribute `set_upstream`
   task1.set_upstream(task2)
   
   # Beside, we could set dependence between task and sequence of tasks,
   # we set `task1` is upstream to both `task2` and `task3`. It is useful
   # for some tasks have same dependence.
   task1 >> [task2, task3]

Task With Workflow
~~~~~~~~~~~~~~~~~~

In most of data orchestration cases, you should assigned attribute `workflow` to task instance to
decide workflow of task. You could set `workflow` in both normal assign or in context manger mode

.. code-block:: python

   # Normal assign, have to explicit declaration and pass `Workflow` instance to task
   workflow = Workflow(name="my first workflow")
   shell_task = Shell(name="shell", command="echo shell task", workflow=workflow)

   # Context manger, `Workflow` instance workflow would implicit declaration to task
   with Workflow(name="my first workflow") as workflow:
       shell_task = Shell(name="shell", command="echo shell task",

With both `Workflow`_, `Tasks`_  and `Tasks Dependence`_, we could build a workflow with multiple tasks.

Resource Files
--------------

During workflow running, we may need some resource files to help us run task usually. One of a common situation
is that we already have some executable files locally, and we need to schedule in specific time, or add them
to existing workflow by adding the new tasks. Of cause, we can upload those files to target machine and run them
in :doc:`shell task <tasks/shell>` by reference the absolute path of file. But if we have more than one machine
to run task, we have to upload those files to each of them. And it is not convenient and not flexible, because
we may need to change our resource files sometimes.

The more pydolphinscheduler way is to upload those files together with `workflow`_, and use them in task to run.
For example, you have a bash script named ``echo-ten.sh`` locally, and it contains some code like this:

.. code-block:: bash

   #!/bin/env bash
   max=10
   for ((i=1; i <= $max; ++i)); do
       echo "$i"
   done

and you want to use it in workflow but do not want to copy-paste it to shell task parameter ``command``. You could
use this mechanism to upload it to resource center when you create workflow

.. code-block:: python

   # Read file content
   file_name = "echo-ten.sh"
   
   with open(file_name, "r") as f:
         content = f.read()

   with Workflow(
      name="upload_and_run",
      resource_list=[
         Resource(name=file_name, content=content),
      ],
   ) as workflow:

And when we call :code:`workflow.run()` the new file named ``echo-ten.sh`` would be uploaded to dolphinscheduler
resource center.

After that we can use this file in our task by reference it by name, in this case we could use :doc:`shell task <tasks/shell>`
to run it.

.. code-block:: python

   # We use `shell` task to run `echo-ten.sh` file
   shell_task = Shell(
      name="run",
      command=f"bash {file_name}",
      resource_list=[
         file_name
      ],
   )

During workflow running, the file would be downloaded to the task runtime working directory which mean you could
execute them. We execute file by ``bash`` but reference it by name directly.

Please notice that we could also reference the resource file already in dolphinscheduler resource center, which
mean we could use resource center files in task by name without upload it again. And we can upload files to
resource center bare without workflow. 

.. code-block:: python

   # Upload file to resource center
   from pydolphinscheduler.core.resource import Resource

   resource = Resource(name="bare-create.py", user_name="<USER-MUST-EXISTS-WITH-TENANT>", content="print('Bareh create resource')")
   resource.create_or_update_resource()

After that, we could see new file named ``bare-create.py`` is be created in resource center.

.. note::

   Both parameter ``resource_list`` in workflow and task is list of string which mean you could upload and reference
   multiple files. For more complex usage, you could read :doc:`howto/multi-resources`.

Local Parameters
----------------

In DolphinScheduler, we can define parameter in task, aka Local Parameter.

We can set parameters to variables in tasks to better manage our tasks.

For example:


.. literalinclude:: ../../src/pydolphinscheduler/examples/local_parameter_example.py
   :start-after: [start parameter example]
   :end-before: [end parameter example]
   :language: python


There are two ways to define local parameters:

.. literalinclude:: ../../src/pydolphinscheduler/examples/local_parameter_example.py
   :start-after: [start parameter define]
   :end-before: [end parameter define]
   :language: python


Full example:

.. literalinclude:: ../../src/pydolphinscheduler/examples/local_parameter_example.py
   :start-after: [start workflow_declare]
   :end-before: [end workflow_declare]
   :language: python


Authentication Token
--------------------

pydolphinscheduler use token as authentication when communication with dolphinscheduler server, and we have a default auth
token to make it out-of-box. For security reason, we highly recommend you to change your own auth token when you
deploy in production environment or test dolphinscheduler in public network. The auth token keyword in ``auth_token``
and it can be set in multiple ways which you can read :doc:`config` section for more detail.
