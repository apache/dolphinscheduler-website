# Built-in Parameter

## Basic Built-in Parameter

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

## Extended Built-in Parameter

- Support custom variable names in the code, declaration method: \${variable name}. It can refer to [basic built-in parameter](#basic-built-in-parameter) or specify "constants".

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
      1. add numbers directly after the time format
      * Next N weeks：$[yyyyMMdd+7*N]
      * First N weeks：$[yyyyMMdd-7*N]
      * Next N days：$[yyyyMMdd+N]
      * N days before：$[yyyyMMdd-N]
      * Next N hours：$[HHmmss+N/24]
      * First N hours：$[HHmmss-N/24]
      * Next N minutes：$[HHmmss+N/24/60]
      * First N minutes：$[HHmmss-N/24/60]
