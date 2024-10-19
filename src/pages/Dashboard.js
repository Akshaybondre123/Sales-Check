import React, { useEffect, useState } from 'react';
import { Chart, registerables } from 'chart.js'; 
import TransactionsTable from '../components/TransactionsTable'; 
import BarChart from '../components/BarChart'; 
import PieChart from '../components/PieChart'; 
import Statistics from '../components/Statistics'; 
import transactionService from '../services/transactionService'; 

Chart.register(...registerables); 

const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
];

const Dashboard = () => {
    const [month, setMonth] = useState('March'); 
    const [transactionData, setTransactionData] = useState([]); 
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 

    useEffect(() => {
        const fetchTransactionData = async () => {
            setLoading(true); 
            setError(null); 

            const year = new Date().getFullYear();
            const monthIndex = months.indexOf(month); 
            
            // Ensure the month index is valid
            if (monthIndex === -1) {
                setError("Invalid month selected."); 
                setLoading(false);
                return; 
            }

            const formattedMonth = `${year}-${String(monthIndex + 1).padStart(2, '0')}`; 

            console.log("Fetching transactions with params:", {
                month: formattedMonth,
                page: 1, // Example pagination
                perPage: 10,
                search: ""
            });

            try {
                const data = await transactionService.getTransactions(formattedMonth); 
                console.log("Fetched Data:", data);
                
                if (data.transactions && Array.isArray(data.transactions)) {
                    setTransactionData(data.transactions); 
                } else {
                    setTransactionData([]); 
                    setError("No transactions found for the selected month."); 
                }
            } catch (error) {
                console.error("Error fetching transaction data:", error);
                if (error.response) {
                    setError(`Error ${error.response.status}: ${error.response.data.message || "Failed to fetch data."}`);
                } else {
                    setError("Failed to fetch transaction data. Please check your network connection or try again later."); 
                }
            } finally {
                setLoading(false); 
            }
        };

        fetchTransactionData(); 
    }, [month]); 

    return (
        <div>
            <h2 style={{ marginBottom: '20px' }}>Transaction Dashboard</h2> 
            <select 
                value={month} 
                onChange={(e) => setMonth(e.target.value)} 
                style={{ margin: '10px 0', padding: '8px', fontSize: '16px' }} 
            >
                {months.map((month) => (
                    <option key={month} value={month}>{month}</option> 
                ))}
            </select>

            {loading ? (
                <p>Loading transaction data...</p> 
            ) : error ? (
                <p style={{ color: 'red' }}>{error}</p> 
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <TransactionsTable month={month} data={transactionData} /> 
                    <Statistics month={month} data={transactionData} /> 
                    <BarChart month={month} data={transactionData} /> 
                    <PieChart month={month} data={transactionData} /> 
                </div>
            )}
        </div>
    );
};

export default Dashboard;
