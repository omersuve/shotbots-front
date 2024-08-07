import React from "react";
import styles from "./index.module.css";
import btcLogo from "../../../public/bitcoin-btc-logo.svg";
import nftLogo from "../../../public/nft.svg";
import ethLogo from "../../../public/ethereum-eth-logo.svg";
import solLogo from "../../../public/solana-sol-logo.svg";
import Image from "next/image";


interface ScoreCardProps {
    tag: "Bitcoin" | "Solana" | "NFTs" | "Ethereum";
    score: number;
    onClick: (tag: "Bitcoin" | "Solana" | "NFTs" | "Ethereum", event: React.MouseEvent) => void;
}

function ScoreCard({ tag, score, onClick }: ScoreCardProps) {

    const getProgressBarColor = (score: number) => {
        const percentage = score * 10;

        if (percentage < 33) {
            return "bg-red-600"; // Red for less than 33%
        } else if (percentage >= 33 && percentage <= 66) {
            return "bg-yellow-600"; // Yellow for 33% to 66%
        } else {
            return "bg-green-600"; // Green for greater than 66%
        }
    };

    const getTextColor = (score: number) => {
        const percentage = score * 10;

        if (percentage < 33) {
            return "text-red-600"; // Red text for less than 33%
        } else if (percentage >= 33 && percentage <= 66) {
            return "text-yellow-600"; // Yellow text for 33% to 66%
        } else {
            return "text-green-600"; // Green text for greater than 66%
        }
    };

    const progressBarColor = getProgressBarColor(score);
    const textColor = getTextColor(score);

    return (
      <div className={`${styles["box"]} shadow h-44 hover:bg-gray-100 cursor-pointer`} onClick={(e) => onClick(tag, e)}>
          {tag == "NFTs" && <Image
            src={nftLogo}
            alt="nft SVG"
            width={20}
            height={20}
            style={{ display: "inline-flex", marginBottom: "4px" }}
          />}
          {tag == "Solana" && <Image
            src={solLogo}
            alt="sol SVG"
            width={24}
            height={24}
            style={{ display: "inline-flex", marginBottom: "8px" }}
          />}
          {tag == "Bitcoin" && <Image
            src={btcLogo}
            alt="btc SVG"
            width={24}
            height={24}
            style={{ display: "inline-flex", marginBottom: "4px" }}
          />}
          {tag == "Ethereum" && <Image
            src={ethLogo}
            alt="eth SVG"
            width={15}
            height={15}
            style={{ display: "inline-flex", marginBottom: "4px" }}
          />}
          <h5 className="text-l font-bold relative text-black border-bottom mb-1">
              {tag}
          </h5>
          <h6 className="fs-6 relative text-black pt-1 m-1 fw-semibold italic">
              {score} / 10
          </h6>
          <div>
              <div
                className={`inline-block mb-2 ms-[calc(25%-1.25rem)] py-0.5 px-1.5 border border-blue-200 text-xs font-medium rounded-lg ${textColor}`}>{`%${score * 10}`}
              </div>
              <div className="flex w-full h-2 bg-gray-200 rounded-full overflow-hidden"
                   role="progressbar">
                  <div
                    className={`flex flex-col justify-center rounded-full overflow-hidden ${progressBarColor} text-xs text-white text-center whitespace-nowrap transition duration-500`}
                    style={{ width: `${score * 10}%` }}></div>
              </div>
          </div>
      </div>
    );
}

export default ScoreCard;

