---
title: 大数据调度最佳实践 |  从Airflow迁移到Apache DolphinScheduler
keywords: Apache DolphinScheduler, 迁移, Airflow
description: 有部分用户原来是使用 Airflow 作为调度系统的，但是由于 Airflow 只能通过代码来定义工作流，并且没有对资源、项目的粒度划分，导致在部分需要较强权限控制的场景下不能很好的贴合客户需求，所以部分用户需要将调度系统从 Airflow 迁移到 Apache Dolphinscheduler。
---

## 迁移背景

有部分用户原来是使用 Airflow 作为调度系统的，但是由于 Airflow 只能通过代码来定义工作流，并且没有对资源、项目的粒度划分，导致在部分需要较强权限控制的场景下不能很好的贴合客户需求，**所以部分用户需要将调度系统从 Airflow 迁移到 Apache Dolphinscheduler。**

![](/img/2023-10-25/1.png)

秉承着解决用户实际需求的角度出发，**Whaleops 研发了 Air2phin 迁移工具**，协助用户更好的迁移到 DolphinScheduler 中。由于 Airflow 是通过 python code 来定义工作流的，并且有部分元数据信息仅仅在 python code 中而不会持久化到数据库中，所以我们需要通过解析 python code 来完成分析和迁移的步骤

## 为什么要迁移到 DolphinScheduler

Airflow 和 DolphinScheduler 都是任务调度系统，都解决了任务编排的问题。两者各有优势，这个章节中我们仅介绍 DolphinScheduler 相对 Airflow 的优势，两者的对比文章我们会在以后详细对比的文章中描述：

1. 两者都是成熟的开源工作流调度系统，都有成熟的社区，细微的区别是
   - **Apache DolphinScheduler：**以可视化为主，API为辅，有更细粒度的权限管理，工作流层级更多，使用成本更加低，数据平民化
   - **Airflow：**以代码定义工作流， 编写工作流为高级研发，灵活性较高，但是使用成本更高，基本上是面向研发人员
2. **DolphinScheduler** 因为将工作流定义、任务定义、任务关系都存储到原数据库中，所以
   - 在增减 master worker 节点时没有额外的操作，airflow 在增加 master 和 worker 节点时，需要将 dags 文件复制到新的节点中
   - 同时由于存在解析文件获取工作流、任务的过程，没有新增、更改任务的延时，自然也不需要为了降低延时而牺牲 CPU 性能的说法。airflow 是使用 loop 的方式发现和调度 DAGs 的，所以在 loop 的时候 scheduler 会消耗较多的 cpu 资源
   - 能保留完整的历史工作流、任务运行状态。airflow 如果最新的定义中删除了部分任务，则不能找到这些任务的历史状态和日志
   - 原生支持版本的信息。airflow 的 DAGs 定义需要在 git log 中查找，revert 也需要通过 git
