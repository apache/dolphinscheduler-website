# Telegram


If you need `Telegram` to alert, please create an alarm instance in warning instance manage dashboard. and choose the `Telegram` plugin

The configuration example of `Telegram` is as follows:

![telegram-plugin](/img/alert/telegram-plugin.png)

params config:

* WebHook:
  > Telegram open api
* botToken
  > The robot's access token you were given
* chatId
  > Sub Telegram Channel
* parseMode
  > Mode for parsing entities in the message text.(txt、markdown、markdownV2、html)
* EnableProxy
  > Enable Proxy Sever.
* Proxy
  > the proxy address of Proxy-Server
* Port
  > the proxy port of Proxy-Server
* User
  > Authentication(Username) for Proxy-Server
* Password
  > Authentication(Password) for Proxy-Server

P.S.:
- [Telegram Application Bot Guide](https://core.telegram.org/bots)
- [Telegram Bots Api](https://core.telegram.org/bots/api)
- [Telegram SendMessage Api](https://core.telegram.org/bots/api#sendmessage)

