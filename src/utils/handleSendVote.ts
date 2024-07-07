import { SendVoteBody } from "../types";
import { toast } from "react-toastify";

export async function handleSendVote(assetId: string, vote: number, tag: string, publicKey: string | null) {
    try {
        if (!publicKey) {
            toast("No Public Key found!");
            return;
        }

        const body: SendVoteBody = {
            userId: publicKey,
            assetId: assetId,
            vote: vote,
            tag: tag,
            timestamp: new Date().toDateString(), // TODO: check it later
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
            // console.log("successfully sent vote");
            toast("Voted Successfully!");
            return vote;
        } else {
            console.log("failed to send vote");
        }
    } catch (err) {
        console.log("failed to send vote");
    }
}
