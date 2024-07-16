const express = require('express');

const { register, login } = require('../controllers/authController');
const { verifyToken, roleCheck } = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');
const productController = require('../controllers/productController');
const cartController = require('../controllers/cartController');
const orderController = require('../controllers/orderController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.get('/users', roleCheck(['admin', 'subadmin']), userController.getAllUsers);
router.post('/add-user', roleCheck('admin'), userController.addUser);
router.get('/edit-user/:id', userController.getUserById);
router.put('/edit-user/:id', roleCheck('admin'), userController.updateCustomerProfile);

router.get('/products', roleCheck(['admin', 'subadmin', 'customer']), productController.getAllProduct);
router.post('/add-product', roleCheck(['admin', 'subadmin']), productController.addProduct);
router.get('/edit-product/:id', productController.getProductById);
router.put('/edit-product/:id', roleCheck(['admin', 'subadmin']), productController.updateProduct);
router.put('/delete-product/:id', roleCheck(['admin']), productController.deleteProduct);

router.get('/get-cart/:id', cartController.getCartItems);
router.post('/add-cart', cartController.addToCart);
router.delete('/remove-cart/:id', cartController.removeFromCart);

router.get('/get-orders', orderController.getOrders);
router.get('/get-all-orders', orderController.getAllOrders);
router.post('/place-orders', orderController.placeOrder);
router.get('/orders/:id', orderController.getOrderById);
router.put('/orders/:id/status', orderController.updateOrderStatus);

module.exports = router;