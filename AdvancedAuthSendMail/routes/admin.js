const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

// /admin/add-produit => GET
router.get('/add-product', isAuth, adminController.getAddProducts);

// // /admin/products 
router.get('/products', isAuth, adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product',isAuth, adminController.postAddProducts);

// /admin/edit-product/:productId 
router.get('/edit-product/:productId',isAuth, adminController.getEditProduct);

//  /admin/edit-product update product 
router.post('/edit-product',isAuth, adminController.postEditProduct);

// // // /admin/delete-product

router.post('/delete-product',isAuth, adminController.postDeleteProduct);

// module.exports = router;
module.exports = router;