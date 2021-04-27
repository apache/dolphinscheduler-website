import React from 'react';

export default {
  'en-us': {
    barText: 'Community',
    sidemenu: [
      {
        title: 'Community News',
        children: [
          {
            title: 'Community News',
            link: '/en-us/community/index.html',
          },
        ],
      },
      {
        title: 'Team',
        children: [
          {
            title: 'Team Introduction',
            link: '/en-us/community/team.html',
          },
        ],
      },
      {
        title: 'Security',
        children: [
          {
            title: 'Security Introduction',
            link: '/en-us/community/security.html',
          },
        ],
      },
      {
        title: 'Release Guide',
        children: [
          {
            title: 'Release Preparation',
            link: '/en-us/community/release-prepare.html',
          },
          {
            title: 'Release Guide',
            link: '/en-us/community/release.html',
          },
          {
            title: 'Release Post',
            link: '/en-us/community/release-post.html',
          },
        ],
      },
      {
        title: 'Contribution Guide',
        children: [
          {
            title: 'How to Become a Committer',
            link: '/en-us/community/development/become-a-committer.html',
          },
          {
            title: 'Subscribe Mailing Lists',
            link: '/en-us/community/development/subscribe.html',
          },
          {
            title: 'Participate in Contributing',
            link: '/en-us/community/development/contribute.html',
          },
          {
            title: 'Code of Conduct',
            link: '/en-us/community/development/code-conduct.html',
          },
        ],
      },
      {
        title: 'Submit Guide',
        children: [
          {
            title: 'Submit Code',
            link: '/en-us/community/development/submit-code.html',
          },
          {
            title: 'License Notice',
            link: '/en-us/community/development/DS-License.html',
          },
          {
            title: 'Document Notice',
            link: '/en-us/community/development/document.html',
          },
          {
            title: 'Issue Notice',
            link: '/en-us/community/development/issue.html',
          },
          {
            title: 'Pull Request Notice',
            link: '/en-us/community/development/pull-request.html',
          },
          {
            title: 'Commit Message Notice',
            link: '/en-us/community/development/commit-message.html',
          },
          {
            title: 'Micro BenchMark Notice',
            link: '/en-us/community/development/microbench.html',
          },
        ],
      },
    ],
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
    contacts: {
      title: 'Talk To Us',
      desc: 'Feel free to contact us via the following channel.',
      list: [
        {
          img: '/img/mailinglist.png',
          imgHover: '/img/mailinglist_hover.png',
          title: 'Mailing List',
          link: 'mailto:dev-subscribe@dolphinscheduler.apache.org',
        },
        // {
        //   img: '/img/alibaba.png',
        //   imgHover: '/img/alibaba_hover.png',
        //   title: '#Apache/DolphinScheduler',
        //   link: 'https://gitter.im/apache/ApacheDolphinScheduler',
        // },
        // {
        //   img: '/img/so-icon.png',
        //   imgHover: '/img/so-icon-hover.png',
        //   title: 'StackOverflow',
        //   link: 'https://stackoverflow.com/questions/tagged/apache-DolphinScheduler'
        // },
        {
          img: '/img/twitter.png',
          imgHover: '/img/twitter_hover.png',
          title: '@ApacheDolphinScheduler',
          link: 'https://twitter.com/DolphinSched',
        },
      ],
    },
    contributorGuide: {
      title: 'Contributor Guide',
      desc: 'Want to contribute to DolphinScheduler?',
      list: [
        {
          img: '/img/mailinglist.png',
          title: 'Mailing List',
          content: <span>Subscribe <a href="https://github.com/apache/dolphinscheduler/issues/1278">mailing list </a>and discussion your ideas with us.</span>,
        },
        {
          img: '/img/issue.png',
          title: 'Issue',
          content: <span>Reporting issues via <a href="https://github.com/apache/dolphinscheduler/issues">GitHub issues</a>.</span>,
        },
        {
          img: '/img/documents.png',
          title: 'Documents',
          content: <span>Improve the <a href="/en-us/docs/latest/user_doc/quick-start.html">documentation</a>.</span>,
        },
        {
          img: '/img/pullrequest.png',
          title: 'Pull Request',
          content: <span>Send your awesome enhancement via <a href="https://github.com/apache/dolphinscheduler/pulls">Pull requests.</a></span>,
        },
      ],
    },
  },
  'zh-cn': {
    barText: '社区',
    sidemenu: [
      {
        title: '社区动态',
        children: [
          {
            title: '社区动态',
            link: '/zh-cn/community/index.html',
          },
        ],
      },
      {
        title: '团队',
        children: [
          {
            title: '团队介绍',
            link: '/zh-cn/community/team.html',
          },
        ],
      },
      {
        title: '安全',
        children: [
          {
            title: '安全介绍',
            link: '/zh-cn/community/security.html',
          },
        ],
      },
      {
        title: '发版指南',
        children: [
          {
            title: '发版准备',
            link: '/zh-cn/community/release-prepare.html',
          },
          {
            title: '发版指南',
            link: '/zh-cn/community/release.html',
          },
          {
            title: '发版后续',
            link: '/zh-cn/community/release-post.html',
          },
        ],
      },
      {
        title: '贡献指南',
        children: [
          {
            title: '如何成为DolphinScheduler Committer',
            link: '/zh-cn/community/development/become-a-committer.html',
          },
          {
            title: '订阅邮件列表',
            link: '/zh-cn/community/development/subscribe.html',
          },
          {
            title: '参与贡献',
            link: '/zh-cn/community/development/contribute.html',
          },
          {
            title: '行为准则',
            link: '/zh-cn/community/development/code-conduct.html',
          },
        ],
      },
      {
        title: '提交者指南',
        children: [
          {
            title: '提交代码',
            link: '/zh-cn/community/development/submit-code.html',
          },
          {
            title: 'License须知',
            link: '/zh-cn/community/development/DS-License.html',
          },
          {
            title: '文档须知',
            link: '/zh-cn/community/development/document.html',
          },
          {
            title: 'Issue须知',
            link: '/zh-cn/community/development/issue.html',
          },
          {
            title: 'Pull Request须知',
            link: '/zh-cn/community/development/pull-request.html',
          },
          {
            title: 'Commit Message须知',
            link: '/zh-cn/community/development/commit-message.html',
          },
          {
            title: '微基准测试须知',
            link: '/zh-cn/community/development/microbench.html',
          },
        ],
      },
    ],
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
    contacts: {
      title: '联系我们',
      desc: '有问题需要反馈？请通过以下方式联系我们。',
      list: [
        {
          img: '/img/mailinglist.png',
          imgHover: '/img/mailinglist_hover.png',
          title: '邮件列表',
          link: 'mailto:dev-subscribe@dolphinscheduler.apache.org',
        },
        // {
        //   img: '/img/alibaba.png',
        //   imgHover: '/img/alibaba_hover.png',
        //   title: 'Gitter',
        //   link: 'https://gitter.im/apache/ApacheDolphinScheduler',
        // },
        // {
        //   img: '/img/so-icon.png',
        //   imgHover: '/img/so-icon-hover.png',
        //   title: 'StackOverflow',
        //   link: 'https://stackoverflow.com/questions/tagged/apache-ApacheDolphinScheduler'
        // },
        {
          img: '/img/twitter.png',
          imgHover: '/img/twitter_hover.png',
          title: '@ApacheDolphinScheduler',
          link: 'https://twitter.com/DolphinSched',
        },
      ],
    },
    contributorGuide: {
      title: '贡献指南',
      desc: 'DolphinScheduler社区欢迎任何形式的贡献。',
      list: [
        {
          img: '/img/mailinglist.png',
          title: '邮件列表',
          content: <span>订阅 <a href="https://github.com/apache/dolphinscheduler/issues/1278">邮件列表 </a>参与讨论。</span>,
        },
        {
          img: '/img/issue.png',
          title: '报告缺陷',
          content: <span>通过<a href="https://github.com/apache/dolphinscheduler/issues"> GitHub issues </a>报告缺陷。</span>,
        },
        {
          img: '/img/documents.png',
          title: '文档',
          content: <span>优化DolphinScheduler <a href="/zh-cn/docs/latest/user_doc/quick-start.html"> 文档</a>。</span>,
        },
        {
          img: '/img/pullrequest.png',
          title: 'Pull Request',
          content: <span>提交 <a href="https://github.com/apache/dolphinscheduler/pulls"> Pull requests </a>来修复问题。</span>,
        },
      ],
    },
  },
};
