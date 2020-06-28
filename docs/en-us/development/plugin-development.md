## Task Plugin Development

Remind:Currently, task plugin development does not support hot deployment.

### Shell-based tasks

#### YARN-based calculations (see MapReduceTask)

- Need to be **cn.dolphinscheduler.server.worker.task** Down **TaskManager** Create a custom task in the class (also need to register the corresponding task type in TaskType)
- Need to inherit**cn.dolphinscheduler.server.worker.task** Down **AbstractYarnTask**
- Constructor Scheduling **AbstractYarnTask** Construction method
- Inherit **AbstractParameters** Custom task parameter entity
- Rewrite **AbstractTask** of **init** Parsing in method**Custom task parameters**
- Rewrite **buildCommand** Encapsulation command



#### Non-YARN-based calculations (see ShellTask)
- Need to be **cn.dolphinscheduler.server.worker.task** Down **TaskManager** A custom task

- Need to inherit**cn.dolphinscheduler.server.worker.task** Down **AbstractTask**

- Instantiation in constructor **ShellCommandExecutor**

  ```
  public ShellTask(TaskProps props, Logger logger) {
    super(props, logger);
  
    this.taskDir = props.getTaskDir();
  
    this.processTask = new ShellCommandExecutor(this::logHandle,
        props.getTaskDir(), props.getTaskAppId(),
        props.getTenantCode(), props.getEnvFile(), props.getTaskStartTime(),
        props.getTaskTimeout(), logger);
    this.processDao = DaoFactory.getDaoInstance(ProcessDao.class);
  }
  ```

  Incoming custom tasks **TaskProps**And custom**Logger**，TaskProps Encapsulate task information, Logger is installed with custom log information

- Inherit **AbstractParameters** Custom task parameter entity

- Rewrite **AbstractTask** of **init** Parsing in method**Custom task parameter entity**

- Rewrite **handle** method，transfer **ShellCommandExecutor** of **run** method，The first parameter is passed in**command**，Pass the second parameter to ProcessDao and set the corresponding **exitStatusCode**

### Non-SHELL-based tasks (see SqlTask)

- Need to be **cn.dolphinscheduler.server.worker.task** Down **TaskManager** A custom task
- Need to inherit**cn.dolphinscheduler.server.worker.task** Down **AbstractTask**
- Inherit **AbstractParameters** Custom task parameter entity
- Constructor or override **AbstractTask** of **init** in the method, parse the custom task parameter entity
- Rewrite **handle** Methods to implement business logic and set the corresponding**exitStatusCode**

