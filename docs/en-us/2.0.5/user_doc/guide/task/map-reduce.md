# MapReduce

## Overview

- MapReduce(MR) task type for executing MapReduce programs. For MapReduce nodes, the worker submits the task by using the Hadoop command `hadoop jar`. See [Hadoop Command Manual](https://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-common/CommandsManual.html#jar) for more details.

## Create Task

- Click Project Management-Project Name-Workflow Definition, and click the "Create Workflow" button to enter the DAG editing page.
- Drag the <img src="/img/tasks/icons/mr.png" width="15"/> from the toolbar to the drawing board.
## Task Parameter

-    **Node name**: The node name in a workflow definition is unique.
-    **Run flag**: Identifies whether this node can be scheduled normally, if it does not need to be executed, you can turn on the prohibition switch.
-    **Descriptive information**: describe the function of the node.
-    **Task priority**: When the number of worker threads is insufficient, they are executed in order from high to low, and when the priority is the same, they are executed according to the first-in first-out principle.
-    **Worker grouping**: Tasks are assigned to the machines of the worker group to execute. If Default is selected, a worker machine will be randomly selected for execution.
-    **Environment Name**: Configure the environment name in which to run the script.
-    **Number of failed retry attempts**: The number of times the task failed to be resubmitted.
-    **Failed retry interval**: The time, in cents, interval for resubmitting the task after a failed task.
-    **Delayed execution time**: the time, in cents, that a task is delayed in execution.
-    **Timeout alarm**: Check the timeout alarm and timeout failure. When the task exceeds the "timeout period", an alarm email will be sent and the task execution will fail.
-    **Resource**: Refers to the list of resource files that need to be called in the script, and the files uploaded or created by the resource center-file management.
-    **Custom parameters**: It is a user-defined parameter that is part of MapReduce, which will replace the content with ${variable} in the script.
-    **Predecessor task**: Selecting a predecessor task for the current task will set the selected predecessor task as upstream of the current task.

### JAVA /SCALA Program

- **Program type**: select JAVA/SCALA program.
- **The class of the main function**: is the full path of the Main Class, the entry point of the MapReduce program.
- **Main jar package**: is the MapReduce jar package.
- **Task name** (optional): MapReduce task name.
- **Command line parameters**: set the input parameters of the MapReduce program and support the substitution of custom parameter variables.
- **Other parameters**: support -D, -files, -libjars, -archives format.
- **Resource**: If the resource file is referenced in other parameters, you need to select and specify in the resource
- **User-defined parameter**: It is a user-defined parameter of the MapReduce part, which will replace the content with \${variable} in the script

## Python program

- **Program type**: select Python language
- **Main jar package**: is the Python jar package for running MR
- **Other parameters**: support -D, -mapper, -reducer, -input -output format, here you can set the input of user-defined parameters, such as:
- -mapper "mapper.py 1" -file mapper.py -reducer reducer.py -file reducer.py –input /journey/words.txt -output /journey/out/mr/\${currentTimeMillis}
- The mapper.py 1 after -mapper is two parameters, the first parameter is mapper.py, and the second parameter is 1
- **Resource**: If the resource file is referenced in other parameters, you need to select and specify in the resource
- **User-defined parameter**: It is a user-defined parameter of the MapReduce part, which will replace the content with \${variable} in the script

## Task Example

### Execute the WordCount program

This example is a common introductory type of MapReduce application, which is designed to count the number of identical words in the input text.

#### Uploading the main package

When using the MapReduce task node, you will need to use the Resource Centre to upload the jar package for the executable. Refer to the [resource centre](../resource.md).

After configuring the Resource Centre, you can upload the required target files directly using drag and drop.

![resource_upload](/img/tasks/demo/resource_upload.png)

#### Configuring MapReduce nodes

Simply configure the required content according to the parameter descriptions above.

![demo-mr-simple](/img/tasks/demo/mr.png)
