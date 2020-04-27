var express = require("express");
var passport = require('passport');
var methodOverride = require("method-override");
var localStrategy = require("passport-local");
var app = express();
var flash = require("connect-flash");

app.set("view engine","ejs"); 
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());

var mongoose = require("mongoose");
mongoose.connect("mongodb+srv://ayush:ayush@yelpcamp-1bcdk.mongodb.net/test?retryWrites=true&w=majority",{useNewUrlParser:true, useUnifiedTopology:true});
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));

//Seed Data
// var seedDB = require("./seeds");
// seedDB();    


//Requiring Routes------------------------>
var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/auth");



//Requiring Models------------------------>
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require('./models/user');




//Passport Configuration------------------>
app.use(require("express-session")({
    secret:"Once Again I am Here!!",
    resave:false,
    saveUninitialized:false
}));


app.use(passport.initialize());
app.use(passport.session());
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success"); 
    next();
})

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//Using Exported Routes------------------>
app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);




//Port--------------------------------->
app.set("port", process.env.PORT || 4000);
app.listen(app.get("port"), function(req,res){

      console.log("Application running in port: " + app.get("port"));
});