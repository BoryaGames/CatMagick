var chalk = require("chalk");
console.clear();
process.title = "CatMagick";
console.log(`${chalk.cyan("-".repeat(Math.floor((process.stdout.columns - 11) / 2)))}${chalk.red.bgBlack("[CatMagick]")}${chalk.cyan("-".repeat(Math.ceil((process.stdout.columns - 11) / 2)))}`);
log("INFO", "Starting server...");
var fs = require("fs");
var path = require("path");
if (!fs.existsSync(path.join(__dirname, "..", "..", "config.json"))) {
  log("FATAL", `There was no "config.json" file found`);
  process.exit(1);
}
var config = require("../../config.json");
var cattojs = require("catto.js");
var chokidar = require("chokidar");
var babel = require("@babel/core");
var pako = require("pako");
var typeorm = require("typeorm");

config = Object.assign({
  "port": null,
  "domain": null,
  "proxies": 0,
  "sslProxy": false,
  "logRequests": !0,
  "logWebSocket": !0,
  "hotReload": !0,
  "sourceMaps": !0,
  "database": !1,
  "databaseType": "sqlite",
  "databaseFile": "database.db",
  "sessionSecret": null,
  "secureCookie": !0
}, config);

var CatMagick = {};
var options = {
  "proxies": config.proxies,
  "sslProxy": config.sslProxy,
  "secureCookie": config.secureCookie
};
if (config.port) {
  options.port = config.port;
}
if (config.domain) {
  options.domain = config.domain;
}
if (config.sessionSecret) {
  options.secret = config.sessionSecret;
}
var server = new cattojs.Server(options);
var compileCache = {};
var wsClients = [];
var dataSource = null;
var databaseEntities = {};
var databaseRelations = new Map;

CatMagick.dispatchEvent = (event, data, condition) => {
  wsClients.filter(condition || (() => !0)).forEach(wsClient => {
    wsClient.send(pako.deflate(JSON.stringify([event, data])));
  });
};

CatMagick.wholeNumber = {
  "type": "bigint"
};

CatMagick.floatingNumber = {
  "type": "double"
};

CatMagick.limitedText = length => ({
  "type": "varchar",
  length
});

CatMagick.unlimitedText = {
  "type": "text"
};

CatMagick.boolean = {
  "type": "boolean"
};

CatMagick.createDatabase = columns => {
  if (!Object.keys(columns).length) {
    throw "Database must have at least one property.";
  }
  var name = path.basename((new Error).stack.split("\n")[2].match(/\((.+):\d+:\d+\)/)[1]).slice(0, -3);
  var primary = Object.keys(columns)[0];
  for (var column of Object.keys(columns)) {
    if (columns[column] instanceof typeorm.EntitySchema) {
      if (!databaseRelations.has(name)) {
        databaseRelations.set(name, new Map);
      }
      databaseRelations.get(name).set(column, columns[column]);
      var relationPrimary = JSON.parse(JSON.stringify(columns[column].options.columns[Object.keys(columns[column].options.columns)[0]]));
      delete relationPrimary.primary;
      delete relationPrimary.generated;
      columns[column] = relationPrimary;
    }
  }
  columns = JSON.parse(JSON.stringify(columns));
  columns[primary].primary = !0;
  if (columns[primary].type == "bigint") {
    columns[primary].type = "int";
    columns[primary].generated = !0;
  }
  Object.keys(columns).slice(1).forEach(column => columns[column].nullable = !0);
  return new typeorm.EntitySchema({ name, columns });
};

