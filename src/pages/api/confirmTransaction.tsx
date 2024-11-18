// import type { NextApiRequest, NextApiResponse } from "next";
// import {
//   Connection,
//   RpcResponseAndContext,
//   SignatureResult,
// } from "@solana/web3.js";

// type ResponseData = {
//   success: boolean;
//   confirmed?: boolean;
//   error?: string;
// };

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<ResponseData>
// ) {
//   if (req.method !== "POST") {
//     return res
//       .status(405)
//       .json({ success: false, error: "Method not allowed" });
//   }

//   const { txid } = req.body;

//   if (!txid) {
//     return res
//       .status(400)
//       .json({ success: false, error: "Missing transaction ID" });
//   }

//   try {
//     const HELIUS_API_KEY = process.env.HELIUS_API_KEY!;
//     const heliusConnection = new Connection(
//       `https://rpc.helius.xyz?api-key=${HELIUS_API_KEY}`,
//       {
//         commitment: "confirmed",
//         confirmTransactionInitialTimeout: 10 * 1000,
//       }
//     );

//     // Step 3: Get the latest block hash and block height
//     const latestBlockhash = await heliusConnection.getLatestBlockhash();
//     console.log(`Blockhash retrieved at: ${new Date().toISOString()}`);

//     // Step 4: Confirm the transaction
//     const confirmStartTime = Date.now();
//     const confirmation: RpcResponseAndContext<SignatureResult> =
//       await heliusConnection.confirmTransaction(
//         {
//           signature: txid,
//           blockhash: latestBlockhash.blockhash,
//           lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
//         },
//         "confirmed"
//       );

//     console.log(
//       `Transaction confirmed at: ${new Date().toISOString()} (Elapsed: ${
//         Date.now() - confirmStartTime
//       }ms)`
//     );

//     if (confirmation.value.err) {
//       throw new Error(
//         `Transaction confirmation failed: ${JSON.stringify(
//           confirmation.value.err
//         )}`
//       );
//     }

//     return res.status(200).json({
//       success: true,
//       confirmed: true,
//     });
//   } catch (error) {
//     console.error("Error confirming transaction:", error);
//     return res
//       .status(500)
//       .json({ success: false, error: "Failed to confirm transaction" });
//   }
// }
