import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import Pusher from "pusher-js";
import { TelegramMessage } from "../types";

const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
});

interface TrendingContextProps {
  messages: TelegramMessage[];
}

const TrendingContext = createContext<TrendingContextProps | undefined>(
  undefined
);

export function TrendingProvider({ children }: PropsWithChildren) {
  const [messages, setMessages] = useState<TelegramMessage[]>([]);
  const [refetch, setRefetch] = useState(false);

  const fetchMessages = () => {
    fetch("/api/getLatestTrending")
      .then((res) => res.json())
      .then((data: string[]) => {
        setMessages(data.map((m: string) => JSON.parse(m)));
      });
  };

  useEffect(() => {
    fetchMessages();

    const channel = pusher.subscribe("my-channel");

    channel.bind("my-event", (data: { message: string }) => {
      setRefetch((prev) => !prev); // Toggle reFetch state
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
    fetchMessages();
  }, [refetch]);

  return (
    <TrendingContext.Provider value={{ messages }}>
      {children}
    </TrendingContext.Provider>
  );
}

export const useTrending = () => {
  const context = useContext(TrendingContext);
  if (!context) {
    throw new Error("useTrending must be used within a TrendingProvider");
  }
  return context;
};
