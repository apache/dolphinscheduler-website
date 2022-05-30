# Release Post

## Publish Image

Build docker image first, please refer to [How to build a Docker image?](https://dolphinscheduler.apache.org/en-us/docs/latest/user_doc/guide/start/docker.html)

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
