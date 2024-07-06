import React, { useEffect, useState } from "react";
import { useSocket } from "../contexts/SocketContext";

interface Message {
    group: string;
    sender: number;
    text: string;
    date: string;
}

const Home: React.FC = () => {
    const socketContext = useSocket();
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        if (socketContext.socket) {
            socketContext.socket.on("new_message", (message: string) => {
                const msg = JSON.parse(message);
                console.log(`Message: ${message}`);
                setMessages((prevMessages) => [...prevMessages, msg]);
            });
        }
        return () => {
            if (!socketContext.socket) return;
            socketContext.socket.disconnect();
            socketContext.socket = undefined;
        };
    }, [socketContext.socket]);

    return (
      <div>
          <h1>Telegram Messages</h1>
          <ul>
              {messages.map((message, index) => (
                <li key={index}>
                    <p><strong>Group:</strong> {message.group}</p>
                    <p><strong>Sender:</strong> {message.sender}</p>
                    <p><strong>Text:</strong> {message.text}</p>
                    <p><strong>Date:</strong> {message.date}</p>
                </li>
              ))}
          </ul>
      </div>
    );
};

export default Home;
