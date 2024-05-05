import type {WalletProviderProps} from "@solana/wallet-adapter-react";
import {WalletProvider} from "@solana/wallet-adapter-react";

import {
    PhantomWalletAdapter,
    SolflareWalletAdapter
} from '@solana/wallet-adapter-wallets'
import {type ReactNode, useMemo} from "react";
import {WalletModalProvider} from "@solana/wallet-adapter-react-ui";

import('@solana/wallet-adapter-react-ui/styles.css' as any);

export function ClientWalletProvider(props: Omit<WalletProviderProps, "wallets">, children: ReactNode) {
    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter()
        ],
        []
    );

    return (
        <WalletProvider wallets={wallets} {...props}>
            <WalletModalProvider {...props}>
                {children}
            </WalletModalProvider>
        </WalletProvider>
    );


}

export default ClientWalletProvider;
