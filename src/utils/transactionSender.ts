import {
  Connection,
  TransactionSignature,
  BlockhashWithExpiryBlockHeight,
  TransactionExpiredBlockheightExceededError,
} from "@solana/web3.js";
import promiseRetry from "promise-retry";

export const wait = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));

export async function transactionSenderAndConfirmationWaiter({
  connection,
  serializedTransaction,
  blockhashWithExpiryBlockHeight,
}: {
  connection: Connection;
  serializedTransaction: Buffer;
  blockhashWithExpiryBlockHeight: BlockhashWithExpiryBlockHeight;
}): Promise<string | null> {
  const SEND_OPTIONS = {
    skipPreflight: true,
  };

  const startTime = Date.now();

  // Step 1: Send the raw transaction
  const sendStartTime = Date.now();
  const txid: TransactionSignature = await connection.sendRawTransaction(
    serializedTransaction,
    SEND_OPTIONS
  );
  console.log(
    `[Time: ${Date.now() - sendStartTime}ms] Transaction sent. TXID: ${txid}`
  );

  const controller = new AbortController();
  const abortSignal = controller.signal;

  const abortableResender = async () => {
    while (true) {
      await wait(4_000);
      if (abortSignal.aborted) return;
      try {
        await connection.sendRawTransaction(
          serializedTransaction,
          SEND_OPTIONS
        );
        console.log("[Resend] Transaction resent successfully");
      } catch (e) {
        console.warn(`[Resend] Failed to resend transaction: ${e}`);
      }
    }
  };

  try {
    abortableResender();

    const lastValidBlockHeight =
      blockhashWithExpiryBlockHeight.lastValidBlockHeight - 150;

    // Step 2: Confirm the transaction or poll for status
    const confirmStartTime = Date.now();
    await Promise.race([
      connection.confirmTransaction(
        {
          signature: txid,
          blockhash: blockhashWithExpiryBlockHeight.blockhash,
          lastValidBlockHeight,
        },
        "confirmed"
      ),
      new Promise<void>((resolve, reject) => {
        const interval = setInterval(async () => {
          if (abortSignal.aborted) {
            clearInterval(interval);
            reject(new Error("Confirmation aborted"));
          }

          const status = await connection.getSignatureStatus(txid);
          if (status?.value?.confirmationStatus === "confirmed") {
            clearInterval(interval);
            resolve();
          }
        }, 2_000);
      }),
    ]);
    console.log(
      `[Time: ${Date.now() - confirmStartTime}ms] Transaction confirmed`
    );
  } catch (e) {
    if (e instanceof TransactionExpiredBlockheightExceededError) {
      console.warn(
        `[Time: ${
          Date.now() - startTime
        }ms] Transaction expired before confirmation`
      );
      return null;
    } else {
      throw e;
    }
  } finally {
    controller.abort();
  }

  // Step 3: Retrieve the transaction details
  const retrievalStartTime = Date.now();
  const response = await promiseRetry(
    async (retry) => {
      const tx = await connection.getTransaction(txid, {
        commitment: "confirmed",
        maxSupportedTransactionVersion: 0,
      });
      if (!tx) retry(new Error("Transaction not found"));
      return tx;
    },
    { retries: 5, minTimeout: 1_000 }
  );
  console.log(
    `[Time: ${Date.now() - retrievalStartTime}ms] Transaction details retrieved`
  );

  console.log(
    `[Total Time: ${
      Date.now() - startTime
    }ms] Transaction completed successfully`
  );
  return response?.transaction.signatures[0] || null;
}
