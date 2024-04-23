import {FC, useEffect, useState} from "react";
import Navbar from "../../components/Navbar";
import HomeBody from "../../components/HomeBody";
import {useWallet} from "@solana/wallet-adapter-react";

export const HomeView: FC = ({}) => {
    const {publicKey} = useWallet();

    return (
        <div className="mt-20">
            <Navbar/>
            <HomeBody/>
        </div>
    );
};
