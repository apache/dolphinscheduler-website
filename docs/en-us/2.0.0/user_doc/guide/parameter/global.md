# Global Parameter

## Scope

The parameters configured on the workflow definition dialog, the whole workflow is it's scope.

## Usage

the approach to set global parameters is, after defining the workflow, click the 'save' button, then click the '+' button below the 'Set global':

<p align="center">
   <img src="/img/supplement_global_parameter_en.png" width="80%" />
 </p>

<p align="center">
   <img src="/img/local_parameter_en.png" width="80%" />
 </p>

The global_bizdate parameter defined here can be referenced by local parameters of any other task node, and the value of global_bizdate is set to the figure obtained by referencing the system parameter system.biz.date
