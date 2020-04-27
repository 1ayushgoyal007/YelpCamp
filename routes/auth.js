var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");


//Landing PAge Route------------>
router.get("/",function(req,res){
    res.render("landing");
});

//Register --------------------->
router.get('/register',function(req,res){
    res.render('register',{message:req.flash("error")});
});


router.post('/register',function(req,res){
    var newUser = new User({username:req.body.username});
    console.log(newUser);
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            req.flash("error",err.message);
            return res.render('register');
        }else{
            passport.authenticate("local")(req,res,function(){
                req.flash("success","Welcome to YelpCamp " + user.username);
                res.redirect("/campgrounds");
            })
        }
    });
})



//Login----------------------->
router.get("/login",function(req,res){
    res.render('login');
})


router.post('/login',passport.authenticate('local',{
    successRedirect:"/campgrounds",
    failureRedirect:"/login"
}),function(req,res){
    //Do Nothing!
});



//Logut ------------------------>
router.get("/logout",function(req,res){
    req.logout();
    req.flash("success","logged you out");
    res.redirect("/campgrounds");
})

//MiddleWare
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        req.flash("error","You gotta login first");
        res.redirect("/login");
    }
}



module.exports = router;