const Transaction = require('../models/Transaction');


const getMonthDateRange = (year, month) => {
    const start = new Date(year, month - 1, 1); 
    const end = new Date(year, month, 0);       
    return { start, end };
};


const handleError = (res, error, message) => {
    console.error(message, error);
    return res.status(500).json({ message, error: error.message });
};


exports.getTransactions = async (req, res) => {
    const { search, page = 1, perPage = 10, month } = req.query;

    
    if (month) {
        const monthInt = parseInt(month);
        if (isNaN(monthInt) || monthInt < 1 || monthInt > 12) {
            return res.status(400).json({ message: 'Invalid month. It must be between 1 and 12.' });
        }
    }

    const currentYear = new Date().getFullYear(); 
    const { start, end } = getMonthDateRange(currentYear, month);

    
    const searchRegex = search ? {
        $or: [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
        ],
    } : {};

    try {
        
        const transactions = await Transaction.find({ ...searchRegex, dateOfSale: { $gte: start, $lte: end } })
            .skip((page - 1) * perPage) 
            .limit(parseInt(perPage));    

        
        const total = await Transaction.countDocuments({ ...searchRegex, dateOfSale: { $gte: start, $lte: end } });

        res.status(200).json({ transactions, total, page, perPage });
    } catch (error) {
        handleError(res, error, 'Error fetching transactions');
    }
};


exports.getStatistics = async (req, res) => {
    const { month } = req.query;

    
    if (!month || isNaN(month) || month < 1 || month > 12) {
        return res.status(400).json({ message: 'Invalid month. It must be between 1 and 12.' });
    }

    const currentYear = new Date().getFullYear();
    const { start, end } = getMonthDateRange(currentYear, month);

    try {
       
        const totalSale = await Transaction.aggregate([
            { $match: { dateOfSale: { $gte: start, $lte: end } } },
            { $group: {
                _id: null,
                totalSale: { $sum: "$price" },
                soldItems: { $sum: { $cond: ["$sold", 1, 0] } },
            }},
        ]);

        
        const notSoldItems = await Transaction.countDocuments({ dateOfSale: { $gte: start, $lte: end }, sold: false });

        res.status(200).json({
            totalSale: totalSale.length > 0 ? totalSale[0].totalSale : 0,
            soldItems: totalSale.length > 0 ? totalSale[0].soldItems : 0,
            notSoldItems,
        });
    } catch (error) {
        handleError(res, error, 'Error fetching statistics');
    }
};


exports.getBarChartData = async (req, res) => {
    const { month } = req.query;

    
    if (!month || isNaN(month) || month < 1 || month > 12) {
        return res.status(400).json({ message: 'Invalid month. It must be between 1 and 12.' });
    }

    const currentYear = new Date().getFullYear();
    const { start, end } = getMonthDateRange(currentYear, month);

    
    const priceRanges = [
        { range: "0-100", count: 0 },
        { range: "101-200", count: 0 },
        { range: "201-300", count: 0 },
        { range: "301-400", count: 0 },
        { range: "401-500", count: 0 },
        { range: "501-600", count: 0 },
        { range: "601-700", count: 0 },
        { range: "701-800", count: 0 },
        { range: "801-900", count: 0 },
        { range: "901-above", count: 0 }
    ];

    try {
        
        const transactions = await Transaction.find({ dateOfSale: { $gte: start, $lte: end } });

        
        transactions.forEach(transaction => {
            const price = transaction.price;
            if (price <= 100) priceRanges[0].count++;
            else if (price <= 200) priceRanges[1].count++;
            else if (price <= 300) priceRanges[2].count++;
            else if (price <= 400) priceRanges[3].count++;
            else if (price <= 500) priceRanges[4].count++;
            else if (price <= 600) priceRanges[5].count++;
            else if (price <= 700) priceRanges[6].count++;
            else if (price <= 800) priceRanges[7].count++;
            else if (price <= 900) priceRanges[8].count++;
            else priceRanges[9].count++;
        });

        res.status(200).json(priceRanges);
    } catch (error) {
        handleError(res, error, 'Error fetching bar chart data');
    }
};


exports.getPieChartData = async (req, res) => {
    const { month } = req.query;

    
    if (!month || isNaN(month) || month < 1 || month > 12) {
        return res.status(400).json({ message: 'Invalid month. It must be between 1 and 12.' });
    }

    const currentYear = new Date().getFullYear();
    const { start, end } = getMonthDateRange(currentYear, month);

    try {
        
        const categories = await Transaction.aggregate([
            { $match: { dateOfSale: { $gte: start, $lte: end } } },
            { $group: { _id: "$category", count: { $sum: 1 } } },
        ]);

        res.status(200).json(categories);
    } catch (error) {
        handleError(res, error, 'Error fetching pie chart data');
    }
};
