import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb";

type MemeVote = {
    _id: string;
    baseAddress: string;
    downVote: number;
    upVote: number;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const client = await clientPromise;
        const db = client.db("votes");

        // Fetch all records from the meme-votes collection
        const memeVotes = await db.collection("meme-votes").find({}).toArray();

        // Send the response with the memeVotes data
        res.status(200).json(memeVotes);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
