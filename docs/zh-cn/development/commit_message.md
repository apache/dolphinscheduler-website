## DolphinScheduler-Contributor-CommitMessage篇

### 前言
  我们在查看了很多开源项目的commit log后，发现一个有趣的问题，一部分开发者，代码质量很不错，但是commit message记录却比较混乱，当其他贡献者或者学习者在查看代码的时候，并不能通过commit log很直观的了解
该提交前后变更的目的，因此，针对这些问题，DolphinScheduler结合其他社区以及Apache官方文档制定了该规约。
### Commit Message RIP
#### 1：明确修改内容
commit message应该明确说明该提交解决了哪些问题（bug修复、功能增强等），以便于用户开发者更好的跟踪问题，明确版本迭代过程中的优化情况。

#### 2：关联相应的Pull Request 或者Issue

当我们的改动较大的时候，commit message最好能够关联Github上的相关Issue或者Pull Request，这样，我们的开发者在查阅代码的时候能够较为迅速的了解改代码提交的上下文情景。

#### 3：统一的格式


### 参考文档
[提交消息格式](https://cwiki.apache.org/confluence/display/GEODE/Commit+Message+Format)