# Enterprise WeChat

## How to Create Enterprise WeChat Alert

If you need to use Enterprise WeChat to alert, please create an alarm Instance in warning instance manage, and then choose the wechat plugin. The configuration example of enterprise WeChat is as follows

![enterprise-wechat-plugin](/img/alert/enterprise-wechat-plugin.png)

Where send type corresponds to app and appchat respectively:

APP: https://work.weixin.qq.com/api/doc/90000/90135/90236

APPCHAT: https://work.weixin.qq.com/api/doc/90000/90135/90248

user.send.msg corresponds to the content in the document. The variable of the corresponding value is {msg}