3. DolphinScheduler 支持资源中心，更加方便用户管理、组织包括本地和远程的资源文件。airflow 如果有外部资源的话，一般需要和git 一起托管在版本控制中
4. 除开离线调度任务的工作外，DolphinScheduler 还支持实时任务、数据资料、对物理机器资源的监控等调度相关的实用功能。airflow 目前来说更加专注的是离线工作流调度
5. DolphinScheduler 是一个分布式，无中心的系统，master 的服务器资源利用率更高，Airflow 由于通过 scheduler 扫描并发现可调度任务，CPU 利用率没有 DolphinScheduler 高。详见 [AWS 性能测评](http://conf.whaleops.com:8090/pages/viewpage.action?pageId=20103497)

## 诉求及挑战

### 诉求

作为一个迁移工具，其核心诉求就是希望能在人为介入尽可能少的情况下，实现将 Airflow DAGs 转化成 DolphinScheduler 中工作流的迁移。

但是这需要有一个较好平衡，不能一味追求自动化，不然可能会导致程序复杂、可维护性降低、泛化能力变弱等情况，特别是我们需要去兼容不同 Airflow 版本的时候，如何取舍就是是 air2phin 必须面对的一个问题。

### 挑战

- **语法差异**：Airflow 和 DolphinScheduler Python SDK 在基础的 Python 语法（for、if、else）上都是一样的，但是在具体的任务名称和参数上稍有不同，如 airflow 中的 bash operator 对应到 DolphinScheduler Python SDK 的名称是 Shell， 同时两者的参数也不一样，迁移需要兼容这部分逻辑
- **任务类型差异**：Airflow 和 DolphinScheduler 可能都允许用户进行一定程度的定制化扩展，如自定义插件。但是两者在在任务类型的数量和对任务的封装抽象是有差异，有部分任务类型仅在 airflow 存在，有部分任务类型仅在 DolphinScheduler 中存在，转换的时候需要处理这部分差异
- **定时调度差异**：Airflow 定义调度周期的时候使用 Cron 表达式（如 5 4 * * *）或者 Python 的 datetime.timedelta ，DolphinScheduler 使用的是更加精细化的 Cron 表达式，如   
  0 5 4 * * ? * 所以这部分的转换也是挑战
- **内置时间参数差异**：Airflow 的内置时间参数是通过 macro 来处理的，并且提供了 jinja2 模版作为时间的计算，如 ds_add('2015-01-06', -5)。DolphinScheduler 有自己的内置时间定义和计算规则，如运行时间使用 yyyy-MM-dd，需要时间增减使用 yyyy-MM-dd+1
- **迁移规则的扩展**：不管是 Airflow 和 DolphinScheduler Python SDK 都会随着时间而修改对应的 API，只有有不兼容的修改就会导致迁移工具失效，所以迁移工具规则的修改和新增需要尽可能简单，尽量减少维护成本
- **不同版本的Airflow**：Airflow 的不同版本之间可能也有差异，如在 2.0.0 之前有 airflow.operators.bash_operator 但是到2.0.0 后我们只有 airflow.operators.bash

## 迁移工具介绍

### Air2phin 是什么

Air2phin 是一个基于规则的 AST 转换器，提供了从 Airflow dag 文件转成 pydolphinscheudler 定义文件的功能。其使用 LibCST 解析和转换 Python 代码，并使用 Yaml 文件定义转换规则。他是一个协助用户完成转化的工具，并非是一键转化工具。

### Air2phin 的数据流转图

![data flow](/img/2023-10-25/2.png)

- 从标准输入或者文件中获取原来 airflow DAGs 的定义
- 将转换规则从 YAML 文件加载到 air2phin
- 将 airflow DAGs 内容解析为 CST 树
- 根据转换规则改变 CST 树
- 将转换后的结果输出到标准输出或者文件

### Air2phin 如何使用

由于 Air2phin 是 Python 的包，所以需要通过 pip 安装，安装结束后可以通过命令 air2phin migrate ~/airflow/dags 将 airflow 全部的 dags 转换成 DolphinScheduler Python SDK 的定义到了这一步 air2phin 的使命已经完成了，最后只需要使用 Python 执行这部分 SDK 的代码就能将转化后的工作流提交到 DolphinScheduler

```
# Install package
python -m pip install --upgrade air2phin

# Migrate airflow‘s dags
air2phin migrate -i ~/airflow/dags
```

在实际生产中， ~/airflow/dags 下面可能有非常多的 DAG， 而 air2phin 默认是串行处理这部分 DAG 的，如果你想要更加高效的处理，可以使用 --multiprocess <core-num> 让 air2phin 可以多进程执行转换。

```
# use multiprocess to convert the airflow dags files
air2phin migrate -i --multiprocess 12 ~/airflow/dags 
```

完成了上述的转化后，你就完成了从 Airflow dags 文件到 DolphinScheduler python sdk 定义脚本的转化，只需要将 DolphinScheduler python sdk 提交到 DolphinSchedeuler 中即可完成

```
# Install apache-dolphinscheduler according to apache DolphinScheduler server you use, ref: https://dolphinscheduler.apache.org/python/main/#version
python -m pip install apache-dolphinscheduler
# Submit your dolphinscheduler python sdk definition
python ~/airflow/dags/tutorial.py
```

### Air2phin 如何定义自己的转换规则

大部分 Airflow 的用户都会自定义部分 operator，想要转化这部分的 operator 需要用户自定义规则，幸运的 Air2phin 的规则是基于 YAML 文件的，意味用户可以较为简单的新增规则。下面是一个用户客户自定义的 Redshift operator 转化成 DolphinScheduler SQL 任务类型的规则转换 YAML 文件。

这里假设用户基于 airflow.providers.postgres.operators.postgres 自定义了一个 redshift operator，其 operator 的代码如下

```
from airflow.providers.postgres.operators.postgres import PostgresOperator

class RedshiftOperator(PostgresOperator):
    def __init__(
        self,
        *,
        sql: str | Iterable[str],
        my_custom_conn_id: str = 'postgres_default',
        autocommit: bool = False,
        parameters: Iterable | Mapping | None = None,
        database: str | None = None,
        runtime_parameters: Mapping | None = None,
        **kwargs,
    ) -> None:
        super().__init__(
            sql=sql,
            postgres_conn_id=my_custom_conn_id,
            autocommit=autocommit,
            parameters=parameters,
            database=database,
            runtime_parameters=runtime_parameters,
            **kwargs,
        )
```

由于这是用户自定义的 operator，他肯定不在 air2phin 内置的转换规则中，所以我们需要自定义一个转换规则的 YAML 文件

```
name: RedshiftOperator

migration:
  module:
    - action: replace
      src: utils.operator.RedshiftOperator.RedshiftOperator
      dest: pydolphinscheduler.tasks.sql.Sql
    - action: add
      module: pydolphinscheduler.resources_plugin.Local
  parameter:
    - action: replace
      src: task_id
      dest: name
    - action: add
      arg: datasource_name
      default:
        type: str
        value: "redshift_read_conn"
    - action: add
      arg: resource_plugin
      default: 
        type: code
        value: Local(prefix="/path/to/dir/")
```

客户只需要将这个文件加入 air2phin 的规则路径下，就能实现该自定义 operator 的转化动作了。

```
air2phin migrate --custom-rules /path/to/RedshiftOperator.yaml ~/airflow/dags
```

### Air2phin 如何解决迁移的挑战

前面提到了 Airflow 到 Dolophinscheduler 可能面临的挑战，下面来看看 Air2phin 是如何解决的

#### 语法差异

由于 Airflow 和 DolphinScheduler Python SDK 都是使用 Python 编写的。所以 Python 相关的基础语法是相似。但是由于 Airflow 和 DolphinScheduler Python SDK是两套无关联的 API， 所以两者在特定参数、类和函数等方面存在一些不同之处。air2phin 就是用来解决这个问题的，他通过定义适当的 YAML 这部分差异的转换规则，解决差异并实现从一个平台迁移到另一个平台的流程。

**YAML文件转换规则：**

- **参数映射：** 对于参数的不同命名或结构，可以在 YAML 文件中定义映射规则，将 Airflow 的参数名称映射到 DolphinScheduler Python SDK 的对应参数。
- **类和函数转换：** 如果 Airflow 和 DolphinScheduler Python SDK 使用不同的类名或函数，可以在YAML文件中定义类和函数的转换规则，将 Airflow 的类名和函数映射到 DolphinScheduler Python SDK 的等效项。
- **错误处理和告警：** 鉴于两个平台可能有不同的错误处理和告警机制，可以在YAML文件中定义如何映射Airflow的错误处理到DolphinScheduler的等效机制。

通过制定这些转换规则，可以确保在迁移过程中，根据 YAML 文件的定义，将 Airflow 的任务代码转换成 DolphinScheduler Python SDK 平台所需的代码，以适应平台之间的差异，并确保新增和修改任务的灵活性。任务类型差异

#### 定时调度差异

在定时调度配置方面，Airflow 和 DolphinScheduler Python SDK 也存在一些区别。Airflow 使用标准的 Cron 表达式来定义任务的定时调度，而 DolphinScheduler Python SDK 采用了更加精确的 Cron 调度策略。这种差异可能会影响任务的精确调度和执行频率。

- **Airflow的Cron表达式：** Airflow使用通用的Cron表达式来定义任务的调度频率。Cron表达式由五个或六个字段组成，分别表示分钟、小时、日期、月份、星期。它允许用户定义相对宽松的调度规则，例如每小时一次、每天一次等。
- **DolphinScheduler Python SDK 的精确Cron调度**： DolphinScheduler则引入了更加精确的Cron调度策略。它将Cron表达式分成两部分：基本Cron和高级Cron。基本Cron用于定义任务的粗略调度规则，如分钟、小时、日期等。而高级Cron则用于定义更精确的调度规则，包括秒级精度等。这使得DolphinScheduler可以实现更细粒度的任务调度，适用于对执行时间要求更高的场景，如金融领域等。

由于 DolphinScheduler Python SDK 的精度比 Airflow 的精度高，所以转化的时候不会存在精度丢失的问题，这个问题也就迎刃而解了。

#### 内置时间参数差异

内置时间参数差异指的是 Airflow 和 DolphinScheduler Python SDK 在任务调度中使用内置时间参数的不同方式。Airflow使用Jinja2的宏（macros）功能来实现内置时间参数，而DolphinScheduler的Python SDK 使用自定义的方式来实现这些参数。这两种实现方法可能会导致使用和理解上的差异。

- **Airflow的Jinja2宏**： Airflow的内置时间参数是通过Jinja2宏来实现的。Jinja2宏允许在DAGs文件中使用特殊的占位符和函数，用于动态地生成调度时间。例如，可以使用`{{ macros.ds_add(ds, 1) }}`来在调度时间上加一天。
- **DolphinScheduler Python SDK的自定义实现**： DolphinScheduler的Python SDK在实现内置时间参数时，可能会使用一些自定义的函数或类，而不是直接使用Jinja2宏。这些自定义的实现方法可能需要在DolphinScheduler平台上进行特定的配置和处理。

所以迁移的时候需要注意：

1. **语法和方式不同**： Airflow 的 Jinja2 宏在语法和使用方式上与 DolphinScheduler Python SDK 的自定义实现有很大的区别，可能导致部分时间参数不能被正确迁移。Air2phin 对于部分不能自动迁移的参数会保留其原本的值

2. **功能相似性：** 尽管实现方式不同，但两者都旨在为任务调度提供内置时间参数。确保迁移后的任务能够正确地使用新平台的内置时间参数。

#### 迁移规则的扩展

Airflow允许用户根据需要定义和使用自定义Operator、Hook、Sensor等，以满足特定的任务需求。这些自定义组件可能在 DAGs 中使用，而且它们的实现和调用方式可能在迁移过程中需要特殊处理。最简单的处理方式是使用上问提到的 “Air2phin 如何定义自己的转换规则” 的方式处理。只要自定义的任务在 DolphinScheduler 中可以被定义，那就能将任务从 Airflow 迁移到 DolphinScheduler

#### 不同版本的 Airflow 迁移

不同版本的 Airflow 在 operator 的语法中有所不同，在 2.0.0 之前的版本中，Airflow 对 bash 的支持仅拥有 airflow.operators.bash\_operator.BashOperator 这个类，但是在 2.0.0 及之后的版本，Airflow 对 bash 更加推荐的是 airflow.operators.bash.BashOperator 这里类，同时兼容 Airflow.operators.bash\_operator.BashOperator。类似的情况还有很多，所以 Air2phin 需要同时兼容上述两种类型转换成 DolphinScheduler 的 shell 任务类型。我们通过在 YAML 中支持列表的方式实现对多个类转化，详见下面的 migration.module.* 节点

```
migration:
  module:
    - action: replace
      src:
        - airflow.operators.bash.BashOperator
        - airflow.operators.bash_operator.BashOperator
      dest: pydolphinscheduler.tasks.shell.Shell
  parameter:
    - action: replace
      src: task_id
      dest: name
    - action: replace
      src: bash_command
      dest: command
```

### 用户收益

Air2phin 迁移工具可以通过简单的配置实现用户从 Airflow 的 DAGs 代码转换为 DolphinScheduler Python SDK， 给用户带来了很多收益

- **简化迁移过程：** 迁移工具可以自动处理代码转换，避免手动逐行迁移的复杂过程，大大减轻了开发人员的工作负担。
- **节省时间和成本**： 手动迁移代码需要投入大量时间和人力资源。使用迁移工具可以快速、高效地完成迁移，从而节省时间和成本。
- **减少错误**： 手动迁移容易引入错误，而迁移工具可以基于预定义规则自动进行转换，减少了潜在的人为错误。
- **规范代码风格**： 迁移工具可以根据预定义的规则和模板生成代码，确保代码风格一致，降低维护成本。
- **降低技术门槛：** 迁移工具可以隐藏底层技术细节，使得不熟悉 DolphinScheduler 的开发人员也能够轻松迁移任务。
- **灵活性和可定制性**： 好的迁移工具通常会提供一些可定制的选项，以满足不同项目的需求，同时保持灵活性。

总的来说，使用 Air2phin 可以显著提升迁移过程的效率和质量，降低风险，同时减轻了开发人员的工作负担，为团队带来了时间和资源的节省，以及更好的开发体验。

### Air2phin 目前还不能解决的问题

Air2phin 是一个协助用户更简单从 Airflow 迁移到Apache DolphinScheduler 。这个的关键词是“协助”，意味着他能减少用户的迁移成本，但是并不能完全自动化。目前已知的不能解决的问题如下：

- **不能迁移在 DolphinScheduler 不存在的任务类型**：部分任务类型仅在 Airflow 中存在，但是在 DolphinScheduler 不存在，这部分任务不能被自动迁移，需要手动处理。如 Discord operator 中在 DolphinScheduler 中不存在，所以原来 Discord operator 定义会被保留，需要用户手动处理
- **部分任务属性不能被迁移到 DolphinScheduler**：Airflow 中部分任务属性在 DolphinScheduler 中不存在，如 successc\_callback 和 retry\_callback，这部分属性在迁移过程中会被直接遗弃

## REF

- air2phin 使用文档：[https://air2phin.readthedocs.io/en/latest/index.html](https://air2phin.readthedocs.io/en/latest/index.html)
- air2phin in PyPI: [https://pypi.org/project/air2phin/](https://pypi.org/project/air2phin/)
- air2phin GitHub repository: [https://github.com/WhaleOps/air2phin](https://github.com/WhaleOps/air2phin)