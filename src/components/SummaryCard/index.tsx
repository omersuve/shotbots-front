import React from "react";
import styles from "./index.module.css";

interface SummaryCardProps {
  tag: "Bitcoin" | "Solana" | "Memecoin" | "NFT";
  position: { top: number; left: number };
}

const SummaryCard: React.FC<SummaryCardProps> = ({ tag, position }) => {
  const getSummaryContent = (tag: string) => {
    switch (tag) {
      case "Bitcoin":
      case "Solana":
      case "Memecoin":
      case "NFT":
        return "Deeper analysis soon...";
      default:
        return "";
    }
  };

  return (
    <div
      className={styles["summary-card"]}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        position: "absolute",
      }}
    >
      <p>{getSummaryContent(tag)}</p>
    </div>
  );
};

export default SummaryCard;
