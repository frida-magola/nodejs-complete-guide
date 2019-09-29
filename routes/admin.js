const express = require('express');
const path = require('path');

const rootDir = require('../util/path');

const router = express.Router();

const products = [];

// /admin/add-produit => GET
router.get('/add-product', (req,res,next) => {
    
    //first way for using path by importing path to above
    // res.sendFile(path.join(__dirname,'../','views','add-product.html')); 
    
    //second way for using path it by importing an external confuguration the root directory 
    // res.sendFile(path.join(rootDir,'views','add-product.html'));
    
    //render view with pug template engine
    res.render('add-product',{pageTitle:'add-product',path:'/admin/add-product'});
});

// /admin/add-product => POST
router.post('/add-product', (req,res,next) => {
    // console.log(req.body);
    products.push({title:req.body.title});
    res.redirect('/');
});

// module.exports = router;
exports.routes = router;
exports.products = products;