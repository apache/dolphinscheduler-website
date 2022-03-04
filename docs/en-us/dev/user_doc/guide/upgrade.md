# DolphinScheduler Upgrade Documentation

## Back Up Previous Version's Files and Database

## Stop All Services of DolphinScheduler

 `sh ./script/stop-all.sh`

## Download the New Version's Installation Package

- [download](/en-us/download/download.html) the latest version of the installation packages.
- The following upgrade operations need to be performed in the new version's directory.

## Database Upgrade

- Modify the following properties in conf/datasource.properties.

- If you use MySQL as the database to run DolphinScheduler, please comment out PostgreSQL related configurations, and add mysql connector jar into lib dir, here we download mysql-connector-java-8.0.16.jar, and then correctly config database connect information. You can download mysql connector jar [here](https://downloads.MySQL.com/archives/c-j/). Alternatively, if you use Postgres as database, you just need to comment out Mysql related configurations, and correctly config database connect information.

    ```properties
      # postgre
      #spring.datasource.driver-class-name=org.postgresql.Driver
      #spring.datasource.url=jdbc:postgresql://localhost:5432/dolphinscheduler
      # mysql
      spring.datasource.driver-class-name=com.mysql.jdbc.Driver
      spring.datasource.url=jdbc:mysql://xxx:3306/dolphinscheduler?useUnicode=true&characterEncoding=UTF-8&allowMultiQueries=true
      spring.datasource.username=xxx
      spring.datasource.password=xxx
    ```

- Execute database upgrade script

    `sh ./script/upgrade-dolphinscheduler.sh`

## Backend Service Upgrade

### Modify the Content in `conf/config/install_config.conf` File

- Standalone Deployment please refer the [6, Modify running arguments] in [Standalone-Deployment](./installation/standalone.md).
- Cluster Deployment please refer the [6, Modify running arguments] in [Cluster-Deployment](./installation/cluster.md).

#### Masters Need Attentions

Create worker group in 1.3.1 version has different design: 

- Before version 1.3.1 worker group can be created through UI interface.
- Since version 1.3.1 worker group can be created by modify the worker configuration. 

#### When Upgrade from Version Before 1.3.1 to 1.3.2, Below Operations are What We Need to Do to Keep Worker Group Config Consist with Previous

1. Go to the backup database, search records in t_ds_worker_group table, mainly focus id, name and IP three columns.

| id | name | ip_list    |
| :---         |     :---:      |          ---: |
| 1   | service1     | 192.168.xx.10    |
| 2   | service2     | 192.168.xx.11,192.168.xx.12      |

2. Modify the workers config item in conf/config/install_config.conf file.

Imaging bellow are the machine worker service to be deployed:
| hostname | ip |
| :---  | :---:  |
| ds1   | 192.168.xx.10     |
| ds2   | 192.168.xx.11     |
| ds3   | 192.168.xx.12     |

To keep worker group config consistent with the previous version, we need to modify workers config item as below:

```shell
#worker service is deployed on which machine, and also specify which worker group this worker belongs to. 
workers="ds1:service1,ds2:service2,ds3:service2"
```

#### The Worker Group has Been Enhanced in Version 1.3.2
Worker in 1.3.1 can't belong to more than one worker group, in 1.3.2 it's supported. So in 1.3.1 it's not supported when workers="ds1:service1,ds1:service2", and in 1.3.2 it's supported. 

### Execute Deploy Script

```shell
`sh install.sh`
```


