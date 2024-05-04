import React, {FC, useEffect, useState} from "react";
import {useConnection, useWallet} from "@solana/wallet-adapter-react";
import styles from "./index.module.css";
import LineGraph from "../../components/LineGraph"
import ScoreCard from "../../components/ScoreCard";

export const HomeView: FC = ({}) => {
    const {publicKey} = useWallet();
    const {connection} = useConnection();
    const [btcScore, setBtcScore] = useState();
    const [ethScore, setEthScore] = useState();
    const [nftScore, setNftScore] = useState();
    const [altScore, setAltScore] = useState();

    const [scores, setScores] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('/api/scores');
                const result = await response.json();
                if (response.ok) {
                    setScores(result);
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
        <div className={`${styles["box-with-graph"]} flex flex-col items-center mt-24`}>
            <div className={`${styles["box-container"]} shadow`}>
                <ScoreCard score={0.7 * 10} tag={'Bitcoin'}/>
                <ScoreCard score={0.6 * 10} tag={'Ethereum'}/>
                <ScoreCard score={0.5 * 10} tag={'Solana'}/>
                <ScoreCard score={0.2 * 10} tag={'NFTs'}/>
            </div>
            <div className={`${styles["graph-container"]} p-4 shadow`}
                 style={{width: 'fit-content'}}>
                <LineGraph/>
            </div>
        </div>
    );
};
