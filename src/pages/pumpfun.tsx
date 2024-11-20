import type { NextPage } from "next";
import Head from "next/head";
import { PumpView } from "../views";

const Pumpfun: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Pumpfun</title>
      </Head>
      <PumpView />
    </div>
  );
};

export default Pumpfun;
