export default {
  'zh-cn': {
    brand: {
      brandName: 'Apache DolphinScheduler',
      briefIntroduction: '分布式易扩展的可视化工作流任务调度平台',
      buttons: [
        {
          text: '立即开始',
          link: '/zh-cn/docs/latest/user_doc/guide/quick-start.html',
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
      title: '分布式易扩展的可视化工作流任务调度平台',
      desc: 'Apache DolphinScheduler是一个分布式去中心化，易扩展的可视化DAG工作流任务调度平台。致力于解决数据处理流程中错综复杂的依赖关系，使调度系统在数据处理流程中开箱即用。',
      img: '/img/archdiagram_zh.svg',
    },
    features: {
      title: '特性一览',
      list: [
        {
          img: '/img/ha.png',
          title: '高可靠性',
          content: '去中心化的多Master和多Worker服务对等架构, 避免单Master压力过大，另外采用任务缓冲队列来避免过载',
        },
        {
          img: '/img/easyuse.png',
          title: '简单易用',
          content: 'DAG监控界面，所有流程定义都是可视化，通过拖拽任务完成定制DAG，通过API方式与第三方系统集成, 一键部署',
        },
        {
          img: '/img/scene.png',
          title: '丰富的使用场景',
          content: '支持多租户，支持暂停恢复操作. 紧密贴合大数据生态，提供Spark, Hive, M/R, Python, Sub_process, Shell等近20种任务类型',
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
          img: '/img/3-16/1.png',
          title: '杭州思科对 Apache DolphinScheduler Alert 模块的改造',
          content: '杭州思科已经将 Apache DolphinScheduler 引入公司自建的大数据平台..',
          dateStr: '2022-3-7',
          link: '/zh-cn/blog/Hangzhou_cisco.md.html',
        },
        {
          img: '/img/2022-3-11/1.jpeg',
          title: '日均处理 10000+ 工作流实例，Apache DolphinScheduler 在 360 数科的实践',
          content: '从 2020 年起，360 数科全面将调度系统从 Azkaban 迁移到 Apache DolphinScheduler...',
          dateStr: '2022-3-15',
          link: '/zh-cn/blog/How_Does_360_DIGITECH_process_10_000+_workflow_instances_per_day.html',
        },
        {
          img: '/img/2022-3-9/1.jpeg',
          title: '途家大数据平台基于 Apache DolphinScheduler 的探索与实践',
          content: '途家在 2019 年引入 Apache DolphinScheduler，在不久前的 Apache DolphinScheduler 2...',
          dateStr: '2022-3-10',
          link: '/zh-cn/blog/Exploration_and_practice_of_Tujia_Big_Data_Platform_Based.html',
        },
      ],
    },
    ourusers: {
      title: '我们的用户',
      list: [
        {
          img: '/img/ourusers/IBM@2x.png',
        },
        {
          img: '/img/ourusers/tencent@2x.png',
        },
        {
          img: '/img/ourusers/qianxin@2x.png',
        },
        {
          img: '/img/ourusers/chinaunicom@2x.png',
        },
        {
          img: '/img/ourusers/chinatelecom@2x.png',
        },
        {
          img: '/img/ourusers/migu@2x.png',
        },
        {
          img: '/img/ourusers/zhaoshangyinhang@2x.png',
        },
        {
          img: '/img/ourusers/ICBC@2x.png',
        },
        {
          img: '/img/ourusers/pingan@2x.png',
        },
        {
          img: '/img/ourusers/asiainfo@2x.png',
        },
        {
          img: '/img/ourusers/inspur@2x.png',
        },
        {
          img: '/img/ourusers/lenovo@2x.png',
        },
        {
          img: '/img/ourusers/nokia@2x.png',
        },
        // {
        //   img: '/img/ourusers/bonc@2x.png',
        // },
        {
          img: '/img/ourusers/accenture@2x.png',
        },
        {
          img: '/img/ourusers/changan@2x.png',
        },
        {
          img: '/img/ourusers/yiguanshuju@2x.png',
        },
        {
          img: '/img/ourusers/duodian@2x.png',
        },
        {
          img: '/img/ourusers/edaijia@2x.png',
        },
        {
          img: '/img/ourusers/energymonst@2x.png',
        },
        {
          img: '/img/ourusers/iflytek@2x.png',
        },
        {
          img: '/img/ourusers/kingsoft@2x.png',
        },
        {
          img: '/img/ourusers/mangguotv@2x.png',
        },
        {
          img: '/img/ourusers/fenghuangjinrong@2x.png',
        },
        {
          img: '/img/ourusers/meituan@2x.png',
        },
        {
          img: '/img/ourusers/shunfeng@2x.png',
        },
        {
          img: '/img/ourusers/JD@2x.png',
        },
        {
          img: '/img/ourusers/walmart@2x.png',
        },
        {
          img: '/img/ourusers/xindongfang@2x.png',
        },
        {
          img: '/img/ourusers/xueqiu@2x.png',
        },
        {
          img: '/img/ourusers/2345@2x.png',
        },
        {
          img: '/img/ourusers/baiwangyun@2x.png',
        },
        {
          img: '/img/ourusers/belle@2x.png',
        },
        {
          img: '/img/ourusers/erweihuo@2x.png',
        },
        {
          img: '/img/ourusers/guanyuanshuju@2x.png',
        },
        {
          img: '/img/ourusers/shein@2x.png',
        },
        {
          img: '/img/ourusers/shenmachuxing@2x.png',
        },
        {
          img: '/img/ourusers/yiqixiu@2x.png',
        },
        {
          img: '/img/ourusers/yuanfudao@2x.png',
        },
        {
          img: '/img/ourusers/yuanguanruanjian@2x.png',
        },
        {
          img: '/img/ourusers/yuxueyuan@2x.png',
        },
        {
          img: '/img/ourusers/zhongshandaxue@2x.png',
        },
        {
          img: '/img/ourusers/ucloud@2x.png',
        },
        {
          img: '/img/ourusers/xinlangweibo@2x.png',
        },
        {
          img: '/img/ourusers/maidanglao@2x.png',
        },
        {
          img: '/img/ourusers/zhengcaiyun@2x.png',
        },
        {
          img: '/img/ourusers/fordeal@2x.png',
        },
        {
          img: '/img/ourusers/yunda@2x.png',
        },
        {
          img: '/img/ourusers/huawei@2x.png',
        },
        {
          img: '/img/ourusers/vmware@2x.png',
        },
        {
          img: '/img/ourusers/weipinhui@2x.png',
        },
        {
          img: '/img/ourusers/jdt.png',
        },
        {
          img: '/img/ourusers/hundsun.png',
        },
        {
          img: '/img/ourusers/zhaopin.png',
        },
        {
          img: '/img/ourusers/dell.png',
        },
        {
          img: '/img/ourusers/shansong.png',
        },
        {
          img: '/img/ourusers/189.png',
        },
        {
          img: '/img/ourusers/360.png',
        },
        {
          img: '/img/ourusers/fankewang.png',
        },
        {
          img: '/img/ourusers/yueyunkeji.png',
        },
        {
          img: '/img/ourusers/yiyunxinxi.png',
        },
        {
          img: '/img/ourusers/zhihuiqice.png',
        },
        {
          img: '/img/ourusers/sutpc.png',
        },
      ],
    },
    userreview: {
      title: '用户评论',
      list: [
        {
          img: '/img/chinaunicom-logo.png',
          review: '提供了一个优秀的调度产品，节省了近百人月的开发成本。友好的社区沟通环境，提供了强大的后援支持。',
          name: '—— 联通数字科技 架构师 尹正军',
        },
        {
          img: '/img/qianxin-logo.svg',
          review: '小海豚已经是我们数据项目开发管理的利器，非常好用，希望保持初心，越来越好。',
          name: '—— 奇安信 数据总监 姜旭',
        },
        {
          img: '/img/changan-logo.png',
          review: '从EasyScheduler到DolphinScheduler，有幸见证了小海豚的成长 —— 越来越简单，越来越易用。DS已作为数据平台的基础组件服务于整个长安汽车车联网的离线开发场景，非常稳定。希望DS社区生态越来越完善，每个用户都能得益于社区，贡献于社区!',
          name: '—— 长安汽车 数据平台工程师 黄立',
        },
        {
          img: '/img/xdf-logo.jpeg',
          review: '祝贺DolphinScheduler成为Apache顶级项目。DolphinScheduler有强大的调度功能，方便快捷的可视化工具，可信赖的高可靠性，成为了行业同类工具中的领先者，是国产大数据软件之光。新东方通过使用DolphinScheduler，提高了任务调度效率，更加方便地进行系统性能分析，数据产出时间缩短。感谢DolphinScheduler!',
          name: '—— 新东方教育科技集团技术VP（前当当网CTO）李海涛',
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
          link: '/en-us/docs/latest/user_doc/guide/quick-start.html',
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
      img: '/img/archdiagram_es.svg',
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
          content: 'Support multi-tenant. Support many task types e.g., spark,flink,hive, mr, shell, python, sub_process',
        },
        {
          img: '/img/feature_runtime.png',
          title: 'High Expansibility',
          content: 'Support custom task types, Distributed scheduling, and the overall scheduling capability will increase linearly with the scale of the cluster',
        },
      ],
    },
    ourusers: {
      title: 'Our Users',
      list: [
        {
          img: '/img/ourusers/IBM@2x.png',
        },
        {
          img: '/img/ourusers/tencent@2x.png',
        },
        {
          img: '/img/ourusers/qianxin@2x.png',
        },
        {
          img: '/img/ourusers/chinaunicom@2x.png',
        },
        {
          img: '/img/ourusers/chinatelecom@2x.png',
        },
        {
          img: '/img/ourusers/migu@2x.png',
        },
        {
          img: '/img/ourusers/zhaoshangyinhang@2x.png',
        },
        {
          img: '/img/ourusers/ICBC@2x.png',
        },
        {
          img: '/img/ourusers/pingan@2x.png',
        },
        {
          img: '/img/ourusers/asiainfo@2x.png',
        },
        {
          img: '/img/ourusers/inspur@2x.png',
        },
        {
          img: '/img/ourusers/lenovo@2x.png',
        },
        {
          img: '/img/ourusers/nokia@2x.png',
        },
        // {
        //   img: '/img/ourusers/bonc@2x.png',
        // },
        {
          img: '/img/ourusers/accenture@2x.png',
        },
        {
          img: '/img/ourusers/changan@2x.png',
        },
        {
          img: '/img/ourusers/yiguanshuju@2x.png',
        },
        {
          img: '/img/ourusers/duodian@2x.png',
        },
        {
          img: '/img/ourusers/edaijia@2x.png',
        },
        {
          img: '/img/ourusers/energymonst@2x.png',
        },
        {
          img: '/img/ourusers/iflytek@2x.png',
        },
        {
          img: '/img/ourusers/kingsoft@2x.png',
        },
        {
          img: '/img/ourusers/mangguotv@2x.png',
        },
        {
          img: '/img/ourusers/fenghuangjinrong@2x.png',
        },
        {
          img: '/img/ourusers/meituan@2x.png',
        },
        {
          img: '/img/ourusers/shunfeng@2x.png',
        },
        {
          img: '/img/ourusers/JD@2x.png',
        },
        {
          img: '/img/ourusers/walmart@2x.png',
        },
        {
          img: '/img/ourusers/xindongfang@2x.png',
        },
        {
          img: '/img/ourusers/xueqiu@2x.png',
        },
        {
          img: '/img/ourusers/2345@2x.png',
        },
        {
          img: '/img/ourusers/baiwangyun@2x.png',
        },
        {
          img: '/img/ourusers/belle@2x.png',
        },
        {
          img: '/img/ourusers/erweihuo@2x.png',
        },
        {
          img: '/img/ourusers/guanyuanshuju@2x.png',
        },
        {
          img: '/img/ourusers/shein@2x.png',
        },
        {
          img: '/img/ourusers/shenmachuxing@2x.png',
        },
        {
          img: '/img/ourusers/yiqixiu@2x.png',
        },
        {
          img: '/img/ourusers/yuanfudao@2x.png',
        },
        {
          img: '/img/ourusers/yuanguanruanjian@2x.png',
        },
        {
          img: '/img/ourusers/yuxueyuan@2x.png',
        },
        {
          img: '/img/ourusers/zhongshandaxue@2x.png',
        },
        {
          img: '/img/ourusers/ucloud@2x.png',
        },
        {
          img: '/img/ourusers/xinlangweibo@2x.png',
        },
        {
          img: '/img/ourusers/maidanglao@2x.png',
        },
        {
          img: '/img/ourusers/zhengcaiyun@2x.png',
        },
        {
          img: '/img/ourusers/fordeal@2x.png',
        },
        {
          img: '/img/ourusers/yunda@2x.png',
        },
        {
          img: '/img/ourusers/huawei@2x.png',
        },
        {
          img: '/img/ourusers/vmware@2x.png',
        },
        {
          img: '/img/ourusers/weipinhui@2x.png',
        },
        {
          img: '/img/ourusers/jdt.png',
        },
        {
          img: '/img/ourusers/hundsun.png',
        },
        {
          img: '/img/ourusers/zhaopin.png',
        },
        {
          img: '/img/ourusers/dell.png',
        },
        {
          img: '/img/ourusers/shansong.png',
        },
        {
          img: '/img/ourusers/189.png',
        },
        {
          img: '/img/ourusers/360.png',
        },
        {
          img: '/img/ourusers/fankewang.png',
        },
        {
          img: '/img/ourusers/yueyunkeji.png',
        },
        {
          img: '/img/ourusers/yiyunxinxi.png',
        },
        {
          img: '/img/ourusers/zhihuiqice.png',
        },
        {
          img: '/img/ourusers/sutpc.png',
        },
      ],
    },
    events: {
      title: 'Events & News',
      list: [
        {

          img: '/img/3-16/1.png',
          title: 'Cisco Hangzhou\'s Travel Through Apache DolphinScheduler Alert Module Refactor',
          content: 'Cisco Hangzhou has introduced Apache DolphinScheduler....',
          dateStr: '2022-3-7',
          link: '/en-us/blog/Hangzhou_cisco.html',
        },
        {
          img: '/img/2022-3-11/1.jpeg',
          title: 'How Does 360 DIGITECH process 10,000+ workflow instances per day by Apache DolphinScheduler',
          content: 'ince 2020, 360 DIGITECH has fully migrated its scheduling system from Azkaban to Apache DolphinScheduler....',
          dateStr: '2022-2-24',
          link: '/en-us/blog/How_Does_360_DIGITECH_process_10_000+_workflow_instances_per_day.html',
        },
        {
          img: '/img/2022-3-9/Eng/1.jpeg',
          title: 'Exploration and practice of Tujia Big Data Platform Based on Apache DolphinScheduler',
          content: 'Tujia introduced Apache DolphinScheduler in 2019...',
          dateStr: '2022-3-10',
          link: '/en-us/blog/Exploration_and_practice_of_Tujia_Big_Data_Platform_Based.html',
        },
      ],
    },
    userreview: {
      title: 'User Comments',
      list: [
        {
          img: '/img/chinaunicom-logo.png',
          review: 'Apache DolphinScheduler is an excellent data workflow open-source product, Its community is very friendly and gives us strong support. We save the cost of hundreds of human months by using DolphinScheduler!',
          name: '—— Software Architect at China Unicom -- Zhengjun Yin',
        },
        {
          img: '/img/qianxin-logo.svg',
          review: 'DolphinScheduler is already a good tool for our data project development management, it works very well, hope to keep the original intention and get better and better~',
          name: '—— Data Director of 360 --Jiang Xu',
        },
        {
          img: '/img/changan-logo.png',
          review: 'From EasyScheduler to DolphinScheduler, we have the honor to witness the growth of Little Dolphin - it is getting simpler and easier to use. DS has served the whole Changan Auto Telematics offline development scenario as the basic component of data platform and is very stable. I hope the DS community ecology is getting better and better, and every user can benefit from and contribute to the community!',
          name: '—— Changan Automobile Data Platform Engineer -- Huang Li',
        },
        {
          img: '/img/xdf-logo.jpeg',
          review: 'Congratulations to DolphinScheduler for becoming an Apache top project. With powerful scheduling features, convenient and fast visualization tools, and reliable high reliability, DolphinScheduler has become a leader among similar tools in the industry, and is the light of big data software in China.By using DolphinScheduler, New Oriental has improved the efficiency of task scheduling, more convenient system performance analysis, and shorter data output time. Thanks to DolphinScheduler!',
          name: '—— Technology VP of New Oriental Education & Technology Group (former CTO of Dangdang.com) -- Haitao Li',
        },
      ],
    },
  },
};
