import React, { createContext, useContext, useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import nacl from "tweetnacl";

interface WalletAuthContextProps {
  isVerified: boolean;
  isSigned: boolean;
  requestSignature: () => Promise<boolean>;
}

const WalletAuthContext = createContext<WalletAuthContextProps>({
  isVerified: false,
  isSigned: false,
  requestSignature: async () => false,
});

export const useWalletAuth = () => useContext(WalletAuthContext);

export const WalletAuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { publicKey, signMessage, connected, disconnecting } = useWallet();
  const [isVerified, setIsVerified] = useState(false);
  const [isSigned, setIsSigned] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const lastWallet = localStorage.getItem("lastConnectedWallet");
    return Boolean(lastWallet);
  });
  const [requestingSignature, setRequestingSignature] = useState(false);

  // Initialize isSigned based on localStorage after mount
  useEffect(() => {
    const lastWallet = localStorage.getItem("lastConnectedWallet");
    const walletSignature = localStorage.getItem("walletSignature");

    if (lastWallet && walletSignature && publicKey?.toBase58() === lastWallet) {
      console.log("Restoring signed state from localStorage.");
      setIsSigned(true);
    } else {
      setIsSigned(false);
    }
  }, [publicKey]);

  const requestSignature = async (): Promise<boolean> => {
    if (!publicKey || !signMessage || isSigned || requestingSignature) {
      console.error(
        "Wallet not connected, signMessage not supported, or already signed"
      );
      return false;
    }

    setRequestingSignature(true);

    try {
      const message = "Please sign this message to verify ownership.";
      const encodedMessage = new TextEncoder().encode(message);
      const signature = await signMessage(encodedMessage);

      const verified = nacl.sign.detached.verify(
        encodedMessage,
        signature,
        publicKey.toBytes()
      );

      if (verified) {
        console.log("Signature verified successfully!");
        setIsVerified(true);
        setIsSigned(true);
        localStorage.setItem(
          "walletSignature",
          JSON.stringify(Array.from(signature))
        );
        localStorage.setItem("lastConnectedWallet", publicKey.toBase58());
        return true;
      } else {
        console.error("Signature verification failed.");
        return false;
      }
    } catch (error) {
      console.error("Error during signing:", error);
      return false;
    } finally {
      setRequestingSignature(false);
    }
  };

  // Track page refresh using localStorage timestamp
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem("isPageRefreshed", Date.now().toString());
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        localStorage.setItem("isPageRefreshed", Date.now().toString());
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Handle wallet disconnection or explicit disconnect
  useEffect(() => {
    const isPageRefreshed =
      Date.now() - parseInt(localStorage.getItem("isPageRefreshed") || "0") <
      5000;

    if (!connected && !disconnecting && !isPageRefreshed) {
      console.log("User explicitly disconnected the wallet.");
      setIsSigned(false);
      setIsVerified(false);
      localStorage.removeItem("walletSignature");
      localStorage.removeItem("lastConnectedWallet");
    }

    // Reset the flag after checking
    localStorage.removeItem("isPageRefreshed");
  }, [connected, disconnecting]);

  useEffect(() => {
    const lastWallet =
      typeof window !== "undefined"
        ? localStorage.getItem("lastConnectedWallet")
        : null;
    const isPageRefreshed =
      Date.now() - parseInt(localStorage.getItem("isPageRefreshed") || "0") <
      5000;

    if (connected && publicKey?.toBase58() !== lastWallet && !isPageRefreshed) {
      console.log(
        "Wallet switched. Resetting localStorage and asking for signature."
      );
      setIsSigned(false);
      setIsVerified(false);
      localStorage.removeItem("walletSignature");
      localStorage.removeItem("lastConnectedWallet");
    }
  }, [publicKey, connected]);

  return (
    <WalletAuthContext.Provider
      value={{ isVerified, isSigned, requestSignature }}
    >
      {children}
    </WalletAuthContext.Provider>
  );
};

export default WalletAuthProvider;
