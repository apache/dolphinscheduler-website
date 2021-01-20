## 前言
Pull Request 本质上是一种软件的合作方式，是将涉及不同功能的代码，纳入主干的一种流程。这个过程中，可以进行讨论、审核和修改代码。

在 Pull Request 中尽量不讨论代码的实现方案，代码及其逻辑的大体实现方案应该尽量在
Issue 或者邮件列表中被讨论确定，在 Pull Request 中我们尽量只关注代码的格式以及代码规范等信息，从而避免实现方式的意见不同而导致
waste time。

## 规范

### Pull Request 标题

标题格式：[`Pull Request 类型`-`Issue 号`][`模块名`] `Pull Request 描述`

其中`Pull Request 类型`和`Issue 类型`的对应关系如下：

<table>
    <thead>
        <tr>
            <th style="width: 10%; text-align: center;">Issue 类型</th>
            <th style="width: 20%; text-align: center;">Pull Request 类型</th>
            <th style="width: 20%; text-align: center;">样例（假设 Issue 号为 3333）</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td style="text-align: center;">Feature</td>
            <td style="text-align: center;">Feature</td>
            <td style="text-align: center;">[Feature-3333][server] Implement xxx</td>
        </tr>
        <tr>
            <td style="text-align: center;">Bug</td>
            <td style="text-align: center;">Fix</td>
            <td style="text-align: center;">[Fix-3333][server] Fix xxx</td>
        </tr>
        <tr>
            <td style="text-align: center;">Improvement</td>
            <td style="text-align: center;">Improvement</td>
            <td style="text-align: center;">[Improvement-3333][alert] Improve the performance of xxx</td>
        </tr>
        <tr>
            <td style="text-align: center;">Test</td>
            <td style="text-align: center;">Test</td>
            <td style="text-align: center;">[Test-3333][api] Add the e2e test of xxx</td>
        </tr>
        <tr>
            <td style="text-align: center;">Sub-Task</td>
            <td style="text-align: center;">Sub-Task 对应的父类型</td>
            <td style="text-align: center;">[Feature-3333][server] Implement xxx</td>
        </tr>
    </tbody>
</table>

其中 `Issue 号`是指当前 Pull Request 对应要解决的 Issue 号，`模块名`同 Issue 的模块名。

### Pull Request 分支名

分支名格式：`Pull Request 类型`-`Issue 号`，举例：Feature-3333。

### Pull Request 内容

请参阅到 commit message 篇。

### Pull Request Code Style

checkstyle [参考](https://checkstyle.sourceforge.io/)是一种帮助开发者编写遵循编码规范的 Java 代码开发工具。它可以自动化检查 Java 代码的方法以及格式，使得开发者不用再做这项无聊（但很重要）的任务。它非常适合于希望实施编码标准的项目。

在 DolphinScheduler 中配置 checkstyle 和 code-style 的方式：

1.checkstyle 和 code-style 配置文件

checkstyle: https://github.com/apache/incubator-dolphinscheduler/blob/dev/style/checkstyle.xml

code-style: https://github.com/apache/incubator-dolphinscheduler/blob/dev/style/intellij-java-code-style.xml

2.checkstyle 配置过程

 <p align="center">
   <img src="/img/checkstyle-idea.png" alt="checkstyle idea 配置方式" />
 </p>
 
3.code-style 配置过程

 <p align="center">
   <img src="/img/code-style-idea.png" alt="code style idea 配置方式" />
 </p>
 
4.怎样使用 checkstyle 和 code-style

当你配置完成后，在提交 Pull Request 前，在改动过后的代码文件中 `Ctrl+L`，checkstyle 工具就会自动帮你 format code 和 import 顺序。

### 相关问题

- 怎样处理一个 Pull Request 对应多个 Issue 的场景。

    首先 Pull Request 和 Issue 一对多的场景是比较少的。Pull Request 和 Issue 一对多的根本原因就是出现了多个
    Issue 需要做大体相同的一件事情的场景，通常针对这种场景有两种解决方法：第一种就是把多个功能相同的 Issue 合并到同一个 Issue 上，然后把其他的
    Issue 进行关闭；第二种就是多个 Issue 大体上是在做一个功能，但是存在一些细微的差别，这类场景下可以把每个 Issue 的职责划分清楚，每一个
    Issue 的类型都标记为 Sub-Task，然后将这些 Sub-Task 类型的 Issue 关联到一个总 Issue 上，在提交
    Pull Request 时，每个 Pull Request 都只关联一个 Sub-Task 的 Issue。
    
    尽量把一个 Pull Request 作为最小粒度。如果一个 Pull Request 只做一件事，Contributor 容易完成，Pull Request 影响的范围也会更加清晰，对 reviewer 的压力也会小。