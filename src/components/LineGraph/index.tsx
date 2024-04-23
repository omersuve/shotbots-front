import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const LineGraph = () => {
    const sampleData = [3, 4, 5, 4, 7, 4, 4, 3, 4, 6];
    const sampleData2 = [1, 3, 7, 2, 1, 2, 1, 3, 8, 4];

    const canvasData = {
        datasets: [
            {
                label: "Home",
                borderColor: "red",
                pointRadius: 0,
                fill: false,
                backgroundColor: 'red',
                lineTension: 0.3,
                data: sampleData,
                borderWidth: 2,
            },
            {
                label: "Home",
                borderColor: "yellow",
                pointRadius: 0,
                fill: false,
                backgroundColor: 'yellow',
                lineTension: 0.3,
                data: sampleData2,
                borderWidth: 2,
            },
        ],
    };

    const options = {
        scales: {
            x: {
                grid: {
                    display: false,
                },
                labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                ticks: {
                    color: "red",
                    font: {
                        family: "Nunito",
                        size: 18,
                    },
                },
            },
            y: {
                grid: {
                    display: false,
                },
                border: {
                    display: false,
                },
                min: 0,
                max: 8,
                ticks: {
                    stepSize: 1,
                    color: "green",
                    font: {
                        family: "Nunito",
                        size: 18,
                    },
                },
            },
        },
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
        },
    };

    const graphStyle = {
        minHeight: "16rem",
        maxWidth: "700px",
        width: "100%",
        border: "1px solid #C4C4C4",
        borderRadius: "0.375rem",
        padding: "0.5rem",
    };

    return (
        <div style={graphStyle}>
            <Line id="home" options={options} data={canvasData} />
        </div>
    );
};

export default LineGraph;