import React, { FC, useEffect, useRef, useState } from "react";
import styles from "./index.module.css";
import NewsBody from "../../components/NewsBody";
import MyLoader from "../../components/MyLoader";
import CustomSlider from "../../components/CustomSlider";
import VotingResultsTable from "../../components/VotingResultsTable";
import { useWallet } from "@solana/wallet-adapter-react";
import { SendVoteBody, MarketSentiment, defaultVoteValues } from "../../types";
import parse from "html-react-parser";
import Box from "@mui/material/Box";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { formatDate, handleSendVote } from "../../utils";
import { useNews } from "../../contexts/NewsContext";

const tags = [
  "COINMARKETCAP",
  "COINDESK BTC",
  "COINDESK SOL",
  "COINDESK ETH",
  "COINDESK MEMES",
];

const tagToCollectionMap: { [key: string]: string } = {
  COINMARKETCAP: "cmc",
  "COINDESK BTC": "bitcoin-news",
  "COINDESK SOL": "solana-news",
  "COINDESK ETH": "ethereum-news",
  "COINDESK MEMES": "memecoins-news",
};

export const NewsView: FC = () => {
  const { newsData, loading, timers } = useNews();
  const [selectedTabIdx, setSelectedTabIdx] = useState(0);
  const [selectedTab, setSelectedTab] = useState("cmc");
  const { publicKey } = useWallet();
  const [selectedNewsId, setSelectedNewsId] = useState<{
    [key: string]: string;
  }>({});
  const [votedNews, setVotedNews] = useState<string[]>([]);
  const [votesOfNews, setVotesOfNews] = useState<{
    [key: string]: MarketSentiment;
  }>({});

  const news = newsData[selectedTab] || [];

  const cardRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const newsBodyRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const updatePosition = () => {
      if (
        selectedNewsId[selectedTab] &&
        cardRefs.current[selectedNewsId[selectedTab]]
      ) {
        const cardElement = cardRefs.current[selectedNewsId[selectedTab]];
        const bodyElement = newsBodyRef.current;
        if (cardElement && bodyElement) {
          const { height } = cardElement.getBoundingClientRect();
          const selectedIndex = news.findIndex(
            (n) => n._id.toString() === selectedNewsId[selectedTab]
          );
          const marginTop = selectedIndex * height; // 16px for margin-bottom of each card
          bodyElement.style.marginTop = `${marginTop}px`;
        }
      }
    };

    // Call the function initially and on tab change
    updatePosition();
  }, [selectedNewsId, selectedTab, news]);

  useEffect(() => {
    if (news.length > 0 && !selectedNewsId[selectedTab]) {
      setSelectedNewsId((prevState) => ({
        ...prevState,
        [selectedTab]: news[0]._id.toString(),
      }));
    }
  }, [newsData, selectedTab]);

  const handleTabChange = (newTab: string, idx: number) => {
    const collectionKey = tagToCollectionMap[newTab];
    setSelectedTab(collectionKey);
    setSelectedTabIdx(idx);
    if (
      !selectedNewsId[collectionKey] &&
      newsData[collectionKey] &&
      newsData[collectionKey].length > 0
    ) {
      setSelectedNewsId((prevState) => ({
        ...prevState,
        [collectionKey]: newsData[collectionKey][0]._id.toString(),
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
        body: JSON.stringify({ pk: publicKey }), // Convert collections array to JSON string and pass in body
      };
      const response = await fetch("/api/votes", requestOptionsVotes);
      return await response.json();
    }

    if (publicKey) {
      fetchVotes().then((r: SendVoteBody[]) => {
        r.map((v) =>
          setVotesOfNews((prev) => ({
            ...prev,
            [v.assetId]: v.vote,
          }))
        );
        setVotedNews(r.map((v) => v.assetId));
      });
    }
  }, [publicKey]);

  function submitVote(newsId: string, vote: MarketSentiment) {
    setVotedNews((prevState) => [...prevState, newsId]);
    setVotesOfNews((prev) => ({
      ...prev,
      [newsId]: vote,
    }));
  }

  return (
    <div>
      <ul
        className={`${styles["tabs"]} flex flex-wrap text-center text-gray-500`}
      >
        {tags.map((t, i) => (
          <li key={i} className={`lg:flex-none flex-1 ${styles["tab-item"]}`}>
            <button
              className={`${i !== selectedTabIdx ? "hover:bg-gray-50" : ""} ${
                i === selectedTabIdx ? "bg-gray-200" : ""
              } ${
                styles["tab-view"]
              } w-full lg:w-auto lg:px-12 lg:py-1 whitespace-nowrap`}
              onClick={() => handleTabChange(t, i)}
            >
              {t}
            </button>
          </li>
        ))}
      </ul>
      <p className="text-center fs-6 fw-bold my-3">RECENT HOT NEWS</p>
      {loading ? (
        <MyLoader />
      ) : (
        <div className="relative flex lg:mx-12 lg:mt-4">
          <div className="block w-1/4 lg:w-1/3 relative">
            {news &&
              news.map((n, j) => (
                <button
                  key={`${selectedTab}-${j}`}
                  ref={(el) => {
                    cardRefs.current[n._id.toString()] = el;
                  }}
                  className={`flex text-center items-center ${
                    n._id.toString() !== selectedNewsId[selectedTab]
                      ? "active:bg-yellow-200"
                      : ""
                  } ${
                    n._id.toString() !== selectedNewsId[selectedTab]
                      ? "hover:bg-yellow-100"
                      : ""
                  } ${
                    n._id.toString() === selectedNewsId[selectedTab]
                      ? "bg-yellow-300"
                      : ""
                  } m-2 lg:m-6 w-full`}
                  onClick={() =>
                    setSelectedNewsId((prevState) => ({
                      ...prevState,
                      [selectedTab]: n._id.toString(), // Set the selected news index for the current tab
                    }))
                  }
                >
                  <div
                    className={`${styles["box"]} shadow flex flex-col justify-between`}
                  >
                    <div className="flex-1 flex">
                      <h3 className="relative text-black lg:mr-16">
                        {parse(n.title)}
                      </h3>
                    </div>

                    {/* Show voting results if voting has ended */}
                    {n.isVoteEnded ||
                    timers[n._id.toString()] === "Voting ended" ? (
                      <VotingResultsTable
                        votes={{ ...defaultVoteValues, ...n.votes }}
                        userVote={votesOfNews[n._id.toString()] || null}
                      />
                    ) : (
                      <div className="flex-1 flex items-center justify-center content-center mt-2 mx-1 min-h-8">
                        {publicKey &&
                          n._id.toString() === selectedNewsId[selectedTab] &&
                          !n.isVoteEnded && (
                            <>
                              <Box
                                sx={{
                                  display: "flex",
                                  flex: 3,
                                  justifyContent: "center",
                                  textAlign: "center",
                                }}
                              >
                                <CustomSlider
                                  value={
                                    votesOfNews[n._id.toString()] ??
                                    MarketSentiment.NEUTRAL
                                  }
                                  onChange={(newValue) => {
                                    setVotesOfNews((prev) => ({
                                      ...prev,
                                      [n._id.toString()]: newValue,
                                    }));
                                  }}
                                  disabled={votedNews.includes(
                                    n._id.toString()
                                  )}
                                />
                              </Box>
                              <p className="ml-8 w-8 fs-5 font-bold">
                                {votesOfNews[n._id.toString()] ??
                                  MarketSentiment.NEUTRAL}
                              </p>
                              <div className="flex-1 items-center">
                                <button
                                  className={`bg-gray-200 ${
                                    !votedNews.includes(n._id.toString())
                                      ? "hover:bg-gray-300 active:bg-gray-400"
                                      : ""
                                  }  w-20 rounded px-2 py-1 ml-4`}
                                  onClick={() => {
                                    handleSendVote(
                                      n._id.toString(),
                                      votesOfNews[n._id.toString()],
                                      selectedTab,
                                      publicKey?.toString()
                                    ).then((v) => {
                                      if (v != undefined)
                                        submitVote(n._id.toString(), v);
                                    });
                                  }}
                                  disabled={votedNews.includes(
                                    n._id.toString()
                                  )}
                                >
                                  {" "}
                                  {votedNews.includes(n._id.toString())
                                    ? "Submitted"
                                    : "Submit"}
                                </button>
                              </div>
                            </>
                          )}
                      </div>
                    )}
                    <div className="flex-1 mt-1 flex justify-between items-end">
                      <div className="text-sm text-gray-500 flex-1">
                        {n.isVoteEnded
                          ? "Voting ended"
                          : timers[n._id.toString()] || "Calculating..."}
                      </div>
                    </div>

                    <div className={styles["toggle-btn"]}>
                      {n._id.toString() === selectedNewsId[selectedTab] && (
                        <FontAwesomeIcon
                          icon={faArrowRight as IconProp}
                          className="fa-xl"
                        />
                      )}
                    </div>
                    <div
                      className={`${styles.formatDate} absolute right-2 top-2 text-gray-400`}
                    >
                      {formatDate(n["timestamp"])}
                    </div>
                  </div>
                </button>
              ))}
          </div>
          {news.length > 0 && (
            <div
              ref={newsBodyRef}
              className="lg:w-2/3"
              style={{ width: "70%" }}
            >
              <NewsBody
                body={
                  news.find(
                    (newsItem) =>
                      newsItem._id.toString() === selectedNewsId[selectedTab]
                  )?.body || ""
                }
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
