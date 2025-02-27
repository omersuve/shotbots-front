import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Container from "react-bootstrap/Container";
import Typist from "react-typist-component";
import styles from "./index.module.css";
import logo from "../../../public/target.webp";
import news from "../../../public/newspaper.webp";
import TextLogoBlack from "../../../public/black.png";
import Image from "next/image";
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { toast } from "react-toastify";
import { useWalletAuth } from "../../contexts/WalletAuthContext";

export const Jumbotron = (props: any) => {
  const bgStyle = props.style ?? { backgroundColor: "#e9ecef" };
  return (
    <div id={props.id} className={`py-3 ${props.className}`} style={bgStyle}>
      <div className="container py-5">{props.children}</div>
    </div>
  );
};

const MainBody = ({ gradient, message, message2 }: any) => {
  const [referralCode, setReferralCode] = useState<string>("");
  const [userReferralCode, setUserReferralCode] = useState<string | null>(null); // Store the user's referral code
  const [isReferred, setIsReferred] = useState<boolean>(false);
  const [referralCount, setReferralCount] = useState<number | null>(null); // Store referral count here
  const router = useRouter();
  const { publicKey, connected } = useWallet();
  const { isSigned } = useWalletAuth();

  const navigateToDashboard = () => {
    router.push("/dashboard");
  };

  // Set referral code if present in URL query and auto-submit after a delay
  useEffect(() => {
    const { ref } = router.query;
    if (ref) {
      setReferralCode(ref as string);

      // Automatically submit the referral code after a 2-second delay
      if (connected && publicKey) {
        setTimeout(() => {
          handleReferralSubmit(ref as string, publicKey.toString());
        }, 500); // Adjust the delay as needed
      }
    }
  }, [router.query, connected, publicKey]);

  // Capture referral code from query parameter and auto-submit
  useEffect(() => {
    const verifyOwnershipAndCheckReferral = async () => {
      if (connected && publicKey && isSigned) {
        // Check if the user is already referred
        const referred = await checkIfReferred();
        if (referred) {
          await fetchUserReferralCode(publicKey.toString());
        }
      } else {
        setIsReferred(false);
        setReferralCount(null);
      }
    };

    verifyOwnershipAndCheckReferral();
  }, [connected, publicKey, isSigned]);

  // Check if the user is referred by calling the API
  const checkIfReferred = async () => {
    const response = await fetch(
      `/api/checkReferred?wallet_address=${publicKey}`
    );
    const data = await response.json();

    if (data.isReferred) {
      setIsReferred(true);
      setReferralCount(data.referrals_count); // Set referral count
      return true;
    } else {
      setIsReferred(false);
      setReferralCount(null);
      return false;
    }
  };

  // Fetch the user's referral code from the backend
  const fetchUserReferralCode = async (walletAddress: string) => {
    const response = await fetch(
      `/api/getUserReferralCode?wallet_address=${walletAddress}`
    );
    const data = await response.json();

    if (data.referral_code) {
      setUserReferralCode(data.referral_code);
    } else {
      setUserReferralCode(null); // If no referral code is available
    }
  };

  // Handle form submission for wallet connection and referral code use
  const handleReferralSubmit = async (
    referralCodeToSubmit?: string,
    publicKey?: string
  ) => {
    const codeToSubmit = referralCodeToSubmit || referralCode; // Use either parameter or state value

    if (!codeToSubmit || !publicKey) {
      toast("Missing referral code or wallet address");
      return;
    }

    const response = await fetch("/api/useReferralCode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        wallet_address: publicKey,
        referral_code: codeToSubmit,
      }),
    });

    const data = await response.json();

    if (data.success) {
      setIsReferred(true); // Update state to indicate successful referral
      setUserReferralCode(data.referral_code);
    }
    toast(data.message);
  };

  // Copy referral code URL to clipboard
  const copyToClipboard = () => {
    if (userReferralCode) {
      const referralUrl = `https://shotbots.app/?ref=${userReferralCode}`; // Full URL
      navigator.clipboard.writeText(referralUrl);
      toast("Referral URL copied to clipboard!");
    }
  };

  return (
    <Jumbotron
      fluid
      id="home"
      style={{
        background: `linear-gradient(360deg,${gradient})`,
        backgroundSize: "100% 100%",
        overflow: "hidden",
      }}
      className="title bg-transparent bgstyle text-light min-vh-100 d-flex align-content-center align-items-center flex-wrap m-0"
    >
      <div id="stars"></div>

      {/* Wallet Button Positioned at Top-Right */}
      <div className="absolute flex top-4 right-4">
        {/* Show referral count if available */}
        {publicKey && referralCount !== null && (
          <p className={styles["referral-count"]}>
            Your referral count: {referralCount}
          </p>
        )}
        <WalletMultiButton
          className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse"
          style={{
            fontSize: "14px",
            backgroundColor: "#f1e1d599",
            color: "black",
          }}
        />
      </div>

      <div className={`${styles["img-rectangular-top"]} object-cover`}>
        <Image
          className="object-cover"
          src={TextLogoBlack}
          width={300}
          height={150}
          alt="Logo"
        />
      </div>
      <div className="right-52 position-absolute">
        <Image
          className={`${styles["img-rectangular-left"]} object-cover`}
          src={logo}
          width={150}
          height={150}
          alt="Picture of a Mask2"
        />
      </div>
      <div className="left-52 position-absolute">
        <Image
          className={`${styles["img-rectangular-right"]} object-cover`}
          src={news}
          width={150}
          height={150}
          alt="Picture of a Pistol"
        />
      </div>
      <Container className="text-center">
        {!isSigned || !isReferred || !publicKey ? (
          <div className={`${styles["referral-section"]} mt-5`}>
            <h2 className="text-black">Enter Referral Code for Early Access</h2>
            <input
              type="text"
              placeholder="Referral Code"
              className={`${styles["input"]} form-control`}
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
            />
            <button
              className="bg-yellow-100 hover:bg-yellow-50 btn mt-2 text-black border-2 border-black"
              onClick={() =>
                handleReferralSubmit(referralCode, publicKey?.toString())
              }
            >
              Submit
            </button>
          </div>
        ) : (
          <>
            <Typist typingDelay={60} backspaceDelay={100}>
              <div className={`${styles["typist-font"]} text-center fs-3`}>
                <p className="inline pointer-events-none">
                  <span>{message}</span>
                  <Typist.Delay ms={150} />
                  <span>{message2}</span>
                </p>
              </div>
            </Typist>
            <button
              className={`${styles["stay-tuned"]} btn border-black text-black hover:bg-yellow-900`}
              onClick={navigateToDashboard}
            >
              Take a Shot!
            </button>
            {/* Display user's referral code with a copy button */}
            {userReferralCode && (
              <div className="mt-5">
                <p className="text-black">
                  Your referral code: <strong>{userReferralCode}</strong>
                </p>
                <button
                  className="bg-yellow-100 hover:bg-yellow-50 btn mt-2 text-black border-2 border-black"
                  onClick={copyToClipboard}
                >
                  Copy Referral Code
                </button>
              </div>
            )}
          </>
        )}

        <div className="flex items-center justify-center p-4 mt-2 opacity-75 gap-4">
          <Link href="https://x.com/shotbots_" passHref target="_blank">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className={styles["x-icon"]}
            >
              <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
            </svg>
          </Link>
          <Link href="https://t.me/theshotbots" passHref target="_blank">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 496 512"
              className={styles["x-icon"]}
            >
              <path d="M248 8C111 8 0 119 0 256S111 504 248 504 496 393 496 256 385 8 248 8zM363 176.7c-3.7 39.2-19.9 134.4-28.1 178.3-3.5 18.6-10.3 24.8-16.9 25.4-14.4 1.3-25.3-9.5-39.3-18.7-21.8-14.3-34.2-23.2-55.3-37.2-24.5-16.1-8.6-25 5.3-39.5 3.7-3.8 67.1-61.5 68.3-66.7 .2-.7 .3-3.1-1.2-4.4s-3.6-.8-5.1-.5q-3.3 .7-104.6 69.1-14.8 10.2-26.9 9.9c-8.9-.2-25.9-5-38.6-9.1-15.5-5-27.9-7.7-26.8-16.3q.8-6.7 18.5-13.7 108.4-47.2 144.6-62.3c68.9-28.6 83.2-33.6 92.5-33.8 2.1 0 6.6 .5 9.6 2.9a10.5 10.5 0 0 1 3.5 6.7A43.8 43.8 0 0 1 363 176.7z" />
            </svg>
          </Link>
          <Link href="https://docs.shotbots.app/" passHref target="_blank">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              className={styles["x-icon"]}
            >
              <path d="M96 0C43 0 0 43 0 96L0 416c0 53 43 96 96 96l288 0 32 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l0-64c17.7 0 32-14.3 32-32l0-320c0-17.7-14.3-32-32-32L384 0 96 0zm0 384l256 0 0 64L96 448c-17.7 0-32-14.3-32-32s14.3-32 32-32zm32-240c0-8.8 7.2-16 16-16l192 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-192 0c-8.8 0-16-7.2-16-16zm16 48l192 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-192 0c-8.8 0-16-7.2-16-16s7.2-16 16-16z" />
            </svg>
          </Link>
        </div>

        <p
          className={`${styles["rights"]} md:absolute md:right-10 md:bottom-10 text-center fs-6`}
        >
          &copy; {new Date().getFullYear()} Shotbots. All rights reserved.
        </p>
        <p
          className={`${styles["rights"]} md:absolute md:left-10 md:bottom-8 text-center fs-6 grid`}
        >
          <span className="fs-6 ml-2 fw-bolder">REACH OUT FOR INQUIRIES:</span>
          <span className="fs-6 ml-2">theshotbots@gmail.com</span>
        </p>
      </Container>
    </Jumbotron>
  );
};

export default MainBody;
