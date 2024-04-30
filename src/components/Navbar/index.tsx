import React from "react";
import {WalletMultiButton} from "@solana/wallet-adapter-react-ui";
import logo from "../../../public/logo.jpeg";
import Image from "next/image";
import Link from 'next/link'

const Navbar: React.FC = () => {
    return (
        <nav
            className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-200">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-2">
                <button>
                    <Link href="/">
                        <div className="w-18 flex text-center items-center">
                            <Image className="object-cover btn-circle"
                                   src={logo}
                                   width={70}
                                   height={70}
                                   alt="logo"/>
                            <p className="ml-5 fw-bolder fs-4">X BOTS</p>
                        </div>
                    </Link>
                </button>
                <WalletMultiButton className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse"
                                   style={{backgroundColor: "rgba(100, 65, 52, 0.19)", color: "#333333"}}
                                   disabled={true}/>
                <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
                     id="navbar-sticky">
                    <ul className="flex flex-col md:p-0 font-medium rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 items-center">
                        <li className="block text-blue-500 bg-blue-700 md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500">
                            <Link href="/dashboard">
                                <a className="rounded py-2 px-3 hover:bg-gray-100">Home</a>
                            </Link>
                        </li>
                        <li className="block text-dark md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:border-gray-700">
                            <Link href="/twitter">
                                <a className="rounded py-1 px-3 fs-3 fw-bold hover:bg-gray-100">X</a>
                            </Link>
                        </li>
                        <li className="block text-dark md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:border-gray-700">
                            <Link href="/news">
                                <a className="rounded py-2 px-3 hover:bg-gray-100">News</a>
                            </Link>
                        </li>
                        <li className="block text-dark md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:border-gray-700">
                            <Link href="/news">
                                <a className="rounded py-2 px-3 hover:bg-gray-100">Profile</a>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
};

export default Navbar;
