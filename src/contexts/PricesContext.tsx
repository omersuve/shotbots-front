import React, { createContext, useContext, useState, useEffect, FC, ReactNode } from "react";
import Pusher from "pusher-js";

const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
});

interface PriceData {
    price: string;
    change: string;
}

interface FearGreedData {
    value: string;
    classification: string;
}

interface PricesContextProps {
    prices: { [key: string]: PriceData };
    fearGreed: FearGreedData | null;
    loading: boolean;
}

const PricesContext = createContext<PricesContextProps | undefined>(undefined);

interface PricesProviderProps {
    children: ReactNode;
}

export const PricesProvider: FC<PricesProviderProps> = ({ children }) => {
    const [prices, setPrices] = useState<{ [key: string]: PriceData }>({});
    const [fearGreed, setFearGreed] = useState<FearGreedData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [refetchPrices, setRefetchPrices] = useState(false);
    const [refetchFearGreed, setRefetchFearGreed] = useState(false);

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

    const fetchFearGreed = async () => {
        try {
            const response = await fetch("/api/fearGreed");
            if (response.ok) {
                const data = await response.json();
                setFearGreed(data);
            }
        } catch (error) {
            console.error("Error fetching initial fear greed data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPrices().then();
        fetchFearGreed().then();

        const channel = pusher.subscribe("price-channel");

        channel.bind("prices-event", (data: { message: string }) => {
            console.log(data);
            setRefetchPrices(prev => !prev); // Toggle reFetch state
        });

        channel.bind("fg-event", (data: { message: string }) => {
            console.log(data);
            setRefetchFearGreed(prev => !prev); // Toggle reFetch state
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
    }, [refetchPrices]);

    useEffect(() => {
        fetchFearGreed().then();
    }, [refetchFearGreed]);

    return (
      <PricesContext.Provider value={{ prices, fearGreed, loading }}>
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
