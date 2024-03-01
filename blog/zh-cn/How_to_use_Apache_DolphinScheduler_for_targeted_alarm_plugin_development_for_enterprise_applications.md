在Apache DolphinScheduler的2.0.1版本 加入了插件化架构改进，将任务、告警组件、数据源、资源存储、注册中心等都将被设计为扩展点，以此来提高 Apache DolphinScheduler 本身的灵活性和友好性。在企业级应用中根据不同公司的告警需求可能各有不同，针对性的告警插件开发可以很好的解决这一痛点。

**当前版本：3.1.2**

## 告警插件开发
先来看下alert目录的结构

![](/img/2024-01-19/1.png)

- dolphinscheduler-alert-api
- 该模块是 ALERT SPI 的核心模块，该模块定义了告警插件扩展的接口以及一些基础代码，其中 AlertChannel 和 AlertChannelFactory 是告警插件开发需要实现的接口类
- dolphinscheduler-alert-plugins
- 该模块包含了官方提供的告警插件，目前我们已经支持数十种插件，如 Email、DingTalk、Script等
- dolphinscheduler-alert-server
- 告警服务模块,主要功能包括注册告警插件,Netty告警消息发送等


本文以官方的http告警插件为例讲解如何进行插件开发
- 首先明确需求,http告警插件需要通过http发送请求,发送请求首先需要确定哪些参数.在 `HttpAlertConstants` 可以看到有定义一些相关参数
```
package org.apache.dolphinscheduler.plugin.alert.http;
public final class HttpAlertConstants {
    public static final String URL = "$t('url')";

    public static final String NAME_URL = "url";

    public static final String HEADER_PARAMS = "$t('headerParams')";

    public static final String NAME_HEADER_PARAMS = "headerParams";

...........................省略多余代码

    private HttpAlertConstants() {
        throw new UnsupportedOperationException("This is a utility class and cannot be instantiated");
    }
}
```

- 对应此处告警实例需要填写的参数

![](/img/2024-01-19/2.png)

其中 $t('url') 样式的参数可以通过编辑
>dolphinscheduler-ui/src/locales/zh_CN/security.ts

添加对应的参数,前端收到后会自动替换,同样的英文字典也需要替换,不然切换英文时会报错

- 在`HttpAlertChannelFactory`需要实现`AlertChannelFactory`并实现它的方法`name`,`params`和`create`。其中`InputParam.newBuilder`的第一个参数是显示的值,第二个参数是参数名，这里用我们前面在`MailParamsConstants`写好的常量。所有参数写好后添加到`paramsList`后返回
```
@AutoService(AlertChannelFactory.class)
public final class HttpAlertChannelFactory implements AlertChannelFactory {
    @Override
    public String name() {
        return "Http";
    }
    @Override
    public List<PluginParams> params() {
        InputParam url = InputParam.newBuilder(HttpAlertConstants.NAME_URL, HttpAlertConstants.URL)
                                   .setPlaceholder("input request URL")
                                   .addValidate(Validate.newBuilder()
                                                        .setRequired(true)
                                                        .build())
                                   .build();
        InputParam headerParams = InputParam.newBuilder(HttpAlertConstants.NAME_HEADER_PARAMS, HttpAlertConstants.HEADER_PARAMS)
                                            .setPlaceholder("input request headers as JSON format ")
                                            .addValidate(Validate.newBuilder()
                                                                 .setRequired(true)
                                                                 .build())
                                            .build();
        InputParam bodyParams = InputParam.newBuilder(HttpAlertConstants.NAME_BODY_PARAMS, HttpAlertConstants.BODY_PARAMS)
                                          .setPlaceholder("input request body as JSON format ")
                                          .addValidate(Validate.newBuilder()
                                                               .setRequired(false)
                                                               .build())
                                          .build();
...........................省略多余代码
        return Arrays.asList(url, requestType, headerParams, bodyParams, contentField);
    }
    @Override
    public AlertChannel create() {
        return new HttpAlertChannel();
    }
}
```
- 在`HttpAlertChannel`需要实现`AlertChannel`并实现`process`方法,其中`alertInfo.getAlertData().getAlertParams()`可以拿到在创建告警实例时填写的参数,在此处编写相关代码发送请求后,需要返回`AlertResult`对象用来标记请求发送or失败
```
public final class HttpAlertChannel implements AlertChannel {
    @Override
    public AlertResult process(AlertInfo alertInfo) {
        AlertData alertData = alertInfo.getAlertData();
        Map<String, String> paramsMap = alertInfo.getAlertParams();
        if (null == paramsMap) {
            return new AlertResult("false", "http params is null");
        }
        return new HttpSender(paramsMap).send(alertData.getContent());
    }
}
```
至此插件开发就完成的,是不是很简单：）设计优秀架构合理的代码就应该是这样优雅高效解耦合.
完成以上开发后,启动告警服务,就可以在添加告警实例时选择对应的插件了

![](/img/2024-01-19/3.png)


