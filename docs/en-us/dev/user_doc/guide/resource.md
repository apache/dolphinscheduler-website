# Resource Center

If you want to use the resource upload function, you can select the local file directory for a single machine(this operation does not need to deploy Hadoop). Or you can also upload to a Hadoop or MinIO cluster, at this time, you need to have Hadoop (2.6+) or MinIO and other related environments

> **_Note:_**
>
> * If the resource upload function is used, the deployment user in [installation and deployment](installation/standalone.md) must to have operation authority
> * If you using Hadoop cluster with HA, you need to enable HDFS resource upload, and you need to copy the `core-site.xml` and `hdfs-site.xml` under the Hadoop cluster to `/opt/dolphinscheduler/conf`, otherwise Skip step

## HDFS Resource Configuration

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

## File Management

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

- Re-upload file

  > Re-upload file: Click the "Re-upload File" button to upload a new file to replace the old file, drag the file to the re-upload area, the file name will be automatically completed with the new file name

    <p align="center">
      <img src="/img/reupload_file_en.png" width="80%" />
    </p>


## UDF Management

### Resource Management

> The resource management and file management functions are similar. The difference is that the resource management is the uploaded UDF function, and the file management uploads the user program, script and configuration file.
> Operation function: rename, download, delete.

- Upload udf resources
  > Same as uploading files.

### Function Management

- Create UDF function
  > Click "Create UDF Function", enter the udf function parameters, select the udf resource, and click "Submit" to create the udf function.

> Currently only supports temporary UDF functions of HIVE

- UDF function name: the name when the UDF function is entered
- Package name Class name: Enter the full path of the UDF function
- UDF resource: Set the resource file corresponding to the created UDF

<p align="center">
   <img src="/img/udf_edit_en.png" width="80%" />
 </p>
 
## Task Group Settings

The task group is mainly used to control the concurrency of task instances, and is designed to control the pressure of other resources (it can also control the pressure of the Hadoop cluster, the cluster will have queue control it). When creating a new task definition, you can configure the corresponding task group and configure the priority of the task running in the task group. 

### Task Group Configuration 

#### Create Task Group 

<p align="center">
    <img src="/img/task_group_manage_eng.png" width="80%" />
</p>

The user clicks [Resources] - [Task Group Management] - [Task Group option] - create task Group 

<p align="center">
<img src="/img/task_group_create_eng.png" width="80%" />
</p> 

You need to enter the information in the picture:

[Task group name]: The name displayed when the task group is used

[Project name]: The project that the task group functions, this item is optional, if not selected, all the projects in the whole system can use this task group.

[Resource pool size]: The maximum number of concurrent task instances allowed 

#### View Task Group Queue 

<p align="center">
    <img src="/img/task_group_conf_eng.png" width="80%" />
</p>

Click the button to view task group usage information 

<p align="center">
    <img src="/img/task_group_queue_list_eng.png" width="80%" />
</p>

#### Use of Task Groups 

Note: The use of task groups is applicable to tasks executed by workers, such as [switch] nodes, [condition] nodes, [sub_process] and other node types executed by the master are not controlled by the task group. Let's take the shell node as an example: 

<p align="center">
    <img src="/img/task_group_use_eng.png" width="80%" />
</p>        


Regarding the configuration of the task group, all you need to do is to configure the part in the red box:

[Task group name] : The task group name displayed on the task group configuration page. Here you can only see the task group that the project has permission to (the project is selected when creating a task group), or the task group that acts globally (the new task group is created). when no item is selected) 

[Priority] : When there is a waiting resource, the task with high priority will be distributed to the worker by the master first. The larger the value of this part, the higher the priority. 

### Implementation Logic of Task Group 

#### Get Task Group Resources: 

The master judges whether the task is configured with a task group when distributing the task. If the task is not configured, it is normally thrown to the worker to run; if a task group is configured, it checks whether the remaining size of the task group resource pool meets the current task operation before throwing it to the worker for execution. , if the resource pool -1 is satisfied, continue to run; if not, exit the task distribution and wait for other tasks to wake up. 

#### Release and Wake Up: 

When the task that has obtained the task group resource ends, the task group resource will be released. After the release, it will check whether there is a task waiting in the current task group. If there is, mark the task with the best priority to run, and create a new executable event. . The event stores the task id that is marked to obtain the resource, and then obtains the task group resource and then runs it. 

#### Task Group Flowchart 

<p align="center">
    <img src="/img/task_group_process.png" width="80%" />
</p>        
