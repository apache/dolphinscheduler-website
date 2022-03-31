# Enterprise WeChat

If you need to use Enterprise WeChat to alert, please modify the `alert.properties` file after the installation is complete, and then restart the alert service. The configuration example of enterprise WeChat is as follows

```shell
# Enable enterprise WeChat alarm or not: ``true`` or ``false``
enterprise.wechat.enable="true"

# Enterprise WeChat corpid, each enterprise has a unique corpid, to obtain this information, you can view the "enterprise ID" under "My Company"-"Enterprise Information" in the management background (administrator rights are required)
enterprise.wechat.corp.id="xxx"

# Secret for Enterprise WeChat, secret is the "key" used to ensure data security in enterprise applications, and each application has an independent access key
enterprise.wechat.secret="xxx"

# Enterprise WeChat agentid, each application has a unique agentid. In the management background -> "Apps and applets" -> "Apps", click on an application, you can see the agentid
enterprise.wechat.agent.id="xxxx"

# Userid when notification send to Enterprise WeChat, multiple separated by commas. Each member has a unique userid, the so-called "account". In the management background -> "Contacts" -> click on a member's details page, you can see
enterprise.wechat.users=zhangsan,lisi

# Get the address of access_token, modify if you need
enterprise.wechat.token.url=https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid={corpId}&corpsecret={secret}

# Send application message address, modify if you need
enterprise.wechat.push.url=https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token={token}

# Message format
enterprise.wechat.user.send.msg={\"touser\":\"{toUser}\",\"agentid\":\"{agentId}\",\"msgtype\":\"markdown\",\"markdown\":{\"content\":\"{msg}\"}}
```
