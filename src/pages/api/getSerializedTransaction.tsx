import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  success: boolean;
  transaction?: string;
  blockhashWithExpiryBlockHeight?: object;
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
    console.error("Missing parameters:", { quoteResponse, userPublicKey });
    return res
      .status(400)
      .json({ success: false, error: "Missing parameters" });
  }

  try {
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

    if (!swapData.swapTransaction || !swapData.lastValidBlockHeight) {
      return res.status(500).json({
        success: false,
        error: "Failed to create swap transaction",
      });
    }

    const { swapTransaction, lastValidBlockHeight } = swapData;

    // Include blockhash information
    const blockhashWithExpiryBlockHeight = {
      blockhash: swapData.blockhash,
      lastValidBlockHeight,
    };

    return res.status(200).json({
      success: true,
      transaction: swapTransaction,
      blockhashWithExpiryBlockHeight,
    });
  } catch (error) {
    console.error("Error creating transaction:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to create transaction" });
  }
}
