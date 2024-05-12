import React from "react";
import styles from "./index.module.css";


interface TweetCardProps {
    text: string;
    url: string
}

function TweetCard({text, url}: TweetCardProps) {
    return (
        <a className={`${styles["box"]} shadow`} href={url} target="_blank" rel="noreferrer noopener">
            <p className="relative text-black">
                {text}
            </p>
        </a>
    )
}

export default TweetCard;

