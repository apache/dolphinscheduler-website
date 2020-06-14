
# DolphinScheduler upgrade documentation

## 1. Back up the previous version of the files and database

## 2. Stop all services of dolphinscheduler

 `sh ./script/stop-all.sh`

## 3. Download the new version of the installation package

- [download](https://dist.apache.org/repos/dist/dev/incubator/dolphinscheduler/1.2.1/), download the latest version of the installation packages
- The following upgrade operations need to be performed in the new version of the directory

## 4. Database upgrade
- Modify the following properties in conf/application.properties

```
    spring.datasource.url
    spring.datasource.username
    spring.datasource.password
```

- Execute database upgrade script

`sh ./script/upgrade-dolphinscheduler.sh`

## 5. service upgrade
you can choose either jetty deployment or nginx deployment.
### jetty deployment
- Modify the content of the install.sh configuration and execute the upgrade script
  
  `sh install.sh`
- Visit the following url, interface address (modify it yourself)
  http://192.168.xx.xx:12345/dolphinscheduler

### nginx deployment
- Please download the source packages and execute `mvn clean package -Pnginx`
- Overwrite the previous version of the dist directory
- Restart the nginx service
  
    `systemctl restart nginx`
