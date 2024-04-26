import React from "react";
// @ts-ignore
import ReactHtmlParser from 'react-html-parser';
import styles from "./index.module.css";


interface NewsCardProps {
    title: string;
}

function NewsCard({title}: NewsCardProps) {
    return (
        <div className={`${styles["box"]} shadow`}>
            <h3 className="relative text-black">
                {ReactHtmlParser(title)}
            </h3>
        </div>
    )
}

export default NewsCard;

