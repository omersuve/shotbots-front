import type { NextApiRequest, NextApiResponse } from "next";
import { Connection, PublicKey } from "@solana/web3.js";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { walletAddress } = req.body;

  if (!walletAddress) {
    return res.status(400).json({ error: "Missing walletAddress" });
  }

  try {
    const connection = new Connection(
      `https://rpc.helius.xyz?api-key=${process.env.HELIUS_API_KEY!}`,
      "confirmed"
    );

    // Fetch all token accounts owned by the wallet in one request
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
      new PublicKey(walletAddress),
      {
        programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
      } // SPL Token Program ID
    );

    // If no token accounts are found
    if (tokenAccounts.value.length === 0) {
      return res.status(200).json({
        balances: [],
        message: "No token accounts found for this wallet.",
      });
    }

    // Extract balances and mint addresses in a single operation
    const balances = tokenAccounts.value.map((account) => {
      const parsedInfo = account.account.data.parsed.info;
      return {
        mint: parsedInfo.mint,
        balance: parsedInfo.tokenAmount.uiAmount || 0,
      };
    });

    res.status(200).json({ balances });
  } catch (error) {
    console.error("Error fetching token accounts:", error);
    res.status(500).json({ error: "Failed to fetch token accounts." });
  }
}
