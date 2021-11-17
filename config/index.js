const express = require("express");

const logger = require("morgan");

const cookieParser = require("cookie-parser");

const favicon = require("serve-favicon");

const path = require("path");

const session = require("express-session");

const MongoSessionStore = require("connect-mongo")

module.exports = (app) => {
  app.use(logger("dev"));

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/express-basic-auth";

  app.use(session(
    {
      secret: process.env.SESSION_SECRET,
      cookie:{maxAge: 24 * 60 * 60 * 1000}, // One day of 24 hrs
      store: MongoSessionStore.create({ttl: 24 * 60 * 60, mongoUrl: MONGODB_URI}),
      resave: false,
      saveUninitialized: true
    }
  ))

  app.set("views", path.join(__dirname, "..", "views"));
  app.set("view engine", "hbs");
  app.use(express.static(path.join(__dirname, "..", "public")));

  app.use(favicon(path.join(__dirname, "..", "public", "images", "favicon.ico")));
};
