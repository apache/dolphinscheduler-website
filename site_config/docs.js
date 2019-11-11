export default {
  'en-us': {
    sidemenu: [
      {
        title: 'User doc',
        children: [
          {
            title: 'Quick Start',
            link: '/en-us/docs/user_doc/quick-start.html',
          },
          {
            title: 'Backend deploy',
            link: '/en-us/docs/user_doc/backend-deployment.html',
          },
          {
            title: 'Frontend deploy',
            link: '/en-us/docs/user_doc/frontend-deployment.html',
          },
          {
            title: 'System manual',
            link: '/en-us/docs/user_doc/system-manual.html',
          },
        ]
      },
      {
        title: 'Developer guide',
        children: [
          {
            title: 'Architecture Design',
            link: '/en-us/docs/developer_guide/architecture-design.html',
          },
          {
            title: 'Backend Development',
            link: '/en-us/docs/developer_guide/backend-development.html',
          },
          {
            title: 'Frontend Development',
            link: '/en-us/docs/developer_guide/frontend-development.html',
          },
          {
            title: 'Api Document',
            target: '_blank',
            link: 'http://106.75.43.194:8888/easyscheduler/doc.html?language=en&lang=en'
          },
        ],
      },
      {
        title: 'Release',
        children: [
          {
            title: 'Upgrade',
            link: '/en-us/docs/release/upgrade.html',
          }
        ],
      },
      {
        title: 'FAQ',
        children: [
          {
            title: 'FAQ',
            link: '/en-us/docs/faq.html',
          }
        ]
      }
    ],
    barText: 'Documentation',
  },
  'zh-cn': {
    sidemenu: [
      {
        title: '用户文档',
        children: [
          {
            title: '快速上手',
            link: '/zh-cn/docs/user_doc/quick-start.html',
          },
          {
            title: '后端部署',
            link: '/zh-cn/docs/user_doc/backend-deployment.html',
          },
          {
            title: '前端部署',
            link: '/zh-cn/docs/user_doc/frontend-deployment.html',
          },
          {
            title: '系统手册',
            link: '/zh-cn/docs/user_doc/system-manual.html',
          },
        ],
      },
      {
        title: '开发者指南',
        children: [
          {
            title: '架构设计',
            link: '/zh-cn/docs/developer_guide/architecture-design.html',
          },
          {
            title: '后端开发',
            link: '/zh-cn/docs/developer_guide/backend-development.html',
          },
          {
            title: '插件开发',
            link: '/zh-cn/docs/developer_guide/architecture-design.html',
          },
          {
            title: '前端开发',
            link: '/zh-cn/docs/developer_guide/frontend-development.html',
          },
          {
            title: '接口文档',
            target: '_blank',
            link: 'http://106.75.43.194:8888/easyscheduler/doc.html?language=zh_CN&lang=zh'
          },
        ],
      },
      {
        title: '版本发布',
        children: [
          {
            title: '升级',
            link: '/zh-cn/docs/release/upgrade.html',
          }
        ],
      },
      {
        title: 'FAQ',
        children: [
          {
            title: 'FAQ',
            link: '/zh-cn/docs/faq.html',
          }
        ]
      }
    ],
    barText: '文档'
  }
};
