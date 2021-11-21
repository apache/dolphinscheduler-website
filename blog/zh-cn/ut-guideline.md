# Unit Test Guideline

> 部分内容参考自《Unit Testing Principles, Practices, and Patterns》

## 1. 单元测试架构

### 1.1 如何构建单元测试？

> 本节将展示如何通过 3A 原则来构建单元测试，应当避免哪些缺陷，以及如何使测试更具有可读性。

#### 1.1.1 3A 原则

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

从 `arrange` 或 `assert` 开始编写单元测试都是可行的。当采用 TDD（Test-Driven Development，测试驱动开发）思想进行开发时，由于是在开发特性之前编写单元测试，因此对特性的细节并没有完全了解，此时应当首先理清期望从中得到的结果是什么，进而再思考如何满足这些期望，此时更加推荐从 `assert` 开始编写单元测试。当然，如果并没有遵循 TDD 思想，也就是在编写单元测试之前业务代码已经实现，那么这时候更推荐从 `arrange` 开始编写单元测试。

#### 1.1.2 避免多重 Arrage, Act, Assert 嵌套

![nested-3a](/img/unit-test/ut-nested-3a.png)

多重 Arrange, Act, Assert 意味着该测试正在验证多个行为单元，那么它就不再是单元测试，而是集成测试了。此时应当将这种测试分解成多个测试，使单元测试更加简单、快速且易于理解。

#### 1.1.3 避免使用 `if` 条件语句

无论是单元测试还是集成测试，都应该是一个没有分支的、简单的步骤序列，而 `if` 语句表明在一次测试中验证了多种情况，因此，同样应该将这种测试分解成多个测试。

#### 1.1.4 删除 arrange, act, assert 的注释

区分 arrange、act、assert 三部分可以提高可读性。可以通过以下两种方式进行区分：

1. 在每部分的开始添加注释来表明是哪一部分。

   ```java
   // arrange
   Calculator calculator = new Calculator();
   // act
   long actual = calculator.sum(1L, 2L);
   // assert
   assertEquals(3L, actual);
   ```

2. 在各部分之间添加空行。

### 1.2 单元测试命名

首先，单元测试的名称是否具有表达性是很重要的，合适的名称可以让人们快速理解这个测试的目的和结果。

推荐使用下列命名方式：

```
[MethodUnderTest]_[Scenario]_[ExpectedResult]
```

- `MethodUnderTest`：被测试方法名。
- `Scenario`：测试方法的条件。
- `ExpectedResult`：在上述条件下所期望的结果。

如测试 `isAdult()` 方法：

```java
public boolean isAdult(int age) {
    if (age < 0 || age > 120) {
        throw new IllegalArgumentException("The age is illegal");
    }
    return age >= 18;
}
```

`isAdult` 测试方法命名：

```
isAdult_MoreThan18_ReturnTrue	// 大于 18 岁 => 是成年人
isAdult_LessThan0_ThrowIllegalArgumentException	// 小于 0 岁 => 非法输入
```

此外，还需注意一下几点：

1. 不要遵循严格的命名方式。因为有时很难在方法名中描述复杂的情况。
2. 用下划线分隔单词。 这样做有助于提高可读性。

## 2. 单元测试风格

三种单元测试风格：

- `output-based style`，基于输出结果的测试风格
- `state-based style`，基于状态的测试风格
- `communication-based style`，基于通信的测试风格

### 2.1 output-based style

该测试风格如下图所示，在输入参数之后对业务代码的输出结果进行验证。该测试风格只适用于测试不会改变全局或内部状态的业务代码，因此只需验证其返回值即可。

![output-based-style](/img/unit-test/ut-output-based-style.png)

示例：

`calculateDiscount()` 方法用于计算一组物品的折扣。

```java
public class PriceEngine {
    public double calculateDiscount(Product[] products) {
        double discount = products.length * 0.01;
        return Math.min(discount, 0.02);
    }
}
```

`output-based` 风格的单元测试：

