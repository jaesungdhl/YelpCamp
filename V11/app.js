const express = require("express");
const expressSession = require("express-session");
const passport = require("passport");
const localStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const bodyParser = require("body-parser");
const app = express({mergeParams: true});
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const Campground = require("./models/campground");
const Comment = require("./models/comment");
const User = require("./models/user")
const seedDB = require ("./seeds");

const campgroundsRoute = require("./routes/campgrounds");
const indexRoute = require("./routes/index");
const commentsRoute = require("./routes/comments");

mongoose.connect("mongodb://localhost:27017/yelpcamp_v11", {useNewUrlParser: true});

//-----------------------------------------------------------//

// seedDB();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.use(expressSession({
    secret:"key is the secret",
    resave: false,
    saveUninitialized: false
}))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use((req,res,next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})
app.use(methodOverride("_method"));
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use("/campgrounds", campgroundsRoute);
app.use(indexRoute);
app.use("/campgrounds/:id/comments", commentsRoute);

app.set("view engine", "ejs");


//-----------------------------------------------------------//

app.listen(process.env.PORT || 3001, function(){
    console.log("Server started");
});

