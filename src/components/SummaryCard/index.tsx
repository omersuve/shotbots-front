import React from "react";
import styles from "./index.module.css";

interface SummaryCardProps {
    tag: "Bitcoin" | "Solana" | "NFTs" | "Ethereum";
    position: { top: number; left: number };
}

const SummaryCard: React.FC<SummaryCardProps> = ({ tag, position }) => {
    const getSummaryContent = (tag: string) => {
        switch (tag) {
            case "Bitcoin":
                return "Bitcoin is a decentralized digital currency";
            case "Ethereum":
                return "Ethereum is a decentralized, open-source blockchain";
            case "Solana":
                return "Solana is a high-performance blockchain";
            case "NFTs":
                return "NFTs, or Non-Fungible Tokens, are unique digital assets";
            default:
                return "";
        }
    };

    return (
      <div
        className={styles["summary-card"]}
        style={{ top: `${position.top}px`, left: `${position.left}px`, position: "absolute" }}
      >
          <p>{getSummaryContent(tag)}</p>
      </div>
    );
};

export default SummaryCard;
