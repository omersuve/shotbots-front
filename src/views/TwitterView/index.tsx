import React, { FC, useEffect, useState } from "react";
import styles from "./index.module.css";
import MyLoader from "../../components/MyLoader";
import { SendVoteBody, Tweet, twitterResponse } from "../../types";
import { useWallet } from "@solana/wallet-adapter-react";
import { toast } from "react-toastify";
import { formatDate, handleSendVote } from "../../utils";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

const tags = ["BITCOIN", "ETHEREUM", "SOLANA", "SOLANA NFT", "ETHEREUM NFT", "SOLANA MEMECOIN", "RUNES"];
const collections = ["bitcoin-tweets", "ethereum-tweets", "solana-tweets", "solana-nft-tweets", "ethereum-nft-tweets", "bitcoin-nft-tweets", "solana-memecoin-tweets", "runes-tweets"];

interface ResponseData {
    [collectionName: string]: Tweet[]; // Define the type of data returned for each collection
}

export const TwitterView: FC = () => {
    const [tweets, setTweets] = useState<ResponseData>({});
    const [loading, setLoading] = useState(true); // Loading state
    const [selectedTab, setSelectedTab] = useState("bitcoin-tweets");
    const [selectedTabIdx, setSelectedTabIdx] = useState(0);
    const { publicKey } = useWallet();
    const [selectedTweetId, setSelectedTweetId] = useState<{ [key: string]: string }>({});
    const [votedTweets, setVotedTweets] = useState<string[]>([]);
    const [votesOfTweets, setVotesOfTweets] = useState<{ [key: string]: number }>({});


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

    function submitVote(tweetId: string, vote: number) {
        setVotedTweets(prevState => ([...prevState, tweetId]));
        setVotesOfTweets(prev => ({
            ...prev, [tweetId]: vote,
        }));
    }

    return (
        <div>
            <ul className={`${styles["tabs"]} flex flex-wrap text-center text-gray-500`}>
                {tags.map((t, i) => {
                    return (
                        <li key={i}>
                            <button
                                className={`${i !== selectedTabIdx ? "hover:bg-gray-50" : ""} ${i === selectedTabIdx ? "bg-gray-200" : ""} ${styles["tab-view"]} inline-block px-12 py-1`}
                                onClick={() => {
                                    setSelectedTab(`${t.toLowerCase().replace(" ", "-")}-tweets`);
                                    setSelectedTabIdx(i);
                                }}
                            >{t}</button>
                        </li>
                    );
                })}
            </ul>
            <p className="text-center fs-6 fw-bold my-4">RECENT HOT TWEETS</p>
            {loading ? (
                <MyLoader />
            ) : (
                <div className="flex flex-col items-center">
                    {
                        tweets &&
                        Object.entries(tweets).map(([collection, tweetsArr], i) => {
                            return tweetsArr.map((t, j) => {
                                if (selectedTab === `${t.tag.replace(" ", "-")}-tweets`) {
                                    return (
                                        <button key={`${i}-${j}`}
                                                className={`flex flex-col text-center items-center justify-center w-1/2 relative ${t._id.toString() !== selectedTweetId[selectedTab] ? "active:bg-yellow-200" : ""} ${t._id.toString() !== selectedTweetId[selectedTab] ? "hover:bg-yellow-100" : ""} ${t._id.toString() === selectedTweetId[selectedTab] ? "bg-yellow-300" : ""} mb-6`}
                                                onClick={() => setSelectedTweetId(prevState => ({
                                                    ...prevState,
                                                    [selectedTab]: t._id.toString(), // Set the selected news index for the current tab
                                                }))}>
                                            <div className={`${styles["box"]} shadow w-full`}>
                                                <p className="text-black text-left mr-28">
                                                    {t["text"]}
                                                </p>
                                                {/*<div className="flex justify-between items-center mt-2">*/}
                                                {/*    {*/}
                                                {/*        publicKey && t._id.toString() === selectedTweetId[selectedTab] &&*/}
                                                {/*      <div*/}
                                                {/*        className="flex items-center justify-between flex-grow mt-2 mx-1">*/}
                                                {/*        <Box sx={{*/}
                                                {/*            display: "flex",*/}
                                                {/*            flex: 1,*/}
                                                {/*            justifyContent: "center",*/}
                                                {/*            textAlign: "center",*/}
                                                {/*            minWidth: 0,*/}
                                                {/*        }}>*/}
                                                {/*          <Slider*/}
                                                {/*            key={`slider-${t._id.toString()}`}*/}
                                                {/*            aria-label="Vote"*/}
                                                {/*            defaultValue={votesOfTweets[t._id.toString()] ?? 0}*/}
                                                {/*            valueLabelDisplay="auto"*/}
                                                {/*            shiftStep={1}*/}
                                                {/*            onChange={(event, newValue) => {*/}
                                                {/*                setVotesOfTweets(prev => ({*/}
                                                {/*                    ...prev, [t._id.toString()]: newValue as number,*/}
                                                {/*                }));*/}
                                                {/*            }}*/}
                                                {/*            step={1}*/}
                                                {/*            min={-3}*/}
                                                {/*            max={3}*/}
                                                {/*            disabled={votedTweets.includes(t._id.toString())}*/}
                                                {/*            color={`${votesOfTweets[t._id.toString()] > 1 ? "success" : votesOfTweets[t._id.toString()] < -1 ? "error" : "info"}`}*/}
                                                {/*          />*/}
                                                {/*        </Box>*/}
                                                {/*        <p*/}
                                                {/*          className="ml-8 w-8 fs-5 font-bold">{votesOfTweets[t._id.toString()] ?? 0}</p>*/}
                                                {/*        <button*/}
                                                {/*          className={`bg-gray-200 ${!votedTweets.includes(t._id.toString()) ? "hover:bg-gray-300 active:bg-gray-400" : ""}  w-20 rounded px-1 py-1 ml-12`}*/}
                                                {/*          onClick={() => {*/}
                                                {/*              handleSendVote(t._id.toString(), votesOfTweets[t._id.toString()], selectedTab, publicKey?.toString()).then((v) => {*/}
                                                {/*                  if (v != undefined) submitVote(t._id.toString(), v);*/}
                                                {/*              });*/}
                                                {/*          }}*/}
                                                {/*          disabled={votedTweets.includes(t._id.toString())}*/}
                                                {/*        > {votedTweets.includes(t._id.toString()) ? "Submitted" : "Submit"}*/}
                                                {/*        </button>*/}
                                                {/*      </div>*/}
                                                {/*    }*/}
                                                {/*</div>*/}
                                                <div className="absolute right-7 top-2">
                                                    {formatDate(t["timestamp"])}
                                                </div>
                                                <a href={t["url"]} target="_blank" rel="noreferrer noopener"
                                                   className="bg-gray-200 hover:bg-gray-300 active:bg-gray-400 w-24 rounded px-2 py-1 text-xs text-center absolute right-3 top-9">Go
                                                    to Tweet
                                                </a>
                                            </div>
                                        </button>
                                    );
                                }
                            });
                        })
                    }
                </div>
            )}
        </div>
    );
};