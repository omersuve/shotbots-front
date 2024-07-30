import React, { createContext, useContext, useState, useEffect, FC, ReactNode } from "react";
import Pusher from "pusher-js";

const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
});

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
    const [refetch, setRefetch] = useState(false);

    const fetchPrices = async () => {
        try {
            const response = await fetch("/api/price");
            if (response.ok) {
                const data = await response.json();
                setPrices(data);
            }
        } catch (error) {
            console.error("Error fetching initial price data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPrices().then();

        const channel = pusher.subscribe("price-channel");

        channel.bind("prices-event", (data: { message: string, differences: any }) => {
            console.log(data);
            setRefetch(prev => !prev); // Toggle reFetch state
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
        fetchPrices().then();
    }, [refetch]);

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
