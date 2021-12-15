# frontend-deployment

The front-end has three deployment modes: automated deployment, manual deployment and compiled source deployment.



## Preparations

#### Download the installation package

Please download the latest version of the installation package, download address： [download](/en-us/download/download.html)

After downloading apache-dolphinscheduler-incubating-x.x.x-dolphinscheduler-front-bin.tar.gz，
decompress`tar -zxvf apache-dolphinscheduler-incubating-x.x.x-dolphinscheduler-front-bin.tar.gz ./`and enter the`dolphinscheduler-ui`directory




## Deployment

Automated deployment is recommended for either of the following two ways

### Automated Deployment

>Front-end automatic deployment based on Linux system `yum` operation, before deployment, please install and update`yum`

under this directory, execute`./install-dolphinscheduler-ui.sh` 


### Manual Deployment
You can choose one of the following two deployment methods, or you can choose other deployment methods according to your production environment.

#### nginx deployment
Option to install epel source `yum install epel-release -y`

Install Nginx by yourself, download it from the official website: http://nginx.org/en/download.html or `yum install nginx -y`


> ####  Nginx configuration file address

```
/etc/nginx/conf.d/default.conf
```

> ####  Configuration information (self-modifying)

```
server {
    listen       8888;# access port
    server_name  localhost;
    #charset koi8-r;
    #access_log  /var/log/nginx/host.access.log  main;
    location / {
        root   /xx/dist; # the dist directory address decompressed by the front end above (self-modifying)
        index  index.html index.html;
    }
    location /dolphinscheduler {
        proxy_pass http://192.168.xx.xx:12345; # interface address (self-modifying)
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

> ####  Restart the Nginx service

```
systemctl restart nginx
```

#### nginx command

- enable `systemctl enable nginx`

- restart `systemctl restart nginx`

- status `systemctl status nginx`

#### jetty deployment
Enter the source package `dolphinscheduler-ui` directory and execute

```
npm install
```

> #####  ! ! ! Special attention here. If the project reports a "node-sass error" error while pulling the dependency package, execute the following command again after execution.
```
npm install node-sass --unsafe-perm //Install node-sass dependency separately
```

```
npm run build:release
```

Create the ui directory under the backend binary package directory

Copy all files in the dolphinscheduler-ui/dist directory to the backend binary package ui directory

Visit the following url, interface address (modify it yourself)
http://192.168.xx.xx:12345/dolphinscheduler

## FAQ
#### Upload file size limit

Edit the configuration file `vi /etc/nginx/nginx.conf`

```
# change upload size
client_max_body_size 1024m
```


