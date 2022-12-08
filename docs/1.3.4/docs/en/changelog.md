# Change Log

## Features/Updates

[#2925][server] init TaskLogger in TaskExecuteProcessor
[ambari-update] change version from 1.3.3 to 1.3.4
[sqoop-update] modify sqoop task param when upgrade ds to 1.3.4
[#4143][quartz-update] upgrade quartz version to 2.3.0

## Bug Fixes

[#2917 #4034 #4104 #4135][sqoop] sqoop optimization and bug fix
[#3177] task time parameter parsing error
[#3457][flink] fix flink args build problem
[#4034][server] fix sqoop import fail
[#3900][server] kill multi yarn app in one job
[#4054][api] fix The last week of the month for adding/editing timing, preview and save timing will report an error
[#4054][ui] Repair the last Sunday of each month
[#4084][server] fix taskInstance state change error
[#4104] fix sqoop task jdbc string contains special char
[#4135][worker] fix sqoop import hive error
[#4114][server] fix clear task execute path is related to master.
[#4084][master] fix taskInstance state change error
[#4090][dao] execute a single task in workflow throw NullPointerException
[#4190][dao] when the amount of json data is large, the process list page display slowly.
[#4218][bug] start from the setting nodes with NODE_PRE would be NPE
[#4223][ui] fix dag node name verification
