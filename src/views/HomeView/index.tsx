import React, { FC, useEffect, useState } from "react";
import styles from "./index.module.css";
import LineGraph from "../../components/LineGraph";
import ScoreCard from "../../components/ScoreCard";
import MyLoader from "../../components/MyLoader";

const collectionsHistory = ["bitcoin-day-scores", "ethereum-day-scores", "solana-day-scores", "nft-day-scores"];

interface ScoreHistory {
    day_score: number;
    timestamp: string; // Change to string for compatibility with labels
}

interface ResponseHistoryData {
    [collectionName: string]: ScoreHistory[]; // Define the type of data returned for each collection
}

export const HomeView: FC = () => {
    const [scoresHistory, setScoresHistory] = useState<ResponseHistoryData>({});
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        async function fetchHistoryData() {
            setLoading(true);
            try {
                // Prepare request options
                const requestOptions = {
                    method: "POST", // Specify POST method
                    headers: {
                        "Content-Type": "application/json", // Specify JSON content type
                    },
                    body: JSON.stringify(collectionsHistory), // Convert collections array to JSON string and pass in body
                };
                const responseHistory = await fetch("/api/getDayScores", requestOptions);
                const resultHistory = await responseHistory.json();
                if (responseHistory.ok) {
                    setScoresHistory(resultHistory);
                } else {
                    console.log("failed to fetch data");
                }
            } catch (err) {
                console.log("failed to fetch data");
            } finally {
                setLoading(false); // Set loading state to false after data is fetched
            }
        }

        fetchHistoryData().then(r => {
        });
    }, []);

    return (

        <div className={`${styles["box-with-graph"]} flex flex-col items-center`}>
            <p className="text-center fs-6 fw-bold">TODAY&apos;S MARKET SENTIMENT SCORES</p>
            {loading ? (
                // Display a loading spinner while data is being fetched
                <MyLoader />
            ) : (
                scoresHistory &&
                <>
                  <div className={`${styles["box-container"]} shadow`}>
                    <ScoreCard
                      score={scoresHistory["bitcoin-day-scores"][0].day_score > 1 ? 10 : scoresHistory["bitcoin-day-scores"][0].day_score < 0 ? 0 : scoresHistory["bitcoin-day-scores"][0].day_score * 10}
                      tag={"Bitcoin"} />
                    <ScoreCard
                      score={scoresHistory["ethereum-day-scores"][0].day_score > 1 ? 10 : scoresHistory["ethereum-day-scores"][0].day_score < 0 ? 0 : scoresHistory["ethereum-day-scores"][0].day_score * 10}
                      tag={"Ethereum"} />
                    <ScoreCard
                      score={scoresHistory["solana-day-scores"][0].day_score > 1 ? 10 : scoresHistory["solana-day-scores"][0].day_score < 0 ? 0 : scoresHistory["solana-day-scores"][0].day_score * 10}
                      tag={"Solana"} />
                    <ScoreCard
                      score={scoresHistory["nft-day-scores"][0].day_score > 1 ? 10 : scoresHistory["nft-day-scores"][0].day_score < 0 ? 0 : scoresHistory["nft-day-scores"][0].day_score * 10}
                      tag={"NFTs"} />
                  </div>
                  <div className={`${styles["graph-container"]} p-4 shadow`}
                       style={{ width: "fit-content" }}>
                    <LineGraph scoresHistory={scoresHistory} />
                  </div>
                </>
            )}
        </div>
    );
};
