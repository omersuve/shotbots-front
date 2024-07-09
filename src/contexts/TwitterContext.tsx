import React, { createContext, useContext, useState, useEffect, FC, ReactNode } from "react";
import { Tweet } from "../types";

interface TwitterContextProps {
    tweetsData: { [collectionName: string]: Tweet[] };
    loading: boolean;
    setTweetsData: (data: { [collectionName: string]: Tweet[] }) => void;
}

const TwitterContext = createContext<TwitterContextProps | undefined>(undefined);

interface TwitterProviderProps {
    children: ReactNode;
}

export const TwitterProvider: FC<TwitterProviderProps> = ({ children }) => {
    const [tweetsData, setTweetsData] = useState<{ [collectionName: string]: Tweet[] }>({});
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const collections = ["bitcoin-tweets", "ethereum-tweets", "solana-tweets", "nft-tweets"];
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(collections),
            };

            try {
                const response = await fetch("/api/tweets", requestOptions);
                const data = await response.json();
                setTweetsData(data);
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
        <TwitterContext.Provider value={{ tweetsData, loading, setTweetsData }}>
            {children}
        </TwitterContext.Provider>
    );
};

export const useTwitter = () => {
    const context = useContext(TwitterContext);
    if (!context) {
        throw new Error("useTwitter must be used within a TwitterProvider");
    }
    return context;
};
