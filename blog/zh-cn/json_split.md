## 背景

当前dolphinscheduler的工作流中的任务及关系保存时是以大json的方式保存到数据库中process_definiton表的process_definition_json字段，如果某个工作流很大比如有100或者1000个任务，这个json字段也就非常大，在使用时需要解析json，非常耗费性能，且任务没法重用，故社区计划启动json拆分项目

## 一期总结

json split项目从2021-01-12开始启动，到2021-04-25一期已完成。代码正在合入dev分支。感谢lenboo、JinyLeeChina、simon824、wen-hemin四位伙伴参与coding。

- 代码变更12793行
- 修改/增加 168 个文件
- 共145次commit
- 有85个pr

### 拆分方案回顾

![拆分方案](https://user-images.githubusercontent.com/42576980/117598604-b1ad8e80-b17a-11eb-9d99-d593fce7bab6.png)

- [ ] api模块进行save操作时

1. 通过雪花算法生成13位的数字作为process_definition_code，工作流定义保存至process_definition（主表）和process_definition_log（日志表），这两个表保存的是同样的数据，工作流定义版本为1
2. 通过雪花算法生成13位的数字作为task_definition_code，任务定义表保存至task_definition（主表）和task_definition_log（日志表），也是保存同样的数据，任务定义版本为1
3. 工作流任务关系保存在 process_task_relation（主表）和process_task_relation_log（日志表），该表保存的code和version是工作流的code和version，因为任务是通过工作流进行组织，以工作流来画dag。也是通过post_task_code和post_task_version标识dag的当前节点，这个节点的前置依赖通过pre_task_code和pre_task_version来标识，如果没有依赖，pre_task_code和pre_task_version为0

- [ ] api模块进行update操作时，工作流定义和任务定义直接更新主表数据，更新后的数据insert到日志表。关系表主表先删除然后再插入新的关系，关系表日志表直接插入新的关系

- [ ] api模块进行delete操作时，工作流定义、任务定义和关系表直接删除主表数据，日志表数据不变动
- [ ] api模块进行switch操作时，直接将日志表中对应version数据覆盖到主表

### Json存取方案

![json](https://user-images.githubusercontent.com/42576980/117598643-c9851280-b17a-11eb-9a6e-c81ee083b09c.png)

- [ ] 当前一期拆分方案，api模块controller层整体未变动，传入的大json还是在service层映射为ProcessData对象。insert或update操作在公共Service模块通过ProcessService.saveProcessDefiniton()入口完成保存数据库操作，按照task_definition、process_task_relation、process_definition的顺序保存。保存时，如果该任务已经存在并且关联的工作流未上线，则更改任务；如果任务关联的工作流已上线，则不允许更改任务

- [ ] api查询操作时，当前还是通过工作流id来查询，在公共Service模块通过ProcessService.genTaskNodeList()入口完成数据组装，还是组装为ProcessData对象，进而生成json返回
- [ ] Server模块（Master）也是通过公共Service模块ProcessService.genTaskNodeList()获得TaskNodeList生成调度dag，把当前任务所有信息放到 MasterExecThread.readyToSubmitTaskQueue队列，以便生成taskInstance，dispatch给worker



## 二期规划

### api/ui模块改造

- [ ] processDefinition接口通过processDefinitionId请求后端的替换为processDefinitonCode
- [ ] 支持task的单独定义，当前task的插入及修改是通过工作流来操作的，二期需要支持单独定义
- [ ] 前端及后端controller层 json 拆分，一期已完成api模块service层到dao的json拆分，二期需要完成前端及controller层json拆分

### server模块改造

- [ ] t_ds_command、t_ds_error_command、t_ds_schedules中process_definition_id替换为process_definition_code

- [ ] 生成taskInstance流程改造

当前生成process_instance，是通过process_definition和schedules及command表生成，而生成taskInstance还是来源于MasterExecThread.readyToSubmitTaskQueue队列，而队列中数据来源于dag对象，此时，该队列及dag中保存taskInstance的所有信息，这种方式非常占用内存。可改造为如下图的数据流转方式，readyToSubmitTaskQueue队列及dag中保存任务code和版本信息，在生成task_instance前，查询task_definition

![server](https://user-images.githubusercontent.com/42576980/117598659-d3a71100-b17a-11eb-8fe1-8725299510e6.png)

