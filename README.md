# 😺 CatMagick ✨
## *The Meow-iest Framework, Ever*

![Build](https://github.com/BoryaGames/CatMagick/actions/workflows/test.yml/badge.svg)
![Contributors](https://img.shields.io/github/contributors/BoryaGames/CatMagick)
![Chat on Discord](https://img.shields.io/discord/916772281747931198?logo=discord)

**[English]** | [[Русский]](./README.ru.md)

CatMagick is a framework designed to make websites easily (both frontend and backend!).

## Features

- [React](https://react.dev)-like UI components allows you to easily make and modify your UI structure using JSX
- Transition between pages without reloading simillar to [ReactRouter](https://reactrouter.com)
- Add simple classes instead of making CSS styles, just like in [Tailwind](https://tailwindcss.com)
- Make API by just adding files in your `routes` / `middleware` folders
- Easily use database without knowing any SQL commands
- No need to restart your server, it has *hot-reload* feature built-in
- CatMagick also maintains WebSocket connection between your frontend and backend at all times, so you can easily synchronize them
- ✨ Magic ✨

## Installation

CatMagick requires [Node.js](https://nodejs.org) to run.
It works on **v22.2.0**, but will work on some other versions too.

Install it in your project using [NPM registry](https://www.npmjs.com/package/catmagick).

```sh
# Install latest stable version
npm install catmagick

# Install latest development version from source code
npm install git+https://github.com/BoryaGames/CatMagick.git
```

To run your project, you just need to require it.

```sh
# Do it directly
node -e "require('catmagick')"

# Or make a start.js file instead
echo "require('catmagick')" > start.js
node start.js
```

## Config

CatMagick requires a `config.json` file in root of your project to start. While it has a lot of options, all of them are completely optional.

```javascript
{
  "port": 80, // webserver listen port, defaults to auto-detect
  "domain": "example.com", // your website's domain, no default
  "proxies": 1, // number of proxies before your website (example, CloudFlare), required to correctly detect IP-addresses under proxies
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

## Usage

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
