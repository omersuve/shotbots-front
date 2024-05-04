import {RotatingLines} from "react-loader-spinner";
import React from "react";
import styles from "./index.module.css";

export default function MyLoader() {
    return (
        <div className={styles["loader"]}>
            <RotatingLines
                strokeColor="grey"
                strokeWidth="5"
                animationDuration="0.75"
                width="96"
                visible={true}
            />
        </div>
    )
}