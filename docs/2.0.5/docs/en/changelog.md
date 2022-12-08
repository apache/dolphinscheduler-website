# Change Log

## Improvements

[#8110] The fault-tolerant process of the worker is optimized, so that when the server is under too much pressure, the worker service is interrupted, and the task can be transferred to other workers to continue.
[#8445] Optimize the page display flag of forbidden tasks to distinguish the display of normally executed tasks
[#8441] Add a prompt on the task box to display all the long task names.
[#8187] The function of re uploading files is added in the resource center. When users need to modify the execution script, they do not need to reconfigure the task parameters to realize the function of automatically updating the execution script.
[#8169] After the modification workflow is optimized, the page remains in the DAG page and will not jump to the list page.
[#8285] In the dingtalk alarm plugin, add the markdown information type in the alarm content.

## Bug Fixes

[#8213] Fixed the task runs incorrectly when the worker group contains uppercase letters.
[#8347] Fixed the workflow cannot be stopped when the task fails and retries
[#8135] Fixed JDBC connection parameter not input '@'
[#8367] Fixed complement may not end normally
[#8170] Fix the sub workflow that cannot be entered from the page
