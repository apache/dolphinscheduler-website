# Change Log

## Download:

https://dolphinscheduler.apache.org/en-us/download

## Features

[#6470] Add Python API for DolphinScheduler
[#7460] Wechat alert support send to group chat

## Improvements

[#7529] Init DB schema from the full sql file

## Bug Fixes

[#7661] Fix the memory leak of logger in worker
[#7750]Compatible historical version data source connection information
[#7748] Remove init script when gaining a new DB connection
[#7705] Because of memory limitations, upgrade from 1.3.5 to 2.0.2 error
[#7786] Server restart fail after force killed
[#7660] Wrong create time of process definition version
[#7607] Failed to execute PROCEDURE node
[#7639] Add default config of quartz and zookeeper in common config map
[#7654] Dependent node on change project code error
[#7658] workflow copy error
[#7609] Workflow is always running when worker sendResult success but master not received bug
[#7554] H2 in standalone server will auto restart after several minutes
[#7434] An error is reported when executing the MySQL table creation statement
[#7537] Dependent node retry delay did not work
[#7451] Remove '+1' (day) in the date of the complement data
[#7392] Add hive datasource failed
