import React, { createContext, useState, useEffect, ReactNode, useContext, FC } from "react";
import io from "socket.io-client";

interface Message {
    group: string;
    sender: number;
    text: string;
    date: string;
}

interface WebSocketContextProps {
    messages: Message[];
}

interface WebSocketProviderProps {
    children: ReactNode;
}

const WebSocketContext = createContext<WebSocketContextProps | undefined>(undefined);

export const WebSocketProvider: FC<WebSocketProviderProps> = ({ children }) => {
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        const socket = io(process.env.BASE_URL_PROD || "http://localhost:3000", {
            path: "/api/socket",
        });

        socket.on("connect", () => {
            console.log("Connected to WebSocket");
        });

        socket.on("connect_error", (error) => {
            console.error("Connection Error:", error);
        });

        socket.on("disconnect", () => {
            console.log("Disconnected from WebSocket");
        });

        socket.on("new_message", (message: Message) => {
            console.log("socket get message:", message);
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
      <WebSocketContext.Provider value={{ messages }}>
          {children}
      </WebSocketContext.Provider>
    );
};

export const useNewPairs = () => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error("useNewPairs must be used within a WebSocketProvider");
    }
    return context;
};
