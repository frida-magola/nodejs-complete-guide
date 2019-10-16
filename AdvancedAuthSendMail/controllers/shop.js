const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = (req,res,next) => {  
    //fetch all the products
    Product
        .find()
        .then((products)=>{
            //render the ejs template
            res.render('shop/product-list',{
                prods:products,
                pageTitle:'All Products',
                path:'/products',
                isAuthenticated:req.session.isLoggedIn

            });
        })
        .catch(err => console.log(err))
}

//getting a single product
exports.getProduct = (req,res,next) => {
    const prodId = req.params.productId;
    Product
        .findById(prodId)
        .then(product => {
            res.render('shop/product-detail',{
                product:product,
                pageTitle:product.title,
                path:'/products',
                isAuthenticated:req.session.isLoggedIn
            })
        })
        .catch(err => console.log(err));
    
}

exports.getIndex = (req,res,next) => {
    Product.find()
    .then((products) => {
        //render the ejs template
        res.render('shop/index',{
            prods:products,
            pageTitle:'Shop',
            path:'/',
        });  
    })
    .catch(err => console.log(err)); 
}


exports.getCart = (req,res,next) => {
   // get products of current user using sequelize 
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            // console.log(user.cart.items);
            const products = user.cart.items;
            res.render('shop/cart', {
                path:'/cart',
                pageTitle:'Your Cart',
                products: products,
                isAuthenticated:req.session.isLoggedIn
            });
        })
        .catch(err => console.log(err));
}

// //adding product to the cart
exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    
    Product
        .findById(prodId)
        .then(product => {
            return req.user.addToCart(product);
            
        })
        .then(result => {
            console.log(result);
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
};

exports.posCarttDeleteItem = (req,res,next) => {
    const prodId = req.body.productId;
    req.user
        .removeItemFromCart(prodId)
        .then((result) => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
 
}

exports.postOrder = (req,res,next) => {
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            // console.log(user.cart.items);
            const products = user.cart.items.map(i => {
                return {quantity:i.quantity, product:{...i.productId._doc}}
            });
            
            //create order
            const order = new Order({
                user:{
                    email:req.user.email,
                    userId:req.user
                },
                products:products 
            });
            
            return order.save();
        })
        .then((result) => {
            //clear the cart
           return  req.user.clearCart(); 
        })
        .then(() => {
            res.redirect('/orders');
        })
        .catch(err => console.log(err));
}

exports.getOrders = (req, res, next) => {
    // fech all the orders for the current user
    Order
      .find({'user.userId': req.user._id})
      .then(orders => {
          console.log(orders)
        res.render('shop/orders', {
          path: '/orders',
          pageTitle: 'Your Orders',
          orders: orders,
          isAuthenticated:req.session.isLoggedIn
        });
      })
      .catch(err => console.log(err));
};