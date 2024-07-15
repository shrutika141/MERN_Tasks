const express = require('express');

const { register, login } = require('../controllers/authController');
const { verifyToken, roleCheck } = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.get('/users', roleCheck(['admin', 'subadmin']), userController.getAllUsers);
router.post('/add-user', roleCheck('admin'), userController.addUser);
// router.get('/edit-user/:id', verifyToken, userController.getUserById);
router.get('/edit-user/:id', userController.getUserById);
router.put('/edit-user/:id', roleCheck('admin'), userController.updateCustomerProfile);
// router.put('/edit-profile/:id', roleCheck('customer'), userController.updateCustomerProfile);

module.exports = router;