import React from "react";
import styles from './index.module.css';

const InfoHeader: React.FC = ({ }) => {
  return (
    <div className={`${styles["block"]} rounded-box shadow-lg`}>
      <div>
        <div className={styles["item"]}>
          Name
        </div>
        <div className={styles["item"]}>
          Price
        </div>
        <div className={styles["item"]}>
          Volume
        </div>
        <div className={styles["item"]}>
          Change
        </div>
      </div>
    </div>
  );
};

export default InfoHeader;