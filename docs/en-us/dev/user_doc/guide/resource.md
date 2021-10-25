# Resource Center

If you want to use the resource upload function, you can select the local file directory for a single machine(this operation does not need to deploy Hadoop). Or you can also upload to a Hadoop or MinIO cluster, at this time, you need to have Hadoop (2.6+) or MinIO and other related environments

> **_Note:_**
>
> * If the resource upload function is used, the deployment user in [installation and deployment](installation/standalone.md) must to have operation authority
> * If you using Hadoop cluster with HA, you need to enable HDFS resource upload, and you need to copy the `core-site.xml` and `hdfs-site.xml` under the Hadoop cluster to `/opt/dolphinscheduler/conf`, otherwise Skip step

## hdfs resource configuration

- Upload resource files and udf functions, all uploaded files and resources will be stored on hdfs, so the following configuration items are required:

```
conf/common/common.properties
    # Users who have permission to create directories under the HDFS root path
    hdfs.root.user=hdfs
    # data base dir, resource file will store to this hadoop hdfs path, self configuration, please make sure the directory exists on hdfs and have read write permissions。"/escheduler" is recommended
    data.store2hdfs.basepath=/dolphinscheduler
    # resource upload startup type : HDFS,S3,NONE
    res.upload.startup.type=HDFS
    # whether kerberos starts
    hadoop.security.authentication.startup.state=false
    # java.security.krb5.conf path
    java.security.krb5.conf.path=/opt/krb5.conf
    # loginUserFromKeytab user
    login.user.keytab.username=hdfs-mycluster@ESZ.COM
    # loginUserFromKeytab path
    login.user.keytab.path=/opt/hdfs.headless.keytab

conf/common/hadoop.properties
    # ha or single namenode,If namenode ha needs to copy core-site.xml and hdfs-site.xml
    # to the conf directory，support s3，for example : s3a://dolphinscheduler
    fs.defaultFS=hdfs://mycluster:8020
    #resourcemanager ha note this need ips , this empty if single
    yarn.resourcemanager.ha.rm.ids=192.168.xx.xx,192.168.xx.xx
    # If it is a single resourcemanager, you only need to configure one host name. If it is resourcemanager HA, the default configuration is fine
    yarn.application.status.address=http://xxxx:8088/ws/v1/cluster/apps/%s

```

- Only one address needs to be configured for yarn.resourcemanager.ha.rm.ids and yarn.application.status.address, and the other address is empty.
- You need to copy core-site.xml and hdfs-site.xml from the conf directory of the Hadoop cluster to the conf directory of the dolphinscheduler project, and restart the api-server service.

## File management

> It is the management of various resource files, including creating basic txt/log/sh/conf/py/java and other files, uploading jar packages and other types of files, and can do edit, rename, download, delete and other operations.

  <p align="center">
   <img src="/img/file-manage-en.png" width="80%" />
 </p>

- Create a file
  > The file format supports the following types: txt, log, sh, conf, cfg, py, java, sql, xml, hql, properties

<p align="center">
   <img src="/img/file_create_en.png" width="80%" />
 </p>

- upload files

> Upload file: Click the "Upload File" button to upload, drag the file to the upload area, the file name will be automatically completed with the uploaded file name

<p align="center">
   <img src="/img/file-upload-en.png" width="80%" />
 </p>

- File View

> For the file types that can be viewed, click the file name to view the file details

<p align="center">
   <img src="/img/file_detail_en.png" width="80%" />
 </p>

- download file

> Click the "Download" button in the file list to download the file or click the "Download" button in the upper right corner of the file details to download the file

- File rename

<p align="center">
   <img src="/img/file_rename_en.png" width="80%" />
 </p>

- delete
  > File list -> Click the "Delete" button to delete the specified file

## UDF management

### Resource management

> The resource management and file management functions are similar. The difference is that the resource management is the uploaded UDF function, and the file management uploads the user program, script and configuration file.
> Operation function: rename, download, delete.

- Upload udf resources
  > Same as uploading files.

### Function management

- Create UDF function
  > Click "Create UDF Function", enter the udf function parameters, select the udf resource, and click "Submit" to create the udf function.

> Currently only supports temporary UDF functions of HIVE

- UDF function name: the name when the UDF function is entered
- Package name Class name: Enter the full path of the UDF function
- UDF resource: Set the resource file corresponding to the created UDF

<p align="center">
   <img src="/img/udf_edit_en.png" width="80%" />
 </p>
