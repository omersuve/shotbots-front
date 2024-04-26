import React from "react";
import styles from "./index.module.css";


interface ScoreCardProps {
    tag: any;
    score: any;
}

function ScoreCard({tag, score}: ScoreCardProps) {
    return (
        <div className={`${styles["box"]} shadow`}>
            <h3 className="text-xl font-bold relative text-black border-bottom">
                {tag}
            </h3>
            <h6 className="font-bold relative text-black pt-4">
                Todays score:{score}
            </h6>
        </div>
    )
}

export default ScoreCard

