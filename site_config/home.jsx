import React from 'react';

export default {
  'zh-cn': {
    brand: {
      brandName: 'Apache DolphinScheduler',
      briefIntroduction: '分布式易扩展的可视化DAG工作流任务调度系统',
      buttons: [
        {
          text: '立即开始',
          link: '/zh-cn/docs/1.3.5/user_doc/quick-start.html',
          type: 'primary',
        },
        {
          text: '查看Github',
          link: 'https://github.com/apache/incubator-dolphinscheduler',
          type: 'normal',
        },
      ],
      versionNote: {
        text: 'V1.1.0 版本说明',
        link: 'https://github.com/apache/incubator-dolphinscheduler/releases/tag/1.1.0',
      },
      releaseDate: '2019年08月05日发布',
    },
    introduction: {
      title: '分布式易扩展的可视化DAG工作流任务调度系统',
      desc: 'Apache DolphinScheduler是一个分布式去中心化，易扩展的可视化DAG工作流任务调度系统。致力于解决数据处理流程中错综复杂的依赖关系，使调度系统在数据处理流程中开箱即用。',
      img: '/img/architecture.jpg',
    },
    features: {
      title: '特性一览',
      list: [
        {
          img: '/img/feature_loadbalances.png',
          title: '高可靠性',
          content: '去中心化的多Master和多Worker, 自身支持HA功能, 采用任务队列来避免过载，不会造成机器卡死',
        },
        {
          img: '/img/feature_hogh.png',
          title: '简单易用',
          content: 'DAG监控界面，所有流程定义都是可视化，通过拖拽任务定制DAG，通过API方式与第三方系统对接, 一键部署',
        },
        {
          img: '/img/feature_service.png',
          title: '丰富的使用场景',
          content: '支持暂停恢复操作. 支持多租户，更好的应对大数据的使用场景. 支持更多的任务类型，如 spark, hive, mr, python, sub_process, shell',
        },
        {
          img: '/img/feature_runtime.png',
          title: '高扩展性',
          content: '支持自定义任务类型，调度器使用分布式调度，调度能力随集群线性增长，Master和Worker支持动态上下线',
        },
      ],
    },
  },
  'en-us': {
    brand: {
      brandName: 'Apache DolphinScheduler',
      briefIntroduction: 'A distributed and easy-to-extend visual workflow scheduler system',
      buttons: [
        {
          text: 'Quick Start',
          link: '/en-us/docs/1.3.5/user_doc/quick-start.html',
          type: 'primary',
        },
        {
          text: 'View on Github',
          link: 'https://github.com/apache/incubator-dolphinscheduler',
          type: 'normal',
        },
      ],
      versionNote: {
        text: 'Release Note of V1.1.0',
        link: 'https://github.com/apache/incubator-dolphinscheduler/releases/tag/1.1.0',
      },
      releaseDate: 'Released on Aug 05, 2019',
    },
    introduction: {
      title: 'A distributed and easy-to-extend visual workflow scheduler system',
      desc: 'Dedicated to solving the complex task dependencies in data processing, making the scheduler system out of the box for data processing. Its main objectives are as follows:',
      img: '/img/architecture.jpg',
    },
    features: {
      title: 'Why DolphinScheduler',
      list: [
        {
          img: '/img/feature_loadbalances.png',
          title: 'High Reliability',
          content: 'Decentralized multi-master and multi-worker, HA is supported by itself, overload processing',
        },
        {
          img: '/img/feature_hogh.png',
          title: 'User-Friendly',
          content: 'All process definition operations are visualized, Visualization process defines key information at a glance, One-click deployment',
        },
        {
          img: '/img/feature_service.png',
          title: 'Rich Scenarios',
          content: 'Support pause, recover operation. Support multi-tenant. Support more task types e.g., spark, hive, mr, shell, python, sub_process',
        },
        {
          img: '/img/feature_runtime.png',
          title: 'High Expansibility',
          content: 'Support custom task types, Distributed scheduling, and the overall scheduling capability will increase linearly with the scale of the cluster',
        },
      ],
    },
  },
};
