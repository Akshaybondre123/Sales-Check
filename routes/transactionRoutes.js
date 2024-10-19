
const express = require('express');
const mongoose = require('mongoose');
const Transaction = require('../models/Transaction'); 
const { isValidObjectId } = mongoose;


const router = express.Router();


router.get('/', async (req, res) => {
    const { month, page = 1, perPage = 10, search } = req.query;

    try {
        const query = {};

        
        if (month) {
            const [year, monthPart] = month.split('-');
            const parsedYear = parseInt(year, 10);
            const parsedMonth = parseInt(monthPart, 10);

            if (isNaN(parsedYear) || isNaN(parsedMonth) || parsedMonth < 1 || parsedMonth > 12) {
                return res.status(400).json({ message: 'Invalid month parameter. It must be in the format YYYY-MM.' });
            }

            const startDate = new Date(parsedYear, parsedMonth - 1, 1);
            const endDate = new Date(parsedYear, parsedMonth, 0);
            query.dateOfSale = { $gte: startDate, $lte: endDate };
        }

        
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } }
            ];
        }

        const pageNumber = Math.max(1, parseInt(page, 10));
        const perPageNumber = Math.max(1, parseInt(perPage, 10));

        const transactions = await Transaction.find(query)
            .skip((pageNumber - 1) * perPageNumber)
            .limit(perPageNumber);

        const total = await Transaction.countDocuments(query);

        res.status(200).json({
            transactions,
            total,
            page: pageNumber,
            perPage: perPageNumber,
        });
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});


router.post('/', async (req, res) => {
    const { title, description, category, amount, dateOfSale } = req.body;

    
    if (!title || !description || !category || amount === undefined || !dateOfSale) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const newTransaction = new Transaction({
            title,
            description,
            category,
            amount,
            dateOfSale,
        });

        await newTransaction.save();
        res.status(201).json(newTransaction);
    } catch (error) {
        console.error('Error creating transaction:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});


router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, category, amount, dateOfSale } = req.body;

    
    if (!isValidObjectId(id)) {
        return res.status(400).json({ message: 'Invalid transaction ID format.' });
    }

    try {
        const updatedTransaction = await Transaction.findByIdAndUpdate(id, {
            title,
            description,
            category,
            amount,
            dateOfSale,
        }, { new: true, runValidators: true });

        if (!updatedTransaction) {
            return res.status(404).json({ message: 'Transaction not found.' });
        }

        res.status(200).json(updatedTransaction);
    } catch (error) {
        console.error('Error updating transaction:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        return res.status(400).json({ message: 'Invalid transaction ID format.' });
    }

    try {
        const deletedTransaction = await Transaction.findByIdAndDelete(id);

        if (!deletedTransaction) {
            return res.status(404).json({ message: 'Transaction not found.' });
        }

        res.status(204).send(); 
    } catch (error) {
        console.error('Error deleting transaction:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

module.exports = router;
