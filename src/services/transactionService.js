import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL + '/api/transactions';

if (!API_URL) {
    throw new Error('REACT_APP_API_URL is not defined. Please check your .env file.');
}

const DEFAULT_PAGE = 1;
const DEFAULT_PER_PAGE = 10;

const formatMonth = (month) => {
    const date = new Date(month);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
};

const getTransactions = async (month, page = DEFAULT_PAGE, perPage = DEFAULT_PER_PAGE, search = '') => {
    const formattedMonth = formatMonth(month);

    console.log('Fetching transactions with params:', { month: formattedMonth, page, perPage, search });

    try {
        const response = await axios.get(API_URL, {
            params: { month: formattedMonth, page, perPage, search }
        });

        if (response.data?.transactions && Array.isArray(response.data.transactions)) {
            return { transactions: response.data.transactions, total: response.data.total || 0 };
        } else {
            console.warn('No transactions found for the given parameters.');
            return { transactions: [], total: 0 };
        }
    } catch (error) {
        return handleApiError(error, 'fetching transactions');
    }
};

const getStatistics = async () => {
    const STATS_API_URL = process.env.REACT_APP_API_URL + '/api/statistics';
    try {
        const response = await axios.get(STATS_API_URL);
        return response.data;
    } catch (error) {
        return handleApiError(error, 'fetching statistics');
    }
};

const getBarChartData = async () => {
    const BARCHART_API_URL = process.env.REACT_APP_API_URL + '/api/barchart';
    try {
        const response = await axios.get(BARCHART_API_URL);
        return response.data;
    } catch (error) {
        return handleApiError(error, 'fetching bar chart data');
    }
};

const getPieChartData = async () => {
    const PIECHART_API_URL = process.env.REACT_APP_API_URL + '/api/piechart';
    try {
        const response = await axios.get(PIECHART_API_URL);
        return response.data;
    } catch (error) {
        return handleApiError(error, 'fetching pie chart data');
    }
};

const handleApiError = (error, context) => {
    console.error(`Error ${context}:`, error);
    
    let errorMessage = 'Failed to fetch data. Please try again later.';
    
    if (error.response) {
        if (error.response.status === 400) {
            errorMessage = 'Bad Request. Please check your input parameters.';
        } else if (error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message;
        } else {
            errorMessage = `Error: ${error.response.status} - ${error.response.statusText}`;
        }
    } else if (error.request) {
        errorMessage = 'No response received from the server.';
    }

    return { error: errorMessage };
};

export default {
    getTransactions,
    getStatistics,
    getBarChartData,
    getPieChartData,
};
