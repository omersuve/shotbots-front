import React, { FC, useState } from "react";
import styles from "./index.module.css";
import { useTrending } from "../../contexts/TrendingContext";
import Link from "next/link";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { formatLargeNumber } from "../../utils/formatting";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { VersionedTransaction } from "@solana/web3.js";

export const TrendingView: FC = () => {
  const { messages } = useTrending();
  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();

  const [visibleGraphs, setVisibleGraphs] = useState<{
    [key: number]: boolean;
  }>({});

  const toggleGraphVisibility = (index: number) => {
    setVisibleGraphs((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const quoteAndSwap = async () => {
    try {
      if (!publicKey || !signTransaction) {
        console.error("Wallet not connected or signTransaction not available");
        return;
      }

      // Step 1: Get the quote from the Jupiter API
      const quoteResponse = await fetch(
        "https://quote-api.jup.ag/v6/quote?inputMint=So11111111111111111111111111111111111111112&outputMint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&amount=10000&slippageBps=50"
      ).then((res) => res.json());

      // Step 2: Request serialized transaction from the backend
      const getTransactionResponse = await fetch(
        "/api/getSerializedTransaction",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quoteResponse,
            userPublicKey: publicKey?.toString(),
          }),
        }
      );

      const { success, transaction } = await getTransactionResponse.json();

      if (!success) {
        throw new Error("Failed to create transaction");
      }

      // Step 3: Client signs the transaction
      const transactionBuffer = Buffer.from(transaction, "base64");
      const versionedTransaction =
        VersionedTransaction.deserialize(transactionBuffer);

      // Sign the transaction with the connected wallet
      const signedTransaction = await signTransaction(versionedTransaction);

      // Step 4: Send the signed transaction back to the server for submission
      const submitTransactionResponse = await fetch(
        "/api/submitSignedTransaction",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            signedTransaction: Buffer.from(
              signedTransaction.serialize()
            ).toString("base64"),
          }),
        }
      );

      const { txid } = await submitTransactionResponse.json();

      console.log(`Transaction successful: https://solscan.io/tx/${txid}`);
    } catch (error) {
      console.error("Error during the swap process:", error);
    }
  };

  const extractInfo = (text: string) => {
    const urlMatch = text.match(/(https?:\/\/[^\s)]+)/); // Updated regex to exclude the trailing ')'
    const tokenMatch = text.match(/[$#][A-Z]+/);
    const telegramMatch = text.match(/(t\.me\/\+[\w\d]+|@[A-Za-z\d_]+)/);

    return {
      url: urlMatch ? urlMatch[0] : null,
      token: tokenMatch ? tokenMatch[0] : null,
      telegram: telegramMatch ? telegramMatch[0] : null,
    };
  };

  return (
    <div className={styles.container}>
      <ul className={styles.messageList}>
        {messages.slice().map((message, index) => {
          const { url, token, telegram } = extractInfo(message.text);
          const scores = message.scores; // Example scores, replace with real scores
          return (
            <li key={index} className={styles.messageItem}>
              <div className={styles.messageDate}>
                {new Date(message.date).toLocaleString()}
              </div>
              {token && (
                <p>
                  <strong>Token:</strong> {token}
                </p>
              )}
              {telegram && (
                <p>
                  <strong>Telegram:</strong>{" "}
                  <Link
                    href={`https://${
                      telegram.startsWith("@")
                        ? `t.me/${telegram.slice(1)}`
                        : telegram
                    }`}
                    target="_blank"
                  >
                    {telegram}
                  </Link>
                </p>
              )}
              {url && (
                <p>
                  <strong>Dexscreener:</strong>{" "}
                  <Link href={url} target="_blank">
                    {url}
                  </Link>
                </p>
              )}
              {message.rugcheck && (
                <div className={styles.rugcheck}>
                  <p>
                    <strong>Risks:</strong> {message.rugcheck.risks.join(", ")}
                  </p>
                  <p>
                    <strong>Total LP Providers:</strong>{" "}
                    {message.rugcheck.totalLPProviders}
                  </p>
                  <p>
                    <strong>Total Market Liquidity:</strong>{" "}
                    {formatLargeNumber(message.rugcheck.totalMarketLiquidity)}
                  </p>
                </div>
              )}
              <div className={styles.toggleButtonContainer}>
                <button
                  className={styles.toggleButton}
                  onClick={() => toggleGraphVisibility(index)}
                >
                  {visibleGraphs[index] ? "Hide Sentiments" : "Show Sentiments"}
                </button>
              </div>
              {visibleGraphs[index] && (
                <div className={styles.graphContainer}>
                  <GraphComponent scores={scores} startDate={message.date} />
                </div>
              )}
              <button className="bg-yellow-200" onClick={quoteAndSwap}>
                Buy Token
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type GraphComponentProps = {
  scores: (number | null)[];
  startDate: string;
};

const GraphComponent: FC<GraphComponentProps> = ({ scores, startDate }) => {
  const labels = scores.map((_, index) => {
    const date = new Date(startDate);
    date.setMinutes(date.getMinutes() + index * 30);
    return date;
  });

  const data = {
    labels,
    datasets: [
      {
        label: "Scores",
        data: scores,
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        pointRadius: 6, // Adjust point radius here
        pointHoverRadius: 8, // Adjust hover point radius here
      },
    ],
  };

  const options = {
    scales: {
      x: {
        ticks: {
          padding: 10,
          font: {
            size: 10,
          },
          callback: function (value: any, index: number) {
            const date = labels[index];
            const formattedDate = date.toLocaleDateString();
            const formattedTime = date.toLocaleTimeString();
            return `${formattedDate}\n${formattedTime}`;
          },
        },
      },
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `Score: ${context.parsed.y}`;
          },
        },
      },
    },
    maintainAspectRatio: false, // Allows for flexible resizing
  };

  return (
    <div style={{ height: "200px" }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default GraphComponent;
