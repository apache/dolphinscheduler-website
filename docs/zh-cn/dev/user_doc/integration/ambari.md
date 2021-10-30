### DolphinScheduler的Ambari插件的使用说明

#### 说明：

1. 本文件是为对Ambari有基本了解的用户准备的。
2. 本文件描述了在已安装的Ambari服务中添加DolphinScheduler服务。
3. 本文件基于Ambari的2.5.2版本。

#### 安装准备

1. 准备好RPM包

   - 通过在项目根目录下执行`mvn -U clean install -Prpmbuild -Dmaven.test.skip=true -X`命令生成（在目录：dolphinscheduler-dist/target/rpm/apache-dolphinscheduler/RPMS/noarch）。

2. 为DolphinScheduler创建一个安装目录，用户对安装目录（/opt/soft）有读写权限。

3. 用rpm包安装

   - 手动安装（推荐）：
      - 将准备好的RPM包复制到集群的每个节点。
      - 用DolphinScheduler安装用户执行：`rpm -ivh apache-dolphinscheduler-xxx.noarch.rpm`
      - 使用默认的POM文件打包的Mysql-connector-java将不被包含。
      - 在项目中打包的RPM包的安装路径为/opt/soft。
        如果你使用MySQL作为数据库，你需要手动添加它。
      
   - 用Ambari自动安装
      - 集群的每个节点都需要配置本地的yum source
      - 把准备好的RPM包复制到每个节点的本地yum源上

4. 复制插件目录

   - 复制目录ambari_plugin/common-services/DOLPHIN到ambari-server/resources/common-services/中
   - 复制目录ambari_plugin/statcks/DOLPHIN到ambari-server/resources/stacks/HDP/2.6/services/--stack版本根据实际情况选择

5. 初始化数据库信息

   ```sql
   -- 创建DolphinScheduler的数据库：dolphinscheduler
   CREATE DATABASE dolphinscheduler DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci;
   
   -- 为 dolphinscheduler 数据库初始化用户和密码，并分配权限
   -- 将下面的 SQL 语句中的 {user} 替换为 dolphinscheduler 数据库的用户
   GRANT ALL PRIVILEGES ON dolphinscheduler.* TO '{user}'@'%' IDENTIFIED BY '{password}';
   GRANT ALL PRIVILEGES ON dolphinscheduler.* TO '{user}'@'localhost' IDENTIFIED BY '{password}';
   flush privileges;
   ```

#### Ambari 安装DolphinScheduler
- **注意：你必须先安装Zookeeper**。

1. 在Ambari网页界面上安装DolphinScheduler

   ![](https://dolphinscheduler.apache.org/img/ambari-plugin/DS2_AMBARI_001.png)

2. 选择DolphinScheduler的主安装节点

   ![](https://dolphinscheduler.apache.org/img/ambari-plugin/DS2_AMBARI_002.png)

3. 配置DolphinScheduler的Worker、Api、Logger、Alert安装节点。

   ![](https://dolphinscheduler.apache.org/img/ambari-plugin/DS2_AMBARI_003.png)

4. 设置DolphinScheduler服务的安装用户（在步骤1中创建）和他们所属的用户组

   ![](https://dolphinscheduler.apache.org/img/ambari-plugin/DS2_AMBARI_004.png)

5. 系统环境优化将导出一些系统环境配置。根据实际情况进行修改

   ![](https://dolphinscheduler.apache.org/img/ambari-plugin/DS2_AMBARI_020.png)
   
6. 配置数据库信息（与步骤1中的初始化数据库相同）。

   ![](https://dolphinscheduler.apache.org/img/ambari-plugin/DS2_AMBARI_005.png)

7. 如果需要，配置其他信息

   ![](https://dolphinscheduler.apache.org/img/ambari-plugin/DS2_AMBARI_006.png)

   ![](https://dolphinscheduler.apache.org/img/ambari-plugin/DS2_AMBARI_007.png)

8. 像往常一样执行接下来的步骤

   ![](https://dolphinscheduler.apache.org/img/ambari-plugin/DS2_AMBARI_008.png)

9. 安装成功后的界面

   ![](https://dolphinscheduler.apache.org/img/ambari-plugin/DS2_AMBARI_009.png)
   
   

------



#### 通过Ambari向节点添加组件 -- 例如，添加一个DolphinScheduler Worker

***注意***: DolphinScheduler Logger是Dolphin的Ambari安装中DS Worker的安装依赖组件（需要先添加安装；防止相应Worker上的Job日志被选中

1. 找到要添加的组件节点 -- 例如，节点ark3

   ![ds2_ambari_011](https://dolphinscheduler.apache.org/img/ambari-plugin/DS2_AMBARI_011.png)

2. 添加组件 -- 下拉列表中的组件都是可以添加的

   ![ds2_ambari_012](https://dolphinscheduler.apache.org/img/ambari-plugin/DS2_AMBARI_012.png)

3. 确认添加的组件

   ![ds2_ambari_013](https://dolphinscheduler.apache.org/img/ambari-plugin/DS2_AMBARI_013.png)

4. 添加DolphinScheduler Worker和DolphinScheduler Logger组件后

   ![ds2_ambari_015](https://dolphinscheduler.apache.org/img/ambari-plugin/DS2_AMBARI_015.png)

5. 启动该组件

   ![ds2_ambari_016](https://dolphinscheduler.apache.org/img/ambari-plugin/DS2_AMBARI_016.png)


#### 用Ambari从节点上删除组件

1. 在相应的节点上停止该组件

   ![ds2_ambari_018](https://dolphinscheduler.apache.org/img/ambari-plugin/DS2_AMBARI_018.png)

2. 移除组件

   ![ds2_ambari_019](https://dolphinscheduler.apache.org/img/ambari-plugin/DS2_AMBARI_019.png)
