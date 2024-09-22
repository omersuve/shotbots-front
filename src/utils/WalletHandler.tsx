import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect } from "react";
import { setWalletCookie, removeWalletCookie } from "../utils";
import { useRouter } from "next/router";

const WalletHandler = () => {
  const { publicKey, connected } = useWallet();
  const router = useRouter(); // Use Next.js router for navigation

  useEffect(() => {
    const handleWalletChange = async () => {
      if (connected && publicKey) {
        // Set wallet address in cookie
        await setWalletCookie(publicKey.toString());

        // Check the referral status by calling the API
        try {
          const referralResponse = await fetch(
            `/api/checkReferred?wallet_address=${publicKey.toString()}`
          );
          const referralData = await referralResponse.json();

          // If wallet is not referred, redirect to home
          if (!referralData.isReferred) {
            router.push("/"); // Use Next.js router to redirect to the home page
          }
        } catch (error) {
          console.error("Error checking referral status:", error);
        }
      } else {
        // Remove the cookie if the wallet is disconnected
        await removeWalletCookie();
      }
    };

    handleWalletChange(); // Call the function whenever the wallet state changes
  }, [connected, publicKey, router]);

  return null;
};

export default WalletHandler;
