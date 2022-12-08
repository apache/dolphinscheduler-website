# Change Log

## New Features

[#2815] One worker server can set multiple worker groups
[#3370] JVM parameter optimization
[#3223] Click DAG connection to add label function

## Bug Fixes

[#3536] If user didn't have tenant,create resource will NPE
[#3480] zookeeper multi directories, tasks cannot be assigned
[#3431] After the resource is re-uploaded, the deleted resource directory displayed in the workflow definition is incorrect
[#3463] rename the udf resource file associated with the udf function, Failed to execute hive task
[#3058] The task running order in the process instance does not follow the topological order in the process definition
[#3423] 1.2.0 upgrade to 1.3.2, rename the resource file, view the resource in workflow definition, the file cannot be found
[#3469] The program type of spark node is selected as PYTHON, how should the main jar package be selected
[#3462] The admin user cannot view the UDF functions created by ordinary users in the workflow definition
[#3256] admin account modify report error, caused by mobile phone
[#3364] After update the version from 1.2.0 to 1.3.1,running the spark task fail because the can't find the jar
[#3433] Release the imported process definition which version is below 1.3.0 will be failure
[#3413] shell setting form display error
[#3397] Upgrade from 1.2.0 to 1.3.0,Run the spark task, the error is "spark task params is not valid"
[#1336] Dependent execution fails after task performs serial complement
[#3390] Run hive task, udf resource path is incorrect
[#3357] Select the dag connection to pop up the label edit box
[#3258] [Worker group manage] Connot get create time and update time,report DateTimeParseException
[#3209] ambari plugin the config options which unit doesn't write into config file
[#3255] Click Cancel, the node data is restored to the original data
[#3259] Delete the pid of the master and worker processes
[#3261] When modifying the dag, if the DAG is not saved, it cannot be formatted
[#3272] Default assignment of delete condition judgment node
[#3269] Fix the problem that the label of DAG creation task is not displayed, the workflow cannot be formatted after saving, and the drawer style is global
[#3393] view the log of the subtask, prompt "task instance does not exist"

## Improvements

[#3351] process_definition_json contains definitionList，but this definitionList is not use
[#3327] resource file content update
[#3347] The new shell script is used to view the server processes of nodes

## Enhancements

[#3176] optimize #3165 Gets the value of this property “resource.storage.type”， Comparison with enumerated types
