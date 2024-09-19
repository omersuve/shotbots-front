export const setWalletCookie = async (walletAddress: string) => {
  await fetch("/api/setWalletAddress", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ walletAddress }),
  });
};
