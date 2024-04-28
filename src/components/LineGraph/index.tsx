import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const LineGraph = () => {
    const btc = [3, 4, 5, 4, 7, 4, 7];
    const ethereum = [1, 6, 3, 2, 3, 3, 6];
    const solana = [4, 2, 4, 3, 5, 2, 5];
    const nfts = [5, 1, 7, 6, 1, 1, 2];

    const canvasData = {
        datasets: [
            {
                label: "BTC",
                borderColor: "orange",
                pointRadius: 2,
                fill: false,
                backgroundColor: 'orange',
                lineTension: 0.2,
                data: btc,
                borderWidth: 2,
            },
            {
                label: "ETH",
                borderColor: "blue",
                pointRadius: 2,
                fill: false,
                backgroundColor: 'blue',
                lineTension: 0.2,
                data: ethereum,
                borderWidth: 2,
            },
            {
                label: "SOL",
                borderColor: "purple",
                pointRadius: 2,
                fill: false,
                backgroundColor: 'purple',
                lineTension: 0.2,
                data: solana,
                borderWidth: 2,
            },
            {
                label: "NFTs",
                borderColor: "black",
                pointRadius: 2,
                fill: false,
                backgroundColor: 'black',
                lineTension: 0.2,
                data: nfts,
                borderWidth: 2,
            }
        ],
    };

    const options = {
        scales: {
            x: {
                grid: {
                    display: true,
                },
                labels: ["21/4/24", "22/4/24", "23/4/24", "24/4/24", "25/4/24", "26/4/24", "27/4/24"],
                ticks: {
                    color: "gray",
                    font: {
                        family: "Nunito",
                        size: 15,
                    },
                },
            },
            y: {
                grid: {
                    display: true,
                },
                border: {
                    display: false,
                },
                min: 0,
                max: 10,
                ticks: {
                    stepSize: 1,
                    color: "black",
                    font: {
                        family: "Nunito",
                        size: 12,
                    },
                },
            },
        },
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            legend: {
                display: true, // Set to true to show the legend
                labels: {
                    boxWidth: 12, // Adjust the size of the legend box
                    color: 'black', // Set the text color
                    font: {
                        family: 'Nunito',
                        size: 12, // Adjust the font size of the legend labels
                    }
                }
            },
            title: {
                display: false,
            },
        },
    };

    const graphStyle = {
        height: "16rem",
        width: "50rem",
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