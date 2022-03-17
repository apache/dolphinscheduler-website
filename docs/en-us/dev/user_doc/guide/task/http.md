# HTTP Node

- Drag from the toolbar <img src="/img/http.png" width="35"/> task node to the canvas, as shown in the following figure:

<p align="center">
   <img src="/img/http-en.png" width="80%" />
 </p>

- Node name: The node name in a workflow definition is unique.
- Run flag: Identifies whether this node schedules normally, if it does not need to execute, select the `prohibition execution`.
- Descriptive information: Describe the function of the node.
- Task priority: When the number of worker threads is insufficient, execute in the order of priority from high to low, and tasks with the same priority will execute in a first-in first-out order.
- Worker grouping: Assign tasks to the machines of the worker group to execute. If `Default` is selected, randomly select a worker machine for execution.
- Times of failed retry attempts: The number of times the task failed to resubmit. You can select from drop-down or fill-in a number.
- Failed retry interval: The time interval for resubmitting the task after a failed task. You can select from drop-down or fill-in a number.
- Timeout alarm: Check the timeout alarm and timeout failure. When the task runs exceed the "timeout", an alarm email will send and the task execution will fail.
- Request address: HTTP request URL.
- Request type: Support GET, POST, HEAD, PUT and DELETE.
- Request parameters: Support Parameter, Body and Headers.
- Verification conditions: Support default response code, custom response code, content include and content not included.
- Verification content: When the verification condition selects the custom response code, the content include or the content not included, the verification content is required.
- Custom parameter: It is a user-defined local parameter of HTTP, and will replace the content with `${variable}` in the script.
