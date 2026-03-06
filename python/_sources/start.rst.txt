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

Getting Started
===============

To get started with *PyDolphinScheduler* you must ensure python and pip are
installed on your machine, if you're already set up, you can skip straight
to `Installing PyDolphinScheduler`_, otherwise please continue with
`Installing Python`_.

Installing Python
-----------------

How to install `python` and `pip` depends on what operating system
you're using. The python wiki provides up to date
`instructions for all platforms here`_. When you enter the website
and choose your operating system, you would be offered the choice and
select python version. *PyDolphinScheduler* recommends using a version above
Python 3.9 and we highly recommend installing *Stable Releases* instead
of *Pre-releases*.

After you have download and installed Python, you should open your terminal,
type and run :code:`python --version` to check whether the installation
is correct or not. If everything is good, you could see the version in console
without error(here is an example after Python 3.9 is installed)

.. code-block:: bash

   python --version

Will see detail of Python version, such as *Python 3.9*

Installing PyDolphinScheduler
-----------------------------

After Python is already installed on your machine following section
`installing Python`_, it is easy to install *PyDolphinScheduler* using pip.

.. code-block:: bash

   python -m pip install apache-dolphinscheduler

The latest version of *PyDolphinScheduler* would be installed after you run the above
command in your terminal. You could go and `start Python Gateway Service`_ to finish
the preparation, and then go to :doc:`tutorial` to get your hand dirty. But if you
want to install the unreleased version of *PyDolphinScheduler*, you could go and see
section `installing PyDolphinScheduler in dev branch`_ for more details.

.. note::

   Currently, we have released multiple pre-release packages in PyPI, you can see all released packages
   including pre-release in `release history <https://pypi.org/project/apache-dolphinscheduler/#history>`_.
   You can fix the the package version if you want to install pre-release package, for example if
   you want to install version `3.0.0-beta-2` package, you can run command
   :code:`python -m pip install apache-dolphinscheduler==3.0.0b2`.

Installing PyDolphinScheduler In DEV Branch
-------------------------------------------

Because the project is developing and some of the features are still not released.
If you want to try something unreleased you could install from the source code
which we hold on GitHub

.. code-block:: bash

   # Clone Apache DolphinScheduler repository
   git clone git@github.com:apache/dolphinscheduler-sdk-python.git
   # Install PyDolphinScheduler in develop mode
   python -m pip install -e .

After you installed *PyDolphinScheduler*, please remember `start Python Gateway Service`_
which is required for *PyDolphinScheduler*'s workflow definition.

Above command will clone whole dolphinscheduler source code to local, maybe you want to install the latest pydolphinscheduler
package directly and do not care about other code(including Python gateway service code), you can execute the command

.. code-block:: bash

   # Must escape the '&' character by adding '\' 
   pip install -e "git+https://github.com/apache/dolphinscheduler-sdk-python.git#egg=apache-dolphinscheduler"

Start Python Gateway Service
----------------------------

Since **PyDolphinScheduler** is Python API for `Apache DolphinScheduler`_, it
could define workflow and task structures, but could not run it unless you
`install Apache DolphinScheduler`_ and start its API server which includes
Python gateway service in it. We only write some key steps here and you could
go `install Apache DolphinScheduler`_ for more details

.. code-block:: bash

   # Export the environment variable to enabled python-gateway service
   export API_PYTHON_GATEWAY_ENABLED="true"
   # Start DolphinScheduler api-server which including python gateway service
   ./bin/dolphinscheduler-daemon.sh start api-server

To check whether the server is alive or not, you could run :code:`jps`. And
the server is healthy if keyword `ApiApplicationServer` is in the console.

.. code-block:: bash

   jps
   # ....
   # 201472 ApiApplicationServer
   # ....

.. note::

   Please make sure you already started Python gateway service along with `api-server`. You can enabled it via

   * Environment: `export API_PYTHON_GATEWAY_ENABLED="true"`
   * Configuration File: Set `python-gateway.enabled : true` in `api-server/conf/application.yaml`

   Please modify the token in your production environment and update it periodically, as this is related to your data read and write rights.

   * Environment: `export API_PYTHON_GATEWAY_AUTH_TOKEN="GsAurNxU7A@Xc"`
   * Configuration File: Set `python-gateway.auth-token : GsAurNxU7A@Xc` in `api-server/conf/application.yaml`

Run an Example
--------------

Before run an example for pydolphinscheduler, you should get the example code from its source code. You could run
single bash command to get it

.. code-block:: bash

   wget https://raw.githubusercontent.com/apache/dolphinscheduler-sdk-python/main/src/pydolphinscheduler/examples/tutorial.py

or you could copy-paste the content from `tutorial source code`_. And then you could run the example in your
terminal

.. code-block:: bash

   python tutorial.py

If you want to submit your workflow to a remote API server, which means that your workflow script is different
from the API server, you should first change pydolphinscheduler configuration and then submit the workflow script

.. code-block:: bash

   pydolphinscheduler config --init
   pydolphinscheduler config --set java_gateway.address <YOUR-API-SERVER-IP-OR-HOSTNAME>
   python tutorial.py

.. note::

   You could see more information in :doc:`config` about all the configurations pydolphinscheduler supported.

After that, you could go and see your DolphinScheduler web UI to find out a new workflow created by pydolphinscheduler,
and the path of web UI is `Project -> Workflow -> Workflow Definition`, and you can see a workflow and workflow instance
had been created and DAG is automatically formatted by web UI.

.. note::

   We have default authentication token when you first launch dolphinscheduler and pydolphinscheduler. Please change
   the parameter ``auth_token`` when you deploy in production environment or test dolphinscheduler in public network.
   See :ref:`authentication token <concept:authentication token>` for more details.


What's More
-----------

If you are not familiar with *PyDolphinScheduler*, you could go to :doc:`tutorial` and see how it works. But
if you already know the basic usage or concept of *PyDolphinScheduler*, you could go and play with all
:doc:`tasks/index` *PyDolphinScheduler* supports, or see our :doc:`howto/index` about useful cases.

.. _`instructions for all platforms here`: https://wiki.python.org/moin/BeginnersGuide/Download
.. _`Apache DolphinScheduler`: https://dolphinscheduler.apache.org
.. _`install Apache DolphinScheduler`: https://dolphinscheduler.apache.org/en-us/docs/latest/user_doc/guide/installation/standalone.html
.. _`tutorial source code`: https://raw.githubusercontent.com/apache/dolphinscheduler-sdk-python/main/src/pydolphinscheduler/examples/tutorial.py
