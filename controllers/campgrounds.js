const campGround = require('../models/campground');
const {cloudinary} = require("../cloudinary");
const mbxGeocoding =  require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken});

module.exports.index = async(req,resp)=>{
    const campgrounds = await campGround.find({});
    resp.render('campgrounds/index', {campgrounds});
}

module.exports.renderNewForm = (req,resp)=>{

    resp.render('campgrounds/new');
}

module.exports.createCampground = async (req, resp)=>{
    

    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const campground = new campGround(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    campground.author = req.user._id;
    await campground.save();
    console.log(campground);
    req.flash('success','Added a new Campground');
    resp.redirect('/campgrounds');
}

module.exports.showCampground = async(req,resp)=>{
    const {id} = req.params;
    const campground = await campGround.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if(!campground){
        req.flash('error','Cannot find the campground')
        resp.redirect('/campgrounds');
    }
    resp.render('campgrounds/show',{campground});

}

module.exports.updateCampground = async(req,resp)=>{
    
    const {id} = req.params;
    const campground = await campGround.findByIdAndUpdate(id,{...req.body.campground});
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages } } } })
        console.log(campground);
    }
    campground.images.push(...imgs);
    campground.save();

    req.flash('success',"Succesfully Updated!!");
    resp.redirect('/campgrounds');
}


module.exports.renderEditForm = async(req,resp)=>{
    const {id} = req.params;
    const campground = await campGround.findById(id);
    if(!campground){
        req.flash('error', 'There is no Campground with that id');
        return resp.redirect('/campgrounds');
    }
    resp.render('campgrounds/edit',{campground});
}

module.exports.deleteCampground = async(req,resp)=>{
    const {id} = req.params;
    await campGround.findByIdAndDelete(id);
    req.flash('success',"Succesfully Deleted!!");
    resp.redirect('/campgrounds');
}
