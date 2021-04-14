# 发版准备

## 检查 release-docs

和上一个版本比较，如果有依赖及版本发生了变化，当前版本的 `release-docs` 需要被更新到最新

 - `dolphinscheduler-dist/release-docs/LICENSE`
 - `dolphinscheduler-dist/release-docs/NOTICE`
 - `dolphinscheduler-dist/release-docs/licenses`

## 更新版本

例如要发版 `x.y.z`，需要先进行以下修改:

 - `pom.xml`: `revision`, `version`, `tag` 标签版本更新为 x.y.z
 - `ambari_plugin`:
   - `ambari_plugin/common-services/DOLPHIN/x.y.z`: 目录版本更新为 x.y.z
   - `ambari_plugin/common-services/DOLPHIN/x.y.z/alerts.json`: 内容版本更新为 x.y.z
   - `ambari_plugin/common-services/DOLPHIN/x.y.z/metainfo.xml`: 内容版本更新为 x.y.z
   - `ambari_plugin/statcks/DOLPHIN/metainfo.xml`: 内容版本更新为 x.y.z
 - `sql`:
   - `dolphinscheduler_mysql.sql`: `t_ds_version` 版本更新为 x.y.z
   - `dolphinscheduler_postgre.sql`: `t_ds_version` 版本更新为 x.y.z
   - `upgrade`: 是否新增 `x.y.z_schema`
   - `soft_version`: 版本更新为 x.y.z
 - `docker/kubernetes/dolphinscheduler/Chart.yaml`:
   - `version`: helm chart 版本更新，不要设置为 x.y.z
   - `appVersion`: 版本更新为 x.y.z
