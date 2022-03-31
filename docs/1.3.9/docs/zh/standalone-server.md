# 单机体验版极速部署(Standalone)



## NOTICE:
建议 20 个以下工作流使用，采用嵌入式技术，包含 H2 Database, Zookeeper Testing Server。

# 1、准备工作

* [JDK](https://www.oracle.com/technetwork/java/javase/downloads/index.html) (1.8+)，请配置 /etc/profile下 JAVA_HOME 及 PATH 变量


# 2、一键启动

- 切换到有 sudo 权限的用户，运行脚本

```shell
sh ./bin/dolphinscheduler-daemon.sh start standalone-server
```


# 3、登录系统

- 访问前端页面地址，接口 ip (自行修改)
  http://localhost:12345/dolphinscheduler

<p align="center">
<img src="/img/login.png" width="60%" />
</p>

<p>
登入系统<br>
用户名: admin <br>
密码: dolphinscheduler123
</p>

# 4、启停服务

* 一键启停服务
```shell
sh ./bin/dolphinscheduler-daemon.sh start standalone-server
sh ./bin/dolphinscheduler-daemon.sh stop standalone-server
```