const express = require('express');
const router = express.Router();

const shopController = require('../controllers/shop');

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

//products/285656
router.get('/products/:productId', shopController.getProduct);

router.get('/products/delete');

router.get('/cart', shopController.getCart);

router.post('/cart', shopController.postCart);

router.post('/cart-delete-item', shopController.posCarttDeleteItem);

router.get('/orders', shopController.getOrders);

router.post('/create-order', shopController.postOrder);


module.exports = router;