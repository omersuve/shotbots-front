import clientPromise from "../../../lib/mongodb";
import {NextApiRequest, NextApiResponse} from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const client = await clientPromise;
        const db = client.db("news");
        const {userId, newsId} = req.body
        const vote = await db
            .collection("votes")
            .findOne({userId: userId, newsId: newsId});
        if (!vote) res.json({voted: false});
        else res.json({voted: true})
    } catch (e) {
        console.error(e);
    }
}