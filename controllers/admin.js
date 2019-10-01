const Product = require('../models/product');

exports.getAddProducts = (req,res,next) => {
    //render view with ejs template engine
    res.render('admin/add-product',{
        pageTitle:'add-product',
        path:'/admin/add-product',
    });
}

exports.postAddProducts = (req,res,next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    
    const product = new Product(title,imageUrl,description,price);
    //save the product
    product.save(); 
    res.redirect('/');
}

exports.getProducts = (req,res,next) => {
     //fetch all the products
     Product.fetchAll(products => {
        //render the ejs template
         res.render('admin/products',{
             prods:products,
             pageTitle: 'Admin Products',
             path: '/admin/products',
 
         }); 
     });
}