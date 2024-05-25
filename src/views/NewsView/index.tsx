import React, { FC, useEffect, useState } from "react";
import styles from "./index.module.css";
import NewsBody from "../../components/NewsBody";
import MyLoader from "../../components/MyLoader";
import { useWallet } from "@solana/wallet-adapter-react";
import { News, SendVoteBody } from "../../types";
import parse from "html-react-parser";
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { toast } from "react-toastify";
import { formatDate, handleSendVote } from "../../utils";


const tags = ["BITCOIN", "ETHEREUM", "SOLANA", "NFT"];
const collections = ["bitcoin-news", "ethereum-news", "solana-news", "nft-news"];

interface ResponseData {
    [collectionName: string]: News[]; // Define the type of data returned for each collection
}

export const NewsView: FC = () => {
    const [news, setNews] = useState<ResponseData>({});
    const [selectedTabIdx, setSelectedTabIdx] = useState(0);
    const [loading, setLoading] = useState(true); // Loading state
    const [selectedTab, setSelectedTab] = useState("bitcoin-news");
    const { publicKey } = useWallet();
    const [selectedNewsId, setSelectedNewsId] = useState<{ [key: string]: string }>({});
    const [votedNews, setVotedNews] = useState<string[]>([]);
    const [votesOfNews, setVotesOfNews] = useState<{ [key: string]: number }>({});

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
                const response = await fetch("/api/news", requestOptions);
                const result = await response.json();
                if (response.ok) {
                    setNews(result);
                    const initialIndices = Object.fromEntries(collections.map(col => [col, result[col][0]._id.toString()]));
                    setSelectedNewsId(initialIndices);
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

    useEffect(() => {
        async function fetchVotes() {
            const requestOptionsVotes = {
                method: "POST", // Specify POST method
                headers: {
                    "Content-Type": "application/json", // Specify JSON content type
                },
                body: JSON.stringify({ pk: publicKey, type: "news" }), // Convert collections array to JSON string and pass in body
            };
            const response = await fetch("/api/votes", requestOptionsVotes);
            return await response.json();
        }

        if (publicKey) {
            fetchVotes().then((r: SendVoteBody[]) => {
                r.map(v =>
                    setVotesOfNews(prev => ({
                        ...prev, [v.assetId]: v.vote,
                    })));
                setVotedNews(r.map(v => v.assetId));
            });
        }
    }, [publicKey]);

    function submitVote(newsId: string, vote: number) {
        setVotedNews(prevState => ([...prevState, newsId]));
        setVotesOfNews(prev => ({
            ...prev, [newsId]: vote,
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
                                    setSelectedTab(`${t.toLowerCase()}-news`);
                                    setSelectedTabIdx(i);
                                }}>{t}</button>
                        </li>
                    );
                })}
            </ul>
            <p className="text-center fs-6 fw-bold mt-4">RECENT HOT NEWS</p>
            {loading ? (
                <MyLoader />
            ) : (
                <div className="flex mx-12 mt-4">
                    <div className="block">
                        {
                            news &&
                            Object.entries(news).map(([collection, newsArr], i) => {
                                return newsArr.map((n, j) => {
                                    if (selectedTab === `${n.tag}-news`) {
                                        return (
                                            <button
                                                key={`${i}-${j}`}
                                                className={`flex text-center items-center ${n._id.toString() !== selectedNewsId[selectedTab] ? "active:bg-yellow-200" : ""} ${n._id.toString() !== selectedNewsId[selectedTab] ? "hover:bg-yellow-100" : ""} ${n._id.toString() === selectedNewsId[selectedTab] ? "bg-yellow-300" : ""} m-6`}
                                                onClick={() => setSelectedNewsId(prevState => ({
                                                    ...prevState,
                                                    [selectedTab]: n._id.toString(), // Set the selected news index for the current tab
                                                }))}>
                                                <div className={`${styles["box"]} shadow`}>
                                                    <h3 className="relative text-black mr-16">
                                                        {parse(n.title)}
                                                    </h3>
                                                    <div className="absolute right-2 top-2">
                                                        {formatDate(n["timestamp"])}
                                                    </div>
                                                    {/*{*/}
                                                    {/*    publicKey && n._id.toString() === selectedNewsId[selectedTab] &&*/}
                                                    {/*  <div*/}
                                                    {/*    className="flex items-center justify-center content-center mt-2 mx-1">*/}
                                                    {/*    <Box sx={{*/}
                                                    {/*        display: "flex",*/}
                                                    {/*        flex: 3,*/}
                                                    {/*        justifyContent: "center",*/}
                                                    {/*        textAlign: "center",*/}
                                                    {/*    }}>*/}
                                                    {/*      <Slider*/}
                                                    {/*        key={`slider-${n._id.toString()}`}*/}
                                                    {/*        aria-label="Vote"*/}
                                                    {/*        defaultValue={votesOfNews[n._id.toString()] ?? 0}*/}
                                                    {/*        valueLabelDisplay="auto"*/}
                                                    {/*        shiftStep={1}*/}
                                                    {/*        onChange={(event, newValue) => {*/}
                                                    {/*            setVotesOfNews(prev => ({*/}
                                                    {/*                ...prev, [n._id.toString()]: newValue as number,*/}
                                                    {/*            }));*/}
                                                    {/*        }}*/}
                                                    {/*        step={1}*/}
                                                    {/*        min={-3}*/}
                                                    {/*        max={3}*/}
                                                    {/*        disabled={votedNews.includes(n._id.toString())}*/}
                                                    {/*        color={`${votesOfNews[n._id.toString()] > 1 ? "success" : votesOfNews[n._id.toString()] < -1 ? "error" : "info"}`}*/}
                                                    {/*      />*/}
                                                    {/*    </Box>*/}
                                                    {/*    <p*/}
                                                    {/*      className="ml-8 w-8 fs-5 font-bold">{votesOfNews[n._id.toString()] ?? 0}</p>*/}
                                                    {/*    <div className="flex-1 items-center">*/}
                                                    {/*      <button*/}
                                                    {/*        className={`bg-gray-200 ${!votedNews.includes(n._id.toString()) ? "hover:bg-gray-300 active:bg-gray-400" : ""}  w-20 rounded px-2 py-1 ml-4`}*/}
                                                    {/*        onClick={() => {*/}
                                                    {/*            handleSendVote(n._id.toString(), votesOfNews[n._id.toString()], selectedTab, publicKey?.toString()).then((v) => {*/}
                                                    {/*                if (v != undefined) submitVote(n._id.toString(), v);*/}
                                                    {/*            });*/}
                                                    {/*        }}*/}
                                                    {/*        disabled={votedNews.includes(n._id.toString())}*/}
                                                    {/*      > {votedNews.includes(n._id.toString()) ? "Submitted" : "Submit"}*/}
                                                    {/*      </button>*/}
                                                    {/*    </div>*/}
                                                    {/*  </div>*/}
                                                    {/*}*/}
                                                    <div className={styles["toggle-btn"]}>
                                                        {n._id.toString() === selectedNewsId[selectedTab] &&
                                                          <FontAwesomeIcon
                                                            icon={faArrowRight as IconProp}
                                                            className="fa-l" />
                                                        }
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    }
                                });
                            })
                        }
                    </div>
                    {
                        news && news[selectedTab].length > 0 &&
                      <NewsBody
                        body={news[selectedTab].find(newsItem => newsItem._id.toString() === selectedNewsId[selectedTab])?.body || ""} />
                    }
                </div>
            )}
        </div>
    );
};
