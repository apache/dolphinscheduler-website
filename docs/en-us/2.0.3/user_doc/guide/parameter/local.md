# Local Parameter

## Scope

Parameters configured on the task definition dialog, the scope of this parameter only for this task, but if you configured follow [Parameter Context](context.md), it could passed follow task.

## Usage

The approach to set local parameters is, double-click on any node while defining the workflow and click the '+' button next to the 'Custom Parameters':

<p align="center">
     <img src="/img/supplement_local_parameter_en.png" width="80%" />
</p>

<p align="center">
     <img src="/img/global_parameter_en.png" width="80%" />
</p>

If you want to call the [built-in parameter](built-in.md) in the local parameters, fill in the value corresponding to the built-in parameters in `value`, as in the above figure, `${biz_date}` and `${biz_curdate}`
