export default {
    'en-us': {
        sidemenu: [
            {
                title: 'Deployment Document',
                children: [
                    {
                        title: 'Hareware Environment',
                        link: '/en-us/docs/1.2.1/user_doc/hardware-environment.html',
                    },
                    {
                        title: 'Backend deploy',
                        link: '/en-us/docs/1.2.1/user_doc/backend-deployment.html',
                    },
                    {
                        title: 'Frontend deploy',
                        link: '/en-us/docs/1.2.1/user_doc/frontend-deployment.html',
                    }
                ]
            },
            {
                title: 'User Manual',
                children: [
                    {
                        title: 'Quick Start',
                        link: '/en-us/docs/1.2.1/user_doc/quick-start.html',
                    }
                ]
            }
        ],
        barText: 'Documentation',
    },
    'zh-cn': {
        sidemenu: [
            {
                title: '部署文档',
                children: [
                    {
                        title: '软硬件环境建议配置',
                        link: '/zh-cn/docs/1.2.1/user_doc/hardware-environment.html',
                    },
                    {
                        title: '单机部署(Standalone)',
                        link: '/zh-cn/docs/1.2.1/user_doc/standalone-deployment.html',
                    },
                    {
                        title: '集群部署(Cluster)',
                        link: '/zh-cn/docs/1.2.1/user_doc/cluster-deployment.html',
                    }
                ],
            },
            {
                title: '用户手册',
                children: [
                    {
                        title: '快速上手',
                        link: '/zh-cn/docs/1.2.1/user_doc/quick-start.html',
                    }
                ],
            }
        ],
        barText: '文档'
    }
};
