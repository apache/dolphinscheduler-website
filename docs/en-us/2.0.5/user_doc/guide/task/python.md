# Python

- Using python nodes, you can directly execute python scripts. For python nodes, workers will use `python **` to submit tasks.

> Drag in the toolbar![PNG](https://analysys.github.io/easyscheduler_docs_cn/images/toolbar_PYTHON.png)The task node to the drawing board, as shown in the following figure:

<p align="center">
   <img src="/img/python-en.png" width="80%" />
 </p>

- Script: Python program developed by the user
- Environment Name: Specific which Python interpreter would be use and run `Script`. If you want to use Python virtualenv, you should create multiply environments for each virtualenv.
- Resources: refers to the list of resource files that need to be called in the script
- User-defined parameter: It is a local user-defined parameter of Python, which will replace the content with \${variable} in the script
- Note: If you import the python file under the resource directory tree, you need to add the `__init__.py` file
