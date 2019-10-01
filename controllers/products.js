const Product = require('../models/product');

exports.getAddProducts = (req,res,next) => {
    //render view with ejs template engine
    res.render('add-product',{
        pageTitle:'add-product',
        path:'/admin/add-product',
    });
}

exports.postAddProducts = (req,res,next) => {
    
    const product = new Product(req.body.title);
    //save the product
    product.save();
    
    res.redirect('/');
}

exports.getProducts = (req,res,next) => {  
    //fetch all the products
    Product.fetchAll(products => {
       //render the ejs template
        res.render('shop',{
            prods:products,
            pageTitle:'Shop',
            path:'/',

        }); 
    });
    
}