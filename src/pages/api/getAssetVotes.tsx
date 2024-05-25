import clientPromise from "../../../lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const client = await clientPromise;
        const db = client.db("votes");
        const { type, assetId } = req.body;
        const votes = await db
            .collection("asset-votes")
            .find({ assetId: assetId })
            .toArray();
        res.json(votes);
    } catch (e) {
        console.error(e);
    }
}