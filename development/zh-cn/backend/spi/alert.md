### DolphinScheduler Alert SPI 主要设计

#### DolphinScheduler SPI 设计

DolphinScheduler 正在处于微内核 + 插件化的架构更改之中，所有核心能力如任务、资源存储、注册中心等都将被设计为扩展点，我们希望通过 SPI 来提高 DolphinScheduler 本身的灵活性以及友好性（扩展性）。

相关代码可以参考 dolphinscheduler-spi 模块。相关插件的扩展接口皆在该模块下，当我们需要实现相关功能的插件化的时候，建议先阅读此块的代码，当然，更建议你阅读文档，这会减少很多时间，不过文档有一定的后滞性，当文档缺失的时候，建议以源码为准（如果有兴趣，我们也欢迎你来提交相关文档），此外，我们几乎不会对扩展接口做变更（不包括新增），除非重大架构调整，出现不兼容升级版本，因此，现有文档一般都能够满足。

当你需要扩展的时候，事实上你只需要关注扩展接口即可，比如告警服务，您只需要关注 AlertChannelFactory 以及 AlertChannel 即可。底层相关逻辑 DolphinScheduler 已经帮我们实现，这让我们的开发更加专注且简单。

顺便提一句，我们采用了一款优秀的前端组件 form-create，它支持基于 json 生成前端 ui 组件，如果插件开发牵扯到前端，我们会通过 json 来生成相关前端 UI 组件，org.apache.dolphinscheduler.spi.params 里面对插件的参数做了封装，它会将相关参数全部全部转化为对应的 json，这意味这你完全可以通过 Java 代码的方式完成前端组件的绘制（这里主要是表单，我们只关心前后端交互的数据）。

本文主要着重讲解 Alert 告警相关设计以及开发。

#### 主要模块

如果你并不关心它的内部设计，只是想单纯的了解如何开发自己的告警插件，可以略过该内容。

* dolphinscheduler-spi

  该模块是 SPI 的核心模块，提供了 SPI 相关的基础行为，其中 DolphinSchedulerPlugin 为插件顶层接口，所有 DolphinScheduler 的插件都必须实现该接口，另外该模块也提供了一些通用的工具类（如果能够再抽离出去一些会不会更好？比如 UI，我们目前就 Alert 用到了参数这块）以及一些 UI 相关的基础信息。

* dolphinscheduler-alert

  在这个模块，我们实现了在 alert-server 启动的时候相关插件的加载。alert 提供了多种插件配置方法，当你开发工作完成后，通过简单的配置即可启用。配置文件位于 dolphinscheduler-alert/src/main/resources/alert.properties

  它提供了两种配置方法：

  1：配置插件指定的 jar 目录，eg：alert.plugin.dir=/root/dolphinscheduler/lib/plugin/alert . 当alert-server启动时，会从指定目录加载相关插件的jar。

  2：IDE开发模式

  当你处于开发调试阶段的时候，你可以采用该配置，相关设计原理参照 [dolphinscheduler-maven-plugin](https://github.com/apache/incubator-dolphinscheduler-maven-plugin)


 * 打包插件

  插件打包我们使用了 [provisio](https://github.com/jvanzyl/provisio)，这是一款优秀的打包工具，你需要在完成插件开发后将其添加到 dolphinscheduler-dist/src/main/provisio/dolphinscheduler.xml，它会在执行的时候将插件打包至指定目录。



#### Alert SPI 主要类信息：

AlertChannelFactory
告警插件工厂接口，所有告警插件需要实现该接口，该接口用来定义告警插件的名称，需要的参数，create 方法用来创建具体的告警插件实例。

AlertChannel
告警插件的接口，告警插件需要实现该接口，该接口中只有一个方法 process ，上层告警系统会调用该方法并通过该方法返回的 AlertResult 来获取告警的返回信息。

AlertData
告警内容信息，包括 id，标题，内容，日志。

AlertInfo
告警相关信息，上层系统调用告警插件实例时，将该类的实例通过 process 方法传入具体的告警插件。内部包含告警内容 AlertData 和调用的告警插件实例的前端填写的参数信息。

AlertResult
告警插件发送告警返回信息。

org.apache.dolphinscheduler.spi.params
该包下是插件化的参数定义，我们前端使用 alpacajs 这个前端库 http://www.form-create.com，该库可以基于插件定义返回的参数列表 json 来动态生成前端的 ui，因此我们在做 SPI 插件开发的时候无需关心前端。

该 package 下我们目前只封装了 RadioParam，TextParam，PasswordParam，分别用来定义 text 类型的参数，radio 参数和 password 类型的参数。

AbsPluginParams 该类是所有参数的基类，RadioParam 这些类都继承了该类。每个 DS 的告警插件都会在 AlertChannelFactory 的实现中返回一个 AbsPluginParams 的 list。

alert_spi 具体设计可见 issue：[Alert Plugin Design](https://github.com/apache/incubator-dolphinscheduler/issues/3049)

#### Alert SPI 内置实现

* Email

  电子邮件告警通知

* DingTalk

  钉钉群聊机器人告警

* EnterpriseWeChat

  企业微信告警通知

  相关参数配置可以参考企业微信机器人文档。
* Script

  我们实现了 Shell 脚本告警，我们会将相关告警参数透传给脚本，你可以在 Shell 中实现你的相关告警逻辑，如果你需要对接内部告警应用，这是一种不错的方法。

* SMS

  短信告警

#### 告警自定义插件开发

事实上，自我实现一款插件及其简单，仅仅关心插件扩展接口即可，Alert 中你只需要关心 AlertChannelFactory 以及 AlertChannel。我们更建议你按照其他内置插件的设计规范来去开发，这样当你的idea足够好的时候，你无需做过多更改即可捐献给社区。

当你完成相关代码开发的时候在 alert.properties 配置相关插件（或者仅仅配置一个插件目录，他会加载该目录下的所有插件）。


然后，接下来就可以开始愉快的使用你自己的插件了。

事实上，自定义插件化开发确实如同我们描绘的那么简单，并没有想象中的多么困难。
