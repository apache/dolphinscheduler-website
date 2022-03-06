# Blocking

Blocking is a node that decides whether or not to suspend the whole running workflow, i.e. blocking. It based on the running status of its predecessor and the parameters configured by the user when adding the node. The user can also set whether to alert when a workflow is blocked. After user intervention, if the execution status of the workflow is found to be as expected, the user can choose to continue the execution.

## Parameter

- Node name：The node name in a workflow definition is unique.
- Run flag：Identifies whether this node can be scheduled normally, if it does not need to be executed, you can turn on the prohibition switch.
- Description：describe the function of the node.
- Task priority：When the number of worker threads is insufficient, they are executed in order from high to low, and when the priority is the same, they are executed according to the first-in first-out principle.
- Worker grouping：Tasks are assigned to the machines of the worker group to execute. If Default is selected, a worker machine will be randomly selected for execution.
- Number of failed retry attempts：The number of times the task failed to be resubmitted.
- Failed retry interval：The time interval for resubmitting the task after a failed task.
- Timeout alarm：Check the timeout alarm and timeout failure. When the task exceeds the "timeout period", an alarm email will be sent and the task execution will fail.
- Blocking condition：There are two options, which define the opportunity of blocking the workflow:
    - Blocking on custom param failed：That is, the workflow is blocked when the result of the custom parameter is **false**.
    - Blocking on custom param success：That is, the workflow is blocked when the result of the custom parameter is **success**.
- Alert when blocking：Whether to send alerts to relevant users when a workflow is blocked
- Custom Parameters：one or more upstream tasks can be selected for blocking node
    - Add the upstream dependency：Use the first parameter to choose task name, and the second parameter for status of the upsteam task.
    - Upstream task relationship：we use `and` and `or`operators to handle complex relationship of upstream when multiple upstream tasks for Conditions task

## Related Task

- [Conditions](conditions.md)：Condition task, the main function is to decide which branch to execute based on the result of the custom parameters set by the user.
- [Switch](switch.md)：The Switch task mainly executes the corresponding branch based on the value of the global parameter and the judgment expression result written by the user.

The main difference between them is that Blocking node can block the workflow, i.e. suspend workflow execution; they(conditions, switch) select a subsequent branch for execution.