# MapReduce

- Using the MR node, you can directly execute the MR program. For the mr node, the worker will use the `hadoop jar` method to submit tasks

> Drag the ![PNG](https://analysys.github.io/easyscheduler_docs_cn/images/toolbar_MR.png) task node in the toolbar to the drawing board, as shown in the following figure:

## JAVA program

 <p align="center">
   <img src="/img/mr_java_en.png" width="80%" />
 </p>

- The class of the main function: is the full path of the Main Class, the entry point of the MR program
- Program type: select JAVA language
- Main jar package: is the MR jar package
- Command line parameters: set the input parameters of the MR program and support the substitution of custom parameter variables
- Other parameters: support -D, -files, -libjars, -archives format
- Resource: If the resource file is referenced in other parameters, you need to select and specify in the resource
- User-defined parameter: It is a user-defined parameter of the MR part, which will replace the content with \${variable} in the script

## Python program

<p align="center">
   <img src="/img/mr_edit_en.png" width="80%" />
 </p>

- Program type: select Python language
- Main jar package: is the Python jar package for running MR
- Other parameters: support -D, -mapper, -reducer, -input -output format, here you can set the input of user-defined parameters, such as:
- -mapper "mapper.py 1" -file mapper.py -reducer reducer.py -file reducer.py –input /journey/words.txt -output /journey/out/mr/\${currentTimeMillis}
- The mapper.py 1 after -mapper is two parameters, the first parameter is mapper.py, and the second parameter is 1
- Resource: If the resource file is referenced in other parameters, you need to select and specify in the resource
- User-defined parameter: It is a user-defined parameter of the MR part, which will replace the content with \${variable} in the script
