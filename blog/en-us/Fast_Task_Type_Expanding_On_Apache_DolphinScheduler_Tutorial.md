---
title:Fast Task Type Expanding On Apache DolphinScheduler | Tutorial
keywords: Apache,DolphinScheduler,scheduler,big data,ETL,airflow,hadoop,orchestration,dataops,Meetup
description:At present, the scheduler plays an indispensable role in big data ecology.
---
# Fast Task Type Expanding On Apache DolphinScheduler | Tutorial

<div align=center>

<img src="/img/2022-03-29/En/1.png"/>

</div>

## Background

At present, the scheduler plays an indispensable role in big data ecology. The Apache DolphinScheduler, a top-tier Apache project, is one of the most stable and easy-to-use scheduling systems. With scheduling, distribution, high availability, and ease of use in place, it is only natural that users will want to quickly, easily, and concisely expand the Apache Dolphinscheduler task types as their business grows or as more components are used for various needs. This article shows you how to expand an Apache DolphinScheduler Task easily and quickly.

## Author Bio

<div align=center>

<img src="/img/2022-03-29/En/2.png"/>

</div>

Baiqiang Zhang

Baiqiang Zhang is a big data development engineer, who is interested in researching real-time computing, metadata governance, and big data basic components.

## 1 What is SPI?

SPI (Service Provider Interface) is a service delivery discovery mechanism built into the JDK. Most people will probably rarely use it, as it is positioned primarily for development vendors, and is described in more detail in the java.util.ServiceLoader files. The abstract concept of SPI refers to the dynamic loading of service implementation.

## 2 Why did we introduce SPI?

Different enterprises may have their components that need to be executed by tasks, for example, enterprises use Hive, the most commonly used tool in the big data ecosystem, in different ways. Some enterprises execute tasks through HiveServer2, and some use HiveClient to execute tasks. Considering the out-of-the-box Task provided by Apache DolphinScheduler does not support HiveClient’s Task, so most users will execute through the Shell. However, a Shell doesn’t work well compared with a TaskTemplate. So, Apache DolphinScheduler supports TaskSPI to enable users to better customize different Tasks according to their business needs.

First of all, we need to understand the history of the Task iteration of Apache DolphinScheduler. In DS 1.3.x, expanding a Task required recompiling the whole Apache DolphinScheduler, which was heavily coupled, so in Apache DolphinScheduler 2.0.x, we introduced SPI. As we mentioned earlier, the essence of SPI is to dynamically load the implementation of a service, so let’s make it more concrete and consider the Task of Apache DolphinScheduler as an execution service, and we need to execute different services according to the user’s choice. If there is no service, we need to expand it ourselves. Compared to 1.3.x we only need to complete our Task implementation logic, then follow the SPI rules, compile it into a Jar and upload it to the specified directory, and use our own written Task.

## 3 Who is using it?

**a. Apache DolphinScheduler**

i. task

ii. datasource

**b. Apache Flink**

i. Flink sql connector, after the user has implemented a flink-connector, Flink is also dynamically loaded via SPI

**c. Spring boot**

i. spring boot spi

**d. Jdbc**

i. Before jdbc4.0, developers need to load the driver based on Class by forName(“xxx”), jdbc4 also based on the spi mechanism to discover the driver provider, you can expose the driver provider by specifying the implementation class in the META-INF/services/java. sql. Driver file

**e. More**

* **dubbo**
* **common-logging**
* **……**
## 4 What’s the Apache DolphinScheduler SPI Process?

<div align=center>

<img src="/img/2022-03-29/En/3.png"/>

</div>

*Note: SPI Rules*

*When compiling the specific implementation of the service into a JAR, we need to create the META-INF/services/ folder in the dir of the resource, and then create a fully qualified class name with the file name of the service, which is the fully qualified class name of the integrated interface. The content inside is the fully qualified class name of the implementing class.*

