import { NextApiRequest, NextApiResponse } from "next";
import { Connection, VersionedTransaction } from "@solana/web3.js";

const connection = new Connection(
  "https://neat-hidden-sanctuary.solana-mainnet.discover.quiknode.pro/2af5315d336f9ae920028bbb90a73b724dc1bbed/"
);

type swapRequest = {
  inputMint: string;
  outputMint: string;
  slipagge: string;
  amount: string;
  signTransaction: any;
  pk: any;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // requestte token addressi kullanicinin publick keyi, miktar, slipaj

    const requestBody: swapRequest = req.body;

    // Swapping SOL to USDC with input 0.1 SOL and 0.5% slippage
    const quote = await fetch(
      `https://quote-api.jup.ag/v6/quote?inputMint=${requestBody.inputMint}\
        &outputMint=${requestBody.outputMint}\
        &amount=${requestBody.amount}\
        &slippageBps=${requestBody.slipagge}`
    );
    const quoteResponse = await quote.json();
    console.log({ quoteResponse });

    // get serialized transactions for the swap

    const swap = await fetch("https://quote-api.jup.ag/v6/swap", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // quoteResponse from /quote api
        quoteResponse,
        // user public key to be used for the swap
        userPublicKey: requestBody.pk,
        // auto wrap and unwrap SOL. default is true
        wrapAndUnwrapSol: true,
        // feeAccount is optional. Use if you want to charge a fee.  feeBps must have been passed in /quote API.
        // feeAccount: "fee_account_public_key"
      }),
    });

    const { swapTransaction } = await swap.json();

    // deserialize the transaction
    const swapTransactionBuf = Buffer.from(swapTransaction, "base64");
    var transaction = VersionedTransaction.deserialize(swapTransactionBuf);
    console.log(transaction);

    // sign the transaction
    // transaction.sign([w]);

    requestBody.signTransaction(transaction);

    // get the latest block hash
    const latestBlockHash = await connection.getLatestBlockhash();

    // Execute the transaction
    const rawTransaction = transaction.serialize();
    const txid = await connection.sendRawTransaction(rawTransaction, {
      skipPreflight: true,
      maxRetries: 2,
    });
    await connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: txid,
    });
    console.log(`https://solscan.io/tx/${txid}`);
  } catch (e: any) {
    console.log(e);
  }
};
