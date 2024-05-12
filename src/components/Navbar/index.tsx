import React from "react";
import {WalletMultiButton} from "@solana/wallet-adapter-react-ui";
import TextLogo from "../../../public/text-logo.png";
import Image from "next/image";
import Link from 'next/link'

const Navbar: React.FC = () => {
    return (
        <nav
            className="bg-white fixed w-full z-20 top-0 start-0 border-b border-gray-200">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-2">
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
                                   alt="textlogo"/>
                        </div>
                    </Link>
                </button>
                <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1 relative"
                     id="navbar-sticky">
                    <ul className="flex flex-col md:p-0 font-medium rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 absolute items-center right-72">
                        <li className="block text-blue-500 bg-blue-700 md:bg-transparent md:text-blue-700 md:p-0">
                            <Link href="/dashboard" className="rounded py-2 px-3 hover:bg-gray-100">
                                Home
                            </Link>
                        </li>
                        <li className="block text-dark md:hover:text-blue-700 md:p-0">
                            <Link href="/twitter" className="rounded py-1 px-3 fs-3 fw-bold hover:bg-gray-100">
                                X
                            </Link>
                        </li>
                        <li className="block text-dark md:hover:text-blue-700 md:p-0">
                            <Link href="/news" className="rounded py-2 px-3 hover:bg-gray-100">
                                News
                            </Link>
                        </li>
                        <li className="block text-dark md:hover:text-blue-700 md:p-0">
                            <Link href="/news" className="rounded py-2 px-3 hover:bg-gray-100 pointer-events-none">
                                Profile
                            </Link>
                        </li>
                    </ul>
                    <div className="ml-24">
                        <WalletMultiButton className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse"
                                           style={{
                                               fontSize: "14px",
                                               backgroundColor: "rgba(100, 65, 52, 0.19)",
                                               color: "#333333"
                                           }}/>
                    </div>
                </div>
            </div>
        </nav>
    )
};

export default Navbar;
