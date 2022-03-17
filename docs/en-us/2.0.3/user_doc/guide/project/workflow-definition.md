# Workflow Definition

## <span id=creatDag> Create Workflow Definition</span>

- Click Project Management -> Workflow -> Workflow Definition to enter the workflow definition page, and click the "Create Workflow" button to enter the **workflow DAG edit** page, as shown in the following figure:
  <p align="center">
      <img src="/img/dag5.png" width="80%" />
  </p>
- Drag in the toolbar <img src="/img/tasks/icons/shell.png" width="15"/> Add a Shell task to the drawing board, as shown in the figure below:

  ![demo-shell-simple](/img/tasks/demo/shell.jpg)

- **Add parameter settings for this shell task:**

1. Fill in the "Node Name", "Description", and "Script" fields;
2. Check “Normal” for “Run Flag”. If “Prohibit Execution” is checked, the task will not be executed when the workflow runs;
3. Select "Task Priority": When the number of worker threads is insufficient, high-level tasks will be executed first in the execution queue, and tasks with the same priority will be executed in the order of first in, first out;
4. Timeout alarm (optional): Check the timeout alarm, timeout failure, and fill in the "timeout period". When the task execution time exceeds **timeout period**, an alert email will be sent and the task timeout fails;
5. Resources (optional). Resource files are files created or uploaded on the Resource Center -> File Management page. For example, the file name is `test.sh`, and the command to call the resource in the script is `sh test.sh`;
6. Custom parameters (optional), refer to [Custom Parameters](#UserDefinedParameters);
7. Click the "Confirm Add" button to save the task settings.

- **Increase the order of task execution:** Click the icon in the upper right corner <img src="/img/line.png" width="35"/> to connect the task; as shown in the figure below, task 2 and task 3 are executed in parallel, When task 1 finished executing, tasks 2 and 3 will be executed simultaneously.

  <p align="center">
     <img src="/img/dag6.png" width="80%" />
  </p>

- **Delete dependencies:** Click the "arrow" icon in the upper right corner <img src="/img/arrow.png" width="35"/>, select the connection line, and click the "Delete" icon in the upper right corner <img src= "/img/delete.png" width="35"/>, delete dependencies between tasks.
  <p align="center">
     <img src="/img/dag7.png" width="80%" />
  </p>

- **Save workflow definition:** Click the "Save" button, and the "Set DAG chart name" pop-up box will pop up, as shown in the figure below. Enter the workflow definition name, workflow definition description, and set global parameters (optional, refer to [ Custom parameters](#UserDefinedParameters)), click the "Add" button, and the workflow definition is created successfully.
  <p align="center">
     <img src="/img/dag8.png" width="80%" />
   </p>
> For other types of tasks, please refer to [Task Node Type and Parameter Settings](#TaskParamers).

## Workflow Definition Operation Function

Click Project Management -> Workflow -> Workflow Definition to enter the workflow definition page, as shown below:

<p align="center">
<img src="/img/work_list_en.png" width="80%" />
</p>
The operation functions of the workflow definition list are as follows:

- **Edit:** Only "offline" workflow definitions can be edited. Workflow DAG editing is the same as [Create Workflow Definition](#creatDag).
- **Online:** When the workflow status is "Offline", used to online workflow. Only the workflow in the "Online" state can run, but cannot be edited.
- **Offline:** When the workflow status is "Online", used to offline workflow. Only the workflow in the "Offline" state can be edited, but not run.
- **Run:** Only workflow in the online state can run. See [2.3.3 Run Workflow](#runWorkflow) for the operation steps
- **Timing:** Timing can only be set in online workflows, and the system automatically schedules the workflow to run on a regular basis. The status after creating a timing is "offline", and the timing must be online on the timing management page to take effect. See [2.3.4 Workflow Timing](#creatTiming) for timing operation steps.
- **Timing Management:** The timing management page can be edited, online/offline, and deleted.
- **Delete:** Delete the workflow definition.
- **Download:** Download workflow definition to local.
- **Tree Diagram:** Display the task node type and task status in a tree structure, as shown in the figure below:
  <p align="center">
      <img src="/img/tree_en.png" width="80%" />
  </p>

## <span id=runWorkflow>Run the Workflow</span>

- Click Project Management -> Workflow -> Workflow Definition to enter the workflow definition page, as shown in the figure below, click the "Go Online" button <img src="/img/online.png" width="35"/>，Go online workflow.
  <p align="center">
      <img src="/img/work_list_en.png" width="80%" />
  </p>

- Click the "Run" button to pop up the startup parameter setting pop-up box, as shown in the figure below, set the startup parameters, click the "Run" button in the pop-up box, the workflow starts running, and the workflow instance page generates a workflow instance.
     <p align="center">
       <img src="/img/run_work_en.png" width="80%" />
     </p>  
  <span id=runParamers>Description of workflow operating parameters:</span> 
       
      * Failure strategy: When a task node fails to execute, other parallel task nodes need to execute the strategy. "Continue" means: after a certain task fails, other task nodes execute normally; "End" means: terminate all tasks being executed, and terminate the entire process.
      * Notification strategy: When the process is over, the process execution information notification email is sent according to the process status, including any status is not sent, successful sent, failed sent, successful or failed sent.
      * Process priority: The priority of process operation, divided into five levels: highest (HIGHEST), high (HIGH), medium (MEDIUM), low (LOW), and lowest (LOWEST). When the number of master threads is insufficient, high-level processes will be executed first in the execution queue, and processes with the same priority will be executed in a first-in first-out order.
      * Worker group: The process can only be executed in the specified worker machine group. The default is Default, which can be executed on any worker.
      * Notification group: select notification strategy||timeout alarm||when fault tolerance occurs, process information or email will be sent to all members in the notification group.
      * Recipient: Select notification policy||Timeout alarm||When fault tolerance occurs, process information or alarm email will be sent to the recipient list.
      * Cc: Select the notification strategy||Timeout alarm||When fault tolerance occurs, the process information or warning email will be copied to the CC list.
      * Startup parameter: Set or overwrite global parameter values when starting a new process instance.
      * Complement: Two modes including serial complement and parallel complement. Serial complement: Within the specified time range, the complements are executed from the start date to the end date and N process instances are generated in turn; parallel complement: within the specified time range, multiple days are complemented at the same time to generate N process instances.
    * For example, you need to fill in the data from May 1 to May 10.

    <p align="center">
        <img src="/img/complement_en1.png" width="80%" />
    </p>

  > Serial mode: The complement is executed sequentially from May 1 to May 10, and ten process instances are generated on the process instance page;

  > Parallel mode: The tasks from May 1 to may 10 are executed simultaneously, and 10 process instances are generated on the process instance page.

## <span id=creatTiming>Workflow Timing</span>

- Create timing: Click Project Management->Workflow->Workflow Definition, enter the workflow definition page, go online the workflow, click the "timing" button <img src="/img/timing.png" width="35"/> ,The timing parameter setting dialog box pops up, as shown in the figure below:
  <p align="center">
      <img src="/img/time_schedule_en.png" width="80%" />
  </p>
- Choose the start and end time. In the start and end time range, the workflow is run at regular intervals; not in the start and end time range, no more regular workflow instances are generated.
- Add a timing that is executed once every day at 5 AM, as shown in the following figure:
  <p align="center">
      <img src="/img/timer-en.png" width="80%" />
  </p>
- Failure strategy, notification strategy, process priority, worker group, notification group, recipient, and CC are the same as [workflow running parameters](#runParamers).
- Click the "Create" button to create the timing successfully. At this time, the timing status is "**Offline**" and the timing needs to be **Online** to take effect.
- Timing online: Click the "timing management" button <img src="/img/timeManagement.png" width="35"/>, enter the timing management page, click the "online" button, the timing status will change to "online", as shown in the below figure, the workflow takes effect regularly.
  <p align="center">
      <img src="/img/time-manage-list-en.png" width="80%" />
  </p>

## Import Workflow

Click Project Management -> Workflow -> Workflow Definition to enter the workflow definition page, click the "Import Workflow" button to import the local workflow file, the workflow definition list displays the imported workflow, and the status is offline.
