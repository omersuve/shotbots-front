import React, { FC, useEffect, useRef, useState } from "react";
import styles from "./index.module.css";
import LineGraph from "../../components/LineGraph";
import ScoreCard from "../../components/ScoreCard";
import SummaryCard from "../../components/SummaryCard";
import MyLoader from "../../components/MyLoader";
import { useScores } from "../../contexts/ScoresContext";

export const HomeView: FC = () => {
    const { scoresHistory, loading } = useScores();
    const [selectedTag, setSelectedTag] = useState<"Bitcoin" | "Solana" | "NFTs" | "Ethereum" | null>(null);
    const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
    const summaryRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (summaryRef.current && !summaryRef.current.contains(event.target as Node)) {
                setSelectedTag(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [summaryRef]);

    const handleCardClick = (tag: "Bitcoin" | "Solana" | "NFTs" | "Ethereum", event: React.MouseEvent) => {
        setSelectedTag(tag);
        const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
        setPosition({
            top: rect.top / 2 + window.scrollY, // Small offset below the card
            left: rect.left / 2 + window.scrollX, // Same x-axis as the card
        });
    };

    return (
      <div className={`${styles["box-with-graph"]} flex flex-col items-center relative`}>
          <p className="text-center fs-6 fw-bold my-1">TODAY&apos;S MARKET SENTIMENT SCORES</p>
          {loading ? (
            // Display a loading spinner while data is being fetched
            <MyLoader />
          ) : (
            scoresHistory &&
            <>
              <div className={`${styles["box-container"]} shadow`}>
                <ScoreCard
                  score={scoresHistory["bitcoin-day-scores"][0].day_score > 1 ? 10 : scoresHistory["bitcoin-day-scores"][0].day_score < 0 ? 0 : scoresHistory["bitcoin-day-scores"][0].day_score * 10}
                  tag={"Bitcoin"}
                  onClick={handleCardClick}
                />
                <ScoreCard
                  score={scoresHistory["ethereum-day-scores"][0].day_score > 1 ? 10 : scoresHistory["ethereum-day-scores"][0].day_score < 0 ? 0 : scoresHistory["ethereum-day-scores"][0].day_score * 10}
                  tag={"Ethereum"}
                  onClick={handleCardClick}
                />
                <ScoreCard
                  score={scoresHistory["solana-day-scores"][0].day_score > 1 ? 10 : scoresHistory["solana-day-scores"][0].day_score < 0 ? 0 : scoresHistory["solana-day-scores"][0].day_score * 10}
                  tag={"Solana"}
                  onClick={handleCardClick}
                />
                <ScoreCard
                  score={scoresHistory["nft-day-scores"][0].day_score > 1 ? 10 : scoresHistory["nft-day-scores"][0].day_score < 0 ? 0 : scoresHistory["nft-day-scores"][0].day_score * 10}
                  tag={"NFTs"}
                  onClick={handleCardClick}
                />
              </div>
                {selectedTag && (
                  <div ref={summaryRef} className={styles["summary-card"]}
                       style={{ top: `${position.top}px`, left: `${position.left}px`, position: "absolute" }}>
                      <SummaryCard tag={selectedTag} position={position} />
                  </div>
                )}
              <div className={`${styles["graph-container"]} p-4 shadow`}
                   style={{ width: "fit-content" }}>
                <LineGraph scoresHistory={scoresHistory} />
              </div>
            </>
          )}
      </div>
    );
};
