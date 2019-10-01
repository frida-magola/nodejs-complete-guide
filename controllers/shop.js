const Product = require('../models/product');

exports.getProducts = (req,res,next) => {  
    //fetch all the products
    Product.fetchAll(products => {
       //render the ejs template
        res.render('shop/product-list',{
            prods:products,
            pageTitle:'All Products',
            path:'/products',

        }); 
    });
    
}

exports.getIndex = (req,res,next) => {
    Product.fetchAll(products => {
        //render the ejs template
        res.render('shop/index',{
            prods:products,
            pageTitle:'Shop',
            path:'/',

        }); 
     }); 
}

exports.getCart = (req,res,next) => {
    res.render('shop/cart', {
        path:'/cart',
        pageTitle:'Your Cart',
        
    })
}

exports.getOrders = (req,res,next) => {
    res.render('shop/orders', {
        path:'/orders',
        pageTitle:'Your Orders',
        
    })
}

exports.getCheckout = (req,res,next) => {
    res.render('shop/checkout',{
        pageTitle:'checkout',
        path:'/checkout',
    })
}