import React from "react";
// @ts-ignore
import ReactHtmlParser from 'react-html-parser';
import styles from "./index.module.css";


interface NewsBodyProps {
    body: string;
}

function NewsBody({body}: NewsBodyProps) {
    return (
        <div className={`${styles["box"]} shadow`}>
            <h3 className="relative text-black">
                {ReactHtmlParser(body)}
            </h3>
        </div>
    )
}

export default NewsBody;

