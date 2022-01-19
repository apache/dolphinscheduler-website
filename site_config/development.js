export default {
  'en-us': {
    sidemenu: [
      {
        title: 'Developer guide',
        children: [
          {
            title: 'Development Environment Setup',
            link: '/en-us/development/development-environment-setup.html',
          },
          {
            title: 'Architecture Design',
            link: '/en-us/development/architecture-design.html',
          },
          {
            title: 'API Standard',
            link: '/en-us/development/api-standard.html',
          },
          {
            title: 'Backend Development',
            children: [
              // TODO not support multiply level for now
              // {
                // title: 'SPI',
                // children: [
                  {
                    title: 'Alert SPI',
                    link: '/en-us/development/backend/spi/alert.html',
                  },
                  {
                    title: 'Registry SPI',
                    link: '/en-us/development/backend/spi/registry.html',
                  },
                  {
                    title: 'Task SPI',
                    link: '/en-us/development/backend/spi/task.html',
                  },
                  {
                    title: 'Datasource SPI',
                    link: '/en-us/development/backend/spi/datasource.html',
                  },
                // ],
              // }
              {
                title: 'Mechanism Design',
                link: '/en-us/development/backend/mechanism/overview.html',
              },
            ],
          },
          {
            title: 'Frontend Development',
            link: '/en-us/development/frontend-development.html',
          },
          {
            title: 'Questions & Communications',
            link: '/en-us/development/have-questions.html',
          },
        ],
      },
    ],
    barText: 'Development',
  },
  'zh-cn': {
    sidemenu: [
      {
        title: '开发者指南',
        children: [
          {
            title: '环境搭建',
            link: '/zh-cn/development/development-environment-setup.html',
          },
          {
            title: '架构设计',
            link: '/zh-cn/development/architecture-design.html',
          },
          {
            title: 'API规范',
            link: '/zh-cn/development/api-standard.html',
          },
          {
            title: '后端开发',
            children: [
              // TODO not support multiply level for now
              // {
                // title: 'SPI相关',
                // children: [
                  {
                    title: 'Alert SPI',
                    link: '/zh-cn/development/backend/spi/alert.html',
                  },
                  {
                    title: 'Registry SPI',
                    link: '/zh-cn/development/backend/spi/registry.html',
                  },
                  {
                    title: 'Task SPI',
                    link: '/zh-cn/development/backend/spi/task.html',
                  },
                  {
                    title: 'Datasource SPI',
                    link: '/zh-cn/development/backend/spi/datasource.html',
                  },
                // ],
              // },
              {
                title: '组件设计',
                link: '/zh-cn/development/backend/mechanism/overview.html',
              },
            ],
          },
          {
            title: '前端开发',
            link: '/zh-cn/development/frontend-development.html',
          },
          {
            title: 'E2E 自动化测试',
            link: '/zh-cn/development/e2e-test.html',
          },
          {
            title: '问题与交流',
            link: '/zh-cn/development/have-questions.html',
          },
        ],
      },
    ],
    barText: '开发者',
  },
};

