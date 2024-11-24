import React, { FC, useEffect, useState } from "react";
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
import { wait } from "utils/transactionSender";

export const TrendingView: FC = () => {
  const { messages } = useTrending();
  const { publicKey, signTransaction } = useWallet();
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());
  const [highlightedItems, setHighlightedItems] = useState<Set<number>>(
    new Set()
  );
  const [visibleGraphs, setVisibleGraphs] = useState<{
    [key: number]: boolean;
  }>({});
  const [amounts, setAmounts] = useState<{ [key: number]: number }>({}); // Track the amount for each item
  const [tokenBalances, setTokenBalances] = useState<
    { mint: string; balance: number }[]
  >([]);

  const fetchAllTokenBalances = async (walletAddress: string) => {
    try {
      const response = await fetch("/api/getTokenAccounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch token balances");
      }

      const data = await response.json();
      return data.balances || [];
    } catch (error) {
      console.error("Error fetching token balances:", error);
      return [];
    }
  };

  const toggleGraphVisibility = (index: number) => {
    setVisibleGraphs((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  useEffect(() => {
    if (messages.length > 0) {
      setHighlightedItems(new Set([0])); // Highlight only the first index

      // Remove highlight after 3 seconds
      const timeout = setTimeout(() => {
        setHighlightedItems(new Set()); // Clear the highlight
      }, 3000);

      return () => clearTimeout(timeout); // Cleanup timeout on unmount
    }
  }, [messages]); // Run this effect every time messages are updated

  useEffect(() => {
    const fetchBalances = async () => {
      if (!publicKey) return;

      const balances = await fetchAllTokenBalances(publicKey.toString());
      setTokenBalances(balances);
    };

    fetchBalances();
  }, [publicKey]);

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
    try {
      if (!publicKey || !signTransaction) {
        console.error("Wallet not connected or signTransaction not available");
        return;
      }

      const start = Date.now();
      // const amount = amounts[index] || 0.1; // Get the selected amount for the specific item
      const amount = 0.01; // Get the selected amount for the specific item

      toast.info("Processing...");

      // Extract the address from the Dexscreener URL
      const tokenAddress = dexScreenerUrl.split("/").pop();
      if (!tokenAddress) {
        throw new Error("Invalid Dexscreener URL");
      }

      // console.log(`[Time: ${Date.now() - start}ms] Extracted token address`);

      // Step 2: Get quote
      const quoteStart = Date.now();
      // Step 1: Get the quote from the Jupiter API
      const quoteResponse = await fetch(
        `https://quote-api.jup.ag/v6/quote?inputMint=So11111111111111111111111111111111111111112&outputMint=${tokenAddress}&amount=${
          amount * 1e9
        }&slippageBps=300`
      ).then((res) => res.json());
      // console.log(
      //   `[Time: ${Date.now() - quoteStart}ms] Fetched quote from Jupiter API`
      // );

      // Validate the quote response
      if (
        !quoteResponse ||
        !quoteResponse.inAmount ||
        !quoteResponse.outAmount
      ) {
        throw new Error(
          `Failed to get quote from Jupiter API: ${
            quoteResponse.error || "Invalid response"
          }`
        );
      }

      const serializeStart = Date.now();
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

      // console.log(
      //   `[Time: ${
      //     Date.now() - serializeStart
      //   }ms] Requested serialized transaction`
      // );

      const { success, transaction, blockhashWithExpiryBlockHeight } =
        await getTransactionResponse.json();

      if (!success) {
        throw new Error("Failed to create transaction");
      }

      const signStart = Date.now();
      // Step 3: Client signs the transaction
      const transactionBuffer = Buffer.from(transaction, "base64");
      const transactionUint8Array = new Uint8Array(transactionBuffer);

      // Deserialize the transaction using the converted Uint8Array
      const versionedTransaction = VersionedTransaction.deserialize(
        transactionUint8Array
      );

      // Sign the transaction with the connected wallet
      const signedTransaction = await signTransaction(versionedTransaction);
      console.log(`[Time: ${Date.now() - signStart}ms] Signed transaction`);

      const sendStart = Date.now();
      // Step 4: Send the signed transaction to the backend for submission and confirmation
      const submitTransactionResponse = await fetch("/api/sendTransaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          signedTransaction: Buffer.from(
            signedTransaction.serialize()
          ).toString("base64"),
          blockhashWithExpiryBlockHeight,
        }),
      });
      // console.log(
      //   `[Time: ${Date.now() - sendStart}ms] Sent transaction to backend`
      // );

      const submitResponse = await submitTransactionResponse.json();

      if (!submitResponse.success) {
        throw new Error(
          submitResponse.error || "Failed to submit and confirm transaction"
        );
      }

      const txid = submitResponse.txid;

      toast.success("Transaction successful!");
      // console.log(`Transaction successful: https://solscan.io/tx/${txid}`);
      // console.log(
      //   `[Total Time: ${Date.now() - start}ms] Transaction completed`
      // );

      // Re-fetch balances after successful transaction
      // const balanceStart = Date.now();

      await wait(1_000);

      const updatedBalances = await fetchAllTokenBalances(publicKey.toString());
      setTokenBalances(updatedBalances);
      // console.log(`[Time: ${Date.now() - balanceStart}ms] Re-fetched balances`);
    } catch (error) {
      console.error("Error during the swap process:", error);
      toast.error("Transaction failed!");
    }
  };

  const sellToken = async (tokenMint: string, amount: number) => {
    try {
      if (!publicKey || !signTransaction) {
        console.error("Wallet not connected or signTransaction not available");
        return;
      }

      toast.info("Processing...");

      const truncatedAmount = parseFloat(amount.toFixed(6));

      // Step 1: Get the quote from the Jupiter API
      const quoteResponse = await fetch(
        `https://quote-api.jup.ag/v6/quote?inputMint=${tokenMint}&outputMint=So11111111111111111111111111111111111111112&amount=${
          truncatedAmount * 1e6
        }&slippageBps=800`
      ).then((res) => res.json());

      // Validate the quote response
      if (
        !quoteResponse ||
        !quoteResponse.inAmount ||
        !quoteResponse.outAmount
      ) {
        throw new Error(
          `Failed to get quote from Jupiter API: ${
            quoteResponse.error || "Invalid response"
          }`
        );
      }

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

      const { success, transaction, blockhashWithExpiryBlockHeight } =
        await getTransactionResponse.json();

      if (!success || !transaction || !blockhashWithExpiryBlockHeight) {
        throw new Error("Failed to create sell transaction");
      }

      // Step 3: Client signs the transaction
      const transactionBuffer = Buffer.from(transaction, "base64");
      const transactionUint8Array = new Uint8Array(transactionBuffer);

      const versionedTransaction = VersionedTransaction.deserialize(
        transactionUint8Array
      );

      const signedTransaction = await signTransaction(versionedTransaction);

      // Step 4: Send the signed transaction back to the server for submission and confirmation
      const submitTransactionResponse = await fetch("/api/sendTransaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          signedTransaction: Buffer.from(
            signedTransaction.serialize()
          ).toString("base64"),
          blockhashWithExpiryBlockHeight,
        }),
      });

      const submitResponse = await submitTransactionResponse.json();

      if (!submitResponse.success || !submitResponse.txid) {
        throw new Error(
          submitResponse.error || "Failed to submit and confirm transaction"
        );
      }

      const txid = submitResponse.txid;

      toast.success("Sell transaction successful!");
      // console.log(`Sell transaction successful: https://solscan.io/tx/${txid}`);

      await wait(1_000);

      // Re-fetch balances after successful sell transaction
      const updatedBalances = await fetchAllTokenBalances(publicKey.toString());
      setTokenBalances(updatedBalances);
    } catch (error) {
      console.error("Error during the sell process:", error);
      toast.error("Sell transaction failed!");
    }
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
      <p className="text-center fs-6 fw-bold my-2">TRENDING MEMECOINS</p>
      <ul className={styles.messageList}>
        {messages.slice().map((message, index) => {
          const { url, token, telegram, tokenAddress } = extractInfo(
            message.text
          );
          const scores = message.scores;
          const selectedAmount = amounts[index] || 0.1; // Default amount for each item
          const balanceInfo = tokenBalances.find(
            (b) => b.mint === tokenAddress
          ); // Match balance with tokenAddress
          const balance = balanceInfo?.balance || 0;
          return (
            <li
              key={index}
              className={`${styles.messageItem} flex flex-col ${
                highlightedItems.has(index) ? styles["flash"] : ""
              }`}
            >
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
                  {/* MarketCap, CreatedAt, and 1h Volume */}
                  <p>
                    <strong>Market Cap:</strong> ${message.marketCap || "N/A"}
                  </p>
                  <p>
                    <strong>Created At:</strong> {message.createdAt || "N/A"}
                  </p>
                  <p>
                    <strong>1H Volume:</strong> ${message.volume1h || "N/A"}
                  </p>
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

              {/* Display Token Balance */}
              {balance > 0 && (
                <div
                  className="absolute bottom-0 left-0 bg-[#ffeb99] text-black font-bold py-1 px-3 rounded-tr-lg shadow-lg text-sm"
                  style={{ zIndex: 10 }}
                >
                  Balance: {balance} {token}
                </div>
              )}

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
                  className={`${styles["copyBlinkButton"]}`}
                  onClick={() => {
                    navigator.clipboard.writeText(message.blink_url);
                    toast.success("Blink URL copied!");
                  }}
                >
                  B L I N K
                </button>

                {/* Buy Token Button and Amount Selection */}
                <div className="flex items-center justify-center gap-4 mt-3">
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
                    className="bg-gradient-to-r from-[#fff7c0] to-[#ffeb99] text-[10px] sm:text-[12px] text-black font-semibold py-1 px-2 rounded-lg shadow-md hover:shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105 sm:w-[150px] sm:h-[40px] w-[120px] h-[40px]"
                    onClick={() => {
                      if (url) {
                        quoteAndSwap(index, url);
                      }
                    }}
                  >
                    Buy {selectedAmount} SOL {token}
                  </button>
                </div>

                {/* Sell Token Buttons */}
                {balance > 0 && tokenAddress && (
                  <div className="flex items-center justify-center gap-4 mt-3">
                    <button
                      className="bg-gradient-to-r from-[#fff7c0] to-[#ffeb99] text-[10px] sm:text-[12px] text-black font-semibold py-1 px-2 rounded-lg shadow-md hover:shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105 sm:w-[100px] sm:h-[30px] w-[120px] h-[40px]"
                      onClick={() => sellToken(tokenAddress, balance / 2)}
                    >
                      Sell Half
                    </button>
                    <button
                      className="bg-gradient-to-r from-[#fff7c0] to-[#ffeb99] text-[10px] sm:text-[12px] text-black font-semibold py-1 px-2 rounded-lg shadow-md hover:shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105 sm:w-[100px] sm:h-[30px] w-[120px] h-[40px]"
                      onClick={() => sellToken(tokenAddress, balance)}
                    >
                      Sell All
                    </button>
                  </div>
                )}
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
