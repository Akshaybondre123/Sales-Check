
const mongoose = require('mongoose');
const transactionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100,
    },
    description: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 500,
    },
    category: {
        type: String,
        required: true,
        enum: ['food', 'entertainment', 'bills', 'transport', 'other'],
    },
    amount: {
        type: Number,
        required: true,
        min: 0,
    },
    dateOfSale: {
        type: Date,
        required: true,
    },
}, {
    timestamps: true, 
});


const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
