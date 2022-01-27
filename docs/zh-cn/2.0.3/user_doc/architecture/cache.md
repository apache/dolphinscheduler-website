### 缓存

#### 缓存目的

在master-server调度过程中，产生大量数据库读取操作，如tenant，user，processDefinition等，对DB产生读取压力，同时会导致整个核心调度流程缓慢；

这部分核心业务数据是读取占多的场景，引入缓存模块，以减少DB读取压力，加快核心调度流程；

#### 缓存设置

```yaml
spring:
  cache:
    # default enable cache, you can disable by `type: none`
    type: none
    cache-names:
      - tenant
      - user
      - processDefinition
      - processTaskRelation
      - taskDefinition
    caffeine:
      spec: maximumSize=100,expireAfterWrite=300s,recordStats
```

缓存模块采用[spring-cache](https://spring.io/guides/gs/caching/)机制，可直接在spring配置文件中配置开启缓存（默认`none`关闭）。

默认采用[caffeine](https://github.com/ben-manes/caffeine)进行缓存管理，可自由设置缓存相关配置。

#### 缓存读取

缓存采用spring-cache注解，配置在相关mapper层，可参考：`TenantMapper`.

#### 缓存更新

业务数据更新来自于api-server, 缓存端在master-server, 需要api-server数据更新做监听(aspect切面拦截`@CacheEvict`)。
需要进行缓存驱逐时通知master-server，master-server接收cacheEvictCommand后进行缓存驱逐；缓存更新的兜底策略来自于用户在caffeine中的过期策略配置，请结合业务进行配置。

时序图如下所示：

<img src="/img/cache-evict.png" alt="cache-evict" style="zoom: 67%;" />
