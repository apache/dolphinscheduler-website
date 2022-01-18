# 用DolphinScheduler建立java项目的CI/CD工作流


### CI/CD 流程介绍

CI/CD中包含一系列步骤，来自动化我们开发阶段的软件交付过程，使其可以频繁地输送准确的代码。CI/CD 的核心概念是持续集成、持续交付和持续部署。作为一个面向开发和运营团队的解决方案，CI/CD 主要针对在集成新代码时所引发的问题。

这里的CI 指持续集成，这个过程是自动化的，以确保团队能够以可靠和可重复的方式构建、测试和打包他们的应用程序。 CI 有助于简化代码更改流程，从而增加开发人员进行更改和改进软件的时间。

CD 指持续交付/持续部署。持续交付代表将完成的代码自动交付到测试和开发等环境中。 CD 为将代码交付到这些环境提供了一种自动化且一致的方式。持续部署是持续交付的下一步。通过自动化测试的每个更改都会自动投入生产环境中，从而在生产环境下部署。

这个针对项目的CI/CD工作流主要有三个：打包(packaging)，回滚(roll back)，特性发布(feature release)。

打包阶段的主要内容是检查本地代码库是否为最新版本，后进行构建，测试，部署到模拟环境中。若打包顺利完成，本地会产生一个新的版本，并且可以在模拟环境中检查此新版本。

回滚的目的是显示已有的发布版本，调用其中一个选定的版本，将其部署到生产环境。特性发布的内容与回滚大体相似，但不同的是，在这个工作流中，显示已有的特性发布版本，再调用其中一个并部署到生产环境。

### 基于 DS 实现 CI/CD pipeline 实例

