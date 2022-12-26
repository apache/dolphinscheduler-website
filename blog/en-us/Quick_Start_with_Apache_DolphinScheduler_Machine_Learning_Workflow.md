---
title:Quick Start with Apache DolphinScheduler Machine Learning Workflow
keywords: Apache,DolphinScheduler,scheduler,big data,ETL,airflow,hadoop,orchestration,dataops,Kubernetes,Conda
description: With the release of Apache DolphinScheduler 3.1.0, many AI components
---
# Quick Start with Apache DolphinScheduler Machine Learning Workflow
![](/img/media/16720405454837/16720405586499.jpg)
## Abstract
With the release of Apache DolphinScheduler 3.1.0, many AI components have been added to help users to build machine learning workflows on Apache DolphinScheduler more efficiently.

This article describes in detail how to set up DolphinScheduler with some Machine Learning environments. It also introduces the use of the MLflow component and the DVC component with experimental examples.

## DolphinScheduler and Machine Learning Environment
Test Program
All code can be found at https://github.com/jieguangzhou/dolphinscheduler-ml-tutorial

Get the code

```git clone <https://github.com/jieguangzhou/dolphinscheduler-ml-tutorial.git>
git checkout dev
```
### Installation environment
**Conda**
Simply install it following the official website and add the path to Conda to the environment variables

After installation mlflow and dvc commands will be installed in conda’s bin directory.
```
pip install mlflow==1.30.0 dvc
```

**Java8 environment**

```sudo apt-get update
sudo apt-get install openjdk-8-jdk
java -version
```
Configure the Java environment variable, ~/.bashrc or ~/.zshrc

```# Confirm that your jdk is as below and configure the environment variables
export JAVA_HOME=/usr/lib/jvm/java-1.8.0-openjdk-amd64
export PATH=$PATH:$JAVA_HOME/bin
```

**Apache DolphinScheduler 3.1.0**

Download DolphinScheduler 3.1.0
```
# Go to the following directory (you can install in other directories, for the convenience of replication, in this case, the installation is performed in the following directory)
cd first-example/install_dolphinscheduler
## install DolphinScheduler
wget <https://dlcdn.apache.org/dolphinscheduler/3.1.0/apache-dolphinscheduler-3.1.0-bin.tar.gz>
tar -zxvf apache-dolphinscheduler-3.1.0-bin.tar.gz
rm apache-dolphinscheduler-3.1.0-bin.tar.gz
```

Configuring the Conda environment and Python environment in DolphinScheduler
```
## Configure conda environment and default python environment
cp common.properties apache-dolphinscheduler-3.1.0-bin/standalone-server/conf
echo "export PATH=$(which conda)/bin:\\$PATH" >> apache-dolphinscheduler-3.1.0-bin/bin/env/dolphinscheduler_env.sh
echo "export PYTHON_HOME=$(dirname $(which conda))/python" >> apache-dolphinscheduler-3.1.0-bin/bin/env/dolphinscheduler_env.sh
```

* dolphinscheduler-mlflow configuration
When using the MLFLOW component, the dolphinscheduler-mlflow project on GitHub will be used as a reference, so if you can’t get a proper network connection, you can replace the repository source by following these steps

Firstly execute git clone <https://github.com/apache/dolphinscheduler-mlflow.git>

Then change the value of the ml.mlflow.preset_repository field in common.properties to the default path for the download

Start DolphinScheduler
```
## start DolphinScheduler
cd apache-dolphinscheduler-3.1.0-bin
bash bin/dolphinscheduler-daemon.sh start standalone-server
## You can view the log using the following command
# tail -500f standalone-server/logs/dolphinscheduler-standalone.log
```

Once started, wait a moment for the service to boot up and you will be taken to the DolphinScheduler page

Open http://localhost:12345/dolphinscheduler/ui and you will see the DolphinScheduler page

Account: admin, Password: dolphinscheduler123
![](/img/media/16720405454837/16720407528096.jpg)
**MLflow**
The MLflow Tracking Server is relatively simple to start up, and can simply be started by using the command docker run — name mlflow -p 5000:5000 -d jalonzjg/mlflow:latest

Open http://localhost:5000, and you will be able to find the MLflow model and test management page

![](/img/media/16720405454837/16720407653742.jpg)
The Dockerfile for this mirror image can be found at first-example/docker-mlflow/Dockerfile

**Components Introduction**
There are 5 main types of components used in this article

**SHELL component**
The SHELL component is used to run shell-type tasks

**PYTHON component**
The PYTHON component is used to run python-type tasks

**CONDITIONS component**
CONDITIONS is a conditional node that determines which downstream task should be run based on the running status of the upstream task.

**MLFLOW component**
MLFLOW component is used to run the MLflow Project on DolphinScheduler based on the dolphinscheduler-mlflow library to implement pre-built algorithms and AutoML functionality for classification scenarios and to deploy models on the MLflow tracking server

