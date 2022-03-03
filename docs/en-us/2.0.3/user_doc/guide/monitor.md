# Monitor

## Service Management

- Service management is mainly to monitor and display the health status and basic information of each service in the system

## Master Monitor

- Mainly related to master information.
<p align="center">
   <img src="/img/master-jk-en.png" width="80%" />
 </p>

## Worker Monitor

- Mainly related to worker information.

<p align="center">
   <img src="/img/worker-jk-en.png" width="80%" />
 </p>

## Zookeeper Monitor

- Mainly related configuration information of each worker and master in ZooKeeper.

<p alignlinux ="center">
   <img src="/img/zookeeper-monitor-en.png" width="80%" />
 </p>

## DB Monitor

- Mainly the health of the DB

<p align="center">
   <img src="/img/mysql-jk-en.png" width="80%" />
 </p>

## Statistics Management

<p align="center">
   <img src="/img/statistics-en.png" width="80%" />
 </p>

- Number of commands to be executed: statistics on the t_ds_command table
- The number of failed commands: statistics on the t_ds_error_command table
- Number of tasks to run: Count the data of task_queue in Zookeeper
- Number of tasks to be killed: Count the data of task_kill in Zookeeper
