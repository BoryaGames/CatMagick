# 😺 CatMagick ✨
## *Самый мяу-чий фреймворк, за всё время*

![Сборка](https://github.com/BoryaGames/CatMagick/actions/workflows/test.yml/badge.svg)
![Участники](https://img.shields.io/github/contributors/BoryaGames/CatMagick)
![Чат в Discord](https://img.shields.io/discord/916772281747931198?logo=discord)

[[English]](./README.md) | **[Русский]**

CatMagick это фреймворк сделанный для создания вебсайтов легко (оба фронтэнд и бэкэнд!).

## Возможности

- UI компоненты как в [React](https://react.dev) позволяет Вам легко делать и изменять свою структуру UI используя JSX
- Передвижение между страницами без перезагрузки похожее на [ReactRouter](https://reactrouter.com)
- Добавляйте простые классы вместо создания CSS стилей, прямо как в [Tailwind](https://tailwindcss.com)
- Делайте API просто добавляя файлы в свои папки `routes` / `middleware`
- Легко используйте базу данных без знания любых SQL команд
- Не надо перезагружать свой сервер, он умеет встроенную функцию *горячего обновления*
- CatMagick так-же всегда поддерживает WebSocket соединение между Вашим фронтэндом и бэкэндом, что-бы Вы могли легко синхронизировать их
- ✨ Магия ✨

## Установка

CatMagick требует [Node.js](https://nodejs.org) для запуска.
Он работает на **v22.2.0**, но так-же будет работать и на некоторых других версиях.

Установите его в свой проект испольузя [реестр NPM](https://www.npmjs.com/package/catmagick).

```sh
# Установите последнюю стабильную версию
npm install catmagick

# Установите последнюю версию в разработке из открытого кода
npm install git+https://github.com/BoryaGames/CatMagick.git
```

Что-бы запустить свой проект, Вам необходимо лишь `require()` его.

```sh
# Сделайте это напрямую
node -e "require('catmagick')"

# Или создайте start.js файл вместо этого
echo "require('catmagick')" > start.js
node start.js
```

## Настройки

CatMagick требует `config.json` файл в корне Вашего проекта для запуска. В нём много разных настроек, но все они полностью необязательны.

```javascript
{
  "port": 80, // порт на котором слушать вебсервер, по умолчанию автоопределение
  "domain": "example.com", // домен Вашего вебсайта, по умолчанию без домена
  "proxies": 1, // количество прокси перед Вашим вебсайтом (например, CloudFlare), необходимо что-бы правильно определять IP-адреса под прокси
  "sslProxy": true, // если Ваш сайт работает на http, но какой-либо прокси (например, CloudFlare) добавляет SSL в середине, поставьте эту настройку на true
  "logRequests": true, // записывать-ли все запросы в консоль, по умолчанию true
  "logWebSocket": true, // записывать-ли все подключения или отключения к WebSocket в консоль, по умолчанию true
  "hotReload": true, // автоматически замечать изменения в Ваших routes или databases и делать частичную перезагрузку, по умолчанию true
  "sourceMaps": true, // нужно-ли CatMagick добавлять исходные карты после превращения .jsx файлов в .js, по умолчанию true
  "database": true, // необходима-ли Вам база данных в Вашем проекте, по умолчанию false
  "databaseType": "sqlite", // какую базу данных Вы хотите, sqlite самый лёгкий вариант для настройки новичкам, по умолчанию sqlite, Вы должны установить модуль Вашей базы данных что-бы она работала
  "databaseFile": "database.db", // если Вы используете sqlite, в какой файл он должен сохранять, по умолчанию database.db
  "sessionSecret": "p2ssw0rd!", // если Вашему проекту нужны сессии для авторизации пользователя, придумайте сложный пароль для их шифрования, по умолчанию без сессий
  "secureCookie": false // должны-ли Ваши куки быть HTTPS, по умолчанию true, отключите это при использовании HTTP, или Ваши сессии могут не работать
}
```

## Использование

### Первый компонент

После того как Вы сделали свой `config.json`, создайте папки `routes` и `middleware`, а если Вы используете базу данных - Вам так-же нужно создать папку `databases`.

Теперь, перейдите в Вашу папку `routes` и просто добавьте `index.html` в неё, запустите свой проект и перейдите на свой сайт - Вы увидите свой HTML там.

Это может показаться как обычный HTML, но CatMagick уже встроил себя в него.

А теперь, добавьте `<script src="/app.jsx"></script>` в Ваш HTML и перейдите в новый файл `app.jsx` в Вашей папке `routes`.

По умолчанию, CatMagick отображает компонент под названием `Root`, так-что давайте сделаем его:

```jsx
new class Root extends CatMagick.Component {
  render() {
    return <h1>Мяу!</h1>;
  }
}
```

Теперь Вы увидите этот `<h1>` на Вашем вебсайте - это означает CatMagick работает! :tada:

### Создание нескольких компонентов

```jsx
new class Root extends CatMagick.Component {
  render() {
    return (
      // Используйте пустой тег <>что-то</> для объединения нескольких компонентов в один главный компонент
      <>
        <h1>Мяу!</h1>
        {/* Само-закрывающийся <тег /> */}
        <br />
        {/* "color" это аттрибут */}
        <MyComponent color="red">
          {/* Содержимое Вашего компонента */}
          Мир
        </MyComponent>
      </>
    );
  }
}

// Ваш компонент
new class MyComponent extends CatMagick.Component {
  render() {
    // Для добавления пользовательских CSS стилей, самый лёгкий способ это использование аттрибута "style", и его значение это JavaScript объект
    // useAttribute(название) просто возвращает значение аттрибута
    return <p style={{
      "color": useAttribute("color")
    }}>
      {/* Используйте синтаксис {что-то} для вставки JavaScript переменных в Ваши HTML теги */}
      {/* useContent() просто возвращает содержимое внутри Вашего компонента (в данном случае, "Мир") */}
      Привет, {useContent()}!
    </p>;
  }
}
```

### Режим отладки

При отладке, *режим отладки* может быть полезной функцией Вам.

```jsx
// Включение режима отладки
CatMagick.debug = true;

new class Root extends CatMagick.Component {
  render() {
    return <h1>Мяу!</h1>;
  }
}
```

Режим отладки будет выводить дополнительные логи в консоль: когда происходит рендер, сколько времени он занял, состояние WebSocket, логи роутера и другое.

### Сохранение состояния

Давайте сделаем простую страницу с тремя кнопками используя пользовательские компоненты.

```jsx
new class Root extends CatMagick.Component {
  render() {
    return (
      <>
        <MyButton /> <MyButton /> <MyButton />
      </>
    );
  }
}

new class MyButton extends CatMagick.Component {
  render() {
    function btnClicked() {
      // Нужно увеличить количество нажатий
    }

    // "click" это аттрибут что-бы слушать событие нажатия
    return <button click={btnClicked}>Нажатий: 0</button>;
  }
}
```

Мы хотим видеть количество нажатий на кнопке. Давайте попробуем что-нибудь:

```jsx
new class MyButton extends CatMagick.Component {
  render() {
    var clicks = 0;

    function btnClicked() {
      clicks++;
    }

    return <button click={btnClicked}>Нажатий: {clicks}</button>;
  }
}
```

Не-а, переменная `clicks` сбрасывается обратно до 0 на каждом рендере, так-как она внутри функции `render()`. Может-быть поставим её снаружи?

```jsx
var clicks = 0;

new class MyButton extends CatMagick.Component {
  render() {
    function btnClicked() {
      clicks++;
    }

    return <button click={btnClicked}>Нажатий: {clicks}</button>;
  }
}
```

Ну, у нас всё ещё две проблемы:

1) Мы имеем любое количество кнопок (например, здесь 3), но только одну переменную.

2) Даже изменяя переменную `clicks`, мы не обновляем данные на экране, так-что пользователь не видит новое число.

Лучший способ исправить их используя *крюк* под названием `useState`.

```jsx
new class MyButton extends CatMagick.Component {
  render() {
    // "clicks" это сама переменная здесь, но что-бы изменять её мы используем сеттер под названием "setClicks", и 0 это значение нашей переменной
    var [clicks, setClicks] = useState(0);

    function btnClicked() {
      // Мы увеличиваем нашу переменную
      setClicks(clicks + 1);
    }

    return <button click={btnClicked}>Нажатий: {clicks}</button>;
  }
}
```

Этот *крюк* автоматически сохранит всё, он работает с несколькими копиями компонента и автоматически обновляет экран!

> ⚠️ Крюк - это функция которая должна вызываться в одинаковое время и одинаковое количество раз каждый рендер.
> ```jsx
>   if (какоелибоУсловие) {
>     var [clicks, setClicks] = useState(0);
>   }
> ```
> Этот крюк может-быть вызван 0 или 1 раз в зависимости от условия, это **НЕПРАВИЛЬНОЕ** использование и может привести к не сохранению Вашей переменной или замене других переменных.

### Сохранение тяжёлых вычислений

Существует два крюка созданные для тяжёлых вычислений и других использований.

```jsx
var [num, setNum] = useState(0);

// Представьте что это тяжёлое вычисление
var value = (num ** 2);
```

Мы не хотим считать `value` на каждом рендере если `num` не изменился.

```jsx
var [num, setNum] = useState(0);

// Представьте что это тяжёлое вычисление
var value = useMemo(() => (num ** 2), [num]);
```

Крюк под названием `useMemo` сделает вычисление только если `num` изменился. Таким образом, если `num = 2` на первом рендере, и `num = 2` на втором рендере - оно не будет вызывать функцию снова, а возьмёт то-же значение из памяти.

Окей, но представьте что это очень тяжёлое вычисление.

```jsx
var [num, setNum] = useState(0);

// Представьте что это очень тяжёлое вычисление
var value = useCache(() => (num ** 2), [num]);
```

Крюк `useCache` работает так-же, как и `useMemo`, но может хранить бесконечное количество предыдущих значений.

1) `num = 2`, он считает значение.

2) `num = 2`, он берёт значение из памяти.

3) `num = 3`, он считает новое значение.

4) `num = 2`, и здесь `useMemo` посчитает значение снова, а `useCache` вернётся назад и возьмёт его из памяти.

### Эффекты

Ещё один полезный крюк называется *эффектом*.

```jsx
useEffect(() => {
  // Эффект-функция
}, [num]);
```

`useEffect` работает так-же, как и `useMemo` - он вызовет функцию только если массив зависимостей изменился.

Но, существуют некоторые его отличия:

1) `useEffect` ничего не возвращает.

2) Эффект вызывается только ПОСЛЕ того, как рендер был сделан.

