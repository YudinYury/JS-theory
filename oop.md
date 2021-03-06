# Backend developer checklist 

****************************************************************************
## Stage 1, part 1 
## 4 основных принципах ООП:
  * Абстракция
  * Инкапсуляция
  * Наследование
  * Полиморфизм
****************************************************************************
### АБСТРАКЦИЯ
Абстракция - это использование/обсуждение объектов без уточнения их внутренней структуры.
Говорим о предмете не уточняя материала, из которого он сделан.

Под абстрагированием мы подразумеваем изоляцию непереносимого кода
в его собственном классе или по крайней мере в его собственном методе (который
может быть переопределен). 
Например, если вы пишете код для доступа к после-
довательному порту определенного аппаратного обеспечения, то вам следует создать
класс-обертку для работы с ним. Ваш класс затем должен будет отправить сообще-
ние классу-обертке для получения информации и услуг, которые ему нужны.


### ИНКАПСУЛЯЦИЯ; 
модификаторы доступа: public, private, protected; свойство класса (геттер, сеттер).
*
Зачем ? Как применять ?  
Зачем нам надо связывать данные и методы внутри класса ? Кроме закрытия от пользователя.

ИНКАПСУЛЯЦИЯ - это Объединение атрибутов и методы в одной сущности/классе и скрытие 
от пользователя класса части свойств и методов, а также способов реализации 
функциональности класса.
При проектировании класса определяем что в классе должно быть видно, а что — нет. 
При хорошем объектно-ориентированном проектировании объект должен показывать только интерфейсы, 
необходимые другим объектам для взаимодействия с ним. 
Детали, не относящиеся к использованию объекта, должны быть скрыты от всех других объектов.

ИНКАПСУЛЯЦИЯ обеспечивает модульность (все в одном месте)  и облегчает переиспользование (наследование и композиция), сопровождение и рефакторинг.

ИНКАПСУЛЯЦИЯ позволяет нам управлять доступом к данным в объекте. 
Клиентский код видит только интерфейс (публичные методы), а разработчики могут изменить реализацию не затронув клиентский код.

Для того, чтобы скрытие данных произошло, все атрибуты должны быть объявлены как private. Поэтому 
атрибуты никогда не являются частью интерфейсов. Частью интерфейсов классов могут быть только открытые методы. Объявление атрибута как public нарушает концепцию скрытия данных.

* public — доступ к типу или члену возможен из любого другого кода в той же
сборке или иной сборке, которая на него ссылается;
* private — доступ к типу или члену возможен только из кода в том же классе или
структуре;
* protected — доступ к типу или члену возможен только из кода в том же классе
или структуре или в производном классе;

public 
Когда тип данных или метод определен как public, у других объектов будет к нему прямой
доступ.

private
Когда тип данных или метод определен как private, только код этого объекта
сможет получить к нему доступ. 


### НАСЛЕДОВАНИЕ - получение по наследству атрибутов и поведений от родительского класса/классов.

Наследование: класс может унаследовать — использовать по умолчанию — поля и методы своего предка. 
Класс может наследовать от другого класса и использовать атрибуты и методы своего предка. 

НАСЛЕДОВАНИЕ подразумевает получение по наследству атрибутов и поведений от родительского класса/классов.
При этом имеет место настоящее отношение «родительский класс/дочерний класс». Дочерний класс (или подкласс) наследует напрямую от родительского класса (или суперкласса).

Наследование характеризуется отношением «является экземпляром».

Ключевое слово extends используется в объявлении класса или в выражениях класса 
для создания дочернего класса.