CatMagick.Database = class {
  #repo;

  constructor(name, repo) {
    this.name = name;
    this.#repo = repo;
  }

  async get(props) {
    return await Promise.all((await this.#repo.findBy(props)).map(async entity => {
      var entity2 = {};
      Object.defineProperty(entity2, "_props", {
        get() {
          return entity;
        }
      });
      for (var prop of Object.keys(entity)) {
        if (databaseRelations.has(this.name) && databaseRelations.get(this.name).has(prop) && entity[prop] !== null) {
          entity2[prop] = (await CatMagick.useDatabase(databaseRelations.get(this.name).get(prop).options.name).get(Object.fromEntries([
            [Object.keys(databaseRelations.get(this.name).get(prop).options.columns)[0], entity[prop]]
          ])))[0];
        } else {
          entity2[prop] = entity[prop];
        }
      }
      entity2.edit = async props2 => {
        Object.assign(entity2, props2);
        for (var prop of Object.keys(props2)) {
          if (databaseRelations.has(this.name) && databaseRelations.get(this.name).has(prop) && props2[prop]) {
            entity[prop] = props2[prop]._props[Object.keys(databaseRelations.get(this.name).get(prop).options.columns)[0]];
          } else {
            entity[prop] = props2[prop];
          }
        }
        await this.#repo.save(entity);
      };
      entity2.delete = async () => {
        await this.#repo.remove(entity);
      };
      return entity2;
    }));
  }

  async add(props) {
    if (databaseRelations.has(this.name)) {
      for (var prop of Object.keys(props)) {
        if (databaseRelations.get(this.name).has(prop) && props[prop]) {
          props[prop] = props[prop]._props[Object.keys(databaseRelations.get(this.name).get(prop).options.columns)[0]];
        }
      }
    }
    var entity = this.#repo.create(props);
    await this.#repo.save(entity);
    return entity;
  }

  async delete(props) {
    await this.#repo.delete(props);
  }

  async clear() {
    await this.#repo.clear();
  }
};

CatMagick.useDatabase = name => {
  return new CatMagick.Database(name, dataSource.getRepository(databaseEntities[name]));
};

globalThis.CatMagick = CatMagick;

function configureDatabase(hotReload) {
  if (!fs.existsSync(path.join(__dirname, "..", "..", "databases"))) {
    log("FATAL", `Database is enabled, but there was no "databases" folder found`);
    process.exit(1);
  }
  try {
    var failed = !1;
    var entities = fs.readdirSync(path.join(__dirname, "..", "..", "databases")).map(database => {
      if (failed) {
        return;
      }
      try {
        var value = require(path.join(__dirname, "..", "..", "databases", database));
        if (!(value instanceof typeorm.EntitySchema)) {
          log("WARN", `Skipping invalid database "${database.slice(0, -3)}"`);
        }
        return value;
      } catch(error) {
        if (hotReload) {
          log("ERROR", "Could not complete database hot reload due to the following error:");
          console.error(error);
          failed = !0;
          return;
        }
        log("FATAL", "Could not configure database due to the following error:");
        console.error(error);
        process.exit(1);
      }
    });
    if (failed) {
      return !1;
    }
    entities = entities.filter(entity => entity instanceof typeorm.EntitySchema);
    dataSource = new typeorm.DataSource({
      "type": config.databaseType,
      "database": path.join(__dirname, "..", "..", config.databaseFile),
      "synchronize": !0,
      entities
    });
    databaseEntities = Object.fromEntries(entities.map(entity => [entity.options.name, entity]));
  } catch(error) {
    if (error instanceof typeorm.DriverPackageNotInstalledError) {
      log("FATAL", `You are using ${error.message.match(/^([A-Za-z0-9_-]+) package has not been found installed/)[1]} database, but "${error.message.match(/npm install ([A-Za-z0-9_-]+) --save/)[1]}" is not installed`);
      process.exit(1);
    }
    log("FATAL", "Could not configure database due to the following error:");
    console.error(error);
    process.exit(1);
  }
  return !0;
}

if (config.database) {
  configureDatabase(!1);
}

if (!fs.existsSync(path.join(__dirname, "..", "..", "routes"))) {
  log("FATAL", `There was no "routes" folder found`);
  process.exit(1);
}

if (!fs.existsSync(path.join(__dirname, "..", "..", "middleware"))) {
  log("FATAL", `There was no "middleware" folder found`);
  process.exit(1);
}

function log(type, text) {
  var color = "white";
  if (type == "SUCCESS") {
    color = "green";
  }
  if (type == "WARN") {
    color = "yellow";
  }
  if (type == "ERROR") {
    color = "redBright";
  }
  if (type == "FATAL") {
    color = "red";
  }
  console.log(`${chalk[color](`[${(new Date).toLocaleString("ru-RU").split(", ").join(" / ")}] ${type}`)} - ${chalk[color](text)}`);
}

function patchHTML(code) {
  var doctype = code.startsWith("<!DOCTYPE html>");
  if (doctype) {
    code = code.replace(/^<!DOCTYPE html>(\r?\n)?/, "");
  }
  return `${doctype ? "<!DOCTYPE html>\n" : ""}<link href="/catmagick_client.css" rel="stylesheet">\n<script src="/catmagick_client.js"></script>\n${code}`;
}

