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
import { removeWalletCookie, setWalletCookie } from "../../utils";

export const Jumbotron = (props: any) => {
  const bgStyle = props.style ?? { backgroundColor: "#e9ecef" };
  return (
    <div id={props.id} className={`py-3 ${props.className}`} style={bgStyle}>
      <div className="container py-5">{props.children}</div>
    </div>
  );
};

const MainBody = ({ gradient, message, message2, icons }: any) => {
  const [referralCode, setReferralCode] = useState<string>("");
  const [isReferred, setIsReferred] = useState<boolean>(false);
  const [referralCount, setReferralCount] = useState<number | null>(null); // Store referral count here
  const router = useRouter();
  const { publicKey } = useWallet();

  // Capture referral code from query parameter and auto-submit
  useEffect(() => {
    if (publicKey) {
      // Check if the user is already referred
      checkIfReferred();
      setWalletCookie(publicKey.toString()).then();
    } else {
      removeWalletCookie().then();
    }
  }, [publicKey]);

  // Check if the user is referred by calling the API
  const checkIfReferred = async () => {
    const response = await fetch(
      `/api/checkReferred?wallet_address=${publicKey}`
    );
    const data = await response.json();

    if (data.isReferred) {
      setIsReferred(true);
      setReferralCount(data.referrals_count); // Set referral count
    } else {
      setIsReferred(false);
      setReferralCount(null);
    }
  };

  // Capture referral code from query parameter and auto-submit
  useEffect(() => {
    const { ref } = router.query;
    if (ref) {
      setReferralCode(ref as string);
    }
  }, [router.query]);

  // Automatically submit the referral code if wallet is connected and referral code is available
  useEffect(() => {
    if (publicKey && referralCode) {
      handleReferralSubmit(referralCode); // Automatically submit the referral code
    }
  }, [publicKey, referralCode]); // Run this when wallet connects or referral code is set

  // Handle form submission for wallet connection and referral code use
  const handleReferralSubmit = async (referralCodeToSubmit?: string) => {
    const codeToSubmit = referralCodeToSubmit || referralCode; // Use either parameter or state value
    if (!publicKey) {
      toast("Please connect your wallet first.");
      return;
    }

    const response = await fetch("/api/useReferralCode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        wallet_address: publicKey.toString(),
        referral_code: codeToSubmit,
      }),
    });

    const data = await response.json();

    if (data.success) {
      setIsReferred(true); // Update state to indicate successful referral
    } else {
      toast(data.message);
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
        {/* Conditional rendering: show referral form if not yet referred */}
        <div className={`${styles["notice"]} p-2 mb-3`}>
          <p>Mobile Support Available!</p>
        </div>
        {!isReferred || !publicKey ? (
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
              onClick={() => handleReferralSubmit()}
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
            <Link href="/dashboard" passHref>
              <div
                className={`${styles["stay-tuned"]} btn border-black text-black hover:bg-yellow-900`}
              >
                Take a Shot!
              </div>
            </Link>
            <div className="p-4 mt-2 opacity-75 justify-items-center text-center items-center">
              {icons.map(
                (
                  icon: { url: string | undefined; image: string },
                  index: any
                ) => (
                  <Link
                    href={icon.url!}
                    passHref={true}
                    key={`social-icon-${index}`}
                    target="_blank"
                  >
                    <i className={`fab ${icon.image}  fa-2x socialicons`} />
                  </Link>
                )
              )}
            </div>
            <p
              className={`${styles["rights"]} md:absolute md:right-10 md:bottom-10 text-center fs-6`}
            >
              &copy; {new Date().getFullYear()} Shot Bots. All rights reserved.
            </p>
            <p
              className={`${styles["rights"]} md:absolute md:left-10 md:bottom-8 text-center fs-6 grid`}
            >
              <span className="fs-6 ml-2 fw-bolder">
                REACH OUT FOR INQUIRIES:
              </span>
              <span className="fs-6 ml-2">theshotbots@gmail.com</span>
            </p>
          </>
        )}
      </Container>
    </Jumbotron>
  );
};

export default MainBody;
