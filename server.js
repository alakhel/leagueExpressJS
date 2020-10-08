console.log("\033c");
require("dotenv").config();
/**
 *  @includes
 */
const express = require("express");
const server = require("http").createServer(app);
const io = require("socket.io").listen(server);
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const mysql = require("mysql");

/**
 * @created_modules
 */
const homeRouter = require("./Routes/routes");
const realTime = require("./realTime");

/**
 * @global_variables
 */
global.fs = require("fs");
global.debug = true;
global.time = () => {
  const date = new Date();
  return [date.getHours(), date.getMinutes()];
};

/**
 * @connection_to_database
 */
const con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB,
});
con.connect((err, res) => {
  if (err) console.log("[Error]", err.sqlMessage);
  else if (debug)
    console.log("[" + time().join(":") + "][success] connect to db...");
});
global.db = con;

realTime
  .setMatches()
  .then((data) => {
    realTime.run(io, data);
  })
  .catch((err) => console.log(err));

const cookieSession = require("cookie-session");
app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"],
  })
);
app.use(fileUpload({ createParentPath: true }));

/**
 * @public_files
 */
app.use("/assets", express.static(__dirname + "/view/flags"));
app.use("/js", express.static(__dirname + "/view"));

// for parsing application/x-www-form-urlencoded
const urlencodedParser = bodyParser.urlencoded({ extended: true });
// for parsing application/json
const jsonParser = bodyParser.json();

app.use(urlencodedParser);
app.use(jsonParser);

/**
 * @CORS
 */
app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

/**
 * @router
 */
app.use("/", homeRouter);

/**
 * @notFound_404
 */
app.use((req, res, next) => {
  res.setHeader("content-type", "text/plain");
  res.status(404).send("ERROR404!");
});
server.listen(8080);
