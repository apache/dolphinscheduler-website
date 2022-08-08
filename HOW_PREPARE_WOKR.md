# How Prepare Script Work

## Background

Our latest documents are in directory `docs` DolphinScheduler [main repository](https://github.com/apache/dolphinscheduler.git),
and the history documents before version 3.0.0-alpha is in branch [history-docs](https://github.com/apache/dolphinscheduler-website/tree/history-docs)
in [website repository](https://github.com/apache/dolphinscheduler-website). In this case, you have to collect them from
above repository into current working path before you compile  them to HTML.

## Execute Command and Prepare Resource

Of course, you could collect all content manually, but we already provider convenience script to do that, all you have to
do is run a single command in this project root directory:

```shell
./scripts/prepare_docs.sh
```

> Note: The default protocol to fetch repository from GitHub is via HTTPS. When you failed to run the command above and
> see some log like "unable to access" in your terminal, or if you feel clone via HTTPS is a little slow. You can switch
> clone protocol to SSH by change the environment variable by execute command `export PROTOCOL_MODE=ssh` in your terminal.
> The next time you execute command `./scripts/prepare_docs.sh` will user protocol SSH instead of HTTPS, which is more stable
> and fast in some cases, such as local development

After the command finished, all prepare things you need to start DolphinScheduler website is being done.

## How To Add or Change New Release Document From apache/dolphinscheduler

After version 3.0.0-alpha, our release document is in repository [apache/dolphinscheduler](https://github.com/apache/dolphinscheduler)
directory `docs`. Documentation and code will be released together, so when the new version is released, we need to get
the corresponding documentation from the released tag.

All you have to do it is add/change variable `DEV_RELEASE_DOCS_VERSIONS` in [conf.sh](scripts/conf.sh).
For example, if you want to add new release docs named `10.0.0` and its docs in apache/dolphinscheduler branch `10.0.0-release`,
you could add a new key-value to `DEV_RELEASE_DOCS_VERSIONS`

```shell
declare -A DEV_RELEASE_DOCS_VERSIONS=(
  ...
  ["10.0.0"]="10.0.0-release"
  ...
)
```

A few days later, you find out version `10.0.0`'s document has a bug. You fix it and push it to apache/dolphinscheduler
branch `10.0.0-release` to fix the bug, you could keep your configuration in the old content.

```shell
declare -A DEV_RELEASE_DOCS_VERSIONS=(
  ...
  ["10.0.0"]="10.0.0-release"
  ...
)
```

## How to Change Document Build Configuration Like Organization or Branch

All the configurations is in [conf.sh](./scripts/conf.sh), and their can be change by environment variable. For example, you can point
documentation source file to your fork of [apache/dolphinscheudler](https://github.com/apache/dolphinscheduler) when you add some change
and want to start website locally for testing, you can run below command to change `./script/prepare_docs.sh` behavior.

```shell
# your github id already fork apache/dolphinscheduler
export PROJECT_ORG="<YOUR-GITHUB-ID>"
# the branch name you want to fetch and deploy website's document
export PROJECT_BRANCH_NAME="<DEPLOY-BRANCH-OF-FORK>"
```

After you export the environment, you can fetch the document source markdown file from `<YOUR-GITHUB-ID>/dolphinscheduler` branch
`<DEPLOY-BRANCH-OF-FORK>`. it is useful when you try to test your local change before merging to apache/dolphinscheudler. For all
parameter can set from environment you can see in [conf.sh](./scripts/conf.sh)

> NOTE: You have to make sure the branch config named with `DEV_RELEASE_DOCS_VERSIONS` in [conf.sh](./scripts/conf.sh) exist in your
> fork, when you try to deploy or test base on your fork instead of official repo. You can rebase to apache/dolphinscheduler and then
> run `git push <REMOTE> --all` to push all barnacles to your fork.
