var express = require("express");
var router = express.Router({mergeParams:true});
var Campground = require("../models/campground");




//Index Route(Show all Campgrounds)
router.get("/campgrounds",function(req,res){
    
    Campground.find({},function(err,allCampgrounds){
        if(err){
            console.log(err)
        }else{
         res.render("campgrounds/index",{campgrounds:allCampgrounds });
        }
    })
});



//Create Route(Add new Campground in DB)
router.post("/campgrounds",isLoggedIn,function(req,res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username:req.user.username
    }
    var newCampground = {name:name,image:image,description:desc,author:author};
    //Add New Campground in DB
    Campground.create(newCampground,function(err,newlyCreated){
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/campgrounds");
        }
    });
});



//New Route(Show form to craete new Campground)
router.get("/campgrounds/new",isLoggedIn,function(req,res){
    res.render("campgrounds/new");
})



//Show Route(Show Page of a PAticular ID)
router.get("/campgrounds/:id",function(req,res){
    //Find the Campgrounds with Provided ID
    var id = req.params.id;
    Campground.findById(id).populate("comments").exec(function(err,foundCampground){
        if(err){
            console.log(err)
        }else{
            console.log(foundCampground);
            //render show page
            res.render("campgrounds/show",{campground:foundCampground});
        }
    });
})

//Edit Campground Route-------------->
router.get("/campgrounds/:id/edit",checkOwnerShip,function(req,res){
        Campground.findById(req.params.id,function(err,foundCampground){
            if(err){
                res.redirect("/campgrounds");
            }else{
                res.render("campgrounds/edit",{campground:foundCampground});
            }
        })
    });
    





//Update Campground Route--------------->
router.put("/campgrounds/:id",checkOwnerShip,function(req,res){
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
        if(err){
            console.log(err);
            res.redirect('/campgrounds');
        }else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
})

//Delete Campground Route---------------->
router.delete("/campgrounds/:id",checkOwnerShip,function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect('/campgrounds');
        }
    })
})



//MiddleWare---------------------->

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        req.flash("error","Login First!!");
        res.redirect("/login");
    }
}


//Check Ownership
function checkOwnerShip(req,res,next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id,function(err,foundCampground){
            if(err){
                req.flash("Campground Not Found");
                res.redirect("back");
            }else{
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error","You dont have permission to do that!!");
                    res.redirect("back");
                }
            }
        })
    }else{
        req.flash("error","Login First!!");
        res.redirect("back");
    }
}




module.exports = router;