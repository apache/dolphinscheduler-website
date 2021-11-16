


#Apache DolphinScheduler 2.0 alpha 发布，性能提升 20 倍！




社区小伙伴们，好消息！在经过团队和社区贡献者两年多的共同努力之下，我们宣布 Apache DolphinScheduler 2.0 将很快与大家见面。2.0 版本即将有多项大家期待已久的重大更新，在 DolphinScheduler 的发展中再立里程碑。但为了给用户带来更好的体验，社区决定 alpha 版本先行，将用户的反馈和建议融汇进正式版本之中。




DolphinScheduler 2.0 alpha 主要优化了元数据结构和处理流程，增加了插件化等基础能力，并在性能上有 20 倍的提升。同时，新版本设计了全新的 UI 界面，带来更好的用户体验。另外，2.0 alpha 还新增和优化了一些社区呼声极高的功能，如任务插件、参数传递、导入导出等功能。




2.0 alpha 下载地址：
https://dolphinscheduler.apache.org/en-us/download/download.html


## 优化内核，增强系统处理能力，性能提升 20 倍

相较于 DolphinScheduler 1.3.8，2.0 alpha 性能提升 20 倍，这主要得益于新的数据库连接方式、Master 执行流程和优化的工作流处理流程等，包括：


* 优化数据库连接方式，极大地减少数据库操作耗时；
* 重构 Master 的执行流程，将之前状态轮询监控改为事件通知机制，极大地减少数据库的轮询次数；
* 优化工作流处理流程，减少了线程池的使用，大幅提升单个 Master 处理的工作流数量；
* 增加缓存机制，大幅减少数据库的操作次数；
* 去掉全局锁，增加了 Master 的分片处理机制，将顺序读写命令改为并行处理，使得 Master 真正实现横向扩展；
* 简化处理流程，减少处理过程中不必要的耗时操作。


## 优化 UI 组件，全新的 UI 界面

1.3.9 VS. 2.0 alpha


- 优化组件显示：界面更简洁，流程显示更清晰，一目了然；
- 突出重点内容：鼠标点击任务框，显示任务状态信息；
- 增强可识别性：左侧工具栏标注名称，使工具更易识别，便于操作；
- 调整组件顺序：调整组件排列顺序，更符合用户习惯


## 新功能列表

* 任务结果传递功能
* 新增 Switch 任务和 Pigeon 任务组件
* 新增环境管理功能
* 新增批量导入导出和批量移动功能
* 新增注册中心插件功能
* 新增任务插件功能
* 其他功能


## 优化项
* 优化告警组功能
* 优化 RestApi
* 优化工作流版本管理
* 优化导入导出
* 优化 Worker 分组管理功能
* 其他优化事项

## Bug 修复
[ #6550 ]DAG 任务弹出窗口中的环境列表未更新
[ #6506 ]修复 DS 2.0 的 install.sh install_config.conf 添加注释
[ #6497 ]Shell 任务不能正确地使用用户定义的环境
[ #6478 ]在补充数据模式下删除历史数据
[ #6352 ]使用复制工作流功能时不能生成新的流程定义
[ #6342 ]任务实例页面日期不显示
[ #5701 ]删除用户时，关联的访问令牌用户未删除
[ #4809 ]启用 kerberos 身份验证时无法获取程序状态
[ #4450 ]启用 Kerberos 身份验证，Hive/Spark 数据源不支持多租户

## 感谢贡献者

感谢（GitHub ID）:
**597365581**、**AhahaGe**、**andream7**、**baisui1981**、**blackberrier**、**BoYiZhang**、
**break60**、**caishunfeng**、**calvinjiang**、**CalvinKirs**、**c-f-cooper**、**chengshiwen**、
**choucmei**、**cpsky**、**dailidong**、**dddyszy**、**didiaode18**、**Eights-Li**、**EricPyZhou**、
**felix-thinkingdata**、**gabrywu**、**gaojun2048**、**geosmart**、**hailin0**、**haydenzhourepo**、
**jbampton**、**JinyLeeChina**、**jon-qj**、**kezhenxu94**、**kunlun-huang**、**leeseven-li**、
**lenboo**、**lgcareer**、**lijufeng2016**、**LiuBodong**、**lyxell**、**lyyprean**、
**marin-man**、**myangle1120**、**Narcasserun**、**ououtt**、**QuakeWang**、**RichardStark**、
**ruanwenjun**、**samz406**、**Segun-Ogundipe**、**shink**、**simon824**、**Squidyu**、**Tandoy**、
**Tianqi-Dotes**、**wanghong1314**、**wangxj3**、**Wangyizhi1**、**wen-hemin**、**woshiwuxiaofei**、
**xingchun-chen**、**yangyichao-mango**、**Yao-MR**、**yh2388**、**yimaixinchen**、**zhanguohao**、
**zhongjiajie**、**zhuangchong**、**zixi0825**、**zt-1997** 
对 DolphinScheduler 2.0 alpha 的贡献，期待更多人能够加入 DolphinScheduler 社区共建，打造一个更好用的大数据工作流调度平台。 

## 加入我们




## 配置项变更




## 插件使用




参数传递功能




之前没有，新增 具体解释




增加任务插件功能

新增，实现什么功能，对于用户来说有什么用处




工作流和任务解耦

改进，与之前的区别，实现了什么效果










其他

使用方面

优化告警组功能

相比旧版具体优化点和达成的效果




任务组件

Pigeon组件
switch组件

新增，解释分别有什么作用







开发方面

1. 注册中心插件

优化点，与旧版相比区别

2. 告警插件

优化点，实现效果

5. 优化工作流版本管理


