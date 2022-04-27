# Release Guide

## GPG Settings

### Install GPG

Download installation package on [official GnuPG website](https://www.gnupg.org/download/index.html).
The command of GnuPG 1.x version can differ a little from that of 2.x version.
The following instructions take `GnuPG-2.1.23` version for example.

After the installation, execute the following command to check the version number.

```shell
gpg --version
```

### Create Key

After the installation, execute the following command to create key.

This command indicates `GnuPG-2.x` can be used:

```shell
gpg --full-gen-key
```

This command indicates `GnuPG-1.x` can be used:

```shell
gpg --gen-key
```

Finish the key creation according to instructions:

**Notice: Please use Apache mail for key creation.**

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

Real name: ${Input username}
Email address: ${Input email}
Comment: ${Input comment}
You selected this USER-ID:
   "${Inputed username} (${Inputed comment}) <${Inputed email}>"

Change (N)ame, (C)omment, (E)mail or (O)kay/(Q)uit? O
You need a Passphrase to protect your secret key. # Input passwords
```

### Check Generated Key

```shell
gpg --list-keys
```

Execution Result:

```shell
pub   4096R/85E11560 2019-11-15
uid                  ${Username} (${Comment}) <{Email}>
sub   4096R/A63BC462 2019-11-15
```

Among them, 85E11560 is public key ID.

### Upload the Public Key to Key Server

The command is as follow:

```shell
gpg --keyserver hkp://pool.sks-keyservers.net --send-key 85E11560
```

`pool.sks-keyservers.net` is randomly chosen from [public key server](https://sks-keyservers.net/status/).
Each server will automatically synchronize with one another, so it would be okay to choose any one.

## Apache Maven Central Repository Release

### Set settings.xml

Add the following template to `~/.m2/settings.xml`, all the passwords need to be filled in after encryption.
For encryption settings, please see [here](http://maven.apache.org/guides/mini/guide-encryption.html).

```xml
<settings>
  <servers>
    <server>
      <id>apache.snapshots.https</id>
      <username> <!-- APACHE LDAP username --> </username>
      <password> <!-- APACHE LDAP encrypted password --> </password>
    </server>
    <server>
      <id>apache.releases.https</id>
      <username> <!-- APACHE LDAP username --> </username>
      <password> <!-- APACHE LDAP encrypted password --> </password>
    </server>
  </servers>
</settings>
```

### Update Release Notes

```
https://github.com/apache/dolphinscheduler/releases
```

### Create Release Branch

Suppose DolphinScheduler source codes downloaded from github is under `~/dolphinscheduler/` directory and the version to be released is `${RELEASE.VERSION}`.
Create `${RELEASE.VERSION}-release` branch, where all the following operations are performed.

```shell
cd ~/dolphinscheduler/
git pull
git checkout -b ${RELEASE.VERSION}-release
git push origin ${RELEASE.VERSION}-release
```

### Pre-Release Check

```shell
# make gpg command could be run in maven correct
export GPG_TTY=$(tty)

mvn release:prepare -Prelease,python -Darguments="-DskipTests" -DautoVersionSubmodules=true -DdryRun=true -Dusername=${Github username}
```

-Prelease,python: choose release and python profile, which will pack all the source codes, jar files and executable binary packages, and Python distribute package.

-DautoVersionSubmodules=true：it can make the version number is inputted only once and not for each sub-module.

-DdryRun=true：rehearsal, which means not to generate or submit new version number and new tag.

### Prepare for the Release

First, clean local pre-release check information.

```shell
mvn release:clean
```

Then, prepare to execute the release.

```shell
mvn release:prepare -Prelease,python -Darguments="-DskipTests" -DautoVersionSubmodules=true -DpushChanges=false -Dusername=${Github username}
```

It is basically the same as the previous rehearsal command, but deleting -DdryRun=true parameter.

-DpushChanges=false：do not submit the edited version number and tag to GitHub automatically.

After making sure there is no mistake in local files, submit them to GitHub.

```shell
git push
git push origin --tags
```

### Deploy the Release

```shell
mvn release:perform -Prelease,python -Darguments="-DskipTests" -DautoVersionSubmodules=true -Dusername=${Github username}
```

After that command is executed, the version to be released will be uploaded to Apache staging repository automatically.
Visit [https://repository.apache.org/#stagingRepositories](https://repository.apache.org/#stagingRepositories) and use Apache LDAP account to log in; then you can see the uploaded version, the content of `Repository` column is the ${STAGING.REPOSITORY}.
Click `Close` to tell Nexus that the construction is finished, because only in this way, this version can be usable.
If there is any problem in gpg signature, `Close` will fail, but you can see the failure information through `Activity`.

## Apache SVN Repository Release

### Checkout dolphinscheduler Release Directory

If there is no local work directory, create one at first.

```shell
mkdir -p ~/ds_svn/dev/
cd ~/ds_svn/dev/
```

After the creation, checkout dolphinscheduler release directory from Apache SVN.

```shell
svn --username=${APACHE LDAP username} co https://dist.apache.org/repos/dist/dev/dolphinscheduler
cd ~/ds_svn/dev/dolphinscheduler
```

### Add gpg Public Key

Only the account in its first deployment needs to add that.
It is alright for `KEYS` to only include the public key of the deployed account.

```shell
gpg -a --export ${GPG username} >> KEYS
```

### Add the Release Content to SVN Directory

Create folder by version number.

```shell
mkdir -p ~/ds_svn/dev/dolphinscheduler/${RELEASE.VERSION}
cd ~/ds_svn/dev/dolphinscheduler/${RELEASE.VERSION}
```

Add source code packages, binary packages and executable binary packages to SVN working directory.

```shell
# Source and binary tarball for main code
cp -f ~/dolphinscheduler/dolphinscheduler-dist/target/*.tar.gz ~/ds_svn/dev/dolphinscheduler/${RELEASE.VERSION}
cp -f ~/dolphinscheduler/dolphinscheduler-dist/target/*.tar.gz.asc ~/ds_svn/dev/dolphinscheduler/${RELEASE.VERSION}

# Source and binary tarball for Python API
mkdir -p ~/ds_svn/dev/dolphinscheduler/${RELEASE.VERSION}/python
cp -f ~/dolphinscheduler/dolphinscheduler-dist/target/python/* ~/ds_svn/dev/dolphinscheduler/${RELEASE.VERSION}/python
```

### Generate sign files

```shell
shasum -a 512 apache-dolphinscheduler-${RELEASE.VERSION}-src.tar.gz >> apache-dolphinscheduler-${RELEASE.VERSION}-src.tar.gz.sha512
shasum -b -a 512 apache-dolphinscheduler-${RELEASE.VERSION}-bin.tar.gz >> apache-dolphinscheduler-${RELEASE.VERSION}-bin.tar.gz.sha512
cd python
shasum -a 512 apache-dolphinscheduler-${RELEASE.VERSION}.tar.gz >> apache-dolphinscheduler-${RELEASE.VERSION}.tar.gz.sha512
shasum -b -a 512 apache_dolphinscheduler-${RELEASE.VERSION}-py3-none-any.whl >> apache_dolphinscheduler-${RELEASE.VERSION}-py3-none-any.whl.sha512
cd ../
```

### Commit to Apache SVN

```shell
svn add *
svn --username=${APACHE LDAP username} commit -m "release ${RELEASE.VERSION}"
```
## Check Release

### Check sha512 hash

```shell
shasum -c apache-dolphinscheduler-${RELEASE.VERSION}-src.tar.gz.sha512
shasum -c apache-dolphinscheduler-${RELEASE.VERSION}-bin.tar.gz.sha512
cd python
shasum -c python/apache-dolphinscheduler-${RELEASE.VERSION}.tar.gz.sha512
shasum -c python/apache_dolphinscheduler-${RELEASE.VERSION}-py3-none-any.whl.sha512
cd ../
```

### Check gpg Signature

First, import releaser's public key.
Import KEYS from SVN repository to local. (The releaser does not need to import again; the checking assistant needs to import it, with the user name filled as the releaser's. )

```shell
curl https://dist.apache.org/repos/dist/dev/dolphinscheduler/KEYS >> KEYS
gpg --import KEYS
gpg --edit-key "${GPG username of releaser}"
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

Then, check the gpg signature.

```shell
gpg --verify apache-dolphinscheduler-${RELEASE.VERSION}-src.tar.gz.asc apache-dolphinscheduler-${RELEASE.VERSION}-src.tar.gz
gpg --verify apache-dolphinscheduler-${RELEASE.VERSION}-bin.tar.gz.asc apache-dolphinscheduler-${RELEASE.VERSION}-bin.tar.gz
gpg --verify python/apache-dolphinscheduler-${RELEASE.VERSION}.tar.gz.asc python/apache-dolphinscheduler-${RELEASE.VERSION}.tar.gz
gpg --verify python/apache_dolphinscheduler-${RELEASE.VERSION}-py3-none-any.whl.asc python/apache_dolphinscheduler-${RELEASE.VERSION}-py3-none-any.whl
```

### Check Released Files

#### Check source package

Decompress `apache-dolphinscheduler-${RELEASE.VERSION}-src.tar.gz` and `apache-dolphinscheduler-${RELEASE.VERSION}.tar.gz` in `python` directory then check the following items:

*   Check whether source tarball is oversized for including nonessential files
*   `LICENSE` and `NOTICE` files exist
*   Correct year in `NOTICE` file
*   There is only text files but no binary files
*   All source files have ASF headers
*   Codes can be compiled and pass the unit tests (mvn install)
*   The contents of the release match with what's tagged in version control (diff -r a verify_dir tag_dir)
*   Check if there is any extra files or folders, empty folders for example

#### Check binary packages

Decompress `apache-dolphinscheduler-${RELEASE.VERSION}-src.tar.gz` and `apache-dolphinscheduler-${RELEASE.VERSION}-bin.tar.gz`
to check the following items:

- `LICENSE` and `NOTICE` files exist
- Correct year in `NOTICE` file
- Check the third party dependency license:
  - The software have a compatible license
  - All software licenses mentioned in `LICENSE`
  - All the third party dependency licenses are under `licenses` folder
  - If it depends on Apache license and has a `NOTICE` file, that `NOTICE` file need to be added to `NOTICE` file of the release

## Call for a Vote

### Vote procedure

1. DolphinScheduler community vote: send the vote e-mail to `dev@dolphinscheduler.apache.org`.
PMC needs to check the rightness of the version according to the document before they vote.
After at least 72 hours and with at least 3 `+1 and no -1 PMC member` votes, it can come to the next stage of the vote.

2. Announce the vote result: send the result vote e-mail to `dev@dolphinscheduler.apache.org`。

### Vote Templates

1. DolphinScheduler Community Vote Template

Title：

```
[VOTE] Release Apache DolphinScheduler ${RELEASE.VERSION}
```

Body：

```
Hello DolphinScheduler Community,

This is a call for vote to release Apache DolphinScheduler version ${RELEASE.VERSION}

Release notes:
https://dist.apache.org/repos/dist/dev/dolphinscheduler/${RELEASE.VERSION}/ReleaseNotes.md

The release candidates:
https://dist.apache.org/repos/dist/dev/dolphinscheduler/${RELEASE.VERSION}/

Maven 2 staging repository:
https://repository.apache.org/content/repositories/${STAGING.REPOSITORY}/org/apache/dolphinscheduler/

Git tag for the release:
https://github.com/apache/dolphinscheduler/tree/${RELEASE.VERSION}

Release Commit ID:
https://github.com/apache/dolphinscheduler/commit/xxxxxxxxxxxxxxxxxxxxxxx

Keys to verify the Release Candidate:
https://dist.apache.org/repos/dist/dev/dolphinscheduler/KEYS

Look at here for how to verify this release candidate:
https://github.com/apache/dolphinscheduler/blob/1.2.0-release/README.md

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

```

2. Announce the vote result:

Body：

```
The vote to release Apache DolphinScheduler ${RELEASE.VERSION} has passed.Here is the vote result,

4 PMC member +1 votes:

xxx
xxx
xxx
xxx

1 community +1 vote:
xxx

Thanks everyone for taking time to check this release and help us.
```

## Finish the Release

### Move source packages, binary packages and KEYS from the `dev` directory to `release` directory

```shell
svn mv https://dist.apache.org/repos/dist/dev/dolphinscheduler/${RELEASE.VERSION} https://dist.apache.org/repos/dist/release/dolphinscheduler/
```

### Find DolphinScheduler in staging repository and click `Release`

### Send Announcement E-mail Community

You should send announcement E-mail after release process finished. The E-mail should send to `dev@dolphinscheduler.apache.org`
and cc to `announce@apache.org`.

Announcement e-mail template as below：

Title：

```
[ANNOUNCE] Release Apache DolphinScheduler ${RELEASE.VERSION}
```

Body：

```
Hi all,

We are glad to announce the release of Apache DolphinScheduler ${RELEASE.VERSION}. Once again I would like to express my thanks to your help.

Dolphin Scheduler is a distributed and easy-to-extend visual workflow scheduler system,
dedicated to solving the complex task dependencies in data processing, making the scheduler system out of the box for data processing.


Download Links: https://dolphinscheduler.apache.org/en-us/download/download.html

Release Notes: https://dist.apache.org/repos/dist/dev/dolphinscheduler/${RELEASE.VERSION}/ReleaseNotes.md

Website: https://dolphinscheduler.apache.org/

DolphinScheduler Resources:
- Issue: https://github.com/apache/dolphinscheduler/issues/
- Mailing list: dev@dolphinscheduler.apache.org
- Documents: https://github.com/apache/dolphinscheduler/blob/${RELEASE.VERSION}/README.md

```
