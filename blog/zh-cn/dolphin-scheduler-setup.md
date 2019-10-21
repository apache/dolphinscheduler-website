#### 准备工作
1. fork [dolphinscheduler](https://github.com/apache/incubator-dolphinscheduler)
2. git clone xxx，
3. 安装好MySQL,Zookeeper,Nginx，Hadoop(可选)。
4. git clone项目后，进入目录，执行以下命令。
```
1. git branch -a    #查看分支
2. git checkout dev-db #切换到dev-db分支
3. git pull #同步分支
4. mvn -U clean package assembly:assembly -Dmaven.test.skip=true   #编译项目。由于项目前端的日志模块，使用了gRPC调用后端，所以需要先编译项目。
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
1. npm install.   #没有npm的，mac用brew安装一个。brew install npm。
2. npm run build. #执行完build命令后，会生成dist文件夹，这个文件夹一定要和nginx配置文件的40行所指的目录相同。
```

保存一下内容到dolphinscheduler.conf文件：
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
        root   /Users/momo/tboy/workspace_github/incubator-dolphinscheduler/dolphinscheduler-ui/dist; # static file directory
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


    # another virtual host using mix of IP-, name-, and port-based configuration
    #
    #server {
    #    listen       8000;
    #    listen       somename:8080;
    #    server_name  somename  alias  another.alias;

    #    location / {
    #        root   html;
    #        index  index.html index.htm;
    #    }
    #}


    # HTTPS server
    #
    #server {
    #    listen       443 ssl;
    #    server_name  localhost;

    #    ssl_certificate      cert.pem;
    #    ssl_certificate_key  cert.key;

    #    ssl_session_cache    shared:SSL:1m;
    #    ssl_session_timeout  5m;

    #    ssl_ciphers  HIGH:!aNULL:!MD5;
    #    ssl_prefer_server_ciphers  on;

    #    location / {
    #        root   html;
    #        index  index.html index.htm;
    #    }
    #}
    include servers/*;
}

```
使用以下命令，启动nginx。
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
  ds对于资源的存储在HDSF/S3中，HDFS的mac安装请参考:https://www.jianshu.com/p/935b4c5e4c25
mac的hdfs请下载:https://www.apache.org/dyn/closer.cgi/hadoop/common/hadoop-2.8.5/hadoop-2.8.5.tar.gz
安装好hdfs后，修改common.properties配置：
```
res.upload.startup.type=HDSF
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

## DS中概念解释
#### 安全中心
1. 租户管理
 -   作用：对应Linux的用户，当Linux没有对应用户时，将创建用户用于worker执行任务。
 -   创建：需要注意，创建租户时，【租户编码】为对应的Linux用户。
2. 用户管理
 -   作用：创建不同的用户，赋予不同的模块权限。
 -   创建：新建的用户都为普通用户，需要设置租户，队列，邮件和手机。其中，邮件和手机为告警时使用。 
 -   更新：当更新用户的租户时，相应的资源文件也会更新到新的租户下。
3. 告警组管理
 -   作用：创建不同的告警组，添加不同的组员。根据任务运行时的告警配置，当任务执行成功或失败等状态时，进行相应的告警。
4. 队列管理
 -   作用：创建Spark，MapReduce，Flink需要用到队列。
 -   创建：队列的创建，必须名称和值都唯一才可以。
5. Worker分组管理
 -   作用：任务只被组内所指定的worker执行。当新建任务时，选择的【Worker分组】为【Default】时，任务可在任何一台worker上执行。
6. 令牌管理
 -   作用：访问后端接口，可以使用系统令牌。
 -   使用方式：
```
HttpPost httpPost = new HttpPost("http://127.0.0.1:12345/escheduler/projects/create");
httpPost.setHeader("token", "123");
```




