import React from "react";
import styles from './index.module.css';

const InfoBlock: React.FC = ({ children }) => {
  return (
    <div className={`${styles["block"]} rounded-box shadow-lg`}>
      <div>
        <div className={styles["item"]}>
          Bitcoin
        </div>
        <div className={styles["item"]}>
          50,000
        </div>
        <div className={styles["item"]}>
          1,000,000,000
        </div>
        <div className={styles["item"]}>
          %10
        </div>
      </div>
    </div>
  );
};

export default InfoBlock;