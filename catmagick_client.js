/* CatMagick https://github.com/BoryaGames/CatMagick */
(() => {
  var CatMagick = {};
  var components = {};
  var currentPath = [];
  var visitedPaths = [];
  var currentComponent = null;
  var elementTypes = new Map;
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
  var elementContainsSymbol = Symbol("CatMagick.ElementContains");
  var virtualDom = document.createElement("body");
  var rootElement = "Root";
  var routes = {};
  var routeParams = {};
  var ws = null;
  var pingInterval = null;

  CatMagick.debug = !1;

  CatMagick.createElement = (type, props, ...children) => {
    props = (props || {});
    children = children.flat(Infinity).filter(child => child !== void 0 && child !== null).map(child => (typeof child === "string" || typeof child === "number") ? {
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
    return new RegExp(`^${path.replace(/\$([A-Za-z0-9]+)/g, "(?<$1>[A-Za-z0-9]+)")}$`);
  }

  function render(isRoot, elements, parent) {
    if (isRoot) {
      if (!components[rootElement]) {
        return;
      }
      debugLog("Rendering...");
      var renderStarted = performance.now();
      virtualDom = document.createElement("body");
      currentStateIndex = 0;
      currentEffectIndex = 0;
      currentMemoIndex = 0;
      currentCacheIndex = 0;
      currentEventIndex = 0;
      elements = components[rootElement].render();
      parent = virtualDom;
      visitedPaths = [];
    }

    for (var elementIndex in elements) {
      currentPath.push(elementIndex);
      var element = elements[elementIndex];
      visitedPaths.push(currentPath.join(";"));
      if (elementTypes.has(currentPath.join(";")) && elementTypes.get(currentPath.join(";")) != element.type) {
        states.delete(currentPath.join(";"));
        effects.delete(currentPath.join(";"));
        memos.delete(currentPath.join(";"));
        caches.delete(currentPath.join(";"));
        events.delete(currentPath.join(";"));
      }
      elementTypes.set(currentPath.join(";"), element.type);
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
          "children": (components[element.type].render() || [])
        };
        if (element.children.length == 1) {
          element = element.children[0];
        } else {
          var filtered = element.children.filter(child => child.type != textElementSymbol || child.props.nodeValue.trim());
          if (filtered.length == 1) {
            element = filtered[0];
          }
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
      domElement._catmagickProps = element.props;
      if (typeof element.props.ref === "function") {
        element.props.ref[elementContainsSymbol] = domElement;
      }
      Object.keys(element.props).forEach(key => domElement[key] = element.props[key]);
      Object.keys((element.props.style || {})).forEach(key => domElement.style[key] = (typeof element.props.style[key] === "number") ? `${element.props.style[key]}px` : element.props.style[key]);
      render(!1, element.children, domElement);
      parent.appendChild(domElement);
      currentPath.pop();
    }

    if (isRoot) {
      Array.from(states.keys()).filter(path => path).filter(path => !visitedPaths.includes(path)).forEach(path => {
        states.delete(path);
        effects.delete(path);
        memos.delete(path);
        caches.delete(path);
        events.delete(path);
      });
      debugLog("Syncing...");
      syncDom(virtualDom, document.body);
      debugLog(`Rendered in ${parseFloat((performance.now() - renderStarted).toFixed(1))}ms.`);
      for (var elementEffects of effects.values()) {
        for (var [effectId, effect] of elementEffects.entries()) {
          if (effect[1]) {
            elementEffects.set(effectId, [effect[0], null, null]);
            elementEffects.set(effectId, [effect[0], null, effect[1]()]);
          }
        }
      }
    }
  }

  function syncDom(virtual, real) {
    var maxNodes = Math.max(virtual.childNodes.length, real.childNodes.length);
    var toRemove = [];
    for (var i = 0; i < maxNodes; i++) {
      var virtualNode = virtual.childNodes[i];
      var realNode = real.childNodes[i];
      if (virtualNode && !realNode) {
        virtual.replaceChild(virtualNode.cloneNode(!0), virtualNode);
        real.appendChild(virtualNode);
      } else if (!virtualNode && realNode) {
        if (realNode._catmagickProps && typeof realNode._catmagickProps.ref === "function") {
          realNode._catmagickProps.ref[elementContainsSymbol] = null;
        }
        toRemove.push(realNode);
      } else if (virtualNode.nodeName != realNode.nodeName) {
        virtual.replaceChild(virtualNode.cloneNode(!0), virtualNode);
        real.replaceChild(virtualNode, realNode);
      } else if (realNode.nodeName == "#text") {
        if (virtualNode.textContent != realNode.textContent) {
          realNode.textContent = virtualNode.textContent;
        }
      } else {
        Object.keys(realNode._catmagickEvents).forEach(ev => realNode.removeEventListener(ev, realNode._catmagickEvents[ev]));
        Object.keys(virtualNode._catmagickEvents).forEach(ev => realNode.addEventListener(ev, virtualNode._catmagickEvents[ev]));
        realNode._catmagickEvents = virtualNode._catmagickEvents;
        for (var prop of new Set([...Object.keys(virtualNode._catmagickProps), ...Object.keys(realNode._catmagickProps)])) {
          if (!Object.keys(virtualNode._catmagickProps).includes(prop) && Object.keys(realNode._catmagickProps).includes(prop)) {
            realNode.removeAttribute((prop == "className") ? "class" : prop);
          } else if ((Object.keys(virtualNode._catmagickProps).includes(prop) && !Object.keys(realNode._catmagickProps).includes(prop)) || virtualNode._catmagickProps[prop] !== realNode._catmagickProps[prop]) {
            if (prop == "style") {
              for (var prop2 of new Set([...Object.keys(virtualNode._catmagickProps.style || {}), ...Object.keys(realNode._catmagickProps.style || {})])) {
                if (!Object.keys(virtualNode._catmagickProps.style || {}).includes(prop2) && Object.keys(realNode._catmagickProps.style || {}).includes(prop2)) {
                  realNode.style[prop2] = "";
                } else if ((Object.keys(virtualNode._catmagickProps.style || {}).includes(prop2) && !Object.keys(realNode._catmagickProps.style || {}).includes(prop2)) || virtualNode._catmagickProps.style[prop2] !== realNode._catmagickProps.style[prop2]) {
                  realNode.style[prop2] = (typeof virtualNode._catmagickProps.style[prop2] === "number") ? `${virtualNode._catmagickProps.style[prop2]}px` : virtualNode._catmagickProps.style[prop2];
                }
              }
            } else {
              realNode[prop] = virtualNode._catmagickProps[prop];
            }
          }
        }
        realNode._catmagickProps = virtualNode._catmagickProps;
        if (typeof realNode._catmagickProps.ref === "function") {
          realNode._catmagickProps.ref[elementContainsSymbol] = realNode;
        }
        syncDom(virtualNode, realNode);
      }
    }
    toRemove.forEach(node => node.remove());
  }

  CatMagick.Component = class {
    constructor() {
      if (components[this.constructor.name]) {
        throw `Component with name <${this.constructor.name}> already exists.`;
      }
      components[this.constructor.name] = this;
    }
  };

  function useAttribute(name) {
    return currentComponent.props[name];
  }

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
      render(!0);
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
      "params": routeParams
    };
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
        render(!0);
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
    render(!0);
  };

  function useElement() {
    function getElement() {
      return getElement[elementContainsSymbol];
    }
    getElement.displayData = () => {
      return getElement().getBoundingClientRect();
    };
    getElement[elementContainsSymbol] = null;
    return getElement;
  }

  function useEvent(event, callback) {
    var localIndex = currentEventIndex++;
    var path = currentPath.join(";");
    if (!events.has(path)) {
      events.set(path, new Map);
    }
    events.get(path).set(localIndex, [event, callback]);
  }

  window.CatMagick = CatMagick;
  window.useAttribute = useAttribute;
  window.useContent = useContent;
  window.useState = useState;
  window.useEffect = useEffect;
  window.useMemo = useMemo;
  window.useCache = useCache;
  window.useLocation = useLocation;
  window.useElement = useElement;
  window.useEvent = useEvent;

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
    render(!0);
  });

  if (document.readyState == "loading") {
    window.addEventListener("DOMContentLoaded", () => render(!0));
  } else {
    render(!0);
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
