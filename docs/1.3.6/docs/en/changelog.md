# Change Log

## Features/Updates

[#5062][feature][Worker Group] Create/Edit/Delete Worker Group in Web UI
[#5175][improvement][Server] Optimize and reduce worker group queries of database and zookeeper
[#4852][feature] Support SkyWalking agent plugin
[#4837][improvement][Docker/K8s] Docker & K8s Improvement Plan #4843 #4732 #4871 #4881 #4804 #4886 #2687 #4897 #3124 #5155 #5068 #5100 #2584 #4905 #5351
[#5023][improvement][Docker/K8s] Improve docker and k8s #2584 #2687 #4732 #4871 #4886 #4897
[#5158][improvement][Docker/K8s] Support more configs, more service access, skywalking configs, improve image for python, update faq and add support matrix #5155 #5068 #5141 #402 #403
[#5068][improvement][Docker/K8s] Task support matrix and solution on docker/k8s
[#5195][improvement][Docker/K8s] Improve feedback #5309 #5310
[#5100][feature][K8s] Support task scalability on K8s such as Spark, Flink and DataX
[#5224][improvement][Docker] Add workdir for dockerfile and remove redundant container_name and dolphinscheduler-postgresql-initdb
[#5310][improvement][Server] The log "load is too high or availablePhysicalMemorySize(G) is too low" is not clear
[#5028][feature][MR] Support MapReduce name
[#4960][feature][Spark] Support spark name
[#4285][feature] Add Flink job name
[#4976][feature][Flink] Support name and parallelism input
[#4805][improvement][SQL] Place the upgraded schema to the correct version directory and check schema errors
[#4751][improvement][API] Improvement the duration field modify the display to a time-based minute-second format (e.g. 1d 10h 20m 1s)
[#4740][improvement][UI] Set the default Tenant as default or the first existing tenant in the save process
[#403][feature]The memory of worker, master, and other services does not need to be the same
[#174][improvement][SqlTask] Add a switch to send mail and print head logs in SqlTask
[#5187][build] Optimize long release name and remove unused nginx release
[#5087][feature][SqlTask] Add a switch to send mail and print head logs in SqlTask
[#4624][improvement][Server] When the server exist in the dead server list of zk,need stop service byself
[#4969][improvement][UI] Support more file types in file detail page
[#2619][improvement][API] /dolphinscheduler/projects/create doesn't return project ID when create successful
[#4270][feature]support distributed tracing

## Bug Fixes

[#5309][bug][Common] memoryUsage is -33%
[#4843][bug][Docker] 1.3.5 release compose file config error WORKER_GROUP
[#4651][bug][Docker] Random PSQLException in docker bug
[#5351][bug][K8s] Quartz cron task cannot take effect
[#4905][bug][K8s] Incorrect host problem in minikube
[#5176][bug][Server] Wrong excludeFilters cause the worker server to start the master's beans and threads like LowerWeightHostManager and RefreshResourceTask
[#5132][bug][server] when an exception occurs in the taskExecuteThread, task cannot stop immediately
[#5115][bug][Server] The registered address of a server is the loopback address 127.0.0.1
[#5150][bug][Server] DB transaction failure
[#5103][bug][Resource] The file name of File and UDF resource not changed and cannot re-upload after renaming name
[#5349][bug][master] Manually kill the task that fails to be retried. After the parallel task succeeds, the workflow status is always running
[#5328][bug][Bug][masterserver] process contain depend on task is always running
[#5199][bug][api] When sleep is included in a shell task, cannot kill the task
[#5063][sql] Fix MySQL datasource jdbc connect parameters
[#5048][bug][Api] Delete the stopped workflow without deleting the corresponding subprocess, the workflow instance name is not displayed in the subprocess
[#5044][bug][Master] Fix First master fault tolerance when startup
[#5037][bug][Server] Both the master and the worker is hanging after restarting and stopping
[#4866][bug][Common] Not loaded hdfs-site.xml causes the client to fail to access the datanode
[#4862][bug][Server] Kill yarn application command won't be executed when killing error bug
[#4840][bug][Master] Master cannot fault-tolerant when multiple Masters start at the same time
[#4816][bug][API] The API calls the workflow instance query interface and queries all the data when the time parameter is wrong
[#4738][bug][Mail] Send mail failed instead of execute sql error
[#4760][bug][Api] init dolphinscheduler-postgre.sql error
[#4705][bug][API] KeeperException$NoNodeException
[#4674][bug][UI] The tips error when login with username and without password
[#4650][bug][Api] Process definition create, update and copy error in PostgreSQL bug
[#4716][bug][Master,Worker] The task execution path should be calculated by the worker, not the master
[#4617][bug][LoggerServer] task log can not refresh in time
