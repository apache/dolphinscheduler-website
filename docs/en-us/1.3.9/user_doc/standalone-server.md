# Standalone Experience Quick Deployment (Standalone)



# NOTICE:
Recommended for less than 20 workflows, Using embedded technology, using embedded H2 Database,Zookeeper Testing Server.

# 1. Preparation

* [JDK](https://www.oracle.com/technetwork/java/javase/downloads/index.html) (1.8+), please configure JAVA_HOME and PATH variables under /etc/profile


# 2. one key start

- Switch to a user with sudo privileges and run the script

```shell
sh . /bin/dolphinscheduler-daemon.sh start standalone-server
```


# 3. Login to the system

- Access front-end page address, interface ip (modify by yourself)
  http://192.168.xx.xx:12345/dolphinscheduler

<p align="center">
<img src="/img/login.png" width="60%" />
</p>

# 4. Start/Stop Service

* One click to start and stop the service
```shell
sh . /bin/dolphinscheduler-daemon.sh start standalone-server
sh . /bin/dolphinscheduler-daemon.sh stop standalone-server
```