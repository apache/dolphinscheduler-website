# SubProcess

- The sub-process node is to execute a certain external workflow definition as a task node.
> Drag the ![PNG](https://analysys.github.io/easyscheduler_docs_cn/images/toolbar_SUB_PROCESS.png) task node in the toolbar to the drawing board, as shown in the following figure:

<p align="center">
   <img src="/img/sub-process-en.png" width="80%" />
 </p>

- Node name: The node name in a workflow definition is unique
- Run flag: identify whether this node can be scheduled normally
- Descriptive information: describe the function of the node
- Timeout alarm: Check the timeout alarm and timeout failure. When the task exceeds the "timeout period", an alarm email will be sent and the task execution will fail.
- Sub-node: It is the workflow definition of the selected sub-process. Enter the sub-node in the upper right corner to jump to the workflow definition of the selected sub-process