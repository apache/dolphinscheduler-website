# DolphinScheduler 单元测试模版

## 1. 单元测试原则

1. **3A 原则**

   3A 原则简单易懂，它为套件中的所有测试提供了统一的结构，这种统一的结构是其最大的优势之一：一旦习惯了这种模式，就可以更轻松地阅读和理解测试，这反过来又降低了整个测试套件的维护成本。

   - Arrange：初始化测试数据。
   - Act：调用被测方法，传入依赖参数并获取返回值。
   - Assert：断言，对返回值做出断言。

   示例：

   ```java
   public class Calculator {
       public long sum(long a, long b) {
           return a + b;
       }
   }
   ```

   ```java
   public class CalculatorTest {
       @Test
       public void sum() {
           // Arrange
           long a = 1L, b = 2L;
           Calculator calculator = new Calculator();
           // Act
           long actual = calculator.sum(a, b);
           // Assert
           long expected = 3L;
           assertEquals(expected, actual);
       }
   }
   ```

2. **AIR 原则**
   - Automatic：测试过程应当是完全自动的、非交互的。
   - Independent：为了保证单元测试稳定可靠且便于维护，单元测试用例之间不允许互相调用，也不能依赖执行的先后次序。
   - Repeatable：单元测试是可以重复执行的，不能受到外界环境的影响。

除此以外，还应遵循以下原则：

1. **隔离性与单一性**

一个测试类应该只对应于一个被测试类，并且对被测试类行为的测试环境应该是隔离的。

一个测试用例应该精确到方法级别，并应该能够单独执行该测试用例，同时关注点也始终在该方法上。

如果方法过于复杂，开发阶段就应该将其再次进行拆分，对于测试用例来讲，最佳做法是一个用例只关注一个分支（判断）。当对其进行修改后，也仅仅影响一个测试用例的成功与否。这会极大方便我们在开发阶段验证问题和解决问题，但与此同时，也对我们覆盖率提出了极大的挑战。

2. **可重复性**

在任何环境、任何时间，多次执行后的结果一致，且可以重复执行。

3. **轻量性**

测试应当是秒级甚至是毫秒级的，不应占用过多时间。

> 由于 Spring Boot 启动花费时间较长，因此当待测试对象不依赖 Spring Bean 或 Spring 容器时，应当避免使用 Spring Test 进行单元测试，可以通过直接创建目标类对象的方式实现。

4. **可测性**

为了保证每个软件组件的正确性，我们希望将代码的质量保障提前，使每个软件组件在开发阶段就能够测试，因此在设计和开发过程中，需要保证每个模块是可以进行测试的。

为了保证可测性，设计和编写业务逻辑代码时需注意以下几点：

- 依赖隔离。在编写业务逻辑代码时，应遵循依赖倒置原则——高层次的模块不应该依赖于低层次的模块，它们都应该依赖于抽象，抽象不应该依赖于具体实现，具体实现应该依赖于抽象。通过依赖倒置，可以减少类与类之间的耦合性，提高系统的稳定性，提高代码的可读性和可维护性，并且能够降低修改程序所造成的风险。
- 避免使用静态变量。静态变量是全局性的、有状态的，在多线程中处理复杂。单元测试应该彼此独立、隔离，不应该依赖于执行顺序，甚至应该允许并发同时执行所有单元测试进而使测试更快速。使用静态变量会破坏单元测试的可重复执行性，并且可能干扰到其他的单元测试方法。
- 避免使用静态方法。一般建议只在一些工具类提供静态方法，这种情况下也不需要 mock，直接使用真实类即可。如果被依赖类不是工具类，可以将静态方法重构为实例方法。这样更加符合面向对象的设计理念。

5. **完备性**

测试覆盖率通常被用来衡量测试的充分性和完整性，核心流程期望达到 90% 的覆盖率，非核心流程期望达到 60% 以上的覆盖率。

覆盖率足够高的情况下可以减少 bug 出现的概率，同时也减少了回归测试的成本。

> DolphinScheduler 使用 Sonar 存储和管理覆盖率等各项指标：https://sonarcloud.io/code?id=apache-dolphinscheduler

6. **拒绝无效断言**

无效断言让测试本身变得毫无意义，它和你的代码正确与否几乎没什么关系，且有可能会给你造成一种成功的假象，这种假象有可能持续到你的代码部署到生产环境。

无效断言类型：

- 不同类型的比较。
- 判断一个具有默认值的对象或者变量不为空。

断言尽可能采用肯定断言而非否定断言，断言尽可能在一个预知结果范围内，或者是准确的数值（否则有可能会导致一些不符合你的实际预期但是通过了断言）除非你的代码只关心他是否为空。

7. **异常**

对异常的验证是单元测试中一个很重要的环节，在编写单元测试时，除了正常的输入输出，还需要特别针对可能导致异常的情况进行测试。

需注意以下几点：

