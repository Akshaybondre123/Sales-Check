const axios = require('axios');
const mongoose = require('mongoose');
const Transaction = require('../models/Transaction'); 

const seedData = async () => {
    try {
        
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const transactions = response.data; 

        if (!Array.isArray(transactions)) {
            throw new Error('Invalid data format. Expected an array of transactions.');
        }

        
        await Transaction.deleteMany();  
        console.log('Previous transaction data cleared.');
        await Transaction.insertMany(transactions);  
        console.log('Database seeded with new transactions.');
        
    } catch (error) {
        
        console.error('Error seeding database:', error.message || error);
    } finally {
        
        mongoose.connection.close();
    }
};

module.exports = seedData; 
