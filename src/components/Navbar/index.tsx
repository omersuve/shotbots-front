import React from "react";
import {WalletMultiButton} from "@solana/wallet-adapter-react-ui";
import styles from "./index.module.css";

interface NavbarProps {
    connectedWallets: string
}

const Navbar: React.FC<NavbarProps> = ({ connectedWallets }) => {
  return (
    <div className={`${styles["navbar"]} navbar mb-2 shadow-lg text-neutral-content rounded-box`}>
      <button className="btn btn-square btn-ghost">
        <span className="text-4xl">D</span>
      </button>
      <div className="flex-1 px-2 mx-2">
        <span className="text-lg font-bold">Dashboard</span>
      </div>
      <div className="flex-none">
        {connectedWallets}
        <WalletMultiButton className={"btn btn-ghost"} style={{ backgroundColor: "rgba(100, 65, 52, 0.19)", color: "#333333" }} />
      </div>
    </div>
  );
};

export default Navbar;