1. 程序在测试过程中抛出异常，并不一定是 bug；程序应当抛出异常的地方却没有抛出异常，一定是 bug。
2. 在编写单元测试代码时，需要全面了解设计文档或业务代码，明确在什么情况下会抛出哪些异常，尽可能使单元测试能够覆盖更多的场景。
3. 在测试失败的代码块中通过 `Assert.fail(String message)` 声明测试失败情况。
4. 使用 `@Test(expected = RuntimeException.class)` 表明方法抛出的 `RuntimeException` 是合法的，若抛出其他异常或不抛出异常都会使测试失败。

## 2. 单元测试编写建议

1. 应当保证单元测试的测试粒度足够小，有助于精确定位问题。单元测试粒度至多是类级别，一般是方法级别。

   > 只有测试粒度足够小，才能在出错时尽快定位到出错位置。除此以外，单元测试不负责检查跨类或者跨系统的交互逻辑（这是集成测试的领域）。

2. 单元测试代码应当放在 `src/test/java` 路径下。

3. 同一个单元测试方法中只能涵盖对同一类测试用例的测试，并且建议使用 `test_MethodName_CaseDescription` 测试方法命名方式。

4. 编写单元测试代码应遵守 BCDE 原则，以保证被测试模块的交付质量。

   - Border：边界值测试，包括循环边界、特殊取值、特殊时间点、数据顺序等。
   - Correct：正确的输入，并得到预期的结果。
   - Design：与设计文档相结合，来编写单元测试。
   - Error：强制错误信息输入（如：非法数据、异常流程、业务允许外等），并得到预期的结果。

5. 对于数据库相关的增删改查等操作，不能假设数据库里的数据是存在的，或者直接向数据库中插入数据，应当采用程序插入或者导入数据的方式准备数据。

   > 例如，在删除某一行数据的单元测试中，若事先手动向数据库中增加一行数据作为待删除目标，但由于该行新增数据并不一定符合业务插入规范，因此有可能导致测试结果异常。

6. 数据库相关的单元测试可以设定自动回滚机制，避免数据库中存在脏数据。或者对单元测试产生的数据有明确的前后缀标识。

7. 为了更方便地进行单元测试，业务代码应避免出现以下情况：

   1. 构造方法中做的事情过多。

   2. 存在过多的全局变量和静态方法。

   3. 存在过多的外部依赖。

   4. 存在过多的条件语句。

      > 多层条件语句可以使用卫语句、策略模式、状态模式等方式重构。

## 3. Mock

### 3.1 为什么需要 mock？

单元测试要求在不涉及依赖关系的情况下测试代码，即可迁移性。

模拟对象（Mock Object）可以取代真实对象的位置，用于测试一些与真实对象进行交互或依赖于真实对象的功能。模拟真实对象的目的就是创建一个轻量级的、可以控制的对象来代替测试中需要的真实对象，模拟真实对象的行为和功能。

> 例如，service 调用 dao，即 service 依赖 dao，这时候可以用 mock 对象来模拟真实的 dao 调用，从而达到不依赖 dao 具体实现逻辑的情况下测试 service 的目的，以减少模块间耦合。

**mock对象使用范畴：**

1. 真实对象具有不可确定的行为，产生不可预测的效果。
2. 真实对象很难被创建的。
3. 真实对象的某些行为很难被触发。
4. 真实对象实际上并不存在的。

> 因此，发送邮件、依赖 DAO 的上层操作（如 Service）、Controller 层 HTTP 请求等场景建议使用 mock 测试。

### 3.2 为什么应当避免使用 mock？

1. 需要额外编写 mock 测试代码。
2. 掩盖实际代码的执行情况，可能无法完全覆盖测试场景。
3. 测试代码的可复用性差。

## 4. Controller 层测试

### 4.1 编写建议

1. 为了使测试更加快速，测试时应尽量避免构建 Spring Context。

2. 通过构造函数配置依赖项。

   > 优点：
   >
   > 1. 允许将字段声明为 final。final 关键字会有助于性能提升，并且由于 final 变量是只读的，因此在多线程环境下无需额外的同步开销。
   > 2. 避免通过 Spring 配置依赖项，使测试运行更快。

3. 建议使用 `MockMvc` 对象模拟 HTTP 请求实现 Controller 层测试。

   >优点：
   >
   >1. `MockMvc` 可以在不启动 Web 服务器和构建 Spring Context 的情况下实现 Controller 测试。
   >2. `MockMvc` 提供了许多有用的、用于执行请求和断言结果的方法。

### 4.2 编写示例

Controller UT 架构如下：

![ut-controller-architecture](/img/unit-test/ut-controller-architecture.png)

对于新增的 controller，其测试代码编写步骤如下：

1. 继承 `RestControllerTest` 或 `NormalControllerTest`
2. 重写 `getTestedController()` 方法，返回新增的待测试 controller 对象
3. 基于 `MockMvc` 编写测试方法，模拟 HTTP 请求

待测试方法：

```java
@RestController
public class UserController extends BaseController {

    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    @RequestMapping("/login")
    @ResponseStatus(HttpStatus.OK)
    public Result login(@RequestParam(value = "userName", required = false) String userName, @RequestParam(value = "userPassword", required = false) String userPassword) {

        Map<String, Object> result = service.login(userName, userPassword);
        return returnDataList(result);
    }

}
```

