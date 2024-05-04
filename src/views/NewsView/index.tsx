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

export const NewsView: FC = ({}) => {
    const [news, setNews] = useState<ResponseData>({})
    const [selectedNew, setSelectedNew] = useState(-1)
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
            <div className={styles.container}>
                <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500">
                    {tags.map((t) => {
                        return (
                            <li className="me-2">
                                <button
                                    className="inline-block px-4 py-3 rounded-lg hover:text-gray-900 hover:bg-gray-100"
                                    onClick={() => {
                                        setSelectedNew(-1)
                                        setSelectedTab(`${t.toLowerCase()}-news`)
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
                                            className="flex text-center items-center hover:bg-yellow-50 active:bg-yellow-200 focus:bg-yellow-100 rounded-box m-2"
                                            onClick={() => setSelectedNew(i)}>
                                            <NewsCard title={n["title"]}/>
                                        </button>
                                    )
                                })
                            }
                        </div>
                        {
                            news && selectedNew > -1 &&
                            <NewsBody body={news[selectedTab][selectedNew]["body"]}/>
                        }
                    </div>
                )}
            </div>
        </div>
    );
};
