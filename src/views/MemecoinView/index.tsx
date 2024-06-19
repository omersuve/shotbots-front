import React, { useEffect, useState, useMemo, FC } from "react";
import styles from "./index.module.css";
import MyLoader from "../../components/MyLoader";
import Image from "next/image";
import Sol from "../../../public/solana-sol-logo.svg";
import Base from "../../../public/base.png";
import Eth from "../../../public/ethereum-eth-logo.svg";
import Up from "../../../public/up.jpg";
import Down from "../../../public/down.jpg";
import Dex from "../../../public/dex.png";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { useMemecoins } from "../../contexts/MemecoinContext";
import { useWallet } from "@solana/wallet-adapter-react";
import { toast } from "react-toastify";
import { formatPrice, formatPriceChange, formatLargeNumber } from "../../utils/formatting";
import { MemecoinData } from "../../types";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type SortConfig = {
    key: keyof MemecoinData | null;
    direction: "ascending" | "descending";
};

const subscriptDigits = ["₀", "₁", "₂", "₃", "₄", "₅", "₆", "₇", "₈", "₉",
    "₁₀", "₁₁", "₁₂", "₁₃", "₁₄", "₁₅", "₁₆", "₁₇", "₁₈", "₁₉", "₂₀",
];

const fetchMemeVotes = async () => {
    const response = await fetch("/api/getMemeVotes");
    if (!response.ok) {
        throw new Error("Failed to fetch meme votes");
    }
    const data = await response.json();
    return data;
};

