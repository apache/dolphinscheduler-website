# Shell

## Overview

Shell task, used to create a shell-type task and execute a series of shell scripts. When the worker executed,
a temporary shell script is generated, and the Linux user with the same name as the tenant executes the script.

## Create Task

- Click Project Management-Project Name-Workflow Definition, and click the "Create Workflow" button to enter the DAG editing page.
- Drag <img src="/img/tasks/icons/shell.png" width="15"/> from the toolbar to the drawing board.

## Task Parameter

- Node name: The node name in a workflow definition is unique.
- Run flag: Identifies whether this node can be scheduled normally, if it does not need to be executed, you can turn on the prohibition switch.
- Descriptive information: describe the function of the node.
- Task priority: When the number of worker threads is insufficient, they are executed in order from high to low, and when the priority is the same, they are executed according to the first-in first-out principle.
- Worker grouping: Tasks are assigned to the machines of the worker group to execute. If Default is selected, a worker machine will be randomly selected for execution.
- Environment Name: Configure the environment name in which to run the script.
- Number of failed retry attempts: The number of times the task failed to be resubmitted. It supports drop-down and hand-filling.
- Failed retry interval: The time interval for resubmitting the task after a failed task. It supports drop-down and hand-filling.
- Timeout alarm: Check the timeout alarm and timeout failure. When the task exceeds the "timeout period", an alarm email will be sent and the task execution will fail.
- Script: SHELL program developed by users.
- Resource: Refers to the list of resource files that need to be called in the script, and the files uploaded or created by the resource center-file management.
- Custom parameters: It is a user-defined parameter that is part of SHELL, which will replace the content with \${variable} in the script.

## Task Example

### Simply Print

This example is a sample echo task which only print one line in the log file, including the content
"This is a demo of shell task". If your task only run one or two shell command, you could add task base on this example.

![demo-shell-simple](/img/tasks/demo/shell.jpg)

### Custom Parameters

This example is a sample custom parameter task which could reuse existing as template, or for dynamic task. First of all,
we should declare a custom parameter named "param_key", with the value as "param_val". Then we using keyword "${param_key}"
to using the parameter we just declared. After this example is being run, we would see "param_val" print in the log

![demo-shell-custom-param](/img/tasks/demo/shell_custom_param.jpg)

## Notice

None