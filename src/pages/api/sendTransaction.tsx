import type { NextApiRequest, NextApiResponse } from "next";
import { createRpcConnection } from "utils/createRpcConnection";
import { transactionSenderAndConfirmationWaiter } from "utils/transactionSender";

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

  const { signedTransaction, blockhashWithExpiryBlockHeight } = req.body;

  if (!signedTransaction || !blockhashWithExpiryBlockHeight) {
    return res.status(400).json({
      success: false,
      error: "Missing signed transaction or blockhash information",
    });
  }

  try {
    const startTime = Date.now();
    console.log(`Request received at: ${new Date(startTime).toISOString()}`);

    const connectionStartTime = Date.now();
    const connection = createRpcConnection();
    console.log(
      `[Time: ${Date.now() - connectionStartTime}ms] RPC connection established`
    );

    console.log(
      `Connection to RPC established at: ${new Date(
        Date.now()
      ).toISOString()} (Elapsed: ${Date.now() - startTime}ms)`
    );

    const transactionStartTime = Date.now();
    const txResponse = await transactionSenderAndConfirmationWaiter({
      connection: connection,
      serializedTransaction: Buffer.from(signedTransaction, "base64"),
      blockhashWithExpiryBlockHeight,
    });
    console.log(
      `[Time: ${
        Date.now() - transactionStartTime
      }ms] Transaction sent and confirmed`
    );

    if (!txResponse) {
      console.warn(
        `[Total Time: ${
          Date.now() - startTime
        }ms] Transaction expired before confirmation`
      );
      return res.status(500).json({
        success: false,
        error: "Transaction expired before confirmation",
      });
    }

    console.log(
      `[Total Time: ${
        Date.now() - startTime
      }ms] Transaction successfully confirmed: ${txResponse}`
    );
    res.status(200).json({ success: true, txid: txResponse });
  } catch (error) {
    console.error(
      `[Total Time: ${Date.now() - Date.now()}ms] Error during transaction:`,
      error
    );
    res.status(500).json({ success: false, error: "Transaction failed" });
  }
}
