# Backend developer checklist (все по ООП, подчернутые в приоритете)

****************************************************************************
## Stage 1, part 3 

## БД
Вопросы в этом разделе:
  * Типы данных в PostgreSQL
  * Связи между таблицами
  * Первичные и внешние ключи
  * CRUD операции
  * JOIN'ы
  * Группировка, агрегатные (агрегирующе) функции
  * Сортировка

## Web
Вопросы в этом разделе:
  * get, post, option; body, query; http status
  * REST - принципы наименование методов, принцип stateless

## GIT
Вопросы в этом разделе:
  * Как добавить файлы в коммит? Почему нельзя добавлять файлы по звезде или точке?
  * Пуш. Что такое фастфовард? Чем опасен пуш с форсом?
  * Ветвление. Как создать и удалить ветку, локально и в origin`е. Как привязать локальную ветку "a1" к удаленной ветке "b2", и пушить в нее? 
  * Что такое мердж? Как его откатить? 
  * Как перименовать коммит? Как удалить последний? Как удалить коммит из середины и запушить его? В каких случаях так можно делать, а в каких нет?


****************************************************************************
## Базы данных
**ТРАНЗАКЦИЯ** - это цепочка объединенных запросов, которая или выполняется полностью или не выполняется вообще.

****************************************************************************
### Типы данных в PostgreSQL
*
https://postgrespro.ru/docs/postgrespro/9.6/datatype

Преобразования типов real и double precision так же возможны через тип numeric, например:
```
SELECT '12.34'::float8::numeric::money;

CREATE TYPE mood AS ENUM ('sad', 'ok', 'happy');
```
Порядок значений в перечислении определяется последовательностью, в которой были указаны значения при создании типа. Перечисления поддерживаются всеми стандартными операторами сравнения и связанными агрегатными функциями. Например:
```
INSERT INTO person VALUES ('Larry', 'sad');
INSERT INTO person VALUES ('Curly', 'ok');
SELECT * FROM person WHERE current_mood > 'sad';
 name  | current_mood 
-------+--------------
 Moe   | happy
 Curly | ok
(2 rows)
```
Существуют два типа данных JSON: json и jsonb. Они принимают на вход почти одинаковые наборы значений, но основное их отличие в эффективности. Тип json сохраняет точную копию введённого текста, которую функции обработки должны разбирать заново при каждом выполнении, тогда как данные jsonb сохраняются в разобранном двоичном формате, что несколько замедляет ввод из-за преобразования, но значительно ускоряет обработку, не требуя многократного разбора текста. Кроме того, jsonb поддерживает индексацию, что тоже может быть очень полезно.
```
-- Массив из нуля и более элементов (элементы могут быть разных типов)
SELECT '[1, 2, "foo", null]'::json;

-- Объект, содержащий пары ключей и значений
-- Заметьте, что ключи объектов — это всегда строки в кавычках
SELECT '{"bar": "baz", "balance": 7.77, "active": false}'::json;
```
Проверки на вхождение и существование jsonb
Проверка вхождения — важная особенность типа jsonb, не имеющая аналога для типа json. Эта проверка определяет, входит ли один документ jsonb в другой. В следующих примерах возвращается истинное значение (кроме упомянутых исключений):
```
-- Простые скалярные/примитивные значения включают только одно идентичное значение:
SELECT '"foo"'::jsonb @> '"foo"'::jsonb;

-- Массив с правой стороны входит в массив слева:
SELECT '[1, 2, 3]'::jsonb @> '[1, 3]'::jsonb;

-- Порядок элементов в массиве не важен, поэтому это условие тоже выполняется:
SELECT '[1, 2, 3]'::jsonb @> '[3, 1]'::jsonb;

-- А повторяющиеся элементы массива не имеют значения:
SELECT '[1, 2, 3]'::jsonb @> '[1, 2, 2]'::jsonb;
```
Обращение к массивам
Этот запрос получает имена сотрудников, зарплата которых изменилась во втором квартале:
```
SELECT name FROM sal_emp WHERE pay_by_quarter[1] <> pay_by_quarter[2];

 name
-------
 Carol
