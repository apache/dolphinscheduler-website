```yaml
title: Apache DolphinScheduler 重磅发布3.2.0版本！
keywords: Apache DolphinScheduler, 版本发布, 技术动态
description: 首度公开！Apache DolphinScheduler 3.2.0 全新功能与优化汇总。
为您带来更加完善的功能体验与系统稳定性。
```

![file](/img/2023-10-17/0.png)

今天，Apache DolphinScheduler 3.2.0 版本在万众期待中终于发布了！在之前的预告中，包括[《重磅预告！Apache DolphinScheduler 3.2.0 新功能“剧透”》](http://mp.weixin.qq.com/s?__biz=MzA4NDYxNTc2NA==&mid=2247518178&idx=1&sn=59584d01ad5c4661ebe98a40d0a4c00c&chksm=9fe6b0d9a89139cff462faa14fa4c47d03ea19ae89f5b982bf41cbd9d6fcb4ba3c73980f6e65&scene=21#wechat_redirect)、[《3.2.0 版本预告！Apache DolphinScheduler API 增强相关功能》](http://mp.weixin.qq.com/s?__biz=MzA4NDYxNTc2NA==&mid=2247519378&idx=1&sn=831802da114034a476c9d015bb3021fb&chksm=9fe6bba9a89132bfe8fa00a4d76786f339957c242a2afc361cdd4dd816d706019d24203d531b&scene=21#wechat_redirect)、[《3.2.0 版本预告！远程日志解决 Worker 故障获取不到日志的问题》](http://mp.weixin.qq.com/s?__biz=MzA4NDYxNTc2NA==&mid=2247519520&idx=1&sn=cdfd1226e84cd7f48fc00569aed844c8&chksm=9fe6ba1ba891330d35869acdefb44e350b7c392e455d4b3d52c53f81765fd43229d207d29f5f&scene=21#wechat_redirect)，以及《[3.2.0 终极预告！云原生支持新增 Spark on k8S 支持》](https://mp.weixin.qq.com/s/QT9wUT42M2HRhlFwMVvp2g)文章汇总已经大致覆盖了 3.2.0 版本的全新功能和优化。

现在，来看看新版本的全新“样貌”吧！

Release Note: https://github.com/apache/dolphinscheduler/releases/tag/3.2.0

下载地址： https://dolphinscheduler.apache.org/en-us/download/3.2.0

**主要更新包括：**

> - 添加默认租户
> - 新增多种数据源
> - 新增任务类型
> - 重跑任务时指定工作流向前、向后运行
> - 增加远程日志功能
> - 参数优化
> - 资源中心
> - 增强页面易用性
> - 云原生支持新增 Spark on k8S 支持
> - 增加了部分 Restful API
> - 注册中心增加 ETCD、JDBC 注册中心
> - 架构优化

# 添加默认租户

在之前的版本中，用户部署完毕后必须手动添加租户。3.2.0 版本中添加了默认租户，方便用户更直接地使用 Apache DolphinScheduler。

# 新增多种数据源

新增了多个数据源，如 Snowflake、Databend、Kyuubi、Doris、OceanBase、Dameng、AzureSQL、StarRocks、AWS Athena、，并且更新了部分数据源，如 Redshift 增加 Access key。

![file](/img/2023-10-17/1.png)

# 新增任务类型

新增了多个任务类型，包括：

- > - 通用模块中，增加 Remote-shell组件、Java Task
  > 
  > - Cloud 模块中，新增 Amazon DMS、Azure Datafactory、AWS Database Migration，增强与各种云的互联互通
  > 
  > - 机器学习模块中，新增 Kubeflow组件（基于云原生构建的机器学习任务工具大合集）
  > 
  > - 其他模块中，增加 AmazonDatasync、Apache Linkis

![file](/img/2023-10-17/2.png)

![file](/img/2023-10-17/3.png)

![file](/img/2023-10-17/4.png)

![file](/img/2023-10-17/5.png)

并更新了部分任务，如 DataX 支持 Presto，http任务增加output 参数传递，运行批量同时 kill 多个 Yarn 任务：

![file](/img/2023-10-17/6.png)

Dependent 支持依赖自己：

![file](/img/2023-10-17/7.png)

支持了 Zeppelin 鉴权；

此外，任务现在可以支持缓存；

![file](/img/2023-10-17/8.png)

Sqoop 日志支持隐藏密码；

以及 SQL 任务支持默认切割符：

![file](/img/2023-10-17/9.png)

# 新增远程日志功能

3.2.0 版本增加了远程日志功能，并同时支持了 Google Cloud Storage、Amazon S3、阿里云 OSS 日志存储，用户可以通过编辑配置文件，把日志存储到云端，解决万一意外情况发生，Woker 日志不存在，用户无法查看日志的问题。

![file](/img/2023-10-17/10.png)

详情参加[《3.2.0 版本预告！远程日志解决 Worker 故障获取不到日志的问题》](https://mp.weixin.qq.com/s/6HTN3XsZi79BcWYvupOuJg)。

# 参数优化

> - 增加了项目级别参数
> - 调整参数优先级，启动参数最高
> - 增加了内置参数计算规则

![file](/img/2023-10-17/11.png)

- 增加了文件类型的参数

![file](/img/2023-10-17/12.png)

# 云原生相关

- 支持 KEDA 做 worker 自动扩缩容
- 支持 Terraform 部署到 AWS
- zk 和 pg 支持多架构
- 提交 Spark 任务到 Kubernetes（详情见[《3.2.0 终极预告！云原生支持新增 Spark on k8S 支持》](https://mp.weixin.qq.com/s/QT9wUT42M2HRhlFwMVvp2g)）
- 获取 pod 实时日志
- 自定义 k8s 任务标签

# 资源中心

增加了 Alibaba Cloud OSS 、Huawei Cloud OBS、Azure Blob Storage的支持，重构资源中心并设计默认使用本地作为存储介质，重新支持了 re-upload。

![file](/img/2023-10-17/13.png)

资源中心容许覆盖上传，优化文件路径，显示文件的全部路径。另外，之前版本中资源中心已经上传的同类型文件只能删除后重新上传，新版本中对本功能进行了优化，可以点击上传按钮进行上传。

![file](/img/2023-10-17/14.png)

支持 reupload 文件

# API 增强

3.2.0 版本中，增加了部分 Restful API，包括 taskInstance、workflow state、workflowInstance、workflow and schedule、task relation，且API 触发工作流运行可以获得 instance ID，从而使得 Apache DolphinScheduler 的 API 能力得到显著增强。

详情参见：《[3.2.0 版本预告！Apache DolphinScheduler API 增强相关功能](https://mp.weixin.qq.com/s/zQ7eaqXMQbvH6W3clVT5Vw)》

# 增加页面易用性

3.2.0 增加了页面易用性和便利性，如增加 workflow instance 跳转到当前工作流、复制工作流名称、调整列宽等操作。

![file](/img/2023-10-17/15.png)

跳转到工作流实例

![file](/img/2023-10-17/16.png)

复制工作流名称

![file](/img/2023-10-17/17.png)

调整列表名称宽度

默认情况下会有 default 租户和本地资源中心，安装后就能使用。

![file](/img/2023-10-17/18.png)

默认租户

允许在 workflow instance 中重新运行任务，任务运行日志更加明确。

![file](/img/2023-10-17/19.png)

可以重新运行任务  
json 导出可阅读性加强。

![file](/img/2023-10-17/20.png)

# 注册中心

增加了 ETCD、JDBC 注册中心。

# 架构

- Alert 支持 HA
- 单线程更新 Kerberos
- Worker server 移除了 dao 依赖
- 接管 task instance 失败的任务
- 增加动态任务组配置
- 重构了逻辑任务和远程命令
- 资源限制（cpu 内存）从原来绝对值改成百分比
- 支持了 SSO

其中，支持了 SSO 后，用户可以通过 Casdoor 实现 SSO 登录。Casdoor 是基于 OAuth 2.0、OIDC、SAML 和 CAS 的面向 UI 的身份访问管理（IAM）/单点登录（SSO）平台，需要先部署 Casdoor 并获取 \`Client ID\` 和 \`Client secret\` 两个字段，再修改 dolphinscheduler-api/src/main/resources/application.yaml 文件配置 SSO。

可以通过以下步骤通过 Casdoor 为 Apache Dolphinscheduler 添加 SSO 功能：

```
security:
  authentication:
    # Authentication types (supported types: PASSWORD,LDAP,CASDOOR_SSO)
    type: CASDOOR_SSO
casdoor:
  # Your Casdoor server url
  endpoint:
  client-id:
  client-secret:
  # The certificate may be multi-line, you can use `|-` for ease
  certificate: 
  # Your organization name added in Casdoor
  organization-name:
  # Your application name added in Casdoor
  application-name:
  # Doplhinscheduler login url
  redirect-url: http://localhost:5173/login 
```

# 贡献者列表

感谢@zhongjiajie对此次发版的指导，以及下列贡献者的支持：

> 106umao, Abingcbc, AliceXiaoLu, BongBongBang, CallMeKingsley97, Chris-Arith, DarkAssassinator, EricGao888, EricPyZhou, FlechazoW, Gallardot, GavinGYM, IT-Kwj, LiXuemin, LucasClt, Mukvin, NoSuchField, Orange-Summer, QuantumXiecao, Radeity, Rianico, SYSU-Coder, SbloodyS, Tianqi-Dotes, TyrantLucifer, ZhongJinHacker, Zzih, ahuljh, alei1206, alextinng, amaoisnb, arlendp, baihongbin, bmk15897, boy-xiaozhang, c3Vu, caishunfeng, calvinjiang, darrkz, davidzollo, dddyszy, devosend, ediconss, eye-gu, fengjian1129, fuchanghai, guowei-su, haibingtown, hantmac, hdygxsj, hezean, hiSandog, hoey94, hstdream, huage1994, imizao, insist777, iuhoay, jackfanwan, jbampton, jieguangzhou, kezhenxu94, kingbabingge, labbomb, lenian, ly109974, lynn-illumio, moonkop, muggleChen, pandong2011, pppppjcc, qianli2022, qindongliang, qingwli, rickchengx, ruanwenjun, sandiegoe, seedscoder, shangeyao, shenyun, simsicon, sketchmind, stalary, tracehh, whhe, xdu-chenrj, xiaomin0322, xinxingi, xuchunlai, xxjingcd, yeahhhz, youzipi, zhangfane, zhangkuantian, zhaohehuhu,zhoufanglu, zhuangchong, zhutong6688, zhuxt2015, zzzhangqi
