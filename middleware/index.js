var db = require("../models");
var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

middlewareObj.showUser = function(req, res, next) {
    if(req.isAuthenticated()) {
        db.Post.findOne({
            where: {
                id: req.params.id
            }
        }).then(function(data) {
            if(data && data.author === req.user.username) {
                res.locals.currentUser.show = true;
                return next();
            } else if(data) {
                res.locals.currentUser.show = false;
                return next(); 
            }
            req.flash("error", "Topic not found");
            res.redirect("/topics");            
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("/topics");
    }
}

middlewareObj.checkUser = function(req, res, next) {
    if(req.isAuthenticated()) {
        db.Post.findOne({
            where: {
                id: req.params.id
            }
        }).then(function(data) {
            if(data && data.author === req.user.username) {
                return next();
            } else if(data) {
                req.flash("error", "You don't have permission to do that");
                return res.redirect("/topics");
            }
            req.flash("error", "Topic not found");
            res.redirect("/topics");                
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

module.exports = middlewareObj;