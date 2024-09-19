import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  const { walletAddress } = req.body;

  if (!walletAddress) {
    return res
      .status(400)
      .json({ success: false, message: "Missing wallet address" });
  }

  // Set the wallet_address in a cookie
  res.setHeader(
    "Set-Cookie",
    `wallet_address=${walletAddress}; Path=/; HttpOnly; Secure; SameSite=Lax`
  );

  return res.status(200).json({ success: true });
}
