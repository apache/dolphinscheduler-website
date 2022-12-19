---
title: DolphinScheduler released version 3.0.3, focusing on fixing 6 bugs
keywords: Apache,DolphinScheduler,scheduler,big data,ETL,airflow,hadoop,orchestration,dataops,Kubernetes
description: Recently, Apache DolphinScheduler released version 3.0.3.
---
# DolphinScheduler released version 3.0.3, focusing on fixing 6 bugs
![](https://miro.medium.com/max/720/1*uM6PQlxRdJbLCEJrH-qemQ.webp)

Recently, Apache DolphinScheduler released version 3.0.3. This version mainly fixes bugs based on version 3.0.2, with a total of 6 bugs fixed and 3 document modifications. Important bug fixes include: Fix timing scheduling trigger get command parameter null pointer exception #12419 Fix the problem that the scheduled task environment variable does not take effect #12955 Change default unix shell from sh to bash #12180 Malformed LDAP configuration file The full Changelog is as follows:

# Bug Fixes
* [Bug-12954] [Schedule] Fix the problem that workflow level configuration information does not take effect when timing trigger execution (#12955)
* [Fix][UI] Download resource returns 401 (#12566)
* Make sure all failed tasks will be saved in errorTaskMap (#12424)
* Fix timing scheduling triggering main service report to get command parameter null pointer exception (#12419)
* Changed default unix shell executor from sh to bash (#12180)
* Fix LDAP error (#12929)

# Document
* [FEATURE-8030] [docs] Add Sqoop task documentation (#12855)
* [Documentation fix] Add Slack Alert documentation (#12567)
* [Optimization][Documentation] Update the structure and process startup process pictures (#12912)

# Release Notes
[https://github.com/apache/dolphinscheduler/releases/tag/3.0.3](https://github.com/apache/dolphinscheduler/releases/tag/3.0.3)

# Acknowledgment
Thanks to the following community contributors for their help in this version release👇👇💕💕

zhuangchong, ntfs32, DarkAssassinator, simsicon, liqingwang, baihongbin, Tianqi-Dotes, tracehh Participate in contribution