// http://nuanced-ryandahlke.c9users.io/

var methodOverride = require("method-override");
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var exphbs = require("express-handlebars");
var db = require("./models");
var helpers = require('handlebars-helpers')();
var passport = require("passport");
var LocalStrategy = require("passport-local");
var flash = require("connect-flash");

var indexRoutes = require("./routes/index");
var topicsRoutes = require("./routes/topics");


app.set("view engine", "handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.use(express.static(__dirname + "/public"));

app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(flash());

app.use(require("express-session")({
  secret: "my secret",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(db.User.createStrategy());

passport.serializeUser(db.User.serializeUser());
passport.deserializeUser(db.User.deserializeUser());

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use("/", indexRoutes);
app.use("/topics", topicsRoutes);

db.sequelize.sync({ force: false }).then(function() {
  app.listen(process.env.PORT, function() {
    console.log("Server started");
  });
});