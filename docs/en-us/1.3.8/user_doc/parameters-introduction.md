# Dolphinscheduler parameter introduction

#### 1. System parameters

<table>
    <tr><th>variable</th><th>declaration method</th><th>meaning</th></tr>
    <tr>
        <td>system.biz.date</td>
        <td>${system.biz.date}</td>
        <td>The day before the scheduled time of the daily scheduling instance, the format is yyyyMMdd, when the data is supplemented, the date is +1</td>
    </tr>
    <tr>
        <td>system.biz.curdate</td>
        <td>${system.biz.curdate}</td>
        <td>The timing time of the daily scheduling instance, the format is yyyyMMdd, when the data is supplemented, the date is +1</td>
    </tr>
    <tr>
        <td>system.datetime</td>
        <td>${system.datetime}</td>
        <td>The timing time of the daily scheduling instance, the format is yyyyMMddHHmmss, when the data is supplemented, the date is +1</td>
    </tr>
</table>


#### 2. Time custom parameters

- Support custom variable names in the code, declaration method: \${variable name}. It can refer to "system parameters" or specify "constants".

- We define this benchmark variable as \$[...] format, \$[yyyyMMddHHmmss] can be decomposed and combined arbitrarily, such as: \$[yyyyMMdd], \$[HHmmss], \$[yyyy-MM-dd], etc.

- Or the 2 following methods may be useful:

      1. use add_month(yyyyMMdd, offset) function to add/minus number of months
      the first parameter of this function is yyyyMMdd, representing the time format user will get
      the second is offset, representing the number of months the user wants to add or minus
      * Next N years：$[add_months(yyyyMMdd,12*N)]
      * N years before：$[add_months(yyyyMMdd,-12*N)]
      * Next N months：$[add_months(yyyyMMdd,N)]
      * N months before：$[add_months(yyyyMMdd,-N)]
      *********************************************************************************************************
      2. add numbers directly after the time format
      * Next N weeks：$[yyyyMMdd+7*N]
      * First N weeks：$[yyyyMMdd-7*N]
      * Next N days：$[yyyyMMdd+N]
      * N days before：$[yyyyMMdd-N]
      * Next N hours：$[HHmmss+N/24]
      * First N hours：$[HHmmss-N/24]
      * Next N minutes：$[HHmmss+N/24/60]
      * First N minutes：$[HHmmss-N/24/60]

#### 3. <span id=UserDefinedParameters>User-defined parameters</span>

- User-defined parameters are divided into global parameters and local parameters. Global parameters are global parameters passed when saving workflow definitions and workflow instances. Global parameters can be referenced in the local parameters of any task node in the entire process.
- the approach to set global parameters is, after defining the workflow, click the 'save' button, then click the '+' button below the 'Set global':

<p align="center">
   <img src="/img/supplement_global_parameter_en.png" width="80%" />
 </p>

​		The global_bizdate parameter defined here can be referenced by local parameters of any other task node, and the value of global_bizdate is set to the figure obtained by referencing the system parameter system.biz.date:  

<p align="center">
   <img src="/img/local_parameter_en.png" width="80%" />
 </p>

- the approach to set local parameters is, double-click on any node while defining the workflow and click the '+' button next to the 'Custom Parameters':

<p align="center">
     <img src="/img/supplement_local_parameter_en.png" width="80%" />
   </p>

<p align="center">
     <img src="/img/global_parameter_en.png" width="80%" />
   </p>

​		In the task, local_param_bizdate uses \${global_bizdate} to refer to global parameters. For shell scripts, you can use \${local_param_bizdate} to refer to the value of global variable global_bizdate, or directly set the value of local_param_bizdate through JDBC.

​		Similarly, local_param refers to the global parameters defined in the previous section through ${local_param}.  

​		biz_date, biz_curdate, and system.datetime are user-defined parameters assigned by ${global parameter}.  
