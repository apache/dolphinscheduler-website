
# DolphinScheduler Upgrade document

## 1. Back up files and databases of the previous version

## 2. Stop all services of dolphinscheduler

 `sh ./script/stop-all.sh`

## 3. Download the new version of the installation package

- [Download](/en-us/download/download.html), Download the latest version of the binary installation package
- The following upgrade operations need to be performed in the new version directory

## 4. Database upgrade
- Modify the following properties in conf/datasource.properties

- If you choose MySQL, please comment out the PostgreSQL related configuration (the same is true for the reverse), and you also need to manually add the [[ mysql-connector-java driver jar](https://downloads.MySQL.com/archives/cj/)] package to lib In the directory, here is mysql-connector-java-5.1.47.jar, and then correctly configure the database connection related information

    ```properties
      # postgre
      #spring.datasource.driver-class-name=org.postgresql.Driver
      #spring.datasource.url=jdbc:postgresql://localhost:5432/dolphinscheduler
      # mysql
      spring.datasource.driver-class-name=com.mysql.jdbc.Driver
      spring.datasource.url=jdbc:mysql://xxx:3306/dolphinscheduler?useUnicode=true&characterEncoding=UTF-8&allowMultiQueries=true     Need to modify the ip, the local localhost can
      spring.datasource.username=xxx						Need to be modified to the above {user} value
      spring.datasource.password=xxx						Need to be modified to the above {password} value
    ```

- Execute database upgrade script

`sh ./script/upgrade-dolphinscheduler.sh`

## 5. Service upgrade

### 5.1 Modify `conf/config/install_config.conf` configuration content
For standalone deployment, please refer to [Standalone deployment](/en-us/docs/1.3.1/user_doc/standalone-deployment.html) in `6. Modify the running parameters section`
For cluster deployment, please refer to [Cluster Deployment (Cluster)](/en-us/docs/1.3.1/user_doc/cluster-deployment.html) in `6. Modify the operating parameters section`

### Precautions
Creating worker groups has a different design in version 1.3.1 and previous versions

- The worker group was created through the UI interface before version 1.3.1
- Worker grouping in version 1.3.1 is to modify the worker configuration designation

### How to set the worker grouping during the upgrade is the same as before

1、Query the database that has been backed up, check the t_ds_worker_group table records, and focus on the three fields id, name and ip_list

| id | name | ip_list    |
| :---         |     :---:      |          ---: |
| 1   | service1     | 192.168.xx.10    |
| 2   | service2     | 192.168.xx.11,192.168.xx.12      |

2、Modify the workers parameter in conf/config/install_config.conf

Assume that the following is the correspondence between the host name and ip of the worker to be deployed
| CPU name | ip |
| :---  | :---:  |
| ds1   | 192.168.xx.10     |
| ds2   | 192.168.xx.11     |
| ds3   | 192.168.xx.12     |

In order to keep the grouping consistent with the previous version of the worker, you need to change the workers parameter to the following

```shell
#workerService is deployed on which machine, and specify which worker group this worker belongs to
workers="ds1:service1,ds2:service2,ds3:service2"
```

  
### 5.2 Execute deployment script
```shell
`sh install.sh`
```


