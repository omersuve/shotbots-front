import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Memecoin = {
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

    const fetchMemeCoins = async () => {
        try {
            const response = await fetch("/api/memecoin");
            if (response.ok) {
                const data: Memecoin[] = await response.json();
                const filteredData = data.filter((item) => item !== null); // Filter out null values
                setMemecoins(filteredData.slice(0, 10));
            }
        } catch (err) {
            let errorMessage = "An unknown error occurred";
            if (err instanceof Error) {
                errorMessage = err.message;
            }
            setError(errorMessage);
        }
    };

    const fetchTopMemeCoins = async () => {
        try {
            const responseTop = await fetch("/api/getTopMemecoins");
            if (responseTop.ok) {
                const dataTop: Memecoin[] = await responseTop.json();
                setTopMemecoins(dataTop.slice(0, 10));
            }
        } catch (err) {
            let errorMessage = "An unknown error occurred";
            if (err instanceof Error) {
                errorMessage = err.message;
            }
            setError(errorMessage);
        }
    };

    useEffect(() => {
        fetchMemeCoins().then(r => fetchTopMemeCoins().then(r => setLoading(false)));
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            fetchMemeCoins().then(); // Fetch every 1 min
        }, 60000);

        return () => clearInterval(interval); // Cleanup on component unmount
    }, []);

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