基于现有的ds功能，我们找到一个小型项目当作此次尝试的范例。被选中的项目[spring-boot-vuejs](https://github.com/jonashackt/spring-boot-vuejs) 具有前端和后端，可以较为直观的看到部署的结果，它的CI/CD流程也比较简明。这个实例中，我们采用的部署形式是本地部署/单机部署，不考虑到多台机器或者集群的影响。在为项目工作流配置完全局变量和本地变量后，便可以使其上线运行，完成的工作流如下。

##### Packaging
这个工作流共包含6个shell节点，用于CI/CD流程中的代码获取，构建，测试，打包，预发布（staging）。详见导出的[工作流文件](/img/cicd_workflow/feature_release.json)

![avatar](/img/cicd_workflow/7A715483-ABF1-44C1-AC6F-CDED1623CC07_4_5005_c.jpeg)

- 节点1: check repo
这个节点的目的是检查本地是否已经有最新的代码版本，分别通过git clone和git pull获取代码库和更新。环节的开始和结束，均会在日志中有提醒。

```sh
# Check Java version, Maven version and Git Branch
echo Show supporting info
java -version
mvn --version
# choose a local directory to store this project
# cd /opt/repo

echo Start of repo checkout/update
# Check if project's repo is under the chosen directory. 
# If available, pull the latest version, if not, clone
DIR="${project_folder}"
if [ -d "$DIR" ]; then
  ### Pull latest if $DIR exists ###
  echo "Pass: ${DIR} exist"
  cd $DIR
  git status
  git pull origin master
  echo spring-boot-vuejs
else
  ### Clone if $DIR does NOT exist ###
  echo "Error: ${DIR} not found. Clone repo"
  git clone https://github.com/jonashackt/spring-boot-vuejs
  cd spring-boot-vuejs
fi
echo End of repo checkout/update
```
如果节点运行成功，本地已存在目标代码库，此时可以执行git pull (前提保证本地更新已经提交) 。

![avatar](/img/cicd_workflow/6A1478C7-3824-47F5-9E48-5BC04FB20B3E.jpeg)

- 节点2: build with java8
这个节点基于项目使用java的maven框架，进行构建。因为此实例使用的java版本为8和16。以本地默认java版本java8执行命令。

```sh
pwd 
cd ${project_folder}

JAVA_HOME=${java8_path}
java -version
echo $JAVA_HOME

npm config set registry http://registry.npmjs.org   
mvn -B install --no-transfer-progress 
```
如果节点运行成功，日志中会出现“BUILD SUCCESS”，显示构建完成并且成功。

![avatar](/img/cicd_workflow/D48B0EAD-D0A0-40D3-AD19-0A19F83DD39E.jpeg)

- 节点3: test with java8
这个节点在同一个java版本下运行单元测试。

```sh
pwd 
cd ${project_folder}

mvn -B verify --no-transfer-progress 
```

如果节点运行成功，日志中会出现“BUILD SUCCESS”，显示测试成功。

![avatar](/img/cicd_workflow/CB12C170-A17C-4C1A-8078-2CC67B8BAB31.jpeg)

- 节点4: build with java16
这个节点基于项目使用java的maven框架，进行构建。因为已经用java8进行了构建，所以这里更换为java16后执行构建命令。

```sh
pwd 
cd ${project_folder}

java -version
echo $JAVA_HOME

JAVA_HOME=${java16_path}
export JAVA_HOME;
echo $JAVA_HOME

npm config set registry http://registry.npmjs.org   
mvn -B install --no-transfer-progress 
```

如果节点运行成功，日志中会出现”BUILD SUCCESS“，显示构建成功。

![avatar](/img/cicd_workflow/29CAB894-5281-4740-8E39-897E96571D6A.jpeg)

- 节点5: test with java16
这个节点在同一个java版本下运行单元测试。

```sh
pwd 
cd ${project_folder}

mvn -B verify --no-transfer-progress 
```
如果节点运行成功，日志中会出现”BUILD SUCCESS“，显示测试成功。

![avatar](/img/cicd_workflow/B5B15323-7379-4332-AEAC-7E70DBE2F924.jpeg)

- 节点6: staging
这个节点在项目预发布的模拟环境中部署，本地部署到端口 http://localhost:5000 。

```sh
pwd 
cd ${project_folder}

JAVA_HOME=${java8_path}
export JAVA_HOME;
echo $JAVA_HOME

echo START
nohup java -Djava.security.egd=file:/dev/./urandom -jar ./backend/target/backend-0.0.3-SNAPSHOT.jar --server.port=${staging_port} > buildres_staging.txt 2>&1 &
echo END
```

如果节点运行成功，因为使用nohup命令，部署至本地端口的命令在后台进行，日志中会出现“START”和“END”代表此命令的执行情况。日志显示如下

![avatar](/img/cicd_workflow/1989B620-63EC-45C8-B148-22CD5F2AB528.jpeg)

同时，因为staging_port变量在此处被设置为 localhost:5000 ，所以在本地也可以看到部署完成的页面如下

![avatar](/img/cicd_workflow/3AB6D6CE-CDB2-451E-9524-BF2224C947C0.jpeg)

##### Rollback
这个工作流共包含三个shell节点，用于完成项目版本回滚，也相当于CI/CD流程中的生产部署环节。详见导出的[工作流文件](/img/cicd_workflow/rollback.json)

![avatar](/img/cicd_workflow/12D3F0CE-18FE-4163-951A-4E0734A42EC2_4_5005_c.jpeg)

- 节点1: kill process on port
这个节点用于关闭要部署的端口的现有进程，为节点3作准备。

```sh
pwd
cd ${project_folder}

if [[ $(lsof -ti:${port_number} | wc -l) -gt 0 ]]; 
	then 
    	echo process found
        sudo kill -9 $(lsof -ti:${port_number}); 
    fi
```

如果节点运行成功，要检查的端口的确有进程，日志中会显示如下图“process found”，之后这些进程会被关闭。

![](/img/cicd_workflow/962BFAD9-5695-4369-B2D5-F4185C229CCB.jpeg)

- 节点2: display available version
这个节点用于展示本地所有可以被调用的发布版本。假定所有的发布版本都遵循命名格式backend-X.0.0-RELEASE.jar，那么所有包含关键字“RELEASE ”的版本都会被筛选并显示出来，供下一步使用。

```sh
pwd
cd ${project_folder}

# see previous releases
find /opt/repo/spring-boot-vuejs/backend/target -iname '*${keyword}*'
```

如果节点运行成功，本地所有发布版本都会被列举出来，以供选择调用。

![](/img/cicd_workflow/51656174-4F3A-4A73-94FA-7E12D5B6FF27.jpeg)

- 节点3: roll back
这个节点用于选定回滚的目标版本，并且本地部署到端口。部署成功则可以在本地8098端口显示页面。

```sh
pwd
cd ${project_folder}

JAVA_HOME=${java8_path}
export JAVA_HOME;
echo $JAVA_HOME

# fill in desired version to roll back to previous release
echo START
nohup java -Djava.security.egd=file:/dev/./urandom -jar ./backend/target/backend-1.0.0-RELEASE.jar --server.port=${port_number} > buildres_production.txt 2>&1 &
echo END
```
如果节点运行成功，部署至本地端口的nohup命令在后台进行，日志中出现“START”和“END”代表此命令的执行情况。日志显示如下

![](/img/cicd_workflow/902CAC66-44A6-457E-BF87-534010FE6585.jpeg)

同时，因为port_number变量在此处被设置为localhost：8098，所以在本地也可以看到部署完成的页面如下

![](/img/cicd_workflow/3AB6D6CE-CDB2-451E-9524-BF2224C947C0.jpeg)

##### Feature Release
这个工作流共包含三个shell节点，用于完成项目版本回滚，也相当于CI/CD流程中的生产部署环节。详见导出的[工作流文件](/img/cicd_workflow/feature_release.json)

![avatar](/img/cicd_workflow/5162B6A2-67C8-4EAD-BE7A-992D0AE90CD1_4_5005_c.jpeg)

- 节点1: kill process on port
这个节点用于关闭要部署的端口的现有进程，为节点3作准备。

```sh
pwd
cd ${project_folder}

if [[ $(lsof -ti:${port_number} | wc -l) -gt 0 ]]; 
	then 
    	echo process found
        sudo kill -9 $(lsof -ti:${port_number}); 
    fi
```

如果要检查的端口的确有进程，日志中会显示如下图“process found”，之后这些进程会被关闭。

![](/img/cicd_workflow/00282F58-D216-470A-A65D-90EE09C76DED.jpeg)

- 节点2: display available version
这个节点用于展示本地所有可以被调用的特性发布版本。假定所有的特性发布版本都遵循命名格式backend-0.0.1-SNAPSHOT.jar，那么所有包含关键字“SNAPSHOT”的版本都会被筛选并显示出来，供下一步使用。

```sh
pwd
cd ${project_folder}

# see previous releases
find /opt/repo/spring-boot-vuejs/backend/target -iname '*${keyword}*'
```

如果节点运行成功，本地所有特性发布版本都会被列举出来，以供选择调用。

![](/img/cicd_workflow/F595066F-EE0B-4086-AD92-5BAF081792F9.jpeg)

- 节点3: release
这个节点用于选定特性发布的目标版本，并且本地部署到端口。部署成功则可以在本地8098端口显示页面。

```sh
pwd
cd ${project_folder}

JAVA_HOME=${java8_path}
export JAVA_HOME;
echo $JAVA_HOME

# fill in desired version to roll back to previous release
echo START
nohup java -Djava.security.egd=file:/dev/./urandom -jar ./backend/target/backend-0.0.3-SNAPSHOT.jar --server.port=${port_number} > buildres_production.txt 2>&1 &
echo END
```
如果节点运行成功，部署至本地端口的nohup命令在后台进行，日志中出现“START”和“END”代表此命令的执行情况。日志显示如下

![](/img/cicd_workflow/BFE0DB23-148B-4D0E-8C4D-C7DB51570593.jpeg)

同时，因为port_number变量在此处被设置为 localhost:8098，所以在本地也可以看到部署完成的页面如下

![](/img/cicd_workflow/3AB6D6CE-CDB2-451E-9524-BF2224C947C0.jpeg)

### 使用DS构建工作流不足之处

##### 项目中觉得使用ds来构建ci/cd 工作流不方便的地方：
目前DS没有对于工作流或者节点的版本管理，例如不能给一个工作流的当前版本take snapshot，以便后续需要时使用。现在需要通过GitHub、Gitlab或者其他版本管理平台，才能完成例如将单个节点回滚到历史版本的任务。如果用户从DAG中删除一个节点或节点中的任务，并重新部署它，那么与该任务相关的元数据(metadata)就会失去。

在单机部署时，工作流中所有节点并不处在同一个独立的虚拟环境里。每个节点都指向一个/tmp/dolphinscheduler/exec/process/下的不同路径，如果需要获取之前节点的信息，需要指定一个文件夹存储项目的源代码，每次进入文件夹来获取代码。但这也可以通过设置全局变量来解决。

##### 与现有的CI/CD工具相比
对于***本地部署***的ds来说，虚拟环境完全依赖本机的环境。例如在这次的工作流中，需要提前在本地设置好需要的java版本和maven 版本，虚拟环境中的相应命令才能执行。然而在Github Actions中，运行工作流的环境可以通过yaml文件内的设置，直接拉取对应的Docker image镜像而生成，独立于本地环境。

与Github Actions相比，ds需要手动上线和启动CI/CD工作流，不能用类似on：[push] 这种GitHub event作为触发机制。

