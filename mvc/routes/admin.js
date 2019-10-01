const express = require('express');
const router = express.Router();

const productController = require('../controllers/products');


// /admin/add-produit => GET
router.get('/add-product', productController.getAddProducts);

// /admin/add-product => POST
router.post('/add-product', productController.postAddProducts);

// module.exports = router;
module.exports = router;