3) Эффект может вернуть необязательную функцию очистки - это функция, которая вызывается перед следующим вызовом эффекта.

```jsx
useEffect(() => {
  console.log(2);

  return () => {
    console.log(3);
  };
}, [num]);

console.log(1);
```

1) `num = 2`, на первом рендере `1` пишется в консоль.

2) `2` пишется в консоль только после того, как полный рендер был закончен.

3) `num = 3` - num изменился, `3` пишется в консоль так-как прошлый эффект делает свою очистку.

4) Затем, `1` пишется в консоль.

5) После рендера, `2` снова пишется в консоль.

### Получение ссылки на элемент

Иногда, Вы просто хотите сделать простой фокус:

```jsx
input.focus();
```

Но мы должны сначала получить элемент `input`. И `useElement` может с этим помочь.

> `useElement` это не крюк, так-что Вы можете вызывать его безопасно любое количество раз.

```jsx
new class Root extends CatMagick.Component {
  render() {
    // Мы создаём ссылку на элемент
    var input = useElement();

    useEffect(() => {
      // После рендера, мы можем фокусировать поле используя ссылку, которую мы сделали.
      // Не забываем: input это просто ссылка, а не элемент, мы должны сначала вызвать её для получения элемента - input()
      input().focus();
    }, []);

    // Мы добавляем ссылку в аттрибут "ref"
    return <input type="text" ref={input} />;
  }
}
```

