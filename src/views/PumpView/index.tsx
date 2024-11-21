import React, { FC, useEffect, useState } from "react";
import styles from "./index.module.css";
import Link from "next/link";
import Image from "next/image";
import { usePumpfun } from "../../contexts/PumpfunContext";
import { toast } from "react-toastify";

export const PumpView: FC = () => {
  const { messages } = usePumpfun();
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());
  const [highlightedItems, setHighlightedItems] = useState<Set<number>>(
    new Set()
  );

  const handleImageError = (index: number, uri: string) => {
    console.log("failed uri", uri);
    setFailedImages((prev) => new Set(prev).add(index));
  };

  useEffect(() => {
    if (messages.length > 0) {
      const newItemIndex = messages.length - 1;
      setHighlightedItems((prev) => new Set(prev).add(newItemIndex));

      // Remove highlight after 3 seconds
      const timeout = setTimeout(() => {
        setHighlightedItems((prev) => {
          const updated = new Set(prev);
          updated.delete(newItemIndex);
          return updated;
        });
      }, 3000);

      return () => clearTimeout(timeout); // Cleanup timeout on unmount
    }
  }, [messages]);

  return (
    <div className={styles.container}>
      <p className="text-center fs-6 fw-bold my-2">
        PUMP.FUN BONDING COMPLETIONS
      </p>
      <ul className={styles.messageList}>
        {messages.map((message, index) => (
          <li
            key={index}
            className={`${styles.messageItem} flex flex-col ${
              highlightedItems.has(index) ? styles["flash"] : ""
            }`}
          >
            <div className="flex w-full mb-1 items-center gap-4">
              <div className="flex-1 pr-1 break-all">
                <div className={styles["messageDate"]}>
                  {new Date(message.createdTimestamp).toLocaleString()}
                </div>
                <p>
                  <strong>Name:</strong> {message.name}
                </p>
                <p>
                  <strong>Symbol:</strong> {message.symbol}
                </p>
                <p>
                  <strong>Market Cap:</strong> $
                  {message.marketCap.toLocaleString()}
                </p>
                {message.twitter !== "N/A" && (
                  <p>
                    <strong>Twitter:</strong>{" "}
                    <Link href={message.twitter} target="_blank">
                      {message.twitter}
                    </Link>
                  </p>
                )}
                {message.telegram !== "N/A" && (
                  <p>
                    <strong>Telegram:</strong>{" "}
                    <Link href={message.telegram} target="_blank">
                      {message.telegram}
                    </Link>
                  </p>
                )}
                {message.website !== "N/A" && (
                  <p>
                    <strong>Website:</strong>{" "}
                    <Link href={message.website} target="_blank">
                      {message.website}
                    </Link>
                  </p>
                )}
                {message.pumpUrl !== "N/A" && (
                  <p>
                    <strong>PumpFun:</strong>{" "}
                    <Link href={message.pumpUrl} target="_blank">
                      {message.pumpUrl}
                    </Link>
                  </p>
                )}
                {message.dexUrl !== "N/A" && (
                  <p>
                    <strong>Dexscreener:</strong>{" "}
                    <Link href={message.dexUrl} target="_blank">
                      {message.dexUrl}
                    </Link>
                  </p>
                )}
              </div>

              <div className={styles["imageContainer"]}>
                {!failedImages.has(index) && (
                  <Image
                    className={styles["image"]}
                    src={message.imageUri}
                    width={150}
                    height={150}
                    alt="Logo"
                    onError={() => handleImageError(index, message.imageUri)}
                  />
                )}
              </div>
            </div>
            {/* Copy Blink URL Button */}
            {message.blink_url && (
              <button
                className={`${styles["copyBlinkButton"]}`}
                onClick={() => {
                  navigator.clipboard.writeText(message.blink_url);
                  toast.success("Blink URL copied!");
                }}
              >
                B L I N K
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
