#### How to submit

* First from the remote repository *https://github.com/apache/incubator-dolphinscheduler.git* fork a copy of the code into your own repository

* There are currently three branches in the remote repository:
    * master           normal delivery branch
        After the stable release, merge the code from the stable branch into the master.
    
    * dev              daily development branch
        Every day dev development branch, newly submitted code can pull request to this branch.


* Clone your repository to your local
    `git clone https://github.com/apache/incubator-dolphinscheduler.git`

* Add remote repository address, named upstream
    `git remote add upstream https://github.com/apache/incubator-dolphinscheduler.git`

* View repository
    `git remote -v`

>At this time, there will be two repositories: origin (your own repository) and upstream (remote repository)

* Get/Update remote repository code
    `git fetch upstream`

* Synchronize remote repository code to local repository

```
git checkout origin/dev
git merge --no-ff upstream/dev
```

If remote branch has a new branch such as `dev-1.0`, you need to synchronize this branch to the local repository
      
```
git checkout -b dev-1.0 upstream/dev-1.0
git push --set-upstream origin dev-1.0
```

* After modifying the code locally, submit it to your own repository:
  
`git commit -m 'commit content'`
    
`git push`

* Submit changes to the remote repository

* On the github page, click New pull request.
  <p align = "center">
  <img src = "http://geek.analysys.cn/static/upload/221/2019-04-02/90f3abbf-70ef-4334-b8d6-9014c9cf4c7f.png" width = "60%" />
  </p>

* Select the modified local branch and the branch you want to merge with the past, Create pull request.
<p align = "center">
<img src = "http://geek.analysys.cn/static/upload/221/2019-04-02/fe7eecfe-2720-4736-951b-b3387cf1ae41.png" width = "60%" />
</p>

* Then the community Committers will do CodeReview, and then he will discuss some details (including design, implementation, performance, etc.) with you. When everyone on the team is satisfied with this modification, the commit will be merged into the dev branch

* Finally, congratulations, you have become an official contributor to dolphinscheduler!


