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
  const wallet = useWallet();
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
    // Swapping SOL to USDC with input 0.1 SOL and 0.5% slippage
    const quote = await fetch(
      "https://quote-api.jup.ag/v6/quote?inputMint=So11111111111111111111111111111111111111112&outputMint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&amount=10000&slippageBps=50"
    );

    const quoteResponse = await quote.json();

    // get serialized transactions for the swap
    const swap = await fetch("https://quote-api.jup.ag/v6/swap", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quoteResponse,
        // user public key to be used for the swap
        userPublicKey: wallet.publicKey?.toString(),
        // auto wrap and unwrap SOL. default is true
        wrapAndUnwrapSol: true,
        // feeAccount is optional. Use if you want to charge a fee.  feeBps must have been passed in /quote API.
        // feeAccount: "fee_account_public_key"
      }),
    });

    const { swapTransaction } = await swap.json();

    try {
      // deserialize the transaction
      const swapTransactionBuf = Buffer.from(swapTransaction, "base64");
      var transaction = VersionedTransaction.deserialize(swapTransactionBuf);

      // @ts-expect-error wallet connection
      const signedTransaction = await wallet.signTransaction(transaction);

      const rawTransaction = signedTransaction.serialize();
      const txid = await connection.sendRawTransaction(rawTransaction, {
        skipPreflight: true,
        maxRetries: 2,
      });

      // get the latest block hash
      const latestBlockHash = await connection.getLatestBlockhash();

      await connection.confirmTransaction(
        {
          blockhash: latestBlockHash.blockhash,
          lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
          signature: txid,
        },
        "confirmed"
      );
      console.log(`https://solscan.io/tx/${txid}`);
    } catch (error) {
      console.error("Error signing or sending the transaction", error);
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
