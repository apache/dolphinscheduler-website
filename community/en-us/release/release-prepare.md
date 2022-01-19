# Release Preparation

## Check release-docs

Compared with the last release, the `release-docs` of the current release needs to be updated to the latest,
if there are dependencies and versions changes

 - `dolphinscheduler-dist/release-docs/LICENSE`
 - `dolphinscheduler-dist/release-docs/NOTICE`
 - `dolphinscheduler-dist/release-docs/licenses`

## Update Version

For example, to release version is `x.y.z`, the following file are required to be updated to version `x.y.z` :

 - `pom.xml`: property `revision`, `version`, `tag`
 - `sql`:
   - `dolphinscheduler_mysql.sql`: table `t_ds_version`
   - `dolphinscheduler_postgre.sql`: table `t_ds_version`
   - `dolphinscheduler_h2.sql`: table `t_ds_version`
   - `upgrade`: whether to add `x.y.z_schema`
   - `soft_version`
 - `docker/docker-swarm`:
   - `docker-compose.yml`: `image: dolphinscheduler.docker.scarf.sh/apache/dolphinscheduler`
   - `docker-stack.yml`: `image: dolphinscheduler.docker.scarf.sh/apache/dolphinscheduler`
 - `docker/kubernetes/dolphinscheduler`:
   - `Chart.yaml`: `appVersion` (`version` is helm chart version，incremented and different from x.y.z)
   - `values.yaml`: `image.tag`
