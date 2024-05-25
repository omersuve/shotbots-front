import clientPromise from "../../../lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const client = await clientPromise;
        const db = client.db("votes");
        const { pk, type } = req.body;
        const myVotes = await db
            .collection(type)
            .find({ userId: pk, type: type })
            .toArray();
        res.json(myVotes);
    } catch (e) {
        console.error(e);
    }
}