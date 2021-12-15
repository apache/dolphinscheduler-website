
# DolphinScheduler upgrade documentation

## 1. Back Up Previous Version's Files and Database.

## 2. Stop All Services of DolphinScheduler.

 `sh ./script/stop-all.sh`

## 3. Download the New Version's Installation Package.

- [download](/en-us/download/download.html) the latest version of the installation packages.
- The following upgrade operations need to be performed in the new version's directory.

## 4. Database Upgrade
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

    `sh ./script/create-dolphinscheduler.sh`

## 5. Backend Service Upgrade.

### 5.1 Modify the Content in `conf/config/install_config.conf` File.
- Standalone Deployment please refer the [6, Modify running arguments] in [Standalone-Deployment](/en-us/docs/2.0.0/user_doc/standalone-deployment.html).
- Cluster Deployment please refer the [6, Modify running arguments] in [Cluster-Deployment](/en-us/docs/2.0.0/user_doc/cluster-deployment.html).

#### Masters Need Attentions

1、Modify the workers config item in conf/config/install_config.conf file.

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

### 5.2 Execute Deploy Script.
```shell
`sh install.sh`
```


