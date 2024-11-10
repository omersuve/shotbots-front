import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect } from "react";
import { setWalletCookie, removeWalletCookie } from "../utils";
import { useRouter } from "next/router";
import { useWalletAuth } from "../contexts/WalletAuthContext";

const WalletHandler = () => {
  const { publicKey, connected, disconnecting } = useWallet();
  const { isSigned, requestSignature } = useWalletAuth();
  const router = useRouter();

  useEffect(() => {
    const handleWalletChange = async () => {
      const lastWallet = localStorage.getItem("lastConnectedWallet");

      if (connected && publicKey) {
        if (!isSigned && publicKey.toBase58() !== lastWallet) {
          await requestSignature();
        }

        if (isSigned) {
          await setWalletCookie(publicKey.toBase58());

          try {
            const referralResponse = await fetch(
              `/api/checkReferred?wallet_address=${publicKey.toBase58()}`
            );
            const referralData = await referralResponse.json();

            if (!referralData.isReferred) {
              router.push("/");
            }
          } catch (error) {
            console.error("Error checking referral status:", error);
          }
        }
      } else if (!disconnecting) {
        await removeWalletCookie();
      }
    };

    handleWalletChange();
  }, [connected, publicKey, isSigned, disconnecting, router, requestSignature]);

  return null;
};

export default WalletHandler;
