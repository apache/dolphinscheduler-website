# Refactoring, Plug-in, Performance Improves By 20 times, Apache DolphinScheduler 2.0 alpha Release Highlights Check!

<div align='center'><img src="https://s1.imgpp.com/2021/11/16/a920be6733a3d99af38d1cdebfcbb3ff.md.png"></div>

Hello community, good news! After nearly 10 months of joint efforts by more than 100 community contributors, we are happy to announce the release of Apache DolphinScheduler 2.0 alpha. This is the first major version of DolphinScheduler since it entered Apache. It has undergone a number of key updates and optimizations, which means a milestone in the development of DolphinScheduler.
DolphinScheduler 2.0 alpha mainly refactors the implementation of Master, greatly optimizes the metadata structure and processing flow, adds SPI plug-in capabilities, and improves performance by 20 times. At the same time, the new version has designed a brand new UI interface to bring a better user experience. In addition, 2.0 alpha has newly added and optimized some features that are eagerly demanded in the community, such as parameter transfer, version control, import and export functions.
Note: The current alpha version does not support automatic upgrades, and we will support this feature in the next version.

2.0 alpha download link: https://dolphinscheduler.apache.org/en-us/download/download.html

## Optimize the Kernel and Increase Performance By 20 Times

Compared with DolphinScheduler 1.3.8, under the same hardware configuration (3 sets of 8-core 16G), 2.0 alpha throughput performance is increased by 20 times, which is mainly due to the reconstruction of the Master, the optimization of master execution process and the workflow processing process, etc. ,including:

- Refactor the execution process of the Master, change the previous status polling monitoring to an event notification mechanism, which greatly reduces the pressure of the database polling;
Remove the global lock, increase the fragmentation processing mechanism of the Master, change the sequential read and write commands to parallel processing, and enhance the horizontal expansion ability of the Master;

- Optimize the workflow processing process, reduce the use of thread pool, and greatly increase the number of workflows processed by a single Master;
Increase the caching mechanism to greatly reduce the number of database operations;

- Optimize the database connection mode, which immensely reduces the time-consuming of database operation;

- Simplify the processing flow and reduce unnecessary time-consuming operations during the processing.

## UI Components Optimization Brings Brand New UI Interface

<div align='center'><img src="https://s1.imgpp.com/2021/11/16/4e4024cbddbe3113f730c5e67f083c4f.md.png"></div>

<div align='center'><img src="https://s1.imgpp.com/2021/11/16/75e002b21d827aee9aeaa3922c20c13f.md.png"></div>

UI interface comparison: 1.3.9 (top) VS. 2.0 alpha (bottom)


>

2.0 UI mainly optimized by:

- Optimize the display of components: the interface is more concise, and the workflow process display is clearer;

- Highlight the key content: click the task box can display task details;

- Enhanced recognizability: The tool bar on the left is marked with names to make the tools easier to identify and easy to operate;

- Adjust the order of the components: adjust the order of the components to be more in line with user habits.

In addition to changes in performance and UI, DolphinScheduler has also undergone more than 20 new features and bug fixes.

## List of New Features

- Task result transfer function
- Added Switch task and Pigeon task components
- Added environmental management function
- Added batch import , export and batch move functions
- New registration center plug-in function
- New task plugin function

## Optimizations
- Optimize the alarm group function
- Optimize RestApi
- Optimize workflow version management
- Optimize import and export
- Optimize worker group management function
- Optimize the install.sh installation script to simplify the configuration process
## Bug fix
- [#6550]The list of environments in the DAG task pop-up window is not updated
- [#6506]Fix install.sh for DS 2.0 and add comment to install_config.conf
- [#6497]Shell task can not use user defined environment correctly
- [#6478]Missing history data in complement data mode
- [#6352]override the old process definition when I use the copy workflow feature
- [#6342]Task instance page date backfill bug
- [#5701]When deleting a user, the accessToken associated with the user should also be deleted
- [#4809]cannot get application status when kerberos authentication is enabled
- [#4450]Hive/Spark data sources do not support multi-tenancy when Kerberos authentication is enabled bug
## Thanks to Contributors
The release of DolphinScheduler 2.0 alpha embodies the wisdom and strength of the community contributors. Their active participation and great enthusiasm open the DolphinScheduler 2.0 era!
Thanks so much for the participation of 100+ contributors (GitHub ID), and we are looking forward to more and more open sourcing enthusiasts joining the DolphinScheduler community co-construction, to contribute yourself to building a more usable big data workflow scheduling platform!

<div align='center'><img src="https://s1.imgpp.com/2021/11/16/8926d45ead1f735e8cfca0e8142b315f.md.png"></div>

2.0 List of alpha contributors
