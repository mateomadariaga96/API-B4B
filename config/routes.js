const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware')
const baseController = require('../controllers/base.controller');
const userController = require('../controllers/user.controller');
const productController = require('../controllers/product.controller');

module.exports = router;

router.get('/', authMiddleware.isNotAuthenticated, baseController.index)

// Authentication
router.post('/login', authMiddleware.isNotAuthenticated, userController.login)
router.get('/logout', authMiddleware.isAuthenticated, userController.logout)

// Products
router.get('/product', productController.list);