To explain the above diagram, I have divided Apache DolphinScheduler into logical tasks and physical tasks, logical tasks refer to DependTask, SwitchTask, and physical tasks refer to ShellTask, SQLTask, which are the Task for executing tasks. In Apache DolphinScheduler, we generally expand the physical tasks, which are handed over to the Worker to execute, so what we need to understand is that when we have more than one Worker, we have to distribute the custom task to each machine with Worker, and when we start the worker service, the worker will start a ClassLoader to load the corresponding task lib that implements the rules. Note that HiveClient and SeatunnelTasks are user-defined, but only HiveTasks are loaded by Apache DolphinScheduler TaskPluginManage. The reason is that SeatunnelTask does not follow SPI rules. The SPI rules are also described on the diagram, or you can refer to the class java.util.ServiceLoader, which has a simple reference below (part of the code is extracted):

```plain
public final class ServiceLoader<S> implements Iterable<S> {
    //scanning dir prefix
    private static final String PREFIX = "META-INF/services/";
    //The class or interface representing the service being loaded
    private final Class<S> service;
    //The class loader used to locate, load, and instantiate providers
    private final ClassLoader loader;
    //Private inner class implementing fully-lazy provider lookup
    private class LazyIterator implements Iterator<S> {
        Class<S> service;
        ClassLoader loader;
        Enumeration<URL> configs = null;
        String nextName = null;
        //......
        private boolean hasNextService() {
            if (configs == null) {
                try {
                    //get dir all class
                    String fullName = PREFIX + service.getName();
                    if (loader == null)
                        configs = ClassLoader.getSystemResources(fullName);
                    else
                        configs = loader.getResources(fullName);
                } catch (IOException x) {
                    //......
                }
                //......
            }
        }
    }
}
```
## 5 How to extend a data source Task or DataSource ?

### 5.1 Creating a Maven project

```plain
mvn archetype:generate \
    -DarchetypeGroupId=org.apache.dolphinscheduler \
    -DarchetypeArtifactId=dolphinscheduler-hive-client-task \
    -DarchetypeVersion=1.10.0 \
    -DgroupId=org.apache.dolphinscheduler \
    -DartifactId=dolphinscheduler-hive-client-task \
    -Dversion=0.1 \
    -Dpackage=org.apache.dolphinscheduler \
    -DinteractiveMode=false
```
### 5.2 Maven dependencies

```plain
<! --dolphinscheduler spi basic core denpendence -->
 <dependency>
     <groupId>org.apache.dolphinscheduler</groupId>
     <artifactId>dolphinscheduler-spi</artifactId>
     <version>${dolphinscheduler.lib.version}</version
     <scope>${common.lib.scope}</scope>
 </dependency
 <dependency>
     <groupId>org.apache.dolphinscheduler</groupId>
     <artifactId>dolphinscheduler-task-api</artifactId>
     <version>${dolphinscheduler.lib.version}</version
     <scope>${common.lib.scope}</scope>
 </dependency
```
### 5.3 Creating a TaskChannelFactory

First, we need to create the factory for the task service, which mainly targets to help build the TaskChannel and TaskPlugin parameters, and to give the unique identity of the task. The ChannelFactory connects the Task service group of Apache DolphinScheduler, and helps the front and back end interaction to build the TaskChannel.

```plain
package org.apache.dolphinscheduler.plugin.task.hive;
import org.apache.dolphinscheduler.spi.params.base.PluginParams;
import org.apache.dolphinscheduler.spi.task.TaskChannel;
import org.apache.dolphinscheduler.spi.task.TaskChannelFactory;
import java.util.List;
public class HiveClientTaskChannelFactory implements TaskChannelFactory {
    /**
     * Create a task channel and execute tasks based on it
     * @return Task Channel
     */
    @Override
    public TaskChannel create() {
        return new HiveClientTaskChannel();
    }
    /**
     * Returns the globally unique identifier of the current task
     * @return Task type name
     */
    @Override
    public String getName() {
        return "HIVE CLIENT";
    }
    /**
     * The front-end pages need to be rendered, mainly into
     
     * @return
     */
    @Override
    public List<PluginParams> getParams() {
        List<PluginParams> pluginParams = new ArrayList<>();
        InputParam nodeName = InputParam.newBuilder("name", "$t('Node name')")
                .addValidate(Validate.newBuilder()
                        .setRequired(true)
                        .build())
                .build();
        PluginParams runFlag = RadioParam.newBuilder("runFlag", "RUN_FLAG")
                .addParamsOptions(new ParamsOptions("NORMAL", "NORMAL", false))
                .addParamsOptions(new ParamsOptions("FORBIDDEN", "FORBIDDEN", false))
                .build();
        PluginParams build = CheckboxParam.newBuilder("Hive SQL", "Test HiveSQL")
                .setDisplay(true)
                .setValue("-- author: \n --desc:")
                .build();
        pluginParams.add(nodeName);
        pluginParams.add(runFlag);
        pluginParams.add(build);
        return pluginParams;
    }
}
```
### 5.4 Creating a TaskChannel

