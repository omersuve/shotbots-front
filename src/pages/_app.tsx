import React, { useMemo } from "react";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import { ConnectionProvider } from "@solana/wallet-adapter-react";

import "tailwindcss/tailwind.css";
import "../styles/globals.css";
import "../styles/App.css";
import { clusterApiUrl } from "@solana/web3.js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

const WalletProvider = dynamic(
  () => import("../contexts/ClientWalletProvider"),
  {
    ssr: false,
  },
);

function MyApp({ Component, pageProps }: AppProps) {
  const network = WalletAdapterNetwork.Devnet;

// You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider>
        <Component {...pageProps} />
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default MyApp;
