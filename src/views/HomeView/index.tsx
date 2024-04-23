import {FC, useEffect, useState} from "react";
import Navbar from "../../components/Navbar";
import HomeBody from "../../components/HomeBody";
import {useWallet} from "@solana/wallet-adapter-react";

export const HomeView: FC = ({}) => {
    const {publicKey} = useWallet();

    return (
        <div className="container mx-auto p-4 2xl:px-0">
            <Navbar/>
            <HomeBody/>
        </div>
    );
};
