import clientPromise from "../../../lib/mongodb";
import {NextApiRequest, NextApiResponse} from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const client = await clientPromise;
        console.log("db connected")
        const db = client.db("news");
        const news = await db
            .collection("tweets")
            .find({})
            .toArray();
        res.json(news);
    } catch (e) {
        console.error(e);
    }
}