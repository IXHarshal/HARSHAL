const {
    generateInsights,
    autoCategorize,
    detectUnusual,
    predictExpenses
} = require('../services/aiService');
const Expense = require('../models/Expense');

// @desc    Get financial insights for user
// @route   GET /api/ai/insights
// @access  Private
exports.getInsights = async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user.id });
        const insights = await generateInsights(expenses);
        res.status(200).json({ success: true, data: insights });
    } catch (err) {
        res.status(500).json({ success: false, error: 'AI Error' });
    }
};

// @desc    Auto categorize an expense text
// @route   POST /api/ai/categorize
// @access  Private
exports.categorizeTransaction = async (req, res) => {
    try {
        const { description } = req.body;
        const category = await autoCategorize(description);
        res.status(200).json({ success: true, data: category });
    } catch (err) {
        res.status(500).json({ success: false, error: 'AI Error' });
    }
};

// @desc    Check for unusual spending
// @route   POST /api/ai/unusual
// @access  Private
exports.checkUnusualSpending = async (req, res) => {
    try {
        const { amount, category } = req.body;
        const expenses = await Expense.find({ user: req.user.id, category });
        const isUnusual = await detectUnusual(amount, category, expenses);
        res.status(200).json({ success: true, data: { isUnusual } });
    } catch (err) {
        res.status(500).json({ success: false, error: 'AI Error' });
    }
};

// @desc    Predict future expenses based on history
// @route   GET /api/ai/predict
// @access  Private
exports.getPredictions = async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user.id });
        const predictions = await predictExpenses(expenses);
        res.status(200).json({ success: true, data: predictions });
    } catch (err) {
        res.status(500).json({ success: false, error: 'AI Error' });
    }
};
