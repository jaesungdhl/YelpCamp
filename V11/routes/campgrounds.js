const express = require("express");
const passport = require("passport");
const Campground = require("../models/campground");
const middlewareObj = require("../middleware/index.js")
var router = express.Router({mergeParams: true});

//INDEX - show all campgrounds
router.get("/", function(req,res){
    console.log(req.user)
    Campground.find({}, function(err, allCampgrounds){
    if(err){
        console.log("Error has occurred");
        console.log(err);
    }
    else{
            res.render("campgrounds/INDEX",{campground:allCampgrounds, currentUser:req.user});
    }});

});

//-----------------------------------------------------------//
//NEW- show form to create new campground
router.get("/new", middlewareObj.isLoggedIn, function(req,res){
    res.render("campgrounds/campForm");
});

//SHOW - show one specific campground for user to see
router.get("/:id", function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log("Error");
        }
        else{
            res.render("campgrounds/show", {campground:foundCampground});
        }
    })
})

//Create- add new campground to the DB
router.post("/", middlewareObj.isLoggedIn, function(req,res){
    Campground.create({
        name: req.body.newCampground,
        image: req.body.URL,
        description: req.body.description,
        author: {id: req.user._id, username: req.user.username}
    },function(err,newCampground){
        if(err){
            console.log("Error")
        }
        else{
            console.log(Campground);
        }
    })
    res.redirect("/campgrounds");
});

//Edit - edit campground in the DB
router.get("/:id/edit", middlewareObj.checkPermission, function(req,res){
    Campground.findById(req.params.id, (err, foundCampground) => {
        if(err){
            res.redirect("back");
        } else {
            res.render("campgrounds/edit", {campground: foundCampground});
        }
    })
})

router.put("/:id", middlewareObj.checkPermission, (req,res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err,updatedCampground) => {
        if(err){
            res.redirect("/campgrounds")
        } else {
            res.redirect("/campgrounds/" + req.params.id)
        }
    })
})

//Destroy - delete campground from the DB
router.delete("/:id", middlewareObj.checkPermission, (req,res) => {
    Campground.findByIdAndRemove(req.params.id, (err) => {
        if(err) {
            console.log(err);
            res.redirect("/campgrounds/:id");
        } else {
            res.redirect("/campgrounds");
        }
    })
})

module.exports = router;