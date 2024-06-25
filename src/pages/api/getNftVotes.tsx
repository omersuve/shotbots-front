import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb";

type NftVote = {
    _id: string;
    baseAddress: string;
    downVote: number;
    upVote: number;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const client = await clientPromise;
        const db = client.db("votes");
        const { pk } = req.body;

        // Fetch all records from the meme-votes collection
        const nftVotes = await db.collection("nft-votes").find({}).toArray();
        const userVotes = await db.collection("user-votes").find({ userId: pk }).toArray();

        // Send the response with the memeVotes data
        res.status(200).json({ nftVotes: nftVotes, userVotes: userVotes });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
