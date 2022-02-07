# WebexTeams

If you need to use WebexTeams to alert, please create an alarm Instance in warning instance manage, and then choose the WebexTeams plugin. The configuration example of enterprise WebexTeams is as follows:

![enterprise-webexteams-plugin](/img/alert/enterprise-webexteams-plugin.png)


parameter configuration

* botAccessToken
  > The robot's access token you were given
* roomID
  > The room ID of the message
* toPersonId
  > The person ID of the recipient when sending a private 1:1 message
* toPersonEmail
  > The email address of the recipient when sending a private 1:1 message
* atSomeoneInRoom
  > If the message destination is room, the user emails of the person being @, use ,(eng commas) to separate multiple emails
* destination
  > Provide only one message destination in the roomId, toPersonEmail, or toPersonId field

[WebexTeams Application Bot Guide](https://developer.webex.com/docs/bots)
[WebexTeams Message Guide](https://developer.webex.com/docs/api/v1/messages/create-a-message)
