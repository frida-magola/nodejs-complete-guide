const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');


const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const app = express();

//working with ejs template engine in express it does not need to importe like pug 
app.set('view engine', 'ejs');
app.set('views','views');


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));

// store current user midleware for a global user can be use in the entire project
app.use((req,res,next) => {
    User.findByPk(1)
        .then((user) => {
            //store the user fetch from the database in a request variable
            req.user = user;
            //call the next function if we got our user stored
            next();
        })
        .catch(err => console.log(err));
});

//app.use(adminRoutes); //path not filtered
app.use('/admin', adminRoutes); // path filtered

app.use(shopRoutes);

//route not found
app.use(errorController.get404);

//define  models by related them before synchronisation
Product.belongsTo(User,{constraints:true,onDelete:'CASCADE'});//user create the product
User.hasMany(Product); //one user has many product
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product,{ through:CartItem });
Product.belongsToMany(Cart,{ through:CartItem });
User.belongsTo(Order);
Order.belongsToMany(Product,{ through:OrderItem});

sequelize
    .sync()
    // .sync({force:true})
    .then(result => {
       //find user by id 
       return User.findByPk(1);
      
    })
    .then(user => {
        if (!user) {
            return User.create({username:'nyira',email:'mwalilanyira@gmail.com'});
        }
         return user;
         
    })
    .then(user => {
        // console.log('User created successfully!',user);
        // here i got the current user then i creat a cart for this user
        return user.createCart();
        
    })
    .then(cart => {
        // console.log(cart);
        app.listen(3000);
    })
    .catch(err => console.log(err));

