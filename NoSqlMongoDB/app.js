const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');


const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');
const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');


const app = express();

//working with ejs template engine in express it does not need to importe like pug 
app.set('view engine', 'ejs');
app.set('views','views');


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));

// store current user midleware for a global user can be use in the entire project
app.use((req,res,next) => {
  
    User.findById("5d9ee8a2fe03da1cda12ab98")
        .then(user => {
            //store the user fetch from the database in a request variable
            req.user = new User(user.username,user.email,user.cart,user._id);
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

mongoConnect(() => {
  // console.log(client);
  app.listen(3000);  
});

