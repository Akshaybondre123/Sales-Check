
import React from 'react';
import { Bar } from 'react-chartjs-2';

const BarChart = ({ month}) => {
    
    const data = {
        labels: ['Product A', 'Product B', 'Product C'],
        datasets: [
            {
                label: 'Sales',
                data: [12, 19, 3],
                backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)'],
                borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div>
            <h2>Sales Bar Chart for {month}</h2>
            <Bar data={data} options={options} />
        </div>
    );
};

export default BarChart;
