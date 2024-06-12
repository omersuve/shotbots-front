import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import TextLogoBlack from "../../../public/black.png";
import Image from "next/image";
import Link from "next/link";
import styles from "./index.module.css";
import { usePrices } from "../../contexts/PricesContext";
import MyLoader from "../../components/MyLoader";
import { useWallet } from "@solana/wallet-adapter-react";

const Navbar: React.FC = () => {
    const router = useRouter();
    const { prices, loading } = usePrices();
    const { publicKey } = useWallet();

    const getChangeClass = (change: string) => {
        const value = parseFloat(change);
        if (isNaN(value)) return "";
        return value < 0 ? "text-red-500" : "text-green-500";
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
            // setProfileInfo(data);
        } catch (error) {
            console.error("Error fetching profile info:", error);
        }
    };

    useEffect(() => {
        if (publicKey) {
            fetchProfile(publicKey.toString()).then(r => {
            });
        }
    }, [publicKey]);

    return (
        <nav className={`${styles["navbar"]} fixed w-full z-20 top-0 start-0 border-b border-gray-200 opacity-90`}>
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-2">
                <div className="flex items-center space-x-12">
                    <button>
                        <Link href="/" passHref={true}>
                            <div className="w-18 flex text-center items-center">
                                <Image className="object-cover m-1.5" src={TextLogoBlack} width={100} height={75}
                                       alt="textlogo" />
                            </div>
                        </Link>
                    </button>
                    <div className="hidden lg:inline-flex pointer-events-none">
                        <div className="flex flex-col items-center px-2 w-28">
                            <h6 className="fs-6 font-bold">BTC</h6>
                            <div className="inline-flex">
                                {loading ? (
                                    <MyLoader size="small" inline /> // Use size="small" and inline prop
                                ) : (
                                    <>
                                        <p className="text-xs px-1">{prices["bitcoin"].price}</p>
                                        <p className={`text-xs px-1 ${getChangeClass(prices["bitcoin"].change)}`}>
                                            {prices["bitcoin"].change}
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col items-center px-2 w-28">
                            <h6 className="fs-6 font-bold">ETH</h6>
                            <div className="inline-flex">
                                {loading ? (
                                    <MyLoader size="small" inline /> // Use size="small" and inline prop
                                ) : (
                                    <>
                                        <p className="text-xs px-1">{prices["ethereum"].price}</p>
                                        <p className={`text-xs px-1 ${getChangeClass(prices["ethereum"].change)}`}>
                                            {prices["ethereum"].change}
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col items-center px-2 w-28">
                            <h6 className="fs-6 font-bold">SOL</h6>
                            <div className="inline-flex">
                                {loading ? (
                                    <MyLoader size="small" inline={true} /> // Use size="small" and inline prop
                                ) : (
                                    <>
                                        <p className="text-xs px-1">{prices["solana"].price}</p>
                                        <p className={`text-xs px-1 ${getChangeClass(prices["solana"].change)}`}>
                                            {prices["solana"].change}
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1 relative"
                     id="navbar-sticky">
                    <ul className="flex flex-col md:flex-row items-center md:space-x-0 font-medium rounded-lg md:mt-0 md:border-0 absolute right-80 h-full">
                        <li className="flex items-center h-full">
                            <Link href="/dashboard"
                                  className={`flex items-center h-full px-4 text-dark md:hover:text-blue-700 hover:bg-gray-300 hover:text-blue-700 transition duration-300 ease-in-out ${router.pathname === "/dashboard" ? "border-b-2 border-blue-500" : ""}`}>
                                Home
                            </Link>
                        </li>
                        <li className="flex items-center h-full">
                            <Link href="/twitter"
                                  className={`flex items-center h-full px-4 text-dark md:hover:text-blue-700 hover:bg-gray-300 hover:text-blue-700 transition duration-300 ease-in-out fs-3 fw-bold ${router.pathname === "/twitter" ? "border-b-2 border-blue-500" : ""}`}>
                                X
                            </Link>
                        </li>
                        <li className="flex items-center h-full">
                            <Link href="/news"
                                  className={`flex items-center h-full px-4 text-dark md:hover:text-blue-700 hover:bg-gray-300 hover:text-blue-700 transition duration-300 ease-in-out ${router.pathname === "/news" ? "border-b-2 border-blue-500" : ""}`}>
                                News
                            </Link>
                        </li>
                        <li className="flex items-center h-full">
                            <Link href="/memecoin"
                                  className={`flex items-center h-full px-4 text-dark md:hover:text-blue-700 hover:bg-gray-300 hover:text-blue-700 transition duration-300 ease-in-out ${router.pathname === "/memecoin" ? "border-b-2 border-blue-500" : ""}`}>
                                Memecoins
                            </Link>
                        </li>
                    </ul>
                    <div className="ml-auto flex items-center space-x-4">
                        <button
                            disabled={true}
                            className="flex h-10 rounded-md items-center py-3 px-4 text-dark md:hover:text-blue-700 hover:bg-gray-300 hover:text-blue-700 transition duration-300 ease-in-out pointer-events-none"
                            style={{
                                fontFamily: "DM Sans",
                                backgroundColor: "rgb(233, 233, 233)",
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
        </nav>
    );
};

export default Navbar;
