# 发版后续

## 更新官网

例如已发版 `x.y.z`，需要进行以下更新:

 - `docs/en-us/x.y.z` 和 `docs/zh-cn/x.y.z`: 复制老版本目录改为新版本 x.y.z
   - 所包含文档的引用链接保持和 x.y.z 一致，尤其注意以下文件更新:
     - `architecture-design.md`
     - `cluster-deployment.md`
     - `docker-deployment.md`
     - `expansion-reduction.md`
     - `kubernetes-deployment.md`
     - `standalone-deployment.md`
     - `upgrade.md`
 - `site_config/docsx-y-z.js`: 复制老配置文件改为新版本，内容链接保持和 x.y.z 一致
 - `site_config/site.js`:
   - `docsLatest`: 更新为 x.y.z
   - `docs0`: 两处 `en-us/zh-cn` 的 `text` 更新为 `latest(x.y.z)`
   - `docsxyz`: 两处 `en-us/zh-cn` 的 `children` 增加 `key` 为 `docsxyz`, `text` 为 `x.y.z` 的下拉菜单
 - `src/pages/docs/index.md.jsx`: 增加 `'x.y.z': docsxyzConfig,`
 - `download/en-us/download.md` 和 `download/zh-cn/download.md`: 增加 x.y.z 版本发布包的下载

## 更新 GitHub issue 模板

DolphinScheduler 在 GitHub issue 中有版本选择的部分，当有新版本发版后，需要更新这部分的内容。目前与版本关联的是
[bug-report](https://github.com/apache/dolphinscheduler/blob/dev/.github/ISSUE_TEMPLATE/bug-report.yml)，发版的时候需要
向其中的 **Version** 部分增加内容。

## 发布镜像

构建 Docker 镜像，请参考 [如何构建一个 Docker 镜像？](/zh-cn/docs/latest/user_doc/guide/installation/docker.html)

然后推送镜像

```bash
docker tag apache/dolphinscheduler:x.y.z apache/dolphinscheduler:latest
docker login # 输入用户和密码
docker push apache/dolphinscheduler:x.y.z
docker push apache/dolphinscheduler:latest
```
