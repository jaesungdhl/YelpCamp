const Campground = require("../models/campground.js")
const Comment = require("../models/comment.js");
const User = require("../models/user.js");
var middlewareObj = {};

middlewareObj.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    } else {
        req.flash("error", "Please log in first.")
        res.redirect("/login");
    }
}

middlewareObj.checkPermission = (req,res,next) => {
//is user logged in
if(req.isAuthenticated())
{
    Campground.findById(req.params.id, (err, foundCampground) => {
        if(err)
        {
            req.flash("error", "An error has occurred. Please retry again.")
            console.log(err);
            res.redirect("back");
        }
        else 
        {
            if(foundCampground.author.id.equals(req.user._id))
            {
                next();
            }
            else
            {
                res.redirect("back");
            }
        }
    })
}
else 
{
    req.flash("error", "You don't have access to this post.")
    res.redirect("back");
}
}

middlewareObj.checkCommentPermission = (req,res,next) => {
//is user logged in
if(req.isAuthenticated())
{
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if(err)
        {
            req.flash("error", "An error has occurred. Please retry again.")
            console.log(err);
            res.redirect("back");
        }
        else 
        {
            if(foundComment.author.id.equals(req.user._id))
            {
                next();
            }
            else
            {
                res.redirect("back");
            }
        }
    })
}
else 
{
    req.flash("error", "You don't have access to this comment post.")
    res.redirect("back");
}
}

module.exports = middlewareObj;