server.use((req, res, next) => {
  res.header("X-Powered-By", "CatMagick");

  var originalEnd = res.end;
  res.end = function() {
    originalEnd.apply(res, arguments);
    if (config.logRequests) {
      var type = (res.statusCode < 400) ? "INFO" : "ERROR";
      var statusTexts = {
        "101": "Switching Protocols",
        "200": "OK",
        "201": "Created",
        "202": "Accepted",
        "204": "No Content",
        "206": "Partial Content",
        "301": "Moved Permanently",
        "302": "Found",
        "304": "Not Modified",
        "307": "Temporary Redirect",
        "308": "Permanent Redirect",
        "400": "Bad Request",
        "401": "Unauthorized",
        "402": "Payment Required",
        "403": "Forbidden",
        "404": "Not Found",
        "405": "Method Not Allowed",
        "406": "Not Acceptable",
        "408": "Request Timeout",
        "409": "Conflict",
        "410": "Gone",
        "411": "Length Required",
        "413": "Payload Too Large",
        "414": "URI Too Long",
        "415": "Unsupported Media Type",
        "418": "I'm a teapot",
        "423": "Locked",
        "429": "Too Many Requests",
        "500": "Internal Server Error",
        "501": "Not Implemented",
        "502": "Bad Gateway",
        "503": "Service Unavailable",
        "504": "Gateway Timeout",
        "507": "Insufficient Storage",
        "520": "Unknown Error",
        "521": "Web Server Is Down",
        "522": "Connection Timed Out"
      };
      log(type, `${req.ip} - ${req.method} ${req.path} - ${res.statusCode}${statusTexts[res.statusCode] ? ` ${statusTexts[res.statusCode]}` : ""}`);
    }
  };

  var originalSendFile = res.sendFile;
  res.sendFile = function(filePath) {
    if (filePath.endsWith(".html")) {
      res.header("Content-Type", "text/html; charset=UTF-8");
      return res.end(patchHTML(fs.readFileSync(filePath).toString("utf-8")));
    }
    if (filePath.endsWith(".jsx")) {
      res.header("Content-Type", "text/jsx; charset=UTF-8");
      try {
        var compiled = babel.transformSync(fs.readFileSync(filePath).toString("utf-8"), {
          "plugins": ["babel-plugin-transform-catmagick-jsx"],
          "sourceMaps": config.sourceMaps ? "inline": !1,
          "sourceFileName": path.basename(filePath)
        }).code;
        compileCache[filePath] = compiled;
      } catch(err) {
        log("ERROR", `${req.path} - Cannot compile JSX due to the following error:`);
        console.error(err.message);
      }
      return res.end(compileCache[filePath]);
    }
    return originalSendFile.apply(res, arguments);
  };

  next();
}).ws("/events", (ws, req) => {
  wsClients.push(ws);
  if (config.logWebSocket) {
    log("INFO", `${req.ip} - WebSocket user connected`);
  }
  ws.on("message", message => {
    if (message == "PING") {
      ws.send("PONG");
    }
  });
  ws.on("close", () => {
    wsClients = wsClients.filter(wsClient => wsClient !== ws);
    if (config.logWebSocket) {
      log("INFO", `${req.ip} - WebSocket user disconnected`);
    }
  });
}).use(async (req, res, next) => {
  for (var middleware of fs.readdirSync(path.join(__dirname, "..", "..", "middleware"))) {
    if (!await require(path.join(__dirname, "..", "..", "middleware", middleware))(req, res, next)) {
      return;
    }
  }

  if (req.path == "/catmagick_client.css") {
    return res.sendFile(path.join(__dirname, "catmagick_client.css"));
  }
  if (req.path == "/catmagick_client.js") {
    res.header("Content-Type", "application/javascript; charset=UTF-8");
    return res.end(fs.readFileSync(path.join(__dirname, "pako_inflate.min.js")).toString("utf-8") + "\n\n" + fs.readFileSync(path.join(__dirname, "catmagick_client.js")).toString("utf-8"));
  }

  var parts = req.path.split("/").filter(part => part);
  var currentDirectory = path.join(__dirname, "..", "..", "routes");
  while(parts.length) {
    var part = parts.shift();
    if (part.split(".").join("")) {
      var elements = fs.readdirSync(currentDirectory);
      if (elements.includes(part) && part != "_route.js") {
        currentDirectory = path.join(currentDirectory, part);
      } else if (elements.find(element => element.length > 1 && element.startsWith("$"))) {
        req.params[elements.find(element => element.length > 1 && element.startsWith("$")).slice(1)] = part;
        currentDirectory = path.join(currentDirectory, elements.find(element => element.length > 1 && element.startsWith("$")));
      } else if (elements.includes("$")) {
        currentDirectory = path.join(currentDirectory, "$");
      } else {
        return next();
      }
    }
  }
  if (fs.statSync(currentDirectory).isFile()) {
    return res.sendFile(currentDirectory);
  }
  if (fs.existsSync(path.join(currentDirectory, "_route.js"))) {
    try {
      var methods = await require(path.join(currentDirectory, "_route.js"));
      if (!methods[req.method.toLowerCase()]) {
        res.status(405);
        if (fs.existsSync("405.html")) {
          return res.sendFile(path.join(__dirname, "..", "..", "405.html"));
        }
        return res.end("405 Method Not Allowed");
      }
      return methods[req.method.toLowerCase()](req, res, next);
    } catch(err) {
      log("ERROR", `${req.path} - Cannot execute route due to the following error:`);
      console.error(err);
      res.status(500);
      if (fs.existsSync("500.html")) {
        return res.sendFile(path.join(__dirname, "..", "..", "500.html"));
      }
      return res.end("500 Internal Server Error");
    }
  }
  if (fs.existsSync(path.join(currentDirectory, "index.html"))) {
    return res.sendFile(path.join(currentDirectory, "index.html"));
  }
  if (!fs.readdirSync(currentDirectory).length) {
    log("WARN", `${req.path} - Found empty directory`);
  }
  next();
}).use((req, res) => {
  res.status(404);
  if (fs.existsSync("404.html")) {
    res.sendFile(path.join(__dirname, "..", "..", "404.html"));
  } else {
    res.end("404 Not Found");
  }
}).on("running", () => {
  log("SUCCESS", `Server is running on ${chalk.cyan.underline(`0.0.0.0:${server.options.port}`)}`);
});

