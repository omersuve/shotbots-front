// pages/api/submitSignedTransaction.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { Connection, VersionedTransaction } from "@solana/web3.js";

type ResponseData = {
  success: boolean;
  txid?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, error: "Method not allowed" });
  }

  const { signedTransaction } = req.body;

  if (!signedTransaction) {
    return res
      .status(400)
      .json({ success: false, error: "Missing signed transaction" });
  }

  try {
    const HELIUS_API_KEY = process.env.HELIUS_API_KEY!;
    const heliusConnection = new Connection(
      `https://rpc.helius.xyz?api-key=${HELIUS_API_KEY}`,
      "confirmed"
    );

    // Deserialize the signed transaction
    const rawTransaction = Buffer.from(signedTransaction, "base64");
    const transaction = VersionedTransaction.deserialize(rawTransaction);

    // Send the signed transaction to the Solana network
    const txid = await heliusConnection.sendRawTransaction(rawTransaction, {
      skipPreflight: true,
      maxRetries: 2,
    });

    return res.status(200).json({
      success: true,
      txid,
    });
  } catch (error) {
    console.error("Error submitting transaction:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to submit transaction" });
  }
}
