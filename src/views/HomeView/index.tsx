import React, { FC } from "react";
import styles from "./index.module.css";
import LineGraph from "../../components/LineGraph";
import ScoreCard from "../../components/ScoreCard";
import MyLoader from "../../components/MyLoader";
import { useScores } from "../../contexts/ScoresContext";

export const HomeView: FC = () => {
    const { scoresHistory, loading } = useScores();

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
