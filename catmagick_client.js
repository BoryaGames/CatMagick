/* CatMagick https://github.com/BoryaGames/CatMagick */
(() => {
  var CatMagick = {};
  var components = {};
  var currentPath = [];
  var visitedPaths = [];
  var currentComponent = null;
  var preMigration = null;
  var elementTypes = new Map;
  var keyPathMapping = new Map;
  var states = new Map;
  var effects = new Map;
  var memos = new Map;
  var caches = new Map;
  var events = new Map;
  var currentStateIndex = 0;
  var currentEffectIndex = 0;
  var currentMemoIndex = 0;
  var currentCacheIndex = 0;
  var currentEventIndex = 0;
  var textElementSymbol = Symbol("CatMagick.TextElement");
  var referenceContainsSymbol = Symbol("CatMagick.ReferenceContains");
  var virtualDom = document.createElement("body");
  var rootElement = "Root";
  var routes = {};
  var routeParams = {};
  var ws = null;
  var pingInterval = null;

  CatMagick.debug = !1;

  CatMagick.createElement = (type, props, ...children) => {
    props = (props || {});
    children = children.flat(Infinity).filter(child => child !== void 0 && child !== null && child !== !1).map(child => (typeof child === "string" || typeof child === "number") ? {
      "type": textElementSymbol,
      "props": {
        "nodeValue": child.toString()
      },
      "children": []
    } : child);
    return [{ type, props, children }];
  };

  function debugLog(text) {
    if (CatMagick.debug) {
      console.debug("%c[CatMagick]", "background-color: black; color: red; padding: 4px; border-radius: 3px;", text);
    }
  }

  function createPathnameRegExp(path) {
    return new RegExp(`^${path.replace(/(\/|^)\$([A-Za-z0-9]+)(\/|$)/g, "$1(?<$2>[A-Za-z0-9-_\\$]+)$3").replace(/(\/|^)\$(\?)?(\/|$)/g, (_, prefix, optional, suffix) => `${prefix}(?:[A-Za-z0-9-_\\$]${optional ? "*" : "+"})${suffix}`).replace(/(\/|^)\$\$(\?)?(\/|$)/g, (_, prefix, optional, suffix) => `${prefix}(?:[A-Za-z0-9-_\\$/]${optional ? "*" : "+"})${suffix}`)}$`);
  }

  async function render(isRoot, elements, parent, fake, flags) {
    if (isRoot) {
      if (!components[rootElement]) {
        return;
      }
      debugLog("Rendering...");
      var renderStarted = performance.now();
      preMigration = {
        "states": new Map(states),
        "effects": new Map(effects),
        "memos": new Map(memos),
        "caches": new Map(caches),
        "events": new Map(events)
      };
      virtualDom = document.createElement("body");
      currentStateIndex = 0;
      currentEffectIndex = 0;
      currentMemoIndex = 0;
      currentCacheIndex = 0;
      currentEventIndex = 0;
      elements = components[rootElement].render({});
      parent = virtualDom;
      visitedPaths = [];
    }

    for (var elementIndex in elements) {
      currentPath.push(elementIndex);
      var element = elements[elementIndex];
      visitedPaths.push(currentPath.join(";"));
      if (elementTypes.has(currentPath.join(";")) && elementTypes.get(currentPath.join(";")) != element.type) {
        if (effects.has(currentPath.join(";"))) {
          for (var effect of effects.get(currentPath.join(";")).values()) {
            if (typeof effect[2] === "function") {
              effect[2]();
            }
          }
        }
        states.delete(currentPath.join(";"));
        effects.delete(currentPath.join(";"));
        memos.delete(currentPath.join(";"));
        caches.delete(currentPath.join(";"));
        events.delete(currentPath.join(";"));
      }
      elementTypes.set(currentPath.join(";"), element.type);
      var originalElement = element;
      if (components[element.type]) {
        currentComponent = element;
        currentStateIndex = 0;
        currentEffectIndex = 0;
        currentMemoIndex = 0;
        currentCacheIndex = 0;
        currentEventIndex = 0;
        element = {
          "type": "div",
          "props": {},
          "children": (components[element.type].render(currentComponent.props) || [])
        };
        if (element.children.length == 1) {
          if (!components[element.children[0].type]) {
            element = element.children[0];
          }
        } else {
          var filtered = element.children.filter(child => child.type != textElementSymbol || child.props.nodeValue.trim());
          if (filtered.length == 1) {
            element = filtered[0];
          }
        }
        if (element.props.key) {
          if (keyPathMapping.has(element.props.key) && keyPathMapping.get(element.props.key) != currentPath.join(";")) {
            var migrateFrom = keyPathMapping.get(element.props.key);
            var migrateTo = currentPath.join(";");
            if (preMigration.states.has(migrateFrom)) {
              states.set(migrateTo, preMigration.states.get(migrateFrom));
            }
            if (preMigration.effects.has(migrateFrom)) {
              effects.set(migrateTo, preMigration.effects.get(migrateFrom));
            }
            if (preMigration.memos.has(migrateFrom)) {
              memos.set(migrateTo, preMigration.memos.get(migrateFrom));
            }
            if (preMigration.caches.has(migrateFrom)) {
              caches.set(migrateTo, preMigration.caches.get(migrateFrom));
            }
            if (preMigration.events.has(migrateFrom)) {
              events.set(migrateTo, preMigration.events.get(migrateFrom));
            }
            currentStateIndex = 0;
            currentEffectIndex = 0;
            currentMemoIndex = 0;
            currentCacheIndex = 0;
            currentEventIndex = 0;
            element = {
              "type": "div",
              "props": {},
              "children": (components[originalElement.type].render(currentComponent.props) || [])
            };
            if (element.children.length == 1) {
              if (!components[element.children[0].type]) {
                element = element.children[0];
              }
            } else {
              var filtered2 = element.children.filter(child => child.type != textElementSymbol || child.props.nodeValue.trim());
              if (filtered2.length == 1) {
                element = filtered2[0];
              }
            }
          }
          keyPathMapping.set(element.props.key, currentPath.join(";"));
        }
      }
      var domElement = (element.type == textElementSymbol) ? document.createTextNode("") : document.createElement(element.type);
      domElement._catmagickEvents = {};
      if (typeof element.props.click === "function") {
        domElement._catmagickEvents.click = element.props.click;
        domElement.addEventListener("click", element.props.click);
      }
      if (typeof element.props.hover === "function") {
        domElement._catmagickEvents.mouseover = element.props.hover;
        domElement.addEventListener("mouseover", element.props.hover);
      }
      if (typeof element.props.hoverEnd === "function") {
        domElement._catmagickEvents.mouseout = element.props.hoverEnd;
        domElement.addEventListener("mouseout", element.props.hoverEnd);
      }
      if (typeof element.props.change === "function") {
        domElement._catmagickEvents.input = element.props.change;
        domElement.addEventListener("input", element.props.change);
      }
      domElement._catmagickProps = Object.assign({}, element.props);
      if (typeof element.props.ref === "function") {
        element.props.ref[referenceContainsSymbol] = domElement;
      }
      Object.keys(element.props).forEach(key => domElement[key] = element.props[key]);
      Object.keys((element.props.style || {})).forEach(key => domElement.style[key] = (typeof element.props.style[key] === "number") ? `${element.props.style[key]}px` : element.props.style[key]);
      var originalFlags = JSON.parse(JSON.stringify(flags));
      if (originalElement.type == "Animation") {
        flags[originalElement.type] = {
          ...originalElement.props,
          "_pathIndex": currentPath.length
        };
      }
      if (flags.Animation && domElement.style) {
        domElement._catmagickProps.style = Object.assign({}, (domElement._catmagickProps.style || {}), {
          "viewTransitionName": (flags.Animation.name ? `${flags.Animation.name}-${currentPath.slice(flags.Animation._pathIndex).join("-")}` : `transition-${currentPath.join("-")}`),
          "viewTransitionClass": flags.Animation.animation
        });
        domElement.style.viewTransitionName = (flags.Animation.name ? `${flags.Animation.name}-${currentPath.slice(flags.Animation._pathIndex).join("-")}` : `transition-${currentPath.join("-")}`);
        domElement.style.viewTransitionClass = flags.Animation.animation;
      }
      domElement._catmagickFlags = JSON.parse(JSON.stringify(flags));
      domElement._catmagickKey = element.props.key;
      await render(!1, element.children, domElement, (originalElement.type == "Activity" && !originalElement.props.show), JSON.parse(JSON.stringify(flags)));
      if (!fake) {
        parent.appendChild(domElement);
      }
      currentPath.pop();
      flags = originalFlags;
    }

    if (isRoot) {
      Array.from(states.keys()).filter(path => path).filter(path => !visitedPaths.includes(path)).forEach(path => {
        if (effects.has(path)) {
          for (var effect of effects.get(path).values()) {
            if (typeof effect[2] === "function") {
              effect[2]();
            }
          }
        }
        states.delete(path);
        effects.delete(path);
        memos.delete(path);
        caches.delete(path);
        events.delete(path);
      });
      debugLog("Syncing...");
      await syncDom(!0, virtualDom, document.body);
      debugLog(`Rendered in ${parseFloat((performance.now() - renderStarted).toFixed(1))}ms.`);
      for (var elementEffects of effects.values()) {
        for (var [effectId, effect2] of elementEffects.entries()) {
          if (effect2[1]) {
            elementEffects.set(effectId, [effect2[0], null, null]);
            elementEffects.set(effectId, [effect2[0], null, effect2[1]()]);
          }
        }
      }
    }
  }

  async function syncDom(isRoot, virtual, real) {
    var maxNodes = Math.max(virtual.childNodes.length, real.childNodes.length);
    var tasks = [];
    var transitionTasks = [];
    var virtualChildNodes = Array.from(virtual.childNodes);
    var realChildNodes = Array.from(real.childNodes);
    var virtualKeys = virtualChildNodes.map(node => node._catmagickKey).filter(key => key);
    var realKeys = realChildNodes.map(node => node._catmagickKey).filter(key => key);
    if (virtualKeys.length && virtualChildNodes.find(node => !node._catmagickKey)) {
      throw "Mixing elements with and without key is not allowed, including text and spaces between elements.";
    }
    for (var i = 0; i < maxNodes; i++) {
      var virtualNode = virtualChildNodes[i];
      var realNode = realChildNodes[i];
      if (realNode && realNode._catmagickKey && !virtualKeys.includes(realNode._catmagickKey)) {
        tasks.push({
          "type": "remove",
          "node": realNode
        });
        if (i === 0) {
          virtualChildNodes.unshift(null);
        } else {
          virtualChildNodes.splice((i - 1), 0, null);
        }
      } else if (virtualNode && virtualNode._catmagickKey && !realNode) {
        virtual.replaceChild(virtualNode.cloneNode(!0), virtualNode);
        tasks.push({
          "type": "insert",
          "parent": real,
          "node": virtualNode,
          "position": realChildNodes[i + 1]
        });
      } else if (virtualNode && virtualNode._catmagickKey && realNode && virtualNode._catmagickKey != realNode._catmagickKey) {
        if (realKeys.includes(virtualNode._catmagickKey)) {
          var realNode2 = Array.from(real.childNodes).find(node => node._catmagickKey == virtualNode._catmagickKey);
          tasks.push({
            "type": "insert",
            "parent": real,
            "node": realNode2,
            "position": realNode
          });
        } else {
          virtual.replaceChild(virtualNode.cloneNode(!0), virtualNode);
          tasks.push({
            "type": "insert",
            "parent": real,
            "node": virtualNode,
            "position": realNode
          });
        }
        if (i === 0) {
          realChildNodes.unshift(null);
        } else {
          realChildNodes.splice((i - 1), 0, null);
        }
      } else if (virtualNode && !realNode) {
        virtual.replaceChild(virtualNode.cloneNode(!0), virtualNode);
        tasks.push({
          "type": "insert",
          "parent": real,
          "node": virtualNode
        });
      } else if (!virtualNode && realNode) {
        tasks.push({
          "type": "remove",
          "node": realNode
        });
      } else if (virtualNode.nodeName != realNode.nodeName) {
        virtual.replaceChild(virtualNode.cloneNode(!0), virtualNode);
        tasks.push({
          "type": "replace",
          "parent": real,
          "oldNode": realNode,
          "newNode": virtualNode
        });
      } else if (realNode.nodeName == "#text") {
        if (virtualNode.textContent != realNode.textContent) {
          realNode.textContent = virtualNode.textContent;
        }
      } else {
        tasks.push({
          "type": "update",
          virtualNode, realNode
        });
        tasks.push(...(await syncDom(!1, virtualNode, realNode)));
      }
    }
    function doTask(task) {
      if (task.type == "insert") {
        if (task.position) {
          task.parent.insertBefore(task.node, task.position);
        } else {
          task.parent.appendChild(task.node);
        }
      }
      if (task.type == "replace") {
        task.parent.replaceChild(task.newNode, task.oldNode);
      }
      if (task.type == "update") {
        Object.keys(task.realNode._catmagickEvents).forEach(ev => task.realNode.removeEventListener(ev, task.realNode._catmagickEvents[ev]));
        Object.keys(task.virtualNode._catmagickEvents).forEach(ev => task.realNode.addEventListener(ev, task.virtualNode._catmagickEvents[ev]));
        task.realNode._catmagickEvents = task.virtualNode._catmagickEvents;
        task.realNode._catmagickKey = task.virtualNode._catmagickKey;
        for (var prop of new Set([...Object.keys(task.virtualNode._catmagickProps), ...Object.keys(task.realNode._catmagickProps)])) {
          if (!Object.keys(task.virtualNode._catmagickProps).includes(prop) && Object.keys(task.realNode._catmagickProps).includes(prop)) {
            task.realNode.removeAttribute((prop == "className") ? "class" : prop);
          } else if ((Object.keys(task.virtualNode._catmagickProps).includes(prop) && !Object.keys(task.realNode._catmagickProps).includes(prop)) || task.virtualNode._catmagickProps[prop] !== task.realNode._catmagickProps[prop]) {
            if (prop == "style") {
              for (var prop2 of new Set([...Object.keys(task.virtualNode._catmagickProps.style || {}), ...Object.keys(task.realNode._catmagickProps.style || {})])) {
                if (!Object.keys(task.virtualNode._catmagickProps.style || {}).includes(prop2) && Object.keys(task.realNode._catmagickProps.style || {}).includes(prop2)) {
                  task.realNode.style[prop2] = "";
                } else if ((Object.keys(task.virtualNode._catmagickProps.style || {}).includes(prop2) && !Object.keys(task.realNode._catmagickProps.style || {}).includes(prop2)) || task.virtualNode._catmagickProps.style[prop2] !== task.realNode._catmagickProps.style[prop2]) {
                  task.realNode.style[prop2] = (typeof task.virtualNode._catmagickProps.style[prop2] === "number") ? `${task.virtualNode._catmagickProps.style[prop2]}px` : task.virtualNode._catmagickProps.style[prop2];
                }
              }
            } else {
              task.realNode[prop] = task.virtualNode._catmagickProps[prop];
            }
          }
        }
        task.realNode._catmagickProps = task.virtualNode._catmagickProps;
        if (typeof task.realNode._catmagickProps.ref === "function") {
          task.realNode._catmagickProps.ref[referenceContainsSymbol] = task.realNode;
        }
      }
      if (task.type == "remove") {
        if (task.node._catmagickProps && typeof task.node._catmagickProps.ref === "function") {
          task.node._catmagickProps.ref[referenceContainsSymbol] = null;
        }
        task.node.remove();
      }
    }
    if (isRoot) {
      for (var task of tasks) {
        if (typeof document.startViewTransition === "function" && ((task.node && task.node._catmagickFlags && task.node._catmagickFlags.Animation) || (task.virtualNode && task.virtualNode._catmagickFlags && task.virtualNode._catmagickFlags.Animation))) {
          transitionTasks.push(task);
        } else {
          doTask(task);
        }
      }
    }
    if (transitionTasks.length) {
      try {
        await document.startViewTransition(() => {
          for (var task of transitionTasks) {
            doTask(task);
          }
        }).ready;
      } catch(err) {
        if (err.name != "AbortError") {
          throw err;
        }
      }
    }
    return tasks;
  }

  CatMagick.Component = class {
    constructor() {
      if (components[this.constructor.name]) {
        throw `Component with name <${this.constructor.name}> already exists.`;
      }
      components[this.constructor.name] = this;
    }
  };

  function useContent() {
    return currentComponent.children;
  }

  function useState(defaultValue) {
    var localIndex = currentStateIndex++;
    var path = currentPath.join(";");
    if (!states.has(path)) {
      states.set(path, new Map);
    }
    if (!states.get(path).has(localIndex)) {
      states.get(path).set(localIndex, defaultValue);
    }
    return [states.get(path).get(localIndex), value => {
      states.get(path).set(localIndex, value);
      render(!0, null, null, !1, {});
    }];
  }

  function useEffect(execute, dependencies) {
    var localIndex = currentEffectIndex++;
    var path = currentPath.join(";");
    if (!effects.has(path)) {
      effects.set(path, new Map);
    }
    if (!effects.get(path).has(localIndex)) {
      return effects.get(path).set(localIndex, [dependencies, execute, null]);
    }
    var lastEffect = effects.get(path).get(localIndex);
    if (dependencies === void 0 || dependencies === null || lastEffect[0] === void 0 || lastEffect[0] === null || dependencies.length != lastEffect[0].length || dependencies.findIndex((dependency, index) => dependency !== lastEffect[0][index]) > -1) {
      if (typeof lastEffect[2] === "function") {
        lastEffect[2]();
      }
      effects.get(path).set(localIndex, [dependencies, execute, null]);
    }
  }

  function useMemo(calculate, dependencies) {
    var localIndex = currentMemoIndex++;
    var path = currentPath.join(";");
    if (!memos.has(path)) {
      memos.set(path, new Map);
    }
    if (!memos.get(path).has(localIndex) || dependencies === void 0 || dependencies === null || memos.get(path).get(localIndex)[0] === void 0 || memos.get(path).get(localIndex)[0] === null || dependencies.length != memos.get(path).get(localIndex)[0].length || dependencies.findIndex((dependency, index) => dependency !== memos.get(path).get(localIndex)[0][index]) > -1) {
      memos.get(path).set(localIndex, [dependencies, calculate()]);
    }
    return memos.get(path).get(localIndex)[1];
  }

  function useCache(calculate, dependencies) {
    var localIndex = currentCacheIndex++;
    var path = currentPath.join(";");
    if (!caches.has(path)) {
      caches.set(path, new Map);
    }
    if (!caches.get(path).has(localIndex)) {
      caches.get(path).set(localIndex, []);
    }
    var all = caches.get(path).get(localIndex);
    for (var one of all) {
      if (dependencies !== void 0 && dependencies !== null && one[0] !== void 0 && one[0] !== null && dependencies.length == one[0].length && dependencies.findIndex((dependency, index) => dependency !== one[0][index]) == -1) {
        return one[1];
      }
    }
    var value = calculate();
    all.push([dependencies, value]);
    caches.get(path).set(localIndex, all);
    return value;
  }

  function useLocation() {
    var { pathname, search, hash } = location;
    return {
      pathname, search, hash,
      "params": (routeParams || {})
    };
  }

  function useReference() {
    function getReference() {
      return getReference[referenceContainsSymbol];
    }
    getReference.displayData = () => {
      return getReference().getBoundingClientRect();
    };
    getReference.set = value => {
      getReference[referenceContainsSymbol] = value;
      return value;
    };
    getReference[referenceContainsSymbol] = null;
    return getReference;
  }

  function useEvent(event, callback) {
    var localIndex = currentEventIndex++;
    var path = currentPath.join(";");
    if (!events.has(path)) {
      events.set(path, new Map);
    }
    events.get(path).set(localIndex, [event, callback]);
  }

  CatMagick.route = (path, root) => {
    debugLog(`Registered route "${path}".`);
    routes[path] = root;
    var match = location.pathname.match(createPathnameRegExp(path));
    if (match) {
      rootElement = root;
      routeParams = match.groups;
    }
  };

  CatMagick.goto = path => {
    debugLog(`Going to "${path}"...`);
    try {
      if ((new URL(path)).origin != location.origin) {
        location = path;
        return;
      }
      path = new URL(path);
      path = `${path.pathname}${path.search}${path.hash}`;
    } catch {
      // This path is not a full url then
    }
    history.pushState(null, null, path);
    for (var route of Object.keys(routes)) {
      var match = (new URL(location.origin + path)).pathname.match(createPathnameRegExp(route));
      if (match) {
        for (var elementEffects of effects.values()) {
          for (var effect of elementEffects.values()) {
            if (typeof effect[2] === "function") {
              effect[2]();
            }
          }
        }
        states = new Map;
        effects = new Map;
        memos = new Map;
        caches = new Map;
        rootElement = routes[route];
        routeParams = match.groups;
        render(!0, null, null, !1, {});
        return;
      }
    }
    fetch(path).then(res => res.text()).then(async html => {
      for (var elementEffects of effects.values()) {
        for (var effect of elementEffects.values()) {
          if (typeof effect[2] === "function") {
            effect[2]();
          }
        }
      }
      delete window.CatMagick;
      document.documentElement.innerHTML = html;
      for (var element of Array.from(document.scripts)) {
        var parent = element.parentElement;
        var after = parent.children[(Array.from(parent.children).indexOf(element) + 1)];
        element.remove();
        var newElement = document.createElement(element.tagName.toLowerCase());
        if (element.type) {
          newElement.type = element.type;
        }
        if (element.src) {
          newElement.src = element.src;
        }
        if (element.id) {
          newElement.id = element.id;
        }
        newElement.innerHTML = element.innerHTML;
        if (after) {
          parent.insertBefore(newElement, after);
        } else {
          parent.appendChild(newElement);
        }
        await new Promise(res => newElement.onload = res);
      }
    });
  };

  CatMagick.handleLink = event => {
    event.preventDefault();
    event.stopPropagation();
    CatMagick.goto(event.target.href);
  };

  CatMagick.rerender = () => {
    render(!0, null, null, !1, {});
  };

  CatMagick.fetch = (url, options) => {
    if (!options) {
      options = {};
    }
    if (typeof options.body === "object") {
      options.headers = Object.assign({
        "Content-Type": "application/json"
      }, (options.headers || {}));
      options.body = JSON.stringify(options.body);
    }
    return fetch(url, options);
  };

  new class Activity extends CatMagick.Component {
    render(props) {
      return [{
        "type": "div",
        "children": currentComponent.children,
        props
      }];
    }
  }

  new class Animation extends CatMagick.Component {
    render(props) {
      return [{
        "type": "div",
        "children": currentComponent.children,
        props
      }];
    }
  }

  new class Captcha extends CatMagick.Component {
    render({ getToken, ...props }) {
      if (!CatMagick.captchaSiteKey) {
        throw "Captcha is not configured on the server.";
      }

      var captchaBox = useReference();
      var widgetId = useReference();

      getToken.set(() => {
        return (grecaptcha.getResponse(widgetId()) || null);
      });

      useEffect(() => {
        if (typeof grecaptcha !== "undefined") {
          widgetId.set(grecaptcha.render(captchaBox(), {
            "sitekey": CatMagick.captchaSiteKey
          }));
        }
      }, [typeof grecaptcha]);

      return [{
        "type": "div",
        "children": currentComponent.children,
        "props": {
          "ref": captchaBox,
          ...props
        }
      }];
    }
  }

  function dispatchEvent(event, data) {
    ws.send(pako.deflate(JSON.stringify([event, data])));
  }

  window.CatMagick = CatMagick;
  window.useContent = useContent;
  window.useState = useState;
  window.useEffect = useEffect;
  window.useMemo = useMemo;
  window.useCache = useCache;
  window.useLocation = useLocation;
  window.useReference = useReference;
  window.useEvent = useEvent;
  window.dispatchEvent = dispatchEvent;

  window.addEventListener("popstate", () => {
    for (var elementEffects of effects.values()) {
      for (var effect of elementEffects.values()) {
        if (typeof effect[2] === "function") {
          effect[2]();
        }
      }
    }
    states = new Map;
    effects = new Map;
    memos = new Map;
    caches = new Map;
    var routeFound = !1;
    for (var route of Object.keys(routes)) {
      var match = location.pathname.match(createPathnameRegExp(route));
      if (match) {
        routeFound = !0;
        rootElement = routes[route];
        routeParams = match.groups;
        break;
      }
    }
    if (!routeFound) {
      rootElement = "Root";
    }
    render(!0, null, null, !1, {});
  });

  window.CatMagickHandleCaptcha = CatMagick.rerender;

  if (document.readyState == "loading") {
    window.addEventListener("DOMContentLoaded", () => render(!0, null, null, !1, {}));
  } else {
    render(!0, null, null, !1, {});
  }

  function connectWS() {
    debugLog("Connecting to WebSocket...");
    var connectionStarted = performance.now();
    ws = new WebSocket("/events");
    ws.binaryType = "arraybuffer";
    ws.addEventListener("open", () => {
      debugLog(`Connected to WebSocket in ${parseFloat((performance.now() - connectionStarted).toFixed(1))}ms.`);
      pingInterval = setInterval(() => {
        ws.send("PING");
      }, 6e4);
    });
    ws.addEventListener("message", event => {
      if (event.data === "PONG") {
        return debugLog("WebSocket ping-pong completed.");
      }
      try {
        var message = JSON.parse(pako.inflate(event.data, {
          "to": "string"
        }));
      } catch {
        return debugLog("Received invalid message from server.");
      }
      for (var elementEvents of events.values()) {
        for (var elementEvent of elementEvents.values()) {
          if (message[0] == elementEvent[0]) {
            elementEvent[1](message[1]);
          }
        }
      }
    });
    ws.addEventListener("close", event => {
      debugLog(`WebSocket was disconnected with code ${event.code}.`);
      clearInterval(pingInterval);
      connectWS();
    });
  }
  connectWS();
})();
