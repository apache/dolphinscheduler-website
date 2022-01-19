# 发版准备

## 检查 release-docs

和上一个版本比较，如果有依赖及版本发生了变化，当前版本的 `release-docs` 需要被更新到最新

 - `dolphinscheduler-dist/release-docs/LICENSE`
 - `dolphinscheduler-dist/release-docs/NOTICE`
 - `dolphinscheduler-dist/release-docs/licenses`

## 更新版本

例如要发的版本为 `x.y.z`，如下的版本需要先修改成 `x.y.z`

 - `pom.xml`: 属性 `revision`, `version`, `tag`
 - `sql`:
   - `dolphinscheduler_mysql.sql`: 表 `t_ds_version`
   - `dolphinscheduler_postgre.sql`: 表 `t_ds_version`
   - `dolphinscheduler_h2.sql`:  表 `t_ds_version`
   - `upgrade`: 是否新增 `x.y.z_schema`
   - `soft_version`
 - `docker/docker-swarm`:
   - `docker-compose.yml`: `image: dolphinscheduler.docker.scarf.sh/apache/dolphinscheduler`
   - `docker-stack.yml`: `image: dolphinscheduler.docker.scarf.sh/apache/dolphinscheduler`
 - `docker/kubernetes/dolphinscheduler`:
   - `Chart.yaml`: `appVersion` (`version` 为 helm chart 版本, 增量更新但不要设置为 x.y.z)
   - `values.yaml`: `image.tag`
