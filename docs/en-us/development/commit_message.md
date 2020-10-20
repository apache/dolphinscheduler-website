## DolphinScheduler-Contributor-CommitMessage Notice

###  Objective.
   A good commit message is one that helps other developers (or future developers) quickly understand the context of the change, and also helps project managers determine whether the submission is appropriate for inclusion in the release. But when we looked at the commit logs for a lot of open source projects, we found an interesting problem, some developers, the code quality was good, but the commit message record was confusing, and when other contributors or learners looked at the code, it was not intuitive to understand through the commit log. 
The purpose of the change before and after the submission, as Peter Hutterer said: Re-establishing the context of a piece of code is wasteful. We can’t avoid it completely, so our efforts should go to reducing it as much as possible. Commit messages can do exactly that and as a result, a commit message shows whether a developer is a good collaborator. Therefore DolphinScheduler Combine with other communities as well as Apache's official documentation establishes the statute.
   
### Commit Message RIP
   
#### 1: Explicitly modify the content.
   
Commit message should clearly indicate what issues the submission resolves (bug fixes, enhancements, etc.) so that users and developers can better track issues and identify optimizations during version iterations.

#### 2: Associate the corresponding Pull Request or Issue.

When we make big changes, commit message are best associated with the relevant Issue or Pull Request on Github, so that our developers can quickly understand the context of code change committed by consulting the associated information, which can be turned off in the Footer section if the current commit has a problem.

#### 3: Uniform format.

The formatted CommitMessage helps us provide more historical information for quick browsing, while also generating Change Log directly from Commit.

Commit messages should consist of three parts: Header, Body and Footer. Where Header is required, Body and Footer can be omitted.

##### Header
The Header section has only one line and includes three fields: type (required), scope (optional), and subject (required).

[DS-ISSUE number][type] subject.

(1) Type is used to describe the category of commit and only the following 7 identities are allowed.

* feat: New features (features).
* fix: Patch bugs.
* docs: Documentation
* style: Format (does not affect changes in code operation)
* refactor: Refactoring (i.e., not new features, nor code changes to modify bugs)
* test: Increase the test.
* chore: Changes in the build process or aids.

If type is feat and fix, the commit will definitely appear in Change log. Other cases (docs, chore, style, refactor, test) are not recommended.

(2) scope

scope is used to illustrate the extent of the impact of the commit, such as server, remote, etc., if there is no more appropriate range, you can use *.

(3) subject

subject is a short description of the purpose of the commit and is no more than 50 characters long.

##### Body

The Body section is a detailed description of this commit, which can be divided into multiple lines, and line breaks will break in 72 characters to avoid line-break effects on aesthetics.

Some of the following points need to be noted in The Body Section:

* Using the dynamic structure, note that when using the present, such as using change instead of changed or changes.

* The initials should not be capitalized.

* A '.' (period) is not required at the end of the statement.


##### Footer

The Footer is only available in two cases.

(1) Incompatible changes.

If the current code is not compatible with the previous version, the Footer section begins with BREAKING CHANGE, followed by a description of the change, as well as the reason for the change and the migration method.

(2) Close Issue.

If the current commit is for an issue, you can turn off the issue in the Footer section, or you can turn off more than one issue at a time.

##### Take, for example.
[DS-001][docs-en] add commit message

* commit message RIP
* build some conventions 
* help the commit messages become clean and tidy 
* help developers and release managers better track issues 
and clarify the optimization in the version iteration

This closes #001

### Refer to the documentation.
[Commit Message Format](https://cwiki.apache.org/confluence/display/GEODE/Commit+Message+Format)

[On commit messages-Peter Hutterer](http://who-t.blogspot.com/2009/12/on-commit-messages.html)

[RocketMQ Community Operation Conventions](https://mp.weixin.qq.com/s/LKM4IXAY-7dKhTzGu5-oug)