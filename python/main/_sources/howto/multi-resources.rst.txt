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

Upload and Use Multiple Resources
=================================

Resource center help us manager resources in a centralized way, easy to change and distribute them to all the workers.
for more detail you can see :ref:`resources files <concept:resource files>`.

In this section we will show you how to upload and use multiple resources which is more common in production environment
and in the real word.

Overview
--------

.. literalinclude:: ../../../src/pydolphinscheduler/examples/multi_resources_example.py
   :dedent: 0
   :start-after: [start workflow]
   :end-before: [end workflow]

In this example, we will upload two python files to resource center and use them in one single task, the python
files are named ``dependence.py`` and ``main.py``. And ``main.py`` use ``dependence.py`` as a dependency which
will use a variable ``now`` declared in ``dependence.py``. So in task shell could call :code:`python main.py`
to get all things done.

Upload Resources
----------------

The module ``Resource`` need to be import firstly.

.. code-block:: python

    from pydolphinscheduler.core.resource import Resource

Then we need to create two resources object and assign them to ``resource_list`` of the workflow. All content of
resources should assign to ``content`` attribute of the resource object. Please know that we import variable
:code:`now` from ``dependence.py`` in ``main.py``.

.. literalinclude:: ../../../src/pydolphinscheduler/examples/multi_resources_example.py
   :dedent: 0
   :start-after: [start create_new_resources]
   :end-before: [end create_new_resources]

Use Resources
-------------

Same as :ref:`using single resource <concept:resource files>`, all we need is to assign them to ``resource_list``
attribute of the task and then call the main file to run our task. In this example, we call :code:`python main.py`
which will use ``dependence.py`` as a dependency.

.. literalinclude:: ../../../src/pydolphinscheduler/examples/multi_resources_example.py
   :dedent: 0
   :start-after: [start use_exists_resources]
   :end-before: [end use_exists_resources]

After run the workflow, will execute main.py and print the current datetime. You can see the result like this:

.. code-block:: text

    2022-11-29 16:16:51.952742

