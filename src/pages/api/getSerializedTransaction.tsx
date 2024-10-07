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
  console.log("Received request with body:", req.body);
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, error: "Method not allowed" });
  }

  const { quoteResponse, userPublicKey } = req.body;
  console.log(
    "Parameters received - quoteResponse:",
    quoteResponse,
    "userPublicKey:",
    userPublicKey
  );

  if (!quoteResponse || !userPublicKey) {
    console.error("Missing parameters:", { quoteResponse, userPublicKey });
    return res
      .status(400)
      .json({ success: false, error: "Missing parameters" });
  }

  try {
    console.log(
      "Attempting to create transaction with quoteResponse:",
      quoteResponse
    );

    // Make a request to Jupiter's /swap endpoint to create a serialized transaction
    const swapResponse = await fetch("https://quote-api.jup.ag/v6/swap", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quoteResponse,
        userPublicKey, // User's public key to include in the swap
        wrapAndUnwrapSol: true, // Optional: auto wrap and unwrap SOL during the swap
      }),
    });

    const swapData = await swapResponse.json();
    console.log("Response from Jupiter API:", swapData);

    if (!swapData.swapTransaction) {
      console.error("No swap transaction received:", swapData);
      return res.status(500).json({
        success: false,
        error: "Failed to create swap transaction",
      });
    }

    const swapTransaction = swapData.swapTransaction;

    return res.status(200).json({
      success: true,
      transaction: swapTransaction,
    });
  } catch (error) {
    console.error("Error creating transaction:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to create transaction" });
  }
}
