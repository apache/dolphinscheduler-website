export default {
    'en-us': {
        sidemenu: [
            {
                title: 'Deployment Document',
                children: [
                    {
                        title: 'Hareware Environment',
                        link: '/en-us/docs/1.3.3/user_doc/hardware-environment.html',
                    },
                    {
                        title: 'Standalone Deployment',
                        link: '/en-us/docs/1.3.3/user_doc/standalone-deployment.html',
                    },
                    {
                        title: 'Cluster deploy',
                        link: '/en-us/docs/1.3.3/user_doc/cluster-deployment.html',
                    }
                ]
            },
            {
                title: 'User Manual',
                children: [
                    {
                        title: 'Quick Start',
                        link: '/en-us/docs/1.3.3/user_doc/quick-start.html',
                    },
                    {
                        title: 'User Manual',
                        link: '/en-us/docs/1.3.3/user_doc/system-manual.html',
                    },
                    {
                        title: 'Metadata',
                        link: '/en-us/docs/1.3.3/user_doc/metadata-1.2.html'
                    },
                ]
            },
            {
                title: 'Api Document',
                children: [
                    {
                        title: 'Api Document',
                        target: '_blank',
                        link: 'http://106.75.43.194:8888/dolphinscheduler/doc.html?language=en&lang=enn'
                    }
                ]
            },
            {
                title: 'Upgrade',
                children: [
                    {
                        title: 'Upgrade',
                        link: '/en-us/docs/1.3.3/user_doc/upgrade.html',
                    }
                ]
            },
            {
                title: 'FAQ',
                children: [
                    {
                        title: 'FAQ',
                        link: '/en-us/docs/release/faq.html',
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
                        link: '/zh-cn/docs/1.3.3/user_doc/hardware-environment.html',
                    },
                    {
                        title: '单机部署(Standalone)',
                        link: '/zh-cn/docs/1.3.3/user_doc/standalone-deployment.html',
                    },
                    {
                        title: '集群部署(Cluster)',
                        link: '/zh-cn/docs/1.3.3/user_doc/cluster-deployment.html',
                    }
                ],
            },
            {
                title: '用户手册',
                children: [
                    {
                        title: '快速上手',
                        link: '/zh-cn/docs/1.3.3/user_doc/quick-start.html',
                    },
                    {
                        title: '用户手册',
                        link: '/zh-cn/docs/1.3.3/user_doc/system-manual.html',
                    },
                    {
                        title: '元数据文档',
                        link: '/zh-cn/docs/1.3.3/user_doc/metadata-1.3.html'
                    },
                    {
                        title: '架构设计',
                        link: '/zh-cn/docs/1.3.3/user_doc/architecture-design.html'
                    },
                ],
            },
            {
                title: 'API文档',
                children: [
                    {
                        title: 'API文档',
                        target: '_blank',
                        link: 'http://106.75.43.194:8888/dolphinscheduler/doc.html?language=zh_CN&lang=zh'
                    }
                ]
            },
            {
                title: '版本升级',
                children: [
                    {
                        title: '升级',
                        link: '/zh-cn/docs/1.3.3/user_doc/upgrade.html',
                    }
                ],
            },
            {
                title: 'FAQ',
                children: [
                    {
                        title: 'FAQ',
                        link: '/zh-cn/docs/release/faq.html',
                    }
                ]
            }
        ],
        barText: '文档'
    }
};
