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
import { useWallet } from "@solana/wallet-adapter-react";
import { VersionedTransaction } from "@solana/web3.js";
import { toast } from "react-toastify";
import Image from "next/image";

export const TrendingView: FC = () => {
  const { messages } = useTrending();
  const { publicKey, signTransaction } = useWallet();
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());

  const [visibleGraphs, setVisibleGraphs] = useState<{
    [key: number]: boolean;
  }>({});
  const [amounts, setAmounts] = useState<{ [key: number]: number }>({}); // Track the amount for each item

  const toggleGraphVisibility = (index: number) => {
    setVisibleGraphs((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const handleImageError = (index: number) => {
    setFailedImages((prev) => new Set(prev).add(index));
  };

  const handlePredefinedAmountChange = (index: number, amount: number) => {
    setAmounts((prevState) => ({
      ...prevState,
      [index]: amount, // Update amount for the specific item
    }));
  };

  const handleCustomAmountChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseFloat(event.target.value);
    if (!isNaN(value)) {
      setAmounts((prevState) => ({
        ...prevState,
        [index]: value, // Update custom amount for the specific item
      }));
    }
  };

  const quoteAndSwap = async (index: number, dexScreenerUrl: string) => {
    toast.info("Swapping will be available soon...");
    return;

    // try {
    //   if (!publicKey || !signTransaction) {
    //     console.error("Wallet not connected or signTransaction not available");
    //     return;
    //   }

    //   const amount = amounts[index] || 0.1; // Get the selected amount for the specific item

    //   toast.info("Transaction is being processed...");

    //   // Extract the address from the Dexscreener URL
    //   const tokenAddress = dexScreenerUrl.split("/").pop();
    //   if (!tokenAddress) {
    //     throw new Error("Invalid Dexscreener URL");
    //   }

    //   // Step 1: Get the quote from the Jupiter API
    //   const quoteResponse = await fetch(
    //     `https://quote-api.jup.ag/v6/quote?inputMint=So11111111111111111111111111111111111111112&outputMint=${tokenAddress}&amount=${
    //       amount * 1e9
    //     }&slippageBps=300`
    //   ).then((res) => res.json());

    //   // Step 2: Request serialized transaction from the backend
    //   const getTransactionResponse = await fetch(
    //     "/api/getSerializedTransaction",
    //     {
    //       method: "POST",
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify({
    //         quoteResponse,
    //         userPublicKey: publicKey?.toString(),
    //       }),
    //     }
    //   );

    //   const { success, transaction } = await getTransactionResponse.json();

    //   if (!success) {
    //     throw new Error("Failed to create transaction");
    //   }

    //   // Step 3: Client signs the transaction
    //   const transactionBuffer = Buffer.from(transaction, "base64");
    //   const transactionUint8Array = new Uint8Array(transactionBuffer);

    //   // Deserialize the transaction using the converted Uint8Array
    //   const versionedTransaction = VersionedTransaction.deserialize(
    //     transactionUint8Array
    //   );

    //   // Sign the transaction with the connected wallet
    //   const signedTransaction = await signTransaction(versionedTransaction);

    //   // Step 4: Send the signed transaction back to the server for submission
    //   const submitTransactionResponse = await fetch("/api/sendTransaction", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({
    //       signedTransaction: Buffer.from(
    //         signedTransaction.serialize()
    //       ).toString("base64"),
    //     }),
    //   });
    //   // Handle the submission response
    //   let txid;
    //   try {
    //     const submitResponse = await submitTransactionResponse.json();
    //     txid = submitResponse.txid;

    //     if (!txid) {
    //       throw new Error("Failed to submit transaction");
    //     }
    //   } catch (parseError) {
    //     console.error("Failed to parse response as JSON:", parseError);
    //     const textResponse = await submitTransactionResponse.text();
    //     console.error("Raw response:", textResponse);
    //     throw new Error(
    //       "Failed to submit transaction due to invalid response format."
    //     );
    //   }

    //   // Step 5: Request the backend to confirm the transaction
    //   const confirmTransactionResponse = await fetch(
    //     "/api/confirmTransaction",
    //     {
    //       method: "POST",
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify({
    //         txid,
    //       }),
    //     }
    //   );

    //   // Handle the confirmation response
    //   try {
    //     const { success } = await confirmTransactionResponse.json();

    //     if (success) {
    //       toast.success("Transaction successful!");
    //       console.log(`Transaction successful: https://solscan.io/tx/${txid}`);
    //     } else {
    //       throw new Error("Transaction confirmation failed.");
    //     }
    //   } catch (parseError) {
    //     console.error(
    //       "Failed to parse confirmation response as JSON:",
    //       parseError
    //     );
    //     const textResponse = await confirmTransactionResponse.text();
    //     console.error("Raw confirmation response:", textResponse);
    //     throw new Error(
    //       "Failed to confirm transaction due to invalid response format."
    //     );
    //   }
    // } catch (error) {
    //   console.error("Error during the swap process:", error);
    //   toast.error("Transaction failed!");
    // }
  };

  const extractInfo = (text: string) => {
    const urlMatch = text.match(/(https?:\/\/[^\s)]+)/); // Updated regex to exclude the trailing ')'
    const tokenMatch = text.match(/[$#][A-Z]+/);
    const telegramMatch = text.match(/(t\.me\/\+[\w\d]+|@[A-Za-z\d_]+)/);

    // Extract token address from the URL if it matches the expected format
    let tokenAddress = null;
    if (urlMatch && urlMatch[0].includes("dexscreener.com")) {
      const urlParts = urlMatch[0].split("/");
      tokenAddress = urlParts[urlParts.length - 1]; // Get the last part of the URL
    }

    return {
      url: urlMatch ? urlMatch[0] : null,
      token: tokenMatch ? tokenMatch[0] : null,
      telegram: telegramMatch ? telegramMatch[0] : null,
      tokenAddress: tokenAddress,
    };
  };

  return (
    <div className={styles.container}>
      <ul className={styles.messageList}>
        {messages.slice().map((message, index) => {
          const { url, token, telegram, tokenAddress } = extractInfo(
            message.text
          );
          const scores = message.scores;
          const selectedAmount = amounts[index] || 0.1; // Default amount for each item
          return (
            <li key={index} className={`${styles.messageItem} flex flex-col`}>
              <div className="flex w-full mb-1 items-center gap-4">
                <div className="flex-1 pr-1 break-all">
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
                        <strong>Risks:</strong>{" "}
                        {message.rugcheck.risks.join(", ")}
                      </p>
                      <p>
                        <strong>Total LP Providers:</strong>{" "}
                        {message.rugcheck.totalLPProviders}
                      </p>
                      <p>
                        <strong>Total Market Liquidity:</strong>{" "}
                        {formatLargeNumber(
                          message.rugcheck.totalMarketLiquidity
                        )}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex-none w-28 h-28 flex justify-center items-center mt-3">
                  {!failedImages.has(index) && (
                    <Image
                      className="rounded-lg"
                      src={`https://dd.dexscreener.com/ds-data/tokens/solana/${tokenAddress}.png?size=xl`}
                      width={150}
                      height={150}
                      alt="Logo"
                      onError={() => handleImageError(index)}
                    />
                  )}
                </div>
              </div>

              {/* Bottom Actions - Show Sentiments and Buy Button */}
              <div className="w-full">
                <div className={styles.toggleButtonContainer}>
                  <button
                    className={styles.toggleButton}
                    onClick={() => toggleGraphVisibility(index)}
                  >
                    {visibleGraphs[index]
                      ? "Hide Sentiments"
                      : "Show Sentiments"}
                  </button>
                </div>
                {visibleGraphs[index] && (
                  <div className={styles.graphContainer}>
                    <GraphComponent scores={scores} startDate={message.date} />
                  </div>
                )}

                {/* Copy Blink URL Button */}
                <button
                  disabled={true}
                  className={`${styles["copyBlinkButton"]}`}
                  onClick={() => {
                    navigator.clipboard.writeText(message.blink_url);
                    toast.success("Blink URL copied!");
                  }}
                >
                  B L I N K
                </button>

                {/* Buy Token Button and Amount Selection */}
                <div className="flex items-center justify-center gap-10 mt-3">
                  {/* Predefined Amount Buttons */}
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        className="bg-gray-300 py-1 px-2 w-12 rounded shadow"
                        onClick={() => handlePredefinedAmountChange(index, 0.1)}
                      >
                        0.1
                      </button>
                      <button
                        className="bg-gray-300 py-1 px-2 w-12 rounded shadow"
                        onClick={() => handlePredefinedAmountChange(index, 0.5)}
                      >
                        0.5
                      </button>
                      <button
                        className="bg-gray-300 py-1 px-2 w-12 rounded shadow"
                        onClick={() => handlePredefinedAmountChange(index, 1)}
                      >
                        1
                      </button>
                    </div>
                    {/* Custom Amount Input */}
                    <input
                      type="number"
                      min="0.1"
                      step="0.1"
                      value={selectedAmount}
                      onChange={(e) => handleCustomAmountChange(index, e)}
                      className="bg-gray-200 py-1 px-2 border-2 border-gray-300 rounded shadow text-center w-40"
                      placeholder="Custom"
                    />
                  </div>

                  {/* Buy Button */}
                  <button
                    disabled={true}
                    className="bg-gradient-to-r from-[#fff7c0] to-[#ffeb99] text-[10px] sm:text-[12px] text-black font-semibold py-1 px-2 rounded-lg shadow-md hover:shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105 cursor-not-allowed sm:w-[150px] sm:h-[50px] w-[120px] h-[40px]"
                    onClick={() => {
                      if (url) {
                        quoteAndSwap(index, url);
                      }
                    }}
                  >
                    Buy {selectedAmount} SOL {token}
                  </button>
                </div>
              </div>
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
