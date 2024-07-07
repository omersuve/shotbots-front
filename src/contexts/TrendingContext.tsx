import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import Pusher from "pusher-js";
import { TelegramMessage } from "../types";

const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
});

interface TrendingContextProps {
    messages: TelegramMessage[];
}


const TrendingContext = createContext<TrendingContextProps | undefined>(undefined);

export function TrendingProvider({ children }: PropsWithChildren) {
    const [messages, setMessages] = useState<TelegramMessage[]>([]);

    useEffect(() => {
        fetch("/api/subscribe").then(r => {
            // Fetch initial messages
            fetch("/api/getLatestTrending")
              .then((res) => res.json())
              .then((data) => setMessages(data.messages.map((m: string) => JSON.parse(m))));

            const channel = pusher.subscribe("my-channel");

            console.log("subscribed my-channel");

            channel.bind("my-event", (data: { message: string }) => {
                console.log(data);
                setMessages((prevMessages: any) => [...prevMessages, JSON.parse(data.message)].slice(-10));
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
        });
    }, []);

    return (
      <TrendingContext.Provider value={{ messages }}>{children}</TrendingContext.Provider>
    );
}

export const useTrending = () => {
    const context = useContext(TrendingContext);
    if (!context) {
        throw new Error("useTrending must be used within a TrendingProvider");
    }
    return context;
};