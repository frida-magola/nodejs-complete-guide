const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodeMailer = require('nodemailer');
require('dotenv').config();

const User = require('../models/user');

//create a transporter
const transporter = nodeMailer.createTransport({
    service:'gmail',
    auth:{ //sender 's account 
        user:process.env.EMAIL ,
        pass: process.env.PASSWORD
    }
});

exports.getLogin = (req,res,next) => {
    let message = req.flash('error');
    
    if (message.length > 0) {
        message = message[0];
    }
    else {
        message = null;
    }
    console.log(req.flash('error'));
    // console.log(req.session.isLoggedIn);
    res.render('auth/login',{
        pageTitle:'Login',
        path: '/login',
        errorMessage:message
    });
    
}

exports.getSignup = (req,res,next) => {
    let message = req.flash('error');
    
    if (message.length > 0) {
        
        message = message[0];
    }
    else {
       message = null; 
    }
    res.render('auth/signup',{
        path: '/signup',
        pageTitle:'Signup',
        errorMessage:message
    })
}

exports.getReset = (req,res,next) => {
    
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    }else{
        message = null;
    }
    res.render('auth/reset',{
       pageTitle: 'Reset Password',
       path: '/reset',
       errorMessage:message,
    });
}

exports.postLogin = (req,res,next) => {
    
    const email = req.body.email;
    const password = req.body.password;
    //chech user
    User.findOne({ email:email })
        .then(user => {
            if (!user) {
                req.flash('error','Invalid email or password');
                return res.redirect('/login');
            }
            bcrypt.compare(password,user.password)
                .then(doMatch => {
                    if (doMatch) {
                        req.session.isLoggedIn = true; //session object add to the middleware
                        //store the user fetch from the database in a request variable
                        req.session.user = user;
                        //call the next function if we got our user stored
                        return req.session.save((err) => {
                            console.log(err);
                            res.redirect('/');
                        });  
                    }
                    req.flash('error','Invalid email or password');
                    res.redirect('/login');
                })
                .catch(err => {
                    console.log(err);
                    res.redirect('/login');
                }); 
        })
        .catch(err => console.log(err));
}

exports.postLogout = (req,res,next) => {
    //destroy the session
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    })
}

exports.postSignup = (req,res,next) => {
    
   const username = req.body.username;
   const email = req.body.email;
   const password = req.body.password;
   const confirmPassword = req.body.confirmPassword;
   
    //send a email 
    let mailOptions = { //receipient 's account
        from:'mwalilanyira@gmail.com',
        to:email,
        subject:'signup succeded',
        text:'you successfully signed up!'
    };
   
   //chech if the email exist 
   User.findOne({email:email})
    .then(userDoc => {
        if (userDoc) {
            req.flash('error','E-Mail exist already please pick a different one.');
            return res.redirect('/signup');   
        }
        
        return bcrypt.hash(password,12)
            .then(hashPassword => {
                const user = new User({
                    username:username,
                    email:email,
                    password:hashPassword,
                    cart:{ items:[] }
                });
                
                return user.save();
            }) //return a promise
    })
    .then(result => {
        //this block is called when user.save() is done 
        res.redirect('/login');
        return transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message %s sent: %s', info.messageId, info.response)
        })
        .catch(err => console.log(err)); 
    })
    .catch(err => console.log(err))
}

exports.postReset = (req,res,next) => {
    
    crypto.randomBytes(32, (err,buffer) => {
        if (err) {
            console.log(err);
            res.redirect('/reset');
        }
        const token = buffer.toString('hex');
        User.findOne({ email:req.body.email})
            .then(user => {
                if (!user) {
                    req.flash('error','No account of that email found!');
                    res.redirect('/reset');
                }
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000;
                return user.save();
            })
            .then(result => {
                res.redirect('/');
                //send a email 
                transporter.sendMail({ //receipient 's account
                        from:'mwalilanyira@gmail.com',
                        to:req.body.email,
                        subject:'Password reset',
                        text:'you requested a password reset',
                        html:`<p>you requested a password reset</p>
                        <p>
                        click this <a href='http://localhost:3000/reset/${token}'>link</a> to set a new password
                        </p>`
                    }, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message %s sent: %s', info.messageId, info.response)
                });
                 
            })
            .catch(err => console.log(err));
    });
}

exports.getNewPassword = (req,res,next) => {
    const token = req.params.token;
    User.findOne({resetToken:token, resetTokenExpiration:{$gt:Date.now()}})
        .then(user => {
            let message = req.flash('error');
            if (message.length > 0) {
                message = message[0];
            }else{
                message = null;
            }
            
            res.render('auth/new-password',{
                pageTitle: 'New Password',
                path: '/new-password',
                errorMessage:message,
                userId:user._id.toString(),
                passwordToken:token
            });
        })
        .catch(err => console.log(err));
    
    
}

exports.postNewPassword = (req,res,next) => {
    
    const newPassword = req.body.newPassword;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    
    let resetUser;
    
    User.findOne({resetToken:passwordToken,resetTokenExpiration:{$gt:Date.now()}, _id:userId})
        .then(user => {
            resetUser = user;
            return bcrypt.hash(newPassword, 12);
        })
        .then(hashPassword => {
            resetUser.password = hashPassword;
            resetUser.resetToken = undefined;
            resetUser.resetTokenExpiration = undefined;
            return resetUser.save();
        })
        .then(result => {
            res.redirect('/login')
        })
        .catch(err => console.log(err));
    
}