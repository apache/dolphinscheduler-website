## Preface
Pull Request is a way of software cooperation, which is a process of bringing code involving different functions into the trunk. During this process, the code can be discussed, reviewed, and modified.

In Pull Request, we try not to discuss the implementation of the code. The general implementation of the code and its logic should be determined in Issue. In the Pull Request, we only focus on the code format and code specification, so as to avoid wasting time caused by different opinions on implementation.

## Specification

### Pull Request title

Title Format: [`Pull Request Type`-`Issue No`][`Module Name`] `Pull Request Description`

The corresponding relationship between `Pull Request Type` and `Issue Type` is as follows:

<table>
    <thead>
        <tr>
            <th style="width: 10%; text-align: center;">Issue Type</th>
            <th style="width: 20%; text-align: center;">Pull Request Type</th>
            <th style="width: 20%; text-align: center;">Example(Suppose Issue No is 3333)</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td style="text-align: center;">Feature</td>
            <td style="text-align: center;">Feature</td>
            <td style="text-align: center;">[Feature-3333][server] Implement xxx</td>
        </tr>
        <tr>
            <td style="text-align: center;">Bug</td>
            <td style="text-align: center;">Fix</td>
            <td style="text-align: center;">[Fix-3333][server] Fix xxx</td>
        </tr>
        <tr>
            <td style="text-align: center;">Improvement</td>
            <td style="text-align: center;">Improvement</td>
            <td style="text-align: center;">[Improvement-3333][alert] Improve the performance of xxx</td>
        </tr>
        <tr>
            <td style="text-align: center;">Test</td>
            <td style="text-align: center;">Test</td>
            <td style="text-align: center;">[Test-3333][api] Add the e2e test of xxx</td>
        </tr>
        <tr>
            <td style="text-align: center;">Sub-Task</td>
            <td style="text-align: center;">(Parent type corresponding to Sub-Task)</td>
            <td style="text-align: center;">[Feature-3333][server] Implement xxx</td>
        </tr>
    </tbody>
</table>

`Issue No` refers to the Issue number corresponding to the current Pull Request to be resolved, `Module Name` is the same as the `Module Name` of Issue.

### Pull Request content

Please refer to the commit message section.

### Pull Request Code Style

[Checkstyle](https://checkstyle.sourceforge.io/) is a development tool to help programmers write Java code that adheres to a coding standard. It automates the process of checking Java code to spare humans of this boring (but important) task. This makes it ideal for projects that want to enforce a coding standard.

How to configure checkstyle and code style in dolphin scheduler:

1.checkstyle and code-style configuration files

checkstyle: https://github.com/apache/incubator-dolphinscheduler/blob/dev/style/checkstyle.xml

code-style: https://github.com/apache/incubator-dolphinscheduler/blob/dev/style/intellij-java-code-style.xml

2.checkstyle configuration

 <p align="center">
   <img src="/img/checkstyle-idea.png" alt="checkstyle idea configuration" />
 </p>
 
3.code-style configuration

 <p align="center">
   <img src="/img/code-style-idea.png" alt="code style idea configuration" />
 </p>
 
4.How to use checkstyle and code style

After configuration, before submitting a Pull Request, the checkstyle tool will automatically help you format code and import order in the changed code file when you use `Ctrl+L`.

### Question

- How to deal with one Pull Request to many Issues scenario.

    First of all, there are fewer scenarios for one Pull Request to many Issues. 
    The root cause is that multiple issues need to do the same thing.
    Usually, there are two solutions to this scenario: the first is to merge multiple issues with into the same issue, and then close the other issues;
    the second is multiple issues have subtle differences.
    In this scenario, the responsibilities of each issue can be clearly divided. The type of each issue is marked as Sub-Task, and then these sub task type issues are associated with one issue.
    And each Pull Request is submitted should be associated with only one issue of a sub task.