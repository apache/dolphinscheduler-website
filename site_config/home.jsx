export default {
  'zh-cn': {
    brand: {
      brandName: 'Apache DolphinScheduler',
      briefIntroduction: '分布式易扩展的可视化DAG工作流任务调度系统',
      buttons: [
        {
          text: '立即开始',
          link: '/zh-cn/docs/latest/user_doc/quick-start.html',
          type: 'primary',
        },
        {
          text: '查看GitHub',
          link: 'https://github.com/apache/dolphinscheduler',
          type: 'normal',
        },
      ],
      versionNote: {
        text: 'V1.1.0 版本说明',
        link: 'https://github.com/apache/dolphinscheduler/releases/tag/1.1.0',
      },
      releaseDate: '2019年08月05日发布',
    },
    introduction: {
      title: '分布式易扩展的可视化DAG工作流任务调度系统',
      desc: 'Apache DolphinScheduler是一个分布式去中心化，易扩展的可视化DAG工作流任务调度系统。致力于解决数据处理流程中错综复杂的依赖关系，使调度系统在数据处理流程中开箱即用。',
      img: '/img/framework.png',
    },
    features: {
      title: '特性一览',
      list: [
        {
          img: '/img/ha.png',
          title: '高可靠性',
          content: '去中心化的多Master和多Worker, 自身支持HA功能, 采用任务队列来避免过载，不会造成机器卡死',
        },
        {
          img: '/img/easyuse.png',
          title: '简单易用',
          content: 'DAG监控界面，所有流程定义都是可视化，通过拖拽任务完成定制DAG，通过API方式与第三方系统集成, 一键部署',
        },
        {
          img: '/img/scene.png',
          title: '丰富的使用场景',
          content: '支持暂停恢复操作. 支持多租户，更好的应对大数据的使用场景. 支持更多的任务类型，如:Spark, Hive, M/R, Python, Sub_process, Shell',
        },
        {
          img: '/img/scaleout.png',
          title: '高扩展性',
          content: '支持自定义任务类型，调度器使用分布式调度，调度能力随集群线性增长，Master和Worker支持动态上下线',
        },
      ],
    },
    events: {
      title: '事件 & 新闻',
      list: [
        {
          img: '/img/2020-05-26/live_online_20200526.jpeg',
          title: 'Apache DolphinScheduler(Incubating) 1.3.0新特性及Roadmap路线直播',
          content: 'Apache DolphinScheduler(Incubating) 1.3.0新特性及Roadmap路线在线直播，700多人在线',
          dateStr: '2020-05-26',
          link: '/zh-cn/blog/live_online_2020_05_26.html',
        },
        {
          img: '/img/2019-12-08/941576036700_.pic_hd.jpg',
          title: 'Apache ShardingSphere & DolphinScheduler联合Meetup成功举行',
          content: 'Apache ShardingSphere & DolphinScheduler联合Meetup 2019年12月8日在北京成功举行。',
          dateStr: '2019-12-13',
          link: '/zh-cn/blog/meetup_2019_12_08.html',
        },
        {
          img: '/img/meetup_20191026.jpg',
          title: 'Apache Dolphin Scheduler(Incubating) Meetup 成功举行',
          content: 'Apache Dolphin Scheduler(Incubating) Meetup 2019年10月26日在上海成功举行。',
          dateStr: '2019-9-27',
          link: '/zh-cn/blog/meetup_2019_10_26.html',
        },
        {
          img: '/img/architecture.jpg',
          title: '一个分布式易扩展的可视化DAG工作流任务调度系统',
          content: '一个分布式易扩展的可视化DAG工作流任务调度系统',
          dateStr: 'May 12nd，2018',
          link: '/zh-cn/blog/architecture-design.html',
        },
        {
          img: '/img/review_img4.png',
          title: 'DolphinScheduler 开发者大会在北京成功举行',
          content: 'DolphinScheduler 开发者大会在北京成功举行',
          dateStr: 'May 12nd，2018',
          link: '/zh-cn/development/architecture-design.html',
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
          link: '/en-us/docs/latest/user_doc/quick-start.html',
          type: 'primary',
        },
        {
          text: 'View on GitHub',
          link: 'https://github.com/apache/dolphinscheduler',
          type: 'normal',
        },
      ],
      versionNote: {
        text: 'Release Note of V1.1.0',
        link: 'https://github.com/apache/dolphinscheduler/releases/tag/1.1.0',
      },
      releaseDate: 'Released on Aug 05, 2019',
    },
    introduction: {
      title: 'A distributed and easy-to-extend visual workflow scheduler system',
      desc: 'Dedicated to solving the complex task dependencies in data processing, making the scheduler system out of the box for data processing. Its main objectives are as follows:',
      img: '/img/architecture-en.jpg',
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
    events: {
      title: 'Events & News',
      list: [
        {
          img: '/img/2021-03-16/boyi.png',
          title: '[ANNOUNCE] Welcome to our new committer: BoYiZhang',
          content: '[ANNOUNCE] Welcome to our new committer: BoYiZhang',
          dateStr: '2021-03-16',
          link: 'https://lists.apache.org/thread.html/rbd018b05da88d98f403dcd18098fa622c0c4c6db8d2b28c84028a818%40%3Cdev.dolphinscheduler.apache.org%3E',
        },
        {
          img: '/img/2020-05-26/live_online_20200526.jpeg',
          title: 'live online: Apache DolphinScheduler(Incubating) 1.3.0 new feature and Roadmap',
          content: 'live online: Apache DolphinScheduler(Incubating) 1.3.0 new feature and Roadmap，more than 700 people online',
          dateStr: '2020-05-26',
          link: '/zh-cn/blog/live_online_2020_05_26.html',
        },
        {
          img: '/img/2019-12-08/941576036700_.pic_hd.jpg',
          title: 'Apache ShardingSphere & DolphinScheduler joint Meetup',
          content: 'Apache ShardingSphere & DolphinScheduler Meetup successfully held in Beijing on December 8, 2019',
          dateStr: '2019-12-13',
          link: '/en-us/blog/meetup_2019_12_08.html',
        },
        {
          img: '/img/meetup_20191026.jpg',
          title: 'Apache Dolphin Scheduler(Incubating) Meetup has been held successfully',
          content: 'Apache Dolphin Scheduler(Incubating) Meetup has been held successfully in Shanghai 2019.10.26.',
          dateStr: '2019-9-27',
          link: '/en-us/blog/meetup_2019_10_26.html',
        },
        {
          img: '/img/architecture.jpg',
          title: 'A distributed and easy-to-extend visual workflow scheduler system.',
          content: 'A distributed and easy-to-extend visual workflow scheduler system.',
          dateStr: 'May 12nd，2018',
          link: '/en-us/blog/architecture-design.html',
        },
        {
          img: '/img/review_img4.png',
          title: 'DolphinScheduler beijing meetup has been held successfully',
          content: 'DolphinScheduler beijing meetup has been held successfully',
          dateStr: 'May 12nd，2018',
          link: '/en-us/development/architecture-design.html',
        },
      ],
    },
  },
};