```java
public class PriceEngineTest {
    @Test
    public void calculateDiscount_MinimumDiscount_ReturnMinimumDiscount() {
        // arrange
		Product product1 = new Product("Hand wash");
        Product product2 = new Product("Shampoo");
        PriceEngine priceEngine = new PriceEngine();
        Product[] products = new Product[]{product1, product2};
        // act
        double discount = priceEngine.calculateDiscount(products);
        // assert
        Assert.assertEquals(0.02, discount);
    }
}
```

### 2.2 state-based style

该测试风格如下图所示，在操作完成后验证系统的最终状态。其中，“状态”一词可以指单元测试本身，也可以指数据库、文件系统等外部依赖。

![state-based-style](/img/unit-test/ut-state-based-style.png)

示例：

`addProduct()` 方法用于向订单中添加一个物品。

```java
public class Order {
    public List<Product> products = new ArrayList<>();

    public void addProduct(Product product) {
        products.add(product);
    }
}
```

`state-based` 风格的单元测试：

```java
public class OrderTest {
    @Test
    public void addProduct_AddAProduct() {
        // arrange
        Product product = new Product("Hand wash");
        Order order = new Order();
        // act
        order.addProduct(product);
        // assert
        Assert.assertEquals(1, order.products.size());
        Assert.assertEquals(product, order.products.get(0));
    }
}
```

> 与 `output-based style` 不同，`addProduct()` 方法的结果会导致订单状态的更改。

### 2.3 communication-based style

该测试风格如下图所示，使用 mock 验证待测部分是否能够正确调用其他模块。

![ut-communication-based-style](/img/unit-test/ut-communication-based-style.png)

示例：

`greetUser()` 方法用于发送问候邮件。

```java
public class EmailSender {
    
    private SendService service;
    
    public EmailSender(SendService service) {
		this.service = service;
    }

    public boolean greetUser(String email) {
        String message = "Hello!";
        return service.send(email, message);
    }
}
```

`communication-based` 风格的单元测试：

```java
public class EmailSenderTest {
    @Test
    public void greetUser() {
        // arrange
        SendService service = Mockito.mock(SendService.class);
        EmailSender sender = new EmailSender(service);
        String email = "user@email.com";
        when(service.send(email, Mockito.anyString())).thenReturn(true);
        // act
        boolean actual = sender.greetUser(email);
        // assert
        Assert.assertEquals(true, actual);
    }
}
```

### 2.4 对比

一个好的单元测试通常基于以下四种属性进行考量：

- 防止回归

- 重构成本
- 快速反馈
- 可维护性

|          | output-based style | state-based style | communication-based style |
| :------: | :----------------: | :---------------: | :-----------------------: |
| 重构成本 |         低         |        中         |            中             |
| 维护成本 |         低         |        中         |            高             |

> 三种风格在防止回归和快速反馈方面表现相同。

经过对比，`output-based` 风格是最合适的。基于该风格的单元测试很少与实现细节耦合在一起，因此重构成本较小。同时由于该风格所具有的简洁、不依赖于外部环境等特性，因此更具有可维护性。

`state-based` 和 `communication-based` 风格的单元测试与实现细节的耦合度更高，因此更难以重构。并且它们代码量往往更大，从而导致更高的维护成本。

综上，更推荐基于 `output-based` 风格编写单元测试。

## 3. 反例

### 3.1 不要为了测试而更改 private 状态

原则上应当只针对 public API 进行测试。通常 private 方法只完成很小一部分功能，它是短小精悍的，虽然可以通过反射等技术实现对 private 方法的测试，但是这将会使测试变的繁琐而且更难维护，因此大多时候无需单独测试  private 方法。

若 private 方法确实需要进行直接测试，也不要为了测试而更改 private 状态。可以使用下面两种方式实现：

1. 设计测试用例，通过测试 public API 间接测试 private 方法。

2. 将 private 方法重构成工具类的 public 方法。

   > 这么做是为了改善设计，而不是帮助测试。

以第二种方式为例：

