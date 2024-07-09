import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
Chart.register(ArcElement, Tooltip, Legend);

const Utils = {
    CHART_COLORS: {
        oldTestament: 'rgb(14, 234, 255, 0.7)',
        newTestament: 'rgb(245, 235, 103, 0.7)',
        unread: 'rgba(55, 67, 50, 0.7)'
    }
};

const PieChart = ({ maxWidth = 550, maxHeight = 550, dataRead = [0, 0, 0]}) => {
    const data = {
        labels: ['Old Testament', 'New Testament', 'Unread'],
        datasets: [
            {
                label: 'Bible Reading Progress',
                data: dataRead,
                backgroundColor: [
                    Utils.CHART_COLORS.oldTestament,
                    Utils.CHART_COLORS.newTestament,
                    Utils.CHART_COLORS.unread
                ],
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    color: 'white', // Adjust legend text color
                }
            },
            title: {
                display: true,
                text: 'Bible Reading Progress',
                color: 'white',
            }
        }
    };

    return (
        <div style={{ maxWidth, maxHeight, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Pie data={data} options={options} />
        </div>
    );
};

export default PieChart;