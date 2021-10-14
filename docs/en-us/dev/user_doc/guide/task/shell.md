# Shell node

> Shell node, when the worker is executed, a temporary shell script is generated, and the Linux user with the same name as the tenant executes the script.

- Click Project Management-Project Name-Workflow Definition, and click the "Create Workflow" button to enter the DAG editing page.
- Drag <img src="/img/shell.png" width="35"/> from the toolbar to the drawing board, as shown in the figure below:

  <p align="center">
      <img src="/img/shell-en.png" width="80%" />
  </p>

- Node name: The node name in a workflow definition is unique.
- Run flag: Identifies whether this node can be scheduled normally, if it does not need to be executed, you can turn on the prohibition switch.
- Descriptive information: describe the function of the node.
- Task priority: When the number of worker threads is insufficient, they are executed in order from high to low, and when the priority is the same, they are executed according to the first-in first-out principle.
- Worker grouping: Tasks are assigned to the machines of the worker group to execute. If Default is selected, a worker machine will be randomly selected for execution.
- Number of failed retry attempts: The number of times the task failed to be resubmitted. It supports drop-down and hand-filling.
- Failed retry interval: The time interval for resubmitting the task after a failed task. It supports drop-down and hand-filling.
- Timeout alarm: Check the timeout alarm and timeout failure. When the task exceeds the "timeout period", an alarm email will be sent and the task execution will fail.
- Script: SHELL program developed by users.
- Resource: Refers to the list of resource files that need to be called in the script, and the files uploaded or created by the resource center-file management.
- User-defined parameters: It is a user-defined parameter that is part of SHELL, which will replace the content with \${variable} in the script.