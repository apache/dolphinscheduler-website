### DolphinScheduler Alert SPI main design

#### DolphinScheduler SPI Design

DolphinScheduler is in the middle of a microkernel + plug-in architecture change. All core capabilities such as tasks, resource storage, registry etc. will be designed to be extensions, and we want to improve the flexibility as well as the friendliness (extensibility) of DolphinScheduler itself through SPI.

You can read the relevant code under the dolphinscheduler-spi module as a reference. The extended interface of the associated plug-in is under the module, and when we need to implement the relevant function plug-in, it is recommended to read this block first. Of course, you are advised to read the documentation, which will take a lot less time.  However, the documentation has a certain lag and when it is missing, it is suggested that the source code prevails (If you are interested, we also welcome you to submit relevant documents).  In addition, we make few changes (excluding additions) to the extension interface, except for major architectural changes where there is an incompatible upgrade version, so existing documentation is generally adequate.

When you need to extend, you actually only need to focus on the extension interface. For example, for the alert service you only need to focus on the AlertChannelFactory and the AlertChannel. The underlying logic is already implemented by DolphinScheduler, which makes our development much more focused and simple.

By the way, we use an excellent front-end component, form-create, which supports the generating of front-end ui components based on json. If plugin development involves a front-end, we will use json to generate the relevant front-end UI components. The parameters of the plugin are wrapped in org.apache.dolphinscheduler.spi.params, which converts all the relevant parameters into json, meaning that you can draw the front-end components (mainly forms here, we only care about the data for front and back-end interaction) in Java code.

This article focuses on the design and development of Alert alerts.

#### Main Modules

If you don't care about its internal design, just want to know how to develop your own alarm plugin, you can skip this section.

* dolphinscheduler-spi

     This module is the core SPI module and provides the basic SPI relevant behaviour,where dolphinschedulerplugin is the plugin top layer interface, all DolphinsCheduler's plugins must implement the interface, and the module also provides some universal tool classes (if you can detach it again Some will something will be better? For example, the UI, we currently use the parameter this block) and some UI related basic information.

* dolphinscheduler-alert

     In this module, we have implemented the load of the associated plugin when the Alert-Server starts. Alert provides a variety of plug-in configuration methods that can be enabled by simple configurations after you have done a job. The configuration file is located at dolphinscheduler-alert/src/main/resources/alert.properties .

     It provides two methods of configuration.

     1: Configure the jar directory specified by the plugin, eg: alert.plugin.dir=/root/dolphinscheduler/lib/plugin/alert . When alert-server starts, it will load the jar of the relevant plugin from the specified directory.

     2: IDE development mode

     You can use this configuration when you are in the debugging phase of development, see [dolphinscheduler-maven-plugin](https://github.com/apache/incubator-dolphinscheduler-maven-plugin) for design principles.

     

 * 3: Packaging plugins

  For plugin packaging we use [provisio](https://github.com/jvanzyl/provisio), which is an excellent packaging tool that you need to add to dolphinscheduler-dist/src/main/provisio/ after you have finished developing the plugin. dolphinscheduler.xml, which will package the plugin to the specified directory when it is executed.



#### Alert SPI Main class information.

AlertChannelFactory
AlertChannelFactory, all alert plugins need to implement this interface, the interface is used to define the name of the alert plugin, the required parameters, the create method is used to create a specific instance of the alert plugin.

AlertChannel
The interface of the alarm plug-in, the alarm plugin needs to implement the interface, only one method process, the upper alarm system calls the method and returned by the AlertResult to get the return information of the alert.

AlertData
Alert content information, including id, title, content, log.

AlertInfo
Alarm related information, when the upper system calls the alarm plug-in instance, the instance of this class is incorporated into the specific alarm plugin through the Process method. The internal contains the parameter information filled in the front end of the alarm content AlertData and the called alarm plugin instance.

AlertResult
The alert plugin sends an alert return message.

org.apache.dolphinscheduler.spi.params 
This package contains the plug-in parameter definitions. We use alpacajs, a front-end library http://www.form-create.com, which dynamically generates the front-end ui based on the parameter list json returned by the plug-in definition, so we don't need to care about the front-end when doing SPI plug-in development.

Under this package we currently only have RadioParam, TextParam and PasswordParam, which are used to define parameters of text, radio and password respectively.

AbsPluginParams This class is the base class for all parameters and is inherited by the RadioParam classes. Each DS alert plugin returns a list of AbsPluginParams in the AlertChannelFactory implementation.

The design of alert_spi can be found in issue: [Alert Plugin Design](https://github.com/apache/incubator-dolphinscheduler/issues/3049)

#### Alert SPI built-in implementation

* Email

     Email alert notification

* DingTalk

     Alert for DingTalk group chat bots

* EnterpriseWeChat

     EnterpriseWeChat alert notifications

     Related parameter configuration can refer to the EnterpriseWeChat robot document.

* Script

     We have implemented a shell script for alerting, we will pass the relevant alert parameters to the script and you can implement your alert logic in the shell, this is a good way to interface with internal alerting applications.

* SMS

     SMS alerts

#### Alarm Custom Plugin Development

In fact, it's very easy to implement a plugin  by yourself, you only need to care about the plugin extension interface, in Alert you only need to care about the AlertChannelFactory and AlertChannel. We would recommend that you follow the design specifications of other built-in plugins so that when your idea is good enough, you can donate it to the community without having to change it too much.

When you have finished developing the relevant code, configure the relevant plug-ins in alert.properties (or just configure a plug-in directory and it will load all the plug-ins in that directory).


Then, you can happily start using your own plugins.

In fact, custom plug-in development is as easy as we described, and not as difficult as we imagined.
