import React from "react";
import {useConnection, useWallet} from "@solana/wallet-adapter-react";
import {useWalletNfts} from "@nfteyez/sol-rayz-react";
import Tabs from "../Tabs";
import styles from "./index.module.css";
import PriceTable from "../PriceTable";

const HomeBody: React.FC = ({children}) => {
  const {publicKey} = useWallet();
  const {connection} = useConnection();

  const {nfts, isLoading, error} = useWalletNfts({
    publicAddress: publicKey,
    connection,
  });

  console.log("nfts", nfts);

  const exampleData = [
    { name: 'Bitcoin', price: '9192939494', volume: '1234567890' },
    { name: 'Ethereum', price: '8787878787', volume: '1234567890' },
    { name: 'Solana', price: '7654321098', volume: '1234567890' },
    { name: 'Bonk', price: '9876543210', volume: '1234567890' },
    { name: 'Wif', price: '1234567890', volume: '1234567890' },
    { name: 'Doge', price: '1234567890', volume: '1234567890' },
    { name: 'Wif', price: '1234567890', volume: '1234567890' },
    { name: 'Mal', price: '1234567890', volume: '1234567890' },
  ];

  return (
    <div className="text-center pt-2 min-w-screen-lg">
      <div className="inline-flex flex-wrap justify-center items-center">
        <div className="text-left mr-20">
          <div className="flex items-center justify-center">
            <div className={styles["title"]}>
              <div className="max-w-lg">
                <h3 className="text-xl font-bold relative">
                  Prices
                  {/*Solana <SolanaLogo />*/}
                </h3>
              </div>
            </div>
          </div>
          <PriceTable data={exampleData} />
        </div>
        <Tabs/>
      </div>
      {/*<div className="my-10">*/}
      {/*  {error ? (*/}
      {/*    <div>*/}
      {/*      <h1>Error Occures</h1>*/}
      {/*      {(error as any)?.message}*/}
      {/*    </div>*/}
      {/*  ) : null}*/}

      {/*  {!error && isLoading ? (*/}
      {/*    <div>*/}
      {/*      <Loader/>*/}
      {/*    </div>*/}
      {/*  ) : (*/}
      {/*    <h1>Hello</h1>*/}
      {/*  )}*/}
      {/*</div>*/}
    </div>
  );
};

export default HomeBody;