# 前端部署文档

前端有3种部署方式，分别为自动化部署，手动部署和编译源码部署

## 1、准备工作
#### 下载安装包

请下载最新版本的安装包，下载地址： [下载](/zh-cn/download/download.html)

下载 apache-dolphinscheduler-incubating-x.x.x-dolphinscheduler-front-bin.tar.gz 后，
解压`tar -zxvf apache-dolphinscheduler-incubating-x.x.x-dolphinscheduler-front-bin.tar.g ./`后，进入`dolphinscheduler-ui`目录




## 2、部署
以下两种方式任选其一部署即可，推荐自动化部署
### 2.1 自动化部署

>前端自动部署基于linux系统`yum`操作，部署之前请先安装更新`yum`

在该目录下执行`./install-dolphinscheduler-ui.sh`


### 2.2 手动部署
以下两种部署方式任选其一即可，也可以根据自己生产环境情况自行选择其他方式部署

#### 2.2.1 nginx方式部署
选装epel源 `yum install epel-release -y`

自行安装Nginx，去官网下载: http://nginx.org/en/download.html  或者 `yum install nginx -y` 


> ####  nginx配置文件地址
```
/etc/nginx/conf.d/default.conf
```
> ####  配置信息(自行修改)
```
server {
    listen       8888;# 访问端口
    server_name  localhost;
    #charset koi8-r;
    #access_log  /var/log/nginx/host.access.log  main;
    location / {
        root   /xx/dist; # 上面前端解压的dist目录地址(自行修改)
        index  index.html index.html;
    }
    location /dolphinscheduler {
        proxy_pass http://192.168.xx.xx:12345; # 接口地址(自行修改)
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header x_real_ipP $remote_addr;
        proxy_set_header remote_addr $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_http_version 1.1;
        proxy_connect_timeout 4s;
        proxy_read_timeout 30s;
        proxy_send_timeout 12s;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
    #error_page  404              /404.html;
    # redirect server error pages to the static page /50x.html
    #
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }
}
```
> ####  重启Nginx服务
```
systemctl restart nginx
```

#### nginx命令

- 启用 `systemctl enable nginx`

- 重启 `systemctl restart nginx`

- 状态 `systemctl status nginx`

#### 2.2.2 jetty方式部署
在源码包`dolphinscheduler-ui`目录下执行

```
npm install
```

> #####  ！！！这里特别注意 项目如果在拉取依赖包的过程中报 " node-sass error " 错误，请在执行完后再次执行以下命令
```
npm install node-sass --unsafe-perm //单独安装node-sass依赖
```

```
npm run build:release
```

在后端二进制包目录下创建ui目录

拷贝dolphinscheduler-ui/dist目录下所有的文件到后端二进制包ui目录下

访问以下url,接口地址(自行修改)
http://192.168.xx.xx:12345/dolphinscheduler



## 前端常见问题
####  1. 上传文件大小限制
编辑配置文件 `vi /etc/nginx/nginx.conf`
```
# 更改上传大小
client_max_body_size 1024m
```
