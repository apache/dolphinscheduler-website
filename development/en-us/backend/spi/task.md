## DolphinScheduler Task SPI extension

#### How to develop task plugins?

org.apache.dolphinscheduler.spi.task.TaskChannel

The plug-in can implement the above interface. It mainly includes creating tasks (task initialization, task running, etc.) and task cancellation. If it is a yarn task, you need to implement org.apache.dolphinscheduler.plugin.task.api.AbstractYarnTask.

We provide APIs for external access to all tasks in the dolphinscheduler-task-api module, while the dolphinscheduler-spi module is the spi general code library, which defines all the plug-in modules, such as the alarm module, the registry module, etc., you can read and view in detail .
