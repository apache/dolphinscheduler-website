# Change Log

## Download

https://dolphinscheduler.apache.org/en-us/download

## Features

[#7804] DingTalk alert plugin adds signature.
[#7857] Problems caused by modifying the administrator user information.
[#7675] Supports whether SQL is placed in one session
[#7571] Add dependent tips about success or failure

## Improvements

[#7990] zkRoot in conf/config/install\_ config does not take effect
[#7713] The data source password in the log is not encrypted

## Bug Fixes

[#8131] add delete workflow instance when delete process definition
[#8098] udf sub resource manage edit modal cant close
[#8081] process is always running: netty writeAndFlush without retry when failed leads to worker response to master failed
[#7986] After deleting the running workflow, the master keeps brushing the error log
[#8056] Edit the bug of worker grouping in environment management.
[#7512] dependent node ui dislocation
[#7913] Error in querying historical version information of workflow
[#7982] common task log in master no need to print separately
[#7962] The global parameters of the sub_process node are not passed to the associated workflow task
[#7953] query log can not show contents when task log in master on k8s
[#7815] There are duplicate processes in the process definition list
[#7698] process instance is always running: task is failure when process instance FailureStrategy.END
[#7732] field ‘is_directory’ in t_ds_resources table has error type in PostgreSQL database
[#7883] Repair JDBC connection of Oracle
[#7538] when there is a forbidden node in dag, the execution flow is abnormal
[#7789] querySimpleList return wrong projectCode
