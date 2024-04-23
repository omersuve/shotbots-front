import React, {useEffect, useState} from "react";
import {useConnection, useWallet} from "@solana/wallet-adapter-react";
import styles from "./index.module.css";
import LineGraph from "../LineGraph"

const HomeBody: React.FC = ({children}) => {
    const {publicKey} = useWallet();
    const {connection} = useConnection();
    const [btcScore, setBtcScore] = useState();
    const [ethScore, setEthScore] = useState();
    const [nftScore, setNftScore] = useState();
    const [altScore, setAltScore] = useState();

    const [data, setData] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('/api/scores');
                const result = await response.json();
                if (response.ok) {
                    console.log(result)
                    setData(result);
                } else {
                    console.log("failed to fetch data")
                }
            } catch (err) {
                console.log("failed to fetch data")
            }
        }

        fetchData().then(r => {
        });
    }, []);

    return (
        <div>
            <div className={`${styles["news-count"]}`}>
                <div className={`${styles["news-box"]} shadow`}>
                    <h2 className="text-xl font-bold relative text-black mb-6 border-bottom">
                        News
                    </h2>
                    <table>
                        <thead></thead>
                        <tbody>
                        <tr>
                            <th className="text-black p-2 text-sm">Bitcoin</th>
                            <td className="text-black px-5 text-sm">4</td>
                        </tr>
                        <tr>
                            <th className="text-black p-2 text-sm">Ethereum</th>
                            <td className="text-black px-5 text-sm">2</td>
                        </tr>
                        <tr>
                            <th className="text-black p-2 text-sm">Solana</th>
                            <td className="text-black px-5 text-sm">6</td>
                        </tr>
                        <tr>
                            <th className="text-black p-2 text-sm">Runes</th>
                            <td className="text-black px-5 text-sm">3</td>
                        </tr>
                        <tr>
                            <th className="text-black p-2 text-sm">Ordinals</th>
                            <td className="text-black px-5 text-sm">4</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div className={`${styles["box-with-graph"]}`}>
                <div className={`${styles["box-container"]} shadow  `}>
                    <div className={`${styles["box"]} shadow`}>
                        <h3 className="text-xl font-bold relative text-black border-bottom">
                            Bitcoin
                        </h3>
                        <h6 className="font-bold relative text-black pt-4">
                            Todays score:{btcScore} 10
                        </h6>
                    </div>
                    <div className={`${styles["box"]} shadow`}>
                        <h3 className="text-xl font-bold relative text-black border-bottom">
                            Ethereum
                        </h3>
                        <h6 className="font-bold relative text-black pt-4">
                            Todays score:{ethScore} 10
                        </h6>
                    </div>
                    <div className={`${styles["box"]} shadow`}>
                        <h3 className="text-xl font-bold relative text-black border-bottom">
                            NFTs
                        </h3>
                        <h6 className="font-bold relative text-black pt-4">
                            Todays score:{nftScore} 10
                        </h6>
                    </div>
                    <div className={`${styles["box"]} shadow`}>
                        <h3 className="text-xl font-bold relative text-black border-bottom">
                            Altcoins
                        </h3>
                        <h6 className="font-bold relative text-black pt-4">
                            Todays score:{altScore} 10
                        </h6>
                    </div>
                </div>
                <div className={`${styles["graph-container"]} p-4 shadow`}>
                    <LineGraph/>
                </div>
            </div>
        </div>
    );
};

export default HomeBody;