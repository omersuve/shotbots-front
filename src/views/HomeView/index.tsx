import React, { FC, useEffect, useState } from "react";
import styles from "./index.module.css";
import LineGraph from "../../components/LineGraph";
import ScoreCard from "../../components/ScoreCard";
import MyLoader from "../../components/MyLoader";

const collections = ["bitcoin-scores", "ethereum-scores", "solana-scores", "nft-scores"];

interface ResponseData {
    [collectionName: string]: number; // Define the type of data returned for each collection
}

interface ScoreHistory {
    score: number;
    date: string; // Change to string for compatibility with labels
}

interface ResponseHistoryData {
    [collectionName: string]: ScoreHistory[]; // Define the type of data returned for each collection
}

export const HomeView: FC = () => {
    const [scores, setScores] = useState<ResponseData>({});
    const [scoresHistory, setScoresHistory] = useState<ResponseHistoryData>({});
    const [loading, setLoading] = useState(true); // Loading state

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
                const response = await fetch("/api/coindeskScores", requestOptions);
                const responseHistory = await fetch("/api/coindeskScoresHistory", requestOptions);
                const result = await response.json();
                const resultHistory = await responseHistory.json();
                if (response.ok) {
                    setScores(result);
                } else {
                    console.log("failed to fetch data");
                }
                if (responseHistory.ok) {
                    console.log("resultHistory", resultHistory);
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

        fetchData().then(r => {
        });
    }, []);

    return (

        <div className={`${styles["box-with-graph"]} flex flex-col items-center mt-24`}>
            <p className="text-center fs-6 fw-bold">TODAY&apos;S MARKET SENTIMENT SCORES</p>
            {loading ? (
                // Display a loading spinner while data is being fetched
                <MyLoader />
            ) : (
                scores && scores["bitcoin-scores"] && scores["ethereum-scores"] && scores["solana-scores"] && scores["nft-scores"] &&
                <>
                  <div className={`${styles["box-container"]} shadow`}>
                    <ScoreCard score={scores["bitcoin-scores"]} tag={"Bitcoin"} />
                    <ScoreCard score={scores["ethereum-scores"]} tag={"Ethereum"} />
                    <ScoreCard score={scores["solana-scores"]} tag={"Solana"} />
                    <ScoreCard score={scores["nft-scores"]} tag={"NFTs"} />
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
