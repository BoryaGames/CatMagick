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
echo require('catmagick') > start.js
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

> ⚠️ If you have hot-reload enabled in config and make a syntax error inside a JSX file, the error will be printed in the server console and the client will receive old version before an error and your users will not be affected.
> While that may seem as a useful feature, you may be confused why your code did not update if you're not looking in server's console.

### Making multiple components

```jsx
new class Root extends CatMagick.Component {
  render() {
    return (
      // Use empty tag <>something</> to combine multiple components into one root component
      <>
        <h1>Meow!</h1>
        {/* Self-closing <tag /> */}
        <br />
        {/* "color" is an attribute */}
        <MyComponent color="red">
          {/* Content of your component */}
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
      {/* Use {something} syntax to insert JavaScript variables inside HTML tags */}
      {/* useContent() just returns the content inside your component (in this case, "World") */}
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

Nope, `clicks` variable is being reset back to 0 on every render, as it's inside the `render()` function. Maybe let's move it outside?

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

> ⚠️ Hook - is a function that is supposed to execute the same time and same amount of times every render.
> ```jsx
>   if (someCondition) {
>     var [clicks, setClicks] = useState(0);
>   }
> ```
> This hook can be called 0 or 1 times depending on the condition, that's a **WRONG** usage and may cause your variables not to save or replace other variables.

### Saving heavy computations

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

### Effects

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

3) `num = 3` - num has changed, `3` is being printed to the console as previous effect is doing it's clean-up.

4) Then, `1` is being printed to the console.

5) After the render, `2` is being printed to the console again.

### Accesing the element reference

Sometimes, you just want to do a simple focus:

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
      // Don't forget: input is a reference and not an element, you must call it first to get the element - input()
      input().focus();
    }, []);

    // We must add the reference to "ref" attribute
    return <input type="text" ref={input} />;
  }
}
```

### Re-render

Sometimes you just need to force a re-render. Normally `useState` will re-render the element after it's value been changed, but if your component relies on some external data source and it changed, you need to update the screen yourself.

```jsx
CatMagick.rerender();
```

This is as simple as calling a function.

### Router

Your application can be multi-page, but transition between them is not really fast.

```jsx
CatMagick.goto("/login");
```

This is the simplest use of CatMagick's router - it will automatically do a GET request to that page, do a clean-up for all current effects and replace current HTML with that page.

Sometimes, this just doesn't work correctly or you want to be even faster - then you can merge pages into a single page.

```jsx
new class Main extends CatMagick.Component {
  render() {
    return (
      <>
        <h1>This is the main page.</h1>
        <br />
        {/* CatMagick.handleLink is a function that automatically replaces your <a> link with CatMagick.goto(href) */}
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

The first argument to `.route` method is a path, but you can actually use patterns instead of specifying exact path.

`/users/12345` - exact path

`/users/$` - match anything (`/users/12345`, `/users/54321`, `/users/cat`)

`/users/$id` - match anything, but save it as `id` (which you can use later)

`/users/$$` - match anything, including deeper paths (`/users/12345`, `/users/54321/send`, `/users/cat/edit/confirm`)

`/$?` - use a question mark to make it optional (`/`, `/home`, `/download`)

`/$$?` - you can use a question mark here too (`/`, `/home`, `/download/windows`)

If you want to get the current path and it's extra information - call `useLocation()` (not a hook).

```jsx
new class UserPage extends CatMagick.Component {
  render() {
    var location = useLocation();

    // Current link is http://localhost/users/12345?show_servers=true#bio

    console.log(location.pathname); // -> /users/12345
    console.log(location.search); // -> ?show_servers=true
    console.log(location.hash); // -> #bio
    console.log(location.params.id); // -> 12345
  }
}

CatMagick.route("/users/$id", "UserPage");
```

### Activity

Sometimes you want to remove a component from the screen, but keep its current state. Or maybe you want to pre-render component in background without showing it on the screen.

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
        <button click={() => setShow(!show)}>Show / Hide</button>
      </center>
    );
  }
}

new class Counter extends CatMagick.Component {
  render() {
    var [count, setCount] = useState(0);

    return <button click={() => {
      setCount(count + 1);
    }}>Count: {count}</button>;
  }
}
```

This will work, but even though element has `display: none;` in CSS, it's still in DOM and browser will render it in background, let's change it to built-in component `Activity`.

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
        <button click={() => setShow(!show)}>Show / Hide</button>
      </center>
    );
  }
}
```

Now, when `show = false`, component will completely remove from the DOM, but still its `render()` function will be called, its state being remembered and its effects will still work.

### Server explanation

You add your routes in `routes` folder, but same as client router you can use patterns here too, but they're more limited.

Server supports `$` folder for anything and `$id` to save it for later use.

We have only made client routes, but how do we make an API routes? You just need to create a `_route.js` file in your route folder.

Let's create a `routes/users/$id/_route.js` file:

```js
// We got a GET request on this route
exports.get = (req, res) => {
  // Read saved $id from URL
  console.log(req.params.id); // -> 12345

  // Respond with JSON
  res.json({
    "username": "test"
  });
};

// We got a POST request on this route
exports.post = (req, res) => {
  // Set status code
  res.status(418);

  // Respond with text
  res.end("Hello, World!");
};
```

Next, let's make a *middleware* - it's a code that runs on every single request and on every single method, and can interrupt the request before the route even gets called. Create a file in `middlewares` folder with any name you like.

```js
// The middleware function
module.exports = (req, res) => {
  // If the ip matches, respond with the error and stop route from executing
  if (req.ip == "123.45.6.78") {
    res.status(403);
    res.end("Access Denied!");
    return false;
  }

  // Otherwise, let's log request's ip and continue the route normally
  console.log("Request from", req.ip);
  return true;
};
```

> Middleware can be asynchronous - request will wait until your middleware finishes.

All your routes and middleware will be automatically reloaded on changes, if hot-reload is enabled in config.

In case requested route doesn't exist, CatMagick will respond with 404. If requested route exists, but requested method doesn't, CatMagick will respond with 405. If requested route exists, but it fails due to an error, it will be reported to the console and CatMagick will respond with 500.

If you want to make your own friendly design for errors, you can add `404.html`, `405.html`, `500.html` files in project root.

### *DOCUMENTATION IS IN W.I.P*
