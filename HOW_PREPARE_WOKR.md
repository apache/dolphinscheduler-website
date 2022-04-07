# How Prepare Script Work

## Background

Our latest documents are in directory `docs` DolphinScheduler [main repository](https://github.com/apache/dolphinscheduler.git),
and the history documents before version 3.0.0-alpha is in branch [history-docs](https://github.com/apache/dolphinscheduler-website/tree/history-docs)
in [website repository](https://github.com/apache/dolphinscheduler-website). In this case, you have to collect them from
above repository into current working path before you compile  them to HTML.

Of course, you could collect all content manually, but we already provider convenience script to do that, all you have to
do is run a single command in this project root directory:

```shell
./scripts/prepare_docs.sh
```

It would do all prepare things for you.

> Note: When you failed to run the command and see some log like "unable to access" in your terminal, you can set and
> environment variable `export PROTOCOL_MODE=ssh` and then run command `./scripts/prepare_docs.sh` again. After setting the
> variable will clone source code in SSH protocol instead of HTTPS protocol, and it will stable and fast in some cases like
> local development.
