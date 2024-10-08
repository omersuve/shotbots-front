import type { NextApiRequest, NextApiResponse } from "next";
import { Connection, TransactionSignature } from "@solana/web3.js";

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
    const startTime = Date.now(); // Track start time of the entire function
    console.log(`Request received at: ${new Date(startTime).toISOString()}`);

    const HELIUS_API_KEY = process.env.HELIUS_API_KEY!;
    const heliusConnection = new Connection(
      `https://rpc.helius.xyz?api-key=${HELIUS_API_KEY}`,
      {
        commitment: "confirmed",
        confirmTransactionInitialTimeout: 10 * 1000, // 10 seconds initial timeout
      }
    );

    console.log(
      `Connection to RPC established at: ${new Date(
        Date.now()
      ).toISOString()} (Elapsed: ${Date.now() - startTime}ms)`
    );

    // Step 1: Convert the Buffer to Uint8Array
    const transactionStartTime = Date.now();
    const rawTransaction = Buffer.from(signedTransaction, "base64");
    console.log(
      `Transaction converted at: ${new Date(
        Date.now()
      ).toISOString()} (Elapsed: ${Date.now() - transactionStartTime}ms)`
    );

    // Step 2: Send the signed transaction to the Solana network
    const sendStartTime = Date.now();
    const txid: TransactionSignature =
      await heliusConnection.sendRawTransaction(rawTransaction, {
        skipPreflight: true,
        maxRetries: 2,
      });
    console.log(
      `Transaction sent at: ${new Date(Date.now()).toISOString()} (Elapsed: ${
        Date.now() - sendStartTime
      }ms)`
    );

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
