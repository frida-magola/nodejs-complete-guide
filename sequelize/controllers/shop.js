const Product = require('../models/product');
const Cart = require('../models/cart');
const CartItem = require('../models/cart-item');

exports.getProducts = (req,res,next) => {  
    //fetch all the products
    Product.findAll().then((products)=>{
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
    
    Product.findAll({where:{id:prodId}}).then((products) => {
        res.render('shop/product-detail',{
            product:products[0],
            pageTitle:products[0].title,
            path:'/products',
        })
    }).catch(err => console.log(err));
    
    // Product.findByPk(prodId)
    //     .then((product) => {
    //            console.log(product);
    //         res.render('shop/product-detail',{
    //             product:product,
    //             pageTitle:product.title,
    //             path:'/products',
    //         })
    //     })
    //     .catch(err => console.log(err));
    
}

exports.getIndex = (req,res,next) => {
    Product.findAll()
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
        .then(cart => {
            // console.log(cart);
            cart.getProducts()
                .then(products => {
                    res.render('shop/cart', {
                        path:'/cart',
                        pageTitle:'Your Cart',
                        products: products
                    });
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
    
    //callback function getCart
    // Cart.getCart(cart => {
    //     //callback fetching all the products
    //     Product.findAll()
    //         .then((products) => {
    //             const cartProducts = [];
    //             for (let product of products) {
    //                 const cartProductsData = cart.products.find(prod => prod.id === product.id);
    //                 if (cartProductsData) {
    //                      cartProducts.push({productData:product,qty:cartProductsData.qty});
    //                 }
    //             }
    //             res.render('shop/cart', {
    //                 path:'/cart',
    //                 pageTitle:'Your Cart',
    //                 products: cartProducts
    //             });
    //         })
    //         .catch(err => console.log);
            
    // });
}

//adding product to the cart
exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    let fetchedCart;
    let newQuantity = 1;
    req.user
      .getCart()
      .then(cart => {
        fetchedCart = cart;
        return cart.getProducts({ where: { id: prodId } });
      })
      .then(products => {
        let product;
        if (products.length > 0) {
          product = products[0];
        }
  
        if (product) {
          const oldQuantity = product.cartItem.quantity;
          newQuantity = oldQuantity + 1;
          return product;
        }
        return Product.findByPk(prodId);
      })
      .then(product => {
        return fetchedCart.addProduct(product, {
          through: { quantity: newQuantity }
        });
      })
      .then(() => {
        res.redirect('/cart');
      })
      .catch(err => console.log(err));
};

exports.posCarttDeleteItem = (req,res,next) => {
    const prodId = req.body.productId;
    req.user
        .getCart()
        .then(cart => {
            return cart.getProducts({ where: { id: prodId }});
        })
        .then(products => {
            const product = products[0];
            product.cartItem.destroy();
        })
        .then((result) => {
            res.redirect('/cart');
        });
 
}

exports.postOrder = (req,res,next) => {
    let fetchedCart;
    req.user
        .getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts();
        })
        .then(products => {
            return req.user
                .createOrder()
                .then(order => {
                    return order.addProducts(products.map(
                        product => {
                            product.orderItem = { quantity: product.cartItem.quantity };
                            return product; 
                    }));
                })
                .catch(err => console.log(err)); 
        })
        .then((result) => {
            return fetchedCart.setProducts(null);
            // console.log(result);
           
            
        })
        .then((result) => {
             res.redirect('/orders');
        })
        .catch(err => console.log(err));
}

exports.getOrders = (req, res, next) => {
    req.user
      .getOrder({include: ['products']})
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