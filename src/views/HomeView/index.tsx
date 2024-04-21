import { FC, useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import HomeBody from "../../components/HomeBody";
import { useWallet } from "@solana/wallet-adapter-react";

export const HomeView: FC = ({}) => {
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
    <div className="container mx-auto p-4 2xl:px-0">
      <Navbar connectedWallets={connectedWallets} />
      <HomeBody />
    </div>
  );
};
