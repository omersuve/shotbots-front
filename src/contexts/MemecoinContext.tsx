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
            setLoading(false);
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
        fetchMemeCoins().then(r => {
        }); // Initial fetch

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
