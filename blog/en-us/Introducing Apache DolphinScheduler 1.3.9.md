#Introducing Apache DolphinScheduler 1.3.9, StandaloneServer is Available!

[![_5fc2f5f0697d2457db591583571c1a50_25072.md.jpg](https://imgpp.com/image/1.Oe9ej)](https://imgpp.com/image/1.Oe9ej)

On October 22, 2021, we are excited to announce the release of Apache DolphinScheduler 1.3.9. After a month and a half，Apache DolphinScheduler 1.3.9 brings StandaloneServer to users with the joint efforts of the community. StandaloneServer is a major update of this version, which means a huge leap in ease of use, and the details will be introduced below. In addition, this upgrade also fixes two critical bugs in 1.3.8.

## 1.3.9 Download：[https://dolphinscheduler.apache.org/zh-cn/download/download.html](https://dolphinscheduler.apache.org/zh-cn/download/download.html)

In 1.3.9, the main updates include:


## New Features


**[Feature#6480] Add StandaloneServer to make development and operation easier**

StandaloneServer is a service created to allow users to quickly experience the product. The registry and database H2-DataBase and Zk-TestServer are built-in. Users can start StandaloneServer for debugging with only one line of command.

The way to start StandaloneServer with one-line command: switch to a user with sudo permission, and run the script

```plain
sh ./bin/dolphinscheduler-daemon.sh start standalone-server
```

It shows that 1.3.9 reduces the configuration cost through built-in components. You only need to configure the jdk environment to start the DolphinScheduler system with one click, thereby improving the efficiency of research and development. For detailed usage documents, please refer to: link to be added.

https://imgpp.com/images/2021/10/25/1151635131488_.pic.md.jpg

Access the front page address, interface IP (self-modified) [http://192.168.xx.xx:12345/dolphinscheduler](http://192.168.xx.xx:12345/dolphinscheduler), with the default name and password:admin/dolphinscheduler123.

The detailed user docs for Standalone, please refer to:[https://dolphinscheduler.apache.org/zh-cn/docs/1.3.9/user_doc/standalone-server.html](https://dolphinscheduler.apache.org/zh-cn/docs/1.3.9/user_doc/standalone-server.html)

## Optimization and Fix

**☆[Fix #6337][Task] Sql limit param no default value**




When the SqlTask ​​is executed, if the limit parameter is not set, the displayed result is empty. Based on this, the default parameters have been added in 1.3.9, and relevant instructions have been made on the log to allow users to track the problem more clearly.

**☆[Bug#6429] [ui] sub_process node open sub_task show empty page #6429**

The problem that the sub_task node is displayed as empty has been fixed.

## Contributor

Thanks to PMC Ke Zhenxu from the SkyWalking community for his contribution to StandaloneServer, Apache DolphinScheduler will persistently optimize the function design and enhance the user experience with the participation of more contributors, so stay tuned.

### 1 DolphinScheduler introduction

Apache DolphinScheduler is a distributed and extensible workflow scheduler platform with powerful DAG visual interfaces, dedicated to solving complex job dependencies in the data pipeline and providing various types of jobs available out of box. 

DolphinScheduler assembles Tasks in the form of DAG (Directed Acyclic Graph), which can monitor the running status of tasks in real time. At the same time, it supports operations such as retry, recovery from designated nodes, suspend and Kill tasks, and focuses on the following 6 capabilities :

https://imgpp.com/images/2021/10/25/WechatIMG89.md.jpg


## 2 Partial User Cases

According to incomplete statistics, as of October 2020, 600+ companies and institutions have adopted DolphinScheduler in production environments. Partial cases are shown as below (in no particular order).

[![logo.md.png](https://imgpp.com/images/2021/10/25/logo.md.png)](https://imgpp.com/image/OQylI)

## 3 Participate in Contribution

With the prosperity of open source in China, the Apache DolphinScheduler community ushered in vigorous development. In order to make better and easy-to-use scheduling system, we sincerely welcome partners who love open source to join Apache DolphinScheduler Community.

There are many ways to participate in and contribute to the Apache DolphinScheduler Community, including:

* Contribute to the first PR (document, code). We hope it to be simple and a try to get yourself familiar with the submission process and community collaboration.
* We have compiled a list of issues suitable for novices: [https://github.com/apache/dolphinscheduler/issues/5689](https://github.com/apache/dolphinscheduler/issues/5689)
* And a list of issues for non-newbie: [https://github.com/apache/dolphinscheduler/issues?q=is%3Aopen+is%3Aissue+label%3A%22volunteer+wanted%22](https://github.com/apache/dolphinscheduler/issues?q=is%3Aopen+is%3Aissue+label%3A%22volunteer+wanted%22)
* How to participate in the contribution: [https://dolphinscheduler.apache.org/en-us/community/development/contribute.html](https://dolphinscheduler.apache.org/en-us/community/development/contribute.html)

Apache DolphinScheduler Community needs you! Even if a small piece of tile will make a big differnce.

If you are interested in contributing code we created [good first issues ](https://github.com/apache/dolphinscheduler/issues/5689)to get you started. If you have any questions about [code](https://github.com/apache/dolphinscheduler), [installation](https://dolphinscheduler.apache.org/en-us/download/download.html), and [docs](https://dolphinscheduler.apache.org/en-us/docs/latest/user_doc/quick-start.html) please do not hesitate to reach out to us on [slack](https://app.slack.com/client/T01L3LB96V7/C01LUG59GPR).

**Community Official Website**

[https://dolphinscheduler.apache.org/](https://dolphinscheduler.apache.org/)

**Code Warehouse Address**

[https://github.com/apache/dolphinscheduler](https://github.com/apache/dolphinscheduler)