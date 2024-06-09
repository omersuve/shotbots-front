import React, { createContext, useContext, useState, useEffect, FC, ReactNode } from 'react';

interface ScoreHistory {
    day_score: number;
    timestamp: string;
}

interface ScoresContextProps {
    scoresHistory: { [collectionName: string]: ScoreHistory[] };
    loading: boolean;
    setScoresHistory: (data: { [collectionName: string]: ScoreHistory[] }) => void;
}

const ScoresContext = createContext<ScoresContextProps | undefined>(undefined);

interface ScoresProviderProps {
    children: ReactNode;
}

export const ScoresProvider: FC<ScoresProviderProps> = ({ children }) => {
    const [scoresHistory, setScoresHistory] = useState<{ [collectionName: string]: ScoreHistory[] }>({});
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        async function fetchHistoryData() {
            setLoading(true);
            const collectionsHistory = ["bitcoin-day-scores", "ethereum-day-scores", "solana-day-scores", "nft-day-scores"];
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(collectionsHistory),
            };

            try {
                const response = await fetch("/api/getDayScores", requestOptions);
                const data = await response.json();
                setScoresHistory(data);
            } catch (error) {
                console.error('Failed to fetch data', error);
            } finally {
                setLoading(false);
            }
        }

        fetchHistoryData();
    }, []);

    return (
        <ScoresContext.Provider value={{ scoresHistory, loading, setScoresHistory }}>
            {children}
        </ScoresContext.Provider>
    );
};

export const useScores = () => {
    const context = useContext(ScoresContext);
    if (!context) {
        throw new Error('useScores must be used within a ScoresProvider');
    }
    return context;
};
