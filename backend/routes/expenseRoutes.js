const express = require('express');
const {
    getExpenses,
    getExpense,
    addExpense,
    updateExpense,
    deleteExpense
} = require('../controllers/expenseController');

const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
    .get(protect, getExpenses)
    .post(protect, addExpense);

router.route('/:id')
    .get(protect, getExpense)
    .put(protect, updateExpense)
    .delete(protect, deleteExpense);

module.exports = router;