After we have a factory, we will create a TaskChannel based on it. The TaskChannel contains two methods, canceling and creating, currently, we only need to focus on creating tasks.

```plain
void cancelApplication(boolean status);
    /**
     * Build executable tasks
     */
    AbstractTask createTask(TaskRequest taskRequest);
public class HiveClientTaskChannel implements TaskChannel {
    @Override
    public void cancelApplication(boolean b) {
        //do nothing
    }
    @Override
    public AbstractTask createTask(TaskRequest taskRequest) {
        return new HiveClientTask(taskRequest);
    }
}
```
### 5.5 Building a Task Implementation

With TaskChannel we get the physical task that can be executed, but we need to add the corresponding implementation to the current task to allow Apache DolphinScheduler to execute your task.

We can see from the above figure that the tasks based on Yarn execution will inherit AbstractYarnTask, and those that do not need to be executed by Yarn will directly inherit AbstractTaskExecutor, which mainly contains an AppID, and CanalApplication setMainJar. As you can see above, our HiveClient needs to inherit AbstractYarnTask, and before building the task, we need to build the parameters object that fits the HiveClient to deserialize the JsonParam.

```plain
package org.apache.dolphinscheduler.plugin.task.hive;
import org.apache.dolphinscheduler.spi.task.AbstractParameters;
import org.apache.dolphinscheduler.spi.task.ResourceInfo;
import java.util.List;
public class HiveClientParameters extends AbstractParameters {
    /**
     * The easiest way to execute with HiveClient is to just paste in all the SQL, so we only need one SQL parameter
     */
    private String sql;
    public String getSql() {
        return sql;
    }
    public void setSql(String sql) {
        this.sql = sql;
    }
    @Override
    public boolean checkParameters() {
        return sql ! = null;
    }
    @Override
    public List<ResourceInfo> getResourceFilesList() {
        return null;
    }
}
```
After implementing the parameters object, let’s implement the Task. The implementation in the example is relatively simple, which is to write the user’s parameters to a file and execute the task via Hive -f.
```plain
package org.apache.dolphinscheduler.plugin.task.hive;
import org.apache.dolphinscheduler.plugin.task.api.AbstractYarnTask;
import org.apache.dolphinscheduler.spi.task.AbstractParameters;
import org.apache.dolphinscheduler.spi.task.request.TaskRequest;
import org.apache.dolphinscheduler.spi.utils.JSONUtils;
import java.io;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file;
import java.nio.file.Path;
import java.nio.file.Paths;
public class HiveClientTask extends AbstractYarnTask {
    /**
     * hive client parameters
     */
    private HiveClientParameters hiveClientParameters;
    /**
     * taskExecutionContext
     */
    private final TaskRequest taskExecutionContext;
    public HiveClientTask(TaskRequest taskRequest) {
        super(taskRequest);
        this.taskExecutionContext = taskRequest;
    }
    /**
     * task init method
     */
    @Override
    public void init() {
        logger.info("hive client task param is {}", JSONUtils.toJsonString(taskExecutionContext));
        this.hiveClientParameters = JSONUtils.parseObject(taskExecutionContext.getTaskParams(), HiveClientParameters.class);
        if (this.hiveClientParameters ! = null && !hiveClientParameters.checkParameters()) {
            throw new RuntimeException("hive client task params is not valid");
        }
    }
    /**
     * build task execution command
     *
     * @return task execution command or null
     */
    @Override
    protected String buildCommand() {
        String filePath = getFilePath();
        if (writeExecutionContentToFile(filePath)) {
            return "hive -f " + filePath;
        }
        return null;
    }
    /**
     * get hive sql write path
     *
     * @return file write path
     */
    private String getFilePath() {
        return String.format("%s/hive-%s-%s.sql", this.taskExecutionContext.getExecutePath(), this.taskExecutionContext.getTaskName(), this. taskExecutionContext.getTaskInstanceId());
    }
    @Override
    protected void setMainJarName() {
        //do nothing
    }
    /**
     * write hive sql to filepath
     *
     * @param filePath file path
     * @return write success?
     */
    private boolean writeExecutionContentToFile(String filePath) {
        Path path = Paths.get(filePath);
        try (BufferedWriter writer = Files.newBufferedWriter(path, StandardCharsets.UTF_8)) {
            writer.write(this.hiveClientParameters.getSql());
            logger.info("file:" + filePath + "write success.");
            return true;
        } catch (IOException e) {
            logger.error("file:" + filePath + "write failed. please path auth.");
            e.printStackTrace();
            return false;
        }
    }
    @Override
    public AbstractParameters getParameters() {
        return this.hiveClientParameters;
    }
}
```
### 5.6 Compliance with SPI Rules

