## GPG设置

### 安装GPG

在[GnuPG官网](https://www.gnupg.org/download/index.html)下载安装包。
GnuPG的1.x版本和2.x版本的命令有细微差别，下列说明以`GnuPG-2.1.23`版本为例。

安装完成后，执行以下命令查看版本号。

```shell
gpg --version
```

### 创建key

安装完成后，执行以下命令创建key。

`GnuPG-2.x`可使用：

```shell
gpg --full-gen-key
```

`GnuPG-1.x`可使用：

```shell
gpg --gen-key
```

根据提示完成key：

**注意：请使用Apache mail生成GPG的Key。**

```shell
gpg (GnuPG) 2.0.12; Copyright (C) 2009 Free Software Foundation, Inc.
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.

Please select what kind of key you want:
  (1) RSA and RSA (default)
  (2) DSA and Elgamal
  (3) DSA (sign only)
  (4) RSA (sign only)
Your selection? 1
RSA keys may be between 1024 and 4096 bits long.
What keysize do you want? (2048) 4096
Requested keysize is 4096 bits
Please specify how long the key should be valid.
        0 = key does not expire
     <n>  = key expires in n days
     <n>w = key expires in n weeks
     <n>m = key expires in n months
     <n>y = key expires in n years
Key is valid for? (0)
Key does not expire at all
Is this correct? (y/N) y

GnuPG needs to construct a user ID to identify your key.

Real name: ${输入用户名}
Email address: ${输入邮件地址}
Comment: ${输入注释}
You selected this USER-ID:
   "${输入的用户名} (${输入的注释}) <${输入的邮件地址}>"

Change (N)ame, (C)omment, (E)mail or (O)kay/(Q)uit? O
You need a Passphrase to protect your secret key. # 输入apache登录密码
```
注意：如果遇到以下错误：
```
gpg: cancelled by user
gpg: Key generation canceled.
```
需要使用自己的用户登录服务器，而不是root切到自己的账户

### 查看生成的key

```shell
gpg --list-keys
```

执行结果：

```shell
pub   4096R/85E11560 2019-11-15
uid                  ${用户名} (${注释}) <{邮件地址}>
sub   4096R/A63BC462 2019-11-15
```

其中85E11560为公钥ID。

### 将公钥同步到服务器

命令如下：

```shell
gpg --keyserver hkp://pool.sks-keyservers.net --send-key 85E11560
```

`pool.sks-keyservers.net`为随意挑选的[公钥服务器](https://sks-keyservers.net/status/)，每个服务器之间是自动同步的，选任意一个即可。

注意：如果同步到公钥服务器，可以在服务器上查到新建的公钥
http://keyserver.ubuntu.com:11371/pks/lookup?search=${用户名}&fingerprint=on&op=index
备用公钥服务器 gpg --keyserver hkp://keyserver.ubuntu.com --send-key ${公钥ID}


## 发布Apache Maven中央仓库

### 设置settings.xml文件

将以下模板添加到 `~/.m2/settings.xml`中，所有密码需要加密后再填入。
加密设置可参考[这里](http://maven.apache.org/guides/mini/guide-encryption.html)。

```xml
<settings>
  <servers>
    <server>
      <id>apache.snapshots.https</id>
      <username> <!-- APACHE LDAP 用户名 --> </username>
      <password> <!-- APACHE LDAP 加密后的密码 --> </password>
    </server>
    <server>
      <id>apache.releases.https</id>
      <username> <!-- APACHE LDAP 用户名 --> </username>
      <password> <!-- APACHE LDAP 加密后的密码 --> </password>
    </server>
  </servers>
</settings>
```

### 更新版本说明

```
https://github.com/apache/incubator-dolphinscheduler/blob/dev/RELEASE-NOTES.md
```

### 创建发布分支
从github下载的DolphinScheduler源代码到`~/incubator-dolphinscheduler/`目录，假设即将发布的版本为`${RELEASE.VERSION}`
git clone -b ${RELEASE.VERSION}-release https://github.com/apache/incubator-dolphinscheduler.git

创建`${RELEASE.VERSION}-release`分支，接下来的操作都在该分支进行(如果在github官网上手动执行发版分支创建，下面操作可以忽略)。

```shell
cd ~/incubator-dolphinscheduler/
git pull
git checkout -b ${RELEASE.VERSION}-release
git push origin ${RELEASE.VERSION}-release
```

### 发布预校验

```shell
mvn release:prepare -Prelease -Darguments="-DskipTests" -DautoVersionSubmodules=true -DdryRun=true -Dusername=${Github用户名}
```

-Prelease: 选择release的profile，这个profile会打包所有源码、jar文件以及可执行二进制包。

-DautoVersionSubmodules=true：作用是发布过程中版本号只需要输入一次，不必为每个子模块都输入一次。

-DdryRun=true：演练，即不产生版本号提交，不生成新的tag。

### 准备发布

首先清理发布预校验本地信息。

```shell
mvn release:clean
```

然后准备执行发布。

```shell
mvn release:prepare -Prelease -Darguments="-DskipTests" -DautoVersionSubmodules=true -DpushChanges=false -Dusername=${Github用户名}
```

和上一步演练的命令基本相同，去掉了-DdryRun=true参数。

-DpushChanges=false：不要将修改后的版本号和tag自动提交至Github。
如果遇到以下错误，请配置git邮箱为自己的apache邮箱和apache账号名
```shell
[ERROR] *** Please tell me who you are.
[ERROR]
[ERROR] Run
[ERROR]
[ERROR]   git config --global user.email "you@example.com"
[ERROR]   git config --global user.name "Your Name"
```

将本地文件检查无误后，提交至github。


```shell
git push
git push origin --tags
```

### 部署发布

```shell
mvn release:perform -Prelease -Darguments="-DskipTests" -DautoVersionSubmodules=true -Dusername=${Github用户名}
```

执行完该命令后，待发布版本会自动上传到Apache的临时筹备仓库(staging repository)。
访问https://repository.apache.org/#stagingRepositories, 使用Apache的LDAP账户登录后，就会看到上传的版本，`Repository`列的内容即为${STAGING.REPOSITORY}。
点击`Close`来告诉Nexus这个构建已经完成，只有这样该版本才是可用的。
如果电子签名等出现问题，`Close`会失败，可以通过`Activity`查看失败信息。

## 发布Apache SVN仓库

### 检出dolphinscheduler发布目录

如无本地工作目录，则先创建本地工作目录。

```shell
mkdir -p ~/ds_svn/dev/
cd ~/ds_svn/dev/
```

创建完毕后，从Apache SVN检出dolphinscheduler发布目录。

```shell
svn --username=${APACHE LDAP 用户名} co https://dist.apache.org/repos/dist/dev/incubator/dolphinscheduler
cd ~/ds_svn/dev/dolphinscheduler
```

### 添加gpg公钥

仅第一次部署的账号需要添加，只要`KEYS`中包含已经部署过的账户的公钥即可。

```shell
gpg -a --export ${GPG用户名} >> KEYS
```

### 将待发布的内容添加至SVN目录

创建版本号目录。

```shell
mkdir -p ~/ds_svn/dev/dolphinscheduler/${RELEASE.VERSION}
cd ~/ds_svn/dev/dolphinscheduler/${RELEASE.VERSION}
```

将源码包和二进制包添加至SVN工作目录。

```shell
cp -f ~/incubator-dolphinscheduler/dolphinscheduler-dist/target/*.zip ~/ds_svn/dev/dolphinscheduler/${RELEASE.VERSION}
cp -f ~/incubator-dolphinscheduler/dolphinscheduler-dist/target/*.zip.asc ~/ds_svn/dev/dolphinscheduler/${RELEASE.VERSION}
cp -f ~/incubator-dolphinscheduler/dolphinscheduler-dist/target/*.tar.gz ~/ds_svn/dev/dolphinscheduler/${RELEASE.VERSION}
cp -f ~/incubator-dolphinscheduler/dolphinscheduler-dist/target/*.tar.gz.asc ~/ds_svn/dev/dolphinscheduler/${RELEASE.VERSION}

```

### 生成文件签名

```shell
shasum -a 512 apache-dolphinscheduler-incubating-${RELEASE.VERSION}-src.zip >> apache-dolphinscheduler-incubating-${RELEASE.VERSION}-src.zip.sha512
shasum -b -a 512 apache-dolphinscheduler-incubating-${RELEASE.VERSION}-dolphinscheduler-bin.tar.gz >> apache-dolphinscheduler-incubating-${RELEASE.VERSION}-dolphinscheduler-bin.tar.gz.sha512
```

### 提交Apache SVN

```shell
cd ~/ds_svn/dev/dolphinscheduler
svn add *
svn --username=${APACHE LDAP 用户名} commit -m "release ${RELEASE.VERSION}"
```
## 检查发布结果

### 检查sha512哈希

```shell
shasum -c apache-dolphinscheduler-incubating-${RELEASE.VERSION}-src.zip.sha512
shasum -c apache-dolphinscheduler-incubating-${RELEASE.VERSION}-dolphinscheduler-bin.tar.gz.sha512
```

### 检查gpg签名

首先导入发布人公钥。从svn仓库导入KEYS到本地环境。（发布版本的人不需要再导入，帮助做验证的人需要导入，用户名填发版人的即可）

```shell
curl https://dist.apache.org/repos/dist/dev/incubator/dolphinscheduler/KEYS >> KEYS
gpg --import KEYS
gpg --edit-key "${发布人的gpg用户名}"
  > trust

Please decide how far you trust this user to correctly verify other users' keys
(by looking at passports, checking fingerprints from different sources, etc.)

  1 = I don't know or won't say
  2 = I do NOT trust
  3 = I trust marginally
  4 = I trust fully
  5 = I trust ultimately
  m = back to the main menu

Your decision? 5

  > save
```

然后进行gpg签名检查。

```shell
gpg --verify apache-dolphinscheduler-incubating-${RELEASE.VERSION}-src.zip.asc apache-dolphinscheduler-incubating-${RELEASE.VERSION}-src.zip
gpg --verify apache-dolphinscheduler-incubating-${RELEASE.VERSION}-dolphinscheduler-bin.tar.gz.asc apache-dolphinscheduler-incubating-${RELEASE.VERSION}-dolphinscheduler-bin.tar.gz
```

### 检查发布文件内容

#### 检查源码包的文件内容

解压缩`apache-dolphinscheduler-incubating-${RELEASE.VERSION}-src.zip`，进行如下检查:

- 检查源码包是否包含由于包含不必要文件，致使tarball过于庞大
- 文件夹包含单词`incubating`
- 存在`DISCLAIMER`文件
- 存在`LICENSE`和`NOTICE`文件
- 只存在文本文件，不存在二进制文件
- 所有文件的开头都有ASF许可证
- 能够正确编译，单元测试可以通过 (mvn install)
- 版本内容与Github上tag的内容相符 (diff -r a verify_dir tag_dir)
- 检查是否有多余文件或文件夹，例如空文件夹等

#### 检查二进制包的文件内容

解压缩`apache-dolphinscheduler-incubating-${RELEASE.VERSION}-dolphinscheduler-backend-bin.tar.gz`和`apache-dolphinscheduler-incubating-${RELEASE.VERSION}-dolphinscheduler-front-bin.tar.gz`
进行如下检查:

- 文件夹包含单词`incubating`
- 存在`DISCLAIMER`文件
- 存在`LICENSE`和`NOTICE`文件
- 所有文本文件开头都有ASF许可证
- 检查第三方依赖许可证：
  - 第三方依赖的许可证兼容
  - 所有第三方依赖的许可证都在`LICENSE`文件中声明
  - 依赖许可证的完整版全部在`license`目录
  - 如果依赖的是Apache许可证并且存在`NOTICE`文件，那么这些`NOTICE`文件也需要加入到版本的`NOTICE`文件中

全部的检查列表参见[这里](https://cwiki.apache.org/confluence/display/INCUBATOR/Incubator+Release+Checklist)。

## 发起投票

### 投票阶段

1. DolphinScheduler社区投票，发起投票邮件到`dev@dolphinscheduler.apache.org`。PPMC需要先按照文档检查版本的正确性，然后再进行投票。
经过至少72小时并统计到3个`+1 PPMC member`票后，即可进入下一阶段的投票。

2. Apache社区投票，发起投票邮件到`general@incubator.apache.org`。经过至少72小时并统计到3个`+1 binding`票后（只有IPMC的票才是binding），即可进行正式发布。

3. 宣布投票结果,发起投票结果邮件到`general@incubator.apache.org`。

### 投票模板

1. DolphinScheduler社区投票模板

注意： 在社区投票过程中，需要邀请所有mentor参加投票。

标题：

```
[VOTE] Release Apache DolphinScheduler (Incubating) ${RELEASE.VERSION}
```

正文：

```
Hello DolphinScheduler Community,

This is a call for vote to release Apache DolphinScheduler (Incubating) version ${RELEASE.VERSION}

Release notes:
https://github.com/apache/incubator-dolphinscheduler/blob/${RELEASE.VERSION}/ReleaseNotes.md

The release candidates:
https://dist.apache.org/repos/dist/dev/incubator/dolphinscheduler/${RELEASE.VERSION}/

Maven 2 staging repository:
https://repository.apache.org/content/repositories/${STAGING.REPOSITORY}/org/apache/dolphinscheduler/

Git tag for the release:
https://github.com/apache/incubator-dolphinscheduler/tree/${RELEASE.VERSION}

Release Commit ID:
https://github.com/apache/incubator-dolphinscheduler/commit/xxxxxxxxxxxxxxxxxxxxxxx

Keys to verify the Release Candidate:
https://dist.apache.org/repos/dist/dev/incubator/dolphinscheduler/KEYS

Look at here for how to verify this release candidate:
https://github.com/apache/incubator-dolphinscheduler/blob/1.2.0-release/README.md

The vote will be open for at least 72 hours or until necessary number of votes are reached.

Please vote accordingly:

[ ] +1 approve

[ ] +0 no opinion

[ ] -1 disapprove with the reason

Checklist for reference:

[ ] Download links are valid.

[ ] Checksums and PGP signatures are valid.

[ ] Source code artifacts have correct names matching the current release.

[ ] LICENSE and NOTICE files are correct for each DolphinScheduler repo.

[ ] All files have license headers if necessary.

[ ] No compiled archives bundled in source archive.

More detail checklist  please refer:
https://cwiki.apache.org/confluence/display/INCUBATOR/Incubator+Release+Checklist
```

2. 宣布投票结果模板：

正文：

```
The vote to release Apache DolphinScheduler (Incubating) ${RELEASE.VERSION} has passed.Here is the vote result,

7 PPMC member +1 votes:

xxx (mentor)
xxx
xxx (mentor)
xxx
xxx
xxx (mentor)
xxx

1 community +1 vote:
xxx

Thanks everyone for taking time to check this release and help us.
```

3. Apache社区投票邮件模板：

标题：

```
[VOTE] Release Apache DolphinScheduler (Incubating) ${RELEASE.VERSION}
```

正文：

```
Hello everyone,

This is a call for vote to release Apache DolphinScheduler (Incubating) version ${RELEASE.VERSION}.

The Apache DolphinScheduler community has voted on and approved a proposal to release
Apache DolphinScheduler (Incubating) version ${RELEASE.VERSION}.

We now kindly request the Incubator IPMC members review and vote on this incubator release.

Dolphin Scheduler is a distributed and easy-to-expand visual DAG workflow scheduling system,
dedicated to solving the complex dependencies in data processing, making the scheduling system out of the box for data processing.

DolphinScheduler community vote and result threads:
https://lists.apache.org/thread.html/xxxxxxxxxxxxxxxxxxxxxxx

https://lists.apache.org/thread.html/xxxxxxxxxxxxxxxxxxxxxxx

Release notes:
https://github.com/apache/incubator-dolphinscheduler/blob/${RELEASE.VERSION}/ReleaseNotes.md

The release candidates:
https://dist.apache.org/repos/dist/dev/incubator/dolphinscheduler/${RELEASE.VERSION}/

Maven 2 staging repository:
https://repository.apache.org/content/repositories/${STAGING.REPOSITORY}/org/apache/dolphinscheduler/

Git tag for the release:
https://github.com/apache/incubator-dolphinscheduler/tree/${RELEASE.VERSION}

Release Commit ID:
https://github.com/apache/incubator-dolphinscheduler/commit/xxxxxxxxxxxxxxxxxxxxxxx

Keys to verify the Release Candidate:
https://dist.apache.org/repos/dist/dev/incubator/dolphinscheduler/KEYS

Look at here for how to verify this release candidate:
https://github.com/apache/incubator-dolphinscheduler/blob/1.2.0-release/README.md

The vote will be open for at least 72 hours or until necessary number of votes are reached.
Please vote accordingly:

[ ] +1 approve

[ ] +0 no opinion

[ ] -1 disapprove with the reason

Checklist for reference:

[ ] Download links are valid.

[ ] Checksums and PGP signatures are valid.

[ ] Source code artifacts have correct names matching the current release.

[ ] LICENSE and NOTICE files are correct for each DolphinScheduler repo.

[ ] All files have license headers if necessary.

[ ] No compiled archives bundled in source archive.

More detail checklist  please refer:
https://cwiki.apache.org/confluence/display/INCUBATOR/Incubator+Release+Checklist

The following votes are carried over from DolphinScheduler dev mailing list,

+1 binding, xxx
+1 binding, xxx

+1 non-binding, xxx
+1 non-binding, xxx
```

4. 宣布投票结果模板：

**注意：计算投票结果时，社区投票结果也需要包含在内。**

正文：

```
We’ve received 3 +1 binding votes and one +1 non-binding vote:

+1 binding, xxx
+1 binding, xxx
+1 binding, xxx

+1 non-binding, xxx

Thank you everyone for taking the time to review the release and help us.
I will process to publish the release and send ANNOUNCE.
```

## 完成发布

1. 将源码和二进制包从svn的dev目录移动到release目录

```shell
svn mv https://dist.apache.org/repos/dist/dev/incubator/dolphinscheduler/${RELEASE.VERSION} https://dist.apache.org/repos/dist/release/incubator/dolphinscheduler/
```

2. 在Apache Staging仓库找到DolphinScheduler并点击`Release`

3. 更新下载页面

```
https://dolphinscheduler.apache.org/en-us/docs/user_doc/download.html
https://dolphinscheduler.apache.org/zh-cn/docs/user_doc/download.html
```

4. 发送邮件到`general@incubator.apache.org`和`dev@dolphinscheduler.apache.org`通知完成版本发布。

通知邮件模板：

标题：

```
[ANNOUNCE] Release Apache DolphinScheduler (Incubating) ${RELEASE.VERSION}
```

正文：

```
Hi all,

We are glad to announce the release of Apache DolphinScheduler(incubating) ${RELEASE.VERSION}. Once again I would like to express my thanks to your help.

Dolphin Scheduler is a distributed and easy-to-expand visual DAG workflow scheduling system,
dedicated to solving the complex dependencies in data processing, making the scheduling system out of the box for data processing.


Download Links: http://dolphinscheduler.apache.org/en-us/docs/user_doc/download.html

Release Notes: https://github.com/apache/incubator-dolphinscheduler/blob/${RELEASE.VERSION}/ReleaseNotes.md

Website: https://dolphinscheduler.apache.org/

DolphinScheduler Resources:
- Issue: https://github.com/apache/incubator-dolphinscheduler/issues/
- Mailing list: dev@dolphinscheduler.apache.org
- Documents: https://github.com/apache/incubator-dolphinscheduler/blob/${RELEASE.VERSION}/README.md

```
