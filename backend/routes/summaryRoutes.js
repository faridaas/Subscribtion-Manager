const express = require('express');
const router = express.Router();
const summaryController = require('../controllers/summaryController');
const { protect } = require('../middlewares/auth');

// Apply auth middleware to all routes
router.use(protect);

// Get spending summary
router.get('/', summaryController.getSpendingSummary);

// Get category statistics
router.get('/categories', summaryController.getCategoryStatistics);

module.exports = router;
