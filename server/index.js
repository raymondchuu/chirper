"use strict";

// Basic express setup:

const PORT          = 8080;
const express       = require("express");
const bodyParser    = require("body-parser");
const app           = express();
const exphbs = require('express-handlebars');
const clientSessions = require('client-sessions');
const dataServiceAuth = require('./lib/data-service-auth.js');

app.engine('.hbs', exphbs({
  defaultLayout: 'main', 
  extname: '.hbs'
}))
app.set('view engine', '.hbs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(clientSessions({
  cookieName: "session",
  secret: "sjfLKJFEjfewiojf234209DfjieDKi3",
  duration: 2 * 60 * 1000,
  activeDuration: 1000 * 60
}));

app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
})
app.use(function(req, res, next) {
  if (!req.session.user) {
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  }
  next();
});

const ensureLogin = (req, res, next) => {
  if (!req.session.user) {
    res.redirect("/login");
  }
  else {
    next();
  }
}

// The in-memory database of tweets. It's a basic object with an array in it.
const db = require("./lib/in-memory-db");

// The `data-helpers` module provides an interface to the database of tweets.
// This simple interface layer has a big benefit: we could switch out the
// actual database it uses and see little to no changes elsewhere in the code
// (hint hint).
//
// Because it exports a function that expects the `db` as a parameter, we can
// require it and pass the `db` parameter immediately:
const DataHelpers = require("./lib/data-helpers.js")(db);

// Update the dates for the initial tweets (data-files/initial-tweets.json).
require("./lib/date-adjust")();

// The `tweets-routes` module works similarly: we pass it the `DataHelpers` object
// so it can define routes that use it to interact with the data layer.
const tweetsRoutes = require("./routes/tweets")(DataHelpers);
const registerRoutes = require("./routes/register")(dataServiceAuth);
const loginRoutes = require("./routes/login");

// Mount the tweets routes at the "/tweets" path prefix:
app.use("/tweets", tweetsRoutes);
app.use("/register", registerRoutes);
app.use("/login", loginRoutes);

app.get('/logout', (req, res) => {
  req.session.reset();
  res.redirect('/login');
})

app.get("/", ensureLogin, (req, res) => {
  res.render("home")
})

dataServiceAuth.initialize()
.then(() => {
  app.listen(PORT, () => {
    console.log("Example app listening on port " + PORT);
  });
})
.catch((err) => {
  console.log("Unable to start server!");
})

