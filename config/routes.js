const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware')
const businessController = require('../controllers/business.controller');
const productController = require('../controllers/product.controller');
const oppController = require('../controllers/opportunity.controller');

module.exports = router;

//router.get('/', authMiddleware.isNotAuthenticated, .index)

// Authentication
router.post('/login', authMiddleware.isNotAuthenticated, businessController.login)
router.get('/logout', authMiddleware.isAuthenticated, businessController.logout)

// Products
//router.get('/product', productController.list);

//Opportunities
router.get('/opportunities', authMiddleware.isAuthenticated, oppController.list)
router.get('/opportunity/like/:id', authMiddleware.isAuthenticated, oppController.like)



