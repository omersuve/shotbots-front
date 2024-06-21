import type { NextPage } from "next";
import Head from "next/head";
import { NftView } from "../views";

const Nft: NextPage = (props) => {
    return (
        <div>
            <Head>
                <title>NFT</title>
            </Head>
            <NftView />
        </div>
    );
};

export default Nft;