if (config.database) {
  dataSource.initialize().then(() => {
    log("SUCCESS", "Database connected successfuly");
    server.run();
  }).catch(error => {
    log("FATAL", "Could not connect to database due to the following error:");
    console.error(error);
  });
} else {
  server.run();
}

if (config.hotReload) {
  chokidar.watch([
    path.join(__dirname, "..", "..", "middleware"),
    path.join(__dirname, "..", "..", "routes")
  ], {
    "cwd": path.join(__dirname, "..", ".."),
    "ignored": (path2, stats) => stats && stats.isFile() && path.basename(path.join(path2, "..")) != "middleware" && path.basename(path2) != "_route.js"
  }).on("change", file => {
    file = file.split("\\").join("/");
    if (path.basename(path.join(file, "..")) == "middleware") {
      log("INFO", `/${path.basename(file)} - Doing middleware hot reload`);
    } else {
      log("INFO", `/${file.replace("routes/", "").slice(0, -10)} - Doing route hot reload`);
    }
    delete module.constructor._cache[require.resolve(path.join(__dirname, "..", "..", file))];
  });

  if (config.database) {
    chokidar.watch(path.join(__dirname, "..", "..", "databases"), {
      "cwd": path.join(__dirname, "..", "..", "databases"),
      "ignoreInitial": !0
    }).on("all", async (event, file) => {
      if (event == "addDir" || event == "unlinkDir") {
        return;
      }
      log("INFO", "Doing database hot reload...");
      delete module.constructor._cache[require.resolve(path.join(__dirname, "..", "..", "databases", file))];
      if (dataSource.isInitialized) {
        try {
          await dataSource.destroy();
          log("INFO", "Database disconnected due to hot reload");
        } catch {
          // Database might be in connecting state, we ignore that
        }
      }
      if (configureDatabase(!0)) {
        dataSource.initialize().then(() => {
          log("SUCCESS", "Database hot reload completed");
        }).catch(error => {
          log("ERROR", "Could not connect to database due to the following error:");
          console.error(error);
        });
      }
    });
  }
}

CatMagick.server = server;
