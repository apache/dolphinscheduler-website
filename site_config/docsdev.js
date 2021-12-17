export default {
  'en-us': {
    sidemenu: [
      {
        title: 'User Manual',
        children: [
          {
            title: 'Introduction',
            link: '/en-us/docs/dev/user_doc/guide/introduction.html',
          },
          {
            title: 'Quick Start',
            link: '/en-us/docs/dev/user_doc/guide/quick-start.html',
          },
          {
            title: 'Installation',
            children: [
              {
                title: 'Hardware Environment',
                link: '/en-us/docs/dev/user_doc/guide/installation/hardware.html',
              },
              {
                title: 'Standalone Deployment',
                link: '/en-us/docs/dev/user_doc/guide/installation/standalone.html',
              },
              {
                title: 'Cluster Deployment',
                link: '/en-us/docs/dev/user_doc/guide/installation/cluster.html',
              },
              {
                title: 'Docker Deployment',
                link: '/en-us/docs/dev/user_doc/guide/installation/docker.html',
              },
              {
                title: 'Kubernetes Deployment',
                link: '/en-us/docs/dev/user_doc/guide/installation/kubernetes.html',
              },
              {
                title: 'SkyWalking-Agent Deployment',
                link: '/en-us/docs/dev/user_doc/guide/installation/skywalking-agent.html',
              },
            ],
          },
          {
            title: 'Workflow Overview',
            link: '/en-us/docs/dev/user_doc/guide/homepage.html',
          },
          {
            title: 'Project',
            link: '/en-us/docs/dev/user_doc/guide/project.html',
          },
          {
            title: 'Task',
            children: [
              {
                title: 'Shell',
                link: '/en-us/docs/dev/user_doc/guide/task/shell.html',
              },
              {
                title: 'SubProcess',
                link: '/en-us/docs/dev/user_doc/guide/task/sub-process.html',
              },
              {
                title: 'Dependent',
                link: '/en-us/docs/dev/user_doc/guide/task/dependent.html',
              },
              {
                title: 'Stored Procedure',
                link: '/en-us/docs/dev/user_doc/guide/task/stored-procedure.html',
              },
              {
                title: 'SQL',
                link: '/en-us/docs/dev/user_doc/guide/task/sql.html',
              },
              {
                title: 'Spark',
                link: '/en-us/docs/dev/user_doc/guide/task/spark.html',
              },
              {
                title: 'MapReduce',
                link: '/en-us/docs/dev/user_doc/guide/task/map-reduce.html',
              },
              {
                title: 'Python',
                link: '/en-us/docs/dev/user_doc/guide/task/python.html',
              },
              {
                title: 'Flink',
                link: '/en-us/docs/dev/user_doc/guide/task/flink.html',
              },
              {
                title: 'HTTP',
                link: '/en-us/docs/dev/user_doc/guide/task/http.html',
              },
              {
                title: 'DataX',
                link: '/en-us/docs/dev/user_doc/guide/task/datax.html',
              },
              {
                title: 'Conditions',
                link: '/en-us/docs/dev/user_doc/guide/task/conditions.html',
              },
              {
                title: 'Pigeon',
                link: '/en-us/docs/dev/user_doc/guide/task/pigeon.html',
              },
            ],
          },
          {
            title: 'Parameter',
            children: [
              {
                title: 'Built-in Parameter',
                link: '/en-us/docs/dev/user_doc/guide/parameter/built-in.html',
              },
              {
                title: 'Global Parameter',
                link: '/en-us/docs/dev/user_doc/guide/parameter/global.html',
              },
              {
                title: 'Local Parameter',
                link: '/en-us/docs/dev/user_doc/guide/parameter/local.html',
              },
              {
                title: 'Parameter Context',
                link: '/en-us/docs/dev/user_doc/guide/parameter/context.html',
              },
              {
                title: 'Parameter Priority',
                link: '/en-us/docs/dev/user_doc/guide/parameter/priority.html',
              },
            ],
          },
          {
            title: 'Data Source',
            children: [
              {
                title: 'Introduction',
                link: '/en-us/docs/dev/user_doc/guide/datasource/introduction.html',
              },
              {
                title: 'MySQL',
                link: '/en-us/docs/dev/user_doc/guide/datasource/mysql.html',
              },
              {
                title: 'PostgreSQL',
                link: '/en-us/docs/dev/user_doc/guide/datasource/postgresql.html',
              },
              {
                title: 'HIVE',
                link: '/en-us/docs/dev/user_doc/guide/datasource/hive.html',
              },
              {
                title: 'Spark',
                link: '/en-us/docs/dev/user_doc/guide/datasource/spark.html',
              },
            ],
          },
          {
            title: 'Resource',
            link: '/en-us/docs/dev/user_doc/guide/resource.html',
          },
          {
            title: 'Monitor',
            link: '/en-us/docs/dev/user_doc/guide/monitor.html',
          },
          {
            title: 'Security',
            link: '/en-us/docs/dev/user_doc/guide/security.html',
          },
          {
            title: 'Open API',
            link: '/en-us/docs/dev/user_doc/guide/open-api.html',
          },
          {
            title: 'Flink',
            link: '/en-us/docs/dev/user_doc/guide/flink-call.html',
          },
        ],
      },
      {
        title: 'Architecture Design',
        children: [
          {
            title: 'Metadata',
            link: '/en-us/docs/dev/user_doc/architecture/metadata.html',
          },
          {
            title: 'Architecture Design',
            link: '/en-us/docs/dev/user_doc/architecture/design.html',
          },
          {
            title: 'Configuration File',
            link: '/en-us/docs/dev/user_doc/architecture/configuration.html',
          },
          {
            title: 'Task Structure',
            link: '/en-us/docs/dev/user_doc/architecture/task-structure.html',
          },
          {
            title: 'Load Balance',
            link: '/en-us/docs/dev/user_doc/architecture/load-balance.html',
          },
        ],
      },
      {
        title: 'Integration',
        children: [
          {
            title: 'Ambari Integration',
            link: '/en-us/docs/dev/user_doc/integration/ambari.html',
          },
        ],
      },
      {
        title: 'Upgrade',
        children: [
          {
            title: 'Upgrade',
            link: '/en-us/docs/dev/user_doc/upgrade.html',
          },
        ],
      },
      {
        title: 'Expansion/Reduction',
        children: [
          {
            title: 'Capacity expansion and reduction',
            link: '/en-us/docs/dev/user_doc/expansion-reduction.html',
          },
        ],
      },
      {
        title: 'FAQ',
        children: [
          {
            title: 'FAQ',
            link: '/en-us/docs/release/faq.html',
          },
        ],
      },
      {
        title: 'To be Classification',
        children: [
          {
            title: 'Dev-Quick-Start',
            link: '/en-us/docs/dev/user_doc/dev_quick_start.html',
          },
          {
            title: 'Alert-SPI',
            link: '/en-us/docs/dev/user_doc/alert_spi.html',
          },
          {
            title: 'Registry-SPI',
            link: '/en-us/docs/dev/user_doc/registry_spi.html',
          },
          {
            title: 'Global-Params',
            link: '/en-us/docs/dev/user_doc/globalParams.html',
          },
          {
            title: 'Dev-Run',
            link: '/en-us/docs/dev/user_doc/dev_run.html',
          },
        ],
      },
    ],
    barText: 'Documentation',
  },
  'zh-cn': {
    sidemenu: [
      {
        title: '用户手册',
        children: [
          {
            title: '简介',
            link: '/zh-cn/docs/dev/user_doc/guide/introduction.html',
          },
          {
            title: '快速上手',
            link: '/zh-cn/docs/dev/user_doc/guide/quick-start.html',
          },
          {
            title: '部署',
            children: [
              {
                title: '软硬件环境建议配置',
                link: '/zh-cn/docs/dev/user_doc/guide/installation/hardware.html',
              },
              {
                title: '单机部署(Standalone)',
                link: '/zh-cn/docs/dev/user_doc/guide/installation/standalone.html',
              },
              {
                title: '集群部署(Cluster)',
                link: '/zh-cn/docs/dev/user_doc/guide/installation/cluster.html',
              },
              {
                title: 'Docker部署(Docker)',
                link: '/zh-cn/docs/dev/user_doc/guide/installation/docker.html',
              },
              {
                title: 'Kubernetes部署(Kubernetes)',
                link: '/zh-cn/docs/dev/user_doc/guide/installation/kubernetes.html',
              },
              {
                title: 'SkyWalking-Agent部署(SkyWalking)',
                link: '/zh-cn/docs/dev/user_doc/guide/installation/skywalking-agent.html',
              },
            ],
          },
          {
            title: '指标总览',
            link: '/zh-cn/docs/dev/user_doc/guide/homepage.html',
          },
          {
            title: '项目管理',
            link: '/zh-cn/docs/dev/user_doc/guide/project.html',
          },
          {
            title: '任务类型',
            children: [
              {
                title: 'Shell',
                link: '/zh-cn/docs/dev/user_doc/guide/task/shell.html',
              },
              {
                title: 'SubProcess',
                link: '/zh-cn/docs/dev/user_doc/guide/task/sub-process.html',
              },
              {
                title: 'Dependent',
                link: '/zh-cn/docs/dev/user_doc/guide/task/dependent.html',
              },
              {
                title: 'Stored Procedure',
                link: '/zh-cn/docs/dev/user_doc/guide/task/stored-procedure.html',
              },
              {
                title: 'SQL',
                link: '/zh-cn/docs/dev/user_doc/guide/task/sql.html',
              },
              {
                title: 'Spark',
                link: '/zh-cn/docs/dev/user_doc/guide/task/spark.html',
              },
              {
                title: 'MapReduce',
                link: '/zh-cn/docs/dev/user_doc/guide/task/map-reduce.html',
              },
              {
                title: 'Python',
                link: '/zh-cn/docs/dev/user_doc/guide/task/python.html',
              },
              {
                title: 'Flink',
                link: '/zh-cn/docs/dev/user_doc/guide/task/flink.html',
              },
              {
                title: 'HTTP',
                link: '/zh-cn/docs/dev/user_doc/guide/task/http.html',
              },
              {
                title: 'DataX',
                link: '/zh-cn/docs/dev/user_doc/guide/task/datax.html',
              },
              {
                title: 'Conditions',
                link: '/zh-cn/docs/dev/user_doc/guide/task/conditions.html',
              },
              {
                title: 'Pigeon',
                link: '/zh-cn/docs/dev/user_doc/guide/task/pigeon.html',
              },
            ],
          },
          {
            title: '参数',
            children: [
              {
                title: '内置参数',
                link: '/zh-cn/docs/dev/user_doc/guide/parameter/built-in.html',
              },
              {
                title: '全局参数',
                link: '/zh-cn/docs/dev/user_doc/guide/parameter/global.html',
              },
              {
                title: '本地参数',
                link: '/zh-cn/docs/dev/user_doc/guide/parameter/local.html',
              },
              {
                title: '参数传递',
                link: '/zh-cn/docs/dev/user_doc/guide/parameter/context.html',
              },
              {
                title: '参数优先级',
                link: '/zh-cn/docs/dev/user_doc/guide/parameter/priority.html',
              },
            ],
          },
          {
            title: '数据源中心',
            children: [
              {
                title: '简介',
                link: '/zh-cn/docs/dev/user_doc/guide/datasource/introduction.html',
              },
              {
                title: 'MySQL',
                link: '/zh-cn/docs/dev/user_doc/guide/datasource/mysql.html',
              },
              {
                title: 'PostgreSQL',
                link: '/zh-cn/docs/dev/user_doc/guide/datasource/postgresql.html',
              },
              {
                title: 'HIVE',
                link: '/zh-cn/docs/dev/user_doc/guide/datasource/hive.html',
              },
              {
                title: 'Spark',
                link: '/zh-cn/docs/dev/user_doc/guide/datasource/spark.html',
              },
            ],
          },
          {
            title: '资源中心',
            link: '/zh-cn/docs/dev/user_doc/guide/resource.html',
          },
          {
            title: '监控中心',
            link: '/zh-cn/docs/dev/user_doc/guide/monitor.html',
          },
          {
            title: '安全中心',
            link: '/zh-cn/docs/dev/user_doc/guide/security.html',
          },
          {
            title: 'API调用',
            link: '/zh-cn/docs/dev/user_doc/guide/open-api.html',
          },
          {
            title: 'Flink调用',
            link: '/zh-cn/docs/dev/user_doc/guide/flink-call.html',
          },
        ],
      },
      {
        title: '架构设计',
        children: [
          {
            title: '元数据文档',
            link: '/zh-cn/docs/dev/user_doc/architecture/metadata-1.3.html',
          },
          {
            title: '架构设计',
            link: '/zh-cn/docs/dev/user_doc/architecture/design.html',
          },
          {
            title: '配置文件',
            link: '/zh-cn/docs/dev/user_doc/architecture/configuration.html',
          },
          {
            title: '任务结构',
            link: '/zh-cn/docs/dev/user_doc/architecture/task-structure.html',
          },
          {
            title: '负载均衡',
            link: '/zh-cn/docs/dev/user_doc/architecture/load-balance.html',
          },
        ],
      },
      {
        title: '版本升级',
        children: [
          {
            title: '升级',
            link: '/zh-cn/docs/dev/user_doc/upgrade.html',
          },
        ],
      },
      {
        title: '扩/缩容',
        children: [
          {
            title: '扩/缩容',
            link: '/zh-cn/docs/dev/user_doc/expansion-reduction.html',
          },
        ],
      },
      {
        title: 'FAQ',
        children: [
          {
            title: 'FAQ',
            link: '/zh-cn/docs/release/faq.html',
          },
        ],
      },
      {
        title: '待分类文档',
        children: [
          {
            title: 'Dev-Quick-Start',
            link: '/zh-cn/docs/dev/user_doc/dev_quick_start.html',
          },
          {
            title: 'Alert-SPI',
            link: '/zh-cn/docs/dev/user_doc/alert_spi.html',
          },
          {
            title: 'Registry-SPI',
            link: '/zh-cn/docs/dev/user_doc/registry_spi.html',
          },
          {
            title: 'Task-SPI',
            link: '/zh-cn/docs/dev/user_doc/task_spi.html',
          },
          {
            title: 'Global-Params',
            link: '/zh-cn/docs/dev/user_doc/globalParams.html',
          },
          {
            title: 'Switch-Node',
            link: '/zh-cn/docs/dev/user_doc/switch_node.html',
          },
          {
            title: 'Dev-Run',
            link: '/zh-cn/docs/dev/user_doc/dev_run.html',
          },
        ],
      },
    ],
    barText: '文档',
  },
};
