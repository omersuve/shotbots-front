import React, { FC, useEffect, useRef, useState } from "react";
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
import { useNews } from "../../contexts/NewsContext";

const tags = ["BITCOIN", "ETHEREUM", "SOLANA", "NFT"];

interface ResponseData {
    [collectionName: string]: News[]; // Define the type of data returned for each collection
}

export const NewsView: FC = () => {
    const { newsData, loading, timers } = useNews();
    const [selectedTabIdx, setSelectedTabIdx] = useState(0);
    const [selectedTab, setSelectedTab] = useState("bitcoin-news");
    const { publicKey } = useWallet();
    const [selectedNewsId, setSelectedNewsId] = useState<{ [key: string]: string }>({});
    const [votedNews, setVotedNews] = useState<string[]>([]);
    const [votesOfNews, setVotesOfNews] = useState<{ [key: string]: number }>({});

    const news = newsData[selectedTab] || [];

    useEffect(() => {
        if (news.length > 0 && !selectedNewsId[selectedTab]) {
            setSelectedNewsId(prevState => ({
                ...prevState,
                [selectedTab]: news[0]._id.toString(),
            }));
        }
    }, [newsData, selectedTab]);

    const handleTabChange = (newTab: string, idx: number) => {
        setSelectedTab(newTab);
        setSelectedTabIdx(idx);
        if (!selectedNewsId[newTab] && newsData[newTab] && newsData[newTab].length > 0) {
            setSelectedNewsId(prevState => ({
                ...prevState,
                [newTab]: newsData[newTab][0]._id.toString(),
            }));
        }
    };

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
                {tags.map((t, i) => (
                    <li key={i}>
                        <button
                            className={`${i !== selectedTabIdx ? "hover:bg-gray-50" : ""} ${i === selectedTabIdx ? "bg-gray-200" : ""} ${styles["tab-view"]} inline-block px-12 py-1`}
                            onClick={() => handleTabChange(`${t.toLowerCase()}-news`, i)}
                        >
                            {t}
                        </button>
                    </li>
                ))}
            </ul>
            <p className="text-center fs-6 fw-bold mt-4">RECENT HOT NEWS</p>
            {loading ? (
                <MyLoader />
            ) : (
                <div className="flex mx-12 mt-4">
                    <div className="block">
                        {
                            news &&
                            news.map((n, j) => (
                                <button
                                    key={`${selectedTab}-${j}`}
                                    className={`flex text-center items-center ${n._id.toString() !== selectedNewsId[selectedTab] ? "active:bg-yellow-200" : ""} ${n._id.toString() !== selectedNewsId[selectedTab] ? "hover:bg-yellow-100" : ""} ${n._id.toString() === selectedNewsId[selectedTab] ? "bg-yellow-300" : ""} m-6`}
                                    onClick={() => setSelectedNewsId(prevState => ({
                                        ...prevState,
                                        [selectedTab]: n._id.toString(), // Set the selected news index for the current tab
                                    }))}>
                                    <div className={`${styles["box"]} shadow flex flex-col justify-between`}>
                                        <div className="flex-1 flex">
                                            <h3 className="relative text-black mr-16">
                                                {parse(n.title)}
                                            </h3>
                                        </div>
                                        {/*<div*/}
                                        {/*    className="flex-1 flex items-center justify-center content-center mt-2 mx-1 min-h-8">*/}
                                        {/*    {publicKey && n._id.toString() === selectedNewsId[selectedTab] && !n.isVoteEnded && (*/}
                                        {/*        <>*/}
                                        {/*            <Box sx={{*/}
                                        {/*                display: "flex",*/}
                                        {/*                flex: 3,*/}
                                        {/*                justifyContent: "center",*/}
                                        {/*                textAlign: "center",*/}
                                        {/*            }}>*/}
                                        {/*                <Slider*/}
                                        {/*                    key={`slider-${n._id.toString()}`}*/}
                                        {/*                    aria-label="Vote"*/}
                                        {/*                    defaultValue={votesOfNews[n._id.toString()] ?? 0}*/}
                                        {/*                    valueLabelDisplay="auto"*/}
                                        {/*                    shiftStep={1}*/}
                                        {/*                    onChange={(event, newValue) => {*/}
                                        {/*                        setVotesOfNews(prev => ({*/}
                                        {/*                            ...prev, [n._id.toString()]: newValue as number,*/}
                                        {/*                        }));*/}
                                        {/*                    }}*/}
                                        {/*                    step={1}*/}
                                        {/*                    min={-3}*/}
                                        {/*                    max={3}*/}
                                        {/*                    disabled={votedNews.includes(n._id.toString())}*/}
                                        {/*                    color={`${votesOfNews[n._id.toString()] > 1 ? "success" : votesOfNews[n._id.toString()] < -1 ? "error" : "info"}`}*/}
                                        {/*                />*/}
                                        {/*            </Box>*/}
                                        {/*            <p*/}
                                        {/*                className="ml-8 w-8 fs-5 font-bold">{votesOfNews[n._id.toString()] ?? 0}</p>*/}
                                        {/*            <div className="flex-1 items-center">*/}
                                        {/*                <button*/}
                                        {/*                    className={`bg-gray-200 ${!votedNews.includes(n._id.toString()) ? "hover:bg-gray-300 active:bg-gray-400" : ""}  w-20 rounded px-2 py-1 ml-4`}*/}
                                        {/*                    onClick={() => {*/}
                                        {/*                        handleSendVote(n._id.toString(), votesOfNews[n._id.toString()], selectedTab, publicKey?.toString()).then((v) => {*/}
                                        {/*                            if (v != undefined) submitVote(n._id.toString(), v);*/}
                                        {/*                        });*/}
                                        {/*                    }}*/}
                                        {/*                    disabled={votedNews.includes(n._id.toString())}*/}
                                        {/*                > {votedNews.includes(n._id.toString()) ? "Submitted" : "Submit"}*/}
                                        {/*                </button>*/}
                                        {/*            </div>*/}
                                        {/*        </>*/}
                                        {/*    )}*/}
                                        {/*</div>*/}
                                        <div className="flex-1 mt-1 flex justify-between items-end">
                                            <div className="text-sm text-gray-500 flex-1">
                                                {n.isVoteEnded ? "Voting ended" : (timers[n._id.toString()] || "Calculating...")}
                                            </div>
                                        </div>
                                        <div className={styles["toggle-btn"]}>
                                            {n._id.toString() === selectedNewsId[selectedTab] &&
                                              <FontAwesomeIcon
                                                icon={faArrowRight as IconProp}
                                                className="fa-xl" />
                                            }
                                        </div>
                                        <div className="absolute right-2 top-2">
                                            {formatDate(n["timestamp"])}
                                        </div>
                                    </div>
                                </button>
                            ))
                        }
                    </div>
                    {
                        news.length > 0 &&
                      <NewsBody
                        body={news.find(newsItem => newsItem._id.toString() === selectedNewsId[selectedTab])?.body || ""} />
                    }
                </div>
            )}
        </div>
    );
};
