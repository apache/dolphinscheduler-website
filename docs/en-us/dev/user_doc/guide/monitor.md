# Monitor

## Service Management

- Service management is mainly to monitor and display the health status and basic information of each service in the system.

## Monitor Master Server

- Mainly related to master information.
<p align="center">
   <img src="/img/master-jk-en.png" width="80%" />
 </p>

## Monitor Worker Server

- Mainly related to worker information.

<p align="center">
   <img src="/img/worker-jk-en.png" width="80%" />
 </p>

## Monitor ZooKeeper

- Mainly related configuration information of each worker and master in ZooKeeper.

<p alignlinux ="center">
   <img src="/img/zookeeper-monitor-en.png" width="80%" />
 </p>

## Monitor DB

- Mainly the health status of the DB.

<p align="center">
   <img src="/img/mysql-jk-en.png" width="80%" />
 </p>

## Statistics Management

<p align="center">
   <img src="/img/statistics-en.png" width="80%" />
 </p>

- Number of commands wait to be executed: statistics of the `t_ds_command` table data.
- The number of failed commands: statistics of the `t_ds_error_command` table data.
- Number of tasks wait to run: count the data of `task_queue` in the ZooKeeper.
- Number of tasks wait to be killed: count the data of `task_kill` in the ZooKeeper.