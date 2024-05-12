import React, { useEffect, useState } from "react";
import parse from "html-react-parser";
import styles from "./index.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { isAlreadyVotedRequest, sendVoteBody } from "../../types";
import { useWallet } from "@solana/wallet-adapter-react";
import { ObjectId } from "mongodb";
import { toast } from "react-toastify";


interface NewsCardProps {
    id: ObjectId;
    title: string;
    isOpen: boolean;
}

function NewsCard({ id, title, isOpen }: NewsCardProps) {
    const [vote, setVote] = useState(0);
    const [voted, setVoted] = useState<boolean>();
    const { publicKey } = useWallet();


    useEffect(() => {
        isAlreadyVoted().then((r) => {
            setVoted(r);
        });
    }, [publicKey]);

    async function isAlreadyVoted(): Promise<boolean> {
        try {
            if (!publicKey) return false;
            const body: isAlreadyVotedRequest = {
                userId: publicKey.toString(),
                newsId: id,
            };
            const request = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            };
            const response = await fetch("/api/isAlreadyVoted", request);
            if (response.ok) {
                const res = await response.json();
                return res.voted;
            } else {
                console.log("failed to fetch vote");
                return false;
            }
        } catch (err) {
            console.log("failed to fetch vote");
            return false;
        }
    }

    async function handleVote() {
        // send the vote, news id and user id to database
        try {
            if (!publicKey) {
                toast("No Public Key found!");
                return;
            }
            const body: sendVoteBody = {
                userId: publicKey.toString(),
                newsId: id,
                vote: vote,
            };
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            };
            const response = await fetch("/api/sendVote", requestOptions);
            const result = await response.json();
            if (response.ok) {
                console.log("successfully sent vote");
                setVoted(true);
            } else {
                console.log("failed to send vote");
            }
        } catch (err) {
            console.log("failed to send vote");
        }
    }

    return (
        <div className={`${styles["box"]} shadow`}>
            <h3 className="relative text-black">
                {parse(title)}
            </h3>
            <div className={styles["toggle-btn"]}>
                {isOpen &&
                  <FontAwesomeIcon
                    icon={faArrowRight as IconProp}
                    className="fa-l" />
                }
            </div>
        </div>
    );
}

export default NewsCard;