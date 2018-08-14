# Examples and hacks of ES6


### Regex
```
// Один или более символов "!?." за которыми следует ноль или более пробельных символов
delimiter = /[!?\.]+\s*/;

text = "Hello!!! What's new? Follow me.";
sentences = text.split(delimiter)
// sentences === ["Hello", "What's new", "Follow me", ""]
```
В JS существует строковый метод match()который возвращает либо совпавший участок строки либо null.
```
// name, "@", and domain
pattern = /([\w.+\-]+)@([\w\-]+\.[\w\-.]+)/;

match = 'hi@example.com'.match(pattern);
// match[0] === 'hi@example.com'
// match[1] === 'hi'
// match[2] === 'example.com'
```
В JS совпавший объект выглядит как массив. Элемент с индексом [0] — совпавшая (под)строка целиком, 1-й элемент — первая группа, 2-й — вторая и т.д. — все в соответствии с группами определенными в шаблоне.

Иногда кроме поиска требуется определить положение образца в тексте. Это можно сделать с помощью метода search().
В JS метод есть строковый метод search() возвращающий индекс начала подстроки. Или -1 если совпадений не было найдено.
```
text = 'Say hi at hi@example.com';
first_match = text.search(pattern);
if (first_match > -1) {
    start = first_match;  // start === 10
}
```
Обычно замена по шаблону нужна когда требуется очистить данные или добавить какие-нибудь свойства в текст. К примеру, мы можем взять строку и все встречающиеся email-адреса сделать ссылками:
Разработчики на JS могут использовать строковый метод replace():
```
html = 'Say hi at hi@example.com'.replace(
    pattern, 
    '<a href="mailto:$&">$&</a>',
);
// html === 'Say hi at <a href="mailto:hi@example.com">hi@example.com</a>'
```
В JS совпавшие группы доступны как $&, $1, $2 и т.д.

Давайте изменим все встречающиеся e-mail адреса ПРОПИСНЫМИ БУКВАМИ.
В JS функция замены получает совпавшую строку целиком, первое вхождение, второе и т.д. Мы производим необходимые действия и возвращаем измененную строку:
```
text = 'Say hi at hi@example.com'.replace(
    pattern,
    function(match, p1, p2) {
        return match.toUpperCase();
    }
);
// text === 'Say hi at HI@EXAMPLE.COM'
```


### Bind
В Firefox и Chromium методы консоли должны быть запущены из контекста console, так что если нужно передать их в качестве коллбэка придется привязать — например, # console.log.bind(console). 
```
const print = console.log.bind(console);
```

// Немного надоедает использовать .call каждый раз. Может воспользоваться bind?
// Точно! Давайте привяжем функцию call к контексту slice. 
```
slice = Function.prototype.call.bind(Array.prototype.slice);
// Теперь slice использует первый аргумент в качестве контекста
slice([1,2,3], 0, 1); // => [1]

//
// Неплохо, правда? Но у меня осталась еще кое-что.
//

// Давайте проделаем с самим bind то же,
// что мы делали со slice
var bind = Function.prototype.call.bind(Function.prototype.bind);

// Обдумайте то, что мы только что сделали.
// Что происходит? Мы оборачиваем call, возвращая функцию, которая принимает функцию и контекст
// и возвращает связанную с контекстом функцию.

// Вернемся к нашему первоначальному примеру
var context = { foo: "bar" };
function returnFoo () {
  return this.foo;
}

// И к нашему новому bind
var amazing = bind(returnFoo, context);
amazing(); // => bar
```

### for-in. 
#### никогда не обходите массив циклом for-in. 
Это не только медленно, но и вынуждает, если нужна поддержка IE8-, проверять, является ли ключ 
собственным — иначе выполните обход не только элементов массива, но и методов его прототипа.


### Array.from.
Статические методы Array.from и Array.of — дженерики, если они запущены в контексте функции, отличной от Array, они создают её инстансы. 
Array.from. - Это универсальное приведение к массиву  итерируемых и array-like объектов. Во большинстве случаев он заменит Array.prototype.slice.call без указания начальной и конечной позиций. Дополнительно, метод принимает опциональный map-коллбэк и контекст его исполнения. 
```
Array.from(new Set([1, 2, 3, 2, 1]));      // => [1, 2, 3]
Array.from({0: 1, 1: 2, 2: 3, length: 3}); // => [1, 2, 3]
Array.from('123', Number);                 // => [1, 2, 3]
Array.from('123', function(it){
  return it * it;
});    
```

