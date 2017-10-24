var express = require("express");
var router = express.Router();
var passport = require("passport");
var db = require("../models");

router.get("/", function(req, res) {
  res.redirect("/topics");
});

//AUTH ROUTES

router.get("/register", function(req, res) {
  res.render("register");
});

router.post("/register", function(req, res) {
  db.User.register(new db.User({username: req.body.username}), req.body.password, function(err, user) {
    if(err) {
      req.flash("error", err.message);
      return res.redirect("/register");
    }
    passport.authenticate("local")(req, res, function() {
      req.flash("success", "Welcome to Nuanced " + user.username);
      res.redirect("/topics");
    });
  });
});

router.get("/login", function(req, res) {
  res.render("login");
});

router.post("/login", passport.authenticate("local",
  {
    successRedirect: "/topics",
    failureRedirect: "/login"
  }), function(req, res) {
});

router.get("/logout", function(req, res) {
  req.logout();
  req.flash("success", "Logged Out");
  res.redirect("/topics");
});

//ABOUT
router.get("/about", function(req, res) {
  db.Post.findAll({}).then(function(data) {
    res.render("about", { posts: data });
  });
});

module.exports = router;