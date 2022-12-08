# Change Log

## Bug Fixes

[#3615] [master] After the task is executed successfully, but the next task has not been submitted, stop the master，the workflow will fail
[#4010] [master] When the condition node fails, the process status is failed after fault tolerance
[#3929] [master/worker] After the master and worker are fault-tolerant, the process instance fails after the task instance is successfully executed
[#3994] [Sql] Failed to import SQL file of sql/dolphinscheduler_mysql.sql
[#3964] [api/ui] The timeout warning of sub_process does not take effect
[#3974] [api/worker] The child process does not inherit the worker group of the parent process
[#3966] [master] The timeout warning does not take effect in sub_process  
[#3958] [api] files should not be created successfully in the directory of the authorized file  
[#3618] [worker] Too many files will be opened because of task executed fininished but not release the file handle.
[#3615] [master] After the task is executed successfully, but the next task has not been submitted, stop the master，the workflow will fail.
[#3843] [api] When the update workflow definition name already exists, the prompt is not friendly.
[#3924] [ui] When saving the workflow definition, if the backend verification is not successful, the save popup will not close.
[#3789] [remote] support netty heart beat to resolve channel time out.
[#3836] [API] verifyProcessDefinitionName error message
[#3702] [api] Resource file reupload does not overwrite the original file. This button is an invalid one
[#3621] [master] After batch deleting the executing process instances, the master cannot get the worker feedback results
[#3617] [master] After subtask fault tolerance, 2 task instances are generated，The process instance status always is executing
[#3616] [master] When the master receives the result from the worker, the master just stops. After the master restarts, the workflow status is always executing
[#3573] [dao] potential horizontal unauthorized access
[#3887] [ui] The English version of the resource file list and UDF list data is not displayed
[#3702] [api] Resource file reupload does not overwrite the original file. This button is an invalid one  
[#3487] [API] Creating folders with multiple threads will result in multiple identical folders
[#3493] [api] worker group manage ui could not display createtime and updatetime
[#3549] [Server][sqltask]The alias column in the query SQL does not take effect
[#3792] [ui] The pie chart on the project homepage does not adapt to the screen size
[#3719] [api] The task resource could not be deleted  
[#3548] [UI] Monitor gauge chart display blank with same pid bug
[#3707] [ui] The batch delete function in the workflow definition and workflow instance pages cannot be canceled if selected
[#3553] [ui] when edit the work flow,the selected connecting line has no style change,but the others have get bigger
[#3238] [docker] Can not create folder in docker with standalone mode
[#3713] [common] catfile method Stream not closed
[#3258] [api] Connot get create time and update time,report DateTimeParseException

## Improvements

[#3720] [ui] js mailbox verification
[#3843] [api] When the update workflow definition name already exists, the prompt is not friendly
[#3131] [api] When the new tenant already exists, the prompt is incorrect
