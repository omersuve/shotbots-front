import clientPromise from "../../../lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const client = await clientPromise;
        const db = client.db("votes");
        const { pk, baseAddress, vote } = req.body;

        // Check if the user has already voted for this baseAddress
        const userVote = await db.collection("user-votes").findOne({ userId: pk, baseAddress: baseAddress });

        if (userVote) {
            return res.status(400).json({ error: "User has already voted for this base address." });
        }

        // Define the update operation based on the vote type
        const update = vote === "upvote"
          ? { $inc: { upVote: 1 }, $setOnInsert: { downVote: 0 } }
          : { $inc: { downVote: 1 }, $setOnInsert: { upVote: 0 } };

        // Perform the update operation with upsert set to true
        await db
          .collection("nft-votes")
          .updateOne(
            { baseAddress: baseAddress },
            update,
            { upsert: true },
          );

        // Add a record to the user-votes collection
        await db.collection("user-votes").insertOne({
            userId: pk,
            baseAddress: baseAddress,
            vote: vote,
            timestamp: new Date(),
        });

        // Fetch the updated or inserted document
        const myVotes = await db
          .collection("nft-votes")
          .find({ baseAddress: baseAddress })
          .toArray();

        res.json(myVotes);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
