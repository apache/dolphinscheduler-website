Note: Only for standalone development debugging use. The default option is H2 Database and Zookeeper Testing Server.
For testing the plugin, you can modify the plugin.bind in StandaloneServer or modify the configuration file. Please check the plugin description for details.

#### 1. Download the source Code

GitHub ：https://github.com/apache/dolphinscheduler

```shell
mkdir dolphinscheduler
cd dolphinscheduler
git clone git@github.com:apache/dolphinscheduler.git
```

We use the dev branch here.

#### 2. Start backend

```shell
mvn -U install package -Prelease -Dmaven.test.skip=true
```

Just start org.apache.dolphinscheduler.server.StandaloneServer directly.

#### 3. Set up the front-end

##### i. Install node

######  a. Install nvm

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash

######  b. Refresh the environment variables

 source ~/.bash_profile

######  c. Install node

 nvm install v12.20.2

note: Mac users could install npm through brew: brew install npm

###### d. Validate the node installation

 node --version

##### ii. cd dolphinscheduler-ui and run the following commands:

```shell
npm install
npm run start
```

##### iii. Visit [http://localhost:8888](http://localhost:8888/)

##### iv. Sign in with the administrator account

>    username: admin
>
>    password: dolphinscheduler123
