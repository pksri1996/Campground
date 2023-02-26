const campGround = require('../models/campground');
const Review = require('../models/review');


module.exports.addReview = async(req,resp)=>{
    const campground = await campGround.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success',"Created new review");
    resp.redirect(`/campgrounds/${campground._id}`);

}

module.exports.deleteReview = async(req,resp)=>{
    await campGround.findByIdAndUpdate(req.params.id,{$pull:{reviews: req.params.reviewID}});
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success',"Deleted");
    resp.redirect(`/campgrounds/${req.params.id}`);
}