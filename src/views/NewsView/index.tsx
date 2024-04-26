import React, {FC, useEffect, useState} from "react";

import styles from "./index.module.css";
import Navbar from "../../components/Navbar";
import NewsCard from "../../components/NewsCard";
import NewsBody from "../../components/NewsBody";

const tags = ['Bitcoin', 'Ethereum', 'Solana', 'Altcoins', 'NFT']

interface News {
    title: string,
    body: string,
    timestamp: string,
    tag: string
}

export const NewsView: FC = ({}) => {
    const [news, setNews] = useState([])
    const [selectedNew, setSelectedNew] = useState(-1)

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
                                return (
                                    <button
                                        className="flex text-center items-center hover:bg-yellow-50 active:bg-yellow-200 focus:bg-yellow-100 rounded-box m-2"
                                        onClick={() => setSelectedNew(i)}>
                                        <NewsCard title={n["title"]}/>
                                    </button>
                                )
                            })
                        }
                    </div>
                    {
                        news && news.length && selectedNew > -1 && <NewsBody body={news[selectedNew]["body"]}/>
                    }
                </div>
            </div>
        </div>
    );
};
