import React from "react";
import styles from "./index.module.css";


interface TweetCardProps {
    text: string;
    url: string
}

function TweetCard({text, url}: TweetCardProps) {
    return (
        <div className={`${styles["box"]} shadow`}>
            <a href={url} target="_blank">
                <p className="relative text-black">
                    {text}
                </p>
            </a>
        </div>
    )
}

export default TweetCard;

