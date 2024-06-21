import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { NftData } from "../types";

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

    const fetchNfts = async () => {
        try {
            const response = await fetch("/api/nft");
            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }
            const data: NftData[] = await response.json();
            setNfts(data);
            setLoading(false);
        } catch (err) {
            let errorMessage = "An unknown error occurred";
            if (err instanceof Error) {
                errorMessage = err.message;
            }
            setError(errorMessage);
        }
    };

    useEffect(() => {
        fetchNfts().then();
    }, []);


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
