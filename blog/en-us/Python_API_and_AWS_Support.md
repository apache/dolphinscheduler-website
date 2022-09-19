---
title:Apache DolphinScheduler Extends Capabilities Through Python API and AWS Support
keywords: Apache,DolphinScheduler,scheduler,big data,ETL,airflow,hadoop,orchestration,dataops,Meetup
description: Today, Apache DolphinScheduler announced the official release of version 2.0.5.
---
# Apache DolphinScheduler Extends Capabilities Through Python API and AWS Support

In the ever-changing world of technology, data is abundant. In fact, trillions of gigabytes of data are generated every day!

Stop and think about that for a second!

Storing and processing these humongous amounts of data is no easy feat. Big data workflow schedulers such as the Apache DolphinScheduler and Apache Airflow help businesses perform operations on large volumes of data.

Let’s take a deep dive and look at two prominent features of Apache DolphinScheduler: **PyDolphinScheduler and AWS support.**

Happy reading!

About PyDolphinScheduler
Before we formally define PyDolphinScheduler, let’s take a deep dive and understand what Apache DolphinScheduler does.

Apache DolphinScheduler is a distributed and extensible workflow scheduler platform that offers powerful DAG visual interfaces, helping data scientists and analysts author, schedule, and monitor batch data pipelines smoothly without needing heavy code.

