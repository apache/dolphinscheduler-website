# SubProcess Node

- The sub-process node is to execute an external workflow definition as a task node.
> > Drag from the toolbar ![PNG](https://analysys.github.io/easyscheduler_docs_cn/images/toolbar_SUB_PROCESS.png) task node into the canvas, as shown in the figure below:

<p align="center">
   <img src="/img/sub-process-en.png" width="80%" />
 </p>

- Node name: The node name in a workflow definition is unique.
- Run flag: Identifies whether this node schedules normally.
- Descriptive information: Describe the function of the node.
- Timeout alarm: Check the timeout alarm and timeout failure. When the task runs exceed the "timeout", an alarm email will send and the task execution will fail.
- Sub-node: It is the workflow definition of the selected sub-process. Enter the sub-node in the upper right corner to jump to the workflow definition of the selected sub-process.