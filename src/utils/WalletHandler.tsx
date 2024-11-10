import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { setWalletCookie, removeWalletCookie } from "../utils";
import { useRouter } from "next/router";
import { useWalletAuth } from "../contexts/WalletAuthContext";

const WalletHandler = () => {
  const { publicKey, connected, disconnecting } = useWallet();
  const { isSigned, requestSignature } = useWalletAuth();
  const router = useRouter();
  const [previousWallet, setPreviousWallet] = useState<string | null>(null);

  useEffect(() => {
    const handleWalletChange = async () => {
      const lastWallet = localStorage.getItem("lastConnectedWallet");

      if (connected && publicKey) {
        if (!isSigned && publicKey.toBase58() !== lastWallet) {
          const userSigned = await requestSignature();

          if (userSigned) {
            await setWalletCookie(publicKey.toBase58());
            setPreviousWallet(publicKey.toBase58());
          } else {
            console.log(
              "User did not sign the message. Ignoring wallet switch."
            );
            if (previousWallet) {
              localStorage.setItem("lastConnectedWallet", previousWallet);
            } else {
              await removeWalletCookie();
              localStorage.removeItem("lastConnectedWallet");
            }
          }
        } else if (isSigned) {
          await setWalletCookie(publicKey.toBase58());
          setPreviousWallet(publicKey.toBase58());
        }
      } else if (!disconnecting && !isSigned) {
        console.log("Explicit wallet disconnect detected. Removing cookies.");
        await removeWalletCookie();
        localStorage.removeItem("lastConnectedWallet");
      }
    };

    handleWalletChange();
  }, [
    connected,
    publicKey,
    isSigned,
    disconnecting,
    router,
    requestSignature,
    previousWallet,
  ]);

  return null;
};

export default WalletHandler;
