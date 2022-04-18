# 发版准备

## 检查 release-docs

和上一个版本比较，如果有依赖及版本发生了变化，当前版本的 `release-docs` 需要被更新到最新

 - `dolphinscheduler-dist/release-docs/LICENSE`
 - `dolphinscheduler-dist/release-docs/NOTICE`
 - `dolphinscheduler-dist/release-docs/licenses`

## 更新版本

例如要发版 `x.y.z`，需要先进行以下修改:

- 修改代码中的版本号:
  - `sql`:
    - `dolphinscheduler_mysql.sql`: `t_ds_version` 版本更新为 x.y.z
    - `dolphinscheduler_postgre.sql`: `t_ds_version` 版本更新为 x.y.z
    - `upgrade`: 是否新增 `x.y.z_schema`
    - `soft_version`: 版本更新为 x.y.z
  - `docker/docker-swarm`:
    - `docker-compose.yml`: `image: dolphinscheduler.docker.scarf.sh/apache/dolphinscheduler` 版本更新为 x.y.z
    - `docker-stack.yml`: `image: dolphinscheduler.docker.scarf.sh/apache/dolphinscheduler` 版本更新为 x.y.z
  - `docker/kubernetes/dolphinscheduler`:
    - `Chart.yaml`: `appVersion` 版本更新为 x.y.z (`version` 为 helm chart 版本, 增量更新但不要设置为 x.y.z)
    - `values.yaml`: `image.tag` 版本更新为 x.y.z
  - `dolphinscheduler-python/pydolphinscheduler/setup.py`: 修改其中的 `version` 为 x.y.z
- 修改文档（docs模块）中的版本号:
  - 将下面文件的占位符 `<version>` 修改成 `x.y.z`
    - `docker.md`
    - `expansion-reduction.md`
    - `kubernetes.md`
    - `upgrade.md`
  - 修改配置文件的版本号
     - `docs/configs/site.js`:
       - `docsLatest`: 更新为 x.y.z
       - `docs0`: 两处 `en-us/zh-cn` 的 `text` 更新为 `latest(x.y.z)`
       - `docsxyz`: 两处 `en-us/zh-cn` 的 `children` 增加 `key` 为 `docsxyz`, `text` 为 `x.y.z` 的下拉菜单
     - `docs/configs/index.md.jsx`: 增加 `'x.y.z': docsxyzConfig,`
     - `docs/configs/docsdev.js`: 重命名为 `docsx-y-z.js` 并将其中的 `/dev/` 修改为 `/x.y.z/`
  - 新增历史版本
     - `docs/docs/en/history-versions.md` 和 `docs/docs/zh/history-versions.md`: 增加新的历史版本为 `x.y.z`
