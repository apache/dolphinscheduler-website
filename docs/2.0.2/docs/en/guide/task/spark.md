# SPARK

- Through the SPARK node, you can directly execute the SPARK program. For the spark node, the worker will use the `spark-submit` method to submit tasks

> Drag in the toolbar![PNG](https://analysys.github.io/easyscheduler_docs_cn/images/toolbar_SPARK.png)The task node to the drawing board, as shown in the following figure:

<p align="center">
   <img src="/img/spark-submit-en.png" width="80%" />
 </p>

- Program type: supports JAVA, Scala and Python three languages
- The class of the main function: is the full path of the Spark program’s entry Main Class
- Main jar package: Spark jar package
- Deployment mode: support three modes of yarn-cluster, yarn-client and local
- Driver core number: You can set the number of Driver cores and the number of memory
- Number of Executors: You can set the number of Executors, the number of Executor memory, and the number of Executor cores
- Command line parameters: Set the input parameters of the Spark program and support the substitution of custom parameter variables.
- Other parameters: support --jars, --files, --archives, --conf format
- Resource: If the resource file is referenced in other parameters, you need to select and specify in the resource
- User-defined parameter: It is a user-defined parameter of the MR part, which will replace the content with \${variable} in the script

Note: JAVA and Scala are only used for identification, there is no difference, if it is Spark developed by Python, there is no main function class, and the others are the same
