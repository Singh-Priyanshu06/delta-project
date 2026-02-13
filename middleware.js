const Listing = require("./models/listing");
const Review = require("./models/review.js")
const ExpressError = require("./utils/ExpressError")
const {listingSchema,reviewSchema} = require("./schema.js")



module.exports.isLoggedIn = (req,res,next)=>{
    // console.log(req.path,"..",req.originalUrl)
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","you must be logged in to create listings!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl =  req.session.redirectUrl;
    }
    next();
};

// module.exports.isOwner = async(req,res,next)=>{
//     let {id}= req.params;
//    let listing = await Listing.findById(id);
//    if(!currUser && listing.owner_id.equals(res.locals.currUser._id)){
//     req.flash("error","You don't have permission to edit");
//     return res.redirect(`/listings/${id}`)
//    }
//    next();
// };
module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    if (!req.user || !listing.owner.equals(req.user._id)) {
        req.flash("error", "You don't have permission to edit");
        return res.redirect(`/listings/${id}`);
    }

    next();
};


module.exports.validateListing= (req,res,next)=>{
   let {error}= listingSchema.validate(req.body);
  if(error){
    let errMsg = error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg);
  }else{
    next();
  }
};

module.exports.validateReview = (req,res,next)=>{
  let {error}= reviewSchema.validate(req.body);
  if(error){
    let errMsg = error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg);
  }else{
    next();
  }
}

module.exports.isReviewAuthor = async(req,res,next)=>{
    let {id, reviewId}= req.params;
   let listing = await Listing.findById(id);
  //  if(!reviewId.author.equals(res.locals.currUser._id)){
  if (!review.author.equals(req.user._id)) {
    req.flash("error","You don't have permission to delete");
    return res.redirect(`/listings/${id}`)
   }
   next();
};
