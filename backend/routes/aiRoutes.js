const express = require('express');
const { getInsights, categorizeTransaction, checkUnusualSpending, getPredictions } = require('../controllers/aiController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/categorize', protect, categorizeTransaction);
router.get('/insights', protect, getInsights);
router.post('/unusual', protect, checkUnusualSpending);
router.get('/predict', protect, getPredictions);

module.exports = router;
