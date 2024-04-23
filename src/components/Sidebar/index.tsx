import React, { useState } from "react";
import Link from "next/link";
import styles from "./index.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faArrowLeft, faArrowRight, faHome, faFile } from "@fortawesome/free-solid-svg-icons";

const Sidebar: React.FC = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`container ${isSidebarOpen ? styles.sidebar : styles["sidebar-closed"]}`}>
      <button
        className="outline-none w-full p-6 hover:bg-yellow-50 rounded-xl text-center">
        <Link href="/">
          <a className={`font-bold  ${styles.link}`}>{isSidebarOpen ? <span>Home</span> :
            <span><FontAwesomeIcon icon={faHome} /></span>}</a>
        </Link>
      </button>
      <button
        className="outline-none w-full p-6 hover:bg-yellow-50 rounded-xl text-center">
        <Link href="/src/pages">
          <a className={`font-bold ${styles.link}`}>{isSidebarOpen ? <span>Portfolio</span> :
            <span><FontAwesomeIcon icon={faFile} /></span>}</a>
        </Link>
      </button>
      <button onClick={toggleSidebar} className={styles["toggle-btn"]}>
        <FontAwesomeIcon icon={isSidebarOpen ? faArrowLeft as IconProp : faArrowRight as IconProp} className="fa-x" />
      </button>
    </div>
  );
};

export default Sidebar;
