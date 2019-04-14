const express = require("express");
const Campground = require("../models/campground");
const Comment = require("../models/comment")
var router = express.Router({mergeParams: true});

//Create- add new comments to a campground
router.get("/new", isLoggedIn, function(req,res)
{
    console.log(req.params.id)
    Campground.findById(req.params.id, function(err, campground)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render("comments/new", {campground: campground});   
        }
    })
})

router.post("/", isLoggedIn, function(req,res)
{
    console.log(req.params.id)
    Campground.findById(req.params.id, function(err, campground)
    {
        if(err)
        {
            console.log(err);
            res.redirect("/campgrounds");
        }
        else
        {
            Comment.create(req.body.comment, function(err,comment)
            {
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();

                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id)
                }
            })
        }
    })
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect("/login");
    }
}

module.exports = router;
