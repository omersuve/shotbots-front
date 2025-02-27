import clientPromise from "../../../lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

type RequestBody = {
    type: string;
    vote: number;
    assetId: string;
    userId: string;
    timestamp: string;
    tag: string;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const client = await clientPromise;
        const db = client.db("votes");
        const requestBody: RequestBody = req.body;
        const myPost = await db
            .collection("asset-votes")
            .insertOne(requestBody);
        res.json(myPost);
    } catch (e) {
        console.error(e);
    }
}