#!/usr/bin/env node

require("dotenv").config();
var app = require("./config/app");
var debug = require("debug")("infrproject:server");
var http = require("http");
var fetch = require("node-fetch");
var express = require("express");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

var port = normalizePort(process.env.PORT || "4000");
app.set("port", port);

app.locals.CF_Site_Key = process.env.CF_Site_Key;
const SECRET_KEY = process.env.CF_Secret_Key;

var server = http.createServer(app);

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

function normalizePort(val) {
  var port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
}

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }
  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}

app.post("/create", async (req, res) => {
  try {
    const token = req.body["cf-turnstile-response"];
    if (!token) {
      return res.status(400).send("Missing Turnstile token");
    }

    const formData = new URLSearchParams();
    formData.append("secret", SECRET_KEY);
    formData.append("response", token);
    formData.append("remoteip", req.ip);

    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();

    if (result.success) {
      res.redirect("/");
    } else {
      res
        .status(400)
        .send(
          `Verification failed: ${
            result["error-codes"].join(", ") || "Unknown error"
          }`
        );
    }
  } catch (error) {
    console.error("Error during Turnstile validation:", error);
    res.status(500).send("Internal server error during validation");
  }
});
