# Release Post

## Update Official Website

For example, after the release of `x.y.z`, the following updates are required:

- `download/en-us/download.md` and `download/zh-cn/download.md`: add the download of the x.y.z release package

## Add New Version To GitHub's bug-report.yml

DolphinScheduler's GitHub [bug-report](https://github.com/apache/dolphinscheduler/blob/dev/.github/ISSUE_TEMPLATE/bug-report.yml)
issue template have **Version** selection bottom. So after we release DolphinScheduler we should and the new version to
bug-report.yml

## Publish Image

Build docker image first, please refer to [How to build a Docker image?](https://dolphinscheduler.apache.org/en-us/docs/latest/user_doc/guide/installation/docker.html)

And then publish image

```bash
docker tag apache/dolphinscheduler:x.y.z apache/dolphinscheduler:latest
docker login # enter the username and password
docker push apache/dolphinscheduler:x.y.z
docker push apache/dolphinscheduler:latest
```

## Release to PyPI

Python API need to release to PyPI for easier download and use, you can see more detail in [Python API release](https://github.com/apache/dolphinscheduler/blob/dev/dolphinscheduler-python/pydolphinscheduler/RELEASE.md#to-pypi)
to finish PyPI release.
