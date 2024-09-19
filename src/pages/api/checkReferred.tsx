import clientPromise from "../../../lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await clientPromise;
  const db = client.db("user");
  const users = db.collection("referral");

  const { wallet_address } = req.query;

  try {
    const user = await users.findOne({ wallet_address });

    if (user) {
      return res
        .status(200)
        .json({ isReferred: true, referrals_count: user.referrals_count });
    }

    return res.status(200).json({ isReferred: false });
  } catch (error) {
    console.error("Error checking referral status:", error);
    return res.status(500).json({ isReferred: false });
  }
};
