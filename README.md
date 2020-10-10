# Apache DolphinScheduler Official Website

This project keeps all sources used for building up DolphinScheduler official website which's served at https://dolphinscheduler.apache.org/.

## Prerequisite

DolphinScheduler website is powered by [docsite](https://github.com/txd-team/docsite).
If your version of docsite is lower than `1.3.3`,please upgrade to `1.3.3`.
Please also make sure your node version is 8.x, versions higher than 8.x is not supported by docsite yet.

## Build instruction 

1. Run `npm install docsite -g` to install the dev tool.
2. Run `npm i` in the root directory to install the dependencies.
3. Run `docsite start` in the root directory to start a local server, you will see the website in 'http://127.0.0.1:8080'.
4. Run `docsite build` to build source code.
5. Verify your change locally: `python -m SimpleHTTPServer 8000`, when your python version is 3 use :`python3 -m http.server 8000` instead.

If you have higher version of node installed, you may consider `nvm` to allow different versions of `node` coexisting on your machine.

1. Follow the [instructions](http://nvm.sh) to install nvm
2. Run `nvm install v8.16.0` to install node v8
3. Run `nvm use v8.16.0` to switch the working environment to node v8
4. Run `npm install docsite -g`

Then you are all set to run and build the website. Follow the build instruction above for the details.


## How to send a PR

1. Do not use `git add .` to commit all the changes.
2. Just push your changed files, such as:
    * `*.md`
	* blog.js or docs.js or site.js
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


## Guide for adding new document

### Add a new blog

1. Add new .md file under blog/en-us or blog/zh-cn.
2. Update site_config/blog.js, add a new entry to the blog in either en-us or zh-cn.
3. Run docsite start locally to verify the blog can be displayed correctly.
4. Send the pull request contains the .md and blog.js only.


### Add a new article for development

1. Add new .md file under docs/en-us/development or docs/zh-cn/development.
2. Update site_config/development.js, add a new entry in either en-us or zh-cn.
3. Run docsite start locally to verify the article can be displayed correctly.
4. Send the pull request contains the *.md and development.js only.


### Add a new article for docs

1. Add new .md file under docs/en-us or docs/zh-cn.
2. Update site_config/docs.js, add a new entry in either en-us or zh-cn.
3. Run docsite start locally to verify the article can be displayed correctly.
4. Send the pull request contains the *.md and development.js only.

Best Regards
