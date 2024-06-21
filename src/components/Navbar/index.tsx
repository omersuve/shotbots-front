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
    publicKey: string,
    points: number,
    win: number,
    lose: number,
    pointBoost: number,
    votingPower: number,
    createdAt: Date,
}

const Navbar: React.FC = () => {
    const router = useRouter();
    const { prices, loading } = usePrices();
    const { publicKey } = useWallet();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [profileInfo, setProfileInfo] = useState<User | null>(null);
    const profileRef = useRef<HTMLDivElement>(null);
    const profileButtonRef = useRef<HTMLButtonElement>(null);
    const [isOpen, setIsOpen] = useState(false); // State for controlling the mobile menu


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileButtonRef.current &&
                !profileButtonRef.current.contains(event.target as Node)) {
                if (window.innerWidth > 768) {  // Check for mobile view
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
            const offset = buttonRect.left + buttonRect.width / 2 - popupRect.width / 2;
            profileRef.current.style.left = `${offset}px`;

            if (window.innerWidth < 768) {  // Check for mobile view
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
            fetchProfile(publicKey.toString()).then(r => {
            });
        }
    }, [publicKey]);

    const toggleMenu = () => {
        setIsOpen(!isOpen); // Toggle the mobile menu
        setIsProfileOpen(false);
    };

    const handleLinkClick = () => {
        setIsOpen(false); // Close the mobile menu
        setIsProfileOpen(false);
    };

    return (
        <nav className={`${styles["navbar"]} fixed w-full z-20 top-0 start-0 border-b border-gray-200 opacity-90`}>
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-2">
                <div className="flex items-center lg:space-x-6">
                    <button>
                        <Link href="/" passHref={true}>
                            <div className="w-18 flex text-center items-center">
                                <Image className="object-cover m-1.5" src={TextLogoBlack} width={100} height={75}
                                       alt="textlogo" />
                            </div>
                        </Link>
                    </button>
                    <div className="flex items-center justify-center flex-grow pointer-events-none">
                        <div className="flex flex-col items-center px-2 w-20">
                            <h6 className="text-xs font-bold">BTC</h6>
                            <div className="contents">
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
                        <div className="flex flex-col items-center px-1 w-12">
                            <h6 className="text-xs font-bold">ETH</h6>
                            <div className="contents">
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
                        <div className="flex flex-col items-center px-2 w-20">
                            <h6 className="text-xs font-bold">SOL</h6>
                            <div className="contents">
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
                <div className="lg:hidden ml-auto">
                    <Hamburger toggled={isOpen} toggle={toggleMenu} />
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
                        <li className="flex items-center h-full">
                            <Link href="/nft"
                                  className={`flex items-center h-full px-4 text-dark md:hover:text-blue-700 hover:bg-gray-300 hover:text-blue-700 transition duration-300 ease-in-out ${router.pathname === "/nft" ? "border-b-2 border-blue-500" : ""}`}>
                                NFTs
                            </Link>
                        </li>
                    </ul>
                    <div className="ml-auto flex items-center space-x-4">
                        <button
                            ref={profileButtonRef}
                            disabled={!publicKey}
                            onClick={toggleProfile}
                            className={`${!publicKey ? "hidden" : ""} flex h-10 rounded-md items-center py-3 px-4 text-dark md:hover:text-blue-700 hover:bg-gray-300 hover:text-blue-700 transition duration-300 ease-in-out pointer-events-auto`}
                            style={{
                                fontFamily: "DM Sans",
                                backgroundColor: isProfileOpen ? "rgb(200, 200, 200)" : "rgb(233, 233, 233)",
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
                <div className="lg:hidden fixed top-0 left-0 w-full h-full bg-black bg-opacity-50" onClick={toggleMenu}>
                    <div className="bg-white w-2/4 h-full shadow-lg p-4" onClick={e => e.stopPropagation()}>
                        <ul className="space-y-4 w-75">
                            <li>
                                <Link href="/dashboard"
                                      className={`text-dark block md:hover:text-blue-700 transition duration-300 ease-in-out ${router.pathname === "/dashboard" ? "border-b-2 border-blue-500" : ""}`}
                                      onClick={handleLinkClick}>
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/twitter"
                                      className={`text-dark block md:hover:text-blue-700 transition duration-300 ease-in-out fs-3 fw-bold ${router.pathname === "/twitter" ? "border-b-2 border-blue-500" : ""}`}
                                      onClick={handleLinkClick}>
                                    X
                                </Link>
                            </li>
                            <li>
                                <Link href="/news"
                                      className={`text-dark block md:hover:text-blue-700 transition duration-300 ease-in-out ${router.pathname === "/news" ? "border-b-2 border-blue-500" : ""}`}
                                      onClick={handleLinkClick}>
                                    News
                                </Link>
                            </li>
                            <li>
                                <Link href="/memecoin"
                                      className={`text-dark block md:hover:text-blue-700 transition duration-300 ease-in-out ${router.pathname === "/memecoin" ? "border-b-2 border-blue-500" : ""}`}
                                      onClick={handleLinkClick}>
                                    Memecoins
                                </Link>
                            </li>
                            <li>
                                <Link href="/nft"
                                      className={`text-dark block md:hover:text-blue-700 transition duration-300 ease-in-out ${router.pathname === "/nft" ? "border-b-2 border-blue-500" : ""}`}
                                      onClick={handleLinkClick}>
                                    NFTs
                                </Link>
                            </li>
                            <li>
                                <button
                                    className={`${!publicKey ? "hidden" : ""} text-dark block md:hover:text-blue-700 transition duration-300 ease-in-out ${isProfileOpen ? "border-b-2 border-blue-500" : ""}`}
                                    disabled={!publicKey}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleProfile();
                                    }}>
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
                                    }} />
                            </li>
                        </ul>
                    </div>
                </div>
            )}
            {isProfileOpen && (
                <div ref={profileRef}
                     className="absolute mt-2 p-4 border-2 bg-white border-blue-50 rounded-lg shadow-lg z-30"
                     style={{
                         top: "100%",
                         minWidth: "300px",
                         borderRadius: "20px",
                         display: "flex",
                         flexDirection: "column",
                         alignItems: "center",
                         gap: "10px",
                     }}>
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                        alignItems: "center",
                    }}>
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            marginLeft: "5px",
                        }}>
                            <span style={{ fontWeight: "bold", fontSize: "x-small" }}>POINT BOOST</span>
                            <span style={{
                                color: "#A52A2A",
                                fontStyle: "italic",
                                fontWeight: "bold",
                                fontSize: "smaller",
                            }}>x{profileInfo?.pointBoost}</span>
                        </div>
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}>
                            <span style={{ fontWeight: "bold", fontSize: "x-small" }}>VOTING POWER</span>
                            <span style={{
                                color: "#A52A2A",
                                fontStyle: "italic",
                                fontWeight: "bold",
                                fontSize: "smaller",
                            }}>x{profileInfo?.votingPower}</span>
                        </div>
                    </div>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                        backgroundColor: "rgb(230,230,230)",
                        borderRadius: "20px",
                    }}>
                        <span style={{
                            fontWeight: "bold",
                            fontSize: "20px",
                            borderRadius: "10px",
                            fontFamily: "fantasy",
                            marginLeft: "10px",
                            display: "inline-flex",
                            alignItems: "center",
                        }}><p className="mt-2">Points: {profileInfo?.points}</p>
                            <Image className="object-cover m-1 mr-4"
                                   src={Sheriff}
                                   width={25} // Adjust width as needed
                                   height={25} // Adjust height as needed
                                   alt="textlogo" />
                        </span>
                        <Image className="object-cover mr-6"
                               src={Fish}
                               width={25} // Adjust width as needed
                               height={25} // Adjust height as needed
                               alt="textlogo" />
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
