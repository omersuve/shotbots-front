import clientPromise from "../../../lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

// Function to generate a unique referral code
async function generateUniqueReferralCode(usersCollection: any) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let unique = false;
  let referralCode = "";

  while (!unique) {
    referralCode = "";
    for (let i = 0; i < 6; i++) {
      referralCode += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }

    // Check if the code already exists
    const existingCode = await usersCollection.findOne({
      referral_code: referralCode,
    });
    if (!existingCode) {
      unique = true;
    }
  }
  return referralCode;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const client = await clientPromise;

    if (req.method !== "POST") {
      return res.status(405).json({ message: "Only POST method is allowed" });
    }

    const { wallet_address, referral_code } = req.body;

    if (!wallet_address || !referral_code) {
      return res.status(400).json({ success: false, message: "Missing data" });
    }

    const db = client.db("user");
    const users = db.collection("referral");

    const trimmedReferralCode = referral_code.trim();
    // Case-insensitive query
    const referrer = await users.findOne({
      referral_code: { $regex: new RegExp(`^${trimmedReferralCode}$`, "i") },
    });
    if (!referrer) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid referral code" });
    }

    // Check if the wallet is already registered
    const existingUser = await users.findOne({ wallet_address });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Wallet already registered" });
    }

    // Check if the referral code already has a wallet associated (i.e., it's not an initial code)
    if (referrer.wallet_address === null) {
      // If wallet_address is null, set the wallet and exit without creating a new referral code
      await users.updateOne(
        { referral_code },
        {
          $set: {
            wallet_address: wallet_address, // Set the wallet address
          },
        }
      );
      return res.status(200).json({
        success: true,
        message: "Referral successful, wallet assigned.",
      });
    }

    // Generate a new unique referral code for the new user
    const newReferralCode = await generateUniqueReferralCode(users);

    // Register new user
    const newUser = {
      wallet_address: wallet_address,
      referred_by: referral_code,
      referral_code: newReferralCode, // They can't generate their referral code yet
      referrals_count: 0,
      created_at: new Date(),
    };

    await users.insertOne(newUser);

    // Increment referrer's referral count
    await users.updateOne({ referral_code }, { $inc: { referrals_count: 1 } });

    res.status(200).json({
      success: true,
      message: "Referral successful",
      referral_code: newReferralCode,
    });
  } catch (error) {
    console.error("Error in referral code submission:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
