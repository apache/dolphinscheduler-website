// 全局的一些配置
export default {
  rootPath: '',
  port: 8080,
  domain: 'dolphinscheduler.apache.org',
  copyToDist: ['asset', 'img', 'file', '.asf.yaml', 'sitemap.xml', '.nojekyll', '.htaccess'],
  docsLatest: '1.3.8',
  defaultSearch: 'google', // default search engine
  defaultLanguage: 'en-us',
  'en-us': {
    pageMenu: [
      {
        key: 'home',
        text: 'HOME',
        link: '/en-us/index.html',
      },
      {
        key: 'docs',
        text: 'DOCS',
        link: '/en-us/docs/latest/user_doc/quick-start.html',
        children: [
          {
            key: 'docs0',
            text: 'latest(1.3.8)',
            link: '/en-us/docs/latest/user_doc/quick-start.html',
          },
          {
            key: 'docs138',
            text: '1.3.8',
            link: '/en-us/docs/1.3.8/user_doc/quick-start.html',
          },
          {
            key: 'docs136',
            text: '1.3.6',
            link: '/en-us/docs/1.3.6/user_doc/quick-start.html',
          },
          {
            key: 'docs135',
            text: '1.3.5',
            link: '/en-us/docs/1.3.5/user_doc/quick-start.html',
          },
          {
            key: 'docs134',
            text: '1.3.4',
            link: '/en-us/docs/1.3.4/user_doc/quick-start.html',
          },
          {
            key: 'docs133',
            text: '1.3.3',
            link: '/en-us/docs/1.3.3/user_doc/quick-start.html',
          },
          {
            key: 'docs132',
            text: '1.3.2',
            link: '/en-us/docs/1.3.2/user_doc/quick-start.html',
          },
          {
            key: 'docs131',
            text: '1.3.1',
            link: '/en-us/docs/1.3.1/user_doc/quick-start.html',
          },
          {
            key: 'docs121',
            text: '1.2.1',
            link: '/en-us/docs/1.2.1/user_doc/quick-start.html',
          },
          {
            key: 'docs120',
            text: '1.2.0',
            link: '/en-us/docs/1.2.0/user_doc/quick-start.html',
          },
          {
            key: 'docs110',
            text: '1.1.0(Not Apache Release)',
            link: 'https://analysys.github.io/easyscheduler_docs_cn/',
          },
          {
            key: 'docsdev',
            text: 'dev',
            link: '/en-us/docs/dev/user_doc/quick-start.html',
          },
        ],
      },
      {
        key: 'download',
        text: 'DOWNLOAD',
        link: '/en-us/download/download.html',
      },
      { key: 'blog',
        text: 'BLOG',
        link: '/en-us/blog/index.html',
      },
      {
        key: 'development',
        text: 'DEVELOPMENT',
        link: '/en-us/development/development-environment-setup.html',
      },
      {
        key: 'community',
        text: 'COMMUNITY',
        link: '/en-us/community/team.html',
      },
      {
        key: 'ASF',
        text: 'ASF',
        target: '_blank',
        link: 'https://www.apache.org/',
        children: [
          {
            key: 'Foundation',
            text: 'Foundation',
            target: '_blank',
            link: 'https://www.apache.org/',
          },
          {
            key: 'License',
            text: 'License',
            target: '_blank',
            link: 'https://www.apache.org/licenses/',
          },
          {
            key: 'Events',
            text: 'Events',
            target: '_blank',
            link: 'https://www.apache.org/events/current-event',
          },
          {
            key: 'Security',
            text: 'Security',
            target: '_blank',
            link: 'https://www.apache.org/security/',
          },
          {
            key: 'Sponsorship',
            text: 'Sponsorship',
            target: '_blank',
            link: 'https://www.apache.org/foundation/sponsorship.html',
          },
          {
            key: 'Thanks',
            text: 'Thanks',
            target: '_blank',
            link: 'https://www.apache.org/foundation/thanks.html',
          },
        ],
      },
    ],
    documentation: {
      title: 'Documentation',
      list: [
        {
          text: 'Overview',
          link: '/en-us/development/architecture-design.html',
        },
        {
          text: 'Quick start',
          link: '/en-us/docs/latest/user_doc/quick-start.html',
        },
        {
          text: 'Developer guide',
          link: '/en-us/development/backend-development.html',
        },
      ],
    },
    asf: {
      title: 'ASF',
      list: [
        {
          text: 'Foundation',
          link: 'http://www.apache.org',
        },
        {
          text: 'License',
          link: 'http://www.apache.org/licenses/',
        },
        {
          text: 'Events',
          link: 'http://www.apache.org/events/current-event',
        },
        {
          text: 'Sponsorship',
          link: 'http://www.apache.org/foundation/sponsorship.html',
        },
        {
          text: 'Thanks',
          link: 'http://www.apache.org/foundation/thanks.html',
        },
      ],
    },
    contact: {
      title: 'About us',
      content: 'Do you need feedback? Please contact us through the following ways.',
      list: [
        {
          name: 'Email List',
          img1: '/img/emailgray.png',
          img2: '/img/emailblue.png',
          link: '/en-us/community/development/subscribe.html',
        },
        {
          name: 'Twitter',
          img1: '/img/twittergray.png',
          img2: '/img/twitterblue.png',
          link: 'https://twitter.com/dolphinschedule',
        },
        {
          name: 'Stack Overflow',
          img1: '/img/stackoverflow.png',
          img2: '/img/stackoverflow-selected.png',
          link: 'https://stackoverflow.com/questions/tagged/apache-dolphinscheduler',
        },
        {
          name: 'Slack',
          img1: '/img/slack.png',
          img2: '/img/slack-selected.png',
          link: 'https://join.slack.com/t/asf-dolphinscheduler/shared_invite/zt-omtdhuio-_JISsxYhiVsltmC5h38yfw',
        },
      ],
    },
    copyright: 'Copyright © 2019-2021 The Apache Software Foundation. Apache DolphinScheduler, DolphinScheduler, and its feather logo are trademarks of The Apache Software Foundation.',
  },
  'zh-cn': {
    pageMenu: [
      {
        key: 'home',
        text: '首页',
        link: '/zh-cn/index.html',
      },
      {
        key: 'docs',
        text: '文档',
        link: '/zh-cn/docs/latest/user_doc/quick-start.html',
        children: [
          {
            key: 'docs0',
            text: 'latest(1.3.8)',
            link: '/zh-cn/docs/latest/user_doc/quick-start.html',
          },
          {
            key: 'docs138',
            text: '1.3.8',
            link: '/zh-cn/docs/1.3.8/user_doc/quick-start.html',
          },
          {
            key: 'docs136',
            text: '1.3.6',
            link: '/zh-cn/docs/1.3.6/user_doc/quick-start.html',
          },
          {
            key: 'docs135',
            text: '1.3.5',
            link: '/zh-cn/docs/1.3.5/user_doc/quick-start.html',
          },
          {
            key: 'docs134',
            text: '1.3.4',
            link: '/zh-cn/docs/1.3.4/user_doc/quick-start.html',
          },
          {
            key: 'docs133',
            text: '1.3.3',
            link: '/zh-cn/docs/1.3.3/user_doc/quick-start.html',
          },
          {
            key: 'docs132',
            text: '1.3.2',
            link: '/zh-cn/docs/1.3.2/user_doc/quick-start.html',
          },
          {
            key: 'docs131',
            text: '1.3.1',
            link: '/zh-cn/docs/1.3.1/user_doc/quick-start.html',
          },
          {
            key: 'docs121',
            text: '1.2.1',
            link: '/zh-cn/docs/1.2.1/user_doc/quick-start.html',
          },
          {
            key: 'docs120',
            text: '1.2.0',
            link: '/zh-cn/docs/1.2.0/user_doc/quick-start.html',
          },
          {
            key: 'docs110',
            text: '1.1.0(Not Apache Release)',
            link: 'https://analysys.github.io/easyscheduler_docs_cn/',
          },
          {
            key: 'docsdev',
            text: 'dev',
            link: '/zh-cn/docs/dev/user_doc/quick-start.html',
          },
        ],
      },
      {
        key: 'download',
        text: '下载',
        link: '/zh-cn/download/download.html',
      },
      {
        key: 'blog',
        text: '博客',
        link: '/zh-cn/blog/index.html',
      },
      {
        key: 'development',
        text: '开发者',
        link: '/zh-cn/development/development-environment-setup.html',
      },
      {
        key: 'community',
        text: '社区',
        link: '/zh-cn/community/team.html',
      },
      {
        key: 'ASF',
        text: 'ASF',
        target: '_blank',
        link: 'https://www.apache.org/',
        children: [
          {
            key: 'Foundation',
            text: 'Foundation',
            target: '_blank',
            link: 'https://www.apache.org/',
          },
          {
            key: 'License',
            text: 'License',
            target: '_blank',
            link: 'https://www.apache.org/licenses/',
          },
          {
            key: 'Events',
            text: 'Events',
            target: '_blank',
            link: 'https://www.apache.org/events/current-event',
          },
          {
            key: 'Security',
            text: 'Security',
            target: '_blank',
            link: 'https://www.apache.org/security/',
          },
          {
            key: 'Sponsorship',
            text: 'Sponsorship',
            target: '_blank',
            link: 'https://www.apache.org/foundation/sponsorship.html',
          },
          {
            key: 'Thanks',
            text: 'Thanks',
            target: '_blank',
            link: 'https://www.apache.org/foundation/thanks.html',
          },
        ],
      },
    ],
    documentation: {
      title: '文档',
      list: [
        {
          text: '概览',
          link: '/zh-cn/development/architecture-design.html',
        },
        {
          text: '快速开始',
          link: '/zh-cn/docs/latest/user_doc/quick-start.html',
        },
        {
          text: '开发者指南',
          link: '/zh-cn/development/backend-development.html',
        },
      ],
    },
    asf: {
      title: 'ASF',
      list: [
        {
          text: '基金会',
          link: 'http://www.apache.org',
        },
        {
          text: '证书',
          link: 'http://www.apache.org/licenses/',
        },
        {
          text: '事件',
          link: 'http://www.apache.org/events/current-event',
        },
        {
          text: '赞助',
          link: 'http://www.apache.org/foundation/sponsorship.html',
        },
        {
          text: '致谢',
          link: 'http://www.apache.org/foundation/thanks.html',
        },
      ],
    },
    contact: {
      title: '联系我们',
      content: '有问题需要反馈？请通过以下方式联系我们。',
      list: [
        {
          name: '邮件列表',
          img1: '/img/emailgray.png',
          img2: '/img/emailblue.png',
          link: '/zh-cn/community/development/subscribe.html',
        },
        {
          name: 'Twitter',
          img1: '/img/twittergray.png',
          img2: '/img/twitterblue.png',
          link: 'https://twitter.com/dolphinschedule',
        },
        {
          name: 'Stack Overflow',
          img1: '/img/stackoverflow.png',
          img2: '/img/stackoverflow-selected.png',
          link: 'https://stackoverflow.com/questions/tagged/apache-dolphinscheduler',
        },
        {
          name: 'Slack',
          img1: '/img/slack.png',
          img2: '/img/slack-selected.png',
          link: 'https://join.slack.com/t/asf-dolphinscheduler/shared_invite/zt-omtdhuio-_JISsxYhiVsltmC5h38yfw',
        },
      ],
    },
    copyright: 'Copyright © 2019-2021 The Apache Software Foundation. Apache DolphinScheduler, DolphinScheduler, and its feather logo are trademarks of The Apache Software Foundation.',
  },
};
