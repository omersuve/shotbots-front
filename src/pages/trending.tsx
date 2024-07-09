import type { NextPage } from "next";
import Head from "next/head";
import { TrendingView } from "../views";

const Trending: NextPage = (props) => {
    return (
      <div>
          <Head>
              <title>Trending</title>
          </Head>
          <TrendingView />
      </div>
    );
};

export default Trending;