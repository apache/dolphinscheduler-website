# Telegram

If you need `Telegram` to alert, create an alert instance in the alert instance management, and choose the `Telegram` plugin.
The following shows the `Telegram` configuration example:

![telegram-plugin](/img/alert/telegram-plugin.png)

## Parameter Configuration

* WebHook:
  > The WebHook of Telegram when use robot to send message
* botToken
  > The robot's access token
* chatId
  > Sub Telegram Channel
* parseMode
  > Message parse type (support txt, markdown, markdownV2, html)
* EnableProxy
  > Enable proxy sever
* Proxy
  > the proxy address of the proxy server
* Port
  > the proxy port of Proxy-Server
* User
  > Authentication(Username) for the proxy server
* Password
  > Authentication(Password) for the proxy server

References:
- [Telegram Application Bot Guide](https://core.telegram.org/bots)
- [Telegram Bots Api](https://core.telegram.org/bots/api)
- [Telegram SendMessage Api](https://core.telegram.org/bots/api#sendmessage)

