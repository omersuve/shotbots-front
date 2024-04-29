import React, {FC, useEffect, useState} from "react";
import Navbar from "../../components/Navbar";
import styles from "../NewsView/index.module.css";

const tags = ['Bitcoin', 'Ethereum', 'Solana', 'Solana NFTs', 'Solana Memecoins', 'Runes']

export const TwitterView: FC = ({}) => {
    const [tweets, setTweets] = useState([])

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('/api/twitter');
                const result = await response.json();
                if (response.ok) {
                    setTweets(result);
                } else {
                    console.log("failed to fetch data")
                }
            } catch (err) {
                console.log("failed to fetch data")
            }
        }

        fetchData().then(r => {
        });
    }, []);

    return (
        <div className="mt-20">
            <Navbar/>
            <div className={styles.container}>
                <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 dark:text-gray-400">
                    {tags.map((t) => {
                        return (
                            <li className="me-2">
                                <a href="#"
                                   className="inline-block px-4 py-3 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white">{t}</a>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    );
}