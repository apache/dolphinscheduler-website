# 下载DolphinScheduler发布版本

使用下面的链接,从Apache DolphinScheduler的镜像下载。

**只有源码包属于Apache官方发布包，二进制发布包只是为了方便用户使用。**

## DolphinScheduler
| 日期 | 版本| | 下载 |
|:---:|:--:|:--:|:--:|
| Feb. 24th, 2020 | 1.2.1 | Source code| [[src]](https://www.apache.org/dyn/closer.cgi/incubator/dolphinscheduler/1.2.1/apache-dolphinscheduler-incubating-1.2.1-src.zip) [[asc]](https://downloads.apache.org/incubator/dolphinscheduler/1.2.1/apache-dolphinscheduler-incubating-1.2.1-src.zip.asc) [[sha512]](https://downloads.apache.org/incubator/dolphinscheduler/1.2.1/apache-dolphinscheduler-incubating-1.2.1-src.zip.sha512)|
| | | Binary Distribution| [[tar]](https://www.apache.org/dyn/closer.cgi/incubator/dolphinscheduler/1.2.1/apache-dolphinscheduler-incubating-1.2.1-dolphinscheduler-bin.tar.gz) [[asc]](https://downloads.apache.org/incubator/dolphinscheduler/1.2.1/apache-dolphinscheduler-incubating-1.2.1-dolphinscheduler-bin.tar.gz.asc) [[sha512]](https://downloads.apache.org/incubator/dolphinscheduler/1.2.1/apache-dolphinscheduler-incubating-1.2.1-dolphinscheduler-bin.tar.gz.sha512)|
| Jan. 2th, 2020 | 1.2.0 | Source code| [[src]](https://www.apache.org/dyn/closer.cgi/incubator/dolphinscheduler/1.2.0/apache-dolphinscheduler-incubating-1.2.0-src.zip) [[asc]](https://downloads.apache.org/incubator/dolphinscheduler/1.2.0/apache-dolphinscheduler-incubating-1.2.0-src.zip.asc) [[sha512]](https://downloads.apache.org/incubator/dolphinscheduler/1.2.0/apache-dolphinscheduler-incubating-1.2.0-src.zip.sha512)|
| | | Backend Binary Distribution| [[tar]](https://www.apache.org/dyn/closer.cgi/incubator/dolphinscheduler/1.2.0/apache-dolphinscheduler-incubating-1.2.0-dolphinscheduler-backend-bin.tar.gz) [[asc]](https://downloads.apache.org/incubator/dolphinscheduler/1.2.0/apache-dolphinscheduler-incubating-1.2.0-dolphinscheduler-backend-bin.tar.gz.asc) [[sha512]](https://downloads.apache.org/incubator/incubator/dolphinscheduler/1.2.0/apache-dolphinscheduler-incubating-1.2.0-dolphinscheduler-backend-bin.tar.gz.sha512)|
| | | Frontend Binary Distribution| [[tar]](https://www.apache.org/dyn/closer.cgi/incubator/dolphinscheduler/1.2.0/apache-dolphinscheduler-incubating-1.2.0-dolphinscheduler-front-bin.tar.gz) [[asc]](https://downloads.apache.org/incubator/dolphinscheduler/1.2.0/apache-dolphinscheduler-incubating-1.2.0-dolphinscheduler-front-bin.tar.gz.asc) [[sha512]](https://downloads.apache.org/incubator/incubator/dolphinscheduler/1.2.0/apache-dolphinscheduler-incubating-1.2.0-dolphinscheduler-front-bin.tar.gz.sha512)|


# 验证版本
[PGP signatures KEYS](https://downloads.apache.org/incubator/dolphinscheduler/KEYS)

使用PGP或SHA签名验证下载文件的完整性至关重要。可以使用GPG或PGP验证PGP签名。请下载KEYS以及发布的asc签名文件。建议从主发布目录而不是镜像中获取这些文件。

```
gpg -i KEYS

or

pgpk -a KEYS

or

pgp -ka KEYS
```

要验证二进制文件/源，您可以从主发布目录下载相关的asc文件，并按照以下指南进行操作。

```
gpg --verify apache-dolphinscheduler-incubating********.asc apache-dolphinscheduler-incubating*********

or

pgpv apache-dolphinscheduler-incubating********.asc

or

pgp apache-dolphinscheduler-incubating********.asc
```

<br/>
