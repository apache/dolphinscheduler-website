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

PyDolphinScheduler
==================

**PyDolphinScheduler** is Python API for `Apache DolphinScheduler <https://dolphinscheduler.apache.org>`_,
which allow you define your workflow by Python code, aka workflow-as-codes.

History
-------

We seperated PyDolphinScheduler code base from `Apache dolphinscheduler code base <https://github.com/apache/dolphinscheduler>`_
into independent repository at Nov 7, 2022. Now the code base is in `Apache dolphinscheduler-sdk-python <https://github.com/apache/dolphinscheduler-sdk-python>`_
and all issue and pull requests should be submitted to this repository.

The reason why we seperated is for the following reasons:

- **Clear responsibility**: The code base of PyDolphinScheduler is independent of DolphinScheduler, it has its
  own users and developers, CI and test cases, even the language is different.
- **Independent release cycle**: PyDolphinScheduler is a SDK, it should be released independently of DolphinScheduler.
  before we seperated, we have to release PyDolphinScheduler every time when DolphinScheduler released. This brings two
  main problems:

  - DolphinScheduler release cycle is a little long for PyDolphinScheduler, because PyDolphinScheduler is a new subproject
    for DolphinScheduler, it is not stable enough, we have many features and enhancement want to add, so we have to release
    DolphinScheduler more frequently.
  - We have to release PyDolphinScheduler every time when DolphinScheduler, even if there is no change in PyDolphinScheduler.
    In the past, we release both of them at the same time, and some of DolphinScheduler bugfix version like 2.0.5, 2.0.6, 2.0.7
    only fix some bugs in DolphinScheduler, but not in PyDolphinScheduler, is it unnecessary to release PyDolphinScheduler
    but we have to because the rule is we release them both at the same time.
  - Should use the same version as DolphinScheduler do, due to the same release cycle, we have to have the same version
    as DolphinScheduler, so you may see there are some functional adder in DolphinScheduler bugfix version, it may
    be a little strange to PyDolphinScheduler users.

- **Faster CI Run**: PyDolphinScheduler has its own CI, it is not necessary to run DolphinScheduler CI when we only
  change PyDolphinScheduler code. And DolphinScheduler CI is more complete, and some of CI is required to merge pull requests,
  Separating PyDolphinScheduler from DolphinScheduler can make CI run faster in both two repositories.

For more details, please refer to `seperated mail thread discuss <https://lists.apache.org/thread/4z7l5l54c4d81smjlk1n8nq380p9f0oo>`_.

Version
-------

At Nov 7, 2022 we seperated PyDolphinScheduler. And before that, PyDolphinScheduler have the same version with DolphinScheduler.
So the version of PyDolphinScheduler is the same as DolphinScheduler, for example PyDolphinScheduler 2.0.5 is matched with
DolphinScheduler 2.0.5. For more details about why we seperated PyDolphinScheduler, please refer to `History`_.

After being separated from the DolphinScheduler repository, PyDolphinScheduler will be released independently,
and the version of PyDolphinScheduler will not correspond to the version of DolphinScheduler, which means some
of the PyDolphinScheduler versions will correspond to multiple DolphinScheduler versions when there is no
change in the PythonGateway code. While part of the code of PyDolphinScheduler will only correspond to one
version of DolphinScheduler, if the code of the next version of
`PythonGateway <https://github.com/apache/dolphinscheduler/blob/dev/dolphinscheduler-api/src/main/java/org/apache/dolphinscheduler/api/python/PythonGateway.java>`_
has changed.

We will release PyDolphinScheduler version **4.0.0** as the first version after we seperated, so please be ware of when you
use PyDolphinScheduler above version 4.0.0.

+-----------------------------+----------------------------+---------------------+
| DolphinScheduler Version    | PyDolphinScheduler Version | Note                |
+=============================+============================+=====================+
| 2.0.5                       | 2.0.5                      | before we seperated |
+-----------------------------+----------------------------+---------------------+
| above 2.0.6 and prior 3.0.0 | 2.0.6                      | before we seperated |
+-----------------------------+----------------------------+---------------------+
| 3.0.0                       | 3.0.0                      | before we seperated |
+-----------------------------+----------------------------+---------------------+
| above 3.0.1 and prior 3.1.0 | 3.0.1                      | before we seperated |
+-----------------------------+----------------------------+---------------------+
| above 3.1.0 and prior 3.1.2 | 3.1.0                      | before we seperated |
+-----------------------------+----------------------------+---------------------+
| above 3.1.2 and prior 3.1.4 | 4.0.0                      |                     |
+-----------------------------+----------------------------+---------------------+


Content
-------

You could go and find how to :ref:`install <start:getting started>` the project. Or if you want to see simply example
then go and see :doc:`tutorial` for more detail.


.. toctree::
   :maxdepth: 2

   start
   tutorial
   concept
   tasks/index
   howto/index
   cli
   config
   api
   resources_plugin/index
   changelog

Indices and tables
==================

* :ref:`genindex`
* :ref:`modindex`
* :ref:`search`
