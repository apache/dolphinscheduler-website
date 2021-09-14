注意：仅供单机开发调试使用，默认使用H2 Database,Zookeeper Testing Server。

如需测试插件，可自行修改StandaloneServer中plugin.bind，亦或修改配置文件。具体请查看插件说明。
#### 1.下载源码

GitHub ：https://github.com/apache/dolphinscheduler

```shell
mkdir dolphinscheduler
cd dolphinscheduler
git clone git@github.com:apache/dolphinscheduler.git
```
这里选用 dev 分支。

#### 2: 启动后端
```
mvn install -DskipTests
```
直接启动org.apache.dolphinscheduler.server.StandaloneServer即可

#### 3: 搭建前端环境

    1.   #### 安装 node

        1.   安装 nvm
             curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash
        2.   刷新环境变量
             source ~/.bash_profile
        3.   安装 node
             nvm install v12.20.2 备注: Mac 用户还可以通过 brew 安装 npm: brew install npm
        4.   验证 node 安装成功
             node --version

    2.   进入 dolphinscheduler-ui，运行

         ```shell
         npm install
         npm run start
         ```

    3.   访问 [http://localhost:8888](http://localhost:8888/)

    4.   登录管理员账号

         >    用户：admin
         >
         >    密码：dolphinscheduler123



