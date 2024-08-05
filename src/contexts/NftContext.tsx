import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { NftData } from "../types";
import Pusher from "pusher-js";

const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
});

interface NftContextProps {
    nfts: NftData[];
    loading: boolean;
    error: string | null;
}

const NftContext = createContext<NftContextProps | undefined>(undefined);

interface NftProviderProps {
    children: ReactNode;
}

export const NftProvider: React.FC<NftProviderProps> = ({ children }) => {
    const [nfts, setNfts] = useState<NftData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refetchNfts, setRefetchNfts] = useState(false);

    const fetchNfts = async () => {
        try {
            const response = await fetch("/api/nft");
            if (response.ok) {
                const data: NftData[] = await response.json();
                setNfts(data);
            }
        } catch (err) {
            let errorMessage = "An unknown error occurred";
            if (err instanceof Error) {
                errorMessage = err.message;
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNfts().then();

        const channel = pusher.subscribe("nft-channel");

        channel.bind("nfts-event", (data: { message: string }) => {
            setRefetchNfts(prev => !prev); // Toggle reFetch state
        });

        channel.bind("pusher:subscription_succeeded", () => {
            console.log("success-connect");
        });

        channel.bind("pusher:subscription_error", () => {
            console.log("error-connect");
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };

    }, []);

    useEffect(() => {
        fetchNfts().then();
    }, [refetchNfts]);

    return (
      <NftContext.Provider value={{ nfts, loading, error }}>
          {children}
      </NftContext.Provider>
    );
};

export const useNfts = () => {
    const context = useContext(NftContext);
    if (!context) {
        throw new Error("useNfts must be used within a NftProvider");
    }
    return context;
};
