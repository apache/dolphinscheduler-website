# Workflow instance

## View workflow instance

- Click Project Management -> Workflow -> Workflow Instance to enter the Workflow Instance page, as shown in the figure below:
     <p align="center">
        <img src="/img/instance-list-en.png" width="80%" />
     </p>
- Click the workflow name to enter the DAG view page to view the task execution status, as shown in the figure below.
  <p align="center">
    <img src="/img/instance-runs-en.png" width="80%" />
  </p>

## View task log

- Enter the workflow instance page, click the workflow name, enter the DAG view page, double-click the task node, as shown in the following figure:
   <p align="center">
     <img src="/img/instanceViewLog-en.png" width="80%" />
   </p>
- Click "View Log", a log pop-up box will pop up, as shown in the figure below, the task log can also be viewed on the task instance page, refer to [Task View Log](#taskLog)。
   <p align="center">
     <img src="/img/task-log-en.png" width="80%" />
   </p>

## View task history

- Click Project Management -> Workflow -> Workflow Instance to enter the workflow instance page, and click the workflow name to enter the workflow DAG page;
- Double-click the task node, as shown in the figure below, click "View History" to jump to the task instance page, and display a list of task instances running by the workflow instance
   <p align="center">
     <img src="/img/task_history_en.png" width="80%" />
   </p>

## View operating parameters

- Click Project Management -> Workflow -> Workflow Instance to enter the workflow instance page, and click the workflow name to enter the workflow DAG page;
- Click the icon in the upper left corner <img src="/img/run_params_button.png" width="35"/>，View the startup parameters of the workflow instance; click the icon <img src="/img/global_param.png" width="35"/>，View the global and local parameters of the workflow instance, as shown in the following figure:
   <p align="center">
     <img src="/img/run_params_en.png" width="80%" />
   </p>

## Workflow instance operation function

Click Project Management -> Workflow -> Workflow Instance to enter the Workflow Instance page, as shown in the figure below:

  <p align="center">
    <img src="/img/instance-list-en.png" width="80%" />
  </p>

- **Edit：** Only terminated processes can be edited. Click the "Edit" button or the name of the workflow instance to enter the DAG edit page. After edit, click the "Save" button to pop up the Save DAG pop-up box, as shown in the figure below. In the pop-up box, check "Whether to update to workflow definition" and save After that, the workflow definition will be updated; if it is not checked, the workflow definition will not be updated.
     <p align="center">
       <img src="/img/editDag-en.png" width="80%" />
     </p>
- **Rerun：** Re-execute the terminated process.
- **Recovery failed：** For failed processes, you can perform recovery operations, starting from the failed node.
- **Stop：** To **stop** the running process, the background will first `kill`worker process, and then execute `kill -9` operation
- **Pause:** Perform a **pause** operation on the running process, the system status will change to **waiting for execution**, it will wait for the end of the task being executed, and pause the next task to be executed.
- **Resume pause:** To resume the paused process, start running directly from the **paused node**
- **Delete:** Delete the workflow instance and the task instance under the workflow instance
- **Gantt chart:** The vertical axis of the Gantt chart is the topological sorting of task instances under a certain workflow instance, and the horizontal axis is the running time of the task instances, as shown in the figure:
     <p align="center">
         <img src="/img/gantt-en.png" width="80%" />
     </p>
