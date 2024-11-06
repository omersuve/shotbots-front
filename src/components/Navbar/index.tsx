import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import TextLogoBlack from "../../../public/black.png";
import Fish from "../../../public/fish.png";
import Sheriff from "../../../public/sheriff.png";
import Image from "next/image";
import Link from "next/link";
import styles from "./index.module.css";
import { usePrices } from "../../contexts/PricesContext";
import MyLoader from "../../components/MyLoader";
import { useWallet } from "@solana/wallet-adapter-react";
import { Squash as Hamburger } from "hamburger-react"; // Importing the hamburger menu component

interface User {
  publicKey: string;
  points: number;
  win: number;
  lose: number;
  pointBoost: number;
  votingPower: number;
  createdAt: Date;
}

const Navbar: React.FC = () => {
  const router = useRouter();
  const { prices, fearGreed, loading } = usePrices();
  const { publicKey } = useWallet();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileInfo, setProfileInfo] = useState<User | null>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false); // State for controlling the mobile menu
  const [keys, setKeys] = useState<{ [key: string]: number }>({}); // State to control flash effect keys
  const [lastPrices, setLastPrices] = useState<{
    [key: string]: { price: string; change: string };
  }>({});

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileButtonRef.current &&
        !profileButtonRef.current.contains(event.target as Node)
      ) {
        if (window.innerWidth > 768) {
          // Check for mobile view
          setIsProfileOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileRef]);

  useEffect(() => {
    if (isProfileOpen && profileButtonRef.current && profileRef.current) {
      const buttonRect = profileButtonRef.current.getBoundingClientRect();
      const popupRect = profileRef.current.getBoundingClientRect();
      const offset =
        buttonRect.left + buttonRect.width / 2 - popupRect.width / 2;
      profileRef.current.style.left = `${offset}px`;

      if (window.innerWidth < 768) {
        // Check for mobile view
        profileRef.current.style.top = "400px";
        profileRef.current.style.left = "50%";
        profileRef.current.style.transform = "translateX(-50%)";
        profileRef.current.style.width = "75%";
        profileRef.current.style.minWidth = "unset";
      }
    }
  }, [isProfileOpen]);

  const toggleProfile = () => {
    setIsProfileOpen((prev) => !prev);
  };

  const getChangeClass = (change: string) => {
    const value = parseFloat(change);
    if (isNaN(value)) return "";
    return value < 0 ? "text-red-500" : "text-green-500";
  };

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case "Neutral":
        return "text-yellow-500";
      case "Greed":
      case "Extreme Greed":
        return "text-green-500";
      case "Fear":
      case "Extreme Fear":
        return "text-red-500";
      default:
        return "";
    }
  };

  const fetchProfile = async (publicKey: string) => {
    try {
      const response = await fetch("/api/getProfile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ publicKey }),
      });
      const data = await response.json();
      setProfileInfo(data);
    } catch (error) {
      console.error("Error fetching profile info:", error);
    }
  };

  useEffect(() => {
    if (publicKey) {
      fetchProfile(publicKey.toString()).then();
    }
  }, [publicKey]);

  useEffect(() => {
    if (prices["bitcoin"]) {
      const newKeys: { [key: string]: number } = { ...keys };
      const newLastPrices: {
        [key: string]: { price: string; change: string };
      } = { ...lastPrices };

      for (const key in prices) {
        if (
          !lastPrices[key] ||
          lastPrices[key].price !== prices[key].price ||
          lastPrices[key].change !== prices[key].change
        ) {
          newKeys[key] = (newKeys[key] || 0) + 1;
          newLastPrices[key] = {
            price: prices[key].price,
            change: prices[key].change,
          };
        }
      }

      setKeys(newKeys);
      setLastPrices(newLastPrices);
    }
  }, [prices]);

  const toggleMenu = () => {
    setIsOpen(!isOpen); // Toggle the mobile menu
    setIsProfileOpen(false);
  };

  const handleLinkClick = () => {
    setIsOpen(false); // Close the mobile menu
    setIsProfileOpen(false);
  };

  return (
    <nav
      className={`${styles["navbar"]} fixed w-full z-20 top-0 start-0 border-b border-gray-200 opacity-90`}
    >
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-2">
        <div className="flex items-center lg:space-x-6">
          <button className={styles.logoButton}>
            <Link href="/" passHref={true}>
              <div className="flex text-center items-center">
                <Image
                  className="object-cover m-1.5"
                  src={TextLogoBlack}
                  width={100}
                  height={75}
                  alt="textlogo"
                />
              </div>
            </Link>
          </button>
          <div className="flex ml-3.5 lg:ml-0 items-center justify-center text-xs flex-grow pointer-events-none">
            <div
              key={`btc-${keys["bitcoin"] || 0}`}
              className={`${styles.flash} flex flex-col mx-0.5 items-center lg:px-1 w-12 lg:w-16`}
            >
              <p className="text-xs font-bold">BTC</p>
              <div className={`${styles["prices-fear-greed"]} contents`}>
                {loading || !prices["bitcoin"] ? (
                  <MyLoader size="small" inline /> // Use size="small" and inline prop
                ) : (
                  <>
                    <p className={`lg:px-1`}>{prices["bitcoin"].price}</p>
                    <p
                      className={`lg:px-1 ${getChangeClass(
                        prices["bitcoin"].change
                      )}`}
                    >
                      {prices["bitcoin"].change}
                    </p>
                  </>
                )}
              </div>
            </div>
            <div
              key={`eth-${keys["ethereum"] || 0}`}
              className={`${styles.flash} flex flex-col mx-0.5 items-center lg:px-1 w-12 lg:w-16`}
            >
              <p className="text-xs font-bold">ETH</p>
              <div className={`${styles["prices-fear-greed"]} contents`}>
                {loading || !prices["ethereum"] ? (
                  <MyLoader size="small" inline /> // Use size="small" and inline prop
                ) : (
                  <>
                    <p className={`lg:px-1`}>{prices["ethereum"].price}</p>
                    <p
                      className={`lg:px-1 ${getChangeClass(
                        prices["ethereum"].change
                      )}`}
                    >
                      {prices["ethereum"].change}
                    </p>
                  </>
                )}
              </div>
            </div>
            <div
              key={`sol-${keys["solana"] || 0}`}
              className={`${styles.flash} flex flex-col mx-0.5 items-center lg:px-1 w-12 lg:w-16`}
            >
              <p className="text-xs font-bold">SOL</p>
              <div className={`${styles["prices-fear-greed"]} contents`}>
                {loading || !prices["solana"] ? (
                  <MyLoader size="small" inline={true} /> // Use size="small" and inline prop
                ) : (
                  <>
                    <p className={`lg:px-1`}>{prices["solana"].price}</p>
                    <p
                      className={`lg:px-1 ${getChangeClass(
                        prices["solana"].change
                      )}`}
                    >
                      {prices["solana"].change}
                    </p>
                  </>
                )}
              </div>
            </div>
            <div className="ml-0.5 text-center border-2 border-dotted bg-gray-100 text-xs lg:text-sm font-bold rounded-lg flex flex-col items-center lg:px-4 lg:py-1 lg:ml-3 w-20 lg:w-44">
              {fearGreed ? (
                <>
                  <p className={`${styles["prices-fear-greed"]} font-bold`}>
                    Fear & Greed
                  </p>
                  <div className="flex items-center mt-2 justify-center text-center">
                    <p
                      className={`${
                        styles["prices-fear-greed"]
                      } lg:fs-6 lg:px-1 ${getClassificationColor(
                        fearGreed.classification
                      )}`}
                    >
                      %{fearGreed.value}
                    </p>
                    <p
                      className={`px-1 ${
                        styles["prices-fear-greed"]
                      } ${getClassificationColor(fearGreed.classification)}`}
                    >
                      {fearGreed.classification}
                    </p>
                  </div>
                </>
              ) : (
                <MyLoader size="small" inline={true} />
              )}
            </div>
          </div>
        </div>
        <div className="lg:hidden ml-auto">
          <Hamburger toggled={isOpen} toggle={toggleMenu} />
        </div>
        <div
          className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1 relative"
          id="navbar-sticky"
        >
          <ul className="flex flex-col md:flex-row items-center md:space-x-0 text-base font-medium rounded-lg md:mt-0 md:border-0 absolute right-80 h-full">
            <li className="flex items-center h-full">
              <Link
                href="/dashboard"
                className={`flex items-center h-full px-3 text-dark md:hover:text-blue-700 hover:bg-gray-300 hover:text-blue-700 transition duration-300 ease-in-out ${
                  router.pathname === "/dashboard"
                    ? "border-b-2 border-blue-500"
                    : ""
                }`}
              >
                Home
              </Link>
            </li>
            <li className="flex items-center h-full">
              <Link
                href="/news"
                className={`flex items-center h-full px-3 text-dark md:hover:text-blue-700 hover:bg-gray-300 hover:text-blue-700 transition duration-300 ease-in-out ${
                  router.pathname === "/news"
                    ? "border-b-2 border-blue-500"
                    : ""
                }`}
              >
                News
              </Link>
            </li>
            <li className="flex items-center h-full">
              <Link
                href="/memecoin"
                className={`flex items-center h-full px-3 text-dark md:hover:text-blue-700 hover:bg-gray-300 hover:text-blue-700 transition duration-300 ease-in-out ${
                  router.pathname === "/memecoin"
                    ? "border-b-2 border-blue-500"
                    : ""
                }`}
              >
                Memecoin
              </Link>
            </li>
            <li className="flex items-center h-full">
              <Link
                href="/trending"
                className={`flex items-center h-full px-3 text-dark md:hover:text-blue-700 hover:bg-gray-300 hover:text-blue-700 transition duration-300 ease-in-out ${
                  router.pathname === "/trending"
                    ? "border-b-2 border-blue-500"
                    : ""
                }`}
              >
                Trends
              </Link>
            </li>
            <li className="flex items-center h-full">
              <Link
                href="/nft"
                className={`flex items-center h-full px-3 text-dark md:hover:text-blue-700 hover:bg-gray-300 hover:text-blue-700 transition duration-300 ease-in-out ${
                  router.pathname === "/nft" ? "border-b-2 border-blue-500" : ""
                }`}
              >
                NFT
              </Link>
            </li>
          </ul>
          <div className="ml-auto flex items-center space-x-4">
            <button
              ref={profileButtonRef}
              disabled={!publicKey}
              onClick={toggleProfile}
              className={`${
                !publicKey ? "hidden" : ""
              } flex h-10 rounded-md items-center py-3 px-4 text-dark md:hover:text-blue-700 hover:bg-gray-300 hover:text-blue-700 transition duration-300 ease-in-out pointer-events-auto`}
              style={{
                fontFamily: "DM Sans",
                backgroundColor: isProfileOpen
                  ? "rgb(200, 200, 200)"
                  : "rgb(233, 233, 233)",
              }}
            >
              Profile
            </button>
            <WalletMultiButton
              className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse"
              style={{
                fontSize: "14px",
                backgroundColor: "#e8e8e8",
                color: "black",
              }}
            />
          </div>
        </div>
      </div>
      {isOpen && (
        <div
          className="lg:hidden fixed top-0 left-0 w-full h-full bg-black bg-opacity-50"
          onClick={toggleMenu}
        >
          <div
            className="bg-white w-2/4 h-full shadow-lg p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <ul className="space-y-4 w-75">
              <li>
                <Link
                  href="/dashboard"
                  className={`text-dark block md:hover:text-blue-700 transition duration-300 ease-in-out ${
                    router.pathname === "/dashboard"
                      ? "border-b-2 border-blue-500"
                      : ""
                  }`}
                  onClick={handleLinkClick}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/news"
                  className={`text-dark block md:hover:text-blue-700 transition duration-300 ease-in-out ${
                    router.pathname === "/news"
                      ? "border-b-2 border-blue-500"
                      : ""
                  }`}
                  onClick={handleLinkClick}
                >
                  News
                </Link>
              </li>
              <li>
                <Link
                  href="/memecoin"
                  className={`text-dark block md:hover:text-blue-700 transition duration-300 ease-in-out ${
                    router.pathname === "/memecoin"
                      ? "border-b-2 border-blue-500"
                      : ""
                  }`}
                  onClick={handleLinkClick}
                >
                  Memecoin
                </Link>
              </li>
              <li>
                <Link
                  href="/trending"
                  className={`text-dark block md:hover:text-blue-700 transition duration-300 ease-in-out ${
                    router.pathname === "/trending"
                      ? "border-b-2 border-blue-500"
                      : ""
                  }`}
                  onClick={handleLinkClick}
                >
                  Trends
                </Link>
              </li>
              <li>
                <Link
                  href="/nft"
                  className={`text-dark block md:hover:text-blue-700 transition duration-300 ease-in-out ${
                    router.pathname === "/nft"
                      ? "border-b-2 border-blue-500"
                      : ""
                  }`}
                  onClick={handleLinkClick}
                >
                  NFT
                </Link>
              </li>
              <li>
                <button
                  className={`${
                    !publicKey ? "hidden" : ""
                  } text-dark block md:hover:text-blue-700 transition duration-300 ease-in-out ${
                    isProfileOpen ? "border-b-2 border-blue-500" : ""
                  }`}
                  disabled={!publicKey}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleProfile();
                  }}
                >
                  Profile
                </button>
              </li>
              <li>
                <WalletMultiButton
                  className="text-sm bg-gray-200 px-3 py-2 rounded-lg"
                  style={{
                    fontSize: "10px",
                    backgroundColor: "#e8e8e8",
                    color: "black",
                  }}
                />
              </li>
            </ul>
          </div>
        </div>
      )}
      {isProfileOpen && (
        <div
          ref={profileRef}
          className="absolute mt-2 p-4 border-2 bg-white border-blue-50 rounded-lg shadow-lg z-30"
          style={{
            top: "100%",
            minWidth: "300px",
            borderRadius: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginLeft: "5px",
              }}
            >
              <span style={{ fontWeight: "bold", fontSize: "x-small" }}>
                POINT BOOST
              </span>
              <span
                style={{
                  color: "#A52A2A",
                  fontStyle: "italic",
                  fontWeight: "bold",
                  fontSize: "smaller",
                }}
              >
                x{profileInfo?.pointBoost}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <span style={{ fontWeight: "bold", fontSize: "x-small" }}>
                VOTING POWER
              </span>
              <span
                style={{
                  color: "#A52A2A",
                  fontStyle: "italic",
                  fontWeight: "bold",
                  fontSize: "smaller",
                }}
              >
                x{profileInfo?.votingPower}
              </span>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              backgroundColor: "rgb(230,230,230)",
              borderRadius: "20px",
            }}
          >
            <span
              style={{
                fontWeight: "bold",
                fontSize: "20px",
                borderRadius: "10px",
                fontFamily: "fantasy",
                marginLeft: "10px",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              <p className="mt-2">Points: {profileInfo?.points}</p>
              <Image
                className="object-cover m-1 mr-4"
                src={Sheriff}
                width={25} // Adjust width as needed
                height={25} // Adjust height as needed
                alt="textlogo"
              />
            </span>
            <Image
              className="object-cover mr-6"
              src={Fish}
              width={25} // Adjust width as needed
              height={25} // Adjust height as needed
              alt="textlogo"
            />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
