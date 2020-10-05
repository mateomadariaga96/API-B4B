const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware')
const baseController = require('../controllers/base.controller');

module.exports = router;

router.get('/', authMiddleware.isNotAuthenticated, baseController.index)
