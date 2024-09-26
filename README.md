# Apache DolphinScheduler Official Website

This project keeps all sources used for building up DolphinScheduler's official website which is served at https://dolphinscheduler.apache.org/.

## Build Website Locally

1. Run `yarn` in the root directory to install the dependencies.
2. Run commands to collect resources
   2.1. Run `export PROTOCOL_MODE=ssh` tells Git clone resource via SSH protocol instead of HTTPS protocol
   2.2. Run `./scripts/prepare_docs.sh` prepare all related resources, for more information you could see [how prepare script work](HOW_PREPARE_WORK.md)
3. Run `yarn generate` in the root directory to format and perpare the data.
4. Run `yarn dev` in the root directory to start a local server, you will see the website in 'http://localhost:8080'.

```
Note: if you clone the code in Windows, not Mac or Linux. Please read the details below.
If you execute the commands like the two steps above, you will get the exception "UnhandledPromiseRejectionWarning: Error: EPERM: operation not permitted, symlink '2.0.3' -> 'latest'".
If you get the exception "Can't resolve 'antd' in xxx",you can run `yarn add antd` and `yarn install`.
Because the two steps run command `./scripts/prepare_docs.sh` should Linux environment,so if you are a windwos system you can use WSL do it.
When meeting this problem. You can run two steps in the cmd.exe as an ADMINISTRATOR MEMBER.
```

3. Run `yarn build` to build source code into dist directory.
4. Verify your change locally: `python -m SimpleHTTPServer 8000`, when your python version is 3 use :`python3 -m http.server 8000` instead.

If you have higher version of node installed, you may consider `nvm` to allow different versions of `node` coexisting on your machine.

1. Follow the [instructions](http://nvm.sh) to install nvm
2. Run `nvm install v18.12.1` to install node v18
3. Run `nvm use v18.12.1` to switch the working environment to node v18

Then you are all set to run and build the website. Follow the build instruction above for the details.

## How to send a PR

1. Do not use `git add .` to commit all the changes.
2. Just push your changed files, such as:
   - `*.md`
   - blog.js or docs.js or site.js
3. Send a PR to **master** branch.

## SEO

Make sure each .md starts with the following texts:

```
---
title: title
keywords: keywords1,keywords2, keywords3
description: some description
---
```

## Guide for adding a new document

### Add a new blog

1. Add new .md file under blog/en-us or blog/zh-cn.
2. Update site_config/blog.js, add a new entry to the blog in either en-us or zh-cn.
3. Run docsite start locally to verify the blog can be displayed correctly.
4. Send the pull request contains the .md and blog.js only.

Best Regards.  
 Thanks for reading :)
