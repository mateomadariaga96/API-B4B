const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware')
const businessController = require('../controllers/business.controller');
const productController = require('../controllers/product.controller');
const oppController = require('../controllers/opportunity.controller');
const upload = require('./cloudinary.config');

module.exports = router;

// Authentication
router.post('/login', authMiddleware.isNotAuthenticated, businessController.login)
router.get('/logout', authMiddleware.isAuthenticated, businessController.logout)

//Business
router.get('/businesses', authMiddleware.isAuthenticated, businessController.list);
router.post('/business', authMiddleware.isNotAuthenticated, upload.single('logo'), businessController.create);
router.get('/business/:id', authMiddleware.isAuthenticated, businessController.profile);
router.post('/business/:id/contact', authMiddleware.isNotAuthenticated, upload.single('avatar'), businessController.createContact);
router.delete('/business/:id/delete', authMiddleware.isAuthenticated, businessController.deleteBusiness)
router.put('/business/:id/update', authMiddleware.isAuthenticated, businessController.updateBusiness)


// Products
router.get('/products', authMiddleware.isAuthenticated, productController.list);
router.get('/products/sector', authMiddleware.isAuthenticated, productController.listFiltered);
router.post('/product', authMiddleware.isAuthenticated, upload.single('image'), productController.create);
router.get('/product/:id', authMiddleware.isAuthenticated, productController.show);
router.get('/product/:id/like', authMiddleware.isAuthenticated, productController.like);
router.post('/product/:id/review', authMiddleware.isAuthenticated, productController.addReview);
router.post('/product/:id/rating', authMiddleware.isAuthenticated, productController.addRating);
router.delete('/product/:id/delete', authMiddleware.isAuthenticated, productController.deleteProduct)
router.put('/product/:id/update', authMiddleware.isAuthenticated, productController.updateProduct)


//Opportunities
router.get('/opportunities', authMiddleware.isAuthenticated, oppController.list);
router.get('/opportunities/sector', authMiddleware.isAuthenticated, oppController.listFiltered);
router.post('/opportunity', authMiddleware.isAuthenticated, oppController.create);
router.get('/opportunity/:id', authMiddleware.isAuthenticated, oppController.show);
router.get('/opportunity/like/:id', authMiddleware.isAuthenticated, oppController.like);
router.post('/opportunity', authMiddleware.isAuthenticated, oppController.create);
router.post('/opportunity/:id/comment', authMiddleware.isAuthenticated, oppController.addComment);
router.post('/opportunity/:id/proposal', authMiddleware.isAuthenticated, oppController.createProposal);
router.get('/opportunity/:id/proposals', authMiddleware.isAuthenticated, oppController.listProposals);
router.delete('/opportunity/:id/delete', authMiddleware.isAuthenticated, oppController.deleteOpportunity);
router.put('/opportunity/:id/update', authMiddleware.isAuthenticated, oppController.updateOpportunity)


