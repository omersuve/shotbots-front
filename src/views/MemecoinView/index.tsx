import React, { useEffect, useState, useMemo, FC } from "react";
import styles from "./index.module.css";
import MyLoader from "../../components/MyLoader";
import Image from "next/image";
import Sol from "../../../public/solana-sol-logo.svg";
import Base from "../../../public/base.png";
import Eth from "../../../public/ethereum-eth-logo.svg";
import Poly from "../../../public/polygon-matic-logo.svg";
import BSC from "../../../public/bsc.png";
import Doge from "../../../public/dogechain.jpeg";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { useMemecoins } from "../../contexts/MemecoinContext";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type Memecoin = {
    id: string;
    name: string;
    symbol: string;
    price: number | null;
    price_change_1d: number | null;
    real_volume_1d: number | null;
    circulating_marketcap: number | null;
    chainId: string;
    url: string;
};

type SortConfig = {
    key: keyof Memecoin | null;
    direction: "ascending" | "descending";
};

const subscriptDigits = ["₀", "₁", "₂", "₃", "₄", "₅", "₆", "₇", "₈", "₉",
    "₁₀", "₁₁", "₁₂", "₁₃", "₁₄", "₁₅", "₁₆", "₁₇", "₁₈", "₁₉", "₂₀",
];

