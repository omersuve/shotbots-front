import React, { createContext, useContext, useState, useEffect, FC, ReactNode } from "react";

interface PriceData {
    price: string;
    change: string;
}

interface PricesContextProps {
    prices: { [key: string]: PriceData };
    loading: boolean;
    setPrices: (data: { [key: string]: PriceData }) => void;
}

const PricesContext = createContext<PricesContextProps | undefined>(undefined);

interface PricesProviderProps {
    children: ReactNode;
}

export const PricesProvider: FC<PricesProviderProps> = ({ children }) => {
    const [prices, setPrices] = useState<{ [key: string]: PriceData }>({});
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        setLoading(true);

        async function fetchPrices() {
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(["bitcoin", "ethereum", "solana"]),
            };

            try {
                const response = await fetch("/api/price", requestOptions);
                const data = await response.json();
                setPrices(data.prices);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching the price:", error);
            }
        }

        fetchPrices().then(r => {
        });

        const interval = setInterval(fetchPrices, 15000); // Fetch every 15 secs

        return () => clearInterval(interval); // Cleanup on component unmount
    }, []);

    return (
        <PricesContext.Provider value={{ prices, loading, setPrices }}>
            {children}
        </PricesContext.Provider>
    );
};

export const usePrices = () => {
    const context = useContext(PricesContext);
    if (!context) {
        throw new Error("usePrices must be used within a PricesProvider");
    }
    return context;
};
