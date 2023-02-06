module.exports = (lang) => {
  return {
    "en-us": {
      title: "Contribution",
      children: [
        {
          title: "SPI",
          children: [
            {
              title: "Alert SPI",
              link: `/en-us/docs/${lang}/user_doc/contribute/backend/spi/alert.html`,
            },
            {
              title: "Datasource SPI",
              link: `/en-us/docs/${lang}/user_doc/contribute/backend/spi/datasource.html`,
            },
            {
              title: "Registry SPI",
              link: `/en-us/docs/${lang}/user_doc/contribute/backend/spi/registry.html`,
            },
            {
              title: "Task SPI",
              link: `/en-us/docs/${lang}/user_doc/contribute/backend/spi/task.html`,
            },
          ],
        },
        {
          title: "Development Environment Setup",
          link: `/en-us/docs/${lang}/user_doc/contribute/development-environment-setup.html`,
        },
        {
          title: "Frontend Development",
          link: `/en-us/docs/${lang}/user_doc/contribute/frontend-development.html`,
        },
      ],
    },
    "zh-cn": {
      title: "贡献指南",
      children: [
        {
          title: "SPI",
          children: [
            {
              title: "Alert SPI",
              link: `/zh-cn/docs/${lang}/user_doc/contribute/backend/spi/alert.html`,
            },
            {
              title: "Datasource SPI",
              link: `/zh-cn/docs/${lang}/user_doc/contribute/backend/spi/datasource.html`,
            },
            {
              title: "Registry SPI",
              link: `/zh-cn/docs/${lang}/user_doc/contribute/backend/spi/registry.html`,
            },
            {
              title: "Task SPI",
              link: `/zh-cn/docs/${lang}/user_doc/contribute/backend/spi/task.html`,
            },
          ],
        },
        {
          title: "环境搭建",
          link: `/zh-cn/docs/${lang}/user_doc/contribute/development-environment-setup.html`,
        },
        {
          title: "前端开发",
          link: `/zh-cn/docs/${lang}/user_doc/contribute/frontend-development.html`,
        },
      ],
    },
  };
};
