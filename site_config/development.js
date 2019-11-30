export default {
  'en-us': {
    sidemenu: [
      {
        title: 'Developer guide',
        children: [
          {
            title: 'Architecture Design',
            link: '/en-us/docs/development/architecture-design.html',
          },
          {
            title: 'Backend Development',
            link: '/en-us/docs/development/backend-development.html',
          },
          {
            title: 'plugin-development',
            link: '/en-us/docs/development/plugin-development.html',
          },
          {
            title: 'Frontend Development',
            link: '/en-us/docs/development/frontend-development.html',
          }
        ],
      },
      {
        title: 'Committer Guide',
        children: [
          {
            title: 'Contribute',
            link: '/en-us/docs/development/contribute.html',
          },
          {
            title: 'Developers',
            link: '/en-us/docs/development/developers.html',
          }
        ]
      }
    ],
    barText: 'Development'
  },
  'zh-cn': {
      sidemenu: [
        {
          title: '开发者指南',
          children: [
            {
              title: '架构设计',
              link: '/zh-cn/docs/development/architecture-design.html',
            },
            {
              title: '后端开发',
              link: '/zh-cn/docs/development/backend-development.html',
            },
            {
              title: '插件开发',
              link: '/zh-cn/docs/development/plugin-development.html',
            },
            {
              title: '前端开发',
              link: '/zh-cn/docs/development/frontend-development.html',
            },
            {
              title: '接口文档',
              target: '_blank',
              link: 'http://106.75.43.194:8888/easyscheduler/doc.html?language=zh_CN&lang=zh'
            },
          ],
        },
        {
          title: '提交者向导',
          children: [
            {
              title: '参与贡献',
              link: '/zh-cn/docs/development/contribute.html',
            },
            {
              title: '开发人员',
              link: '/zh-cn/docs/development/developers.html',
            }
          ]
        }
      ],
      barText: '开发者'
  }
};
