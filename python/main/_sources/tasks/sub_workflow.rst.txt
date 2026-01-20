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

Sub Workflow
============

Task trigger exists workflow run, should make sure workflow exists in current project when you create
sub workflow task.

Example
-------

we have a simple example about how to use sub workflow task, when we want to create a sub workflow task,
we should makeh sure in already exists in current project. So the first thing we do is to create a workflow
will be used as sub workflow task.

.. literalinclude:: ../../../src/pydolphinscheduler/examples/task_sub_workflow_example.py
   :start-after: [start sub_workflow_declare]
   :end-before: [end sub_workflow_declare]

workflow with name ``sub_workflow_upstream`` would be create after we exists ``submit`` method.

Then we create a main workflow, and the sub workflow task will connect to workflow we created before.

.. literalinclude:: ../../../src/pydolphinscheduler/examples/task_sub_workflow_example.py
   :start-after: [start sub_workflow_task_declare]
   :end-before: [end sub_workflow_task_declare]

Finish we can submit or run sub workflow task by ``submit`` or ``run`` method. And you can also use workflow
already exists in current project instead of create a new one.

.. note::

    We could only run the workflow contains sub workflow task, and the sub workflow task will trigger the
    sub workflow run.


.. literalinclude:: ../../../src/pydolphinscheduler/examples/task_sub_workflow_example.py
   :start-after: [start workflow_declare]
   :end-before: [end workflow_declare]

Dive Into
---------

.. automodule:: pydolphinscheduler.tasks.sub_workflow


YAML file example
-----------------

.. literalinclude:: ../../../examples/yaml_define/SubWorkflow.yaml
   :start-after: # under the License.
   :language: yaml



example_sub_workflow.yaml:

.. literalinclude:: ../../../examples/yaml_define/example_sub_workflow.yaml
   :start-after: # under the License.
   :language: yaml

