# SubProcess

## Overview

The sub-process node is to execute a certain external workflow definition as a task node.

## Create Task

- Click Project Management-Project Name-Workflow Definition, and click the "Create Workflow" button to enter the DAG editing page.
- Drag <img src="/img/tasks/icons/sub_process.png" width="15"/> from the toolbar to the drawing board.

## Task Parameter

- Node name: The node name in a workflow definition is unique.
- Run flag: Identifies whether this node can be scheduled normally, if it does not need to be executed, you can turn on the prohibition switch.
- Descriptive information: describe the function of the node.
- Task priority: When the number of worker threads is insufficient, they are executed in order from high to low, and when the priority is the same, they are executed according to the first-in first-out principle.
- Worker grouping: Tasks are assigned to the machines of the worker group to execute. If Default is selected, a worker machine will be randomly selected for execution.
- Environment Name: Configure the environment name in which to run the script.
- Timeout alarm: Check the timeout alarm and timeout failure. When the task exceeds the "timeout period", an alarm email will be sent and the task execution will fail.
- Sub-node: It is the workflow definition of the selected sub-process. Enter the sub-node in the upper right corner to jump to the workflow definition of the selected sub-process.
- Predecessor task: Selecting a predecessor task for the current task will set the selected predecessor task as upstream of the current task.

## Task Example

This example simulates a common task type, here we use a child node task to recall the [Shell](shell.md) to print out "hello world". This means that a shell task is executed as a child node.

### Create Shell task

Create a shell task to print "hello". And define the workflow for this as test_dag01.

![subprocess_task01](/img/tasks/demo/subprocess_task01.png)

## Create Sub_process task

To use the sub_process, you need to create the  sub-node task, which is the shell task we created in the first step. Then, as shown in the diagram below, select the corresponding sub-node in the ⑤ position.

![subprocess_task02](/img/tasks/demo/subprocess_task02.png)

After creating the sub_process is complete, create a corresponding shell task for printing "world" and link the two together.Save the current workflow and run it to get the desired result.

![subprocess_task03](/img/tasks/demo/subprocess_task03.png)

## Notice

When using sub_process to recall a sub-node task, you need to ensure that the defined sub-node is online, otherwise the sub_process workflow will not work properly.
