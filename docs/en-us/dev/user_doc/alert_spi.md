### DolphinScheduler Alert SPI main design

#### DolphinScheduler SPI Design

The architecture of microkernel & plug-in of DolphinScheduler is changing. All core capabilities such as tasks, resource storage, registry, etc. will be designed to be extensions, and we want to improve the flexibility as well as the friendliness (extensibility) of DolphinScheduler itself through SPI.

You can read the relevant code under the dolphinscheduler-spi module as a reference. The extended interface of the associated plug-in is under the module, and when we need to implement the relevant function plug-in, it is recommended to read this code block first. Of course, you are welcomed to read the documentation, which will save a lot less time. However, the documentation has a certain lag and when it is missing, it is suggested to take the source code as the reference (If you are interested, we also welcome you to submit relevant documents).  In addition, we rarely change the extension (excluding additions) to the extension interface, except for major architectural changes where there is an incompatible upgrade version. Hence, the existing documentation is generally adequate.

When you need to extend, you actually only need to focus on the extension interface. For example, for the alert service you only need to focus on the AlertChannelFactory and the AlertChannel. The underlying logic is already implemented by DolphinScheduler, which makes our development much more focused and simpler.

By the way, we use an excellent front-end component, form-create, which supports the generation of front-end ui components based on json. If plugin development involves a front-end, we will use json to generate the relevant front-end UI components. The parameters of the plugin are wrapped in org.apache.dolphinscheduler.spi.params, which converts all the relevant parameters into json, meaning that you can draw the front-end components (mainly forms here, we only care about the data of front and back-end interaction) in Java code.

This article focuses on the design and development of Alert alerts.

#### Main Modules

If you don't care about its internal design, and just want to know how to develop your own alarm plugin, you can skip this section.

* dolphinscheduler-spi

     This module is the core SPI module and provides the basic SPI relevant behaviour,where dolphinschedulerplugin is the plugin top-layer interface, all DolphinsCheduler's plugins must implement the interface, and the module also provides some universal tool classes (if you can detach it again Some will something will be better? For example, the UI, we currently use the parameter part) and some UI related basic information.

* dolphinscheduler-alert

     In this module, we have implemented the load of the associated plugin when the Alert-Server starts. Alert provides a variety of plug-in configuration methods that can be enabled by simple configurations after you have done the development. The configuration file is located at dolphinscheduler-alert/src/main/resources/alert.properties .

     It provides two methods of configuration.

     1: Configure the jar directory specified by the plugin, eg: alert.plugin.dir=/root/dolphinscheduler/lib/plugin/alert . When alert-server starts, it will load the jar of the relevant plugin from the specified directory.

     2: IDE development mode

     You can use this configuration when you are in the debugging phase of development, see [dolphinscheduler-maven-plugin](https://github.com/apache/incubator-dolphinscheduler-maven-plugin) for design principles.

     

 * Packaging plugins

 We use provisio, an excellent packaging tool, for packaging plugins. Please add it to dolphinscheduler-dist/src/main/provisio/dolphinscheduler.xml, and it will package plugins to the specified directory when processed.



#### Alert SPI Main class information.

AlertChannelFactory
All alert plugins need to implement this interface. The interface is used to define the name of the alert plugin and the required parameters.

AlertChannel
The interface of the alarm plug-in. The alarm plugin needs to implement the interface. It only has one method process. The upper alarm system calls the method and gets the return information of the alert by the AlertResult retured by this method.

AlertData
Alert content information. It includes id, title, content and log. 

AlertInfo
Alarm-related information. When the upper system calls the alarm plug-in instance, the instance of this class is incorporated into the specific alarm plugin through the Process method. It contains the parameter information filled in the front end of the alarm content AlertData and the called alarm plugin instance.

AlertResult
The alert plugin sends an alert return message.

org.apache.dolphinscheduler.spi.params 
This package contains the plug-in parameter definitions. We use alpacajs, a front-end library http://www.form-create.com, which dynamically generates the front-end ui based on the parameter list json returned by the plug-in definition, so we don't need to care about the front-end when doing SPI plug-in development.

Inside this package we currently only wrap RadioParam, TextParam and PasswordParam, which are used to define parameters of text, radio and password respectively.

AbsPluginParams 

This class is the base class for all parameters and is inherited by the RadioParam classes. Each DS alert plugin returns a list of AbsPluginParams in the AlertChannelFactory implementation.

The specific design of alert_spi can be found in issue: [Alert Plugin Design](https://github.com/apache/incubator-dolphinscheduler/issues/3049)

#### Alert SPI built-in implementation

* Email

     Email alert notification

* DingTalk

     Alert for DingTalk group chat bots

* EnterpriseWeChat

     EnterpriseWeChat alert notifications

     Related parameter configuration can refer to the EnterpriseWeChat robot document.

* Script

     We have implemented a shell script for alerting. We will pass the relevant alert parameters to the script and you can implement your alert logic in the shell. This is a good way to interface with internal alerting applications.

* SMS

     SMS alerts

#### Alarm Custom Plugin Development

In fact, it's very easy to implement a plugin by yourself, you only need to care about the plugin extension interface. In Alert you only need to care about the AlertChannelFactory and AlertChannel. We would recommend that you follow the design specifications of other built-in plugins so that when your idea is good enough, you can donate it to the community without having to change it too much.

When you have finished developing the relevant code, configure the relevant plug-ins in alert.properties (or just configure a plug-in directory and it will load all the plug-ins in that directory).


Then, you can happily start using your own plugins.

In fact, custom plug-in development is as easy as we described, and not as difficult as you imagined.
