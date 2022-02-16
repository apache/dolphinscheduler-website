# Spark

## Overview

Spark task type for executing Spark programs. For Spark nodes, the worker submits the task by using the spark command `spark submit`. See [spark-submit](https://spark.apache.org/docs/3.2.1/submitting-applications.html#launching-applications-with-spark-submit) for more details.

## Create task

- Click Project Management -> Project Name -> Workflow Definition, and click the "Create Workflow" button to enter the DAG editing page.
- Drag the <img src="/img/tasks/icons/spark.png" width="15"/> from the toolbar to the drawing board.

## Task Parameter

- **Node name**: The node name in a workflow definition is unique.
- **Run flag**: Identifies whether this node can be scheduled normally, if it does not need to be executed, you can turn on the prohibition switch.
- **Descriptive information**: describe the function of the node.
- **Task priority**: When the number of worker threads is insufficient, they are executed in order from high to low, and when the priority is the same, they are executed according to the first-in first-out principle.
- **Worker grouping**: Tasks are assigned to the machines of the worker group to execute. If Default is selected, a worker machine will be randomly selected for execution.
- **Environment Name**: Configure the environment name in which to run the script.
- **Number of failed retry attempts**: The number of times the task failed to be resubmitted.
- **Failed retry interval**: The time, in cents, interval for resubmitting the task after a failed task.
- **Delayed execution time**: the time, in cents, that a task is delayed in execution.
- **Timeout alarm**: Check the timeout alarm and timeout failure. When the task exceeds the "timeout period", an alarm email will be sent and the task execution will fail.
- **Program type**: supports Java, Scala and Python.
- **Spark version**: support Spark1 and Spark2.
- **The class of main function**: is the full path of Main Class, the entry point of the Spark program.
- **Main jar package**: is the Spark jar package.
- **Deployment mode**: support three modes of yarn-cluster, yarn-client and local. 
- **Task name** (option): Spark task name.
- **Driver core number**: This is used to set the number of Driver core, which can be set according to the actual production environment.
- **Driver memory number**: This is used to set the number of Driver memories, which can be set according to the actual production environment.
- **Number of Executor**: This is used to set the number of Executor, which can be set according to the actual production environment.
- **Executor memory number**: This is used to set the number of Executor memories, which can be set according to the actual production environment.
- **Main program parameters**: set the input parameters of the Spark program and support the substitution of custom parameter variables.
- **Other parameters**: support `--jars`, `--files`,` --archives`, `--conf` format.
- **Resource**: Refers to the list of resource files that need to be called in the script, and the files uploaded or created by the resource center-file management.
- **Custom parameter**: It is a local user-defined parameter of Spark, which will replace the content with ${variable} in the script.
- **Predecessor task**: Selecting a predecessor task for the current task will set the selected predecessor task as upstream of the current task.

## Task Example

### Execute the WordCount program

This is a common introductory case in the Big Data ecosystem, which often applied to computational frameworks such as MapReduce, Flink and Spark. The main purpose is to count the number of identical words in the input text.

#### Uploading the main package

When using the Spark task node, you will need to use the Resource Center to upload the jar package for the executable. Refer to the [resource center](../resource.md).

After configuring the Resource Center, you can upload the required target files directly using drag and drop.

![resource_upload](/img/tasks/demo/upload_spark.png)

#### Configuring Spark nodes

Simply configure the required content according to the parameter descriptions above.

![demo-spark-simple](/img/tasks/demo/spark_task.png)

## Notice

 JAVA and Scala are only used for identification, there is no difference, if it is Spark developed by Python, there is no class of the main function, the others are the same.
