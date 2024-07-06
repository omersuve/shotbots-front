import React, { createContext, useContext, useState, useEffect, FC, ReactNode, useRef } from "react";
import { News } from "../types";

interface NewsContextProps {
    newsData: { [collectionName: string]: News[] };
    loading: boolean;
    timers: { [key: string]: string };
}

const NewsContext = createContext<NewsContextProps | undefined>(undefined);

interface NewsProviderProps {
    children: ReactNode;
}

export const NewsProvider: FC<NewsProviderProps> = ({ children }) => {
    const [newsData, setNewsData] = useState<{ [collectionName: string]: News[] }>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [timers, setTimers] = useState<{ [key: string]: string }>({});
    const intervalIds = useRef<{ [key: string]: NodeJS.Timeout }>({});

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const collections = ["bitcoin-news", "ethereum-news", "solana-news", "nft-news"];
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(collections),
            };
            try {
                const response = await fetch("/api/news", requestOptions);
                const data = await response.json();
                setNewsData(data);
                initializeTimers(data);
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData().then(r => {
        });
    }, []);

    function initializeTimers(newsData: { [collectionName: string]: News[] }) {
        const newTimers: { [key: string]: string } = {};

        Object.entries(newsData).forEach(([collection, newsArr]) => {
            newsArr.forEach((n) => {
                if (!n.isVoteEnded) {
                    const now = new Date();
                    let endTime = new Date();
                    endTime.setUTCHours(20, 0, 0, 0);

                    if (now >= endTime) {
                        endTime.setUTCDate(endTime.getUTCDate() + 1);
                    }
                    const timer = setInterval(() => {
                        const currentTime = new Date().getTime();
                        const distance = endTime.getTime() - currentTime;

                        if (distance < 0) {
                            clearInterval(intervalIds.current[n._id.toString()]);
                            newTimers[n._id.toString()] = "Voting ended";
                        } else {
                            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                            newTimers[n._id.toString()] = `${hours}h ${minutes}m ${seconds}s`;
                        }

                        setTimers((prev) => ({
                            ...prev,
                            ...newTimers,
                        }));
                    }, 1000);

                    intervalIds.current[n._id.toString()] = timer;
                } else {
                    newTimers[n._id.toString()] = "Voting ended";
                }
            });
        });

        setTimers(newTimers);
    }

    return (
      <NewsContext.Provider value={{ newsData, loading, timers }}>
          {children}
      </NewsContext.Provider>
    );
};

export const useNews = () => {
    const context = useContext(NewsContext);
    if (!context) {
        throw new Error("useNews must be used within a NewsProvider");
    }
    return context;
};
