# Release Preparation

## Check release-docs

Compared with the last release, the `release-docs` of the current release needs to be updated to the latest, if there are dependencies and versions changes

 - `dolphinscheduler-dist/release-docs/LICENSE`
 - `dolphinscheduler-dist/release-docs/NOTICE`
 - `dolphinscheduler-dist/release-docs/licenses`

## Update Version

For example, to release `x.y.z`, the following updates are required:

 - `pom.xml`: `revision`, `version`, `tag` need to be updated to x.y.z
 - `ambari_plugin`:
   - `ambari_plugin/common-services/DOLPHIN/x.y.z`: the directory needs to be updated to x.y.z
   - `ambari_plugin/common-services/DOLPHIN/x.y.z/alerts.json`: the content needs to be updated to x.y.z
   - `ambari_plugin/common-services/DOLPHIN/x.y.z/metainfo.xml`: the content needs to be updated to x.y.z
   - `ambari_plugin/statcks/DOLPHIN/metainfo.xml`: the content needs to be updated to x.y.z
 - `sql`:
   - `dolphinscheduler_mysql.sql`: `t_ds_version` needs to be updated to x.y.z
   - `dolphinscheduler_postgre.sql`: `t_ds_version` needs to be updated to x.y.z
   - `upgrade`: whether to add`x.y.z_schema`
   - `soft_version`: need to be updated to x.y.z
 - `docker/kubernetes/dolphinscheduler/Chart.yaml`:
   - `version`: helm chart version needs to be updated, different from x.y.z
   - `appVersion`: need to be updated to x.y.z
