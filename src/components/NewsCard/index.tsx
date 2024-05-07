import React from "react";
import parse from 'html-react-parser';
import styles from "./index.module.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRight} from "@fortawesome/free-solid-svg-icons";
import {IconProp} from "@fortawesome/fontawesome-svg-core";


interface NewsCardProps {
    title: string;
    isOpen: boolean
}

function NewsCard({title, isOpen}: NewsCardProps) {
    return (
        <div className={`${styles["box"]} shadow`}>
            <h3 className="relative text-black">
                {parse(title)}
            </h3>
            <div className={styles["toggle-btn"]}>
                {isOpen &&
                    <FontAwesomeIcon
                        icon={faArrowRight as IconProp}
                        className="fa-xl"/>
                }
            </div>
        </div>
    )
}

export default NewsCard;