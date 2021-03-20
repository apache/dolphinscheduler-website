# 发版准备

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
