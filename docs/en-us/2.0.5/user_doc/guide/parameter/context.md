# Parameter Context

DolphinScheduler provides the ability to refer to each other between parameters, including: local parameters refer to global parameters, and upstream and downstream parameter transfer. Because of the existence of references, it involves the priority of parameters when the parameter names are the same. see also [Parameter Priority](priority.md)

## Local task use global parameter

The premise of local tasks referencing global parameters is that you have already defined [Global Parameter](global.md). The usage is similar to the usage in [local parameters](local.md), but the value of the parameter needs to be configured as the key in the global parameter

![parameter-call-global-in-local](/img/global_parameter.png)

As shown in the figure above, `${biz_date}` and `${biz_curdate}` are examples of local parameters referencing global parameters. Observe the last line of the above figure, local_param_bizdate uses \${global_bizdate} to refer to the global parameter. In the shell script, you can use \${local_param_bizdate} to refer to the value of the global variable global_bizdate, or set the value of local_param_bizdate directly through JDBC. In the same way, local_param refers to the global parameters defined in the previous section through ${local_param}. ​Biz_date, biz_curdate, system.datetime are all user-defined parameters, which are assigned via ${global parameters}.

## Pass parameter from upstream task to downstream

DolphinScheduler Parameter transfer between tasks is allowed, and the current transfer direction only supports one-way transfer from upstream to downstream. The task types currently supporting this feature are：

* [Shell](../task/shell.md)
* [SQL](../task/sql.md)
* [Procedure](../task/stored-procedure.md)

When defining an upstream node, if there is a need to transmit the result of that node to a downstream node that has a dependency. You need to set a parameter whose direction is OUT in [Custom Parameters] of [Current Node Settings]. At present, we mainly focus on the function of SQL and SHELL nodes that can input parameters.

prop is user-specified; the direction is selected as OUT, and will be defined as parameter output only when the direction is OUT. The data type can be chosen from different data structures as needed; the value part is not required.

If the result of the SQL node  has only one row, one or more fields, the name of the prop needs to be the same as the field name. The data type can be chosen to be something other than LIST. The parameter will select the value corresponding to the column with the same name as this parameter in the column name in the SQL query result.

If the result of the SQL node is multiple rows, one or more fields, the name of the prop needs to be the same as the name of the field. The data type is selected as LIST, and the SQL query result will be converted to LIST, and the result will be converted to JSON as the value of the corresponding parameter.

Let's take another example of the process that contains the SQL node in the above picture:

The [createParam1] node in the above figure is defined as follows:

![png05](/img/globalParam/image-20210723104957031.png)

 [createParam2] node is defined as follows:

![png06](/img/globalParam/image-20210723105026924.png)

You can find the value of the variable in the [Workflow Instance] page to find the corresponding node instance.

Node instance [createparam1] is as follows:

![png07](/img/globalParam/image-20210723105131381.png)

Here, the value of "id" is equal to 12.

Let's see the case of the node instance [createparam2].

![png08](/img/globalParam/image-20210723105255850.png)

There is only the value of "id". Although the user-defined sql looks up the fields "id" and "database_name", only one parameter is set because only one parameter "id" is defined for out. For display reasons, the length of the list is already checked for you here as 10.

### SHELL

prop is user-specified. The direction is selected as OUT. The output is defined as a parameter only when the direction is OUT. Data type can choose different data structures as needed; the value part is not required to be filled. The user needs to pass the parameter, and when defining the shell script, the output format of ${setValue(key=value)} statement is required, key is the prop of the corresponding parameter, and value is the value of the parameter.

For example, ` echo '${setValue (trans = Hello trans)}' `, set "trans" to "Hello trans", and the variable trans can be used in downstream tasks:

<img src="/img/globalParam/trans-shell.png" alt="trans-shell" style="zoom:50%;" />

When the shell node is defined, when the log detects the format of ${setValue (key = value1)}, value1 will be assigned to the key, and the downstream node can directly use the value of the variable key. Similarly, you can find the corresponding node instance on the workflow instance page to view the value of the variable.

<img src="/img/globalParam/use-parameter-shell.png" alt="use-parameter-shell" style="zoom:50%;" />
