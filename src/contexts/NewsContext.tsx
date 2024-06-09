import React, { createContext, useContext, useState, useEffect, FC, ReactNode } from "react";
import { News } from "../types";

interface NewsContextProps {
    newsData: { [collectionName: string]: News[] };
    loading: boolean;
    setNewsData: (data: { [collectionName: string]: News[] }) => void;
}

const NewsContext = createContext<NewsContextProps | undefined>(undefined);

interface NewsProviderProps {
    children: ReactNode;
}

export const NewsProvider: FC<NewsProviderProps> = ({ children }) => {
    const [newsData, setNewsData] = useState<{ [collectionName: string]: News[] }>({});
    const [loading, setLoading] = useState<boolean>(true);

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
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData().then(r => {
        });
    }, []);

    return (
        <NewsContext.Provider value={{ newsData, loading, setNewsData }}>
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
