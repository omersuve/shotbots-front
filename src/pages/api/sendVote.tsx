import clientPromise from "../../../lib/mongodb";
import {NextApiRequest, NextApiResponse} from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const client = await clientPromise;
        const db = client.db("news");
        const myPost = await db
            .collection("votes")
            .insertOne(req.body);
        res.json(myPost);
    } catch (e) {
        console.error(e);
    }
}