import React, {useEffect, useState} from "react";
import {useConnection, useWallet} from "@solana/wallet-adapter-react";

const HomeBody: React.FC = ({children}) => {
    const {publicKey} = useWallet();
    const {connection} = useConnection();
    const [btcScore, setBtcScore] = useState();
    const [ethScore, setEthScore] = useState();
    const [nftScore, setNftScore] = useState();
    const [altScore, setAltScore] = useState();

    return (
        <div className="text-center pt-2 min-w-screen-lg">
            <div className="inline-flex flex-wrap justify-center items-center">
                <div className="text-left mr-20">
                    <h3 className="text-xl font-bold relative">
                        Bitcoin
                    </h3>
                    <h4>{btcScore}</h4>
                </div>
                <div className="text-left mr-20">
                    <h3 className="text-xl font-bold relative">
                        Ethereum
                    </h3>
                    <h4>{ethScore}</h4>
                </div>
                <div className="text-left mr-20">
                    <h3 className="text-xl font-bold relative">
                        NFTs
                    </h3>
                    <h4>{nftScore}</h4>
                </div>
                <div className="text-left mr-20">
                    <h3 className="text-xl font-bold relative">
                        Altcoins
                    </h3>
                    <h4>{altScore}</h4>
                </div>
            </div>

        </div>
    );
};

export default HomeBody;