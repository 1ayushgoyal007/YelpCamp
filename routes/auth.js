var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var nodemailer = require('nodemailer')
var mailgun = require('nodemailer-mailgun-transport');


var auth  = {
    auth:{
        api_key:'ae38a63ca682318f4fab19a98c52a087-0afbfc6c-10633345',
        domain:'sandboxea35af3501e241bb9eaf9712703caa23.mailgun.org'
    }
}

var transporter = nodemailer.createTransport(mailgun(auth));

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
    failureRedirect:"/login",
    successFlash:'Login Successfully'
}),function(req,res){
    //Do Nothing!
});



//Logut ------------------------>
router.get("/logout",function(req,res){
    req.logout();
    req.flash("success","Logout Successfully");
    res.redirect("/campgrounds");
})


//Contact Route---------------------->
router.get('/contact',function(req,res){
    res.render('contact');
})

router.post('/contact',function(req,res){


    var mailOptions = {
        from: req.body.email,
        to : '1ayushgoyal007@gmail.com',
        subject: req.body.subject,
        text: req.body.message
    };
    transporter.sendMail(mailOptions,function(err,data){
        if(err){
            console.log(err);
            req.flash('error',"Something went Wrong");
            res.redirect('back');
        }else{
            console.log('message sent');
            req.flash("success","mail send successfully");
            res.redirect('/campgrounds');
        }
    });
    
})


//MiddleWare
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        req.flash("error","Login First!!");
        res.redirect("/login");
    }
}



module.exports = router;