(1 row)
```
#### По умолчанию в Postgres Pro действует соглашение о нумерации элементов массива с 1, то есть в массиве из n элементов первым считается array[1], а последним — array[n].
этот запрос получает первые пункты в графике Билла в первые два дня недели:
```
SELECT schedule[1:2][1:1] FROM sal_emp WHERE name = 'Bill';

        schedule
------------------------
 {{meeting},{training}}
(1 row)
```


**Полнотекстовый поиск** (или просто поиск текста) — это возможность находить документы на естественном языке, соответствующие запросу, и, возможно, дополнительно сортировать их по релевантности для этого запроса. Наиболее распространённая задача — найти все документы, содержащие слова запроса, и выдать их отсортированными по степени соответствия запросу.  
Тип **tsvector** представляет документ в виде, оптимизированном для текстового поиска, а **tsquery** представляет 
запрос текстового поиска в подобном виде.
Полнотекстовая индексация заключается в предварительной обработке документов и сохранении индекса для последующего быстрого поиска. Предварительная обработка включает следующие операции:

Разбор документов на фрагменты. При этом полезно выделить различные классы фрагментов, например, числа, слова, словосочетания, почтовые адреса и т. д., которые будут обрабатываться по-разному. В принципе классы фрагментов могут зависеть от приложения, но для большинства применений вполне подойдёт предопределённый набор классов. Эту операцию в Postgres Pro выполняет анализатор (parser). Вы можете использовать как стандартный анализатор, так и создавать свои, узкоспециализированные.

Преобразование фрагментов в лексемы. Лексема — это нормализованный фрагмент, в котором разные словоформы приведены к одной. Например, при нормализации буквы верхнего регистра приводятся к нижнему, а из слов обычно убираются окончания (в частности, s или es в английском). Благодаря этому можно находить разные формы одного слова, не вводя вручную все возможные варианты. Кроме того, на данном шаге обычно исключаются стоп-слова, то есть слова, настолько распространённые, что искать их нет смысла. (Другими словами, фрагменты представляют собой просто подстроки текста документа, а лексемы — это слова, имеющие ценность для индексации и поиска.) Для выполнения этого шага в Postgres Pro используются словари. Набор существующих стандартных словарей при необходимости можно расширять, создавая свои собственные.

Хранение документов в форме, подготовленной для поиска. Например, каждый документ может быть представлен в виде сортированного массива нормализованных лексем. Помимо лексем часто желательно хранить информацию об их положении для ранжирования по близости, чтобы документ, в котором слова запроса расположены «плотнее», получал более высокий ранг, чем документ с разбросанными словами.

**ДОКУМЕНТ** — это единица обработки в системе полнотекстового поиска; например, журнальная статья или почтовое сообщение. Система поиска текста должна уметь разбирать документы и сохранять связи лексем (ключевых слов) с содержащим их документом. Впоследствии эти связи могут использоваться для поиска документов с заданными ключевыми словами.

В контексте поиска в Postgres Pro документ — это обычно содержимое текстового поля в строке таблицы или, возможно, сочетание (объединение) таких полей, которые могут храниться в разных таблицах или формироваться динамически. Другими словами, документ для индексации может создаваться из нескольких частей и не храниться где-либо как единое целое. 
Например:
```
SELECT title || ' ' ||  author || ' ' ||  abstract || ' ' || body
  AS document
FROM messages
WHERE mid = 12;

SELECT m.title || ' ' || m.author || ' ' || m.abstract || ' ' || d.body
  AS document
FROM messages m, docs d
WHERE mid = did AND mid = 12;
```
Примечание
На самом деле в этих примерах запросов следует использовать функцию coalesce, чтобы значение NULL в каком-либо одном атрибуте не привело к тому, что результирующим документом окажется NULL.



****************************************************************************
### Связи между таблицами
*

****************************************************************************
### Первичные и внешние ключи
*
https://postgrespro.ru/docs/postgrespro/9.6/ddl-constraints#ddl-constraints-fk

Ограничение внешнего ключа указывает, что значения столбца (или группы столбцов) должны соответствовать значениям в некоторой строке другой таблицы. Это называется ссылочной целостностью двух связанных таблиц.
```
CREATE TABLE products (
    product_no integer PRIMARY KEY,
    name text,
    price numeric
);

