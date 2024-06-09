import { RotatingLines } from "react-loader-spinner";
import React from "react";
import styles from "./index.module.css";

interface MyLoaderProps {
    size?: "small" | "large";
    inline?: boolean; // Add a prop to handle inline positioning
}

const MyLoader: React.FC<MyLoaderProps> = ({ size = "large", inline = false }) => {
    const loaderSize = size === "small" ? 24 : 96; // Define loader sizes
    const loaderStyle = inline ? styles.inlineLoader : styles.loader;

    return (
        <div className={loaderStyle}>
            <RotatingLines
                strokeColor="grey"
                strokeWidth="5"
                animationDuration="0.75"
                width={loaderSize.toString()}
                visible={true}
            />
        </div>
    );
};

export default MyLoader;
