
import React from 'react';
import { Pie } from 'react-chartjs-2';

const PieChart = ({ month }) => {
    
    const data = {
        labels: ['Sold', 'Unsold'],
        datasets: [
            {
                label: 'Transaction Distribution',
                data: [40, 60],
                backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)'],
                borderColor: ['rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)'],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div>
            <h2>Transaction Distribution for {month}</h2>
            <Pie data={data} />
        </div>
    );
};

export default PieChart;