CREATE TABLE orders (
    order_id integer PRIMARY KEY,
    product_no integer REFERENCES products,
    quantity integer
);
```
С таким ограничением создать заказ со значением product_no, отсутствующим в таблице products (и не равным NULL), будет невозможно.

В такой схеме таблицу orders называют подчинённой таблицей, а products — главной. Соответственно, столбцы называют так же подчинённым и главным (или ссылающимся и целевым).
Внешний ключ будет неявно связан с первичным ключом главной таблицы.

Внешний ключ также может ссылаться на группу столбцов. В этом случае его нужно записать в виде обычного ограничения таблицы. Например:
```
CREATE TABLE t1 (
  a integer PRIMARY KEY,
  b integer,
  c integer,
  FOREIGN KEY (b, c) REFERENCES other_table (c1, c2)
);
```
Естественно, число и типы столбцов в ограничении должны соответствовать числу и типам целевых столбцов.

Таблица может содержать несколько ограничений внешнего ключа. Это полезно для связи таблиц в отношении многие-ко-многим. Скажем, у вас есть таблицы продуктов и заказов, но вы хотите, чтобы один заказ мог содержать несколько продуктов (что невозможно в предыдущей схеме). Для этого вы можете использовать такую схему:
```
CREATE TABLE products (
    product_no integer PRIMARY KEY,
    name text,
    price numeric
);

CREATE TABLE orders (
    order_id integer PRIMARY KEY,
    shipping_address text,
    ...
);

CREATE TABLE order_items (
    product_no integer REFERENCES products,
    order_id integer REFERENCES orders,
    quantity integer,
    PRIMARY KEY (product_no, order_id)
);
```
Заметьте, что в последней таблице первичный ключ покрывает внешние ключи.


****************************************************************************
### CRUD операции
Create
Read
Update
Delete
*
#### Create
```
CREATE TABLE имя_таблицы (
    имя_столбца SERIAL
);
```
равнозначна следующим командам:
```
CREATE SEQUENCE имя_таблицы_имя_столбца_seq;
CREATE TABLE имя_таблицы (
    имя_столбца integer NOT NULL DEFAULT nextval('имя_таблицы_имя_столбца_seq')
);
ALTER SEQUENCE имя_таблицы_имя_столбца_seq OWNED BY имя_таблицы.имя_столбца;
```
```
CREATE TABLE test1 (a character(4));
INSERT INTO test1 VALUES ('ok');
SELECT a, char_length(a) FROM test1; -- (1)

  a   | char_length
------+-------------
 ok   |           2


CREATE TABLE test2 (b varchar(5));
INSERT INTO test2 VALUES ('ok');
INSERT INTO test2 VALUES ('good      ');
INSERT INTO test2 VALUES ('too long');
ОШИБКА:  значение не умещается в тип character varying(5)
INSERT INTO test2 VALUES ('too long'::varchar(5)); -- явное усечение
SELECT b, char_length(b) FROM test2;

   b   | char_length
-------+-------------
 ok    |           2
 good  |           5
 too l |           5
```

```
CREATE TABLE products (
    product_no integer PRIMARY KEY,
    name text UNIQUE,
    price numeric NOT NULL CHECK (price > 0),
    discounted_price numeric CHECK (discounted_price > 0),
    CHECK (price > discounted_price)
);
CREATE TABLE orders (
    order_id integer PRIMARY KEY,
    product_no integer REFERENCES products (product_no),
    quantity integer
);
CREATE TABLE t1 (
  a integer PRIMARY KEY,
  b integer,
  c integer,
  FOREIGN KEY (b, c) REFERENCES other_table (c1, c2)
);
```
Внешний ключ также может ссылаться на группу столбцов. В этом случае его нужно записать в виде обычного 
ограничения таблицы. Число и типы столбцов в ограничении должны соответствовать числу и типам целевых столбцов.
```
CREATE TABLE order_items (
    product_no integer REFERENCES products,
    order_id integer REFERENCES orders,
    quantity integer,
    PRIMARY KEY (product_no, order_id)
);
```
В последней таблице первичный ключ покрывает внешние ключи.



#### Read
SELECT, TABLE, WITH — получить строки из таблицы или представления
https://postgrespro.ru/docs/postgrespro/9.6/sql-select
```
SELECT [ ALL | DISTINCT [ ON ( выражение [, ...] ) ] ]
    [ * | выражение [ [ AS ] имя_результата ] [, ...] ]
    [ FROM элемент_FROM [, ...] ]
    [ WHERE условие ]
    [ GROUP BY элемент_группирования [, ...] ]
    [ HAVING условие [, ...] ]
    [ { UNION | INTERSECT | EXCEPT } [ ALL | DISTINCT ] выборка ]
    [ ORDER BY выражение [ ASC | DESC | USING оператор ] [ NULLS { FIRST | LAST } ] [, ...] ]

