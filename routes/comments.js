var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");


//New Comment Form----------------------------------------------------->
router.get("/campgrounds/:id/comments/new",isLoggedIn,function(req,res){
    //find Campground
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new",{campground:campground});
        }
    })
})

//Post Comment--------------------------------------------------------->
router.post("/campgrounds/:id/comments",isLoggedIn,function(req,res){
    //Lookup Campground using ID
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            console.log(req.body.comment);
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    console.log(err);
                }else{
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save Comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    console.log(comment);
                    req.flash("success","Comment Posted Successfully");
                    res.redirect('/campgrounds/'+ campground._id);
                }
            })
        }
    })
})


//Edit a Comment
router.get("/campgrounds/:id/comments/:comment_id/edit",checkOwnerShip,function(req,res){
    Comment.findById(req.params.comment_id,function(err,foundComment){
        if(err){
            res.redirect("back");
        }else{
            res.render('comments/edit',{campground_id:req.params.id,comment:foundComment});
        }
    })
})

//Comment Update
router.put("/campgrounds/:id/comments/:comment_id",checkOwnerShip,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
        if(err){
            res.redirect("back");
        }else{
            req.flash("success","Edit Comment Successfully");
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
})


//Delete Comment
router.delete("/campgrounds/:id/comments/:comment_id",checkOwnerShip,function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err){
            res.redirect("back");
        }else{
            req.flash("success","Comment Delete Successfully!");
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
})

//MiddleWare--------------------->
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        req.flash("error","you need to be logged in to that!!");
        res.redirect("/login");
    }
}

//Check OwnerShip
function checkOwnerShip(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function(err,foundComment){
            if(err){
                res.redirect("back");
            }else{
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }else{
                    
                    res.redirect("back");
                }
            }
        })
    }else{
        res.redirect("back");
    }
}


module.exports = router;