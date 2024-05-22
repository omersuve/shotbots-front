import React, { useEffect, useState } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import TextLogo from "../../../public/text-logo.png";
import Image from "next/image";
import Link from "next/link";

const Navbar: React.FC = () => {
    const [prices, setPrices] = useState<{ [key: string]: { price: string; change: string } }>({});

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
            className="bg-white fixed w-full z-20 top-0 start-0 border-b border-gray-200">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-2">
                <div className="flex items-center space-x-12">
                    <button>
                        <Link href="/" passHref={true}>
                            <div className="w-18 flex text-center items-center">
                                {/*<Image className="object-cover btn-circle"*/}
                                {/*       src={logo}*/}
                                {/*       width={65}*/}
                                {/*       height={65}*/}
                                {/*       alt="logo"/>*/}
                                <Image className="object-cover m-1.5"
                                       src={TextLogo}
                                       width={100}
                                       height={75}
                                       alt="textlogo" />
                            </div>
                        </Link>
                    </button>
                    <div className="inline-flex">
                        <div className="flex flex-col items-center px-2">
                            <h6 className="text-s font-bold">BTC</h6>
                            <div className="inline-flex">
                                <p className="text-xs px-1">{"bitcoin" in prices ? prices["bitcoin"].price : "Loading..."}</p>
                                <p className={`text-xs px-1 ${"bitcoin" in prices ? getChangeClass(prices["bitcoin"].change) : ""}`}>
                                    {"bitcoin" in prices ? prices["bitcoin"].change : ""}</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-center px-2">
                            <h6 className="text-s font-bold">ETH</h6>
                            <div className="inline-flex">
                                <p className="text-xs px-1">{"ethereum" in prices ? prices["ethereum"].price : "Loading..."}</p>
                                <p className={`text-xs px-1 ${"ethereum" in prices ? getChangeClass(prices["ethereum"].change) : ""}`}>
                                    {"ethereum" in prices ? prices["ethereum"].change : ""}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col items-center px-2">
                            <h6 className="text-s font-bold">SOL</h6>
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
                    <ul className="flex flex-col md:p-0 font-medium rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 absolute items-center right-80">
                        <li className="block text-blue-500 bg-blue-700 md:bg-transparent md:text-blue-700 md:p-0">
                            <Link href="/dashboard" className="rounded py-2 px-2 hover:bg-gray-100">
                                Home
                            </Link>
                        </li>
                        <li className="block text-dark md:hover:text-blue-700 md:p-0">
                            <Link href="/twitter" className="rounded py-1 px-2 fs-3 fw-bold hover:bg-gray-100">
                                X
                            </Link>
                        </li>
                        <li className="block text-dark md:hover:text-blue-700 md:p-0">
                            <Link href="/news" className="rounded py-2 px-2 hover:bg-gray-100">
                                News
                            </Link>
                        </li>
                        <li className="block text-dark md:hover:text-blue-700 md:p-0">
                            <Link href="/news" className="rounded py-2 px-2 hover:bg-gray-100 pointer-events-none">
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
