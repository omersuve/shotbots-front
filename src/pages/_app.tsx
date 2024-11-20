import React, { useMemo } from "react";
import type { AppProps } from "next/app";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import "../../src/scss/custom.scss";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useRouter } from "next/router";
import "tailwindcss/tailwind.css";
import "../styles/globals.css";
import "../styles/App.css";
import { clusterApiUrl } from "@solana/web3.js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import WalletHandler from "../utils/WalletHandler";

import("@solana/wallet-adapter-react-ui/styles.css" as any);

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NewsProvider } from "../contexts/NewsContext";
import { TwitterProvider } from "../contexts/TwitterContext";
import { ScoresProvider } from "../contexts/ScoresContext";
import { PricesProvider } from "../contexts/PricesContext";
import { MemecoinProvider } from "../contexts/MemecoinContext";
import { NftProvider } from "../contexts/NftContext";
import { TrendingProvider } from "../contexts/TrendingContext";
import { PumpfunProvider } from "../contexts/PumpfunContext";
import { WalletAuthProvider } from "../contexts/WalletAuthContext";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const network = WalletAdapterNetwork.Mainnet;

  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <WalletAuthProvider>
            <WalletHandler />
            <PricesProvider>
              <ScoresProvider>
                <NewsProvider>
                  <MemecoinProvider>
                    <NftProvider>
                      <TwitterProvider>
                        <PumpfunProvider>
                          <TrendingProvider>
                            <div className="flex flex-col min-h-screen">
                              {router.pathname != "/" && <Navbar />}
                              <div
                                className={`${
                                  router.pathname != "/" &&
                                  "flex-grow mt-20 mb-2"
                                }`}
                              >
                                <Component {...pageProps} />
                              </div>
                              {router.pathname != "/" && <Footer />}
                            </div>
                            <ToastContainer />
                          </TrendingProvider>
                        </PumpfunProvider>
                      </TwitterProvider>
                    </NftProvider>
                  </MemecoinProvider>
                </NewsProvider>
              </ScoresProvider>
            </PricesProvider>
          </WalletAuthProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default MyApp;
