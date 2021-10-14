
# Parameter

## System parameters

<table>
    <tr><th>variable</th><th>meaning</th></tr>
    <tr>
        <td>${system.biz.date}</td>
        <td>The day before the scheduled time of the daily scheduling instance, the format is yyyyMMdd, when the data is supplemented, the date is +1</td>
    </tr>
    <tr>
        <td>${system.biz.curdate}</td>
        <td>The timing time of the daily scheduling instance, the format is yyyyMMdd, when the data is supplemented, the date is +1</td>
    </tr>
    <tr>
        <td>${system.datetime}</td>
        <td>The timing time of the daily scheduling instance, the format is yyyyMMddHHmmss, when the data is supplemented, the date is +1</td>
    </tr>
</table>

## Time custom parameters

- Support custom variable names in the code, declaration method: \${variable name}. It can refer to "system parameters" or specify "constants".

- We define this benchmark variable as $[...] format, $[yyyyMMddHHmmss] can be decomposed and combined arbitrarily, such as: $[yyyyMMdd], $[HHmmss], \$[yyyy-MM-dd], etc.

- The following format can also be used:

      * Next N years：$[add_months(yyyyMMdd,12*N)]
      * N years before：$[add_months(yyyyMMdd,-12*N)]
      * Next N months：$[add_months(yyyyMMdd,N)]
      * N months before：$[add_months(yyyyMMdd,-N)]
      * Next N weeks：$[yyyyMMdd+7*N]
      * First N weeks：$[yyyyMMdd-7*N]
      * Next N days：$[yyyyMMdd+N]
      * N days before：$[yyyyMMdd-N]
      * Next N hours：$[HHmmss+N/24]
      * First N hours：$[HHmmss-N/24]
      * Next N minutes：$[HHmmss+N/24/60]
      * First N minutes：$[HHmmss-N/24/60]

## <span id=UserDefinedParameters>User-defined parameters</span>

- User-defined parameters are divided into global parameters and local parameters. Global parameters are global parameters passed when saving workflow definitions and workflow instances. Global parameters can be referenced in the local parameters of any task node in the entire process.
  example：

<p align="center">
   <img src="/img/local_parameter_en.png" width="80%" />
 </p>

- global_bizdate is a global parameter, which refers to a system parameter.

<p align="center">
   <img src="/img/global_parameter_en.png" width="80%" />
 </p>

- In the task, local_param_bizdate uses \${global_bizdate} to refer to global parameters. For scripts, you can use \${local_param_bizdate} to refer to the value of global variable global_bizdate, or directly set the value of local_param_bizdate through JDBC.
