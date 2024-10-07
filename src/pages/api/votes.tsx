import clientPromise from "../../../lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const client = await clientPromise;
    const db = client.db("votes");
    const { pk } = req.body;
    const myVotes = await db
      .collection("asset-votes")
      .find({ userId: pk })
      .toArray();
    res.json(myVotes);
  } catch (e) {
    console.error(e);
  }
};
