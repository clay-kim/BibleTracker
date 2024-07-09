import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


//  group, books, color, progressData  이거를 아예 다시짜
// 홈에서 받은 프로세스 테이터? 를 가지고, 라벨 데이터를 지정
// 다시 홈에서 바챠트 컴포넌트를 사용할때에 그룹이름, 책이름, 토탈 레인지를 넣어서 사용

const BarChartBible = ({ group, books, color, progressData }) => {

    const data = {
        labels: books,
        datasets: [{
            label: `${group} Reading Progress`,
            data: progressData.map(data => data.totalRange),
            backgroundColor: color,
            borderColor: color,
            borderWidth: 1,
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: 'white', // Adjust legend text color
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: 'white', // Adjust x-axis label color
                },
                stacked: true,
            },
            y: {
                ticks: {
                    color: 'grey', // Adjust x-axis label color
                },
                stacked: true,
                beginAtZero: true
            }
        }
    };

    return <Bar data={data} options={options} />;
};

export default BarChartBible;
