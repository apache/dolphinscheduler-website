
# DolphinScheduler升级文档

## 1. 备份上一版本文件和数据库

## 2. 停止dolphinscheduler所有服务

 `sh ./script/stop-all.sh`

## 3. 下载新版本的安装包

- [下载](/zh-cn/download/download.html), 下载最新版本的前后端安装包(dolphinscheduler-backend、dolphinscheduler-ui)
- 以下升级操作都需要在新版本的目录进行

## 4. 数据库升级
- 修改conf/application-dao.properties中的下列属性

```
    spring.datasource.url
    spring.datasource.username
    spring.datasource.password
```

- 执行数据库升级脚本

`sh ./script/upgrade-dolphinscheduler.sh`

## 5. 后端服务升级

- 修改install.sh配置内容，执行升级脚本
  
  `sh install.sh`

## 6. 前端服务升级
- 覆盖上一版本dist目录
- 重启nginx服务
  
    `systemctl restart nginx`