```java
public class Order {
    private Customer customer;
    private List<Product> products;
    
    public String generateDescription() {
		return "Customer name: " + customer.getName() + ", total price: " + getPrice();
    }
    
    private double getPrice() {
        double basePrice;	// 基于 products 计算
        double discounts;	// 基于 customer 计算
        double taxes;	// 基于 products 计算
        // do some calculation
        return basePrice - discounts + taxes;
    }
}
```

其中，公有的 `generateDescription()` 方法非常简单，只是返回一个订单的信息，但是它所调用的私有的 `getPrice()` 方法却非常复杂。`getPrice()` 方法包含了重要的业务逻辑，因此需要进行全面测试。

为了测试 `getPrice()` 方法，应当将其重构到单独一个类中。

```java
public class Order {
    private Customer customer;
    private List<Product> products;
    
    public String generateDescription() {
        PriceCalculator calc = new PriceCalculator();
		return "Customer name: " + customer.getName() +
            ", total price: " + calc.getPrice(customer, products);
    }
}

public class PriceCalculator {
    public double getPrice(Customer customer, List<Product> products) {
        double basePrice;	// 基于 products 计算
        double discounts;	// 基于 customer 计算
        double taxes;	// 基于 products 计算
        // do some calculation
        return basePrice - discounts + taxes;
    }
}
```

这样，就可以不依赖于 `Order` 类实现 `PriceCalculator` 类的测试了。另外，由于 `getPrice()` 方法并没有改变任何状态，因此可以基于 `output-based` 风格编写该方法的单元测试。

### 3.2 测试中不要涉及业务代码逻辑

> 这种情况通常发生在涉及复杂算法的测试中。

以一个简单的例子说明这种情况：

```java
public class CalculatorTest {
    @Test
    public void sum() {
        // arrange
        long a = 1L, b = 2L;
        Calculator calculator = new Calculator();
        // act
        long actual = calculator.sum(a, b);
        // assert
        long expected = a + b;	// 反例
        long expected = 3L;	// 正例
        assertEquals(expected, actual);
    }
}
```

在编写单元测试时，应当将待测方法看成一个黑盒。

### 3.3 代码污染

代码污染是指添加仅用于测试的生产代码。它将测试代码和业务代码混合在一起，增加了维护成本。

示例：

```java
public class Logger {
    private boolean isTestEnvironment;
    
    public Logger(boolean isTestEnvironment) {
        this.isTestEnvironment = isTestEnvironment;
    }
    
    public void log(String text) {
        if (!isTestEnvironment) {
            // log the text
        }
    }
}

public class Controller {
    public void someMethod(Logger logger) {
        logger.log("someMethod is called");
    }
}
```

在 `Logger` 中，参数 `isTestEnvironment` 变量表明当前是否运行在测试环境中，并通过构造函数传入。通过该变量可以在测试中灵活的控制日志打印，如下：

```java
public class ControllerTest {
    @Test
    public void someMethod_LogText_logNothing {
        Logger logger = new Logger(true);	// 设置为 true，表明当前处于测试环境
        Controller controller = new Controller();
        
        controller.someMethod(logger);
        
        // assert it won't log nothing
    }
}
```

示例中，首先创建了 `Logger` 类，并传入参数表明当前处于测试环境。但是如果 `Logger` 类的构造方法或参数一旦跟随业务变化而发生变动，所有涉及 `Logger` 类的单元测试都需要修改，从而增加了维护成本。

可以通过接口划分为两类 Logger 来解决这个问题。

```java
public interface Logger {
    void log(String text);
}

public class LoggerImpl implements Logger {
    @Override
    public void log(String text) {
        // log the text
    }
}

public class FakeLoggerImpl implements Logger {
    @Override
    public void log(String text) {
        // do nothing
    }
}
```

这样，在测试时只需创建一个 `FakeLoggerImpl` 对象即可，即使打印日志的逻辑发生变化，也无需修改测试代码。

```java
public class ControllerTest {
    @Test
    public void someMethod_LogText_logNothing {
        Logger logger = new FakeLoggerImpl();	// 创建一个专门用于单元测试的 Logger 对象
        Controller controller = new Controller();
        
        controller.someMethod(logger);
        
        // assert it won't log nothing
    }
}
```

