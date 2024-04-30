import React from "react";
import styles from "./index.module.css";


interface TweetCardProps {
    text: string;
}

function TweetCard({text}: TweetCardProps) {
    return (
        <div className={`${styles["box"]} shadow`}>
            <h3 className="relative text-black">
                {text}
            </h3>
        </div>
    )
}

export default TweetCard;

