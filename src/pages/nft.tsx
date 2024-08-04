import type { NextPage } from "next";
import Head from "next/head";
import { NftView } from "../views";
import { useState } from "react";
import TabNFTs from "../components/TabNFT";

const Nft: NextPage = (props) => {
    const [selectedTab, setSelectedTab] = useState("trending-nfts");

    return (
      <div>
          <Head>
              <title>NFT</title>
          </Head>
          <TabNFTs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
          {selectedTab === "trending-nfts" && <NftView />}
      </div>
    );
};

export default Nft;