const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');
const User = require('./models/user');


const app = express();

//working with ejs template engine in express it does not need to importe like pug 
app.set('view engine', 'ejs');
app.set('views','views');


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));

// store current user midleware for a global user can be use in the entire project
app.use((req,res,next) => {
  
  User.findById("5da05c9f686a7015c84922ab")
      .then(user => {
          //store the user fetch from the database in a request variable
          req.user = user;
          //call the next function if we got our user stored
          next();
      })
      .catch(err => console.log(err));

});

// app.use(adminRoutes); //path not filtered
app.use('/admin', adminRoutes); // path filtered
app.use(shopRoutes);

//route not found
app.use(errorController.get404);

mongoose
  .connect('mongodb://localhost:27017/vigne_business',{ useUnifiedTopology: true, useNewUrlParser: true  })
  .then(result => {
     //find a user
    User.findOne()
      .then(user => {
        //chech if user exist
        if (!user) {
          //create a new user 
          const user = new User({
            username:'nyira',
            email:'mwalilanyira@gmail.com',
            cart:{ 
              items:[]
            }
          });
          // insert into the database
          user.save();
        }
        
      })
      .catch(err => console.log(err));
    //start the server
    app.listen(3000);
  })
  .catch(err => console.log(err));

