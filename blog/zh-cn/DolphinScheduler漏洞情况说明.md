【安全通报】【影响程度：低】DolphinScheduler 漏洞情况说明

Apache DolphinScheduler 社区邮件列表最近通告了 1个漏洞，考虑到有很多用户并未订阅此邮 件列表，我们特地在此进行情况说明：

CVE-2021-27644

重要程度： 低

影响范围： 暴露服务在外网中、且内部账号泄露。如果无上述情况，用户可根据实际情况决定是否需要升级。

影响版本： <1.3.6

漏洞说明：

此问题是由于mysql connectorj 漏洞引起的，DolphinScheduler登陆用户（未登录用户无法执行此操作，建议企业做好账号安全规范）可在数据源管理页面-Mysql数据源填写恶意参数，导致安全隐患。（未使用Mysql数据源的不影响）

修复建议： 升级到>=1.3.6版本

特别感谢

特别感谢漏洞报告者：来自蚂蚁安全非攻实验室的锦辰同学，他提供了漏洞的还原过程以及对应的解决方案。整个过程呈现了专业安全人员的技能和高素质，感谢他们为开源项目的安全守护所作出的贡献。

建议

十分感谢广大用户选择 Apache DolphinScheduler 作为企业的大数据任务调度系统，但必须要提醒的是调度系统属于大数据建设中核心基础设施，请不要将其暴露在外网中。此外应该对企业内部人员账号做好安全措施，降低账号泄露的风险。

贡献

迄今为止，Apache DolphinScheduler 社区已经有近200+ 位代码贡献者，70+位非代码贡献者。其中也不乏其他Apache顶级项目的PMC或者Committer，非常欢迎更多伙伴也能参与到开源社区建设中来，为建造一个更加稳定安全可靠的大数据任务调度系统而努力，同时也为中国开源崛起献上自己的一份力量！

WebSite ：https://dolphinscheduler.apache.org/

MailList ：dev@dolphinscheduler@apache.org

Twitter ：@DolphinSchedule

YouTube ：https://www.youtube.com/channel/UCmrPmeE7dVqo8DYhSLHa0vA

Slack ：https://s.apache.org/dolphinscheduler-slack

Contributor Guide：https://dolphinscheduler.apache.org/en-us/community/community.html

如果对漏洞有任何疑问，欢迎参与讨论，竭诚解决大家的疑虑：