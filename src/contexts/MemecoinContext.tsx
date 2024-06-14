import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Memecoin = {
    id: string;
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
    loading: boolean;
    error: string | null;
}

const MemecoinContext = createContext<MemecoinContextProps | undefined>(undefined);

interface MemecoinProviderProps {
    children: ReactNode;
}

function timeout(delay: number) {
    return new Promise(res => setTimeout(res, delay));
}

export const MemecoinProvider: React.FC<MemecoinProviderProps> = ({ children }) => {
    const [memecoins, setMemecoins] = useState<Memecoin[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMemeCoins = async () => {
        try {
            const response = await fetch("/api/memecoin");
            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }
            const data: Memecoin[] = await response.json();
            const filteredData = data.filter((item) => item !== null); // Filter out null values
            setMemecoins(filteredData.slice(0, 15));
        } catch (err) {
            let errorMessage = "An unknown error occurred";
            if (err instanceof Error) {
                errorMessage = err.message;
            }
            setError(errorMessage);
        } finally {
            await timeout(3000); //for 1 sec delay
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMemeCoins().then(r => {
        }); // Initial fetch
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            fetchMemeCoins().then(r => {
            }); // Fetch every 20 sec
        }, 20000);

        return () => clearInterval(interval); // Cleanup on component unmount
    }, []);

    return (
        <MemecoinContext.Provider value={{ memecoins, loading, error }}>
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
