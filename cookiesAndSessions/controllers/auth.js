const User = require('../models/user');

exports.getLogin = (req,res,next) => {
    // console.log(req.get('Cookie').trim().split('=')[1]);
    // const isLoggedIn = req.get('Cookie').trim().split('=')[1] === 'true';
    
    // console.log(req.session.isLoggedIn);
    
    res.render('auth/login',{
        pageTitle:'Login',
        path: '/login',
        isAuthenticated:req.session.isLoggedIn
    });
    
}

exports.postLogin = (req,res,next) => {
    //set cookie
    // res.setHeader('Set-Cookie','isLoggedIn=true;Max-Age=10');
    // res.setHeader('Set-Cookie','isLoggedIn=true;HttpOnly');
    
    // store current user midleware for a global user can be use in the entire project
    User.findById("5da05c9f686a7015c84922ab")
        .then(user => {
            
            req.session.isLoggedIn = true; //session object add to the middleware
            //store the user fetch from the database in a request variable
            req.session.user = user;
            //call the next function if we got our user stored
            req.session.save((err) => {
                console.log(err);
                res.redirect('/');
            })
            
        })
        .catch(err => console.log(err));
}

exports.postLogout = (req,res,next) => {
    //destroy the session
    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/');
    })
}