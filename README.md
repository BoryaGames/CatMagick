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

To run your project, you just need to `require()` it.

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
  "logWebSocket": true, // log all WebSocket connections or disconnections to console, defaults to true
  "hotReload": true, // automatically detect changes in your routes or databases and perform a partial reload, defaults to true
  "sourceMaps": true, // should CatMagick add source maps after transforming .jsx files to .js, defaults to true
  "database": true, // do you need a database in your project, defaults to false
  "databaseType": "sqlite", // what database do you want, sqlite is the most easy one for beginners to setup, defaults to sqlite, you must install your database's package for it to work
  "databaseFile": "database.db", // if you use sqlite, what file should it save to, defaults to database.db
  "sessionSecret": "p2ssw0rd!", // if your project requires sessions to authorize the user, make a secure password for encrypting them, no default
  "secureCookie": false // if your cookies should be HTTPS, defaults to true, you must disable it if you're using HTTP, or your sessions may not work
}
```

## Usage

### First component

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

### Making multiple components

```jsx
new class Root extends CatMagick.Component {
  render() {
    return (
      // Use empty tag <>something</> to combine multiple components into one root component
      <>
        <h1>Meow!</h1>
        // Self-closing <tag />
        <br />
        // "color" is an attribute
        <MyComponent color="red">
          // Content of your component
          World
        </MyComponent>
      </>
    );
  }
}

// Your own component
new class MyComponent extends CatMagick.Component {
  render() {
    // To add custom CSS styles, the most easy way to use "style" attribute, and it's value is a JavaScript object
    // useAttribute(name) just returns the attribute value
    return <p style={{
      "color": useAttribute("color")
    }}>
      // Use {something} syntax to insert JavaScript variables inside HTML tags
      // useContent() just returns the content inside your component (in this case, "World")
      Hello, {useContent()}!
    </p>;
  }
}
```

### Debug mode

When debugging, *debug mode* can be a useful feature for you.

```jsx
// Enable debug mode
CatMagick.debug = true;

new class Root extends CatMagick.Component {
  render() {
    return <h1>Meow!</h1>;
  }
}
```

Debug mode will output extra logs to the console: when render is happening, how much time did it took, state of the WebSocket, router logs and more.

### Saving state

Let's make a simple page with three buttons using custom components.

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
      // We need to increment clicks
    }

    // "click" is an attribute to listen for click event
    return <button click={btnClicked}>Clicks: 0</button>;
  }
}
```

We want to be able to see amount of clicks on the button. Let's try something:

```jsx
new class MyButton extends CatMagick.Component {
  render() {
    var clicks = 0;

    function btnClicked() {
      clicks++;
    }

    return <button click={btnClicked}>Clicks: {clicks}</button>;
  }
}
```

Nope, clicks variable is being reset back to 0 on every render, as it's inside the render function. Maybe let's move it outside?

```jsx
var clicks = 0;

new class MyButton extends CatMagick.Component {
  render() {
    function btnClicked() {
      clicks++;
    }

    return <button click={btnClicked}>Clicks: {clicks}</button>;
  }
}
```

Well, we still have two problems:

1) We have any amount of buttons (for example, 3 here), but only one variable.

2) Even though we changing the `clicks` variable, we do not update the on-screen data, so the user doesn't see the new amount.

The best way to solve this is using a *hook* called `useState`.

```jsx
new class MyButton extends CatMagick.Component {
  render() {
    // "clicks" is the variable itself here, but to change it we must use a setter called "setClicks", and 0 is value of our variable
    var [clicks, setClicks] = useState(0);

    function btnClicked() {
      // We increment our variable
      setClicks(clicks + 1);
    }

    return <button click={btnClicked}>Clicks: {clicks}</button>;
  }
}
```

This *hook* will automatically save everything, it works with multiple instances of the component and also automatically updates the screen!

> ⚠️ Hook - is a function that is supposed to execute the same time and same amount of times every render. ⚠️
> ```jsx
  if (someCondition) {
    var [clicks, setClicks] = useState(0);
  }
  ```
> This hook can be called 0 or 1 times depending on the condition, that's a **WRONG** usage and may cause your variables not to save or replace other variables.


### *DOCUMENTATION IS IN W.I.P*
