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
        // Само-закрывающийся <тег />
        <br />
        // "color" это аттрибут
        <MyComponent color="red">
          // Содержимое Вашего компонента
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
      // Используйте синтаксис {что-то} для вставки JavaScript переменных в Ваши HTML теги
      // useContent() просто возвращает содержимое внутри Вашего компонента (в данном случае, "Мир")
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

There's two hooks made for heavy computations and other uses.

```jsx
var [num, setNum] = useState(0);

// Pretend this is a heavy computation
var value = (num ** 2);
```

We do not want to compute `value` on every render if the `num` didn't change.

```jsx
var [num, setNum] = useState(0);

// Pretend this is a heavy computation
var value = useMemo(() => (num ** 2), [num]);
```

A hook called `useMemo` will make the computation only if `num` did change. This way if the `num = 2` on the first render, and `num = 2` on the second render - it will not call the function again, but take the same value from memory.

Okay, but pretend this is a really heavy computation.

```jsx
var [num, setNum] = useState(0);

// Pretend this is a really heavy computation
var value = useCache(() => (num ** 2), [num]);
```

The `useCache` hook works the same as `useMemo`, but can store infinite amount of previous values.

1) `num = 2`, it computes the value.

2) `num = 2`, it takes value from memory.

3) `num = 3`, it computes the new value.

4) `num = 2`, and here `useMemo` will compute the value again, but `useCache` will go back and take the value from memory.

### Эффекты

Another useful hook is called an *effect*.

```jsx
useEffect(() => {
  // An effect function
}, [num]);
```

The `useEffect` works the same as `useMemo` - it will only call the function only if dependency array has changed.

But, there's also some differences to it:

1) `useEffect` doesn't return anything.

2) Effect is called only AFTER the render is done.

3) Effect can optionally return a clean-up function - this function calls before the effect gets called again.

```jsx
useEffect(() => {
  console.log(2);

  return () => {
    console.log(3);
  };
}, [num]);

console.log(1);
```

1) `num = 2`, in the first render `1` is printed to the console.

2) `2` is being printed to the console only after full render is done.

3) `num = 3` - num has changed, `3` is being printed to the console as effect is doing it's clean-up.

4) Then, `1` is being printed to the console.

5) After the render, `2` is being printed again.

### Accesing the element reference

Sometimes, you just want to do a simple:

```jsx
input.focus();
```

But you must get the `input` element first. And `useElement` can help with that.

> `useElement` is not a hook, so you can call it safely any amount of times.

```jsx
new class Root extends CatMagick.Component {
  render() {
    // We create a reference to that element
    var input = useElement();

    useEffect(() => {
      // After the render, we can focus the input using the reference we've made.
      // Don't forget: input is a reference and not an element, you must call it first - input()
      input().focus();
    }, []);

    // We must add the reference to "ref" attribute
    return <input type="text" ref={input} />;
  }
}
```

### Ре-рендер

Sometimes you just need to force a re-render. Normally `useState` will re-render the element after it's value been changed, but if your element relies on some external data source and it changed, you need to update the screen yourself.

```jsx
CatMagick.rerender();
```

This is as simple as calling a function.

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
