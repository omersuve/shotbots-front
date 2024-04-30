import React, {FC, useEffect, useState} from "react";
import Navbar from "../../components/Navbar";
import styles from "../NewsView/index.module.css";
import TweetCard from "../../components/TweetCard";

const tags = ['Bitcoin', 'Ethereum', 'Solana', 'Solana NFTs', 'Solana Memecoins', 'Runes']

export const TwitterView: FC = ({}) => {
    const [tweets, setTweets] = useState([])
    const [loading, setLoading] = useState(true); // Loading state


    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const response = await fetch('/api/tweets');
                const result = await response.json();
                if (response.ok) {
                    setTweets(result);
                } else {
                    console.log("failed to fetch data")
                }
            } catch (err) {
                console.log("failed to fetch data")
            } finally {
                setLoading(false); // Set loading state to false after data is fetched
            }
        }

        fetchData().then(r => {
        });
    }, []);

    return (
        <div className="mt-20">
            <div className={styles.container}>
                <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 dark:text-gray-400">
                    {tags.map((t) => {
                        return (
                            <li className="me-2">
                                <a href={`#${t}`}
                                   className="inline-block px-4 py-3 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white">{t}</a>
                            </li>
                        )
                    })}
                </ul>
                {loading ? (
                    // Display a loading spinner while data is being fetched
                    <div className="flex justify-center items-center w-full h-full">
                        <div className="loader">Loading...</div>
                    </div>
                ) : (
                    <div className="flex overflow-y-scroll">
                        <div className="block">
                            {
                                tweets &&
                                tweets.map((t, i) => {
                                    return (
                                        <div
                                            className="flex text-center items-center hover:bg-yellow-50 active:bg-yellow-200 focus:bg-yellow-100 rounded-box m-2">
                                            <TweetCard text={t["text"]}/>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}