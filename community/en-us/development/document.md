## Contribute documentation.

Good documentation is critical for any type of software. Any contribution that can improve the DolphinScheduler documentation is welcome.


###  Get the document project.

Documentation for the DolphinScheduler project is maintained in a separate [git repository](https://github.com/apache/incubator-dolphinscheduler-website).

First you need to fork the document project into your own github repository, and then clone the document to your local computer.

```
git clone https://github.com/<your-github-user-name>/incubator-dolphinscheduler-website
```

### The document environment.

The DolphinScheduler website is supported by [docsite](https://github.com/txd-team/docsite)

If your docsite version is below "1.3.3", upgrade to "1.3.3".

Make sure that your node version is 10.x, docsite does not yet support versions higher than 10.x.

### Document build guide.

1. Run the "npm install docsite-g" installation development tool.

2. Run "npm i" in the root directory to install the dependencies.

3. Running "docsite start" under the root folder starts the local server, which will allow you to access http://127.0.0.1:8080.

4. Run "docsite build" to generate the source code for the document site.

5. Verify your changes locally: `python -m SimpleHTTPServer 8000`, when python is version 3, use: `python3 - m http.server 8000`.

If the latest version of node is installed locally, consider using "nvm" to allow different versions of node to run on your computer.

1. Refer to the [Instructions](http://nvm.sh) to install nvm.

2. Run “nvm install v10.23.1” to install node v10.

3. Run “nvm use v10.23.1” to switch the current working environment to node v10.

4. Run `npm install docsite -g`

Now you can run and build the website in your local environment.

### The document specification.

1. ** Spaces are Required ** between Chinese characters and English or numbers and ** Spaces are not required ** between Chinese punctuation marks and English or numbers, to enhance the aesthetics and readability of the Chinese-English mix.

2. It is recommended that you use "you" in general. Of course, you can use the term when necessary, such as when there is a warning prompt.

### How to submit a document Pull Request.

1. Do not use "git add." to commit all changes.

2. Simply push the changed files, for example:

 * `*.md`
 * `blog.js or docs.js or site.js`

3. Submit the Pull Request to the **master** branch.

### Reference to the documentation.

[Apache Flink Translation Specifications](https://cwiki.apache.org/confluence/display/FLINK/Flink+Translation+Specifications)
