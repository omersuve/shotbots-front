import React, {useEffect, useState} from "react";
import Chart from "chart.js/auto";
import styles from "./index.module.css";

const Tabs: React.FC = () => {
    const [selectedTab, setSelectedTab] = useState(0);

    useEffect(() => {
        // @ts-ignore
        const ctx = document.getElementById("myChart").getContext("2d");

        let chartStatus = Chart.getChart("myChart");
        if (chartStatus != undefined) {
            chartStatus.destroy();
        }

        const chart = new Chart(ctx, {
            type: "pie",
            data: {
                labels: ["BTC", "SOL", "ETH", "JUP"],
                datasets: [
                    {
                        label: "Dataset 1",
                        data: [12, 3, 3, 2],
                        backgroundColor: [
                            "rgba(176,60,84,0.5)",
                            "rgba(54,162,235,0.5)",
                            "rgba(255, 206, 86, 0.5)",
                            "rgba(75, 192, 192, 0.5)",
                        ],
                        borderColor: [
                            "rgba(0,0,0,0.5)",
                            "rgba(0,0,0,0.5)",
                            "rgba(0,0,0,0.5)",
                            "rgba(0,0,0,0.5)",
                        ],
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: "top",
                    },
                    title: {
                        display: true,
                        text: "COIN PRICES",
                    },
                },
            },
        });
    }, []);

    return (
        <div
            className={`${styles.tabs} bg-base-200 flex justify-center p-2 rounded-2xl m-4 max-w-md flex-col gap-y-2 w-full`}>
            <div
                className="bg-base-100 p-1 rounded-xl flex justify-between items-center relative top-0">
                <button
                    className="outline-none w-full p-2 hover:bg-base-300 rounded-xl text-center focus:ring-2 focus:bg-white focus:text-blue-600 text-xs"
                    onClick={() => setSelectedTab(0)}>
                    Portfolio
                </button>
                <button
                    className="outline-none w-full p-2 hover:bg-base-300 rounded-xl text-center focus:ring-2 focus:bg-white focus:text-blue-600 text-xs"
                    onClick={() => setSelectedTab(1)}>
                    Transactions
                </button>
                <button
                    className="outline-none w-full p-2 hover:bg-base-300 rounded-xl text-center focus:ring-2 focus:bg-white focus:text-blue-600 text-xs"
                    onClick={() => setSelectedTab(2)}>
                    Status
                </button>
            </div>
            <div>
                <div className={`${selectedTab === 0 ? "" : "hidden"} flex items-center justify-center`}>
                    <div className={`${styles.portfolio} flex items-center justify-center`}>
                        <canvas id="myChart"></canvas>
                    </div>
                </div>
                <div className={`${selectedTab === 1 ? "" : "hidden"} flex items-center justify-center`}>
                    Transactions
                </div>
                <div className={`${selectedTab === 2 ? "" : "hidden"} flex items-center justify-center`}>
                    Status
                </div>
            </div>
        </div>
    );
};

export default Tabs;