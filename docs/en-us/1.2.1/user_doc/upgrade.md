
# DolphinScheduler upgrade documentation

## 1. Back up the previous version of the files and database

## 2. Stop all services of dolphinscheduler

 `sh ./script/stop-all.sh`

## 3. Download the new version of the installation package

- [download](/en-us/download/download.html), download the latest version of the front and back installation packages (backend referred to as dolphinscheduler-backend, front end referred to as dolphinscheduler-front)
- The following upgrade operations need to be performed in the new version of the directory

## 4. Database upgrade
- Modify the following properties in conf/application-dao.properties

```
    spring.datasource.url
    spring.datasource.username
    spring.datasource.password
```

- Execute database upgrade script

`sh ./script/upgrade-dolphinscheduler.sh`

## 5. Backend service upgrade

- Modify the content of the install.sh configuration and execute the upgrade script
  
  `sh install.sh`

## 6. Frontend service upgrade

- Overwrite the previous version of the dist directory
- Restart the nginx service
  
    `systemctl restart nginx`
