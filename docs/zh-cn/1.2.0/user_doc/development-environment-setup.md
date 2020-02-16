#### 准备工作
1. 首先从远端仓库fork [dolphinscheduler](https://github.com/apache/incubator-dolphinscheduler) 一份代码到自己的仓库中
2. 安装好MySQL/PostgreSQL,Zookeeper,Nginx,Hadoop(可选)
3. 把自己仓库clone到本地

    ` git clone https://github.com/apache/incubator-dolphinscheduler.git`
    
4. git clone项目后，进入目录，执行以下命令。
```
1. git branch -a    #查看分支
2. git checkout dev #切换到dev分支
3. git pull #同步分支
4. mvn -U clean package -Prelease -Dmaven.test.skip=true   #由于项目使用了gRPC，所以需要先编译项目生成需要的类。
```

#### 搭建后端
1. 创建ds数据库CREATE DATABASE dolphinscheduler。
2. 创建表和初始化数据：
  修改dao模块resource目录下application.properties文件中的数据库配置信息，然后执行org.apache.dolphinscheduler.dao.upgrade.shell.CreateDolphinScheduler的类，运行完，刷新数据库，表和数据都有了。
3. 启动MasterServer
 org.apache.dolphinscheduler.server.master.MasterServer类main函数增加如下代码：
   ```
   System.setProperty("spring.profiles.active","master");
   ```
   修改server模块resources目录下master_logback.xml文件，增加以下代码：

   ```
   <root level="INFO">
    <appender-ref ref="MASTERLOGFILE"/>
    <!-- 增加日志到控制台-->
    <appender-ref ref="STDOUT"/>
   </root>
   ```
   修改common模块，quartz.properties中数据库配置信息，zookeeper.properties中链接信息(zookeeper.quorum), 然后执行MasterServer即可。

4. 启动WorkerServer
 org.apache.dolphinscheduler.server.worker.WorkerServer类main函数增加如下代码：
   ```
   System.setProperty("spring.profiles.active","worker");
   ```
   修改server模块resources目录下worker_logback.xml文件，增加以下代码：
   ```
   <root level="INFO">
    <appender-ref ref="TASKLOGFILE"/>
    <appender-ref ref="WORKERLOGFILE"/>
    <!-- 增加日志到控制台-->
    <appender-ref ref="STDOUT"/>
   </root>
   ```
    然后执行MasterServer即可。


#### 搭建前端
进入dolphinscheduler-ui的目录，执行ui项目的编译，由于是webpack和vue，所以需要以下命令：
```
1. npm install    #没有npm的，mac用brew安装。brew install npm。
2. npm run build  #执行完build命令后，会生成dist文件夹，这个文件夹一定要和nginx配置文件的40行所指的目录相同。
```

保存以下内容到dolphinscheduler.conf文件：
```

#user  nobody;
worker_processes  1;

error_log  /usr/local/etc/nginx/logs/error.log;
error_log  /usr/local/etc/nginx/logs/error.log  notice;
error_log  /usr/local/etc/nginx/logs/error.log  info;

pid        /usr/local/etc/nginx/logs/nginx.pid;


events {
    worker_connections  1024;
}


http {
    include       mime.types;
    default_type  application/octet-stream;

    #log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
    #                  '$status $body_bytes_sent "$http_referer" '
    #                  '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /usr/local/etc/nginx/logs/access.log;

    sendfile        on;
    #tcp_nopush     on;

    #keepalive_timeout  0;
    keepalive_timeout  65;

    #gzip  on;
    server {
        listen       8888;# access port
        server_name  localhost;
        #charset koi8-r;
        access_log  /usr/local/etc/nginx/logs/host.access.log;
        location / {
            root   /xxx/xxx/incubator-dolphinscheduler/dolphinscheduler-ui/dist; #这里为ui目录，需要修改
            index  index.html index.html;
        }
        location /dolphinscheduler {
            proxy_pass http://localhost:12345; # interface address
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header x_real_ipP $remote_addr;
            proxy_set_header remote_addr $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_http_version 1.1;
            proxy_connect_timeout 300s;
            proxy_read_timeout 300s;
            proxy_send_timeout 300s;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection upgrade;
        }
        #error_page  404              /404.html;
        # redirect server error pages to the static page /50x.html
        #
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   /usr/share/nginx/html;
        }
    }
    include servers/*;
}

```
修改上面root指向，然后将文件放到nginx配置同级目录,使用以下命令，启动nginx。
```
./nginx -c dolphinscheduler.conf
```

启动ApiApplicationServer类：
org.apache.dolphinscheduler.api.ApiApplicationServer类main函数增加如下代码：
```
System.setProperty("spring.profiles.active", "api");
```
修改api模块resources目录下apiserver_logback.xml文件，增加以下代码：
   ```
   <root level="INFO">
    <appender-ref ref="APISERVERLOGFILE" />
    <!-- 增加日志到控制台-->
    <appender-ref ref="STDOUT"/>
   </root>
   ```
    执行ApiApplicationServer, 然后访问localhost:8888，账号admin/dolphinscheduler123。


#### 资源中心
  ds对于资源的存储在本地文件系统/HDFS/S3/minio中，HDFS的mac安装请参考:https://www.jianshu.com/p/935b4c5e4c25
hdfs下载:https://www.apache.org/dyn/closer.cgi/hadoop/common/hadoop-2.8.5/hadoop-2.8.5.tar.gz
安装好hdfs后，修改common.properties配置：
```
res.upload.startup.type=HDFS
```
修改hadoop.properties：
```
fs.defaultFS=hdfs://localhost:9000
```

然后重启ApiApplicationServer即可。


*`注意`：上传的文件大小，超过1M下，需要添加nginx参数
```
client_max_body_size    100m;
```





