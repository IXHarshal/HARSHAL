const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: [true, 'Please add a positive number'],
        min: [0, 'Amount must be positive']
    },
    category: {
        type: String,
        required: [true, 'Please add a category']
    },
    date: {
        type: Date,
        required: [true, 'Please add a date'],
        default: Date.now
    },
    paymentMethod: {
        type: String,
        enum: ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Other'],
        default: 'Cash'
    },
    notes: {
        type: String,
        default: ''
    },
    receiptUrl: {
        type: String,
        default: ''
    },
    isUnusual: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Expense', ExpenseSchema);
