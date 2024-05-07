import clientPromise from "../../../lib/mongodb";
import {NextApiRequest, NextApiResponse} from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const client = await clientPromise;
        const db = client.db("Insights");
        const scores = await db
            .collection("Scores")
            .find({})
            .toArray();
        res.json(scores);
    } catch (e) {
        console.error(e);
    }
}