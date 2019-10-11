const mongodb = require('mongodb');
const Product = require('../models/product');

exports.getAddProducts = (req,res,next) => {
    //render view with ejs template engine
    res.render('admin/edit-product',{
        pageTitle:'add-product',
        path:'/admin/add-product',
        editing:false
    });
};

exports.postAddProducts = (req,res,next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    
    const product = new Product({
        title:title,
        price:price,
        imageUrl:imageUrl,
        description:description,
        userId:req.user
    });
        
    product
        .save()
        .then((result) =>{
            console.log(result);
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
    
};

exports.getProducts = (req,res,next) => {
     //fetch all the products
    //  Product.findAll() //fetch all the products without filtered
    // Product.find() // fetch all the products 
    Product
        .find()
        // .select('title price -_id') //select products you want to display
        // .populate('userId','username') // fetch all the products and cart for the current user
        .then((products) => {
         //render the ejs template
            res.render('admin/products',{
                prods:products,
                pageTitle: 'Admin Products',
                path: '/admin/products',

            }); 
        })
        .catch(err => console.log(err));
};

exports.getEditProduct = (req,res,next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/admin/products');
    }
    //edit product by id 
    const prodId = req.params.productId;
    
    Product
        .findById(prodId)
        .then((product) => {
        
            if (!product) {
                return res.redirect('/admin/products');
            }
            res.render('admin/edit-product',{
                pageTitle:'Edit Product',
                path:'/admin/edit-product',
                editing:editMode,
                product:product
            }); 
        })
        .catch(err => console.log(err));
    
};

exports.postEditProduct = (req,res,next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedPrice = req.body.price;
    const updatedDescription = req.body.description;
    
    Product
        .findById(prodId)
        .then(product => {
            
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.imageUrl = updatedImageUrl;
            product.description = updatedDescription;
            //update product
            return product.save();
        })
        .then(result => {
            console.log('Updated Product');
            res.redirect('/admin/products'); 
        })
        .catch(err => console.log(err)); 
};

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product
        .findByIdAndRemove(prodId)
        .then(() => {
            console.log('Product deleting successfully!')
            res.redirect('/admin/products'); 
        })
        .catch(err => console.log(err));
    
};