export const MemecoinView: FC = () => {
    const { memecoins, loading, error } = useMemecoins();
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: "descending" });
    const [votes, setVotes] = useState<{ [key: string]: { upVote: number, downVote: number } }>({});
    const { publicKey } = useWallet();

    useEffect(() => {
        const getVotes = async () => {
            try {
                const votes = await fetchMemeVotes();
                const votesMap = votes.reduce((acc: any, vote: any) => {
                    acc[vote.baseAddress] = {
                        upVote: vote.upVote,
                        downVote: vote.downVote,
                    };
                    return acc;
                }, {});
                setVotes(votesMap);
            } catch (err) {
                console.error(err);
            }
        };

        getVotes().then();
    }, []);

    const itemsPerPage = 30;

    const sortedMemecoins = useMemo(() => {
        let sortableItems = [...memecoins].map((coin) => ({
            ...coin,
            upVote: votes[coin.baseAddress]?.upVote || 0,
            downVote: votes[coin.baseAddress]?.downVote || 0,
        }));
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

    const requestSort = (key: keyof MemecoinData) => {
        let direction: "ascending" | "descending" = "descending";
        if (sortConfig.key === key && sortConfig.direction === "descending") {
            direction = "ascending";
        }
        setSortConfig({ key, direction });
    };

    const getSortIndicator = (key: keyof MemecoinData) => {
        if (sortConfig.key !== key) {
            return null;
        }
        return sortConfig.direction === "ascending" ? "↑" : "↓";
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

    const handleVote = async (baseAddress: string, vote: "upvote" | "downvote") => {
        if (!publicKey) {
            toast("Please connect your wallet first.");
            return;
        }

        try {
            const response = await fetch("/api/memeVote", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    pk: publicKey.toString(),
                    baseAddress,
                    vote,
                }),
            });

            if (response.status != 200) {
                toast("Already voted for this meme!");
            } else {
                setVotes((prevVotes) => {
                    const currentVotes = prevVotes[baseAddress] || { upVote: 0, downVote: 0 };

                    return {
                        ...prevVotes,
                        [baseAddress]: {
                            upVote: vote === "upvote" ? currentVotes.upVote + 1 : currentVotes.upVote,
                            downVote: vote === "downvote" ? currentVotes.downVote + 1 : currentVotes.downVote,
                        },
                    };
                });

                toast("Vote submitted successfully!");
            }
        } catch (err) {
            console.error("Error submitting vote:", err);
            alert("Failed to submit vote");
        }
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
                                    <th onClick={() => requestSort("liquidity")} className={styles.sortableHeader}>
                                        Liquidity {getSortIndicator("liquidity")}
                                    </th>
                                    <th onClick={() => requestSort("circulating_marketcap")}
                                        className={styles.sortableHeader}>
                                        Market Cap {getSortIndicator("circulating_marketcap")}
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {currentItems.map((coin, index) => (
                                    <tr key={coin.baseAddress}>
                                        <td className="pointer-events-none">{indexOfFirstItem + index + 1}</td>
                                        <td>
                                            <div className="flex items-center">
                                                <div className="w-12 lg:w-16 flex justify-center pointer-events-none">
                                                    {coin.chainId == "solana" ? (
                                                        <Image src={Sol} alt="solana"
                                                               style={{ width: "16px", marginRight: "8px" }} />
                                                    ) : coin.chainId == "base" ? (
                                                        <Image src={Base} alt="base"
                                                               style={{
                                                                   width: "16px",
                                                                   marginRight: "8px",
                                                               }} />
                                                    ) : coin.chainId == "ethereum" && (
                                                        <Image src={Eth} alt="ethereum"
                                                               style={{
                                                                   width: "10px",
                                                                   marginRight: "10px",
                                                                   marginLeft: "2px",
                                                               }} />
                                                    )}
                                                </div>
                                                <div
                                                    className="hidden lg:block lg:w-48 lg:text-left lg:truncate lg:pointer-events-none">
                                                    {coin.name}
                                                </div>
                                                <div className="w-12 lg:w-20 flex justify-center opacity-75">
                                                    <button
                                                        onClick={() => handleVote(coin.baseAddress, "upvote")}
                                                        className="bg-none border-none cursor-pointer text-l hover:text-blue-500 transition-transform duration-100 ease-in-out transform hover:scale-125"
                                                    >
                                                        <Image
                                                            src={Up}
                                                            alt="up"
                                                            className="w-4 h-4 lg:w-5 lg:h-5 rounded-full"
                                                        />
                                                    </button>
                                                    <span
                                                        className="w-1 text-center text-sm ml-0.5 lg:ml-1.5 pointer-events-none">{votes[coin.baseAddress]?.upVote || 0}</span> {/* Upvote count */}
                                                </div>
                                                <div className="ml-2 w-12 lg:w-20 flex justify-center opacity-75">
                                                    <button
                                                        onClick={() => handleVote(coin.baseAddress, "downvote")}
                                                        className="bg-none border-none cursor-pointer text-l hover:text-blue-500 transition-transform duration-100 ease-in-out transform hover:scale-125"
                                                    >
                                                        <Image
                                                            src={Down}
                                                            alt="down"
                                                            className="w-4 h-4 lg:w-5 lg:h-5 rounded-full"
                                                        />
                                                    </button>
                                                    <span
                                                        className="w-1 text-center text-sm ml-0.5 lg:ml-1.5 pointer-events-none">{votes[coin.baseAddress]?.downVote || 0}</span> {/* Downvote count */}
                                                </div>
                                                <div className="ml-2 w-16 lg:w-36 flex justify-center opacity-75">
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            window.open(coin.url, "_blank");
                                                        }}
                                                        className="bg-none border-none cursor-pointer text-l hover:text-blue-500 transition-transform duration-100 ease-in-out transform hover:scale-125"
                                                    >
                                                        <Image
                                                            src={Dex}
                                                            alt="dex"
                                                            className="w-5 h-5 lg:w-8 lg:h-8 rounded-full"
                                                        />
                                                    </button>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="pointer-events-none text-center">{coin.symbol?.toUpperCase()}</td>
                                        <td className="pointer-events-none">{formatPrice(coin.price)}</td>
                                        <td className={`${coin.price_change_1d !== null && coin.price_change_1d >= 0 ? styles.priceChangePositive : styles.priceChangeNegative} pointer-events-none`}>
                                            {formatPriceChange(coin.price_change_1d)}
                                        </td>
                                        <td className="pointer-events-none">{formatLargeNumber(coin.real_volume_1d)}</td>
                                        <td className="pointer-events-none">{formatLargeNumber(coin.liquidity)}</td>
                                        <td className="pointer-events-none">{formatLargeNumber(coin.circulating_marketcap)}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                        {/*<div className={styles.pagination}>*/}
                        {/*    {Array.from({ length: totalPages }, (_, index) => (*/}
                        {/*        <button*/}
                        {/*            key={index + 1}*/}
                        {/*            onClick={() => setCurrentPage(index + 1)}*/}
                        {/*            className={currentPage === index + 1 ? styles.activePage : ""}*/}
                        {/*        >*/}
                        {/*            {index + 1}*/}
                        {/*        </button>*/}
                        {/*    ))}*/}
                        {/*</div>*/}
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