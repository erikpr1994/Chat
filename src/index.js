"use strict";

const express = require("express");
const bodyparser = require("body-parser");
const app = express();
const websocket = require("./websocket");

const path = require("path");

const config = require("./config");

const router = require("./router");

const database = require("./models/index").connection;

app.use(bodyparser.json());
app.use(express.static(path.join(__dirname, "./view")));
app.use(router);

database.on("error", console.error.bind(console, "connection error: "));
database.once("open", function () {
  app.listen(config.port, config.hostname, () => {
    websocket();
  });
});
