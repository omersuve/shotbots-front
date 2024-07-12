import React, { FC, useEffect, useMemo, useState } from "react";
import styles from "./index.module.css";
import MyLoader from "../../components/MyLoader";
import Image from "next/image";
import { useNfts } from "../../contexts/NftContext";
import { NftData } from "../../types";
import { formatLargeNumber, formatPrice, formatPriceChange } from "../../utils/formatting";
import Up from "../../../public/up.jpg";
import Down from "../../../public/down.jpg";
import Me from "../../../public/me.png";
import Ph from "../../../public/placeholder.png";
import { toast } from "react-toastify";
import { useWallet } from "@solana/wallet-adapter-react";
import { usePrices } from "../../contexts/PricesContext";

type SortConfig = {
    key: keyof NftData | null;
    direction: "ascending" | "descending";
};

export const NftView: FC = () => {
    const { nfts, loading, error } = useNfts();
    const { prices, loading: loadingPrice } = usePrices();
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: "descending" });
    const [votes, setVotes] = useState<{ [key: string]: { upVote: number, downVote: number } }>({});
    const [uVotes, setUVotes] = useState<string[]>([]);
    const { publicKey } = useWallet();

    const fetchNftVotes = async () => {
        const response = await fetch("/api/getNftVotes", {
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
                const { nftVotes, userVotes } = await fetchNftVotes();
                const votesMap = nftVotes.reduce((acc: any, vote: any) => {
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

        getVotes().then();
    }, [publicKey]);

    const itemsPerPage = 30;

    const sortedNfts = useMemo(() => {
        let sortableItems = [...nfts].map((nft) => ({
            ...nft,
            upVote: votes[nft.name]?.upVote || 0,
            downVote: votes[nft.name]?.downVote || 0,
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
    }, [nfts, sortConfig]);

    const requestSort = (key: keyof NftData) => {
        let direction: "ascending" | "descending" = "descending";
        if (sortConfig.key === key && sortConfig.direction === "descending") {
            direction = "ascending";
        }
        setSortConfig({ key, direction });
    };

    const handleVote = async (name: string, vote: "upvote" | "downvote") => {
        if (!publicKey) {
            toast("Please connect your wallet first.");
            return;
        }

        try {
            const response = await fetch("/api/nftVote", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    pk: publicKey.toString(),
                    baseAddress: name,
                    vote,
                }),
            });

            if (response.status != 200) {
                toast("Already voted for this meme!");
            } else {
                setVotes((prevVotes) => {
                    const currentVotes = prevVotes[name] || { upVote: 0, downVote: 0 };

                    return {
                        ...prevVotes,
                        [name]: {
                            upVote: vote === "upvote" ? currentVotes.upVote + 1 : currentVotes.upVote,
                            downVote: vote === "downvote" ? currentVotes.downVote + 1 : currentVotes.downVote,
                        },
                    };
                });
                setUVotes((prevUVotes) => [...prevUVotes, name]);
                toast("Vote submitted successfully!");
            }
        } catch (err) {
            console.error("Error submitting vote:", err);
            alert("Failed to submit vote");
        }
    };

    const getSortIndicator = (key: keyof NftData) => {
        if (sortConfig.key !== key) {
            return null;
        }
        return sortConfig.direction === "ascending" ? "↑" : "↓";
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedNfts.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(nfts.length / itemsPerPage);

    return (
      <div className={styles.container}>
          {loading || loadingPrice ? (
            <MyLoader />
          ) : (
            <div className={styles["tables-container"]}>
                <div className={styles["table-container"]}>
                    <p className="text-center fs-6 fw-bold mb-4 mt-3 lg:mt-1">TOP PERFORMING NFTs</p>
                    <div className={styles["table-wrapper"]}>
                        <table className={styles.table}>
                            <thead>
                            <tr>
                                <th>#</th>
                                <th onClick={() => requestSort("name")} className={styles.sortableHeader}>
                                    Name {getSortIndicator("name")}
                                </th>
                                <th onClick={() => requestSort("totalSupply")} className={styles.sortableHeader}>
                                    Supply {getSortIndicator("totalSupply")}
                                </th>
                                <th onClick={() => requestSort("uniqueHolders")} className={styles.sortableHeader}>
                                    Holders {getSortIndicator("uniqueHolders")}
                                </th>
                                <th onClick={() => requestSort("floorPriceSol")} className={styles.sortableHeader}>
                                    Price {getSortIndicator("floorPriceSol")}
                                </th>
                                <th onClick={() => requestSort("avgPriceChange")} className={styles.sortableHeader}>
                                    Price % {getSortIndicator("avgPriceChange")}
                                </th>
                                <th onClick={() => requestSort("volumeUsd")} className={styles.sortableHeader}>
                                    Volume {getSortIndicator("volumeUsd")}
                                </th>
                                <th onClick={() => requestSort("volumeChange")} className={styles.sortableHeader}>
                                    Volume % {getSortIndicator("volumeChange")}
                                </th>
                                <th onClick={() => requestSort("traders")} className={styles.sortableHeader}>
                                    Traders {getSortIndicator("traders")}
                                </th>
                                <th onClick={() => requestSort("tradersChange")} className={styles.sortableHeader}>
                                    Traders % {getSortIndicator("tradersChange")}
                                </th>
                                <th onClick={() => requestSort("sales")} className={styles.sortableHeader}>
                                    Sales {getSortIndicator("sales")}
                                </th>
                                <th onClick={() => requestSort("salesChange")} className={styles.sortableHeader}>
                                    Sales % {getSortIndicator("salesChange")}
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {currentItems.map((nft, index) => (
                              <tr key={nft.name}
                                  className={`${publicKey && uVotes.includes(nft.name) ? "bg-gray-300 pointer-events-none" : ""}`}>
                                  <td className="pointer-events-none">{indexOfFirstItem + index + 1}</td>
                                  <td>
                                      <div className="flex items-center">
                                          <div className="w-12 lg:w-24 mr-1 flex justify-center pointer-events-none">
                                              <Image src={nft.logoUrl} alt={`${nft.name} logo`} width={35}
                                                     height={35} className={styles.logo} />
                                          </div>
                                          <div
                                            className="w-16 mr-1 lg:block lg:w-48 text-left truncate pointer-events-none">
                                              {nft.name}
                                          </div>
                                          <div className="w-12 lg:w-20 flex justify-center opacity-75">
                                              <button
                                                onClick={() => handleVote(nft.name, "upvote")}
                                                className="bg-none border-none cursor-pointer text-l hover:text-blue-500 transition-transform duration-100 ease-in-out transform hover:scale-125"
                                              >
                                                  <Image
                                                    src={Up}
                                                    alt="up"
                                                    className="w-4 h-4 lg:w-5 lg:h-5 rounded-full"
                                                  />
                                              </button>
                                              <span
                                                className="w-1 text-center text-sm ml-0.5 lg:ml-1.5 pointer-events-none">{votes[nft.name]?.upVote || 0}</span> {/* Upvote count */}
                                          </div>
                                          <div className="ml-2 w-12 lg:w-20 flex justify-center opacity-75">
                                              <button
                                                onClick={() => handleVote(nft.name, "downvote")}
                                                className="bg-none border-none cursor-pointer text-l hover:text-blue-500 transition-transform duration-100 ease-in-out transform hover:scale-125"
                                              >
                                                  <Image
                                                    src={Down}
                                                    alt="down"
                                                    className="w-4 h-4 lg:w-5 lg:h-5 rounded-full"
                                                  />
                                              </button>
                                              <span
                                                className="w-1 text-center text-sm ml-0.5 lg:ml-1.5 pointer-events-none">{votes[nft.name]?.downVote || 0}</span> {/* Downvote count */}
                                          </div>
                                          <div className="ml-2 w-16 lg:w-36 flex justify-center opacity-75">
                                              <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    window.open(nft.url, "_blank");
                                                }}
                                                className="bg-none border-none cursor-pointer text-l hover:text-blue-500 transition-transform duration-100 ease-in-out transform hover:scale-125"
                                              >
                                                  <Image
                                                    src={Me}
                                                    alt="dex"
                                                    className="w-5 h-5 lg:w-8 lg:h-8 rounded-full"
                                                  />
                                              </button>
                                          </div>
                                      </div>
                                  </td>
                                  <td
                                    className="pointer-events-none">{nft.totalSupply}
                                  </td>
                                  <td
                                    className="pointer-events-none">{nft.uniqueHolders}
                                  </td>
                                  <td
                                    className="pointer-events-none">{formatPrice(nft.floorPriceSol / 1000000000 * parseFloat(prices["solana"].price))}$
                                  </td>
                                  <td
                                    className={`${nft.avgPriceChange !== null && nft.avgPriceChange >= 0 ? styles.priceChangePositive : styles.priceChangeNegative} pointer-events-none`}>
                                      {formatPriceChange(nft.avgPriceChange)}
                                  </td>
                                  <td className="pointer-events-none">{formatLargeNumber(nft.volumeUsd)}</td>
                                  <td
                                    className={`${nft.volumeChange !== null && nft.volumeChange >= 0 ? styles.priceChangePositive : styles.priceChangeNegative} pointer-events-none`}>
                                      {formatPriceChange(nft.volumeChange)}
                                  </td>
                                  <td className="pointer-events-none">{nft.traders}</td>
                                  <td
                                    className={`${nft.tradersChange !== null && nft.tradersChange >= 0 ? styles.priceChangePositive : styles.priceChangeNegative} pointer-events-none`}>
                                      {formatPriceChange(nft.tradersChange)}
                                  </td>
                                  <td className="pointer-events-none">{nft.sales}</td>
                                  <td
                                    className={`${nft.salesChange !== null && nft.salesChange >= 0 ? styles.priceChangePositive : styles.priceChangeNegative} pointer-events-none`}>
                                      {formatPriceChange(nft.salesChange)}
                                  </td>
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
            </div>
          )}
      </div>
    );
};
