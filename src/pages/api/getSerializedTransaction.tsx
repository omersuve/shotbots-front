// pages/api/getSerializedTransaction.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { Connection, VersionedTransaction, PublicKey } from "@solana/web3.js";

type ResponseData = {
  success: boolean;
  transaction?: string;
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

  const { quoteResponse, userPublicKey } = req.body;

  if (!quoteResponse || !userPublicKey) {
    return res
      .status(400)
      .json({ success: false, error: "Missing parameters" });
  }

  try {
    const HELIUS_API_KEY = process.env.HELIUS_API_KEY!;
    const heliusConnection = new Connection(
      `https://rpc.helius.xyz?api-key=${HELIUS_API_KEY}`,
      "confirmed"
    );

    // Deserialize the swap transaction provided by the quote response
    const swapTransactionBuf = Buffer.from(
      quoteResponse.swapTransaction,
      "base64"
    );
    const transaction = VersionedTransaction.deserialize(swapTransactionBuf);

    // Create a public key object from the provided string
    const userPublicKeyObj = new PublicKey(userPublicKey);

    // Add a dummy signature for the user's public key (Uint8Array of zeroes)
    const signaturePlaceholder = new Uint8Array(64); // Length of Solana signatures is 64 bytes
    transaction.signatures.push(signaturePlaceholder);

    // Serialize the transaction for the client to sign
    const serializedTransaction = transaction.serialize();

    return res.status(200).json({
      success: true,
      transaction: Buffer.from(transaction.serialize()).toString("base64"),
    });
  } catch (error) {
    console.error("Error creating transaction:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to create transaction" });
  }
}
