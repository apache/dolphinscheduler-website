## 贡献

您可以提交一个bug，一个Feature建议或者直接提交改进。

### 1. 如何提交Bug

当您发现一个Bug时，请提交Bug，提交前：
* 请先在issue列表里查找一下是否该bug已经提交，如果已经有此bug，请在此bug下接着回复。
* 如果该Bug是可以复现的。请尽量提供完整的重现步骤。

请在issues页面中提交Bug。

一个高质量的Bug通常有以下特征：

* 使用一个清晰并有描述性的标题来定义Bug。
* 详细的描述复现Bug的步骤。包括您的配置情况，预计产生的结果，实际产生的结果。并附加详细的TRACE日志。
* 如果程序抛出异常，请附加完整的堆栈日志。
* 如有可能，请附上屏幕截图或动态的GIF图，这些图片能帮助演示整个问题的产生过程。
* 哪个版本。
* 需要修复的优先级(危急、重大、次要、细微)。

下面是Bug的Markdown模板，请按照该模板填写issue。

```shell
**标题** 
标题格式: [BUG][Priority] bug标题
Priority分为四级: Critical、Major、Minor、Trivial

**问题描述**
[清晰准确描述遇到的问题]

**问题复现步骤:**
1. [第一步]
2. [第二步]
3. [...]

**期望的表现:**
[在这里描述期望的表现]

**观察到的表现:**
[在这里描述观察到的表现]

**屏幕截图和动态GIF图**
![复现步骤的屏幕截图和动态GIF图](图片的url)

**DolphinScheduler版本:(以1.1.0为例)** 
 -[1.1.0]
 
**补充的内容:**
[请描述补充的内容，比如]

**需求或者建议**
[请描述你的需求或者建议]
```

### 2. 如何提交功能(Feature)建议
提交前：
* 请确定这不是一个重复的功能增强建议。 查看Issue Page列表，搜索您要提交的功能增强建议是否已经被提交过。

请在issues页面中提交Feature。

一个高质量的Feature通常有以下特征：
* 一个清晰的标题来定义Feature
* 详细描述Feature的行为模式
* 说明为什么该Feature对大多数用户是有用的。新功能应该具有广泛的适用性。
* 尽量列出其他调度已经具备的类似功能。商用与开源软件均可。

以下是Feature的Markdown模板，请按照该模板填写issue。
```shell
**标题** 
标题格式: [Feature][Priority] feature标题
Priority分为四级: Critical、Major、Minor、Trivial

**Feature的描述**
[描述新Feature应实现的功能]

**为什么这个新功能是对大多数用户有用的**
[解释这个功能为什么对大多数用户是有用的]

**补充的内容**
[列出其他的调度是否包含该功能，是如何实现的]

```


### 3. 如何领取Bug/Feature
如果您想实现某个Feature或者修复某个Bug。请参考以下内容：

* 所有的Bug与新Feature建议使用Issues Page进行管理。
* 如果想要开发实现某个Feature功能，请先回复该功能所关联的Issue，表明您当前正在这个Issue上工作。 并在回复的时候为自己设置一个deadline，并添加的回复内容中。
* 最好在核心贡献者找到一个导师(指导者)，导师会在设计与功能实现上给予即时的反馈。
* 您应该新建一个分支来开始您的工作，分支的名字为Feature功能名称/issueId。 比如，您想完成依赖功能并提交了Issue 111，那么您的branch名字应为 dependency/111。 功能名称可与导师讨论后确定。
* 完成后，发送一个pull request到incubator-dolphinscheduler，提交过程具体请参考下面《如何提交代码》。


### 4. 如何提交代码

* 首先从远端仓库*https://github.com/apache/incubator-dolphinscheduler.git* fork一份代码到自己的仓库中

* 远端仓库中目前有三个分支：
    * master 正常交付分支
	   发布稳定版本以后，将稳定版本分支的代码合并到master上。
    
	* dev    日常开发分支
	   日常dev开发分支，新提交的代码都可以pull request到这个分支上。
	   
    * branch-1.0.0 发布版本分支
	   发布版本分支，后续会有2.0...等版本分支，版本分支只修改bug，不增加新功能。

* 把自己仓库clone到本地
  
    ` git clone https://github.com/apache/incubator-dolphinscheduler.git`

*  添加远端仓库地址，命名为upstream

    ` git remote add upstream https://github.com/apache/incubator-dolphinscheduler.git `

*  查看仓库：

    ` git remote -v`

> 此时会有两个仓库：origin(自己的仓库)和upstream（远端仓库）

*  获取/更新远端仓库代码（已经是最新代码，就跳过）
  
    ` git fetch upstream `


* 同步远端仓库代码到本地仓库

```
 git checkout origin/dev
 git merge --no-ff upstream/dev
```

如果远端分支有新加的分支比如`dev-1.0`,需要同步这个分支到本地仓库

```
git checkout -b dev-1.0 upstream/dev-1.0
git push --set-upstream origin dev1.0
```

* 在本地修改代码以后，提交到自己仓库：
  
    `git commit -m 'commit content'`
    `git push`

* 将修改提交到远端仓库

	* 在github页面，点击New pull request.
		<p align="center">
	   <img src="http://geek.analysys.cn/static/upload/221/2019-04-02/90f3abbf-70ef-4334-b8d6-9014c9cf4c7f.png" width="60%" />
	 </p>
	 
	* 选择修改完的本地分支和要合并过去的分支，Create pull request.
		<p align="center">
	   <img src="http://geek.analysys.cn/static/upload/221/2019-04-02/fe7eecfe-2720-4736-951b-b3387cf1ae41.png" width="60%" />
	 </p>
	
* 接着社区Committer们会做CodeReview，然后他会与您讨论一些细节（包括设计，实现，性能等）。当团队中所有人员对本次修改满意后，会将提交合并到dev分支

* 最后，恭喜您已经成为了dolphinscheduler的官方贡献者！