```
**SELECT ALL** (по умолчанию) возвращает все строки результата, включая дубликаты.
SELECT DISTINCT исключает из результата повторяющиеся строки. SELECT DISTINCT ON исключает строки, 
совпадающие по всем указанным выражениям. 
Операторы **UNION, INTERSECT и EXCEPT** объединяют вывод нескольких команд SELECT в один результирующий набор. 
Оператор UNION возвращает все строки, представленные в одном, либо обоих наборах результатов. 
Оператор INTERSECT возвращает все строки, представленные строго в обоих наборах. 
Оператор EXCEPT возвращает все строки, представленные в первом наборе, но не во втором. Во всех трёх случаях повторяющиеся строки исключаются из результата, если явно не указано ALL. 
Если присутствует предложение **ORDER BY**, возвращаемые строки сортируются в указанном порядке. 
В отсутствие ORDER BY строки возвращаются в том порядке, в каком системе будет проще их выдать. (См. Предложение ORDER BY ниже.)
Если указано предложение **LIMIT** (или FETCH FIRST) либо OFFSET, оператор SELECT возвращает только подмножество строк результата. (См. Предложение LIMIT ниже.)
Предложение **WITH** позволяет задать один или несколько подзапросов, к которым затем можно обратиться по имени в основном запросе. Эти подзапросы по сути действуют как временные таблицы или представления в процессе выполнения главного запроса. Каждый подзапрос может представлять собой оператор SELECT, TABLE, VALUES, INSERT, UPDATE или DELETE.
В предложении **FROM** перечисляются одна или несколько таблиц, служащих источниками данных для SELECT.
**ON условие_соединения**
Задаваемое условие_соединения представляет собой выражение, выдающее значение типа boolean (как в предложении WHERE), которое определяет, какие строки считаются соответствующими при соединении.

**USING ( столбец_соединения [, ...] )**
Предложение вида USING ( a, b, ... ) представляет собой сокращённую форму записи ON таблица_слева.a = таблица_справа.a AND таблица_слева.b = таблица_справа.b .... Кроме того, USING подразумевает, что в результат соединения будет включён только один из пары равных столбцов, но не оба.



#### Update
Добавить столбец вы можете так:
```
ALTER TABLE products ADD COLUMN description text;
```

Удалить столбец можно так:
```
ALTER TABLE products DROP COLUMN description;
```
```
ALTER TABLE [ IF EXISTS ] имя RENAME TO новое_имя
ALTER TABLE [ IF EXISTS ] имя [ * ] действие [, ... ]
ALTER TABLE [ IF EXISTS ] имя [ * ] DROP [ COLUMN ] [ IF EXISTS ] имя_столбца [ RESTRICT | CASCADE ]
ALTER TABLE [ IF EXISTS ] имя [ * ] ALTER [ COLUMN ] имя_столбца SET ( атрибут = значение [, ... ] )
```



#### Delete


****************************************************************************
### JOIN'ы
*
https://postgrespro.ru/docs/postgrespro/9.6/sql-select

Для типов соединений **INNER** и OUTER необходимо указать условие соединения, а именно одно из предложений NATURAL, ON условие_соединения или USING (столбец_соединения [, ...]). Эти предложения описываются ниже. Для CROSS JOIN ни одно из этих предложений не допускается.

Предложение JOIN объединяет два элемента списка FROM, которые мы для простоты дальше будем называть «таблицами», хотя на самом деле это может быть любой объект, допустимый в качестве элемента FROM. Для определения порядка вложенности при необходимости следует использовать скобки. В отсутствие скобок предложения JOIN обрабатывается слева направо. В любом случае, JOIN связывает элементы сильнее, чем запятые, разделяющие элементы в списке FROM.

**CROSS JOIN и INNER JOIN** формируют простое декартово произведение, то же, что можно получить, указав две таблицы на верхнем уровне FROM, но ограниченное возможным условием соединения. Предложение CROSS JOIN равнозначно INNER JOIN ON (TRUE), то есть, никакие строки по условию не удаляются. Эти типы соединений введены исключительно для удобства записи, они не дают ничего такого, что нельзя было бы получить, используя просто FROM и WHERE.

**LEFT OUTER JOIN** возвращает все строки ограниченного декартова произведения (т. е. все объединённые строки, удовлетворяющие условию соединения) плюс все строки в таблице слева, для которых не находится строк в таблице справа, удовлетворяющих условию. Строка, взятая из таблицы слева, дополняется до полной ширины объединённой таблицы значениями NULL в столбцах таблицы справа. Заметьте, что для определения, какие строки двух таблиц соответствуют друг другу, проверяется только условие самого предложения JOIN. Внешние условия проверяются позже.

**RIGHT OUTER JOIN**, напротив, возвращает все соединённые строки плюс одну строку для каждой строки справа, не имеющей соответствия слева (эта строка дополняется значениями NULL влево). Это предложение введено исключительно для удобства записи, так как его можно легко свести к LEFT OUTER JOIN, поменяв левую и правую таблицы местами.

**FULL OUTER JOIN** возвращает все соединённые строки плюс все строки слева, не имеющие соответствия справа, (дополненные значениями NULL вправо) плюс все строки справа, не имеющие соответствия слева (дополненные значениями NULL влево).


****************************************************************************
### Группировка, агрегатные (агрегирующе) функции
*
https://postgrespro.ru/docs/postgrespro/9.6/sql-select

Предложение GROUP BY
Необязательное предложение GROUP BY имеет общую форму

GROUP BY элемент_группирования [, ...]
GROUP BY собирает в одну строку все выбранные строки, выдающие одинаковые значения для выражений группировки. В качестве выражения внутри элемента_группирования может выступать имя входного столбца, либо имя или порядковый номер выходного столбца (из списка элементов SELECT), либо произвольное значение, вычисляемое по значениям входных столбцов. В случае неоднозначности имя в GROUP BY будет восприниматься как имя входного, а не выходного столбца.

Если в элементе группирования задаётся GROUPING SETS, ROLLUP или CUBE, предложение GROUP BY в целом определяет некоторое число независимых наборов группирования. Это даёт тот же эффект, что и объединение подзапросов (с UNION ALL) с отдельными наборами группирования в их предложениях GROUP BY. Подробнее использование наборов группирования описывается в Подразделе 7.2.4.

Агрегатные функции, если они используются, вычисляются по всем строкам, составляющим каждую группу, и в итоге выдают отдельное значение для каждой группы. (Если агрегатные функции используются без предложения GROUP BY, запрос выполняется как с одной группой, включающей все выбранные строки.) Набор строк, поступающих в каждую агрегатную функцию, можно дополнительно отфильтровать, добавив предложение FILTER к вызову агрегатной функции; за дополнительными сведениями обратитесь к Подразделу 4.2.7. С предложением FILTER на вход агрегатной функции поступают только те строки, которые соответствуют заданному фильтру.

Когда в запросе присутствует предложение GROUP BY или какая-либо агрегатная функция, выражения в списке SELECT не могут обращаться к негруппируемым столбцам, кроме как в агрегатных функциях или в случае функциональной зависимости, так как иначе в негруппируемом столбце нужно было бы вернуть более одного возможного значения. Функциональная зависимость образуется, если группируемые столбцы (или их подмножество) составляют первичный ключ таблицы, содержащей негруппируемый столбец.

Имейте в виду, что все агрегатные функции вычисляются перед «скалярными» выражениями в предложении HAVING или списке SELECT. Это значит, что например, с помощью выражения CASE нельзя обойти вычисление агрегатной функции; см. Подраздел 4.2.14.

В настоящее время указания FOR NO KEY UPDATE, FOR UPDATE, FOR SHARE и FOR KEY SHARE нельзя задать вместе с GROUP BY.


****************************************************************************
### Сортировка
*
https://postgrespro.ru/docs/postgrespro/9.6/sql-select

Предложение ORDER BY
Необязательное предложение ORDER BY имеет следующую общую форму:

ORDER BY выражение [ ASC | DESC | USING оператор ] [ NULLS { FIRST | LAST } ] [, ...]
Предложение ORDER BY указывает, что строки результата должны сортироваться согласно заданным выражениям. Если две строки дают равные значения для самого левого выражения, проверяется следующее выражение и т. д. Если их значения оказываются равными для всех заданных выражений, строки возвращаются в порядке, определяемом реализацией.

В качестве выражения может задаваться имя или порядковый номер выходного столбца (элемента списка SELECT), либо произвольное выражение со значениями входных столбцов.

Порядковым номером в данном случае считается последовательный номер (при нумерации слева направо) позиции выходного столбца. Возможность указать порядковый номер позволяет выполнить сортировку по столбцу, не имеющему уникального имени. В принципе это не абсолютно необходимо, так как выходному столбцу всегда можно присвоить имя, воспользовавшись предложением AS.

В предложении ORDER BY также можно использовать произвольные выражения, в том числе, и со столбцами, отсутствующими в списке результатов SELECT. Таким образом, следующий оператор вполне корректен:

SELECT name FROM distributors ORDER BY code;
Однако, если ORDER BY применяется к результату UNION, INTERSECT или EXCEPT, в нём можно задать только имя или номер выходного столбца, но не выражение.

Если в качестве выражения ORDER BY задано простое имя, которому соответствует и выходной, и входной столбец, то ORDER BY будет воспринимать его как имя выходного столбца. Этот выбор противоположен тому, что делает GROUP BY в такой же ситуации. Такая несогласованность допущена для соответствия стандарту SQL.

Дополнительно после любого выражения в предложении ORDER BY можно добавить ключевое слово ASC (по возрастанию) или DESC (по убыванию). По умолчанию подразумевается ASC. Кроме того, можно задать имя специфического оператора сортировки в предложении USING. Оператор сортировки должен быть членом «меньше» или «больше» некоторого семейства операторов B-дерева. ASC обычно равнозначно USING < и DESC обычно равнозначно USING >. (Хотя создатель нестандартного типа данных может определить по-другому порядок сортировки по умолчанию и поставить ему в соответствие операторы с другими именами.)

Если указано NULLS LAST, значения NULL при сортировке оказываются после значений не NULL; с указанием NULLS FIRST значения NULL оказываются перед значениями не NULL. Если не указано ни то, ни другое, по умолчанию подразумевается NULLS LAST при явно или неявно выбранном порядке ASC, либо NULLS FIRST при порядке DESC (то есть по умолчанию считается, что значения NULL больше значений не NULL). С предложением USING порядок NULL по умолчанию зависит от того, является ли указанный оператор оператором «меньше» или «больше».

Заметьте, что параметры сортировки применяются только к тому выражению, за которым они следуют; в частности, ORDER BY x, y DESC означает не то же самое, что ORDER BY x DESC, y DESC.

Данные символьных строк сортируются согласно правилу сортировки, установленному для сортируемого столбца. При необходимости это правило можно переопределить, добавив предложение COLLATE в выражение, например так: ORDER BY mycolumn COLLATE "en_US". За дополнительными сведениями обратитесь к Подразделу 4.2.10 и 


****************************************************************************
## ORM 


****************************************************************************
### CRUD операции
*

****************************************************************************
### связи между моделями
*

****************************************************************************
### миграции
*



****************************************************************************
### **Web**


****************************************************************************
#### get, post, option; body, query; http status
*


****************************************************************************
#### REST - принципы наименование методов, принцип stateless
*


****************************************************************************
### **GIT**


****************************************************************************
#### Как добавить файлы в коммит? Почему нельзя добавлять файлы по звезде или точке?
*


****************************************************************************
#### Пуш. Что такое фастфовард? Чем опасен пуш с форсом?
*


****************************************************************************
#### Ветвление. Как создать и удалить ветку, локально и в origin`е. Как привязать локальную ветку "a1" к удаленной ветке "b2", и пушить в нее?
*


****************************************************************************
#### Что такое мердж? Как его откатить?
*


****************************************************************************
#### Как перименовать коммит? Как удалить последний? Как удалить коммит из середины и запушить его? В каких случаях так можно делать, а в каких нет?
*

