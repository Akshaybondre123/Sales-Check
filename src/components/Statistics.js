import React from 'react';

const Statistics = ({ month, data }) => {
    const totalTransactions = Array.isArray(data) ? data.length : 0;

    const totalSales = Array.isArray(data)
        ? data.reduce((acc, transaction) => {
              
              const price = Number(transaction.price) || 0;
              return acc + price;
          }, 0)
        : 0;

   
    const averageSaleValue = totalTransactions > 0 ? (totalSales / totalTransactions).toFixed(2) : 0;

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
            <h3>Statistics for {month}</h3>
            <p>Total Transactions: {totalTransactions}</p>
            <p>Total Sales: ${totalSales.toFixed(2)}</p>
            {totalTransactions > 0 && (
                <p>Average Sale Value: ${averageSaleValue}</p>
            )}
        </div>
    );
};

export default Statistics;
