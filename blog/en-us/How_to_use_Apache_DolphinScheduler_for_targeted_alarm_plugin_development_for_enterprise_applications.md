In the 2.0.1 version of Apache DolphinScheduler, a plugin architecture improvement was introduced to enhance the flexibility and user-friendliness of the system. Components such as tasks, alert plugins, data sources, resource storage, and registry centers are now designed as extension points. This allows for targeted development of alert plugins to address specific alert requirements in enterprise applications.
**Current Version: 3.1.2**

## Alert Plugin Development
Let's take a look at the directory structure of the alert module:

![](/img/2024-01-19/1.png)

- dolphinscheduler-alert-api
- This module serves as the core module for ALERT SPI. It defines the interfaces for extending alert plugins and provides some basic code. The AlertChannel and AlertChannelFactory interfaces are the key interfaces that need to be implemented for developing alert plugins.
- dolphinscheduler-alert-plugins
- This module includes the official alert plugins provided by DolphinScheduler. Currently, there are dozens of supported plugins, such as Email, DingTalk, and Script.
- dolphinscheduler-alert-server
- This module represents the alert service, which is responsible for registering alert plugins and sending alert messages via Netty.

In this article, we will use the official HTTP alert plugin as an example to demonstrate how to develop a plugin.
- First, let's clarify the requirements. The HTTP alert plugin needs to send requests via HTTP, and to do that, we need to determine the necessary parameters. In the `HttpAlertConstants`, you can find the definitions of some related parameters.

```
package org.apache.dolphinscheduler.plugin.alert.http;
public final class HttpAlertConstants {
    public static final String URL = "$t('url')";

    public static final String NAME_URL = "url";

    public static final String HEADER_PARAMS = "$t('headerParams')";

    public static final String NAME_HEADER_PARAMS = "headerParams";

...........................Omitting redundant code 

    private HttpAlertConstants() {
        throw new UnsupportedOperationException("This is a utility class and cannot be instantiated");
    }
}
```

- The corresponding parameters that need to be filled in for the alert instance are shown in the image below.

![](/img/2024-01-19/2.png)

Here, parameters in the style of `$t('url')` can be added by editing the
>dolphinscheduler-ui/src/locales/zh_CN/security.ts

Once added, the frontend will automatically replace them. Similarly, the English dictionary also needs to be updated to avoid errors when switching to English.
- In the `HttpAlertChannelFactory`, you need to implement the `AlertChannelFactory`interface and its methods: `name`,`params`and`create`,The first parameter of `InputParam.newBuilder` represents the displayed value, and the second parameter represents the parameter name. You can use the constants defined in `MailParamsConstants` that we mentioned earlier. After defining all the parameters, add them to the `paramsList` and return.
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
...........................Omitting redundant code 
        return Arrays.asList(url, requestType, headerParams, bodyParams, contentField);
    }
    @Override
    public AlertChannel create() {
        return new HttpAlertChannel();
    }
}
```
- In the `HttpAlertChannel`, you need to implement the `AlertChannel` interface and its `process` method. The `alertInfo.getAlertData().getAlertParams()` method can be used to retrieve the parameters entered when creating the alert instance. Write the relevant code here to send the request, and return an `AlertResult` object to indicate whether the request was successfully sent or not.
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
With that, the plugin development is complete. It's simple, isn't it? This is how elegant and efficient decoupled code should be when designed with a well-structured architecture.
After completing the above development, start the alert service, and you will be able to select the corresponding plugin when adding an alert instance.
![](/img/2024-01-19/3.png)


## Source Code Analysis
When starting the alert service, you can see the information about registering the alert plugins in the logs.

![](/img/2024-01-19/4.png)

Use this as a starting point to explore the relevant code for plugin implementation.

- In the `AlertPluginManager` of `dolphinscheduler-alert-server`, you can find the content for registering the alert plugins. First, get all the classes that implement `AlertChannelFactory.class`, and then iterate over them to obtain instances of `AlertChannel`. Add these instances to the database and the `channelKeyedById` map.
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
- After developing and registering the plugins, a polling thread is needed to iterate and perform actions for querying and sending messages. The `run` method of `AlertSenderService` handles this.

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
- The key method is `this.send(alerts)`. Iterate over the `Alert` instances, retrieve the instances of alert plugins, and pass them along with the alert parameters to `this.alertResultHandler(instance, alertData)`. Finally, update the status of the alert message.

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
- In the `alertResultHandler` method, use `alertPluginManager.getAlertChannel(instance.getPluginDefineId())` to retrieve an instance of `AlertChannel`. Remember when we put the `AlertChannel` instances into the `channelKeyedById` map during the registration of alert plugins?
```
public Optional<AlertChannel> getAlertChannel(int id) {
    return Optional.ofNullable(channelKeyedById.get(id));
}
```
- Then, build an `AlertInfo` object and use `CompletableFuture.supplyAsync()` to asynchronously execute `alertChannel.process(alertInfo)`. Obtain the returned `AlertResult` using `future.get()` and return it.
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

In summary, the sequence diagram below illustrates the registration of plugins and the sending of messages.

![](/img/2024-01-19/6.png)

This covers the main implementation code for alert plugins. As you can see, the source code doesn't appear to be too complex or difficult to understand. So, take some time to explore the source code. In the future, you can also contribute to open-source projects and create such excellent software.

References
>[[Feature] Alert Plugin Design · Issue #3049 · apache/dolphinscheduler (github.com)](https://github.com/apache/dolphinscheduler/issues/3049)

>[alert (apache.org)](https://dolphinscheduler.apache.org/zh-cn/docs/latest/user_doc/contribute/backend/spi/alert.html)