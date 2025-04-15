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
  "hotReload": true, // automatically detect changes in your routes or database files and perform a partial reload, defaults to true
  "sourceMaps": true, // should CatMagick add source maps after transforming .jsx files to .js, defaults to true
  "database": true, // необходима-ли Вам база данных в Вашем проекте, по умолчанию false
  "databaseType": "sqlite", // what database do you want, sqlite is the most easy one for beginners to setup, defaults to sqlite, you must install your database's package for it to work
  "databaseFile": "database.db", // если Вы используете sqlite, в какой файл он должен сохранять, по умолчанию database.db
  "sessionSecret": "p2ssw0rd!", // if your project requires sessions to authorize the user, make a secure password for encrypting them, no default
  "secureCookie": false // if your cookies should be HTTPS, defaults to true, you must disable it if you're using HTTP, or your sessions may not work
}
```

## Использование

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

### *ДОКУМЕНТАЦИЯ В ПРОГРЕССЕ*
