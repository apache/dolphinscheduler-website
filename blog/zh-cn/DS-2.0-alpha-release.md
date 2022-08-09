# 重构、插件化、性能提升 20 倍，Apache DolphinScheduler 2.0 alpha 发布亮点太多！

<div align='center'><img src="https://s1.imgpp.com/2021/11/16/a920be6733a3d99af38d1cdebfcbb3ff.md.png"></div>

  
社区的小伙伴们，好消息！经过 100 多位社区贡献者近 10 个月的共同努力，我们很高兴地宣布 Apache DolphinScheduler 2.0 alpha 发布。这是 DolphinScheduler 自进入 Apache 以来的首个大版本，进行了多项关键更新和优化，是 DolphinScheduler 发展中的里程碑。

DolphinScheduler 2.0 alpha 主要重构了 Master 的实现，大幅优化了元数据结构和处理流程，增加了 SPI 插件化等能力，在性能上提升 20 倍。同时，新版本设计了全新的 UI 界面，带来更好的用户体验。另外，2.0 alpha 还新添加和优化了一些社区呼声极高的功能，如参数传递、版本控制、导入导出等功能。

注意：当前 alpha 版本还未支持自动升级，我们将在下个版本中支持这一功能。



**2.0 alpha 下载地址：https://dolphinscheduler.apache.org/en-us/download/download.html**


## 优化内核，性能提升 20 倍

相较于 DolphinScheduler 1.3.8，同等硬件配置下(3 台 8 核 16 G)，2.0 alpha 吞吐性能提升 20 倍，这主要得益于 Master 的重构，Master 执行流程和优化了工作流处理流程等，包括：
- 重构 Master 的执行流程，将之前状态轮询监控改为事件通知机制，大幅减轻了数据库的轮询压力；
- 去掉全局锁，增加了 Master 的分片处理机制，将顺序读写命令改为并行处理，增强了 Master 横向扩展能力；
- 优化工作流处理流程，减少了线程池的使用，大幅提升单个 Master 处理的工作流数量；
- 增加缓存机制，大幅减少数据库的操作次数；
- 优化数据库连接方式，极大地缩减数据库操作耗时；
- 简化处理流程，减少处理过程中不必要的耗时操作。



## 优化 UI 组件，全新的 UI 界面

<div align='center'><img src="https://s1.imgpp.com/2021/11/16/4e4024cbddbe3113f730c5e67f083c4f.md.png"></div>

<div align='center'><img src="https://s1.imgpp.com/2021/11/16/75e002b21d827aee9aeaa3922c20c13f.md.png"></div>


<center> 
  UI 界面对比：1.3.9（上） VS. 2.0 alpha（下）
</center>


>
2.0 UI 重要优化在以下几个方面：


- 优化组件显示：界面更简洁，流程显示更清晰，一目了然；
- 突出重点内容：鼠标点击任务框，显示任务详情信息；
- 增强可识别性：左侧工具栏标注名称，使工具更易识别，便于操作；
- 调整组件顺序：调整组件排列顺序，更符合用户习惯。


除了性能与 UI 上的变化外，DolphinScheduler 也新增和优化了 20 多项功能
及 BUG 修复。


## 新功能列表
<div align='center'><img src="https://s1.imgpp.com/2021/11/16/WX20211116-164031.md.png"></div>


## 优化项

<div align='center'><img src="https://s1.imgpp.com/2021/11/16/WX20211116-164042.md.png"></div>



## Bug 修复
<div align='center'><img src="https://s1.imgpp.com/2021/11/16/WX20211116-164059.md.png"></div>



## 感谢贡献者


DolphinScheduler 2.0 alpha 的发布凝聚了众多社区贡献者的智慧和力量，是他们的积极参与和极大的热情开启了 DolphinScheduler 2.0 时代！

非常感谢 100+ 位（GitHub ID）社区小伙伴的贡献，期待更多人能够加入 DolphinScheduler 社
区共建，为打造一个更好用的大数据工作流调度平台贡献自己的力量！

<div align='center'><img src="https://s1.imgpp.com/2021/11/16/8926d45ead1f735e8cfca0e8142b315f.md.png"></div>


<center>2.0 alpha 贡献者名单</center>

## 加入我们

随着国内开源的迅猛崛起，Apache DolphinScheduler 社区迎来蓬勃发展，为了做更好用、易用的调度，真诚欢迎热爱开源的伙伴加入到开源社区中来，为中国开源崛起献上一份自己的力量，让本土开源走向全球。

贡献第一个PR(文档、代码) 我们也希望是简单的，第一个PR用于熟悉提交的流程和社区协作以及感受社区的友好度。

社区汇总了以下适合新手的问题列表：https://github.com/apache/dolphinscheduler/issues/5689

进阶问题列表：https://github.com/apache/dolphinscheduler/issues?q=is%3Aopen+is%3Aissue+label%3A%22volunteer+wanted%22

如何参与贡献链接：https://dolphinscheduler.apache.org/en-us/docs/dev/user_doc/contribute/join/review.html

来吧，DolphinScheduler开源社区需要您的参与，为中国开源崛起添砖加瓦吧，哪怕只是小小的一块瓦，汇聚起来的力量也是巨大的。

参与开源可以近距离与各路高手切磋，迅速提升自己的技能，如果您想参与贡献，我们有个贡献者种子孵化群，可以添加社区小助手微信(Leonard-ds) 手把手教会您( 贡献者不分水平高低，有问必答，关键是有一颗愿意贡献的心 )。添加小助手微信时请说明想参与贡献。

来吧，开源社区非常期待您的参与。
