// 全局的一些配置
export default {
  rootPath: '', // 发布到服务器的根目录，需以/开头但不能有尾/，如果只有/，请填写空字符串
  port: 8080, // 本地开发服务器的启动端口
  domain: 'dolphinscheduler.incubator.apache.org', // 站点部署域名，无需协议和path等
  defaultSearch: 'google', // 默认搜索引擎，baidu或者google
  defaultLanguage: 'en-us',
  'en-us': {
    pageMenu: [
      {
        key: 'home', // 用作顶部菜单的选中
        text: 'HOME',
        link: '/en-us/index.html',
      },
      {
        key: 'docs',
        text: 'DOCS',
        link: '/en-us/docs/1.3.3/user_doc/quick-start.html',
        children: [
          {
            key: 'docs1',
            text: '1.3.3(Recommend)',
            link: '/en-us/docs/1.3.3/user_doc/quick-start.html',
          },
          {
            key: 'docs2',
            text: '1.3.2',
            link: '/en-us/docs/1.3.2/user_doc/quick-start.html',
          },
          {
            key: 'docs3',
            text: '1.3.1',
            link: '/en-us/docs/1.3.1/user_doc/quick-start.html',
          },
          {
            key: 'docs4',
            text: '1.2.1',
            link: '/en-us/docs/1.2.1/user_doc/quick-start.html',
          },
          {
            key: 'docs5',
            text: '1.2.0',
            link: '/en-us/docs/1.2.0/user_doc/quick-start.html',
          },
          {
              key: 'docs6',
              text: '1.1.0(Not Apache Release)',
              link: 'https://analysys.github.io/easyscheduler_docs_cn/',
          }
        ]
      },
      {
        key: 'download',
        text: 'DOWNLOAD',
        link: '/en-us/docs/release/download.html',
      },
      {
        key: 'demo',
        text: 'Online Demo',
        target: '_blank',
        link: 'http://106.75.43.194:8888'
      },
      {
        key: 'blog',
        text: 'BLOG',
        link: '/en-us/blog/index.html',
      },
      {
        key: 'development',
        text: 'DEVELOPMENT',
        link: '/en-us/docs/development/subscribe.html',
      },
      {
        key: 'community',
        text: 'COMMUNITY',
        link: '/en-us/community/index.html',
      }
    ],
    disclaimer: {
      title: 'Disclaimer',
      content: 'Apache DolphinScheduler (incubating) is an effort undergoing incubation at The Apache Software Foundation (ASF), sponsored by Incubator. \n' +
          'Incubation is required of all newly accepted projects until a further review indicates \n' +
          'that the infrastructure, communications, and decision making process have stabilized in a manner consistent with other successful ASF projects. \n' +
          'While incubation status is not necessarily a reflection of the completeness or stability of the code, \n' +
          'it does indicate that the project has yet to be fully endorsed by the ASF.',
    },
    documentation: {
      title: 'Documentation',
      list: [
        {
          text: 'Overview',
          link: '/en-us/docs/development/architecture-design.html',
        },
        {
          text: 'Quick start',
          link: '/en-us/docs/1.3.3/user_doc/quick-start.html',
        },
        {
          text: 'Developer guide',
          link: '/en-us/docs/development/backend-development.html',
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
    copyright: 'Copyright © 2018-2020 The Apache Software Foundation. Apache DolphinScheduler, DolphinScheduler, and its feather logo are trademarks of The Apache Software Foundation.',
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
        link: '/zh-cn/docs/1.3.3/user_doc/quick-start.html',
        children: [
          {
            key: 'docs1',
            text: '1.3.3(推荐)',
            link: '/zh-cn/docs/1.3.3/user_doc/quick-start.html',
          },
          {
            key: 'docs2',
            text: '1.3.2',
            link: '/zh-cn/docs/1.3.2/user_doc/quick-start.html',
          },
          {
            key: 'docs3',
            text: '1.3.1',
            link: '/zh-cn/docs/1.3.1/user_doc/quick-start.html',
          },
          {
            key: 'docs4',
            text: '1.2.1',
            link: '/zh-cn/docs/1.2.1/user_doc/quick-start.html',
          },
          {
            key: 'docs5',
            text: '1.2.0',
            link: '/zh-cn/docs/1.2.0/user_doc/quick-start.html',
          },
          {
              key: 'docs6',
              text: '1.1.0(Not Apache Release)',
              link: 'https://analysys.github.io/easyscheduler_docs_cn/',
          }
        ]
      },
      {
        key: 'download',
        text: '下载',
        link: '/zh-cn/docs/release/download.html',
      },
      {
        key: 'demo',
        text: '线上demo',
        target: '_blank',
        link: 'http://106.75.43.194:8888'
      },
      {
        key: 'blog',
        text: '博客',
        link: '/zh-cn/blog/index.html',
      },
      {
        key: 'development',
        text: '开发者',
        link: '/zh-cn/docs/development/subscribe.html',
      },
      {
        key: 'community',
        text: '社区',
        link: '/zh-cn/community/index.html',
      },
    ],
    disclaimer: {
      title: 'Disclaimer',
      content: 'Apache DolphinScheduler (incubating) is an effort undergoing incubation at The Apache Software Foundation (ASF), sponsored by Incubator. \n' +
          'Incubation is required of all newly accepted projects until a further review indicates \n' +
          'that the infrastructure, communications, and decision making process have stabilized in a manner consistent with other successful ASF projects. \n' +
          'While incubation status is not necessarily a reflection of the completeness or stability of the code, \n' +
          'it does indicate that the project has yet to be fully endorsed by the ASF.',
    },
    documentation: {
      title: '文档',
      list: [
        {
          text: '概览',
          link: '/zh-cn/docs/development/architecture-design.html',
        },
        {
          text: '快速开始',
          link: '/zh-cn/docs/1.3.3/user_doc/quick-start.html',
        },
        {
          text: '开发者指南',
          link: '/zh-cn/docs/development/backend-development.html',
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
    copyright: 'Copyright © 2018-2020 The Apache Software Foundation. Apache DolphinScheduler, DolphinScheduler, and its feather logo are trademarks of The Apache Software Foundation.',
  },
};
