import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import styles from "./index.module.css";
import MyLoader from "../../components/MyLoader";
import Image from "next/image";
import Sol from "../../../public/solana-sol-logo.svg";
import Base from "../../../public/base.png";
import Eth from "../../../public/ethereum-eth-logo.svg";
import Up from "../../../public/up.jpg";
import Down from "../../../public/down.jpg";
import Dex from "../../../public/dex.png";
import Ph from "../../../public/placeholder.png";
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from "chart.js";
import { Memecoin, useMemecoins } from "../../contexts/MemecoinContext";
import { useWallet } from "@solana/wallet-adapter-react";
import { toast } from "react-toastify";
import { formatLargeNumber, formatPrice, formatPriceChange } from "../../utils/formatting";
import { MemecoinData } from "../../types";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type SortConfig = {
    key: keyof MemecoinData | null;
    direction: "ascending" | "descending";
};

export const MemecoinView: FC = () => {
    const { memecoins, loading, error } = useMemecoins();
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: "descending" });
    const [votes, setVotes] = useState<{ [key: string]: { upVote: number, downVote: number } }>({});
    const [uVotes, setUVotes] = useState<string[]>([]);
    const [keys, setKeys] = useState<{ [key: string]: number }>({});
    const [lastPrices, setLastPrices] = useState<{ [key: string]: Memecoin }>({});
    const { publicKey } = useWallet();

    const fetchMemeVotes = async () => {
        const response = await fetch("/api/getMemeVotes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                pk: publicKey?.toString(),
            }),
        });
        if (!response.ok) {
            throw new Error("Failed to fetch meme votes");
        }
        return await response.json();
    };

    useEffect(() => {
        const getVotes = async () => {
            try {
                const { memeVotes, userVotes } = await fetchMemeVotes();
                const votesMap = memeVotes.reduce((acc: any, vote: any) => {
                    acc[vote.baseAddress] = {
                        upVote: vote.upVote,
                        downVote: vote.downVote,
                    };
                    return acc;
                }, {});
                setVotes(votesMap);
                setUVotes(userVotes.map((u: any) => u.baseAddress));
            } catch (err) {
                console.error(err);
            }
        };

        if (publicKey) getVotes().then();
    }, [publicKey]);

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


    const indexOfLastItem = itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedMemecoins.slice(indexOfFirstItem, indexOfLastItem).slice(0, 15);

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
                setUVotes((prevUVotes) => [...prevUVotes, baseAddress]);
                toast("Vote submitted successfully!");
            }
        } catch (err) {
            console.error("Error submitting vote:", err);
            alert("Failed to submit vote");
        }
    };

    useEffect(() => {
        if (!loading) {
            const newKeys = { ...keys };
            const newLastPrices = { ...lastPrices };

            memecoins.forEach((coin) => {
                if (
                  !lastPrices[coin.baseAddress] ||
                  JSON.stringify(lastPrices[coin.baseAddress]) !== JSON.stringify(coin)
                ) {
                    newKeys[coin.baseAddress] = (keys[coin.baseAddress] || 0) + 1;
                    newLastPrices[coin.baseAddress] = coin;
                }
            });

            setKeys(newKeys);
            setLastPrices(newLastPrices);
        }
    }, [memecoins]);

    return (
      <div className={styles.container}>
          {loading ? (
            <MyLoader />
          ) : (
            <div className={styles["table-container"]}>
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
                      <tr key={keys[coin.baseAddress] || coin.baseAddress} className={styles.flash}>
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
                                    className="hidden lg:block lg:w-32 text-left truncate pointer-events-none">
                                      {coin.name}
                                  </div>
                                  <div
                                    className="w-12 lg:w-24 mr-1 flex justify-center pointer-events-none">
                                      <Image
                                        src={coin.logoUrl == "https://dd.dexscreener.com/ds-data/tokens/ethereum/0xe0f63a424a4439cbe457d80e4f4b51ad25b2c56c.png" ? Ph.src : coin.logoUrl || Ph.src}
                                        alt={`${coin.name} logo`}
                                        width={35}
                                        height={35}
                                        className={styles.logo}
                                      />
                                  </div>
                                  <div
                                    className={`w-12 lg:w-20 flex justify-center ${publicKey && uVotes.includes(coin.baseAddress) ? "opacity-75 pointer-events-none" : "opacity-50"}`}>
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
                                  <div
                                    className={`ml-2 w-12 lg:w-20 flex justify-center ${publicKey && uVotes.includes(coin.baseAddress) ? "opacity-75 pointer-events-none" : "opacity-50"}`}>
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
                          <td
                            className={`${coin.price_change_1d !== null && coin.price_change_1d >= 0 ? styles.priceChangePositive : styles.priceChangeNegative} pointer-events-none`}>
                              {formatPriceChange(coin.price_change_1d)}
                          </td>
                          <td className="pointer-events-none">{formatLargeNumber(coin.real_volume_1d)}</td>
                          <td className="pointer-events-none">{formatLargeNumber(coin.liquidity)}</td>
                          <td
                            className="pointer-events-none">{formatLargeNumber(coin.circulating_marketcap)}</td>
                      </tr>
                    ))}
                    </tbody>
                </table>
            </div>
          )}
      </div>
    );
};