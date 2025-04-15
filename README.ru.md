# CatMagick
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
# Установить последнюю стабильную версию
npm install catmagick

# Установить последнюю версию в разработке из открытого кода
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
  "proxies": 1, // number of proxies before your website (example, CloudFlare), required to correctly detect ip's under proxies
  "sslProxy": true, // if your website is working on http, but there's some proxy (example, CloudFlare) adding a SSL in between, then set this option to true
  "logRequests": true, // log all requests to console or not, defaults to true
  "logWebSocket": true, // log all websocket connections or disconnections to console, defaults to true
  "hotReload": true, // automatically detect changes in your routes or database files and perform a partial reload, defaults to true
  "sourceMaps": true, // should CatMagick add source maps after transforming .jsx files to .js, defaults to true
  "database": true, // do you need a database in your project, defaults to false
  "databaseType": "sqlite", // what database do you want, sqlite is the most easy one for beginners to setup, defaults to sqlite, you must install your database's package for it to work
  "databaseFile": "database.db", // if you use sqlite, what file should it save to, defaults to database.db
  "sessionSecret": "p2ssw0rd!", // if your project requires sessions to authorize the user, make a secure password for encrypting them, no default
  "secureCookie": false // if your cookies should be HTTPS, defaults to true, you must disable it if you're using HTTP, or your sessions may not work
}
```

## Использование

Once you have made your `config.json`, create `routes` and `middleware` folders, if you use a database - you also need to create a `databases` folder.

Now, go to your `routes` folder and just add `index.html` to it, start your project and go to your website - you will see your HTML there.

While that may look as normal HTML, CatMagick already injected itself there.

Now, add `<script src="/app.jsx"></script>` to your HTML and go to a new file `app.jsx` inside your `routes` folder.

By default, CatMagick renders component called `Root`, so let's make it:

```jsx
new class Root extends CatMagick.Component {
  render() {
    return <h1>Meow!</h1>;
  }
}
```

You can now see this `<h1>` on your website - it means CatMagick works! :tada:

### *DOCUMENTATION IS IN W.I.P*
