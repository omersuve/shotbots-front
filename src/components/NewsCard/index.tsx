import React, {useState} from "react";
import parse from 'html-react-parser';
import styles from "./index.module.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRight} from "@fortawesome/free-solid-svg-icons";
import {IconProp} from "@fortawesome/fontawesome-svg-core";
import Slider from '@mui/material/Slider';


interface NewsCardProps {
    title: string;
    isOpen: boolean
}

function NewsCard({title, isOpen}: NewsCardProps) {
    const [vote, setVote] = useState(0);

    function valuetext(value: number) {
        return `${value}°C`;
    }

    return (
        <div className={`${styles["box"]} shadow`}>
            <h3 className="relative text-black">
                {parse(title)}
            </h3>
            <Slider
                aria-label="Vote"
                defaultValue={0}
                getAriaValueText={valuetext}
                valueLabelDisplay="auto"
                shiftStep={1}
                onChange={(event, newValue) => {
                    setVote(newValue as number)
                }}
                step={1}
                marks
                min={-3}
                max={3}
            />
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