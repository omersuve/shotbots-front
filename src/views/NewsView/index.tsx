import {FC} from "react";

import {SolanaLogo} from "components";
import styles from "./index.module.css";
import Navbar from "../../components/Navbar";

export const NewsView: FC = ({}) => {
    return (
        <div className="mt-20">
            <Navbar/>
            <div className={styles.container}>
                <div className="text-center pt-2">
                    <div className="hero min-h-16 py-4">
                        <div className="text-center hero-content">
                            <div className="max-w-lg">
                                <h1 className="mb-5 text-3xl font-bold">
                                    Hello Solana <SolanaLogo/> World!
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
