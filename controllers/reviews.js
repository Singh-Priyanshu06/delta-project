const Listing = require("../models/listing")
const Review = require("../models/review")



module.exports.createReview = async(req,res)=>{
   const { id } = req.params;
   let listing = await Listing.findById(id);

   let newReview = new Review(req.body.review);
   newReview.author = req.user._id;
   listing.reviews.push(newReview);
   await newReview.save();
   await listing.save();
  req.flash("success", "New Review Created!");
   res.redirect(`/listings/${listing._id}`);
}

module.exports.deleteReviews = async(req,res)=>{
    let {id,reviewId} = req.params;
    if (!id || !reviewId) {
      throw new ExpressError(400, "Invalid review delete request");
    }
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!");
   res.redirect(`/listings/${id}`);
}