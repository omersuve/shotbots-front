import clientPromise from "../../../lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const client = await clientPromise;

    // Only allow GET requests
    if (req.method !== "GET") {
      return res.status(405).json({ message: "Only GET method is allowed" });
    }

    const { wallet_address } = req.query;

    // Check if wallet address is provided
    if (!wallet_address) {
      return res
        .status(400)
        .json({ success: false, message: "Missing wallet address" });
    }

    const db = client.db("user");
    const users = db.collection("referral");

    // Find the user by wallet address
    const user = await users.findOne({ wallet_address });

    // If user is not found, return a 404 error
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Return the user's referral code
    return res.status(200).json({
      success: true,
      referral_code: user.referral_code,
    });
  } catch (error) {
    console.error("Error fetching referral code:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