export const MemecoinView: FC = () => {
    const { memecoins, loading, error } = useMemecoins();
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: "descending" });
    const itemsPerPage = 10;

    const sortedMemecoins = useMemo(() => {
        let sortableItems = [...memecoins];
        if (sortConfig.key) {
            sortableItems.sort((a, b) => {
                const aValue = a[sortConfig.key!];
                const bValue = b[sortConfig.key!];
                if (aValue === null || bValue === null) {
                    return 0;
                }
                if (aValue < bValue) {
                    return sortConfig.direction === "ascending" ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === "ascending" ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [memecoins, sortConfig]);

    const requestSort = (key: keyof Memecoin) => {
        let direction: "ascending" | "descending" = "descending";
        if (sortConfig.key === key && sortConfig.direction === "descending") {
            direction = "ascending";
        }
        setSortConfig({ key, direction });
    };

    const getSortIndicator = (key: keyof Memecoin) => {
        if (sortConfig.key !== key) {
            return null;
        }
        return sortConfig.direction === "ascending" ? "↑" : "↓";
    };

    const formatPrice = (value: number | null): string | null => {
        if (value === null) return null;
        if (value === 0) return "0";
        const formatted = value.toPrecision(2);

        // Convert scientific notation to fixed-point notation if necessary
        if (formatted.includes("e")) {
            const [base, exponent] = formatted.split("e");
            const exponentNumber = parseInt(exponent, 10);
            const number = parseFloat(base) * Math.pow(10, exponentNumber);

            if (exponentNumber < -4) {
                const decimalPlaces = Math.abs(exponentNumber) - 1;
                const significantPart = number.toFixed(Math.abs(exponentNumber) + 1).replace(/^-?0\.0*/, "");
                return `$0.0${subscriptDigits[decimalPlaces]}${significantPart}`;
            }

            return number.toFixed(Math.max(0, -exponentNumber + 1));
        }

        return parseFloat(formatted).toString(); // Remove unnecessary trailing zeros
    };

    const formatPriceChange = (value: number | null): string | null => {
        if (value === null) return null;
        const roundedValue = Math.round(value);
        const sign = roundedValue >= 0 ? "+" : "-";
        return `${sign}${Math.abs(roundedValue)}%`;
    };

    const formatLargeNumber = (value: number | null): string | null => {
        if (value === null) return null;
        if (value >= 1_000_000_000) {
            return `${(value / 1_000_000_000).toFixed(2)}B`;
        } else if (value >= 1_000_000) {
            return `${(value / 1_000_000).toFixed(2)}M`;
        } else if (value >= 1_000) {
            return `${(value / 1_000).toFixed(2)}K`;
        } else {
            return value.toFixed(2); // Ensure two decimal places for values below 1,000
        }
    };


    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedMemecoins.slice(indexOfFirstItem, indexOfLastItem).slice(0, 15);

    const totalPages = Math.ceil(memecoins.length / itemsPerPage);

    // Data for the sentiment score bar chart
    const sentimentData = {
        labels: ["Daumen", "Nub", "Michi", "Wif", "Bonk"],
        datasets: [
            {
                label: "Sentiment Score",
                data: [7, 6, 5, 5, 5],
                backgroundColor: [
                    "rgba(255, 99, 132, 0.2)",
                    "rgba(255, 159, 64, 0.2)",
                    "rgba(255, 205, 86, 0.2)",
                    "rgba(75, 192, 192, 0.2)",
                    "rgba(54, 162, 235, 0.2)",
                    "rgba(153, 102, 255, 0.2)",
                    "rgba(201, 203, 207, 0.2)",
                ],
                borderColor: [
                    "rgb(255, 99, 132)",
                    "rgb(255, 159, 64)",
                    "rgb(255, 205, 86)",
                    "rgb(75, 192, 192)",
                    "rgb(54, 162, 235)",
                    "rgb(153, 102, 255)",
                    "rgb(201, 203, 207)",
                ],
                borderWidth: 1,
            },
        ],
    };

    const sentimentOptions = {
        scales: {
            y: {
                beginAtZero: true,
                max: 10,
                ticks: {
                    stepSize: 1,
                },
            },
        },
        maintainAspectRatio: false, // This allows for more flexible resizing
        aspectRatio: 0.25,
    };

    return (
        <div className={styles.container}>
            {loading ? (
                <MyLoader />
            ) : (
                <div className={styles["tables-container"]}>
                    <div className={styles["table-container"]}>
                        <p className="text-center fs-6 fw-bold mb-4">TOP PERFORMING MEMECOINS</p>
                        <div className={styles["table-wrapper"]}>
                            <table className={styles.table}>
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th onClick={() => requestSort("name")} className={styles.sortableHeader}>
                                        Name {getSortIndicator("name")}
                                    </th>
                                    <th onClick={() => requestSort("symbol")} className={styles.sortableHeader}>
                                        Symbol {getSortIndicator("symbol")}
                                    </th>
                                    <th onClick={() => requestSort("price")} className={styles.sortableHeader}>
                                        Price {getSortIndicator("price")}
                                    </th>
                                    <th onClick={() => requestSort("price_change_1d")}
                                        className={styles.sortableHeader}>
                                        Change (1D) {getSortIndicator("price_change_1d")}
                                    </th>
                                    <th onClick={() => requestSort("real_volume_1d")} className={styles.sortableHeader}>
                                        Volume (1D) {getSortIndicator("real_volume_1d")}
                                    </th>
                                    <th onClick={() => requestSort("circulating_marketcap")}
                                        className={styles.sortableHeader}>
                                        Market Cap {getSortIndicator("circulating_marketcap")}
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {currentItems.map((coin, index) => (
                                    <tr key={coin.id}>
                                        <td className="pointer-events-none">{indexOfFirstItem + index + 1}</td>
                                        <td onClick={(e) => {
                                            e.preventDefault();
                                            console.log(`Navigating to: ${coin.url}`); // Debug log
                                            window.open(coin.url, "_blank");
                                        }} className="hover:bg-gray-300"
                                            style={{ cursor: "pointer" }}>
                                            <div className="inline-flex float-left">
                                                {coin.chainId == "solana" ? (
                                                    <Image src={Sol} alt="solana"
                                                           style={{ width: "16px", marginRight: "8px" }} />
                                                ) : coin.chainId == "base" ? (
                                                    <Image src={Base} alt="base"
                                                           style={{
                                                               width: "16px",
                                                               marginRight: "8px",
                                                           }} />
                                                ) : coin.chainId == "ethereum" ? (
                                                    <Image src={Eth} alt="ethereum"
                                                           style={{
                                                               width: "10px",
                                                               marginRight: "10px",
                                                               marginLeft: "2px",
                                                           }} />
                                                ) : coin.chainId == "polygon" ? (
                                                    <Image src={Poly} alt="polygon"
                                                           style={{
                                                               width: "16px",
                                                               marginRight: "10px",
                                                               marginLeft: "2px",
                                                           }} />
                                                ) : coin.chainId == "bsc" ? (
                                                    <Image src={BSC} alt="bsc"
                                                           style={{
                                                               width: "16px",
                                                               marginRight: "10px",
                                                           }} />
                                                ) : coin.chainId == "dogechain" && (
                                                    <Image src={Doge} alt="dogechain"
                                                           style={{
                                                               width: "16px",
                                                               marginRight: "10px",
                                                           }} />)}
                                                {coin.name}
                                            </div>
                                        </td>
                                        <td className="pointer-events-none">{coin.symbol?.toUpperCase()}</td>
                                        <td className="pointer-events-none">{formatPrice(coin.price)}</td>
                                        <td className={`${coin.price_change_1d !== null && coin.price_change_1d >= 0 ? styles.priceChangePositive : styles.priceChangeNegative} pointer-events-none`}>
                                            {formatPriceChange(coin.price_change_1d)}
                                        </td>
                                        <td className="pointer-events-none">{formatLargeNumber(coin.real_volume_1d)}</td>
                                        <td className="pointer-events-none">{formatLargeNumber(coin.circulating_marketcap)}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                        <div className={styles.pagination}>
                            {Array.from({ length: totalPages }, (_, index) => (
                                <button
                                    key={index + 1}
                                    onClick={() => setCurrentPage(index + 1)}
                                    className={currentPage === index + 1 ? styles.activePage : ""}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                    {/*<div className={styles["table-sentiment-container"]}>*/}
                    {/*    <div className={styles["table-wrapper-sentiment"]} style={{ height: "350px", width: "350px" }}>*/}
                    {/*        <p className="text-center fs-6 fw-bold mb-4">OUR SELECTIONS</p>*/}
                    {/*        <Bar data={sentimentData} options={sentimentOptions} />*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                </div>
            )}
        </div>
    );
};