## 源码解读
在启动告警服务时,可以在日志看到有注册告警插件的信息

![](/img/2024-01-19/4.png)

以此为切入口来探索插件实现的相关代码

- 在dolphinscheduler-alert-server的`AlertPluginManager`的 installPlugin 方法可以看到注册告警插件的内容,这里先获取所有实现了`AlertChannelFactory.class`的类,遍历后获取`AlertChannel`的实例,添加到数据库和`channelKeyedById`Map
```
    private final Map<Integer, AlertChannel> channelKeyedById = new HashMap<>();
    
    @EventListener
    public void installPlugin(ApplicationReadyEvent readyEvent) {
        PrioritySPIFactory<AlertChannelFactory> prioritySPIFactory = new PrioritySPIFactory<>(AlertChannelFactory.class);
        for (Map.Entry<String, AlertChannelFactory> entry : prioritySPIFactory.getSPIMap().entrySet()) {
            String name = entry.getKey();
            AlertChannelFactory factory = entry.getValue();
            logger.info("Registering alert plugin: {} - {}", name, factory.getClass());
            final AlertChannel alertChannel = factory.create();
            logger.info("Registered alert plugin: {} - {}", name, factory.getClass());
            final List<PluginParams> params = new ArrayList<>(factory.params());
            params.add(0, warningTypeParams);
            final String paramsJson = PluginParamsTransfer.transferParamsToJson(params);
            final PluginDefine pluginDefine = new PluginDefine(name, PluginType.ALERT.getDesc(), paramsJson);
            final int id = pluginDao.addOrUpdatePluginDefine(pluginDefine);
            channelKeyedById.put(id, alertChannel);
        }
    }
```
- 完成插件的开发和注册后,需要有个轮询线程来遍历查询需要发送的消息和完成发送的动作,在`AlertSenderService`的`run`方法完成了这些
```
@Override
public void run() {
    logger.info("alert sender started");
    while (!ServerLifeCycleManager.isStopped()) {
        try {
            List<Alert> alerts = alertDao.listPendingAlerts();
            AlertServerMetrics.registerPendingAlertGauge(alerts::size);
            this.send(alerts);
            ThreadUtils.sleep(Constants.SLEEP_TIME_MILLIS * 5L);
        } catch (Exception e) {
            logger.error("alert sender thread error", e);
        }
    }
}
```
- 关键方法是`this.send(alerts)`,这里遍历`Alert`后获取告警插件的实例集合,在 `this.alertResultHandler(instance, alertData)`传入插件实例对象和告警参数,最后更新这条告警消息的状态
```
public void send(List<Alert> alerts) {
    for (Alert alert : alerts) {
        // get alert group from alert
        int alertId = Optional.ofNullable(alert.getId()).orElse(0);
        int alertGroupId = Optional.ofNullable(alert.getAlertGroupId()).orElse(0);
        List<AlertPluginInstance> alertInstanceList = alertDao.listInstanceByAlertGroupId(alertGroupId);
        if (CollectionUtils.isEmpty(alertInstanceList)) {
            logger.error("send alert msg fail,no bind plugin instance.");
            List<AlertResult> alertResults = Lists.newArrayList(new AlertResult("false",
                    "no bind plugin instance"));
            alertDao.updateAlert(AlertStatus.EXECUTION_FAILURE, JSONUtils.toJsonString(alertResults), alertId);
            continue;
        }
        AlertData alertData = AlertData.builder()
                .id(alertId)
                .content(alert.getContent())
                .log(alert.getLog())
                .title(alert.getTitle())
                .warnType(alert.getWarningType().getCode())
                .alertType(alert.getAlertType().getCode())
                .build();

        int sendSuccessCount = 0;
        List<AlertResult> alertResults = new ArrayList<>();
        for (AlertPluginInstance instance : alertInstanceList) {
            AlertResult alertResult = this.alertResultHandler(instance, alertData);
            if (alertResult != null) {
                AlertStatus sendStatus = Boolean.parseBoolean(String.valueOf(alertResult.getStatus()))
                        ? AlertStatus.EXECUTION_SUCCESS
                        : AlertStatus.EXECUTION_FAILURE;
                alertDao.addAlertSendStatus(sendStatus, JSONUtils.toJsonString(alertResult), alertId,
                        instance.getId());
                if (sendStatus.equals(AlertStatus.EXECUTION_SUCCESS)) {
                    sendSuccessCount++;
                    AlertServerMetrics.incAlertSuccessCount();
                } else {
                    AlertServerMetrics.incAlertFailCount();
                }
                alertResults.add(alertResult);
            }
        }
        AlertStatus alertStatus = AlertStatus.EXECUTION_SUCCESS;
        if (sendSuccessCount == 0) {
            alertStatus = AlertStatus.EXECUTION_FAILURE;
        } else if (sendSuccessCount < alertInstanceList.size()) {
            alertStatus = AlertStatus.EXECUTION_PARTIAL_SUCCESS;
        }
        alertDao.updateAlert(alertStatus, JSONUtils.toJsonString(alertResults), alertId);
    }
}
```
- 在`alertResultHandler`用`alertPluginManager.getAlertChannel(instance.getPluginDefineId())`获取`AlertChannel`实例.还记得前面注册告警插件时往`channelKeyedById`里put的`AlertChannel`实例的动作吗?
```
public Optional<AlertChannel> getAlertChannel(int id) {
    return Optional.ofNullable(channelKeyedById.get(id));
}
```
- 然后构建`AlertInfo`对象,通过`CompletableFuture.supplyAsync()`来异步回调执行`alertChannel.process(alertInfo)`,用`future.get()`获得回调执行返回的`AlertResult`再return
```
private @Nullable AlertResult alertResultHandler(AlertPluginInstance instance, AlertData alertData) {
    String pluginInstanceName = instance.getInstanceName();
    int pluginDefineId = instance.getPluginDefineId();
    Optional<AlertChannel> alertChannelOptional = alertPluginManager.getAlertChannel(instance.getPluginDefineId());
    if (!alertChannelOptional.isPresent()) {
        String message = String.format("Alert Plugin %s send error: the channel doesn't exist, pluginDefineId: %s",
                pluginInstanceName,
                pluginDefineId);
        logger.error("Alert Plugin {} send error : not found plugin {}", pluginInstanceName, pluginDefineId);
        return new AlertResult("false", message);
    }
    AlertChannel alertChannel = alertChannelOptional.get();

    Map<String, String> paramsMap = JSONUtils.toMap(instance.getPluginInstanceParams());
    String instanceWarnType = WarningType.ALL.getDescp();

    if (paramsMap != null) {
        instanceWarnType = paramsMap.getOrDefault(AlertConstants.NAME_WARNING_TYPE, WarningType.ALL.getDescp());
    }

    WarningType warningType = WarningType.of(instanceWarnType);

    if (warningType == null) {
        String message = String.format("Alert Plugin %s send error : plugin warnType is null", pluginInstanceName);
        logger.error("Alert Plugin {} send error : plugin warnType is null", pluginInstanceName);
        return new AlertResult("false", message);
    }

    boolean sendWarning = false;
    switch (warningType) {
        case ALL:
            sendWarning = true;
            break;
        case SUCCESS:
            if (alertData.getWarnType() == WarningType.SUCCESS.getCode()) {
                sendWarning = true;
            }
            break;
        case FAILURE:
            if (alertData.getWarnType() == WarningType.FAILURE.getCode()) {
                sendWarning = true;
            }
            break;
        default:
    }

    if (!sendWarning) {
        logger.info(
                "Alert Plugin {} send ignore warning type not match: plugin warning type is {}, alert data warning type is {}",
                pluginInstanceName, warningType.getCode(), alertData.getWarnType());
        return null;
    }

    AlertInfo alertInfo = AlertInfo.builder()
            .alertData(alertData)
            .alertParams(paramsMap)
            .alertPluginInstanceId(instance.getId())
            .build();
    int waitTimeout = alertConfig.getWaitTimeout();
    try {
        AlertResult alertResult;
        if (waitTimeout <= 0) {
            if (alertData.getAlertType() == AlertType.CLOSE_ALERT.getCode()) {
                alertResult = alertChannel.closeAlert(alertInfo);
            } else {
                alertResult = alertChannel.process(alertInfo);
            }
        } else {
            CompletableFuture<AlertResult> future;
            if (alertData.getAlertType() == AlertType.CLOSE_ALERT.getCode()) {
                future = CompletableFuture.supplyAsync(() -> alertChannel.closeAlert(alertInfo));
            } else {
                future = CompletableFuture.supplyAsync(() -> alertChannel.process(alertInfo));
            }
            alertResult = future.get(waitTimeout, TimeUnit.MILLISECONDS);
        }
        if (alertResult == null) {
            throw new RuntimeException("Alert result cannot be null");
        }
        return alertResult;
    } catch (InterruptedException e) {
        logger.error("send alert error alert data id :{},", alertData.getId(), e);
        Thread.currentThread().interrupt();
        return new AlertResult("false", e.getMessage());
    } catch (Exception e) {
        logger.error("send alert error alert data id :{},", alertData.getId(), e);
        return new AlertResult("false", e.getMessage());
    }
}
```

综上描述，可以画出注册插件和发送消息的时序图

![](/img/2024-01-19/5.png)

以上就是告警插件的主要实现代码,是不是发现源码看下来也没有发现多高深和复杂：）所以多看看源码吧,以后你也可以写出这样优秀的开源软件来贡献开源

参考连接
>[[Feature] Alert Plugin Design · Issue #3049 · apache/dolphinscheduler (github.com)](https://github.com/apache/dolphinscheduler/issues/3049)

>[alert (apache.org)](https://dolphinscheduler.apache.org/zh-cn/docs/latest/user_doc/contribute/backend/spi/alert.html)