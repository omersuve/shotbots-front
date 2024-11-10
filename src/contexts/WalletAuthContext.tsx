import React, { createContext, useContext, useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import nacl from "tweetnacl";

interface WalletAuthContextProps {
  isVerified: boolean;
  isSigned: boolean;
  requestSignature: () => Promise<void>;
}

const WalletAuthContext = createContext<WalletAuthContextProps>({
  isVerified: false,
  isSigned: false,
  requestSignature: async () => {},
});

export const useWalletAuth = () => useContext(WalletAuthContext);

export const WalletAuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { publicKey, signMessage, connected, disconnecting } = useWallet();
  const [isVerified, setIsVerified] = useState(false);
  // Initialize isSigned state from localStorage
  const [isSigned, setIsSigned] = useState<boolean>(() => {
    const lastWallet =
      typeof window !== "undefined" &&
      localStorage.getItem("lastConnectedWallet");
    return Boolean(lastWallet);
  });

  // Initialize isSigned based on localStorage after mount
  useEffect(() => {
    const lastWallet = localStorage.getItem("lastConnectedWallet");
    if (lastWallet) {
      setIsSigned(true);
    }
  }, []);

  const requestSignature = async () => {
    if (!publicKey || !signMessage || isSigned) {
      console.error(
        "Wallet not connected, signMessage not supported, or already signed"
      );
      return;
    }

    try {
      const message = "Please sign this message to verify ownership.";
      const encodedMessage = new TextEncoder().encode(message);
      const signature = await signMessage(encodedMessage);

      const verified = nacl.sign.detached.verify(
        encodedMessage,
        signature,
        publicKey.toBytes()
      );

      if (verified && typeof window !== "undefined") {
        console.log("Signature verified successfully!");
        setIsVerified(true);
        setIsSigned(true);
        localStorage.setItem(
          "walletSignature",
          JSON.stringify(Array.from(signature))
        );
        localStorage.setItem("lastConnectedWallet", publicKey.toBase58());
      } else {
        console.error("Signature verification failed.");
      }
    } catch (error) {
      console.error("Error during signing:", error);
    }
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        sessionStorage.setItem("isPageRefreshed", "true");
      } else if (document.visibilityState === "visible") {
        sessionStorage.removeItem("isPageRefreshed");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const isPageRefreshed = sessionStorage.getItem("isPageRefreshed");

    if (!connected && !disconnecting && !isPageRefreshed) {
      console.log("User explicitly disconnected the wallet.");
      setIsSigned(false);
      setIsVerified(false);
      localStorage.removeItem("walletSignature");
      localStorage.removeItem("lastConnectedWallet");
    }
  }, [connected, disconnecting]);

  return (
    <WalletAuthContext.Provider
      value={{ isVerified, isSigned, requestSignature }}
    >
      {children}
    </WalletAuthContext.Provider>
  );
};
