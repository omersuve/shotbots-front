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
            // Update localStorage and proceed
            await setWalletCookie(publicKey.toBase58());
            setPreviousWallet(publicKey.toBase58());

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
          } else {
            // User ignored the signature request, revert to previous wallet state
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
          // Normal flow when user is already signed
          await setWalletCookie(publicKey.toBase58());
          setPreviousWallet(publicKey.toBase58());
        }
      } else if (!disconnecting) {
        await removeWalletCookie();
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