### Array.of 
на текущий момент практически бесполезен. Он нужен, в первую очередь, для подклассов Array, как аналог литерала массива []. Пример:
```
Array.of(1);       // => [1]
Array.of(1, 2, 3); // => [1, 2, 3]
```

## Методы Array#find и Array#findIndex осуществляют поиск по массиву через вызов коллбэка. Пример:
```
function isOdd(val){
  return val % 2;
}
[4, 8, 15, 16, 23, 42].find(isOdd);      // => 15
[4, 8, 15, 16, 23, 42].findIndex(isOdd); // => 2
[4, 8, 15, 16, 23, 42].find(isNaN);      // => undefined
[4, 8, 15, 16, 23, 42].findIndex(isNaN); // => -1
```

### Array#fill 
заполняет массив переданным значением. Опциональные аргументы — стартовая и конечная позиции. Пример:
```
Array(5).map(function(){
  return 42;
});                // => [undefined × 5], потому как .map пропускает "дырки" в массиве
Array(5).fill(42); // => [42, 42, 42, 42, 42]
```

## Методы строки
Тут всё просто. 
### String#includes 
(до недавнего времени — String#contains, но # Array#includes утянул его за собой, пока доступен и по старому имени) проверяет вхождение подстроки в строку. 
### String#startsWith 
### String#endsWith 
проверяют, начинается ли или заканчивается ли строка на заданную подстроку. Эти 3 метода принимают дополнительный аргумент — стартовую позицию. Пример:
```
'foobarbaz'.includes('bar');      // => true
'foobarbaz'.includes('bar', 4);   // => false
'foobarbaz'.startsWith('foo');    // => true
'foobarbaz'.startsWith('bar', 3); // => true
'foobarbaz'.endsWith('baz');      // => true
'foobarbaz'.endsWith('bar', 6);   // => true
```

### String#repeat 
возвращает строку, повторенную заданное число раз. Пример:
```
'string'.repeat(3); // => 'stringstringstring'
```

### Object.is
Операторы сравнения в JavaScript вообще довольно странно себя ведут. Забудем даже такой оператор, как == с его приведениями, посмотрим на ===:
NaN === NaN  // => false
0 === -0     // => true, но при этом:
1/0 === 1/-0 // => false

Как раз для этого случая, в языке есть внутренний алгоритм сравнения SameValue. Для него NaN равен NaN, а +0 и -0 различны. В ECMAScript 6 его хотели вынести наружу как операторы is и isnt, но, похоже, поняв, что операторов сравнения в языке уже и так не мало, да и для обратной совместимости, вынесли как метод Object.is. Пример:
```
Object.is(NaN, NaN); // => true
Object.is(0, -0);    // => false
Object.is(42, 42);   // => true, аналогично '==='
Object.is(42, '42'); // => false, аналогично '==='
```
Также в ES6 и далее активно используется другой алгоритм сравнения — SameValueZero, для которого NaN равен NaN, и, в отличии от предыдущего, -0 равен +0. Им обеспечивается уникальность ключа  коллекций, он применяется при проверке вхождения элемента в коллекцию через # Array#includes.


### Map
коллекция ключ — значение, в качестве ключей могут выступать любые сущности JavaScript — как примитивы, так и объекты. Есть возможность обхода — имеют # итераторы и метод .forEach, количество элементов доступно через свойство .size. Пример:
```
var a = [1];

var map = new Map([['a', 1], [42, 2]]);
map.set(a, 3).set(true, 4);

console.log(map.size);        // => 4
console.log(map.has(a));      // => true
console.log(map.has([1]));    // => false
console.log(map.get(a));      // => 3
map.forEach(function(val, key){
  console.log(val);           // => 1, 2, 3, 4
  console.log(key);           // => 'a', 42, [1], true
});
map.delete(a);
console.log(map.size);        // => 3
console.log(map.get(a));      // => undefined
console.log(Array.from(map)); // => [['a', 1], [42, 2], [true, 4]]

const cars = {'BMW':3, "Tesla": 2, "Toyota": 1};
const map = new Map(Object.entries(car));
console.log(map);  //  Map { 'BMW':3, "Tesla": 2, "Toyota": 1 }
```

### Set
коллекция уникальных значений. Как и у Map, есть возможность обхода. Пример:
```
var set = new Set(['a', 'b', 'a', 'c']);
set.add('d').add('b').add('e');
console.log(set.size);        // => 5
console.log(set.has('b'));    // => true
set.forEach(function(it){  console.log(it);            // => 'a', 'b', 'c', 'd', 'e'  });
set.delete('b');
console.log(set.size);        // => 4
console.log(set.has('b'));    // => false
console.log(Array.from(set)); // => ['a', 'c', 'd', 'e']
```

### Iterator
объект, имеющий метод .next, который должен возвращать объект с полями .done — завершен ли обход итератора, и .value — значение текущего шага. Пример — метод, создающий итератор для положительного числа, позволяющий обойти все целые от 0 до заданного:
```
function NumberIterator(number){
  var i = 0;
  return {
    next: function(){
      return i < number
        ? {done: false, value: i++}
        : {done: true};
    }
  }
}
```

### Генератор
это — функция, выполнение которой можно приостановить. Возвращает объект с расширенным интерфейсом итератора. 
```
Number.prototype[Symbol.iterator] = function*(){
  for(var i = 0; i < this;)yield i++;
}

Array.from(10); // => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
```

к протоколу итераторов относятся и array / generator comprehensions (абстракция массива / генератора?). Раньше они присутствовали в черновике ECMAScript 6, но отложены до ECMAScript 7
```
var ar1 = [for(i of [1, 2, 3])i * i];    // => [1, 4, 9]

var set = new Set([1, 2, 3, 2, 1]);
var ar2 = [for(i of set)if(i % 2)i * i]; // => [1, 9]

var iter = (for(i of set)if(i % 2)i * i);
iter.next(); // => {value: 1, done: false}
iter.next(); // => {value: 9, done: false}
iter.next(); // => {value: undefined, done: true}

var map1 = new Map([['a', 1], ['b', 2], ['c', 3]]);
var map2 = new Map((for([k, v] of map1)if(v % 2)[k + k, v * v])); // => Map {aa: 1, cc: 9}
```

## Цикл for-of 
предназначен для обхода итерируемых объектов. На нашем примере с итерируемыми числами он работает так (песочница):

for(var num of 5)console.log(num); // => 0, 1, 2, 3, 4

В ECMAScript 6 итерируемы String, Array, Map, Set и Arguments. Кроме того, Array, Map и Set имеют методы .keys, .values и .entries, которые возвращают итераторы соответственно по ключам, значениям и паре ключ-значение. Core.js добавляет данные итераторы и методы. Вместе с циклом for-of это выглядит так (песочница):


### Promise
```
var log = console.log.bind(console);
function sleepRandom(time){
  return new Promise(function(resolve, reject){
    // resolve разрешает обещание успешно, reject - с ошибкой
    // разрешим обещание через заданное время
    setTimeout(resolve, time * 1e3, 0 | Math.random() * 1e3);
  });
}

log('Поехали');                // => Поехали
sleepRandom(5).then(function(result){
  log(result);                 // => 869, через 5 сек.
  return sleepRandom(10);
}).then(function(result){
  log(result);                 // => 202, через 10 сек. 
}).then(function(){
  log('Сразу после прошлого'); // => Сразу после прошлого
  throw Error('Ашыпка!');
}).then(function(){
  log('не будет выведено - ошибка');
}).catch(log);                 // => Error: 'Ашыпка!'
```

### Promise.all 
возвращает обещание, которое разрешится, когда разрешатся все обещания из переданной ему # итерируемой коллекции (в v8 сейчас работает только с массивами
```
Promise.all([
  'foo',
  sleepRandom(5),
  sleepRandom(15),
  sleepRandom(10)  // через 15 секунд выведет что-то вроде
]).then(log);      // => ['foo', 956, 85, 382]
```

### instanceof
```
function isFish(pet: Fish | Bird): pet is Fish {
    return pet instanceof Fish;
}

if (isFish(pet)) {
    pet.swim();
} else {
    pet.fly();
}
```
