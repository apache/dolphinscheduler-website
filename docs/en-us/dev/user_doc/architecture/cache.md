# Cache

## Purpose

Due to the master-server scheduling process, there will be a large number of database read operations, such as `tenant`, `user`, `processDefinition`, etc. On the one hand, it will put a lot of pressure on the DB, and on the other hand, it will slow down the entire core scheduling process.

Considering that this part of the business data is a scenario where more reads and less writes are performed, a cache module is introduced to reduce the DB read pressure and speed up the core scheduling process;

## Cache Settings

```yaml
spring:
  cache:
    # default disable cache, you can enable by `type: caffeine`
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

The cache-module use [spring-cache](https://spring.io/guides/gs/caching/), so you can set cache config in the spring application.yaml directly. Default disable cache, and you can enable it by `type: caffeine`.

With the config of [caffeine](https://github.com/ben-manes/caffeine), you can set the cache size, expire time, etc.

## Cache Read

The cache adopts the annotation `@Cacheable` of spring-cache and is configured in the mapper layer. For example: `TenantMapper`.

## Cache Evict

The business data update comes from the api-server, and the cache end is in the master-server. So it is necessary to monitor the data update of the api-server (aspect intercept `@CacheEvict`), and the master-server will be notified when the cache eviction is required.

It should be noted that the final strategy for cache update comes from the user's expiration strategy configuration in caffeine, so please configure it in conjunction with the business;

The sequence diagram is shown in the following figure:

<img src="/img/cache-evict.png" alt="cache-evict" style="zoom: 67%;" />