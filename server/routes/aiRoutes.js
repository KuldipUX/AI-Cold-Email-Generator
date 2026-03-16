const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware.js')
const aiController = require('../controllers/aiController');

router.post('/generate-email',protect,aiController.generateEmail);
router.get('/history',protect,aiController.getHistory);
module.exports = router;