const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin');


// /admin/add-produit => GET
router.get('/add-product', adminController.getAddProducts);

// /admin/products 
router.get('/products',adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product', adminController.postAddProducts);

// /admin/edit-product/:productId 
router.get('/edit-product/:productId', adminController.getEditProduct);

// /admin/edit-product update product 
router.post('/edit-product', adminController.postEditProduct);

// /admin/delete-product

router.post('/delete-product', adminController.postDeleteProduct);

// module.exports = router;
module.exports = router;