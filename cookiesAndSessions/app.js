const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);


const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');
const User = require('./models/user');
const authRoutes = require('./routes/auth');

//database uri
const MONGODB_URI = 'mongodb://localhost:27017/vigne_business';


const app = express();
const store = new MongoDBStore({
  uri:MONGODB_URI,
  collection:'sessions'
});

//working with ejs template engine in express it does not need to importe like pug 
app.set('view engine', 'ejs');
app.set('views','views');


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));
//initialize the session
app.use(
  session({
    secret:'my secret',
    resave:false,
    saveUninitialized:false,
    store:store
  })
);

//store current user
app.use((req,res,next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
})

// app.use(adminRoutes); //path not filtered
app.use('/admin', adminRoutes); // path filtered
app.use(shopRoutes);
app.use(authRoutes);

//route not found
app.use(errorController.get404);

mongoose
  .connect(MONGODB_URI,{ useUnifiedTopology: true, useNewUrlParser: true  })
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

