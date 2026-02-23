const Expense = require('../models/Expense');

// @desc    Get all current user's expenses
// @route   GET /api/expenses
// @access  Private
exports.getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user.id }).sort('-date');
        res.status(200).json({
            success: true,
            count: expenses.length,
            data: expenses
        });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Get single expense
// @route   GET /api/expenses/:id
// @access  Private
exports.getExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({ success: false, error: 'Expense not found' });
        }

        if (expense.user.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized to view this expense' });
        }

        res.status(200).json({ success: true, data: expense });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Add expense
// @route   POST /api/expenses
// @access  Private
exports.addExpense = async (req, res) => {
    try {
        req.body.user = req.user.id;

        // We can also have an AI check here to mark "isUnusual" spending if it deviates a lot.
        // For now we just create it.
        const expense = await Expense.create(req.body);

        res.status(201).json({
            success: true,
            data: expense
        });
    } catch (err) {
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ success: false, error: messages });
        } else {
            return res.status(500).json({ success: false, error: 'Server Error' });
        }
    }
};

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Private
exports.updateExpense = async (req, res) => {
    try {
        let expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({ success: false, error: 'No expense found' });
        }

        // Make sure user owns expense
        if (expense.user.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'User not authorized' });
        }

        expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: expense });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private
exports.deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({ success: false, error: 'No expense found' });
        }

        // Make sure user owns expense
        if (expense.user.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'User not authorized' });
        }

        await expense.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
