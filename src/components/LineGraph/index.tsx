import React from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface ScoreHistory {
    score: number;
    date: string;
}

interface ResponseHistoryData {
    [collectionName: string]: ScoreHistory[];
}

interface LineGraphProps {
    scoresHistory: ResponseHistoryData;
}

const LineGraph: React.FC<LineGraphProps> = ({ scoresHistory }) => {
    const btc = scoresHistory["bitcoin-scores"];
    const ethereum = scoresHistory["ethereum-scores"];
    const solana = scoresHistory["solana-scores"];
    const nfts = scoresHistory["nft-scores"];

    const canvasData = {
        datasets: [
            {
                label: "BTC",
                borderColor: "orange",
                pointRadius: 2,
                fill: false,
                backgroundColor: "orange",
                lineTension: 0.3,
                data: btc.map((r) => r.score),
                borderWidth: 2,
            },
            {
                label: "ETH",
                borderColor: "blue",
                pointRadius: 2,
                fill: false,
                backgroundColor: "blue",
                lineTension: 0.3,
                data: ethereum.map((r) => r.score),
                borderWidth: 2,
            },
            {
                label: "SOL",
                borderColor: "purple",
                pointRadius: 2,
                fill: false,
                backgroundColor: "purple",
                lineTension: 0.3,
                data: solana.map((r) => r.score),
                borderWidth: 2,
            },
            {
                label: "NFTs",
                borderColor: "black",
                pointRadius: 2,
                fill: false,
                backgroundColor: "black",
                lineTension: 0.3,
                data: nfts.map((r) => r.score),
                borderWidth: 2,
            },
        ],
    };

    const options = {
        scales: {
            x: {
                grid: {
                    display: true,
                },
                labels: btc.map((r) => r.date),
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
                max: 11,
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
                    color: "black", // Set the text color
                    font: {
                        family: "Nunito",
                        size: 12, // Adjust the font size of the legend labels
                    },
                },
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