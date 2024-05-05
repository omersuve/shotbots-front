import React, {useMemo} from "react";
import type {AppProps} from "next/app";
import dynamic from "next/dynamic";
// import {ConnectionProvider} from "@solana/wallet-adapter-react";
import "../../src/scss/custom.scss";
import Navbar from "../components/Navbar"
import {useRouter} from 'next/router';


import "tailwindcss/tailwind.css";
import "../styles/globals.css";
import "../styles/App.css";
// import {clusterApiUrl} from "@solana/web3.js";
// import {WalletAdapterNetwork} from "@solana/wallet-adapter-base";
//
// const WalletProvider = dynamic(
//     () => import("../contexts/ClientWalletProvider"),
//     {
//         ssr: false,
//     },
// );

function MyApp({Component, pageProps}: AppProps) {
    const router = useRouter()
    // const network = WalletAdapterNetwork.Devnet;

// You can also provide a custom RPC endpoint.
//     const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    return (
        // <ConnectionProvider endpoint={endpoint}>
        //     <WalletProvider>
        <div>
            {router.pathname != "/" && <Navbar/>}
            <Component {...pageProps} />
        </div>
        // </WalletProvider>
        // </ConnectionProvider>
    );
}

export default MyApp;
