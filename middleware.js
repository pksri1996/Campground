const {campgroundSchema,reviewSchema} = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const campGround = require('./models/campground'); 
const Review = require('./models/review');


module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in');
        return res.redirect('/login');
    }
    next()
}


module.exports.validateCampground = (req,resp,next)=>{
    const {error} = campgroundSchema.validate(req.body);
    if(error){
         const msg = error.details.map(el => el.message).join(',');
         throw new ExpressError(msg, 400);
    }
    else{
         next();
    }
}

module.exports.isAuthor = async (req,resp,next)=>{
    const {id} = req.params;
    const campground = await campGround.findById(id);
    if(req.user && !campground.author.equals(req.user._id)){
        req.flash('error', "You do not have the permission for this");
        return resp.redirect(`/campgrounds/${id}`);
    }
    next();
}
module.exports.isReviewAuthor = async (req,resp,next)=>{
    const {id,reviewID} = req.params;
    const review = await Review.findById(reviewID);
    if(req.user && !review.author.equals(req.user._id)){
        req.flash('error', "You do not have the permission for this");
        return resp.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.validateReview =(req,res,next)=>{
    const{error} = reviewSchema.validate(req.body);
    if(error){
         const msg = error.details.map(el => el.message).join(',');
         throw new ExpressError(msg, 400);
    }
    else{
         next();
    }
}