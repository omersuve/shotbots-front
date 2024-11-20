import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import Pusher from "pusher-js";
import { PumpTokenData } from "../types";

const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
});

interface PumpfunContextProps {
  messages: PumpTokenData[];
}

const PumpfunContext = createContext<PumpfunContextProps | undefined>(
  undefined
);

export function PumpfunProvider({ children }: PropsWithChildren) {
  const [messages, setMessages] = useState<PumpTokenData[]>([]);
  const [refetch, setRefetch] = useState(false);

  const fetchMessages = () => {
    fetch("/api/getLatestPump")
      .then((res) => res.json())
      .then((data: string[]) => {
        setMessages(data.map((m: string) => JSON.parse(m)));
      });
  };

  useEffect(() => {
    fetchMessages();

    const channel = pusher.subscribe("pump-channel");

    channel.bind("pump-event", (data: { message: string }) => {
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
    <PumpfunContext.Provider value={{ messages }}>
      {children}
    </PumpfunContext.Provider>
  );
}

export const usePumpfun = () => {
  const context = useContext(PumpfunContext);
  if (!context) {
    throw new Error("usePumpfun must be used within a PumpfunProvider");
  }
  return context;
};
