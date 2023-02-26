if(process.env.NODE_ENV !== "production"){
     require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');
const dbURL = process.env.DBURL || 'mongodb://127.0.0.1:27017/yelp-camp';
const MongoDBStore = require("connect-mongo")(session);


const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campground');
const reviewRoutes = require('./routes/reviews');

main().catch(err => console.log(err));
async function main() {
    mongoose.set('strictQuery', false);
    await mongoose.connect(dbURL);
    console.log(" Mongo Connected");
}                 


app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public'))); //This is to serve static script on boilerplate
app.use(flash());
app.use(mongoSanitize());
const secret = process.env.SECRET || 'thisshouldbeabettersecret!';


const store = new MongoDBStore({
     url: dbURL,
     secret,
     touchAfter: 24*60*60
});
store.on("error",function(e){
     console.log("Session store Error");
})

const sessionConfig = {
     store,
     name: 'session',
     secret,
     resave:false,
     saveUninitialized:true,
     cookie: {
          httpOnly: true,
          // secure: true,
          expires: Date.now()+1000*60*60*24*7,
          maxAge: 1000*60*60*24*7
     }
}
app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{ 
     res.locals.currentUser = req.user;
     res.locals.success = req.flash('success');
     res.locals.error = req.flash('error');
     next();

})


app.use('/',userRoutes);
app.use('/campgrounds',campgroundRoutes);
app.use('/campgrounds/:id/reviews',reviewRoutes);



app.get('/',(req,resp)=>{
     resp.render('home');
}) 




app.all('*', (req,resp,next)=>{
     next(new ExpressError('Page not found',404));

})

app.use((err,req,resp,next)=>{
     const { statusCode = 500} = err;
     if(!err.message) err.message = 'Oh No, Something Went Wrong'
     resp.status(statusCode).render('error',{err});
})


 const port = process.env.PORT || 3000
app.listen(port,()=>{
     console.log(`Connected to port ${port}`);
})                                                 
                                                                                                                                         