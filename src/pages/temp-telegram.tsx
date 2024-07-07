import React from "react";
import { useTrending } from "../contexts/TrendingContext";


const Home: React.FC = () => {
    const { messages } = useTrending();

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
