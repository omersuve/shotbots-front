import React, {FC, useEffect, useState} from "react";
import styles from "./index.module.css";
import NewsCard from "../../components/NewsCard";
import NewsBody from "../../components/NewsBody";
import MyLoader from "../../components/MyLoader";


const tags = ['BITCOIN', 'ETHEREUM', 'SOLANA', 'ALTCOINS', 'NFT']
const collections = ['bitcoin-news', 'ethereum-news', 'solana-news', 'altcoins-news', 'nft-news']

interface ResponseData {
    [collectionName: string]: News[]; // Define the type of data returned for each collection
}

interface News {
    title: string,
    body: string,
    timestamp: string,
    tag: string
}

export const NewsView: FC = () => {
    const [news, setNews] = useState<ResponseData>({})
    const [selectedNew, setSelectedNew] = useState(0)
    const [selectedTabIdx, setSelectedTabIdx] = useState(0)
    const [loading, setLoading] = useState(true); // Loading state
    const [selectedTab, setSelectedTab] = useState('bitcoin-news')

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                // Prepare request options
                const requestOptions = {
                    method: 'POST', // Specify POST method
                    headers: {
                        'Content-Type': 'application/json', // Specify JSON content type
                    },
                    body: JSON.stringify(collections), // Convert collections array to JSON string and pass in body
                };
                const response = await fetch('/api/news', requestOptions);
                const result = await response.json();
                if (response.ok) {
                    setNews(result);
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
            <ul className={`${styles["tabs"]} flex flex-wrap text-center text-gray-500`}>
                {tags.map((t, i) => {
                    return (
                        <li key={i}>
                            <button
                                className={`${i !== selectedTabIdx ? "hover:bg-gray-50" : ""} ${i === selectedTabIdx ? "bg-gray-100" : ""} inline-block p-2 rounded-lg`}
                                onClick={() => {
                                    setSelectedNew(0)
                                    setSelectedTab(`${t.toLowerCase()}-news`)
                                    setSelectedTabIdx(i)
                                }}
                            >{t}</button>
                        </li>
                    )
                })}
            </ul>
            {loading ? (
                // Display a loading spinner while data is being fetched
                <MyLoader/>
            ) : (
                <div className="flex overflow-y-scroll">
                    <div className="block">
                        {
                            news[selectedTab] &&
                            news[selectedTab].map((n, i) => {
                                return (
                                    <button
                                        key={i}
                                        className={`flex text-center items-center ${i !== selectedNew ? "active:bg-yellow-200" : ""} ${i !== selectedNew ? "hover:bg-yellow-100" : ""} ${i === selectedNew ? "bg-yellow-300" : ""} rounded-box m-6`}
                                        onClick={() => setSelectedNew(i)}>
                                        <NewsCard title={n["title"]} isOpen={i === selectedNew}/>
                                    </button>
                                )
                            })
                        }
                    </div>
                    {
                        news && news[selectedTab].length > 0 &&
                        <NewsBody body={news[selectedTab][selectedNew]["body"]}/>
                    }
                </div>
            )}
        </div>
    );
};
