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
import styles from "./index.module.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface ScoreHistory {
    day_score: number;
    timestamp: string;
}

interface ResponseHistoryData {
    [collectionName: string]: ScoreHistory[];
}

interface LineGraphProps {
    scoresHistory: ResponseHistoryData;
}

const LineGraph: React.FC<LineGraphProps> = ({ scoresHistory }) => {
    const btc = scoresHistory["bitcoin-day-scores"];
    const ethereum = scoresHistory["ethereum-day-scores"];
    const solana = scoresHistory["solana-day-scores"];
    const nfts = scoresHistory["nft-day-scores"];

    const formattedDate = (timestamp: string) => {
        const date = new Date(timestamp);
        return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getFullYear()).substring(2)}`;
    };


    const canvasData = {
        datasets: [
            {
                label: "BTC",
                borderColor: "orange",
                pointRadius: 2,
                fill: false,
                backgroundColor: "orange",
                lineTension: 0.3,
                data: btc.map(r => r.day_score > 1 ? 10 : r.day_score < 0 ? 0 : r.day_score * 10).reverse(),
                borderWidth: 2,
            },
            {
                label: "ETH",
                borderColor: "blue",
                pointRadius: 2,
                fill: false,
                backgroundColor: "blue",
                lineTension: 0.3,
                data: ethereum.map(r => r.day_score > 1 ? 10 : r.day_score < 0 ? 0 : r.day_score * 10).reverse(),
                borderWidth: 2,
            },
            {
                label: "SOL",
                borderColor: "purple",
                pointRadius: 2,
                fill: false,
                backgroundColor: "purple",
                lineTension: 0.3,
                data: solana.map(r => r.day_score > 1 ? 10 : r.day_score < 0 ? 0 : r.day_score * 10).reverse(),
                borderWidth: 2,
            },
            {
                label: "NFTs",
                borderColor: "black",
                pointRadius: 2,
                fill: false,
                backgroundColor: "black",
                lineTension: 0.3,
                data: nfts.map(r => r.day_score > 1 ? 10 : r.day_score < 0 ? 0 : r.day_score * 10).reverse(),
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
                labels: btc.map((r) => formattedDate(r.timestamp)).reverse(),
                ticks: {
                    color: "gray",
                    font: {
                        family: "Nunito",
                        size: 12,
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
        <div className={styles.graph}>
            <div className={styles.update} style={{ position: "absolute", top: "0.5rem", right: "0.5rem", zIndex: 1 }}>
                <p style={{ color: "black", fontFamily: "Nunito", fontSize: "12px", opacity: "50%" }}>Updated Daily | 20
                    UTC</p>
            </div>
            <div style={{ position: "relative", width: "100%", height: "100%" }}>
                <Line id="home" options={options} data={canvasData} />
            </div>
        </div>
    );
};

export default LineGraph;