测试代码：

```java
public class RestUserControllerTest extends AbstractRestControllerTest {

    private static final Logger logger = LoggerFactory.getLogger(RestUserControllerTest.class);

    @Test
    public void testLogin() throws Exception {
        // (2) Act
        MvcResult mvcResult = mockMvc.perform(post("/login"))
                .andExpect(status().isOk())	// (3) Assert
                .andReturn();

        MockHttpServletResponse response = mvcResult.getResponse();
        String content = response.getContentAsString();

        Result result = JSONUtils.parseObject(content, Result.class);
        // (3) Assert
        Assert.assertEquals(Status.SUCCESS.getCode(), result.getCode().intValue());
        logger.info(content);
    }

    @Override
    protected Object getTestedController() {
        // (1) Arrange
        UserService service = new UserService();
        return new UserController(service);
    }

}
```

## 5. DAO 层测试

### 5.1 编写建议

DAO 层测试有三种方案：

1. 使用 mock 对象模拟数据库操作
2. 使用内存数据库进行测试
3. 使用真实数据库环境进行测试

三者对比如下：

- 使用模拟对象有利于提高可测试性，避免环境对单元测试的限制。但是这种方案是建立在数据库操作都正确的假想下，因此并不能完全覆盖所有场景（如对 SQL 语句执行结果的测试）。
- 使用内存数据库进行测试同样避免了环境对单元测试的限制，同时使测试更可靠、更快速。
- 使用真实数据库环境进行测试更具有可靠性，但是也对测试环境有了限制，降低了测试的可迁移性，同时数据库操作可能会使测试时间延长，并产生许多脏数据。 

综上，在涉及数据库的单元测试场景中，推荐使用前两种方案。

### 5.2 编写示例

待测试代码：

```java
@Service
public class UsersServiceImpl extends BaseServiceImpl implements UsersService {
    
    /**
     * query user
     *
     * @param name name
     * @param password password
     * @return user info
     */
    @Override
    public User queryUser(String name, String password) {
        String md5 = EncryptionUtils.getMd5(password);
        return userMapper.queryUserByNamePassword(name, md5);
    }
    
}
```

##### 1. Mock

> 模拟 DAO 层数据库操作，实现 Service 层测试

测试代码：

```java
@RunWith(MockitoJUnitRunner.class)
public class UsersServiceTest {
    
    private static final Logger logger = LoggerFactory.getLogger(UsersServiceTest.class);

    @InjectMocks
    private UsersServiceImpl usersService;

    @Mock
    private UserMapper userMapper;
    
    @Test
    public void testQueryUser() {
        String userName = "userTest0001";
        String userPassword = "userTest0001";
        when(userMapper.queryUserByNamePassword(userName, EncryptionUtils.getMd5(userPassword))).thenReturn(getGeneralUser());
        User queryUser = usersService.queryUser(userName, userPassword);
        logger.info(queryUser.toString());
        Assert.assertTrue(queryUser != null);
    }
    
    /**
     * get user
     */
    private User getGeneralUser() {
        User user = new User();
        user.setUserType(UserType.GENERAL_USER);
        user.setUserName("userTest0001");
        user.setUserPassword("userTest0001");
        return user;
    }

}
```

##### 2. H2 内存数据库

1. pom 依赖

   ```xml
   <dependency>
       <groupId>com.h2database</groupId>
       <artifactId>h2</artifactId>
       <scope>test</scope>
   </dependency>
   ```

2. 数据库初始化

   > 由于 h2 是内存数据库，不会持久化表结构，因此在每次测试前都要先初始化表结构。

   在 `test/resources` 目录下新建 `application.yml` 文件

   ```yaml
   spring:
     database:
     	driver-class-name: org.h2.Driver
   	url: jdbc:h2:mem:test	# test 为数据库名称
       initialization-mode: always	# always: 每次启动时进行初始化
       schema: classpath:sql/schema.sql	# 用于初始化表结构的 sql 文件的路径
       data: classpath:sql/data.sql	# 用于初始化表数据的 sql 文件的路径
   
   # 打印 sql debug 日志
   logging:
     level:
       org.apache.dolphinscheduler.dao.mapper: debug
   ```

3. 测试

   > 基于数据库环境进行测试，无需编写 mock 代码

   测试代码：

   ```java
   @RunWith(MockitoJUnitRunner.class)
   public class UsersServiceTest {
       
       private static final Logger logger = LoggerFactory.getLogger(UsersServiceTest.class);
   
       @InjectMocks
       private UsersServiceImpl usersService;
   
       @Mock
       private UserMapper userMapper;
       
       @Before
       public void createUser() {
           String userName = "userTest0001";
           String userPassword = "userTest0001";
           User user = new User();
           user.setUserName(userName);
           user.setUserPassword(userPassword);
           userMapper.insert(user);
       }
       
       @Test
       public void testQueryUser() {
           String userName = "userTest0001";
           String userPassword = "userTest0001";
           User queryUser = usersService.queryUser(userName, userPassword);
           logger.info(queryUser.toString());
           Assert.assertTrue(queryUser != null);
       }
   
   }
   ```

