import { FC, useEffect, useState } from "react";
import {useWallet } from "@solana/wallet-adapter-react";

import { SolanaLogo } from "components";
import styles from "./index.module.css";
import Navbar from "../../components/Navbar";

export const PortfolioView: FC = ({}) => {
  const { publicKey } = useWallet();
  const [connectedWallets, setConnectedWallets] = useState("");

  useEffect(() => {
    if (publicKey){
      setConnectedWallets("your connected wallets")
    } else {
      setConnectedWallets("")
    }
  }, [publicKey]);

  return (
    <div className="container mx-auto max-w-6xl p-8 2xl:px-0">
      <Navbar connectedWallets={connectedWallets} />
      <div className={styles.container}>
        <div className="text-center pt-2">
          <div className="hero min-h-16 py-4">
            <div className="text-center hero-content">
              <div className="max-w-lg">
                <h1 className="mb-5 text-3xl font-bold">
                  Hello Solana <SolanaLogo /> World!
                </h1>
                <p className="mb-5">
                  You have no coins
                </p>
                <p>
                  {publicKey ? <>Your address: {publicKey.toBase58()}</> : null}
                </p>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <h1 className="mb-5 pb-8 text-2xl">Your Coins:</h1>
          </div>
        </div>
      </div>
    </div>
  );
};
