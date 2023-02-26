const User = require('../models/user');

module.exports.createUser = async(req,res,next)=>{
    try{
    const {email, username, password} = req.body;
    const user = new User({email,username});
    const registeredUser = await User.register(user,password);
    req.login(registeredUser, err =>{
        if(err) return next(err);
        req.flash('success',"Welcome to Yelpcamp");
    res.redirect('/campgrounds');
    })
    
    }catch(e){
        req.flash('error', e.message);
        res.redirect('/register');
    }
    
}

module.exports.renderLogin = (req,res)=>{
    res.render('users/login');
}


module.exports.login = (req,res)=>{
    req.flash('success', "Congrats you're in");
    const redirectUrl = req.session.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
}

module.exports.logout = (req,res)=>{
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success', "Done with this");
        res.redirect('/campgrounds');
      });
}

module.exports.renderRegister = (req,res)=>{
    res.render('users/register');
}