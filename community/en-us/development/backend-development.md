# Backend development documentation

## Environmental requirements

 * MySQL (5.5+) :  Must be installed
 * JDK (1.8+) :  Must be installed
 * ZooKeeper (3.4.6+) ：Must be installed
 * Maven (3.3+) ：Must be installed

Because the dolphinscheduler-rpc module in DolphinScheduler uses Grpc, you need to use Maven to compile the generated classes.
For those who are not familiar with maven, please refer to: [maven in five minutes](http://maven.apache.org/guides/getting-started/maven-in-five-minutes.html)(3.3+)

http://maven.apache.org/install.html

## Project compilation
After importing the DolphinScheduler source code into the development tools such as Idea, first convert to the Maven project (right click and select "Add Framework Support")

* Execute the compile command:

when deploy version >= 1.2.0 , plese use:
```
 mvn -U clean package -Prelease -Dmaven.test.skip=true
```
before 1.2.0, please use:
```
 mvn -U clean package assembly:assembly -Dmaven.test.skip=true
```

* View directory

After normal compilation, it will generate ./target/dolphinscheduler-{version}/ in the current directory.

```
    bin
    conf
    lib
    script
    sql
    install.sh
```

- Description

```
bin : basic service startup script
conf : project configuration file
lib : the project depends on the jar package, including the various module jars and third-party jars
script : cluster start, stop, and service monitoring start and stop scripts
sql : project depends on sql file
install.sh : one-click deployment script
```

   
