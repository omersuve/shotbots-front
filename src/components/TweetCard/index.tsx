import React from "react";
import styles from "./index.module.css";
import { formatDate } from "../../utils";


interface TweetCardProps {
    text: string;
    url: string;
    date: string;
}

function TweetCard({text, url, date}: TweetCardProps) {
    return (
        <a className={`${styles["box"]} shadow`} href={url} target="_blank" rel="noreferrer noopener">
            <p className="text-black text-left mr-16">
                {text}
            </p>
            <div className="absolute right-2 top-2">
                {formatDate(date)}
            </div>
        </a>
    )
}

export default TweetCard;