**DVC component**
DVC component is used for data versioning in machine learning on DolphinScheduler, such as registering specific data as a specific version and downloading specific versions of data.

Among the above five components

* SHELL component and PYTHON component are the base components, which can run a wide range of tasks.
* CONDITIONS are logical components that can dynamically control the logic of the workflow’s operation.
* The MLFLOW component and DVC component are machine learning type components that can be used to facilitate the ease of use of machine learning scenario feature capabilities within the workflow.
Machine learning workflow
The workflow consists of three parts.

* The first part is the preliminary preparation, such as data download, data versioning management repository, etc.; it is a one-time preparation.
* The second part is the training model workflow: it includes data pre-processing, training model, and model evaluation
* The third part is the deployment workflow, which includes model deployment and interface testing.

Preliminary preparation workflow
Create a directory to store all the process data mkdir /tmp/ds-ml-example

At the beginning of the program, we need to download the test data and initialize the DVC repository for data versioning

All the following commands are run in the dolphinscheduler-ml-tutorial/first-example directory

Since we are submitting the workflow via pydolphinscheduler, let’s install pip install apache-dolphinscheduler==3.1.0

Workflow(download-data): Downloading test data

Command: pydolphinscheduler yaml -f pyds/download_data.yaml

Execute the following two tasks in order

1. Install-dependencies: install the python dependencies packages needed in the download script

2. Download-data: download the dataset to /tmp/ds-ml-example/raw

![](/img/media/16720405454837/16720408372893.jpg)
Workflow(dvc_init_local): Initialize the dvc data versioning management repository

Command: pydolphinscheduler yaml -f pyds/init_dvc_repo.yaml

Execute the following tasks in order

1. create_git_repo: Create an empty git repository in the local environment

2. init_dvc: convert the repository to a dvc-type repository for data versioning

3. condition: determine the status of the init_dvc task, if successful then execute report_success_message, otherwise execute report_error_message

![](/img/media/16720405454837/16720408471707.jpg)
Training model workflow
In the training model part, the workflow includes data pre-processing, model training, and model evaluation.

Workflow(download-data): data preprocessing

Command: pydolphinscheduler yaml -f pyds/prepare_data.yaml

![](/img/media/16720405454837/16720408537181.jpg)
Perform the following tasks in order

1. data_preprocessing: preprocesses the data, for demo purposes, we’ve only perform a simple truncation procedure here

2. upload_data: uploads data to the repository and registers it as a specific version v1

The following image shows the information in the git repository

![](/img/media/16720405454837/16720408664980.jpg)
Workflow(train_model): Training model

Command: pydolphinscheduler yaml -f pyds/train_model.yaml

Perform the following tasks in order

1. clean_exists_data: Delete the historical data generated by potentially repeated tests /tmp/ds-ml-example/train_data

2. pull_data: pull v1 data to /tmp/ds-ml-example/train_data

3. train_automl: Uses the MLFLOW component’s AutoML function to train the classification model and register it with the MLflow Tracking Server, if the current model version F1 is the highest, then register it as the Production version.

4. inference: import a small part of the data for batch inference using the mlflow CLI

5. evaluate: Obtain the results of the inference and perform a simple evaluation of the model again, which includes the metrics of the new data, the projected label distribution, etc.
![](/img/media/16720405454837/16720408742949.jpg)


The results of the test and the model can be viewed in the MLflow Tracking Server ( http://localhost:5000 ) after train_automl has completed its operation.

![](/img/media/16720405454837/16720408868765.jpg)
The operation logs for the evaluation task can be viewed after it has completed its operation.

![](/img/media/16720405454837/16720408963992.jpg)
Deployment Process Workflow
Workflow(deploy_model): Deployment model

Run: pydolphinscheduler yaml -f pyds/deploy.yaml

Run the following tasks in order.

1. kill-server: Shut down the previous server

2. deploy-model: Deploy the model

3. test-server: Test the server

![](/img/media/16720405454837/16720409057879.jpg)
If this workflow is started manually, the interface will look as follows, just enter the port number and the model version number.

![](/img/media/16720405454837/16720409115839.jpg)
Integrate the workflows
For practical use, after obtaining stable workflow iterations, the whole process needs to be linked together, for example after getting a new version, then train the model, and if it performs better, then deploy the model.

For example, we switch to the production version git checkout first-example-production

The differences between the two versions are:

1. there is an additional workflow definition in train_and_deploy.yaml, which is used to combine the various workflows

2. modify the pre-processing script to get the v2 data

3. change the flag in the definition of each sub-workflow to false and let train_and_deploy.yaml run in unison.

Run: pydolphinscheduler yaml -f pyds/train_and_deploy.yaml

Each task in the diagram below is a sub-workflow task, which corresponds to the three workflows described above.

![](/img/media/16720405454837/16720409204499.jpg)
As below, the new version of the model, version2, is obtained after the operation and has been registered as the Production version

![](/img/media/16720405454837/16720409274430.jpg)

