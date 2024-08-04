import React, { FC } from "react";
import styles from "./index.module.css";

type TabNavigationProps = {
    selectedTab: string;
    setSelectedTab: (tab: string) => void;
};

const TabNFT: FC<TabNavigationProps> = ({ selectedTab, setSelectedTab }) => {
    return (
      <div className={styles.tabContainer}>
          <button
            className={`${styles.tabButton} ${selectedTab === "trending-nfts" ? styles.active : ""}`}
            onClick={() => setSelectedTab("trending-nfts")}
          >
              TRENDING NFTS
          </button>
      </div>
    );
};

export default TabNFT;
