import type { NextPage } from "next";
import Head from "next/head";
import { MemecoinView } from "../views";

const Memecoin: NextPage = (props) => {
    return (
        <div>
            <Head>
                <title>Memecoin</title>
            </Head>
            <MemecoinView />
        </div>
    );
};

export default Memecoin;