![](https://miro.medium.com/max/630/0*vjtGRiHZFvYLT8QZ)


While users of Apache DolphinScheduler can monitor and tunnel Directed Acyclic Graphs (DAG) through its drag-and-drop visual interface (we’ll talk more on this later), Apache DolphinScheduler lets users implement workflows through Python code for the best control over their workflows.

With this in mind, let’s formally define PyDolphinScheduler.

According to their website,

“PyDolphin Scheduler is the Python API for Apache DolphinScheduler, which allows you to define your workflows through Python code, aka workflow-as-codes.”

In essence, the DolphinScheduler Python API is a wrapper for the workflow scheduler that lets you easily create and define workflows. You can still run and monitor all your workflows through the visual DAG interface, making DolphinScheduler an attractive option compared to Apache Airflow and Apache Azkaban.
![](https://miro.medium.com/max/630/0*Ep9rZFSTviU8SjmP)


You get the best of both worlds: the innate versatility of the Python code followed by the intuitive ease of using the visual drag-and-drop interface.

The rate at which data is generated has blown out of proportion in the 21st century.

According to Cisco, the global internet traffic is estimated to be around one zettabyte per year!

Let’s stop short and put this into perspective. If each brick of the Great Wall of China measures 1 gigabyte, this hypothetically means that you could build a whopping 258 Great Walls of China with a single zettabyte!


The burden of analyzing vast amounts of data can be clearly seen here.

That’s what makes Python one of the best programming languages for analysis, maintenance, and deployment. Since Python is typically employed for data analytics and pipelines, PyDolphinScheduler is the perfect way to define your workflows.

Python is also extensively used by machine learning and artificial intelligence teams and also in schedulers and various libraries.

## Benefits of Visual DAG
Let’s check out the benefits of having a visual DAG interface.

Since its release in 2016, Apache Airflow has become quite popular among data scientists and engineers.

But there was a caveat.

While developers of Airflow’s code-first philosophy positively impacted the platform’s versatility, it proved disastrous at times. For example, developers often found maintaining and troubleshooting errors through code extremely hard and time-consuming.

This is where Apache DolphinScheduler shone through. Users now could create and define workflows easily through PyDolphinSceduler and then utilize the visual DAG interface to monitor the workflows.


In addition, Apache DolphinScheduler had one of the best visual suspension and error handling features: something that was unavailable in Apache Airflow, which agonized users a lot.

To show you how easy it is to create and run workflows in DolphinScheduler using the visual DAG method, here’s an example:

You can drag-and-drop tasks to create or add them to existing workflows.
![](https://miro.medium.com/max/630/0*pDtLAhzGRbKUxdd6)


In addition, you can visually check and schedule the timing, including start time, end time, timezone, and Crontab expressions. Furthermore, you can visually set timing in advance for the next, say, 5 times.

![](https://miro.medium.com/max/630/0*469396ZUGmyhs5J3)

If you wish to manually trigger the workflow, you can do so through the start button. After clicking on the start button, you can see the workflow instance and running status in the ‘Workflow Instance’ page.
![](https://miro.medium.com/max/630/0*E_lL6Y07us_w1xcL)


In addition, you can also view the task log for specific workflow instances.

![](https://miro.medium.com/max/630/0*2QRw57Z3w04vjNTK)

See how easy it is to handle workflows through the visual DAG interface?

## What is No-Code Workflow?
In the early days of data engineering, scientists found it extremely hard to merge specific actions with code.

For example, let’s say a database is about to run out of storage. Most likely, engineers would have some sort of troubleshooting or monitoring system in place. In addition, they had to verify whether it was a false alarm, then create a bigger instance, move the data, and redirect services to the new one — all the while testing for data integrity.

Soon engineers realized that many of these steps could be automated through workflows with code.

A workflow, after all, is a set of tasks with dependencies between them.

For big data, powerful schedulers like Apache Airflow and Apache DolphinScheduler helps users create workflows as codes, specifically in the form of Directed Acyclic Graphs. In workflow-as-a-code, the tasks are well-defined through precise inputs and outputs — making this system an excellent leap for data scientists and engineers.

While it has benefits in and of itself, such as optimized performance and modeling, workflow-as-code has its own flaws.

Firstly, it requires significant expertise in Python coding just to execute the workflow.

Secondly, since the data comes out in the form of code, deciphering data and valuable information at a higher level is a daunting task.

Thirdly, making changes, monitoring, and handling errors is a nightmare when it comes to the code-only approach.

That’s why Apache DolphinScheduler employs a visual DAG interface to address these problems.

With the no-code workflow, even beginners and non-technical users can execute workflows and monitor them. The drag-and-drop capability allows users to easily envision data and overall logic — which is not available in Apache Airflow.

Furthermore, this also reduces errors, which, when paired with Apache DolphinScheduler’s error handling methods, can vastly improve performance, productivity, and efficiency.

## Installing PyDolphinScheduler
To get started with PyDolphinSchduler, you must have Python and pip installed on your machine.

## Installing Python
Installing Python and pip varies depending on the operating system you use. This Python Wiki offers detailed installation guides for various systems.

For PyDolphinScheduler, I recommend using Python 3.6 and above. For smoother usage, ensure that you install stable releases instead of beta versions.

Once you’ve downloaded and installed Python, verify if your installation is successful by typing:

python — version.

You’ll see details about the installed Python version if your installation was successful.

## Installing PyDolphinScheduler
The next step is to install PyDolphinScheduler by using pip.

Here’s the terminal command:

python -m pip install apache-dolphinscheduler

This’ll install the latest version of PyDolphinScheduler.

![](https://miro.medium.com/max/630/0*fp60NKsj2UDpa4wF)

## Starting the Python Gateway Service
Since PyDolphinScheduler is the Python API for Apache Dolphin Scheduler, you need to install it before you can run workflows. You can define workflows and task structures, though.

Here’s a detailed guide to help you install Apache DolphinScheduler.

## Task Dependencies and Types
A task is a basic unit of execution in PyDolphinScheduler.

In essence, tasks are the nodes of a Directed Acyclic Graph, i.e., they are arranged into DAGs. Tasks have downstream and upstream dependencies set between them, which helps express the order they should execute in.

Tasks are declared using this command:

pydolphinscheduler.tasks.Shell

This command requires a parameter name and command.

Here are four examples of task declaration:
![](https://miro.medium.com/max/630/0*0abMa6_VRCycef7o)


PyDolphinScheduler has numerous task types:

Python Function Wrapper
Shell
SQL
Python
HTTP
Switch
Condition
Map Reduce
Procedure
Datax
Sub Process
Flink
Task dependencies are the order in which tasks must be performed.

One of the critical aspects of using tasks is defining how each task relates to one another, specifically the upstream and downstream tasks.

Firstly, you declare the tasks, and then you declare their dependencies.

Setting task dependence is quite easy. You can use the following:

set_downstream or >>
set_upstream or <<
Let’s take an example to illustrate the point.

In the following code, task_parent is the leading task of the entire workflow.
task_child_one and task_child_two are the two downstream tasks
The task called task_union will not run unless both the task_child_one and task_child_two are done, as they are upstream.
![](https://miro.medium.com/max/630/0*O-OJwFXNUyfMVeRQ)

## Useful PyScheduler Documentation Links
To learn more about PythonScheduler, refer to these links:

PyDolphinScheduler homepage
Installation guide for PyDolphinScheduler
PyDolphinScheduler tutorials
PyDolphinScheduler tasks
## About AWS Support
Let’s get straight to the point.

Amazon Web Services offers a fully integrated portfolio of various cloud-computing services to help developers and data engineers build, deploy, and manage big data applications.

The best thing about AWS?

There’s no need to worry about hardware procurement or fret over infrastructure maintenance. This helps you focus resources and time on building.
![](https://miro.medium.com/max/630/0*AKaFFrBSDWHO4egJ)


So, why are we talking about AWS here?

The success of Apache DolphinScheduler’s visual DAG interface heralded many international users. While these users loved DolphinScheduler’s capabilities, most of their projects involved overseas vendors such as AWS.

Without dedicated support for AWS, many users were frustrated. This prompted the developers at DolphinScheduler to implement support for the vendor.

In the first quarter of 2022, developers added support for some of the most popular tools and services. This proved to be one of the most significant additions to Apache DolphnScheduler.

Apache DolphinScheduler now supports Amazon EMR and Amazon Redshift. In addition, there’s resource center support for Amazon S3, too.

Let’s take a deep dive into these task types and look at how they have dramatically changed the way developers use Apache DS.

### Amazon EMR
Amazon EMR, formerly known as the Amazon Elastic MapReduce, is a managed cluster platform that aims to simplify operating big data frameworks — including Apache Spark and Apache Hadoop — on AWS to analyze copious amounts of data.
![](https://miro.medium.com/max/630/0*pJUztHHC1YIiWHn9)


Furthermore, Amazon EMR offers the capability to transform and transfer large volumes of data into and out of other AWS services, like Amazon S3 for data stores and Amazon DynamoDB for databases.

So how does Amazon EMR support help Apache DolphinScheduler users?

AWS integration: Having support for Amazon EMR means users can get the best of both worlds, with Amazon EMR’s flexibility, scalability, reliability, and quick deployment. Users who have already used Amazon services can now easily define and schedule their workflows on Apache DolphinScheduler.

In addition, Amazon EMR offers robust security features by leveraging other services such as IAM and Amazon VPC to help secure data and clusters.

Combining Apache DolphinScheduler’s error detection and handling features with Amazon EMR’s management interfaces and log files can troubleshoot issues and failures quickly.
![](https://miro.medium.com/max/630/0*wD_vt1-OT42FRvff)


DS now has support for ‘RunJobFlow’ feature of Amazon EMR, which allows users to submit multiple steps to the service and specify the number of resources to be used.

### Amazon RedShift
Amazon Redshift is a data warehouse that “uses SQL to analyze both structured and semi-structured data lakes, operational databases, and data warehouses through AWS-designed hardware and machine learning to deliver the best ROI at all scales.
![](https://miro.medium.com/max/630/0*0V5XJ4qgsml26ZW_)


It helps collaborate and share data, optimizes business intelligence, improves demand forecast, and above all, increases developer productivity.

Again, how does adding Amazon RedShift to DolphinScheduler benefit users?

Amazon RedShift allows users to focus on getting insights from data within seconds for various needs without worrying about managing the complete data warehouse. It also helps run predictive analytics on complex and scaled data across data lakes, databases, and even third-party data sets.

In addition, users can get up to 3X better price performance compared to other cloud data warehouses through RedShift’s automated optimizations aimed at improving query speed.

And just like Amazon EMR, RedShift also benefits greatly from AWS’s comprehensive security capabilities by providing data security out of the box (without any additional cost).
![](https://miro.medium.com/max/630/0*8dg_uEvvjaXA9SCR)


Apache DolphinScheduler has now extended support for Amazon RedShift data sources for SQL task types. Users can run RedShift tasks by selecting the “RedShift” data source in the SQL task type. For a quick recap, SQL task type is used to connect to databases and execute SQL commands.

### Amazon S3
Amazon S3, or Amazon Simple Storage Service, is an object storage service that offers powerful scalability, performance, and security. Users can leverage Amazon S3 to store and protect large amounts of data for multiple use cases, including data lakes, websites, mobile applications, big data analytics, and more.
![](https://miro.medium.com/max/630/0*vtdKBMiYZfF2Ml1d)


Let’s pose the same question: How do Apache DolphinScheduler users benefit from this support addition?

Amazon S3 is one of the cutting-edge technologies in cloud data storage and offers numerous benefits at a very low cost. Coupled with the ease of migration and simplicity in management, users can gather and store copious amounts of data reliably and securely.
![](https://miro.medium.com/max/630/0*ta1fs-BBWinWp879)


Apache DolphinScheduler’s resource center now supports Amazon S3 for uploading resources, adding to its already impressive support for local and HDFS resource storage.

Here’s a brief guide on how to use DolphinScheduler’s resource center:

The resource center is used for uploading files, UDF functions, and task group management.
![](https://miro.medium.com/max/630/0*mCU2pz2iKryETiVa)


Creating files: You can create files — supported file formats include txt, py, sql, xml, and more.
![](https://miro.medium.com/max/630/0*OdGnPDD870bQX-bC)


Uploading files: Users can click the “Upload file” button or even drag-and-drop files.
![](https://miro.medium.com/max/630/0*lQSrpQRftyxPC5q4)


Viewing files: Users can click on files that are viewable and check out the file details.

For more information about the resource center, please visit this link.

Future Support
Apache DolphinScheduler also has two more future additions in their pipelines: Amazon Athena and AWS DataSync.

These exciting additions will add more functionalities to the robust scheduler platform, paving the way for more inclusive projects and business processes.
![](https://miro.medium.com/max/630/0*tuxu-pPzQWoz7f53)


Useful AWS Support Documentation Links
To learn more about AWS in DolphinScheduler, refer to these links:

* Amazon EMR
* Amazon RedShift
* Amazon S3

Conclusion
Apache DolphinScheduler makes scheduling workflows a breeze with its DAG interface, multiple task types, no-code workflows, and more. PyDolphinScheduler streamlines the process of defining tasks, and the recent support for AWS platforms immensely boosts the scheduler’s capabilities.


Apache DolphinScheduler’s popularity grew as it is used by tech giants, including Lenovo, IBM China, and Dell.

This exhaustive guide covered the basics to help you gain a brief understanding of PyDolphinScheduler and AWS components. We hope this article prompts you to go out and experiment with the features for yourself.

Adios!

Join the Community
There are numerous ways and channels to participate and contribute to the growing DolphinScheduler community. Some ways you can do so: Documentation, translation, testing, Q&A, keynote speeches, articles, and more.

Check out the comprehensive guide explaining how to participate in the contribution.

Check these links for issues compiled by the community:

For novices
For experts/non-newbies
Useful links:

Github repository
Official website
Youtube
Slack
Mailing list: dev@dolphinscheduler@apache.org
Twitter handle: @DolphinSchedule
