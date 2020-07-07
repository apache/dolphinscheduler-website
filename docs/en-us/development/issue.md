## Preface
Issues function is used to track various Features, Bugs, Functions, etc. The project maintainer can organize the tasks to be completed through issues.

Issue is an important step in drawing out a feature or bug, and the discussion in Issue is not only about how to implement the feature and how to fix the bug but also the way the feature should/could be implemented.

And only when the Issue is approved, the corresponding Pull Request should be implemented.

## Specification

### Issue Title

Title Format: [`Issue Type`][`Module Name`] `Issue Description`

The `Issue Type` is as follows:

<table>
    <thead>
        <tr>
            <th style="width: 10%; text-align: center;">Issue Type</th>
            <th style="width: 20%; text-align: center;">Description</th>
            <th style="width: 20%; text-align: center;">Example</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td style="text-align: center;">Feature</td>
            <td style="text-align: center;">Include expected new features and functions</td>
            <td style="text-align: center;">[Feature][api] Add xxx api in xxx controller</td>
        </tr>
        <tr>
            <td style="text-align: center;">Bug</td>
            <td style="text-align: center;">Bugs in the program</td>
            <td style="text-align: center;">[Bug][api] Throw exception when xxx</td>
        </tr>
        <tr>
            <td style="text-align: center;">Improvement</td>
            <td style="text-align: center;">Some improvements of the current program, not limited to code format, program performance, etc</td>
            <td style="text-align: center;">[Improvement][server] Improve xxx between Master and Worker</td>
        </tr>
        <tr>
            <td style="text-align: center;">Test</td>
            <td style="text-align: center;">Specifically for the test case</td>
            <td style="text-align: center;">[Test][server] Add xxx e2e test</td>
        </tr>
        <tr>
            <td style="text-align: center;">Sub-Task</td>
            <td style="text-align: center;">Those generally are subtasks of feature class. For large features, they can be divided into many small subtasks to complete one by one</td>
            <td style="text-align: center;">[Sub-Task][server] Implement xxx in xxx</td>
        </tr>
    </tbody>
</table>

The `Module Name` is as follows:

<table>
    <thead>
        <tr>
            <th style="width: 10%; text-align: center;">Module Name</th>
            <th style="width: 20%; text-align: center;">Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td style="text-align: center;">alert</td>
            <td style="text-align: center;">Alert module</td>
        </tr>
        <tr>
            <td style="text-align: center;">api</td>
            <td style="text-align: center;">Application program interface layer module</td>
        </tr>
        <tr>
            <td style="text-align: center;">service</td>
            <td style="text-align: center;">Application service layer module</td>
        </tr>
        <tr>
            <td style="text-align: center;">dao</td>
            <td style="text-align: center;">Application data access layer module</td>
        </tr>
        <tr>
            <td style="text-align: center;">plugin</td>
            <td style="text-align: center;">Plugin module</td>
        </tr>
        <tr>
            <td style="text-align: center;">remote</td>
            <td style="text-align: center;">Communication module</td>
        </tr>
        <tr>
            <td style="text-align: center;">server</td>
            <td style="text-align: center;">Server module</td>
        </tr>
        <tr>
            <td style="text-align: center;">ui</td>
            <td style="text-align: center;">Front end module</td>
        </tr>
        <tr>
            <td style="text-align: center;">docs-zh</td>
            <td style="text-align: center;">Chinese document module</td>
        </tr>
        <tr>
            <td style="text-align: center;">docs</td>
            <td style="text-align: center;">English document module</td>
        </tr>
        <tr>
            <td style="text-align: center;">...</td>
            <td style="text-align: center;">-</td>
        </tr>
    </tbody>
</table>