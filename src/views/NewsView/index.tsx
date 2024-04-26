import React, {FC, useEffect, useState} from "react";

import styles from "./index.module.css";
import Navbar from "../../components/Navbar";
import NewsCard from "../../components/NewsCard";
import NewsBody from "../../components/NewsBody";

const tags = ['Bitcoin', 'Ethereum', 'Solana', 'Altcoins', 'NFT']

export const NewsView: FC = ({}) => {
    const [news, setNews] = useState([])

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('/api/news');
                const result = await response.json();
                if (response.ok) {
                    setNews(result);
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
                <div className="flex overflow-y-scroll">
                    <div className="block">
                        {
                            news &&
                            news.map((n, i) => {
                                return (<NewsCard title={n["title"]}/>)
                            })
                        }
                    </div>
                    {
                        news && news.length && <NewsBody body={news[0]["body"]}/>
                    }
                </div>
            </div>
        </div>
    );
};
