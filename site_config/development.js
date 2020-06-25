export default {
    'en-us': {
        sidemenu: [
            {
                title: 'Contribution Guide',
                children: [
                    {
                        title: 'how to become a committer',
                        link: '/en-us/docs/development/become a committer.html',
                    },
                    {
                        title: 'Subscribe mail list',
                        link: '/en-us/docs/development/subscribe.html',
                    },
                    {
                        title: 'Participate in contributing',
                        link: '/en-us/docs/development/contribute.html',
                    }
                ],
            },
            {
                title: 'Submit Guide',
                children: [
                    {
                        title: 'Submit Pull Request Process',
                        link: '/en-us/docs/development/submit-code.html',
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
                title: '贡献指南',
                children: [
                    {
                        title: '如何成为Dolphinscheduler的committer',
                        link: '/zh-cn/docs/development/become a committer.html',
                    },
                    {
                        title: '订阅邮件列表',
                        target: '_blank',
                        link: '/zh-cn/docs/development/subscribe.html',
                    },
                    {
                        title: '参与贡献',
                        link: '/zh-cn/docs/development/contribute.html',
                    },
                    {
                        title: '参与贡献-License需知',
                        link: '/zh-cn/docs/development/DS-License.html',
                    }
                ],
            },
            {
                title: '提交者向导',
                children: [
                    {
                        title: '提交流程',
                        link: '/zh-cn/docs/development/submit-code.html',
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
