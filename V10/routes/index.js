const express = require("express");
const passport = require("passport");
const User = require("../models/user");
var router = express.Router();

//-----------------------------------------------------------//

router.get("/", function(req,res){
    res.render("landing");
});

//-----------------------------------------------------------//




router.get("/register", (req,res) => {
    res.render("authentication/register")
})
router.post("/register", (req, res) => {
    User.register(new User({username: req.body.username}), req.body.password,(err,user) => {
        if(err){
            console.log(err);
            return res.render("authentication/register");
        }
        passport.authenticate("local")(req,res,()=>{
            res.redirect("/campgrounds");
        })
    })
})

router.get("/login", (req,res) => {
    res.render("authentication/login");
})
router.post("/login", passport.authenticate("local",{successRedirect: "/campgrounds", failureRedirect:"/login"}), (req,res) => {
});

router.get("/logout", (req,res) => {
    req.logout();
    res.redirect("/");
})

module.exports = router;