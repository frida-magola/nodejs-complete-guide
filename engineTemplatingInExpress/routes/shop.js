const express = require('express');
const path = require('path');

const rootDir = require('../util/path');
const adminData = require('./admin');

const router = express.Router();


router.get('/', (req,res,next) => {
    // console.log('shop.js',adminData.products);
    // res.sendFile(path.join(rootDir,'views','shop.html'));
    const products = adminData.products;
    
    //render the pug template
    res.render('shop',{
        prods:products,
        pageTitle:'Shop',
        path:'/',
        hasProducts:products.length > 0, //add for handlebars template engine
        activeShop: true, //add for activing the menus in handlebars template engine in express
        productCSS: true, // active the css style here handlebars require 
    });
});

module.exports = router;