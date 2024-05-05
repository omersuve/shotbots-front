import React from "react";
import parse from 'html-react-parser';
import styles from "./index.module.css";


interface NewsBodyProps {
    body: string;
}

function NewsBody({body}: NewsBodyProps) {
    return (
        <div className={`${styles["box"]} shadow`}>
            <h3 className="relative text-black">
                {parse(body)}
            </h3>
        </div>
    )
}

export default NewsBody;

