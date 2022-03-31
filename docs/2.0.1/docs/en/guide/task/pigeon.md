# Pigeon

Pigeon is general websocket service tracking task for DolphinScheduler. It can trigger, check status, get log from remote websocket service.

## Create

Drag in the toolbar<img src="/img/pigeon.png" width="20"/>The task node to the drawing board to create a new Conditions task

## Parameter

- Node name: The node name in a workflow definition is unique.
- Run flag: Identifies whether this node can be scheduled normally, if it does not need to be executed, you can turn on the prohibition switch.
- Descriptive information: describe the function of the node.
- Task priority: When the number of worker threads is insufficient, they are executed in order from high to low, and when the priority is the same, they are executed according to the first-in first-out principle.
- Worker grouping: Tasks are assigned to the machines of the worker group to execute. If Default is selected, a worker machine will be randomly selected for execution.
- Number of failed retry attempts: The number of times the task failed to be resubmitted. It supports drop-down and hand-filling.
- Failed retry interval: The time interval for resubmitting the task after a failed task. It supports drop-down and hand-filling.
- Timeout alarm: Check the timeout alarm and timeout failure. When the task exceeds the "timeout period", an alarm email will be sent and the task execution will fail.
- Target task name: Pigeon websocket service name.
