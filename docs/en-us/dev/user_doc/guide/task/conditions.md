# Conditions

Conditions is a condition node, determining which downstream task should be run based on the condition set to it. For now, the Conditions support multiple upstream tasks, but only two downstream tasks. When the number of upstream tasks exceeds one, complex upstream dependencies can be achieved through `and` and `or` operators.

## Create

Drag in the toolbar<img src="/img/conditions.png" width="20"/>The task node to the drawing board to create a new Conditions task

## Parameter

- Node name: The node name in a workflow definition is unique.
- Run flag: Identifies whether this node can be scheduled normally, if it does not need to be executed, you can turn on the prohibition switch.
- Descriptive information: describe the function of the node.
- Task priority: When the number of worker threads is insufficient, they are executed in order from high to low, and when the priority is the same, they are executed according to the first-in first-out principle.
- Worker grouping: Tasks are assigned to the machines of the worker group to execute. If Default is selected, a worker machine will be randomly selected for execution.
- Number of failed retry attempts: The number of times the task failed to be resubmitted. It supports drop-down and hand-filling.
- Failed retry interval: The time interval for resubmitting the task after a failed task. It supports drop-down and hand-filling.
- Timeout alarm: Check the timeout alarm and timeout failure. When the task exceeds the "timeout period", an alarm email will be sent and the task execution will fail.
- Downstream tasks: Supports two branches for now, success and failure
  - Success: When the Conditions task runs successfully, run this downstream task
  - Failure: When the Conditions task runs fails, run this downstream task
- Upstream condition selection: one or more upstream tasks can be selected for conditions
  - Add the upstream dependency: Use the first parameter to choose task name, and the second parameter for status of the upsteam task.
  - Upstream task relationship: we use `and` and `or` operators to handle complex relationship of upstream when multiple upstream tasks for Conditions task
