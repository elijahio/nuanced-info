var express = require("express");
var router = express.Router();
var db = require("../models");
var middleware = require("../middleware");

//INDEX
router.get("/", function(req, res) {
  console.log(res.locals.moment);
  db.Post.findAll({order: [['updatedAt', 'DESC']]}).then(function(data) {
    res.render("index", { posts: data });
  });
});

//NEW
router.get("/new", middleware.isLoggedIn, function(req, res) {
  res.render("new");
});

//CREATE
router.post("/", middleware.isLoggedIn, function(req, res) {
  db.Post.create(req.body.topic).then(function(results) {
    results.author = req.user.username;
    results.save();
    req.flash("success", "Topic created");
    res.redirect("/topics");
  });
});

//SHOW
router.get("/:id", middleware.isLoggedIn, middleware.showUser, function(req, res) {
  db.Post.findOne({
    where: {
      id: req.params.id
    }
  }).then(function(data) {
    res.render("show", { posts: data });
  });
});

//EDIT
router.get("/:id/edit", middleware.checkUser, function(req, res) {
  db.Post.findOne({
    where: {
      id: req.params.id
    }
  }).then(function(data) {
    res.render("edit", { posts: data });
  });
});

//UPDATE
router.put("/:id", middleware.checkUser, function(req, res) {
  db.Post.update(req.body.topic,
  {
    where: {
      id: req.params.id
    }
  }).then(function(data) {
    res.redirect("/topics/" + req.params.id);
  });
});

//DELETE
router.delete("/:id", middleware.checkUser, function(req, res) {
  db.Post.destroy({
    where: {
      id: req.params.id
    }
  }).then(function(data) {
    req.flash("success", "Topic deleted");
    res.redirect("/topics");
  });
});

module.exports = router;