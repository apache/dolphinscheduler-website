## Contribute documentation.

Good documentation is critical for any type of software. Any contribution that can improve the Dolphin Scheduler documentation is welcome.


###  Get the document item.

Documentation for the Dolphin Scheduler project is maintained in a separate [git Warehouse](https://github.com/apache/incubator-dolphinscheduler-website).

First you need to fork the document project into your own github repository, and then clone the document to your local computer.

```
git clone https://github.com/<your-github-user-name>/incubator-dolphinscheduler-website
```

### The document environment.

The Dolphin Scheduler website is supported by [docsite](https://github.com/txd-team/docsite)

If your docsite version is below "1.3.3," upgrade to "1.3.3".

Make sure that your node version is 8.x, docsite does not yet support versions higher than 8.x.

### Document build guide.

1. Run the "npm install docsite-g" installation development tool.

2. Run "npm i" in the root folder to install the dependency.

3. Running "docsite start" under the root folder starts the local server, which will allow you to access http://127.0.0.1:8080.

4. Run "docsite build" to generate the source code for the document site.

5. Verify your changes locally: `python -m SimpleHTTPServer 8000`, when python is version 3, use: `python3 - m http.server 8000`.

If the latest version of node is installed locally, consider using "nvm" to allow different versions of node to run on your computer.

1. Refer to the [Instructions](http://nvm.sh) to install nvm.

2. Run “nvm install v8.16.0” to install node v8.

3. Run “nvm use v8.16.0” to switch the current working environment to node v8.

4. Run `npm install docsite-g`

Now you can run and build a website in your local environment.

### The document specification.

1. Between Chinese characters and English numbers ** Spaces are Required ** Between Chinese punctuation mark and English numbers ** Spaces are not required ** to enhance the aesthetics and readability of the Chinese-English mix.

2. It is recommended that you use "you" in general. Of course, you can use the term "you" when necessary, such as when there is a warning prompt.

### How to submit a document Pull Request.

1. Do not use "git add" to commit all changes.

2. Simply push the changed files, for example:

 * `*.md`
 * `blog.js or docs.js or site.js`

3. Submit the Pull Request to the **master** branch.

### Refer to the documentation.

[Apache Flink Translation Specifications](https://cwiki.apache.org/confluence/display/FLINK/Flink+Translation+Specifications)