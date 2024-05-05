import React from "react";
import parse from 'html-react-parser';
import styles from "./index.module.css";


interface NewsCardProps {
    title: string;
}

function NewsCard({title}: NewsCardProps) {
    return (
        <div className={`${styles["box"]} shadow`}>
            <h3 className="relative text-black">
                {parse(title)}
            </h3>
        </div>
    )
}

export default NewsCard;