class Square extends Polygon {
  constructor(length) {
    super(length, length);
    this.name = 'Square';
  }



### ПОЛИМОРФИЗМ –  – это когда подкласс класса может вызвать ту же самую обобщенную унаследованную функцию в своем собственном контексте.

ПОЛИМОРФИЗМ Означает, что схожие объекты способны по-разному отвечать на одно и 
то же сообщение. Например, у вас может быть система с множеством фигур. Однако 
круг, квадрат и звезда рисуются по-разному. Используя полиморфизм, вы можете 
отправить одно и то же сообщение (например, Draw ) объектам, на каждый из 
которых возлагается обязанность по рисованию соответствующей ему фигуры.

#### ПОЛИМОРФИЗМ ПОДТИПОВ.
Полиморфизм подтипов заключается в том, что вызывающий код использует объект, 
опираясь только на его интерфейс (контракт), не зная при этом фактического типа. 
Такой подход позволяет подтипам реализовывать свое поведение и т.о. изменять 
поведение программы без перекомпиляции кода-клиента.
Например, это дает возможность при статической типизации указывать тип родительского 
класса для единообразной работы с массивом, стостоящим из дочерних (классов) типов. 


### Объект 
— это именованная сущность, одновременно содержащая данные(свойства) и поведения(методы).
Слово «одновременно» в данном случае определяет ключевую разницу между ООП и 
другими методологиями программирования. Например, при процедурном программировании 
код размещается в полностью отдельных функциях или процедурах.

Класс - это шаблон, предназначенный для создания объектов.
Класс - это именованная сущность из предметной области, возможно, имеющая 
предка (суперкласс), определенная как набор полей и методов.

Объект — это сущность, одновременно содержащая данные(свойства) и поведения(методы).
Слово «одновременно» в данном случае определяет ключевую разницу между ООП и 
другими методологиями программирования. Например, при процедурном программировании 
код размещается в полностью отдельных функциях или процедурах.

Классом в объектно-ориентированной разработке называют шаблон/программный код, 
предназначенный для создания объектов и методов.

Класс - именованная сущность из предметной области, возможно, имеющая предка (суперкласс), определенная как набор полей и методов.

Поле - именованное свойство с определенным типом, которое может, в частности, ссылаться на другой объект (см. композиция).
Метод - именованная функция или процедура, с параметрами или без них, реализующая какое-то поведение класса.

Наследование: класс может унаследовать — использовать по умолчанию — поля и методы своего предка. Наследование транзитивно: класс может наследоваться от другого класса, который наследуется от третьего, и так далее вплоть до базового класса (обычно — Object), возможно, неявного. Наследник может переопределить какие-то методы и поля чтобы изменить поведение по умолчанию.

Композиция: если поле у нас имеет тип Класс, оно может содержать ссылку на другой объект этого класса, создавая таким образом связь между двумя объектами. Не влезая в дебри различий между простой ассоциацией, агрегированием и композицией, давайте "на пальцах" определим: композиция — это когда один объект предоставляет другому свою функциональность частично или полностью.
Инкапсуляция: мы обращаемся с объектами как с единой сущностью, а не как с набором отдельных полей и методов, тем самым скрываем и защищаем реализацию класса. Если клиентский код не знает ничего, кроме публичного интерфейса, он не может зависеть от деталей реализации.

В JavaScript классы можно организовать по-разному. Говорят, что класс User написан 
в «функциональном» стиле. Далее мы также увидим «прототипный» стиль.

Объекты — это строительные блоки объектно-ориентированных программ. Та или
иная программа, которая задействует объектно-ориентированную технологию, по
сути является набором объектов.

СКРЫТИЕ ДАННЫХ
В объектно-ориентированной терминологии данные называются атрибутами, а поведе-
ния — методами. Ограничение доступа к определенным атрибутам и/или методам на-
зывается скрытием данных.

РАЗНИЦА МЕЖДУ ОБЪЕКТНО-ОРИЕНТИРОВАННЫМ И СТРУКТУРНЫМ ПРОЕКТИРОВАНИЕМ
При объектно-ориентированном проектировании атрибуты и поведения размещаются
в рамках одного объекта, в то время как при процедурном или структурном проектиро-
вании атрибуты и поведения обычно разделяются.

при структурном программировании данные зачастую отделяются от процедур и являются глобальными, благодаря чему их легко модифицировать вне области видимости вашего кода.

ПРАВИЛЬНОЕ ПРОЕКТИРОВАНИЕ
Мы можем сказать, что при правильном проектировании в объектно-ориентированных
моделях нет такого понятия, как глобальные данные. По этой причине в объектно-
ориентированных системах обеспечивается высокая степень целостности данных.

Данные, содержащиеся в объекте, представляют его состояние. В терминологии
объектно-ориентированного программирования эти данные называются атрибу-
тами.

Класс - это «чертеж» объекта. При создании экземпляра объекта вы станете 
использовать класс как основу для того, как этот объект будет 
Что такое класс  создаваться.
Класс можно представлять себе как нечто вроде типа данных более высокого
уровня.

Класс определяет атрибуты и поведения, ко-
торые будут принадлежать всем объектам, созданным с использованием этого
класса.

Данные класса представляются атрибутами. Любой класс дол-
жен определять атрибуты, сохраняющие состояние каждого объекта, экземпляр
которого окажется создан на основе этого класса.

ОБЪЕКТНЫЕ ОБЕРТКИ
Объектные обертки представляют собой объектно-ориентированный код, в который за-
ключается другой код. Например, вы можете взять структурированный код (вроде ци-
клов и условий) и заключить его в объект, чтобы этот код выглядел как объект. Вы так-
же можете использовать объектные обертки для заключения в них функциональности,
например параметров, касающихся безопасности, или непереносимого кода, связанного
с аппаратным обеспечением, и т. д. 

МЕТОДЫ реализуют требуемое поведение класса.
Каждый объект, экземпляр которого окажется создан на основе этого класса, будет
содержать методы, определяемые этим же классом. Методы могут реализовывать
поведения, вызываемые из других объектов (с помощью сообщений) либо обеспе-
чивать основное, внутреннее поведение класса. Внутренние поведения — это закры-
тые методы, которые недоступны другим объектам.

СООБЩЕНИЯ — это механизм коммуникаций между объектами. Например, когда
объект А вызывает метод объекта В, объект А отправляет сообщение объекту В.
Ответ объекта В определяется его возвращаемым значением. Только открытые,
а не закрытые методы объекта могут вызываться другим объектом.

Список объектно-ориентированных концепций:
- инкапсуляция;
- наследование;
- полиморфизм;
- композиция.


ИНКАПСУЛЯЦИЯ - это Объединение атрибутов и методы в одной сущности/классе и скрытие от пользователя класса данных/свойств, методов и способов реализации функциональности класса.
При проектировании класса определяем что в классе должно быть видно, а что — нет. 
При хорошем объектно-ориентированном проектировании объект должен показывать только интерфейсы, 
необходимые другим объектам для взаимодействия с ним. 
Детали, не относящиеся к использованию объекта, должны быть скрыты от всех других объектов.

ИНКАПСУЛЯЦИЯ позволяет нам управлять доступом к данным в объекте. 
Клиентский код видит только интерфейс (публичные методы), а разработчики могут изменить реализацию не затронув клиентский код.

ИНКАПСУЛЯЦИЯ обеспечивает модульность (все в одном месте)  и облегчает переиспользование (наследование и композиция), сопровождение и рефакторинг.


НАСЛЕДОВАНИЕ
Класс может наследовать от другого класса и использовать преимущества атрибутов и методов, определяемых суперклассом.

Наследование в JS построено на прототипах. Берем класс, который нас почти устраивает и через переопределение части методов (функциональности) или через композицию создаем нужного 
нам потомка. Не копи-пастим больших кусков кода.
При структурном проектировании повторное использование кода допускается в известной мере: 
вы можете написать процедуру, а затем применять ее столько раз, сколько пожелаете.
Основное средство обеспечения такой функциональности — наследование.
Наследование позволяет классу наследовать атрибуты и методы другого класса.
Это дает возможность создавать абсолютно новые классы путем абстрагирования
общих атрибутов и поведений.
Одна из основных задач проектирования при объектно-ориентированном про-
граммировании заключается в выделении общности разнообразных классов. До-
пустим, у вас есть класс Dog и класс Cat , каждый из которых будет содержать атри-
бут eyeColor. При процедурной модели код как для Dog , так и для Cat включал бы
этот атрибут. При объектно-ориентированном проектировании атрибут, связанный
с цветом, можно перенести в класс с именем Mammal наряду со всеми прочими об-
щими атрибутами и методами. В данном случае оба класса — Dog и Cat — будут
наследовать от класса Mammal

Mammal
-eyeColor:int
+gerYeyColoe:int

Dog
-barkFrequency:int
+bark:void

Cat
-meowFrequency:int
+meow:void

Итак, оба класса наследуют от Mammal . Это означает, что в итоге класс Dog будет
содержать следующие атрибуты:
eyeColor
barkFrequency
// унаследован от Mammal
// определен только для Dog
В том же духе объект Dog будет содержать следующие методы:
getEyeColor
bark
// унаследован от Mammal
// определен только для Dog
Создаваемый экземпляр объекта Dog или Cat будет содержать все, что есть в его
собственном классе, а также все имеющееся в родительском классе.

Суперкласс, или родительский класс (иногда называемый базовым), содержит все
атрибуты и поведения, общие для классов, которые наследуют от него.

Подкласс, или дочерний класс (иногда называемый производным), представ-
ляет собой расширение суперкласса.


ПОЛИМОРФИЗМ – расширение принципа наследования в ООП, реализуемое в JavaScript 
с помощью оператора prototype. Полиморфизм – это когда подкласс класса может 
вызвать ту же самую обобщенную унаследованную функцию в своем собственном контексте.

ПОЛИМОРФИЗМ Означает, что схожие объекты способны по-разному отвечать на одно и 
то же сообщение. Например, у вас может быть система с множеством фигур. Однако 
круг, квадрат и звезда рисуются по-разному. Используя полиморфизм, вы можете 
отправить одно и то же сообщение (например, Draw ) объектам, на каждый из 
которых возлагается обязанность по рисованию соответствующей ему фигуры.

Полиморфизм - это когда подкласс класса может вызвать ту же самую обобщенную унаследованную функцию в своем собственном контексте.

фундаментальная концепция полиморфизма — на индивидуальный объект, будь то Circle , Star или Square , возлагается обязанность по рисованию фигуры, которая ему соответствует.

В иерархии наследования все подклассы наследуют от своих супер-
классов. Однако, поскольку каждый подкласс представляет собой отдельную
сущность, каждому из них может потребоваться дать отдельный ответ на одно
и то же сообщение. Для этого потребуется обеспечить фактическую реализацию.


АССОЦИАЦИЯ означает отношение между классами объектов, которое позволяет одному 
экземпляру объекта вызвать другого, чтобы выполнить действие от его имени. Это 
структурное отношение, поскольку определяет связь между объектами одного рода и 
объектами другого рода и не моделирует поведение.

АГРЕГАЦИЯ
АГРЕГАЦИЯ подразумевают методику создания нового класса из уже существующих классов 
путём их включения. 
Об агрегировании также часто говорят как об «отношении принадлежности» по принципу 
«у машины есть корпус, колёса и двигатель».
Пожалуй, наиболее интуитивно понятной формой композиции является агрегация.
Агрегация означает, что сложный объект состоит из других объектов.

class Professor;

class Department
{
  private:
    Professor* members[5];  // Aggregation, т.к. нет оператора delete 
};
class Ehe // Пример агрегации
{
private:
    Person& _partner1; // Enthaltener Teil.  // Aggregation
    Person& _partner2; // Enthaltener Teil.  // Aggregation
 
public:
    // Конструктор
    Ehe (Person& partner1, Person& partner2)
        : _partner1(partner1), _partner2(partner2)
    { }
};

КОМПОЗИЦИЯ 
Композиция (агрегирование по значению) — более строгий вариант агрегирования, когда 
включаемый объект может существовать только как часть контейнера. Если контейнер 
будет уничтожен, то и включённый объект тоже будет уничтожен.
Наследование - характеризуется отношением «является экземпляром», 
а композиция — отношением «содержит как часть».
Объекты содержат другие объекты. Объекты зачастую формируются или состоят из 
других объектов — это и есть композиция.
Композиция — индикатор использования отношения «содержит как часть». Когда наследование 
не оказывается правильным выбором при проектировании (из-за того, что отношение 
«является экземпляром» не подходит), обычно используется композиция.

Точно так же, как и наследование, композиция обеспечивает механизм для создания объектов. Фактически есть только два способа создания классов из других классов: наследование 
и композиция. Как мы уже видели, наследование позволяет одному классу наследовать от 
другого. Поэтому мы можем абстрагировать атрибуты и поведения для общих классов. 
Например, как собаки, так и кошки относятся к млекопитающим, поскольку собака является экземпляром млекопитающего так же, как и кошка. Благодаря композиции мы к тому же можем 
создавать классы, вкладывая одни классы в другие.
Для отношений композиции мы используем словосочетание «содержит как часть». Автомобиль содержит как часть двигатель. Однако мы не можем сказать, что двигатель является экземпляром автомобиля.

Во-первых, у класса Employee имеется ассоциация с классом Spouse . У работника может 
не быть супруга либо иметься один супруг (по крайней мере, в нашей культуре у работника 
не может быть более одного супруга). Таким образом, кардинальность этой ассоциации 
представлена как 0...1 .
Отношение между Employee и классом Division говорит о том, что каждый работник может быть ассоциирован с одним и только одним отделом. Это отношение представляет простая единица. Индикатор кардинальности выступает как очень важная часть объектной модели.


Абстракция - это механизм который позволяет смоделировать текущий фрагмент рабочей проблемы, с помощью наследования (специализации) или композиции. JavaScript достигает специализации наследованием, а композиции возможностью экземплярам класса быть значениями атрибутов других объектов. В JavaScript класс Function наследуется от класса Object (это демонстрирует специализацию), а свойство Function.prototype это экземпляр класса Object (это демонстрирует композицию). 

Абстракции прячут детали и дают нам возможность разговаривать о задачах на более высоком (более абстрактном) уровне.

Абстрактные классы, да не буду заброшен я помидорами за неточность, это классы, методы которых могут быть не описаны.

class Animal {
    constructor({name, age}) {
        if (this.constructor.name === 'Animal') {
            throw new Error(`${this.constructor.name}: can not create instance of abstract class`);
        }
        
        this.name = name;
        this.age = age;
    }

