# 企业微信

如果您需要使用到企业微信进行告警，请在安装完成后，修改 `alert.properties` 文件，然后重启 alert 服务即可。企业微信的配置样例如下

```shell
# 设置企业微信告警功能是否开启：开启为 true，否则为 false
enterprise.wechat.enable="true"

# 设置 corpid，每个企业都拥有唯一的 corpid，获取此信息可在管理后台 “我的企业” － “企业信息” 下查看 “企业 ID”（需要有管理员权限）
enterprise.wechat.corp.id="xxx"

# 设置 secret，secret 是企业应用里面用于保障数据安全的 “钥匙”，每一个应用都有一个独立的访问密钥
enterprise.wechat.secret="xxx"

# 设置 agentid，每个应用都有唯一的 agentid。在管理后台 -> “应用与小程序” -> “应用”，点进某个应用，即可看到 agentid
enterprise.wechat.agent.id="xxxx"

# 设置 userid，多个用逗号分隔。每个成员都有唯一的 userid，即所谓 “帐号”。在管理后台 -> “通讯录” -> 点进某个成员的详情页，可以看到
enterprise.wechat.users=zhangsan,lisi

# 获取 access_token 的地址，使用如下例子无需修改
enterprise.wechat.token.url=https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid={corpId}&corpsecret={secret}

# 发送应用消息地址，使用如下例子无需改动
enterprise.wechat.push.url=https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token={token}

# 发送消息格式，无需改动
enterprise.wechat.user.send.msg={\"touser\":\"{toUser}\",\"agentid\":\"{agentId}\",\"msgtype\":\"markdown\",\"markdown\":{\"content\":\"{msg}\"}}
```
