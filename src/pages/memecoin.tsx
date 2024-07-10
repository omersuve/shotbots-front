import { useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { MemecoinView, TrendingView, TopMarketCapMemecoinsView } from "../views";
import TabNavigation from "../components/TabNavigation";

const Memecoin: NextPage = (props) => {
    const [selectedTab, setSelectedTab] = useState("memecoin");

    return (
      <div>
          <Head>
              <title>Memecoin</title>
          </Head>
          <TabNavigation selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
          {selectedTab === "memecoin" && <MemecoinView />}
          {selectedTab === "trending" && <TrendingView />}
          {selectedTab === "top-market-cap" && <TopMarketCapMemecoinsView />}
      </div>
    );
};

export default Memecoin;