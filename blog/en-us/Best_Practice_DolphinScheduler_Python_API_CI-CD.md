---
title: Best Practice | DolphinScheduler Python API CI/CD
keywords: Apache,DolphinScheduler,scheduler,big data,ETL,airflow,hadoop,orchestration,dataops,Kubernetes
description: Apache DolphinScheduler is a distributed and extensible workflow scheduler platform with
---
# Best Practice | DolphinScheduler Python API CI/CD
![](https://miro.medium.com/max/720/1*YtC8CaZqJ5y-dTtoLhviNg.webp)

Written by Zhong Jiajie, Apache DolphinScheduler PMC

# DolphinScheduler and Python API Introduction
Apache DolphinScheduler is a distributed and extensible workflow scheduler platform with powerful DAG visual interfaces. It helps users easier to build and maintain workflow on any scale.
![](blog/img/media/16714202226727/16714203387608.jpg)
In order to meet the needs of all users that have different preferences in the same team, DolphinScheduler provides a variety of ways to create workflows. The most popular way is through the web UI, which creates workflows with simple drag and drop and allows non-engineers to create. If you are an engineer and prefer to define workflows programmatically, you may consider using its Python API or YAML file definition to create it.

PyDolphinScheduler is a Python API for Apache DolphinScheduler, which allows you to define your workflow by Python code, aka workflow-as-codes. You can write python code in any editor you like, just like using other python libraries, to create DolphinScheduler’s users, environment, project, and workflow. For more practice examples, you can refer to [[DolphinScheduler can schedule workflows with Python scripts!](https://medium.com/codex/dolphinscheduler-can-schedule-workflows-with-python-scripts-a882fdd2d862)] for more detail.

# A Simple Python API Example
As an out-of-box tool, Python API has an example named tutorial, which includes the basic concept and minimum codes to create and run our very first workflows, you can see more detailed code at https://github.com/apache/dolphinscheduler-sdk-python/blob/main/src/pydolphinscheduler/examples/tutorial.py. The core concept of DolphinScheduler and its Python API is DAG, also calls workflow in Python API. More figuratively, it is the whole picture shown in the following figure. Each DAG contains multiple nodes and connections between nodes, like the node named A, B, C and etc, and the link between. In Python API, the task represents the node of DAG and the dependence for the connections between nodes.
![](blog/img/media/16714202226727/16714204071793.jpg)
# How to Trigger Python API Workflow
## Single One
So we already know the basic concept of Python API and we already have an example of it, then how can we trigger it and make it run and get our job done? To make it more pythonic, you can run it just like other Python scripts, via the terminal with a simple command.

```
python tutorial.py
```
The PyDolphinScheduler will help you set all the things and create a new workflow, after that you can see the new one in DolphinScheduler web UI.

## Multiple Workflows
What if I have multiple files with multiple workflows, how can I trigger them? Yeah, you may already think about it, you can trigger them one by one, just like we trigger the single one. we can be done with

```
python workflow1.py
python workflow2.py
python workflow3.py
...
python workflowN.py
```
We can add all the above commands into a single bash script, after that, all we need is to execute the bash script

```
bash <bash-script-contain-all>
```
It is useful, but when some workflows add or delete, we have to change the bash script too, which means we must consider changing our code synchronously. Otherwise, the bash script will fail, or some of our new workflows will not be triggered.

The way to fix it is simple, we can dynamic detection the Python script in specific directories, and then pass the existing script to the Python interpreter, and we can change our script like

```
for file in $(find . -name "*.py"); do
    python "$file"
done
```
And that is, that is the final script we trigger all our DolphinScheduler Python API workflows on any scale. But it is a little different in reality, I mean that nearly no one deploys production workflows by manually triggering. So the next step we will talk about how to trigger our workflow in CI

# Trigger in GitHub Action
In this section, we will trigger our workflows via CI, we use GitHub Action as an example and believe other CI tool is almost the same.

# What is GitHub Action
GitHub Actions makes it easy to automate all your software workflows, now with world-class CI/CD. Build, test, and deploy your code right from GitHub. Make code reviews, branch management, and issue triaging work the way you want. With the popularity of GitHub and the open-source project movement, GitHub Action is very popular currently. You can see more detail in the GitHub Action document. And here is a hello world of GitHub Action:
```
name: GitHub Actions Demo
on:
  push:
    branches:
      - main
jobs:
  hello-world:
    runs-on: ubuntu-latest
    steps:
      - name: Run my very first GitHub Actions
        run: echo "🎉 Hello World."
```
You can save it as a YAML file and put it in your project with the path

`.github/workflows/hello.yaml` to tell GitHub what you ask her to do. After that, each time you have a commit and push it to the branch named main, our config file named `hello.yaml` will be trigged, and it will do nothing but one, execute the bash command and echo “🎉 Hello World.” to the GitHub Actions console.

# Combine GitHub Actions to Trigger Multiple Workflows
In the above example, you may have already realized that GitHub Actions can run bash commands. And our workflows batch trigger script is also a bash script. To get triggered through GitHub Actions, we may change the command in our GitHub Actions example.
```
name: Execute Workflows
on:    
  push:
    branches:
      - main
jobs:
  execute:
    runs-on: ubuntu-latest
    steps:
      - name: Check out repository code
        uses: actions/checkout@v3
      - name: Execute
        run: |
          for file in $(find . -name "*.py"); do
            python "$file"
          done
```

It can only trigger and deploy workflows to GitHub Actions running hosts. Our DolphinScheduler cluster runs on the self-host server or could service like AWS instead of GitHub Actions, so we have to tell the bash script to submit our code to the DolphinScheduler cluster instead of the GitHub Actions servers. Fortunately, DolphinScheduler Python API provides a user-friendly configuration change in three ways. I recommend you change it via bash to change environment variables during the GitHub Actions which is simply by          

```
# Modify Java Gateway Address
export PYDS_JAVA_GATEWAY_ADDRESS="<YOUR-STATIC-IP-RUN-DOLPHINSCHEDULER-API-SERVER>"
export PYDS_JAVA_GATEWAY_PORT="<PORT-RUN-DOLPHINSCHEDULER-API-SERVER>"
```

GitHub Actions support `env` syntax in the YAML file, which you can see more detail in github-actions: environment-variables, and we can now change our GitHub Actions config to
```
name: Execute Workflows
on:
  push:
    branches:
      - main
jobs:
  execute:
    runs-on: ubuntu-latest
    steps:
      - name: Check out repository code
        uses: actions/checkout@v3
      - name: Execute
        env:
          PYDS_JAVA_GATEWAY_ADDRESS: <YOUR-STATIC-IP-RUN-DOLPHINSCHEDULER-API-SERVER>
          PYDS_JAVA_GATEWAY_PORT: <PORT-RUN-DOLPHINSCHEDULER-API-SERVER> 
        run: |
          for file in $(find . -name "*.py"); do
            python "$file"
          done
```
Therefore, each time our main branch has new commits, whether it is generated by merging PR or pushed from locally, it will trigger and deploy all of our workflows defined in DolphinScheduler Python API, to where your DolphinScheduler cluster deployed.

In the not released version, we add a new mechanism token for authentication to DolphinScheduler Python API, which means in the next version we have to add a token when we try to connect from Python API to DolphinScheduler, see https://github.com/apache/dolphinscheduler-sdk-python/pull/13 for more detail. Also, we highly recommend our users turn on the token authentication to make our connection safe. Just like other configurations, the token can also change via environment variables by bash。

But how to trigger from GitHub Actions when we enabled and turn on the token? In this case, we have to use GitHub Encrypted secrets for help. You can follow the step motion in the link to create your very first safety secret to your repository and remember the name of your secrets. And then use it in the GitHub Actions config
```
name: Execute Workflows
on:
  push:
    branches:
      - main
jobs:
  execute:
    runs-on: ubuntu-latest
    steps:
      - name: Check out repository code
        uses: actions/checkout@v3
      - name: Execute
        env:
          PYDS_JAVA_GATEWAY_ADDRESS: <YOUR-STATIC-IP-RUN-DOLPHINSCHEDULER-API-SERVER>
          PYDS_JAVA_GATEWAY_PORT: <PORT-RUN-DOLPHINSCHEDULER-API-SERVER>
          PYDS_JAVA_GATEWAY_AUTH_TOKEN: ${{ secrets.YOUR-SECRET-NAME }} 
        run: |
          for file in $(find . -name "*.py"); do
            python "$file"
          done
```
See？ That is not complex, it is like using ordinary environment variables in GitHub Actions. And that is all we need to do about deploying workflows from GitHub Actions.

# About CI

DolphinScheduler Python API script is a Python script, so it’s CI for Python language which may include black, Pylint, flake8, sort, autoflake and etc. If you choose to use Python API to create and maintain workflow instead of via web UI. I believe you already have personally preferred tools for code format and style check. I decide to talk about CI after then CD because it optional section. If you have your favorite, you can just use it and skip this section, but if you do not have one, I may share what I prefer to use and also Python API lint.

First of all, I prefer using pre-commit, it will run each time when Git is committed, it is useful due to I can detect some easy but often overlooked detail before I push the code to remote. pre-commit needs a config file and I would like to share what Python API uses for itself code-style and lint code, you can see more detail at https://github.com/apache/dolphinscheduler-sdk-python/blob/main/.pre-commit-config.yaml

```default_stages: [commit, push]
default_language_version:
  # force all python hooks to run python3
  python: python3
repos:
  # Python API Hooks
  - repo: https://github.com/pycqa/isort
    rev: 5.10.1
    hooks:
      - id: isort
        name: isort (python)
  - repo: https://github.com/psf/black
    rev: 22.3.0
    hooks:
      - id: black
  - repo: https://github.com/pycqa/flake8
    rev: 4.0.1
    hooks:
      - id: flake8
        additional_dependencies: [
          'flake8-docstrings>=1.6',
          'flake8-black>=0.2',
        ]
        # pre-commit run in the root, so we have to point out the full path of configuration
        args: [
          --config,
          .flake8
        ]
  - repo: https://github.com/pycqa/autoflake
    rev: v1.4
    hooks:
      - id: autoflake
        args: [
          --remove-all-unused-imports,
          --ignore-init-module-imports,
          --in-place
        ]
```          
It does not run complex checks, all of them are easy to know, and to keep pre-commit can be done as soon as possible. The detail is:

* isort: Sort Python imports automatically
* black: Formatter Python code automatically
* autoflake: Removes unused imports and unused variables as reported by pyflakes automatically
* flake8: Detect other code and documentation

And pre-commit is for the local check, you can also run it in your GitHub Actions by adding a new job before the existing job named execute

```name: Execute Workflows
on:
  push:
    branches:
      - main
  pull_request:
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - name: Check out repository code
        uses: actions/checkout@v3
      - name: Install Dependencies
        run: |
          python -m pip install --upgrade pre-commit
      - name: lint
        run: |
          pre-commit install
		  pre-commit run --all-files
  execute:
    runs-on: ubuntu-latest
    if: github.event_name == 'push'
    needs: lint
    steps:
      - name: Check out repository code
        uses: actions/checkout@v3
      - name: Execute
        env:
          PYDS_JAVA_GATEWAY_ADDRESS: <YOUR-STATIC-IP-RUN-DOLPHINSCHEDULER-API-SERVER>
          PYDS_JAVA_GATEWAY_PORT: <PORT-RUN-DOLPHINSCHEDULER-API-SERVER>
          PYDS_JAVA_GATEWAY_AUTH_TOKEN: ${{ secrets.YOUR-SECRET-NAME }} 
        run: |
          for file in $(find . -name "*.py"); do
            python "$file"
          done
```

Some of you may notice that besides adding a new job, we also add `pull_request` node under `on` and `if` node under `execute` job. Because code lint check should test both push and pull requests event, but we only want to execute workflow when there is a new commit to branch main. If we make execute workflow for the pull requests event, each commit to pull requests will be executed and deployed to our production environment, even though the pull requests are not accessed or not prepared to merge. So we must set a condition to execute the workflow.

Recap
* We show what DolphinScheduler and its Python API, and GitHub Actions are, How to create our very first workflow via DolphinScheduler Python API, and the first workflow in GitHub Actions.
* Then we show how to create DolphinScheduler Python API’s CI/CD base on GitHub Actions step by step.
* Finally, we create a GitHub Actions to detect code style, and auto lint our DolphinScheduler Python API’s workflow code.