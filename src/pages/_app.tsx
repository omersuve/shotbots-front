import React, {useMemo} from "react";
import type {AppProps} from "next/app";
import {ConnectionProvider, WalletProvider} from "@solana/wallet-adapter-react";
import "../../src/scss/custom.scss";
import Navbar from "../components/Navbar"
import {useRouter} from 'next/router';

import "tailwindcss/tailwind.css";
import "../styles/globals.css";
import "../styles/App.css";
import {clusterApiUrl} from "@solana/web3.js";
import {WalletAdapterNetwork} from "@solana/wallet-adapter-base";
import {PhantomWalletAdapter, SolflareWalletAdapter} from "@solana/wallet-adapter-wallets";
import {WalletModalProvider} from "@solana/wallet-adapter-react-ui";

import('@solana/wallet-adapter-react-ui/styles.css' as any);

function MyApp({Component, pageProps}: AppProps) {
    const router = useRouter()
    const network = WalletAdapterNetwork.Devnet;

    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter()
        ],
        [network]
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    {router.pathname != "/" && <Navbar/>}
                    <Component {...pageProps} />
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
}

export default MyApp;
