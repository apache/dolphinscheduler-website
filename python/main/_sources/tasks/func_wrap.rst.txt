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

Python Function Decorate
========================

A decorator covert Python function into pydolphinscheduler's task. Python function decorator use decorate
:code:`@task` from :code:`from pydolphinscheduler.tasks.func_wrap import task` to convert Python function into
a single Python task of dolphinscheduler.

Because we have to covert the whole Python definition into multiple Python task in dolphinscheduler, and all of
the seperated Python task will be executed in the different Python process, so we need to separate not only the
python function code, but also the all variables and the imported modules related to decorated function.

For example, we decorated function ``depend_import`` in definition

.. code-block:: python

   import time
   
   @task
   def depend_import():
       time.sleep(2)

and we can see functon ``depend_import`` depend on other modules, it use :code:`time.sleep(2)` from module :code:`time`
to sleep 2 seconds. So when we want to separate this function into dolphinscheduler task, need to include the imported
:code:`time` module.

which means we not only post code

.. code-block:: python

   def depend_import():
       time.sleep(2)

   depend_import()

to dolphinscheduler Python task, we post the dependencies of this function as well, so you will see this in
dolphinscheduler Python task to make it work. And if you use the global variables or other function in the
decorated function, it will also including them as well.

.. code-block:: python

   import time

   def depend_import():
       time.sleep(2)

   depend_import()


.. note::

   We use third party library `stmdency <https://pypi.org/project/stmdency>`_ to get the dependencies statement
   of current function, so if you find some unexpected behavior you can report bug to `apache-dolphinscheduler`
   or `stmdency`.

Example
-------

.. literalinclude:: ../../../src/pydolphinscheduler/examples/tutorial_decorator.py
   :start-after: [start tutorial]
   :end-before: [end tutorial]

Dive Into
---------

.. automodule:: pydolphinscheduler.tasks.func_wrap