    name() {
        return this.name;
    }


    /*
     * Абстрактный метод
    */
    talk() {}
}

/**
 еще пример
 */
var Animal = function() {
    if (this.constructor === Animal) {
      throw new Error("Can't instantiate abstract class!");
    }
    // Animal initialization...
};

/**
 @abstract
 */
Animal.prototype.say = function() {
    throw new Error("Abstract method!");
}

идентификатор с именем abstract. 
Когда метод определяется как abstract , подкласс должен обеспечивать реализацию для этого метода;

Интерфейсы - полностью абстрактная штука, которая описывает поведение сущности, а уже конкретная реализация интерфейса должна отвечать требованиям, указанным в интерфейсе.

Если подкласс наследует абстрактный метод от суперкласса, то он
должен обеспечивать конкретную реализацию этого метода, поскольку иначе он
сам будет абстрактным классом

Stateless-объект можно удалить мгновенно после его использования и создать за мгновение до его использования. В то время когда его не используют ему существовать не обязательно. Ну, а данные он берёт, скажем, из базы данных, из сети, с диска и т.п., т.е. данные не внутри него, а где-то в другом месте — он лишь обертка, интерфейс, представитель кого-то другого. 

Stateful-объект, должен существовать между двумя последовательными обращениями к нему, просто потому что он хранит данные непосредственно внутри себя.

Классическим примером stateful реализации является библиотека iostream.
Поток в этой библиотке содержит флаги форматирования. Напрмер, флаг, указывающий использовать десятичное или шестнадцатеричное представление при выводе чисел.
Вот если бы все необходимые параметры форматирования (отличные от значений по умолчанию)
нужно было бы указывать при каждом выводе, то такая реализация была бы stateless.



