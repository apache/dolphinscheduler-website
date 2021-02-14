
# DolphinScheduler upgrade documentation

## 1. Back up previous version's files and database.

## 2. Stop all services of DolphinScheduler.

 `sh ./script/stop-all.sh`

## 3. Download the new version's installation package.

- [Download](/en-us/download/download.html) the latest version of the installation packages.
- The following upgrade operations need to be performed in the new version's directory.

## 4. Database upgrade
- Modify the following properties in conf/datasource.properties.

- If you use MySQL as database to run DolphinScheduler, please comment out PostgreSQL releated configurations, and add mysql connector jar into lib dir, here we download mysql-connector-java-5.1.47.jar, and then correctly config database connect infoformation. You can download mysql connector jar [here](https://downloads.MySQL.com/archives/c-j/). Alternatively if you use Postgres as database, you just need to comment out Mysql related configurations, and correctly config database connect information.

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

## 5. Backend service upgrade.

### 5.1 Modify the content in `conf/config/install_config.conf` file.
- Standalone Deployment please refer the [6, Modify running arguments] in [Standalone-Deployment](/en-us/docs/1.3.4/user_doc/standalone-deployment.html).
- Cluster Deployment please refer the [6, Modify running arguments] in [Cluster-Deployment](/en-us/docs/1.3.4/user_doc/cluster-deployment.html).

#### Masters need attentions
Create worker group in 1.3.1 version has different design: 

- Brfore version 1.3.1 worker group can be created through UI interface.
- Since version 1.3.1 worker group can be created by modify the worker configuration. 

#### When upgrade from version before 1.3.1 to 1.3.2, below operations are what we need to do to keep worker group config consist with previous.

1, Go to the backup database, search records in t_ds_worker_group table, mainly focus id, name and ip these three columns.

| id | name | ip_list    |
| :---         |     :---:      |          ---: |
| 1   | service1     | 192.168.xx.10    |
| 2   | service2     | 192.168.xx.11,192.168.xx.12      |

2、Modify the workers config item in conf/config/install_config.conf file.

Imaging bellow are the machine worker service to be deployed:
| hostname | ip |
| :---  | :---:  |
| ds1   | 192.168.xx.10     |
| ds2   | 192.168.xx.11     |
| ds3   | 192.168.xx.12     |

To keep worker group config consistant with previous version, we need to modify workers config item as below:

```shell
#worker service is deployed on which machine, and also specify which worker group this worker belong to. 
workers="ds1:service1,ds2:service2,ds3:service2"
```

#### The worker group has been enhanced in version 1.3.2.
Worker in 1.3.1 can't belong to more than one worker group, in 1.3.2 it's supported. So in 1.3.1 it's not supported when workers="ds1:service1,ds1:service2", and in 1.3.2 it's supported. 
  
### 5.2 Execute deploy script.
```shell
`sh install.sh`
```


