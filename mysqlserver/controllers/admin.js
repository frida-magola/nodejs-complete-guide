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
    
    const product = new Product(null,title,imageUrl,description,price);
    //save the product
    product.save()
        .then(() => {
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err)); 
    
};

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
};

exports.getEditProduct = (req,res,next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/admin/products');
    }
    //edit product by id 
    const prodId = req.params.productId;
    Product.findById(prodId, product => {
        
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
    
};

exports.postEditProduct = (req,res,next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedPrice = req.body.price;
    const updatedDescription = req.body.description;
    const updatedProduct = new Product(prodId,updatedTitle,updatedImageUrl,updatedDescription,updatedPrice);
    updatedProduct.save();
    res.redirect('/admin/products');
};

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.deleteById(prodId);
    res.redirect('/admin/products');
  };



