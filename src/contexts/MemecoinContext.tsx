import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import Pusher from "pusher-js";

const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
});

export type Memecoin = {
    baseAddress: string;
    logoUrl: string;
    name: string;
    symbol: string;
    price: number | null;
    price_change_1d: number | null;
    real_volume_1d: number | null;
    circulating_marketcap: number | null;
    chainId: string;
    url: string;
    liquidity: number | null
};

interface MemecoinContextProps {
    memecoins: Memecoin[];
    topMemecoins: Memecoin[];
    loading: boolean;
    error: string | null;
}

const MemecoinContext = createContext<MemecoinContextProps | undefined>(undefined);

interface MemecoinProviderProps {
    children: ReactNode;
}

export const MemecoinProvider: React.FC<MemecoinProviderProps> = ({ children }) => {
    const [memecoins, setMemecoins] = useState<Memecoin[]>([]);
    const [topMemecoins, setTopMemecoins] = useState<Memecoin[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refetchMemecoins, setRefetchMemecoins] = useState(false);
    const [refetchTopMemecoins, setRefetchTopMemecoins] = useState(false);


    const fetchMemecoins = async () => {
        try {
            const response = await fetch("/api/memecoin");
            if (response.ok) {
                const data: Memecoin[] = await response.json();
                setMemecoins(data.slice(0, 10));
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

    const fetchTopMemecoins = async () => {
        try {
            const topResponse = await fetch("/api/getTopMemecoins");
            if (topResponse.ok) {
                const data: Memecoin[] = await topResponse.json();
                setTopMemecoins(data.slice(0, 10));
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
        fetchMemecoins().then();
        fetchTopMemecoins().then();

        const channel = pusher.subscribe("memecoin-channel");

        channel.bind("memecoins-event", (data: { message: string }) => {
            setRefetchMemecoins(prev => !prev); // Toggle reFetch state
        });

        channel.bind("top-memecoins-event", (data: { message: string }) => {
            setRefetchTopMemecoins(prev => !prev); // Toggle reFetch state
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
        fetchMemecoins().then();
    }, [refetchMemecoins]);

    useEffect(() => {
        fetchTopMemecoins().then();
    }, [refetchTopMemecoins]);

    return (
      <MemecoinContext.Provider value={{ memecoins, topMemecoins, loading, error }}>
          {children}
      </MemecoinContext.Provider>
    );
};

export const useMemecoins = () => {
    const context = useContext(MemecoinContext);
    if (!context) {
        throw new Error("useMemecoins must be used within a MemecoinProvider");
    }
    return context;
};
