const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const review = require('../controllers/reviews');

const {validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');



router.post('/',isLoggedIn, validateReview, catchAsync(review.addReview));

router.delete('/:reviewID',isReviewAuthor,isLoggedIn, catchAsync(review.deleteReview));

module.exports = router;