### Ре-рендер

Иногда Вам необходимо сделать обязательный ре-рендер. Обычно, `useState` сделает ре-рендер элемента после того, как его значение было изменено, но если Ваш компонент зависит на каком-либо внешнем источнике информации и он изменился, Вам необходимо обновить экран самому.

```jsx
CatMagick.rerender();
```

Это так-же просто, как вызов функции.

### Роутер

Your application can be multi-page, but transition between them is not really fast.

```jsx
CatMagick.goto("/login");
```

This is the simplest use of CatMagick's router - it will automatically do a GET request to that page, do a clean-up for all current effects and replace current HTML with that page.

Sometimes, this just doesn't work correctly or you want to be even faster.

```jsx
new class Main extends CatMagick.Component {
  render() {
    return (
      <>
        <h1>This is the main page.</h1>
        <br />
        // CatMagick.handleLink is a function that automatically replaces your <a> link with CatMagick.goto(href)
        <a href="/login" click={CatMagick.handleLink}>Go to login</a>
      </>
    );
  }
}

new class Login extends CatMagick.Component {
  render() {
    return (
      <>
        <h1>This is the login page.</h1>
      </>
    );
  }
}

CatMagick.route("/", "Main");
CatMagick.route("/login", "Login");
```

Router will handle fast transition to that link and also browser's back/forward buttons.

### *ДОКУМЕНТАЦИЯ В ПРОГРЕССЕ*