```plain
# 1,Create META-INF/services folder under Resource, create the file with the same full class name of the interface
zhang@xiaozhang resources % tree . /
. /
└── META-INF
    └── services
        └─ org.apache.dolphinscheduler.spi.task.TaskChannelFactory
# 2, write the fully qualified class name of the implemented class in the file
zhang@xiaozhang resources % more META-INF/services/org.apache.dolphinscheduler.spi.task.TaskChannelFactory 
org.apache.dolphinscheduler.plugin.task.hive.HiveClientTaskChannelFactory
```
### 5.7 Packaging and Deployment

```plain
## 1,Packing
mvn clean install
## 2, Deployment
cp . /target/dolphinscheduler-task-hiveclient-1.0.jar $DOLPHINSCHEDULER_HOME/lib/
## 3,restart dolphinscheduler server
```
After the above operation, we check the worker log tail -200f $Apache DolphinScheduler_HOME/log/Apache DolphinScheduler-worker.log.
That’s all~ The front-end modifications involved above can be found in Apache DolphinScheduler-ui/src/js/conf/home/pages/dag/_source/formModel/

## Join the Community

There are many ways to participate and contribute to the DolphinScheduler community, including:

**Documents, translation, Q&A, tests, codes, articles, keynote speeches, etc.**

We assume the first PR (document, code) to contribute to be simple and should be used to familiarize yourself with the submission process and community collaboration style.

So the community has compiled the following list of issues suitable for novices: [https://github.com/apache/dolphinscheduler/issues/5689](https://github.com/apache/dolphinscheduler/issues/5689)

List of non-newbie issues: [https://github.com/apache/dolphinscheduler/issues?q=is%3Aopen+is%3Aissue+label%3A%22volunteer+wanted%22](https://github.com/apache/dolphinscheduler/issues?q=is%3Aopen+is%3Aissue+label%3A%22volunteer+wanted%22)

How to participate in the contribution:  https://dolphinscheduler.apache.org/en-us/docs/dev/user_doc/contribute/join/review.html

**GitHub Code Repository:** [https://github.com/apache/dolphinscheduler](https://github.com/apache/dolphinscheduler)

**Official Website**：[https://dolphinscheduler.apache.org/](https://dolphinscheduler.apache.org/)

**MailList**：dev@dolphinscheduler@apache.org

**Twitter**：@DolphinSchedule

**YouTube：**[https://www.youtube.com/channel/UCmrPmeE7dVqo8DYhSLHa0vA](https://www.youtube.com/channel/UCmrPmeE7dVqo8DYhSLHa0vA)

**Slack：**[https://s.apache.org/dolphinscheduler-slack](https://s.apache.org/dolphinscheduler-slack)

**Contributor Guide：**[https://dolphinscheduler.apache.org/en-us/community/community.html](https://dolphinscheduler.apache.org/en-us/community/community.html)

Your Star for the project is important, don’t hesitate to lighten a Star for Apache DolphinScheduler ❤️

