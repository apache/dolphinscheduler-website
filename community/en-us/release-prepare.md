# Release Preparation

## Check release-docs

Compared with the last release, the `release-docs` of the current release needs to be updated to the latest, if there are dependencies and versions changes

 - `dolphinscheduler-dist/release-docs/LICENSE`
 - `dolphinscheduler-dist/release-docs/NOTICE`
 - `dolphinscheduler-dist/release-docs/licenses`

## Update Version

For example, to release `x.y.z`, the following updates are required:

- Version in the code:
  - `sql`:
    - `dolphinscheduler_mysql.sql`: `t_ds_version` needs to be updated to x.y.z
    - `dolphinscheduler_postgre.sql`: `t_ds_version` needs to be updated to x.y.z
    - `upgrade`: whether to add`x.y.z_schema`
    - `soft_version`: need to be updated to x.y.z
  - `docker/docker-swarm`:
    - `docker-compose.yml`: `image: dolphinscheduler.docker.scarf.sh/apache/dolphinscheduler` needs to be updated to x.y.z
    - `docker-stack.yml`: `image: dolphinscheduler.docker.scarf.sh/apache/dolphinscheduler` needs to be updated to x.y.z
  - `docker/kubernetes/dolphinscheduler`:
    - `Chart.yaml`: `appVersion` needs to be updated to x.y.z (`version` is helm chart version，incremented and different from x.y.z)
    - `values.yaml`: `image.tag` needs to be updated to x.y.z
  - `dolphinscheduler-python/pydolphinscheduler/setup.py`: change `version` to x.y.z
- Version in the docs:
  - Change the placeholder `<version>` to the `x.y.z`
    - `docker.md`
    - `expansion-reduction.md`
    - `kubernetes.md`
    - `upgrade.md`
  - Change configuration file
    - `docs/configs/site.js`:
      - `docsLatest`: update to x.y.z
      - `docs0`: The `text` of two places of `en-us/zh-cn` needs to be updated to `latest(x.y.z)`
      - `docsxyz`: Add a drop-down menu with `key` as `docsxyz` and `text` as `x.y.z` in `children` of two places of `en-us/zh-cn`
    - `docs/configs/index.md.jsx`: Add `'x.y.z': docsxyzConfig`
    - `docs/configs/docsdev.js`: Rename to `docsx-y-z.js` and change its content `/dev/` to `/x.y.z/`
  - Add new history version
    - `docs/docs/en/history-versions.md` and `docs/docs/zh/history-versions.md`: Add the new version and link for `x.y.z`
