import React, { FC } from "react";
import styles from "./index.module.css";

type TabNavigationProps = {
    selectedTab: string;
    setSelectedTab: (tab: string) => void;
};

const TabMeme: FC<TabNavigationProps> = ({ selectedTab, setSelectedTab }) => {
    return (
      <div className={styles.tabContainer}>
          <button
            className={`${styles.tabButton} ${selectedTab === "memecoin" ? styles.active : ""}`}
            onClick={() => setSelectedTab("memecoin")}
          >
              BEST PERFORMANCE TODAY
          </button>
          <button
            className={`${styles.tabButton} ${selectedTab === "trending" ? styles.active : ""}`}
            onClick={() => setSelectedTab("trending")}
          >
              TRENDING NEW PAIRS
          </button>
          <button
            className={`${styles.tabButton} ${selectedTab === "top-market-cap" ? styles.active : ""}`}
            onClick={() => setSelectedTab("top-market-cap")}
          >
              TOP MARKET CAP
          </button>
      </div>
    );
};

export default TabMeme;
