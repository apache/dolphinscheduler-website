# Change Log

## Features/Updates

[K8s] Support resource storage when fs.defaultFS=file:///
[Docker] Update readme
[UI] Improve parameter name
[UI] download url resolve and security page disappear delay problem under GENERAL_USER
[API]enable response resources gzip compression
[#703]Docker image optimization
[#4439][api] Cors inteceptor problems
[#4418][login controller] Need password when open in new tab

## Bug Fixes

[#3237][docker] the file requirements.yaml in helm mode has error flag
[#3298][k8s]when recreate or upgrade helm release, the host ip changed
[#4691][udf] udf jar path not exist when fs.defaultFS starts with file:///
[#4640][ui] Fixed a 404 error when the project name contains "HTTP"
[#4648][ui] TypeError: Cannot read property 'id' of undefined in createUser
[#4566][worker] worker-server logback partial logs are not printed
[#4526][worker] worker server doesn't work fine in K8s
[#4472][datasource] Hive JDBC partial permission parameter concatenation JDBC URL error
[#4247][api] When schedulertime is empty, rerun the workflow, the time of the global parameter is not the latest
[#4449][api] Update workflow instance to report null point exception
[#4455]kill task error because of shell output truncation
[#4271][logger] IOException or NoSuchFileException in logger server
[#4162][ui]fix re-login problem in new tab and state synchronization problem in multiple tabs
[#3457][flink] fix flink args build problem
