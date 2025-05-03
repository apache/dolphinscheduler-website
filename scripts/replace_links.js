const replaceDeadLinks = (content, lang, version) => {
  return content
    .replaceAll(
      `kubernetes.md`,
      `/${lang}/docs/${version}/guide/installation/kubernetes`
    )
    .replaceAll(
      `guide/alert/email.md`,
      `/${lang}/docs/${version}/guide/alert/email`
    )
    .replaceAll(
      `../guide/homepage.md`,
      `/${lang}/docs/${version}/guide/homepage`
    )
    .replaceAll(
      `priority.md`,
      `/${lang}/docs/${version}/guide/parameter/priority`
    )
    .replaceAll(`local.md`, `/${lang}/docs/${version}/guide/parameter/local`)
    .replaceAll(`project-parameter.md`, `/${lang}/docs/${version}/guide/parameter/project-parameter`)
    .replaceAll(`startup-parameter.md`, `/${lang}/docs/${version}/guide/parameter/startup-parameter`)
    .replaceAll(`../task/sql.md`, `/${lang}/docs/${version}/guide/task/sql`)
    .replaceAll(
      `../task/stored-procedure.md`,
      `/${lang}/docs/${version}/guide/task/stored-procedure`
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
      `./task-instance.md`,
      `/${lang}/docs/${version}/guide/project/task-instance`
    )
    .replaceAll(
      `../../architecture/configuration.md`,
      `/${lang}/docs/${version}/architecture/configuration`
    )
    .replaceAll(`appendix.md`, `/${lang}/docs/${version}/guide/task/appendix`)
    .replaceAll(`switch.md`, `/${lang}/docs/${version}/guide/task/switch`)
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
      /((\.\.\/)*(task\/)|(\.\/)?)python.md/g,
      `/${lang}/docs/${version}/guide/task/python`
    )
    .replaceAll(
      /((\.\.\/)*(parameter\/)?)global.md/g,
      `/${lang}/docs/${version}/guide/parameter/global`
    )
    .replaceAll(
      /((\.\.\/)*(installation\/)?)standalone.md/g,
      `/${lang}/docs/${version}/guide/installation/standalone`
    )
    .replaceAll(
      /((\.\.\/)*(security\/)|(\.\/)?)security.md/g,
      `/${lang}/docs/${version}/guide/security/security`
    )
    .replaceAll(
      /((\.\.\/)*(task\/)?)shell.md/g,
      `/${lang}/docs/${version}/guide/task/shell`
    )
    .replaceAll(
      /((\.\.\/)*(installation\/)?)pseudo-cluster.md/g,
      `/${lang}/docs/${version}/guide/installation/pseudo-cluster`
    )
    .replaceAll(
      /((\.\.\/)*(installation\/)?)cluster.md/g,
      `/${lang}/docs/${version}/guide/installation/cluster`
    )
    .replaceAll(
      /((\.\.\/)*?)start\/quick-start.md/g,
      `/${lang}/docs/${version}/guide/start/quick-start`
    )
    .replaceAll(
      /((\.\.\/)*(installation\/)?)datasource-setting.md/g,
      `/${lang}/docs/${version}/guide/installation/datasource-setting`
    )
    .replaceAll(
      /((\.\.\/)*(join\/)|(\.\/)?)document.md/g,
      `/${lang}/docs/${version}/contribute/join/document`
    )
    .replaceAll(
      /((\.\.\/)*(join\/)|(\.\/)?)issue.md/g,
      `/${lang}/docs/${version}/contribute/join/issue`
    )
    .replaceAll(
      /((\.\.\/)*(join\/)|(\.\/)?)pull-request.md/g,
      `/${lang}/docs/${version}/contribute/join/pull-request`
    )
    .replaceAll(
      /((\.\.\/)*(join\/)|(\.\/)?)commit-message.md/g,
      `/${lang}/docs/${version}/contribute/join/commit-message`
    )
    .replaceAll(
      `./development-environment-setup.md`,
      `/${lang}/docs/${version}/contribute/development-environment-setup`
    )
    .replaceAll(
      `./frontend-development.md`,
      `/${lang}/docs/${version}/contribute/frontend-development`
    )
    .replaceAll(
      `https://dolphinscheduler.apache.org/${lang}/download/download.html`,
      `/${lang}/download`
    )
    .replaceAll(
      /datasource-setting.md/g,
      `https://github.com/apache/dolphinscheduler/blob/${version}-release/docs/docs/${
        lang === "en-us" ? "en" : "zh"
      }/guide/howto/datasource-setting.md`
    )
    .replaceAll(
      `general-setting.md`,
      `https://github.com/apache/dolphinscheduler/blob/${version}-release/docs/docs/${
        lang === "en-us" ? "en" : "zh"
      }/guide/howto/general-setting.md`
    );
};

module.exports = replaceDeadLinks;
