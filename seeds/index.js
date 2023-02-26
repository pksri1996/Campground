const mongoose = require('mongoose');
const campGround = require('../models/campground');
const cities = require('./cities');
const {places,descriptors} = require('./seedHelpers');



main().catch(err => console.log(err));

async function main() {
    mongoose.set('strictQuery', false);
    await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
    console.log(" Mongo Connected");
}      
const db = mongoose.connection;


const sample = function (array){
    return array[Math.floor(Math.random() * array.length)];
} 




const seedDB = async()=> {
    await campGround.deleteMany({});
    for( let i =0;i<300;i++){
        const random1000 = Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random()*30)+10;
        const camp = new campGround({
            author: "63e05f0c36aad4d7cdf507ef",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            geometry: { 
              type: 'Point', 
              coordinates: [ 
                  cities[random1000].longitude,
                  cities[random1000].latitude
               ] 
            },
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                  url: 'https://res.cloudinary.com/drjv3uswb/image/upload/v1676177561/YelpCamp/b6m9otjjp2ldbrmefcdo.jpg',
                  filename: 'YelpCamp/b6m9otjjp2ldbrmefcdo'
                },
                {
                  url: 'https://res.cloudinary.com/drjv3uswb/image/upload/v1676177561/YelpCamp/bd71oyqkn4jk8zqhxsej.jpg',
                  filename: 'YelpCamp/bd71oyqkn4jk8zqhxsej'
                },
                {
                  url: 'https://res.cloudinary.com/drjv3uswb/image/upload/v1676177561/YelpCamp/jmuvrnyfqwx2cxwuzyf9.png',
                  filename: 'YelpCamp/jmuvrnyfqwx2cxwuzyf9'
                }
              ],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut iste repudiandae eligendi voluptatem modi exercitationem inventore asperiores amet laboriosam, ipsa quaerat ipsum ratione molestias ea non praesentium quod unde provident!',
            price: price,
        })
        await camp.save();
    }
}

seedDB();