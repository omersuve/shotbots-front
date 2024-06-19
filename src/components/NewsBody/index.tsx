import React from "react";
import parse from 'html-react-parser';
import styles from "./index.module.css";


interface NewsBodyProps {
    body: string;
}

function NewsBody({body}: NewsBodyProps) {
    return (
        <div className={`${styles["box"]} shadow pointer-events-none`}>
            <h1 className="relative text-black">
                {parse(body)}
            </h1>
        </div>
    )
}

export default NewsBody;

