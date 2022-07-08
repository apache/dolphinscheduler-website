# DingTalk

If you need to use DingTalk for alerting, please create an alert instance in the alert instance management and select the DingTalk plugin. The configuration example of DingTalk is as follows:

![dingtalk-plugin](/img/alert/dingtalk-plugin.png)

parameter configuration

* Webhook
  > The format is as follows: https://oapi.dingtalk.com/robot/send?access_token=XXXXXX
* Keyword
  > Custom keywords for security settings
* Secret
  > Signature of security settings
* MessageType
  > Support both text and markdown types

When a custom bot sends a message, you can specify the "@person list" by your mobile phone number. When the people in the "@people list" receive the message, there will be a @ message reminder. Do not disturb conversations still notify reminders, and "someone @ you" appears on the fold
* @Mobiles
  > The mobile phone number of the "@person"
* @UserIds
  > The userid by "@person"
* @All
  > Is @Everyone

[DingTalk Custom Robot Access Development Documentation](https://open.dingtalk.com/document/robots/custom-robot-access)
