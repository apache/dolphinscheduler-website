# 发版后续

## 更新官网

例如已发版 `x.y.z`，需要进行以下更新:

- `download/en-us/download.md` 和 `download/zh-cn/download.md`: 增加 x.y.z 版本发布包的下载

## 更新 GitHub issue 模板

DolphinScheduler 在 GitHub issue 中有版本选择的部分，当有新版本发版后，需要更新这部分的内容。目前与版本关联的是
[bug-report](https://github.com/apache/dolphinscheduler/blob/dev/.github/ISSUE_TEMPLATE/bug-report.yml)，发版的时候需要
向其中的 **Version** 部分增加内容。

## 发布镜像

构建 Docker 镜像，请参考 [如何构建一个 Docker 镜像？](https://dolphinscheduler.apache.org/zh-cn/docs/latest/user_doc/guide/installation/docker.html)

然后推送镜像

```bash
docker tag apache/dolphinscheduler:x.y.z apache/dolphinscheduler:latest
docker login # 输入用户和密码
docker push apache/dolphinscheduler:x.y.z
docker push apache/dolphinscheduler:latest
```

## 发布到PyPI

需要将 Python API 发布到 PyPI，请参考 [Python API release](https://github.com/apache/dolphinscheduler/blob/dev/dolphinscheduler-python/pydolphinscheduler/RELEASE.md#to-pypi)
完成 PyPI 的发版
