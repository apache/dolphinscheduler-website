# Parameter Priority

DolphinScheduler definition of parameter values ​​involved in may come from three types:

* [Global Parameter](global.md): Parameters defined when the workflow saves page definitions
* [Parameter Context](context.md): Parameters passed by upstream nodes
* [Local Parameter](local.md)：The node's own parameters, which is the parameters defined by the user in [Custom Parameters]. The user can define the value of this part of the parameters at the time of workflow definition.

Because the value of a parameter has multiple sources, when the parameter name is the same, there needs to be a parameter priority problem. The priority of DolphinScheduler parameters from high to low is: `Global Parameter < Parameter Context < Local Parameter`

In the case of parameters passed by the upstream task, there may be multiple tasks upstream to pass parameters to the downstream. When the parameter names passed upstream are the same:

* Downstream nodes will preferentially use parameters with non-empty values
* If there are multiple parameters with non-empty values, sort according to the completion time of the upstream task, and select the parameter corresponding to the upstream task with the earliest completion time

## Example

For example, the relationships are shown in the figures below:

1: The first case is explained by the shell nodes.

![png01](/img/globalParam/image-20210723102938239.png)

The [useParam] node can use the parameters which is set in the [createParam] node. The [useParam] node does not have a dependency on the [noUseParam] node, so it does not get the parameters of the [noUseParam] node. The above picture is just an example of a shell node, other types of nodes have the same usage rules.

![png02](/img/globalParam/image-20210723103316896.png)

Among all, the [createParam] node can use parameters directly. In addition, the node sets two parameters named "key" and "key1". Here the user defines a parameter named "key1" with the same name as the one passed by the upstream node and copies the value "12". However, due to the priority we set, the value "12" here would be used and the parameter value set by the upstream node would be finally abandoned.

2: Let's explain another situation in SQL nodes.

![png03](/img/globalParam/image-20210723103937052.png)

The definition of the [use_create] node is as follows:

![png04](/img/globalParam/image-20210723104411489.png)

"status" is the own parameters of the node set by the current node. However, the user also sets the "status" parameter when saving the process definition (Global Parameter) , and its value is -1. Then the value of status will be 2 with higher priority when the SQL is executed(use the Local Parameter). The value of the Global Parameter is discarded.

The "ID" here is the parameter set by the upstream node. The user sets the parameters of the same parameter name "ID" for the [createparam1] node and [createparam2] node. And the [use_create] node uses the value of [createParam1] which is finished first.
``