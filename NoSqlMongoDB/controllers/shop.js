const Product = require('../models/product');
// const Cart = require('../models/cart');
// const CartItem = require('../models/cart-item');

exports.getProducts = (req,res,next) => {  
    //fetch all the products
    Product.fetchAll().then((products)=>{
         //render the ejs template
         res.render('shop/product-list',{
            prods:products,
            pageTitle:'All Products',
            path:'/products',

        });
    }).catch(err => console.log(err))
 
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
            })
        })
        .catch(err => console.log(err));
    
}

exports.getIndex = (req,res,next) => {
    Product.fetchAll()
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
        .getCart()
        .then(products => {
            res.render('shop/cart', {
                path:'/cart',
                pageTitle:'Your Cart',
                products: products
            });
        })
        .catch(err => console.log(err));
}

//adding product to the cart
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
        .deleteItemFromCart(prodId)
        .then((result) => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
 
}

exports.postOrder = (req,res,next) => {
    req.user
        .addOrder()
        .then((result) => {
             res.redirect('/orders');
        })
        .catch(err => console.log(err));
}

exports.getOrders = (req, res, next) => {
    req.user
      .getOders()
      .then(orders => {
          console.log(orders)
        res.render('shop/orders', {
          path: '/orders',
          pageTitle: 'Your Orders',
          orders: orders
        });
      })
      .catch(err => console.log(err));
};