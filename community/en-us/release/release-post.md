# Release Post

## Update Official Website

For example, after the release of `x.y.z`, the following updates are required:

 - Add new version of `docs/en-us/x.y.z` and `docs/zh-cn/x.y.z`: copy the old directory to the new version x.y.z
   - The reference links of the included documents keep same with x.y.z, especially pay attention to the following file updates:
     - `architecture-design.md`
     - `cluster-deployment.md`
     - `docker-deployment.md`
     - `expansion-reduction.md`
     - `kubernetes-deployment.md`
     - `standalone-deployment.md`
     - `upgrade.md`
 - `site_config/docsx-y-z.js`: copy the old configuration file to the new version, and keep the content link same with x.y.z
 - `site_config/site.js`:
   - `docsLatest`: update to x.y.z
   - `docs0`: The `text` of two places of `en-us/zh-cn` needs to be updated to `latest(x.y.z)`
   - `docsxyz`: Add a drop-down menu with `key` as `docsxyz` and `text` as `x.y.z` in `children` of two places of `en-us/zh-cn`
 - `src/pages/docs/index.md.jsx`: Add `'x.y.z': docsxyzConfig,`
 - `download/en-us/download.md` and `download/zh-cn/download.md`: add the download of the x.y.z release package

## Add New Version To GitHub's bug-report.yml

DolphinScheduler's GitHub [bug-report](https://github.com/apache/dolphinscheduler/blob/dev/.github/ISSUE_TEMPLATE/bug-report.yml)
issue template have **Version** selection bottom. So after we release DolphinScheduler we should and the new version to
bug-report.yml. Please notice we should add both version we just released, and the next release version, which to track
bug for next release version code.

## Publish Image

Build docker image first, please refer to [How to build a Docker image?](/en-us/docs/latest/user_doc/guide/installation/docker.html)

And then publish image

```bash
docker tag apache/dolphinscheduler:x.y.z apache/dolphinscheduler:latest
docker login # enter the username and password
docker push apache/dolphinscheduler:x.y.z
docker push apache/dolphinscheduler:latest
```