
# Flink

- Drag in the toolbar<img src="/img/flink.png" width="35"/>The task node to the drawing board, as shown in the following figure:

<p align="center">
  <img src="/img/flink-en.png" width="80%" />
</p>

- Program type: supports JAVA, Scala and Python three languages
- The class of the main function: is the full path of the Main Class, the entry point of the Flink program
- Main jar package: is the Flink jar package
- Deployment mode: support three modes of cluster and local
- Number of slots: You can set the number of slots
- Number of taskManage: You can set the number of taskManage
- JobManager memory number: You can set the jobManager memory number
- TaskManager memory number: You can set the taskManager memory number
- Command line parameters: Set the input parameters of the Spark program and support the substitution of custom parameter variables.
- Other parameters: support --jars, --files, --archives, --conf format
- Resource: If the resource file is referenced in other parameters, you need to select and specify in the resource
- Custom parameter: It is a local user-defined parameter of Flink, which will replace the content with \${variable} in the script

Note: JAVA and Scala are only used for identification, there is no difference, if it is Flink developed by Python, there is no class of the main function, the others are the same
