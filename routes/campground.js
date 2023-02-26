const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const campground = require('../controllers/campgrounds');
const {isLoggedIn,isAuthor,validateCampground} = require('../middleware');
const multer  = require('multer')
const {storage} = require('../cloudinary');
const upload = multer({ storage });


router.get('/', catchAsync(campground.index));

router.route('/new')
    .get( isLoggedIn,campground.renderNewForm)
    .post(isLoggedIn,upload.array('image'),validateCampground, catchAsync(campground.createCampground))



router.route('/:id')
    .get(catchAsync(campground.showCampground))
    .put(isAuthor,isLoggedIn,upload.array('image'),validateCampground, catchAsync(campground.updateCampground))
    .delete(isAuthor,isLoggedIn, catchAsync(campground.deleteCampground))


router.route('/:id/edit')
    .get(isLoggedIn,isAuthor,catchAsync(campground.renderEditForm));


module.exports = router;