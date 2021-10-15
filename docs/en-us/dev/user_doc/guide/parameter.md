# Parameter

#### 3. <span id=UserDefinedParameters>User-defined parameters</span>

- the approach to set local parameters is, double-click on any node while defining the workflow and click the '+' button next to the 'Custom Parameters':

<p align="center">
     <img src="/img/supplement_local_parameter_en.png" width="80%" />
   </p>

<p align="center">
     <img src="/img/global_parameter_en.png" width="80%" />
   </p>

In the task, local_param_bizdate uses \${global_bizdate} to refer to global parameters. For shell scripts, you can use \${local_param_bizdate} to refer to the value of global variable global_bizdate, or directly set the value of local_param_bizdate through JDBC.

Similarly, local_param refers to the global parameters defined in the previous section through ${local_param}.  

biz_date, biz_curdate, and system.datetime are user-defined parameters assigned by ${global parameter}.  

