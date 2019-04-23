const express = require("express");
const Campground = require("../models/campground");
const Comment = require("../models/comment")
const middlewareObj = require("../middleware/index.js")
var router = express.Router({mergeParams: true});

//Create- add new comments to a campground
router.get("/new", middlewareObj.isLoggedIn, function(req,res)
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

router.post("/", middlewareObj.isLoggedIn, function(req,res)
{
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

//Edit comments
router.get("/:comment_id/edit", middlewareObj.checkCommentPermission, function(req,res){
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if(err){
            res.redirect("back");
        } else {
            res.render("../views/comments/edit", {campgroundId: req.params.id, comment: foundComment});
        }
    })
})

router.put("/:comment_id", middlewareObj.checkCommentPermission, (req,res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, foundComment) => {
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})

//Delete comments
router.delete("/:comment_id", middlewareObj.checkCommentPermission, (req,res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err, foundComment) => {
        if(err){
            res.redirect("back");
        } else {

            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})

module.exports = router;
