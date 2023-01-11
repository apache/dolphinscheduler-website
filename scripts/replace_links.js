const replaceDeadLinks = (content, lang, version) => {
  return content
    .replaceAll(
      `https://dolphinscheduler.apache.org/${lang}/download/download.html`,
      `/${lang}/download`
    )
    .replaceAll(
      `pseudo-cluster.md`,
      `/${lang}/docs/${version}/guide/installation/pseudo-cluster`
    )
    .replaceAll(
      `standalone.md`,
      `/${lang}/docs/${version}/guide/installation/standalone`
    )
    .replaceAll(
      `kubernetes.md`,
      `/${lang}/docs/${version}/guide/installation/kubernetes`
    )
    .replaceAll(
      `cluster.md`,
      `/${lang}/docs/${version}/guide/installation/cluster`
    )
    .replaceAll(
      `general-setting.md`,
      `https://github.com/apache/dolphinscheduler/blob/${version}-release/docs/docs/${
        lang === "en-us" ? "en" : "zh"
      }/guide/howto/general-setting.md`
    )
    .replaceAll(
      `../en/guide/alert/email.md`,
      `/en-us/docs/${version}/guide/alert/email`
    )
    .replaceAll(
      `../guide/homepage.md`,
      `/${lang}/docs/${version}/guide/homepage`
    )
    .replaceAll(
      `./development-environment-setup.md`,
      `https://github.com/apache/dolphinscheduler/blob/${version}-release/docs/docs/${
        lang === "en-us" ? "en" : "zh"
      }/contribute/development-environment-setup.md`
    )
    .replaceAll(
      `./frontend-development.md`,
      `https://github.com/apache/dolphinscheduler/blob/${version}-release/docs/docs/${
        lang === "en-us" ? "en" : "zh"
      }/contribute/frontend-development.md`
    )
    .replaceAll(
      `../guide/homepage.md`,
      `/${lang}/docs/${version}/guide/homepage`
    )
    .replaceAll(`./security.md`, `/${lang}/docs/${version}/guide/security`)
    .replaceAll(
      `../start/quick-start.md`,
      `/${lang}/docs/${version}/guide/start/quick-start`
    )
    .replaceAll(
      `priority.md`,
      `/${lang}/docs/${version}/guide/parameter/priority`
    )
    .replaceAll(`global.md`, `/${lang}/docs/${version}/guide/parameter/global`)
    .replaceAll(`local.md`, `/${lang}/docs/${version}/guide/parameter/local`)
    .replaceAll(`../task/shell.md`, `/${lang}/docs/${version}/guide/task/shell`)
    .replaceAll(`../task/sql.md`, `/${lang}/docs/${version}/guide/task/sql`)
    .replaceAll(
      `../task/stored-procedure.md`,
      `/${lang}/docs/${version}/guide/task/stored-procedure`
    )
    .replaceAll(
      `../task/python.md`,
      `/${lang}/docs/${version}/guide/task/python`
    )
    .replaceAll(
      `../resource/configuration.md`,
      `/${lang}/docs/${version}/guide/resource/configuration`
    )
    .replaceAll(`../open-api.md`, `/${lang}/docs/${version}/guide/open-api`)
    .replaceAll(
      `context.md`,
      `/${lang}/docs/${version}/guide/parameter/context`
    )
    .replaceAll(
      `workflow-definition.md`,
      `/${lang}/docs/${version}/guide/project/workflow-definition`
    )
    .replaceAll(
      `../parameter/global.md`,
      `/${lang}/docs/${version}/guide/parameter/global`
    )
    .replaceAll(
      `./task-instance.md`,
      `/${lang}/docs/${version}/guide/project/task-instance`
    )
    .replaceAll(
      `../installation/standalone.md`,
      `/${lang}/docs/${version}/guide/installation/standalone`
    )
    .replaceAll(
      `../../architecture/configuration.md`,
      `/${lang}/docs/${version}/architecture/configuration`
    )
    .replaceAll(`appendix.md`, `/${lang}/docs/${version}/guide/task/appendix`)
    .replaceAll(`switch.md`, `/${lang}/docs/${version}/guide/task/switch`)
    .replaceAll(`shell.md`, `/${lang}/docs/${version}/guide/task/shell`)
    .replaceAll(`./python.md`, `/${lang}/docs/${version}/guide/task/python`)
    .replaceAll(`../security.md`, `/${lang}/docs/${version}/guide/security`)
    .replaceAll(
      `../resource/file-manage.md`,
      `/${lang}/docs/${version}/guide/resource/file-manage`
    )
    .replaceAll(`./hive-cli.md`, `/${lang}/docs/${version}/guide/task/hive-cli`)
    .replaceAll(
      `./incompatible.md`,
      `/${lang}/docs/${version}/guide/upgrade/incompatible`
    )
    .replaceAll(
      `../installation/cluster.md`,
      `/${lang}/docs/${version}/guide/installation/cluster`
    )
    .replaceAll(
      `../installation/pseudo-cluster.md`,
      `/${lang}/docs/${version}/guide/installation/pseudo-cluster`
    )
    .replaceAll(
      `../zh/guide/alert/email.md`,
      `/zh-cn/docs/${version}/guide/alert/email`
    )
    .replaceAll(
      `installation/cluster.md`,
      `/${lang}/docs/${version}/guide/installation/cluster`
    )
    .replaceAll(
      /((\.\.\/)*(howto\/)?)datasource-setting.md/g,
      `https://github.com/apache/dolphinscheduler/blob/${version}-release/docs/docs/${
        lang === "en-us" ? "en" : "zh"
      }/guide/howto/datasource-setting.md`
    )
    .replaceAll(
      `start/quick-start.md`,
      `/${lang}/docs/${version}/guide/start/quick-start`
    );
};

module.exports = replaceDeadLinks;
