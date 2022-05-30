# 发版后续

## 发布镜像

构建 Docker 镜像，请参考 [如何构建一个 Docker 镜像？](https://dolphinscheduler.apache.org/zh-cn/docs/latest/user_doc/guide/start/docker.html)

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
