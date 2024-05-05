import React, {FC, useEffect, useState} from "react";
import styles from "../NewsView/index.module.css";
import TweetCard from "../../components/TweetCard";
import MyLoader from "../../components/MyLoader";

const tags = ['BITCOIN', 'ETHEREUM', 'SOLANA', 'SOLANA NFT', 'ETHEREUM NFT', 'SOLANA MEMECOIN', 'RUNES']
const collections = ['bitcoin-tweets', 'ethereum-tweets', 'solana-tweets', 'solana-nft-tweets', 'ethereum-nft-tweets', 'bitcoin-nft-tweets', 'solana-memecoin-tweets', 'runes-tweets']

interface ResponseData {
    [collectionName: string]: any[]; // Define the type of data returned for each collection
}

export const TwitterView: FC = ({}) => {
    const [tweets, setTweets] = useState<ResponseData>({})
    const [loading, setLoading] = useState(true); // Loading state
    const [selectedTab, setSelectedTab] = useState('bitcoin-tweets')


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
                const result: ResponseData = await response.json();
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
                <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500">
                    {tags.map((t, i) => {
                        return (
                            <li key={i} className="me-2">
                                <button
                                    className="inline-block px-4 py-3 rounded-lg hover:text-gray-900 hover:bg-gray-100"
                                    onClick={() => setSelectedTab(`${t.toLowerCase().replace(' ', '-')}-tweets`)}
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
                                tweets[selectedTab] &&
                                tweets[selectedTab].map((t, i) => {
                                    return (
                                        <div key={i}
                                            className="flex text-center items-center hover:bg-yellow-50 active:bg-yellow-200 focus:bg-yellow-100 rounded-box m-2">
                                            <TweetCard text={t["text"]} url={t["url"]}/>
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