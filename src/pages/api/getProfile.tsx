import clientPromise from "../../../lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        // Check if the request method is POST
        if (req.method !== "POST") {
            return res.status(405).json({ error: "Method not allowed. Only POST requests are allowed." });
        }

        const { publicKey } = req.body;

        const client = await clientPromise;
        const db = client.db("user");

        // Check if profile exists
        let profile = await db.collection("profile").findOne({ publicKey });

        if (!profile) {
            // Insert profile if it doesn't exist
            await db.collection("profile").insertOne({
                publicKey,
                points: 0,
                win: 0,
                lose: 0,
                pointBoost: 1,
                votingPower: 1,
                createdAt: new Date(),
            });
            profile = await db.collection("profile").findOne({ publicKey });
        }

        res.json(profile);

    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Internal Server Error" });
    }
}