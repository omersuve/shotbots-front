import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import TextLogoBlack from "../../../public/black.png";
import Image from "next/image";
import Link from "next/link";
import styles from "./index.module.css";

const Navbar: React.FC = () => {
    const [prices, setPrices] = useState<{ [key: string]: { price: string; change: string } }>({});
    const router = useRouter();

    const fetchPrice = async () => {
        try {
            const response = await fetch("/api/price", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(["bitcoin", "ethereum", "solana"]), // Replace with the desired ticker
            });
            const data = await response.json();
            setPrices(data.prices);
        } catch (error) {
            console.error("Error fetching the price:", error);
        }
    };
    useEffect(() => {
        fetchPrice().then(); // Initial fetch

        const interval = setInterval(() => {
            fetchPrice().then(); // Fetch every 1 minute
        }, 60000);

        return () => clearInterval(interval); // Cleanup on component unmount
    }, []);

    const getChangeClass = (change: string) => {
        const value = parseFloat(change);
        if (isNaN(value)) return "";
        return value < 0 ? "text-red-500" : "text-green-500";
    };

    return (
        <nav
            className={`${styles["navbar"]} fixed w-full z-20 top-0 start-0 border-b border-gray-200 opacity-90`}>
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-2">
                <div className="flex items-center space-x-12">
                    <button>
                        <Link href="/" passHref={true}>
                            <div className="w-18 flex text-center items-center">
                                <Image className="object-cover m-1.5"
                                       src={TextLogoBlack}
                                       width={100}
                                       height={75}
                                       alt="textlogo" />
                            </div>
                        </Link>
                    </button>
                    <div className="hidden lg:inline-flex pointer-events-none">
                        <div className="flex flex-col items-center px-2 w-28">
                            <h6 className="fs-6 font-bold">BTC</h6>
                            <div className="inline-flex">
                                <p className="text-xs px-1">{"bitcoin" in prices ? prices["bitcoin"].price : "Loading..."}</p>
                                <p className={`text-xs px-1 ${"bitcoin" in prices ? getChangeClass(prices["bitcoin"].change) : ""}`}>
                                    {"bitcoin" in prices ? prices["bitcoin"].change : ""}</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-center px-2 w-28">
                            <h6 className="fs-6 font-bold">ETH</h6>
                            <div className="inline-flex">
                                <p className="text-xs px-1">{"ethereum" in prices ? prices["ethereum"].price : "Loading..."}</p>
                                <p className={`text-xs px-1 ${"ethereum" in prices ? getChangeClass(prices["ethereum"].change) : ""}`}>
                                    {"ethereum" in prices ? prices["ethereum"].change : ""}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col items-center px-2 w-28">
                            <h6 className="fs-6 font-bold">SOL</h6>
                            <div className="inline-flex">
                                <p className="text-xs px-1">{"solana" in prices ? prices["solana"].price : "Loading..."}</p>
                                <p className={`text-xs px-1 ${"solana" in prices ? getChangeClass(prices["solana"].change) : ""}`}>
                                    {"solana" in prices ? prices["solana"].change : ""}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1 relative"
                     id="navbar-sticky">
                    <ul className="flex flex-col md:flex-row items-center md:space-x-0 font-medium rounded-lg md:mt-0 md:border-0 absolute right-60 h-full">
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
                        {/*<li className="flex items-center h-full">*/}
                        {/*    <Link href="/memecoin"*/}
                        {/*          className={`flex items-center h-full px-4 text-dark md:hover:text-blue-700 hover:bg-gray-300 hover:text-blue-700 transition duration-300 ease-in-out ${router.pathname === "/memecoin" ? "border-b-2 border-blue-500" : ""}`}>*/}
                        {/*        Memecoins*/}
                        {/*    </Link>*/}
                        {/*</li>*/}
                        <li className="flex items-center h-full">
                            <Link href="/news"
                                  className="flex items-center h-full px-4 text-dark md:hover:text-blue-700 hover:bg-gray-300 hover:text-blue-700 transition duration-300 ease-in-out pointer-events-none">
                                Profile
                            </Link>
                        </li>
                    </ul>
                    <div className="ml-24">
                        <WalletMultiButton className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse"
                                           style={{
                                               fontSize: "14px",
                                               backgroundColor: "#e8e8e8",
                                               color: "black",
                                           }} />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
