const seedData = require('../utils/seedData');
const connectDB = require('../config/db');

connectDB();
seedData();
