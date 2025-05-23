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
- Добавляйте простые классы вместо создания CSS стилей, прямо как в [Tailwind](https://tailwindcss.com) или [Atomizer](https://acss-io.github.io/atomizer)
- Делайте API просто добавляя файлы в свои папки `routes` / `middleware`
- Легко используйте базу данных без знания любых SQL команд
- Не надо перезагружать свой сервер, он умеет встроенную функцию *горячего обновления*
- Автоматический откат на рабочую версию при синтаксической ошибке
- CatMagick так-же всегда поддерживает WebSocket соединение между Вашим фронтэндом и бэкэндом, что-бы Вы могли легко синхронизировать их
- Легко интегрируйте [reCAPTCHA](https://developers.google.com/recaptcha/intro), [hCaptcha](https://www.hcaptcha.com) или [Turnstile](https://developers.cloudflare.com/turnstile) в Ваш вебсайт
- Делайте анимации легко используя [View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API)
- Пишите оба фронтэнд и бэкэнд в одном файле не переживая о соединении между ними
- Автоматически сжимать Ваш код для уменьшения размера файла и времени загрузки
- Возможность запускаться на очень старых версиях [Node.js](https://nodejs.org)
- ✨ Магия ✨

## Установка

CatMagick требует [Node.js](https://nodejs.org) для запуска. Минимальная версия NodeJS зависит от Вашей цели использования - CatMagick может работать на очень старых версиях если отключить некоторые функции.

CatMagick Плюс (полные функции): **v16.0.0+**

CatMagick (нет базы данных): **v14.18.0+**

CatMagick Мини (нет базы данных, нет горячего обновления): **v9.11.0+**

Установите его в свой проект с [реестра NPM](https://www.npmjs.com/package/catmagick) используя менеджер пакетов: [NPM](https://www.npmjs.com), [Yarn](https://yarnpkg.com) или [PNPM](https://pnpm.io).

```sh
# Установите последнюю стабильную версию с реестра NPM используя NPM
npm install catmagick

# Установите последнюю стабильную версию с реестра NPM используя Yarn
yarn add catmagick

# Установите последнюю стабильную версию с реестра NPM используя PNPM
pnpm add catmagick
```

Или установите последнюю бета-версию в Ваш проект с [GitHub](https://github.com/BoryaGames/CatMagick) используя менеджер пакетов: [NPM](https://www.npmjs.com), [Yarn](https://yarnpkg.com) или [PNPM](https://pnpm.io).

```sh
# Установите последнюю бета версию с GitHub используя NPM
npm install git+https://github.com/BoryaGames/CatMagick.git

# Установите последнюю бета версию с GitHub используя Yarn
yarn add git+https://github.com/BoryaGames/CatMagick.git

# Установите последнюю бета версию с GitHub используя PNPM
pnpm add https://github.com/BoryaGames/CatMagick.git
```

Что-бы запустить свой проект, Вам необходимо лишь `require()` его.

```sh
# Сделайте это напрямую
node -e "require('catmagick')"

# Или создайте start.js файл вместо этого
echo require('catmagick') > start.js
node start.js
```

## Настройки

CatMagick требует `config.json` файл в корне Вашего проекта для запуска. В нём много разных настроек, но все они полностью необязательны.

```javascript
{
  "web": {
    "port": 80, // порт на котором слушать вебсервер, по умолчанию автоопределение
    "domain": "example.com", // домен Вашего вебсайта, по умолчанию без домена
    "proxies": 1, // количество прокси перед Вашим вебсайтом (например, CloudFlare), необходимо что-бы правильно определять IP-адреса под прокси
  },
  "SSL": {
    "enabled": true, // нужно-ли Вашему сайту работать на https
    "proxy": true, // если Ваш вебсайт не имеет своих файлов сертификата и ключа, но какой-либо прокси (например, CloudFlare) добавляет SSL в середине, поставьте эту настройку на true, убедитесь что enabled тоже true что-бы это работало
    "cert": "cert.pem", // если у Вашего вебсайта включён SSL и прокси не используется, Вам необходимо указать файл сертификата, по умолчанию cert.pem
    "key": "key.pem" // если у Вашего вебсайта включён SSL и прокси не используется, Вам необходимо указать файл ключа сертификата, по умолчанию key.pem
  },
  "logs": {
    "requests": true, // записывать-ли все запросы в консоль, по умолчанию true
    "WebSocket": true, // записывать-ли все подключения или отключения к WebSocket в консоль, по умолчанию true
  },
  "database": {
    "enabled": true, // необходима-ли Вам база данных в Вашем проекте, по умолчанию false
    "databaseType": "sqlite", // какую базу данных Вы хотите, sqlite самый лёгкий вариант для настройки новичкам, по умолчанию sqlite, Вы должны установить модуль Вашей базы данных что-бы она работала
    "databaseFile": "database.db" // если Вы используете sqlite, в какой файл он должен сохранять, по умолчанию database.db
  },
  "features": {
    "sourceMaps": true, // нужно-ли CatMagick добавлять исходные карты после превращения .jsx файлов в .js, по умолчанию true
    "SSR": true, // нужно-ли включить поддержку рендера с сервера, по умолчанию false
    "minify": true // нужно-ли сжимать JSX файлы для уменьшения размера файла и времени загрузки
  },
  "hotReload": {
    "routes": true, // автоматически замечать изменения в Ваших путях и делать частичное обновление, по умолчанию true
    "middleware": true, // автоматически замечать изменения в Ваших посредниках и делать частичное обновление, по умолчанию true
    "database": true, // автоматически замечать изменения в Ваших базах данных и делать частичное обновление, по умолчанию true
    "events": true, // автоматически замечать изменения в Ваших событиях и делать частичное обновление, по умолчанию true
    "config": true // автоматически замечать изменения в Ваших настройках и делать частичное обновление, по умолчанию true, некоторые части (например порт на котором слушать вебсервер) не могут-быть изменены и требуют полную перезагрузку вручную
  },
  "sessions": {
    "secret": "p2ssw0rd!", // если Вашему проекту нужны сессии для авторизации пользователя, придумайте сложный пароль для их шифрования, по умолчанию без сессий
    "secureCookie": false // должны-ли Ваши куки быть https, по умолчанию true, отключите это при использовании HTTP, или Ваши сессии могут не работать
  },
  "captcha": {
    "enabled": true, // нужна-ли Вам captcha в Вашем вебсайте, по умолчанию false
    "provider": "recaptcha", // провайдер captchar - recaptcha/hcaptcha/turnstile, по умолчанию recaptcha
    "siteKey": "12345", // Ваш ключ сайта captcha, по умолчанию отсутствует
    "secretKey": "54321" // Ваш секретный ключ captcha, по умолчанию отсутствует
  }
}
```

## Использование

### Первый компонент

После того как Вы сделали свой `config.json`, создайте папки `routes`, `middleware` и `events`, а если Вы используете базу данных - Вам так-же нужно создать папку `databases`.

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

> ⚠️ Если Вы сделаете синтаксическую ошибку в JSX файле, ошибка будет написана в консоль сервера и клиент получит старую версию без ошибки и она не повлияет на Ваших пользователей.
> Пока это может показаться полезной функцией, Вы можете быть в замешательстве почему Ваш код не обновился, если Вы не используете IDE и не смотрите в консоль сервера.

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
  // Читайте аттрибуты из аргумента
  render({ color }) {
    // Для добавления пользовательских CSS стилей, самый лёгкий способ это использование аттрибута "style", и его значение это JavaScript объект
    return <p style={{
      "color": color
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

3) `num = 3` - num изменился, `3` пишется в консоль так-как предыдущий эффект делает свою очистку.

4) Затем, `1` пишется в консоль.

5) После рендера, `2` снова пишется в консоль.

### Ссылки

Иногда, Вы просто хотите сделать простой фокус:

```jsx
input.focus();
```

Но мы должны сначала получить элемент `input`. И *ссылка* может с этим помочь.

> `useReference` это не крюк, так-что Вы можете вызывать его безопасно любое количество раз.

```jsx
new class Root extends CatMagick.Component {
  render() {
    // Мы создаём ссылку
    var input = useReference();

    useEffect(() => {
      // После рендера, мы можем фокусировать поле используя ссылку, которую мы сделали.
      // Не забываем: input это просто ссылка, а не элемент, мы должны сначала вызвать её для получения элемента - input()
      input().focus();

      // Кстати, ref.displayData() это сокращение для ref().getBoundingClientRect()
      console.log(input.displayData());
    }, []);

    // Мы добавляем ссылку в аттрибут "ref"
    return <input type="text" ref={input} />;
  }
}
```

Так-же, Вы можете использовать ссылки что-бы передать какое-либо значение в родительский компонент.

```jsx
new class Root extends CatMagick.Component {
  render() {
    var test = useReference();

    useEffect(() => {
      console.log(test()); // -> 5
    }, []);

    return <Child test={test} />;
  }
}

new class Child extends CatMagick.Component {
  render({ test }) {
    // Установить значение на 5
    test.set(5);

    return <p>Привет, Мир!</p>;
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

Ваш вебсайт может-быть мульти-страничным, но переход между ними не особо быстрый.

```jsx
CatMagick.goto("/login");
```

Это самое простое использование роутера CatMagick - он автоматически сделает GET запрос на ту страницу, сделает полную очистку для всех текущих эффектов и заменит текущий HTML на ту страницу.

Иногда, это просто не работает правильно или Вы хотите быть ещё быстрее - тогда Вы можете соединить несколько страниц в одну страницу.

```jsx
new class Main extends CatMagick.Component {
  render() {
    return (
      <>
        <h1>Это главная страница.</h1>
        <br />
        // CatMagick.handleLink это функция которая автоматически заменяет Вашу <a> ссылку на CatMagick.goto(href)
        <a href="/login" click={CatMagick.handleLink}>Перейти на вход</a>
      </>
    );
  }
}

new class Login extends CatMagick.Component {
  render() {
    return (
      <>
        <h1>Это страница входа.</h1>
      </>
    );
  }
}

CatMagick.route("/", "Main");
CatMagick.route("/login", "Login");
```

Роутер автоматичвски займётся быстрым переходим на ту страницу, а так-же кнопками назад/вперёд браузера.

Первый аргумент в методе `.route` это путь, но на самом деле Вы можете использовать шаблоны вместо указывания точного пути.

`/users/12345` - точный путь

`/users/$` - подходит что-угодно (`/users/12345`, `/users/54321`, `/users/cat`)

`/users/$id` - подходит что-угодно, но сохранить это как `id` (который Вы можете использовать позже)

`/users/$$` - подходит что-угодно, включая пути глубже (`/users/12345`, `/users/54321/send`, `/users/cat/edit/confirm`)

`/$?` - используйте знак вопроса что-бы сделать это необязательным (`/`, `/home`, `/download`)

`/$$?` - Вы так-же можете использовать знак вопроса и здесь тоже (`/`, `/home`, `/download/windows`)

Если Вы хотите получить текущий путь и его дополнительную информацию - вызовите `useLocation()` (не крюк).

```jsx
new class UserPage extends CatMagick.Component {
  render() {
    var location = useLocation();

    // Текущая ссылка http://localhost/users/12345?show_servers=true#bio

    console.log(location.pathname); // -> /users/12345
    console.log(location.search); // -> ?show_servers=true
    console.log(location.hash); // -> #bio
    console.log(location.params.id); // -> 12345
  }
}

CatMagick.route("/users/$id", "UserPage");
```

### Компонент Activity

Иногда Вы хотите убрать компонент с экрана, но сохранить его текущее состояние. Или может-быть Вы хотите отрендерить компонент заранее в фоне без показа его на экране.

```jsx
new class Root extends CatMagick.Component {
  render() {
    var [show, setShow] = useState(true);

    return (
      <center>
        <div style={{
          "display": show ? "block" : "none"
        }}>
          <Counter />
        </div>
        <br /><br />
        <button click={() => setShow(!show)}>Показать / Скрыть</button>
      </center>
    );
  }
}

new class Counter extends CatMagick.Component {
  render() {
    var [count, setCount] = useState(0);

    return <button click={() => {
      setCount(count + 1);
    }}>Счёт: {count}</button>;
  }
}
```

Это будет работать, но даже не смотря на то, что элемент имеет `display: none;` в CSS, он всё-ещё в DOM и браузер будет рендерить его в фоне, так-что давайте заменим его на `Activity`.

```jsx
new class Root extends CatMagick.Component {
  render() {
    var [show, setShow] = useState(true);

    return (
      <center>
        <Activity show={show}>
          <Counter />
        </Activity>
        <br /><br />
        <button click={() => setShow(!show)}>Показать / Скрыть</button>
      </center>
    );
  }
}
```

Теперь, когда `show = false`, компонент полностью удалится из DOM, но его функция `render()` всё ещё будет вызвана, а его состояние сохранится и его эффекты будут работать.

### Ключи

Посмотрите на этот код:

```jsx
new class Root extends CatMagick.Component {
  render() {
    var [swap, setSwap] = useState(false);

    return (
      <center>
        {swap ? <div>
          <input type="text" placeholder="Поле 2" />
          <input type="text" placeholder="Поле 1" />
        </div> : <div>
          <input type="text" placeholder="Поле 1" />
          <input type="text" placeholder="Поле 2" />
        </div>}
        <br /><br />
        <button click={() => setSwap(!swap)}>Поменять местами</button>
      </center>
    );
  }
}
```

При нажатии кнопки мы меняем местами поля ввода, но состояние компонентов работает на основе позиции. Вы можете увидеть поля меняются местами (их `placeholder` меняется местами), но текст внутри поля остаётся в той-же позиции. Вы можете решить это используя ключи:

```jsx
new class Root extends CatMagick.Component {
  render() {
    var [swap, setSwap] = useState(false);

    return (
      <center>
        {swap ? <div>
          <input type="text" placeholder="Поле 2" key="myinput2" />
          <input type="text" placeholder="Поле 1" key="myinput1" />
        </div> : <div>
          <input type="text" placeholder="Поле 1" key="myinput1" />
          <input type="text" placeholder="Поле 2" key="myinput2" />
        </div>}
        <br /><br />
        <button click={() => setSwap(!swap)}>Поменять местами</button>
      </center>
    );
  }
}
```

Теперь, CatMagick понимает что поля ввода были изменены местами и сделает это более эффективно, в это-же время меняя местами состояние.

```jsx
new class Root extends CatMagick.Component {
  render() {
    var [swap, setSwap] = useState(false);

    return (
      <center>
        {swap ? <div>
          <Counter key="mycounter2" />
          <Counter key="mycounter1" />
        </div> : <div>
          <Counter key="mycounter1" />
          <Counter key="mycounter2" />
        </div>}
        <br /><br />
        <button click={() => setSwap(!swap)}>Поменять местами</button>
      </center>
    );
  }
}

new class Counter extends CatMagick.Component {
  render({ key }) {
    var [count, setCount] = useState(0);

    return <button click={() => setCount(count + 1)} key={key}>
      Счёт: {count}
    </button>;
  }
}
```

Этот код с пользовательским компонентом так-же работает, но маленько по-другому изнутри. Оба счётчика рендерятся 2 раза в одно и то-же время:

1. Обычный рендер

2. CatMagick видит что состояние нужно поменять местами

3. CatMagick делает *миграцию состояния*

4. Второй рендер с верным состоянием

### Анимации

Вы можете использовать встроенный компонент `<Animation>` для создания анимаций:

```jsx
new class Root extends CatMagick.Component {
  render() {
    var [blue, setBlue] = useState(false);
    var [hidden, setHidden] = useState(false);

    return (
      <center>
        <br />
        <Animation>
          {!hidden && <div style={{
            "backgroundColor": blue ? "blue" : "red"
          }}></div>}
        </Animation>
        <br /><br />
        <button click={() => setBlue(!blue)}>Сменить цвет</button>
        <br />
        <button click={() => setHidden(!hidden)}>Показать / Скрыть</button>
      </center>
    );
  }
}
```

Просто завернув Ваш(и) элемент(ы) в этот компонент, он будет показываться, скрываться, изменять цвет, двигаться и т. д. плавно.

> ⚠️ Анимации на данный момент не работают в Firefox, так-как он не поддерживает [View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API).

Вы можете настраивать анимации:

```jsx
        <Animation animation="slow-fade">
          {!hidden && <div style={{
            "backgroundColor": blue ? "blue" : "red"
          }}></div>}
        </Animation>
```

```css
::view-transition-old(.slow-fade) {
  animation-duration: 500ms;
}

::view-transition-new(.slow-fade) {
  animation-duration: 500ms;
}
```

В случае, если Вы двигаете элемент, Вы так-же должны добавить уникальный аттрибут `name` в анимацию - таким образом браузер найдёт позицию элемента после его движения. Или в случае, если Вы анимируете список, убедитесь что так-же используете аттрибуты `name` и `key`.

### Объяснение сервера

Вы добавляете свои пути в папку `routes`, но так-же как и в роутере клиента Вы можете использовать шаблоны здесь тоже, но они более ограничены.

Сервер поддерживает папку `$` для чего-угодно и `$id` для его сохранения для будущего использования.

Мы только сделали пути клиента, но как сделать API пути? Вам просто надо создать файл `_route.js` в папке Вашего пути.

Давайте создадим файл `routes/users/$id/_route.js`:

```javascript
// Мы получили GET запрос на этот путь
exports.get = (req, res) => {
  // Прочитать сохранённый $id из URL
  console.log(req.params.id); // -> 12345

  // Ответить используя JSON
  res.json({
    "username": "test"
  });
};

// Мы получили POST запрос на этот путь
exports.post = (req, res) => {
  // Установить статус код
  res.status(418);

  // Ответить используя текст
  res.end("Привет, Мир!");
};
```

Затем, давайте создадим *посредник* - это код который выполняется на каждом запросе и каждом методе, и может прервать запрос до того как путь даже вызовется. Создайте файл в папке `middlewares` с любым названием что Вы хотите.

```javascript
// Функция-посредник
module.exports = (req, res) => {
  // Если айпи-адрес совпадает, ответить ошибку и остановить путь от запуска
  if (req.ip == "123.45.6.78") {
    res.status(403);
    res.end("Доступ Запрещён!");
    return false;
  }

  // Иначе, давайте запишем айпи-адрес запроса и продолжим путь как обычно
  console.log("Запрос от", req.ip);
  return true;
};
```

> Посредники могут быть асинхронными - запрос будет ждать пока посредник закончит.

Все Ваши пути и посредники могут автоматически обновлены при изменении, если горячее обновление включено в настройках.

В случае, если запрошенный путь не существует, CatMagick ответит 404. Если запрошенный путь существует, но запрошенный метод нет, CatMagick ответит 405. Если запрошенный путь существует, но не удался из-за ошибки, она будет отправлена в консоль и CatMagick ответит 500.

Если Вы хотите сделать свой дружелюбный дизайн для ошибок, Вы можете добавить файлы `400.html`, `404.html`, `405.html`, `500.html` в корень проекта.

### WebSocket

Давайте сделаем приложение чата в реальном времени.

```jsx
new class Root extends CatMagick.Component {
  render() {
    // Мы сохраним сообщения в состоянии
    var [messages, setMessages] = useState([]);

    // Ссылка нужна что-бы получить текст из поля ввода
    var input = useElement();

    useEffect(() => {
      fetch("/api/messages").then(res => res.json()).then(res => {
        // Мы получили список сообщений с сервера
        setMessages(messages);
      });
    }, []);

    function sendMessage() {
      // Прочитать текст с поля ввода и очистить поле ввода
      var content = input().value;
      input().value = "";

      // Этот метод как обычный fetch() браузера, но так-же принимает JSON в body
      CatMagick.fetch("/api/messages", {
        "method": "POST",
        "body": { content }
      });
    }

    return (
      <center>
        <br />
        <h1>Чат</h1>
        <br />
        {messages.map(message => <p>{message}</p>)}
        <br /><br />
        <input type="text" ref={input} placeholder="Текст..."> <button click={sendMessage}>Отправить</button>
      </center>
    );
  }
}
```

```javascript
var messages = [];

exports.get = (req, res) => {
  res.json(messages);
};

exports.post = (req, res) => {
  // Проверить содержимое
  if (!req.body.content) {
    res.status(400);
    return res.end("Вы должны указать содержимое.");
  }

  messages.push(req.body.content);
  res.status(204);
  res.end();
};
```

Окей, но нам надо как-то обновить страницу для каждого пользователя с новым сообщением без её обновления, мы можем использовать крюк `useEvent` на клиенте и `dispatchEvent` на сервере для этого.

```javascript
// Сервер
CatMagick.dispatchEvent("NEW_MESSAGE", req.body.content);
```

```jsx
// Клиент
useEvent("MESSAGE_CREATE", content => {
  // Добавить новое сообщение в массив
  setMessages([...messages, content]);
});
```

Пока это работает отлично, это можно улучшить использованием WebSocket и для отправки сообщений тоже:

```jsx
// Отправить с клиента
dispatchEvent("SEND_MESSAGE", content);
```

Для принятия событий на сервере, создайте файл `/events/SEND_MESSAGE.js`:

```javascript
module.exports = (content, client) => {
  // Добавить сообщение в список
  messages.push(content);

  // Обновить сообщения для всех пользователей
  CatMagick.dispatchEvent("NEW_MESSAGE", content);

  // Кстати, Вы можете использовать переменную client для хранения информации о клиенте
  // Этот клиент авторизован как пользователь 123
  client.user = 123;
  // Мы можем отправлять события на основе условия: отправить только всем клиентам авторизованным как пользователь 123
  CatMagick.dispatchEvent("TEST", messages, client => client.user == 123);
};
```

### База данных

Давайте улучшим прошлое приложение чата использованием базы данных вместо массива в памяти. Начните с настройки Вашего конфига, что-бы включить базу данных.

Теперь, Вам надо создать схемы базы данных - создайте файл `/databases/Message.js`:

```javascript
module.exports = CatMagick.createDatabase({
  "id": CatMagick.wholeNumber,
  "content": CatMagick.unlimitedText
});
```

Вам необходимо указать все данные что Вы хотите хранить - мы просто хотим хранить содержимое сообщения. Но в базе данных всё должно иметь уникальные данные - так-что убедитесь что первое войство будет уникальным идентификатором - оно может иметь любое название и тип, но должно быть первым.

Теперь, поговорим о типах:

`CatMagick.wholeNumber` - целое число, которое не имеет дробную часть (пример: `34`)

`CatMagick.floatingNumber` - число, которое может иметь дробную часть (пример: `34.7`)

`CatMagick.unlimitedText` - любая строка (пример: `"CatMagick"`)

`CatMagick.limitedText(300)` - строка с лимитом её длины, что-бы хранить её более эффективно (пример: `"CatMagick"`)

`CatMagick.boolean` - логическое значение (пример: `false`, `true`)

Время использовать нашу новую базу данных в действии, давайте отредактируем путь получения всех сообщений:

```javascript
exports.get = async (req, res) => {
  // Используем базу данных
  var Message = CatMagick.useDatabase("Message");

  // Получить все сообщения
  var messages = await Message.get();

  // Ответить списком сообщений
  res.json(messages);
};
```

> Метод `.get` принимает условия как аргумент, если Вы хотите получить все сообщения с определённым содержимым Вы можете сделать `await Message.get({ "content": "Тест" })`.

Теперь, отредактируем событие нового сообщения:

```javascript
module.exports = (content, client) => {
  // Используем базу данных
  var Message = CatMagick.useDatabase("Message");

  // Добавить новое сообщение
  await Message.add({ content });

  // Обновить сообщения для всех пользователей
  CatMagick.dispatchEvent("NEW_MESSAGE", content);
};
```

> Так-как `id` это целое число, оно может-быть авто-сгенерировано, так-что Вам не надо указывать его при добавлении новых данных в базу данных.
> Если Ваше уникальное свойство не целое число, убедитесь что указываете уникальный идентификатор при добавлении новых данных.

И несколько полезных методов:

```javascript
// Удалить из базы данных
await Message.delete({
  "id": 34
});

// Удалить всё
await Message.delete();

// Получить все сообщения
var messages = await Message.get();

// Получить одно сообщение (getOne возвращает один объект вместо массива)
var msg = await Message.getOne({
  "id": 7
});

// Отредактировать третье сообщение
await messages[2].edit({
  "content": "Новое содержимое!"
});

// Удалить первое сообщение
await messages[0].delete();
```

### Отношения базы данных

Давайте представим что у Вас есть база данных User:

```javascript
module.exports = CatMagick.createDatabase({
  "id": CatMagick.wholeNumber,
  "username": CatMagick.limitedText(255)
});
```

Сообщение имеет автора, который является User - Вы можете хранить его ID, но Вам надо вручную получать User каждый раз, когда он Вам нужен.

```javascript
var User = require("./User.js");

module.exports = CatMagick.createDatabase({
  "id": CatMagick.wholeNumber,
  "author": User,
  "content": CatMagick.unlimitedText
});
```

Но Вы можете делать отношения вот так - просто укажите другую базу данных как тип.

```javascript
var cat = await User.getOne({
  "id": 123
});

await Message.add({
  "author": cat,
  "content": "Тест"
});
```

Мы только-что сохранили автора сообщения в базу данных. Теперь, когда Вы его получите, он будет уже User:

```javascript
var msg = await Message.getOne({
  "id": 7
});

console.log(msg.author.id); // 123
console.log(msg.author.username); // cat
```

### Captcha

Защитите свой вебсайт от ботов используя *CAPTCHA* - для начала, настройте её в настройках. Затем, просто добавьте компонент `<Captcha />` в Ваш вебсайт:

```jsx
new class Root extends CatMagick.Component {
  render() {
    var getToken = useReference();

    return (
      <center>
        <br />
        <br />
        <Captcha getToken={getToken} />
        <br />
        <br />
        <button click={() => {
          CatMagick.fetch("/send", {
            "method": "POST",
            "body": {
              "captcha": getToken()()
            }
          });
        }}>Отправить</button>
      </center>
    );
  }
}
```

Как только пользователь нажмёт "Отправить", Вы можете использовать ссылку для получения решённого токена для отправки на Ваш сервер. И Вы можете проверить его вот так:

```js
exports.post = async (req, res) => {
  if (!await CatMagick.verifyCaptcha(req.body.captcha)) {
    // Captcha не удалась
    res.status(400);
    return res.end("Неверная captcha.");
  }

  // Captcha прошла
  res.status(204);
  res.end();
};
```

### Рендеринг со стороны сервера

Для начала, не забудьте включить *SSR* в настройках. После этого, Вы можете вставлять переменные сервера вот так:

```jsx
<p>Ваш IP адрес это {_%= req.ip %_}</p>
```

Есть три вариации этого синтаксиса:

`{_% код %_}` - выполнить код когда страница загружается, не вставлять ничего

`{_%= код %_}` - вставить какое-либо значение, но фильтровать выход, что-бы предотвратить [XSS](https://en.wikipedia.org/wiki/Cross-site_scripting)

`{_%- код %_}` - вставить любое значение, полезно для вставки JSX тегов

### Выполнение бэкэнд кода внутри JSX

Вы можете писать оба фронтэнд и бэкэнд внутри одного JSX файла.

```jsx
"@private"
async function test(name) {
  return `Ваше имя - ${name}, и Ваш IP адрес - ${req.ip}`;
}

async function meow() {
  console.log(await test("Джон"));
}
```

Здесь, функция `test(name)` выполняется на сервере (бэкэнде) и работает просто как обычная функция в фронтэнде, пока `meow()` это обычная функция на клиенте (фронтэнде).

> ⚠️ Приватные функции должны быть асинхронными функциями на верхнем уровне, `"@private"` должен быть перед каждой серверной переменной или функцией на верхнем уровне. Должна быть хотя-бы одна пустая линия между функциями.
