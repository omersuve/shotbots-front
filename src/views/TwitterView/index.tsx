import React, { FC, useEffect, useState } from "react";
import styles from "./index.module.css";
import TweetCard from "../../components/TweetCard";
import MyLoader from "../../components/MyLoader";
import { twitterResponse } from "../../types";

const tags = ["BITCOIN", "ETHEREUM", "SOLANA", "SOLANA NFT", "ETHEREUM NFT", "SOLANA MEMECOIN", "RUNES"];
const collections = ["bitcoin-tweets", "ethereum-tweets", "solana-tweets", "solana-nft-tweets", "ethereum-nft-tweets", "bitcoin-nft-tweets", "solana-memecoin-tweets", "runes-tweets"];

export const TwitterView: FC = () => {
    const [tweets, setTweets] = useState<twitterResponse>({});
    const [loading, setLoading] = useState(true); // Loading state
    const [selectedTab, setSelectedTab] = useState("bitcoin-tweets");
    const [selectedTabIdx, setSelectedTabIdx] = useState(0);


    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                // Prepare request options
                const requestOptions = {
                    method: "POST", // Specify POST method
                    headers: {
                        "Content-Type": "application/json", // Specify JSON content type
                    },
                    body: JSON.stringify(collections), // Convert collections array to JSON string and pass in body
                };
                const response = await fetch("/api/tweets", requestOptions);
                const result: twitterResponse = await response.json();
                if (response.ok) {
                    setTweets(result);
                } else {
                    console.log("failed to fetch data");
                }
            } catch (err) {
                console.log("failed to fetch data");
            } finally {
                setLoading(false); // Set loading state to false after data is fetched
            }
        }

        fetchData().then(r => {
        });
    }, []);

    return (
        <div className={styles["tweet-container"]}>
            <ul className={`${styles["tabs"]} flex flex-wrap text-center text-gray-500`}>
                {tags.map((t, i) => {
                    return (
                        <li key={i}>
                            <button
                                className={`${i !== selectedTabIdx ? "hover:bg-gray-50" : ""} ${i === selectedTabIdx ? "bg-gray-100" : ""} ${styles["tab-view"]} inline-block px-12 py-1`}
                                onClick={() => {
                                    setSelectedTab(`${t.toLowerCase().replace(" ", "-")}-tweets`);
                                    setSelectedTabIdx(i);
                                }}
                            >{t}</button>
                        </li>
                    );
                })}
            </ul>
            <p className="text-center fs-6 fw-bold">RECENT HOT TWEETS</p>
            {loading ? (
                // Display a loading spinner while data is being fetched
                <MyLoader />
            ) : (
                <div className="flex flex-wrap gap-4 mt-4 justify-center">
                    {
                        tweets[selectedTab] &&
                        tweets[selectedTab].map((t, i) => {
                            return (
                                <div key={i}
                                     className="flex text-center hover:bg-yellow-50 active:bg-yellow-200 focus:bg-yellow-100">
                                    <TweetCard text={t["text"]} url={t["url"]} />
                                </div>
                            );
                        })
                    }
                </div>
            )}
        </div>
    );
};